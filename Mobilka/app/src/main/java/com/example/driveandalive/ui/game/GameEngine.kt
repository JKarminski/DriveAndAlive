package com.example.driveandalive.ui.game

import com.example.driveandalive.database.entities.VehicleStats
import com.example.driveandalive.network.CurrentWeather
import kotlin.math.*

class GameEngine(private val stats: VehicleStats, private val weather: CurrentWeather?) {

    companion object {

        const val TICK_MS = 16L           
        const val TERRAIN_CHUNK = 200f    
        const val COIN_SPACING = 300f     

        fun engineToAcceleration(level: Int) = 5f + level * 3f        
        fun engineToMaxSpeed(level: Int) = 40f + level * 12f          
        fun gripToFriction(level: Int) = 0.85f + level * 0.015f       
        fun fuelLevelToCapacity(level: Int) = 100f + level * 50f      
        fun durabilityToHits(level: Int) = level                       
    }

    var position = 0f          
    var speed = 0f             
    var fuel = fuelLevelToCapacity(stats.fuelLevel)
    var health = 1.0f
    var coins = 0
    var currentGear = 1
    var isAutoGearbox = false
    var hasNitro = false
    var hasShield = false
    var hasMagnet = false
    var isGameOver = false
    var endReason = "fuel"
    var maxSpeed = 0f
    var gearChanges = 0
    var isNitroActive = false

    val maxSpeedKmh = engineToMaxSpeed(stats.engineLevel)
    val acceleration = engineToAcceleration(stats.engineLevel)
    var gripModifier = gripToFriction(stats.gripLevel) * (weather?.gripModifier ?: 1f)
    val fuelCapacity = fuelLevelToCapacity(stats.fuelLevel) * if (false) 1.5f else 1f  
    val maxHits = durabilityToHits(stats.durabilityLevel)
    var hitsReceived = 0

    val terrain = mutableListOf<Float>()
    val coinPositions = mutableSetOf<Float>()
    private var nextTerrainX = 0f
    private var random = java.util.Random(42)

    var gasPressed = false
    var reversePressed = false
    var nitroPressedThisRound = false

    init {
        generateInitialTerrain()
        generateCoins()

        fuel = fuelCapacity
    }

    private fun generateInitialTerrain() {
        terrain.clear()

        repeat(100) { terrain.add(0f) }
        nextTerrainX = 100f * 10f

        generateMoreTerrain()
    }

    fun generateMoreTerrain() {
        val startX = terrain.size * 10f
        val count = 200
        for (i in 0 until count) {
            val x = startX + i * 10f
            val y = (
                sin(x * 0.003f) * 80f +
                sin(x * 0.008f) * 40f +
                sin(x * 0.015f) * 20f +
                (random.nextFloat() - 0.5f) * 10f
            )
            terrain.add(y)
        }
        nextTerrainX = terrain.size * 10f
    }

    private fun generateCoins() {
        var x = COIN_SPACING
        while (x < nextTerrainX) {
            coinPositions.add(x)
            x += COIN_SPACING + random.nextFloat() * 100f
        }
    }

    fun getCurrentTerrainAngle(): Float {
        val idx = (position / 10f).toInt().coerceIn(1, terrain.size - 2)
        val dy = terrain[idx + 1] - terrain[idx - 1]
        val dx = 20f
        return atan2(dy, dx)
    }

    fun getTerrainY(posX: Float): Float {
        val idx = (posX / 10f).toInt().coerceIn(0, terrain.size - 1)
        return terrain[idx]
    }

    fun update() {
        if (isGameOver) return

        val dt = TICK_MS / 1000f   
        val angle = getCurrentTerrainAngle()
        val slopeEffect = sin(angle)  

        if (isAutoGearbox) autoShiftGear()

        val effectiveMax = when {
            isNitroActive -> maxSpeedKmh * 1.5f
            else -> maxSpeedKmh * gearSpeedFactor()
        }

        when {
            gasPressed && speed >= 0 -> {
                val accel = acceleration * gripModifier - slopeEffect * 30f
                speed = (speed + accel * dt).coerceAtMost(effectiveMax)
            }
            reversePressed -> {
                speed = (speed - acceleration * 0.6f * dt).coerceAtLeast(-effectiveMax * 0.4f)
            }
            else -> {

                val drag = if (speed > 0) -12f else if (speed < 0) 12f else 0f
                val gravity = -slopeEffect * 20f
                speed += (drag + gravity) * dt
                if (abs(speed) < 0.5f) speed = 0f
            }
        }

        val distancePerSec = speed * (1000f / 3600f)  
        position += distancePerSec * dt
        position = position.coerceAtLeast(0f)

        val baseDrain = 2f * (weather?.fuelDrainModifier ?: 1f)
        val speedDrain = abs(speed) * 0.01f
        fuel -= (baseDrain + speedDrain) * dt
        fuel = fuel.coerceAtLeast(0f)

        val collectRange = if (hasMagnet) 150f else 50f
        coinPositions.filter { abs(it - position) < collectRange }.also { nearby ->
            coins += nearby.size
            coinPositions.removeAll(nearby.toSet())
        }

        if (abs(angle) > Math.toRadians(50.0).toFloat()) {
            receiveDamage()
        }

        if (position > nextTerrainX - 2000f) {
            generateMoreTerrain()
            generateCoins()
        }

        if (speed > maxSpeed) maxSpeed = speed

        if (fuel <= 0f) {
            isGameOver = true
            endReason = "fuel"
        } else if (health <= 0f) {
            isGameOver = true
            endReason = "crash"
        }
    }

    private fun receiveDamage() {
        if (hasShield) { hasShield = false; return }
        hitsReceived++
        health = (1f - hitsReceived.toFloat() / maxHits).coerceAtLeast(0f)
    }

    fun shiftUp() {
        if (currentGear < 5) {
            currentGear++
            gearChanges++
        }
    }

    fun shiftDown() {
        if (currentGear > 1) {
            currentGear--
            gearChanges++
        }
    }

    private fun gearSpeedFactor(): Float = 0.3f + currentGear * 0.15f

    private fun autoShiftGear() {
        val ratio = speed / maxSpeedKmh
        currentGear = when {
            ratio < 0.2f -> 1
            ratio < 0.4f -> 2
            ratio < 0.6f -> 3
            ratio < 0.8f -> 4
            else -> 5
        }
    }

    fun activateNitro() {
        if (hasNitro && !isNitroActive) {
            isNitroActive = true
            hasNitro = false
        }
    }
}
