package com.example.driveandalive.ui.game

import android.content.Context
import android.graphics.*
import android.view.View
import kotlin.math.*

/**
 * Widok gry – renderuje świat Box2D na Canvas.
 *
 * Konwencja kamer:
 *  - Auto jest zawsze rysowane w punkcie (carScreenX, carScreenY)
 *  - Cała reszta świata przesuwa się względem auta
 *  - Box2D: Y rośnie w górę  →  Canvas: Y rośnie w dół
 *    Konwersja:  screenY = carScreenY - (worldY - carWorldY) * PTM
 */
class GameView @JvmOverloads constructor(
    context: Context,
    attrs: android.util.AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    var engine: GameEngine? = null
        set(value) {
            field = value
            invalidate()
        }

    // ─── Paints ────────────────────────────────────────────────────────────
    private val skyGradPaint = Paint()

    private val terrainFillPaint = Paint().apply {
        style = Paint.Style.FILL
        isAntiAlias = true
    }
    private val terrainEdgePaint = Paint().apply {
        style = Paint.Style.STROKE
        strokeWidth = 4f
        isAntiAlias = true
    }

    private val carBodyPaint  = Paint().apply { style = Paint.Style.FILL; isAntiAlias = true }
    private val carRoofPaint  = Paint().apply { style = Paint.Style.FILL; isAntiAlias = true }
    private val carDetailPaint = Paint().apply { style = Paint.Style.FILL; isAntiAlias = true }
    private val carWindowPaint = Paint().apply {
        color = Color.parseColor("#80C8E8FF")
        style = Paint.Style.FILL
        isAntiAlias = true
    }
    private val wheelPaint = Paint().apply {
        color = Color.parseColor("#1A1A1A")
        style = Paint.Style.FILL
        isAntiAlias = true
    }
    private val tireTreadPaint = Paint().apply {
        color = Color.parseColor("#333333")
        style = Paint.Style.STROKE
        strokeWidth = 6f
        isAntiAlias = true
    }
    private val rimPaint = Paint().apply {
        color = Color.parseColor("#C0C0C0")
        style = Paint.Style.FILL
        isAntiAlias = true
    }
    private val spokePaint = Paint().apply {
        color = Color.parseColor("#999999")
        style = Paint.Style.STROKE
        strokeWidth = 5f
        isAntiAlias = true
    }

    private val coinPaint  = Paint().apply { color = Color.parseColor("#FFD700"); style = Paint.Style.FILL; isAntiAlias = true }
    private val coinRingPaint = Paint().apply { color = Color.parseColor("#FFA500"); style = Paint.Style.STROKE; strokeWidth = 3f; isAntiAlias = true }
    private val coinTextPaint = Paint().apply { color = Color.parseColor("#8B4513"); textSize = 18f; textAlign = Paint.Align.CENTER; isFakeBoldText = true }

    private val nitroPaint = Paint().apply { style = Paint.Style.FILL; isAntiAlias = true }

    // HUD
    private val hudTextPaint  = Paint().apply { color = Color.WHITE; textSize = 36f; isFakeBoldText = true; setShadowLayer(5f, 2f, 2f, Color.BLACK) }
    private val hudSmallPaint = Paint().apply { color = Color.parseColor("#CCCCCC"); textSize = 24f; setShadowLayer(3f, 1f, 1f, Color.BLACK) }
    private val barBgPaint    = Paint().apply { color = Color.parseColor("#55000000"); style = Paint.Style.FILL }
    private val barFuelPaint  = Paint().apply { style = Paint.Style.FILL }
    private val barHpPaint    = Paint().apply { color = Color.parseColor("#FF2D55"); style = Paint.Style.FILL }
    private val barBorderPaint = Paint().apply { color = Color.parseColor("#80FFFFFF"); style = Paint.Style.STROKE; strokeWidth = 2f }

    // Parallax
    private val mountainPaint = Paint().apply {
        color = Color.parseColor("#0E2030")
        style = Paint.Style.FILL
        isAntiAlias = true
    }

    // Paths reused each frame
    private val terrainPath  = Path()
    private val mountainPath = Path()

    // Wheel rotation
    private var wheelRotation = 0f

    // ─── Pozycja auta na ekranie ─────────────────────────────────────────
    private val carScreenX get() = width  * 0.30f
    private val carScreenY get() = height * 0.52f

    // ─── PTM ─────────────────────────────────────────────────────────────
    private val ptm get() = GameEngine.PTM

    // ─── Konwersje świat → ekran ─────────────────────────────────────────
    private fun worldToScreenX(worldX: Float, camWorldX: Float): Float =
        carScreenX + (worldX - camWorldX) * ptm

    private fun worldToScreenY(worldY: Float, camWorldY: Float): Float =
        carScreenY - (worldY - camWorldY) * ptm

    // ═══════════════════════════════════════════════════════════════════════
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val eng = engine ?: run { drawPlaceholder(canvas); return }

        val carPos  = eng.chassisBody.position
        val camX    = carPos.x
        val camY    = carPos.y

        // Obrót kół z prędkości kątowej
        val frontOmega = eng.frontWheelBody.angularVelocity
        wheelRotation += Math.toDegrees(frontOmega.toDouble()).toFloat() * (GameEngine.TICK_MS / 1000f)

        drawSky(canvas)
        drawParallax(canvas, camX)
        drawTerrain(canvas, eng, camX, camY)
        drawFuelCans(canvas, eng, camX, camY)
        drawCoins(canvas, eng, camX, camY)
        drawCar(canvas, eng, camX, camY)
        drawHUD(canvas, eng)

        invalidate()
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Sky
    // ═══════════════════════════════════════════════════════════════════════
    private fun drawSky(canvas: Canvas) {
        val gradient = LinearGradient(
            0f, 0f, 0f, height * 0.7f,
            intArrayOf(
                Color.parseColor("#0A1628"),
                Color.parseColor("#1A3A6E"),
                Color.parseColor("#2E5FA3")
            ),
            floatArrayOf(0f, 0.5f, 1f),
            Shader.TileMode.CLAMP
        )
        skyGradPaint.shader = gradient
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), skyGradPaint)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Parallax Mountains
    // ═══════════════════════════════════════════════════════════════════════
    private fun drawParallax(canvas: Canvas, camX: Float) {
        val parallaxOffset = (-camX * ptm * 0.25f) % (width * 2f)

        mountainPath.reset()
        var startX = parallaxOffset
        if (startX > 0) startX -= width * 2f

        mountainPath.moveTo(startX, height * 0.72f)
        for (i in 0..40) {
            val x = startX + i * width * 0.07f
            val y = height * 0.72f - 120f - sin(i * 1.7f) * 90f - cos(i * 0.9f) * 50f
            mountainPath.lineTo(x, y)
        }
        mountainPath.lineTo(startX + 40 * width * 0.07f, height * 0.72f)
        mountainPath.close()

        canvas.drawPath(mountainPath, mountainPaint)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Teren
    // ═══════════════════════════════════════════════════════════════════════
    private fun drawTerrain(canvas: Canvas, eng: GameEngine, camX: Float, camY: Float) {
        // Kolory terenu zależne od mapy
        val (fillColor, edgeColor) = when (eng.mapType) {
            MapType.PRAIRIE   -> Pair("#3D6B4A", "#2A4A33")
            MapType.MOUNTAINS -> Pair("#7A7060", "#5A5040")
            MapType.ARCTIC    -> Pair("#C8DDF0", "#A0C0DC")
            MapType.JUNGLE    -> Pair("#2D5A3D", "#1E3D2A")
            MapType.SINUSOIDA -> Pair("#2E4A8A", "#1A3060")
        }
        terrainFillPaint.color = Color.parseColor(fillColor)
        terrainEdgePaint.color = Color.parseColor(edgeColor)

        val step = GameEngine.TERRAIN_STEP_M
        val startIdx = ((camX / step) - 3).toInt().coerceAtLeast(0)
        val endIdx   = (startIdx + (width / ptm / step + 8).toInt()).coerceAtMost(eng.terrainPoints.size - 1)

        terrainPath.reset()
        var first = true
        for (i in startIdx..endIdx) {
            val wx = i * step
            val wy = eng.terrainPoints[i]
            val sx = worldToScreenX(wx, camX)
            val sy = worldToScreenY(wy, camY)
            if (first) { terrainPath.moveTo(sx, sy); first = false }
            else        terrainPath.lineTo(sx, sy)
        }
        // Zamknij ścieżkę na dole ekranu
        terrainPath.lineTo(width + 200f, height + 200f)
        terrainPath.lineTo(-200f, height + 200f)
        terrainPath.close()

        canvas.drawPath(terrainPath, terrainFillPaint)
        canvas.drawPath(terrainPath, terrainEdgePaint)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Monety
    // ═══════════════════════════════════════════════════════════════════════
    private fun drawCoins(canvas: Canvas, eng: GameEngine, camX: Float, camY: Float) {
        for (coinX in eng.coinPositions) {
            val sx = worldToScreenX(coinX, camX)
            if (sx < -40f || sx > width + 40f) continue
            val terrainY = eng.getTerrainY(coinX)
            val sy = worldToScreenY(terrainY + 1.2f, camY)
            canvas.drawCircle(sx, sy, 22f, coinPaint)
            canvas.drawCircle(sx, sy, 22f, coinRingPaint)
            canvas.drawText("$", sx, sy + 7f, coinTextPaint)
        }
    }
    
    private val fuelCanPaint = Paint().apply { color = Color.parseColor("#E53935"); style = Paint.Style.FILL; isAntiAlias = true }

    // ═══════════════════════════════════════════════════════════════════════
    //  Paliwo (Kanistry)
    // ═══════════════════════════════════════════════════════════════════════
    private fun drawFuelCans(canvas: Canvas, eng: GameEngine, camX: Float, camY: Float) {
        for (fuelX in eng.fuelPositions) {
            val sx = worldToScreenX(fuelX, camX)
            if (sx < -40f || sx > width + 40f) continue
            val terrainY = eng.getTerrainY(fuelX)
            val sy = worldToScreenY(terrainY + 0.8f, camY)
            
            // Kanister
            canvas.drawRoundRect(RectF(sx - 15f, sy - 20f, sx + 15f, sy + 20f), 4f, 4f, fuelCanPaint)
            canvas.drawRect(RectF(sx - 8f, sy - 25f, sx + 8f, sy - 20f), barBorderPaint) // Korek/uchwyt
            canvas.drawText("F", sx, sy + 7f, hudSmallPaint)
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Auto
    // ═══════════════════════════════════════════════════════════════════════
    private fun drawCar(canvas: Canvas, eng: GameEngine, camX: Float, camY: Float) {
        // Koła
        drawWheel(canvas, eng.rearWheelBody.position.x,
            eng.rearWheelBody.position.y, camX, camY,
            eng.rearWheelBody.angle.toFloat())
        drawWheel(canvas, eng.frontWheelBody.position.x,
            eng.frontWheelBody.position.y, camX, camY,
            eng.frontWheelBody.angle.toFloat())

        // Nadwozie
        val cx = worldToScreenX(eng.chassisBody.position.x, camX)
        val cy = worldToScreenY(eng.chassisBody.position.y, camY)
        val carAngle = -eng.chassisBody.angle   // Box2D→Canvas (odwrócone Y)

        canvas.save()
        canvas.translate(cx, cy)
        canvas.rotate(Math.toDegrees(carAngle.toDouble()).toFloat())

        // Wybierz kolor nadwozia wg pojazdu  (potem można dodać per-vehicle)
        carBodyPaint.color = Color.parseColor("#E85D04")
        carRoofPaint.color = Color.parseColor("#C04400")

        // ── Nadwozie (w Box2D 1.1 m × 0.35 m → w pikselach × PTM) ────────
        val hw = 1.1f * ptm    // połowa szerokości
        val hh = 0.35f * ptm   // połowa wysokości

        // Podwozie
        canvas.drawRoundRect(RectF(-hw, -hh, hw, hh), 12f, 12f, carBodyPaint)

        // Zderzaki
        carDetailPaint.color = Color.parseColor("#333333")
        canvas.drawRoundRect(RectF(hw - 8f, -hh + 8f, hw + 6f, hh - 8f), 4f, 4f, carDetailPaint)
        canvas.drawRoundRect(RectF(-hw - 6f, -hh + 8f, -hw + 8f, hh - 8f), 4f, 4f, carDetailPaint)

        // Dach (kabina)
        val roofL = -hw * 0.45f
        val roofR =  hw * 0.55f
        val roofTop = -hh - ptm * 0.55f
        val roofBot = -hh

        canvas.drawRoundRect(RectF(roofL, roofTop, roofR, roofBot), 10f, 10f, carRoofPaint)

        // Szyba przednia
        canvas.drawRoundRect(RectF(roofL + 10f, roofTop + 8f, roofR - 6f, roofBot - 4f), 6f, 6f, carWindowPaint)

        // Nitro flame
        if (eng.isNitroActive) {
            val nPts = 6
            for (i in 0 until nPts) {
                val frac = i.toFloat() / nPts
                nitroPaint.color = lerpColor("#FF6B00", "#FFDD00", frac)
                nitroPaint.alpha = (255 * (1f - frac)).toInt()
                canvas.drawOval(
                    RectF(-hw - 16f - i * 12f, -8f + i * 2f, -hw - 4f - i * 12f, 8f - i * 2f),
                    nitroPaint
                )
            }
        }

        canvas.restore()
    }

    private fun drawWheel(
        canvas: Canvas,
        worldX: Float, worldY: Float,
        camX: Float, camY: Float,
        angle: Float
    ) {
        val sx = worldToScreenX(worldX, camX)
        val sy = worldToScreenY(worldY, camY)
        val r = 0.42f * ptm  // promień koła w pikselach

        canvas.save()
        canvas.translate(sx, sy)
        canvas.rotate(-Math.toDegrees(angle.toDouble()).toFloat())

        // Opona
        canvas.drawCircle(0f, 0f, r, wheelPaint)

        // Bieżnik – łuki
        for (i in 0..7) {
            val a = (i * 45f)
            canvas.drawArc(RectF(-r, -r, r, r), a, 20f, false, tireTreadPaint)
        }

        // Felga
        canvas.drawCircle(0f, 0f, r * 0.58f, rimPaint)

        // Szprychy
        for (i in 0..4) {
            val a = Math.toRadians(i * 72.0)
            canvas.drawLine(
                (r * 0.18f * cos(a)).toFloat(), (r * 0.18f * sin(a)).toFloat(),
                (r * 0.55f * cos(a)).toFloat(), (r * 0.55f * sin(a)).toFloat(),
                spokePaint
            )
        }

        // Piasta
        canvas.drawCircle(0f, 0f, r * 0.15f, wheelPaint)

        canvas.restore()
    }

    private fun lerpColor(from: String, to: String, t: Float): Int {
        val c1 = Color.parseColor(from)
        val c2 = Color.parseColor(to)
        return Color.argb(
            (Color.alpha(c1) + (Color.alpha(c2) - Color.alpha(c1)) * t).toInt(),
            (Color.red(c1)   + (Color.red(c2)   - Color.red(c1))   * t).toInt(),
            (Color.green(c1) + (Color.green(c2) - Color.green(c1)) * t).toInt(),
            (Color.blue(c1)  + (Color.blue(c2)  - Color.blue(c1))  * t).toInt()
        )
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  HUD
    // ═══════════════════════════════════════════════════════════════════════
    private fun drawHUD(canvas: Canvas, eng: GameEngine) {
        val pad = 20f

        // ── Pasek paliwa ────────────────────────────────────────────────────
        val barW = 220f; val barH = 22f; val barX = pad; val barY = pad + 8f
        canvas.drawRoundRect(RectF(barX, barY, barX + barW, barY + barH), 11f, 11f, barBgPaint)
        val fuelRatio = (eng.fuel / eng.fuelCapacity).coerceIn(0f, 1f)
        barFuelPaint.color = when {
            fuelRatio > 0.5f  -> Color.parseColor("#00E676")
            fuelRatio > 0.25f -> Color.parseColor("#FFB800")
            else              -> Color.parseColor("#FF2D55")
        }
        if (fuelRatio > 0f)
            canvas.drawRoundRect(RectF(barX, barY, barX + barW * fuelRatio, barY + barH), 11f, 11f, barFuelPaint)
        canvas.drawRoundRect(RectF(barX, barY, barX + barW, barY + barH), 11f, 11f, barBorderPaint)
        canvas.drawText("⛽", barX - 4f, barY + barH + 2f, hudSmallPaint)

        // ── HP ──────────────────────────────────────────────────────────────
        val hpY = barY + barH + 10f
        canvas.drawRoundRect(RectF(barX, hpY, barX + barW, hpY + 14f), 7f, 7f, barBgPaint)
        if (eng.health > 0f)
            canvas.drawRoundRect(RectF(barX, hpY, barX + barW * eng.health, hpY + 14f), 7f, 7f, barHpPaint)
        canvas.drawRoundRect(RectF(barX, hpY, barX + barW, hpY + 14f), 7f, 7f, barBorderPaint)
        canvas.drawText("❤", barX - 4f, hpY + 14f, hudSmallPaint)

        // ── Prędkość ─────────────────────────────────────────────────────────
        val speedStr = "${eng.speedKmh.coerceAtLeast(0f).toInt()} km/h"
        canvas.drawText(speedStr, pad, hpY + 56f, hudTextPaint)

        // ── Dystans ──────────────────────────────────────────────────────────
        val distStr = "${eng.positionM.toInt()} m"
        canvas.drawText(distStr, width / 2f - 60f, pad + 46f, hudTextPaint)

        // ── Monety ────────────────────────────────────────────────────────────
        canvas.drawText("💰 ${eng.coins}", width - 210f, pad + 46f, hudTextPaint)

        // ── Bieg ─────────────────────────────────────────────────────────────
        canvas.drawText("Bieg: ${eng.currentGear}", width - 170f, pad + 80f, hudSmallPaint)

        // ── Nitro ────────────────────────────────────────────────────────────
        if (eng.isNitroActive) {
            val nitroPaintHud = Paint().apply {
                color = Color.parseColor("#FF6B00")
                textSize = 28f
                textAlign = Paint.Align.CENTER
                setShadowLayer(6f, 0f, 0f, Color.parseColor("#FF6B00"))
            }
            canvas.drawText("🔥 NITRO!", width / 2f, height * 0.88f, nitroPaintHud)
        }
    }

    private fun drawPlaceholder(canvas: Canvas) {
        canvas.drawColor(Color.parseColor("#0A1628"))
        val p = Paint().apply { color = Color.WHITE; textSize = 44f; textAlign = Paint.Align.CENTER }
        canvas.drawText("Ładowanie...", width / 2f, height / 2f, p)
    }
}
