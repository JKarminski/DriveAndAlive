package com.example.driveandalive.ui.game

import com.example.driveandalive.database.entities.VehicleStats
import com.example.driveandalive.network.CurrentWeather
import org.jbox2d.collision.shapes.ChainShape
import org.jbox2d.collision.shapes.CircleShape
import org.jbox2d.collision.shapes.PolygonShape
import org.jbox2d.common.Vec2
import org.jbox2d.dynamics.*
import org.jbox2d.dynamics.joints.RevoluteJointDef
import org.jbox2d.dynamics.joints.WheelJoint
import org.jbox2d.dynamics.joints.WheelJointDef
import kotlin.math.*

/** Rodzaje map – każda ma własną funkcję generowania terenu jako fallback */
enum class MapType {
    PRAIRIE,      // lekkie pagórki (domyślna)
    MOUNTAINS,    // strome góry
    ARCTIC,       // ślisko + pagórki
    JUNGLE,       // gęste falowania
    SINUSOIDA     // czysta sinusoida testowa
}

/** Definiuje strukturalny składnik terenu wczytywany z pliku JSON */
data class TerrainLayer(
    val type: String,
    val amplitude: Float,
    val frequency: Float
)

class GameEngine(
    private val stats: VehicleStats,
    private val weather: CurrentWeather?,
    val mapType: MapType = MapType.PRAIRIE,
    /** Opcjonalna warstwowa mapa (z pliku JSON) */
    val terrainLayers: List<TerrainLayer>? = null,
    /** Szerokość ekranu w pikselach – potrzebna do sinusoidy */
    val screenWidthPx: Float = 1080f,
    /** Wysokość ekranu w pikselach – potrzebna do sinusoidy */
    val screenHeightPx: Float = 2400f
) {

    companion object {
        const val TICK_MS = 16L

        // ─── Skala świata Box2D ───────────────────────────────────────────
        // 1 metr Box2D = PTM pikseli ekranu (pixels-to-meter)
        const val PTM = 80f          // 80 px = 1 m  →  ekran ~13,5 m szeroki

        // Teren: odległość między werteksami łańcucha (w metrach Box2D)
        const val TERRAIN_STEP_M = 0.5f

        // Ile punktów terenu trzymamy w buforze
        const val TERRAIN_BUFFER = 600

        // Nowe punkty generujemy gdy auto jest bliżej niż tyle punktów od końca
        const val TERRAIN_AHEAD = 200

        const val COIN_SPACING = 8f       // metry Box2D między monetami

        // Współczynniki pojazdów (Zredukowane aby nie latały od razu w kosmos)
        fun engineToTorque(level: Int)    = 40f   + level * 20f
        fun engineToMaxSpeed(level: Int)  = 20f   + level * 8f    // m/s (Box2D)
        fun gripToFriction(level: Int)    = 0.9f  + level * 0.05f
        fun fuelLevelToCapacity(level: Int) = 100f + level * 50f
    }

    // ─── Świat Box2D ─────────────────────────────────────────────────────
    val world = World(Vec2(0f, -20f))   // grawitacja −20 m/s² (agresywna)

    // ─── Ciała fizyczne ──────────────────────────────────────────────────
    lateinit var chassisBody: Body      // nadwozie
    lateinit var frontWheelBody: Body
    lateinit var rearWheelBody: Body
    lateinit var frontWheelJoint: WheelJoint
    lateinit var rearWheelJoint: WheelJoint

    // ─── Teren ───────────────────────────────────────────────────────────
    /** Lista punktów terenu (Y w metrach Box2D, X = index * TERRAIN_STEP_M) */
    val terrainPoints = mutableListOf<Float>()
    private var terrainBody: Body? = null
    private var nextTerrainIdx = 0           // następny indeks do dodania

    // ─── Monety i Paliwo ──────────────────────────────────────────────────────────
    val coinPositions = mutableSetOf<Float>()  // X w metrach Box2D
    private var nextCoinX = COIN_SPACING
    
    val fuelPositions = mutableSetOf<Float>()
    private var nextFuelX = 500f // pojawia się równo co 500 metrów realnych w grze

    // ─── Stan gry ────────────────────────────────────────────────────────
    var fuel       = fuelLevelToCapacity(stats.fuelLevel)
    var health     = 1.0f
    var coins      = 0
    var isGameOver = false
    var endReason  = "fuel"
    var maxSpeedMs = 0f
    var gearChanges = 0
    var currentGear = 1
    var isAutoGearbox = false
    var hasNitro   = false
    var hasShield  = false
    var hasMagnet  = false
    var isNitroActive = false

    var gasPressed     = false
    var reversePressed = false

    val fuelCapacity   = fuelLevelToCapacity(stats.fuelLevel)
    val maxTorque      = engineToTorque(stats.engineLevel)
    val maxSpeedLimit  = engineToMaxSpeed(stats.engineLevel)
    val wheelFriction  = gripToFriction(stats.gripLevel) * (weather?.gripModifier ?: 1f)

    // Parametry biegów: index 0 to neutralny (nieużywany), 1-5 to biegi w grze
    private val gearSpeedMultipliers = floatArrayOf(0f, 0.35f, 0.55f, 0.75f, 0.90f, 1.0f)
    private val gearTorqueMultipliers = floatArrayOf(0f, 1.5f, 1.0f, 0.7f, 0.5f, 0.35f)
    private val gearFuelMultipliers = floatArrayOf(0f, 2.0f, 1.5f, 1.2f, 1.0f, 0.8f) // Mniejsze spalanie wejdzie dla wyższych biegów

    private val random = java.util.Random(42)

    // ─── Sinusoida: konwersja parametrów ─────────────────────────────────
    // Wysokość środka ekranu w metrach Box2D (oś Y w górę)
    // Ekran: top = screenHeightPx / PTM.  Środek ekranu = screenHeightPx / 2 / PTM
    // Teren leży "na środku ekranu" gdy Y_Box2D ≈ screenHeightPx/2/PTM
    private val screenHeightM  get() = screenHeightPx / PTM   // ~30 m
    private val screenWidthM   get() = screenWidthPx  / PTM   // ~13.5 m

    // Środek Y w metrach Box2D (kamera będzie tu wycentrowana na aucie)
    // Ustawiamy absolutną wartość Y terenu tak, żeby auto w spoczynku
    // pojawiało się na wysokości 55% ekranu od góry.
    private val baseTerrainY   get() = screenHeightM * 0.30f  // "poziom 0" terenu

    // Amplituda sinusoidy: 10% od góry / dołu → 80% ampitudy ekranu / 2
    private val sinAmplitude  get() = screenHeightM * 0.40f   // od środka do szczytu

    // Jeden okres = szerokość ekranu
    private val sinPeriodM    get() = screenWidthM

    // ─── Init ─────────────────────────────────────────────────────────────
    init {
        generateTerrain(TERRAIN_BUFFER)
        buildTerrainBody()
        buildCar()
        spawnItems()
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Generowanie terenu
    // ═══════════════════════════════════════════════════════════════════════

    private fun terrainYAt(idx: Int): Float {
        val x = idx * TERRAIN_STEP_M
        
        // Jeśli posiadamy layout JSON z warstwami, po prostu dodajemy wyniki matematyczne warstw
        if (!terrainLayers.isNullOrEmpty()) {
            var yDelta = 0f
            for (layer in terrainLayers) {
                if (layer.type == "sin") {
                    yDelta += sin(x * layer.frequency) * layer.amplitude
                } else if (layer.type == "cos") {
                    yDelta += cos(x * layer.frequency) * layer.amplitude
                }
            }
            return baseTerrainY + yDelta
        }

        // Fallback jeśli brakuje konfiguracji JSON
        return baseTerrainY + when (mapType) {

            MapType.SINUSOIDA -> {
                // Łagodniejsza sinusoida – 15% wysokości ekranu
                val omega = 2f * PI.toFloat() / sinPeriodM
                sin(omega * x) * (screenHeightM * 0.15f)
            }

            MapType.PRAIRIE -> {
                // Gładkie pagórki, usunięty random
                sin(x * 0.08f) * 1.5f +
                sin(x * 0.20f) * 0.8f +
                sin(x * 0.50f) * 0.2f
            }

            MapType.MOUNTAINS -> {
                // Strome, lecz gładkie góry
                sin(x * 0.06f) * 4.5f +
                sin(x * 0.15f) * 2.0f +
                sin(x * 0.40f) * 1.0f
            }

            MapType.ARCTIC -> {
                // Długie fale, zero schodków
                sin(x * 0.10f) * 2.0f +
                sin(x * 0.25f) * 1.2f
            }

            MapType.JUNGLE -> {
                // Gęste fale i nierówności (gładkie)
                sin(x * 0.12f) * 2.8f +
                sin(x * 0.30f) * 1.5f +
                cos(x * 0.50f) * 0.8f
            }
        }
    }

    private fun generateTerrain(count: Int) {
        val startIdx = terrainPoints.size
        repeat(count) { i ->
            terrainPoints.add(terrainYAt(startIdx + i))
        }
        nextTerrainIdx = terrainPoints.size
    }

    /** Tworzy (lub odtwarza) statyczne ciało terenu jako ChainShape */
    private fun buildTerrainBody() {
        // Usuń stary teren
        terrainBody?.let { world.destroyBody(it) }

        val bDef = BodyDef().apply { type = BodyType.STATIC }
        val body = world.createBody(bDef)

        val verts = Array(terrainPoints.size) { i ->
            Vec2(i * TERRAIN_STEP_M, terrainPoints[i])
        }

        val chain = ChainShape()
        chain.createChain(verts, verts.size)

        val fDef = FixtureDef().apply {
            shape = chain
            friction = 0.8f
            restitution = 0.05f
        }
        body.createFixture(fDef)
        terrainBody = body
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Budowanie samochodu
    // ═══════════════════════════════════════════════════════════════════════

    private fun buildCar() {
        val spawnX = 3f   // metry od początku
        val spawnY = terrainYAt(6) + 2.5f   // trochę nad terenem

        // --- Nadwozie ---
        val chassisDef = BodyDef().apply {
            type = BodyType.DYNAMIC
            position.set(spawnX, spawnY)
        }
        chassisBody = world.createBody(chassisDef)

        // Kształt nadwozia: prostokąt 2.2 × 0.7 m
        val chassisShape = PolygonShape()
        chassisShape.setAsBox(1.1f, 0.35f)

        val chassisFixture = FixtureDef().apply {
            shape = chassisShape
            density = 2.5f     // Zwiększamy ciężar żeby mocniej dociskało
            friction = 0.3f
            restitution = 0.1f
        }
        chassisDef.angularDamping = 3.0f // Znacznie większy opór angularny zapobiega ciągłym gwałtownym obrotom
        chassisBody.createFixture(chassisFixture)

        // --- Koła ---
        val wheelRadius = 0.42f

        frontWheelBody = createWheel(spawnX + 0.85f, spawnY - 0.35f, wheelRadius)
        rearWheelBody  = createWheel(spawnX - 0.85f, spawnY - 0.35f, wheelRadius)

        // --- WheelJoint (zawieszenie) ---
        val axisY = Vec2(0f, 1f)   // sprężyna w pionie

        val wjdFront = WheelJointDef().apply {
            initialize(chassisBody, frontWheelBody, frontWheelBody.position, axisY)
            enableMotor = true
            maxMotorTorque = maxTorque
            motorSpeed = 0f
            frequencyHz = 5f       // twardsze suspension
            dampingRatio = 0.8f
        }
        frontWheelJoint = world.createJoint(wjdFront) as WheelJoint

        val wjdRear = WheelJointDef().apply {
            initialize(chassisBody, rearWheelBody, rearWheelBody.position, axisY)
            enableMotor = true
            maxMotorTorque = maxTorque
            motorSpeed = 0f
            frequencyHz = 5f
            dampingRatio = 0.8f
        }
        rearWheelJoint = world.createJoint(wjdRear) as WheelJoint
    }

    private fun createWheel(x: Float, y: Float, radius: Float): Body {
        val def = BodyDef().apply {
            type = BodyType.DYNAMIC
            position.set(x, y)
        }
        val body = world.createBody(def)

        val shape = CircleShape()
        shape.radius = radius

        val fxDef = FixtureDef().apply {
            this.shape = shape
            density = 1.2f     // cięższe koła
            friction = wheelFriction * 1.5f // Lepsza przyczepność!
            restitution = 0.1f
        }
        body.createFixture(fxDef)
        return body
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Monety i przedmioty
    // ═══════════════════════════════════════════════════════════════════════

    private fun spawnItems() {
        while (nextCoinX < terrainPoints.size * TERRAIN_STEP_M - COIN_SPACING) {
            coinPositions.add(nextCoinX)
            nextCoinX += COIN_SPACING + random.nextFloat() * COIN_SPACING
        }
        while (nextFuelX < terrainPoints.size * TERRAIN_STEP_M - 50f) {
            fuelPositions.add(nextFuelX)
            nextFuelX += 500f // Paliwo równo co 500 dystansu fizycznego
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Pętla gry
    // ═══════════════════════════════════════════════════════════════════════

    fun update() {
        if (isGameOver) return

        val dt = TICK_MS / 1000f

        // ── Aktualne parametry biegu ───────────────────────────────────────
        val speedLimit = maxSpeedLimit * gearSpeedMultipliers[currentGear.coerceIn(1, 5)]
        val torqueLimit = maxTorque * gearTorqueMultipliers[currentGear.coerceIn(1, 5)]
        val fuelMultiplier = gearFuelMultipliers[currentGear.coerceIn(1, 5)]

        // ── Kąt auta (znormalizowany w stopniach do zakresu [-180, 180]) ───
        var carAngleDeg = Math.toDegrees(chassisBody.angle.toDouble()).toFloat() % 360f
        if (carAngleDeg < -180f) carAngleDeg += 360f
        if (carAngleDeg > 180f) carAngleDeg -= 360f

        // ── Silnik kół ─────────────────────────────────────────────────────
        val currentSpeedMs = chassisBody.linearVelocity.x

        when {
            gasPressed -> {
                val targetOmega = -(speedLimit * 1.2f) / 0.42f
                var torqueToApply = if (isNitroActive) torqueLimit * 2.0f else torqueLimit
                
                // Zapobieganie wheelie (przód w górze) - zmniejszamy moment, gdy się mocno podnosi
                // Kąt dodatni oznacza podnoszenie przodu (w Box2D kręci przeciwzegarowo)
                if (carAngleDeg > 20f && carAngleDeg < 80f) {
                    torqueToApply *= 0.05f // Drastycznie obcinamy przyspieszenie aby wyrównać nos auta
                }

                frontWheelJoint.motorSpeed = targetOmega
                frontWheelJoint.maxMotorTorque = torqueToApply
                rearWheelJoint.motorSpeed      = targetOmega
                rearWheelJoint.maxMotorTorque  = torqueToApply
            }
            reversePressed -> {
                val backOmega = (maxSpeedLimit * 0.8f) / 0.42f
                frontWheelJoint.motorSpeed = backOmega
                frontWheelJoint.maxMotorTorque = maxTorque * 1.2f
                rearWheelJoint.motorSpeed      = backOmega
                rearWheelJoint.maxMotorTorque  = maxTorque * 1.2f
            }
            else -> {
                // Silnik wyłączony – mały opór
                frontWheelJoint.motorSpeed = 0f
                frontWheelJoint.maxMotorTorque = maxTorque * 0.08f
                rearWheelJoint.motorSpeed      = 0f
                rearWheelJoint.maxMotorTorque  = maxTorque * 0.08f
            }
        }

        // ── Krok symulacji ─────────────────────────────────────────────────
        world.step(dt, 8, 3)

        // Wykrywamy lot
        val inAir = abs(chassisBody.linearVelocity.y) > 1.5f ||
                (frontWheelBody.linearVelocity.y < -1f && rearWheelBody.linearVelocity.y < -1f)

        // ── Kontrola w locie (flipy i backflipy) ───────────────────────────
        if (inAir) {
            val airTorque = 30f // Dużo niższa wartość aby lepiej kontrolować auto w powietrzu
            when {
                gasPressed -> chassisBody.applyTorque(airTorque)     // Backflip
                reversePressed -> chassisBody.applyTorque(-airTorque) // Frontflip
            }
        }

        // ── Paliwo wyliczane wg biegu i obrotów silnika ────────────────────
        val speedMs = abs(chassisBody.linearVelocity.x)
        val baseDrain = 1.5f * (weather?.fuelDrainModifier ?: 1f)
        
        // "Wycie silnika": jeśli próbujemy jechać blisko lub powyżej limitu biegu - spala dużo więcej (zmusza do zmiany)
        val rpmFactor = if (speedMs > speedLimit * 0.90f && gasPressed) 3.5f else (speedMs / speedLimit.coerceAtLeast(0.1f)).coerceIn(0.1f, 1.5f)
        
        fuel -= (baseDrain + rpmFactor * fuelMultiplier * 2.5f) * dt
        fuel = fuel.coerceAtLeast(0f)

        // ── Sprawdzanie wywrotki (tylko kiedy dach uderza w ziemie, a nie z samego kąta) ───
        val isUpsideDown = abs(carAngleDeg) > 90f
        val carX = chassisBody.position.x
        val terrainY = getTerrainY(carX)
        val heightAboveTerrain = chassisBody.position.y - terrainY
        
        // Jeśli auto odwrócone dogóry kołami i nisko nad terenem -> wypadek
        if (isUpsideDown && heightAboveTerrain < 1.3f) {
            isGameOver = true
            endReason = "crash"
            return
        }

        // ── Monety ─────────────────────────────────────────────────────────
        val collectRange = if (hasMagnet) 4f else 1.5f
        coinPositions.filter { abs(it - carX) < collectRange }.also { nearby ->
            coins += nearby.size
            coinPositions.removeAll(nearby.toSet())
        }
        
        // ── Kanistry z Paliwem ──────────────────────────────────────────────
        fuelPositions.filter { abs(it - carX) < collectRange }.also { nearby ->
            if (nearby.isNotEmpty()) {
                fuel = fuelCapacity
                health = min(1.0f, health + 0.2f) // Lekkie leczenie dodatkowo
                fuelPositions.removeAll(nearby.toSet())
            }
        }

        // ── Przebudowa terenu z przodu ─────────────────────────────────────
        val idxAhead = (carX / TERRAIN_STEP_M).toInt() + TERRAIN_AHEAD
        if (idxAhead >= terrainPoints.size - 50) {
            generateTerrain(200)
            buildTerrainBody()
            spawnItems()
        }

        if (speedMs > maxSpeedMs) maxSpeedMs = speedMs

        // ── Warunki końca gry z braku paliwa ───────────────────────────────
        if (fuel <= 0f) {
            isGameOver = true
            endReason = "fuel"
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Pomocnicze
    // ═══════════════════════════════════════════════════════════════════════

    /** Pozycja X auta w metrach Box2D */
    val positionM: Float get() = chassisBody.position.x

    /** Prędkość auta w km/h (do HUD) – zawsze >= 0 */
    val speedKmh: Float get() = abs(chassisBody.linearVelocity.x) * 3.6f

    /** Kąt terenu pod autem (radiany) */
    fun getCurrentTerrainAngle(): Float {
        val idx = (positionM / TERRAIN_STEP_M).toInt().coerceIn(1, terrainPoints.size - 2)
        val dy = terrainPoints[idx + 1] - terrainPoints[idx - 1]
        val dx = TERRAIN_STEP_M * 2f
        return atan2(dy, dx)
    }

    fun getTerrainY(worldX: Float): Float {
        val idx = (worldX / TERRAIN_STEP_M).toInt().coerceIn(0, terrainPoints.size - 1)
        return terrainPoints[idx]
    }

    // ── Biegi (kosmetyczne, silnik to torque-based) ────────────────────────
    fun shiftUp()   { if (currentGear < 5) { currentGear++; gearChanges++ } }
    fun shiftDown() { if (currentGear > 1) { currentGear--; gearChanges++ } }

    fun activateNitro() {
        if (hasNitro && !isNitroActive) {
            isNitroActive = true
            hasNitro = false
        }
    }
}
