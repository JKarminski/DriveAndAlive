package com.example.driveandalive.ui.game

import android.content.Context
import android.graphics.*
import android.view.View
import kotlin.math.*

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
    private var wheelRotation = 0f

    private val skyPaintTop = Paint().apply { color = Color.parseColor("#0D1B2A") }
    private val skyPaintBot = Paint().apply { color = Color.parseColor("#1C3A5E") }
    private val terrainPaint = Paint().apply { color = Color.parseColor("#4A7C59"); style = Paint.Style.FILL; isAntiAlias = true }
    private val terrainLinePaint = Paint().apply { color = Color.parseColor("#2D4A35"); style = Paint.Style.STROKE; strokeWidth = 3f; isAntiAlias = true }
    private val carBodyPaint = Paint().apply { color = Color.parseColor("#E85D04"); style = Paint.Style.FILL; isAntiAlias = true }
    private val carRoofPaint = Paint().apply { color = Color.parseColor("#C44D04"); style = Paint.Style.FILL }
    private val wheelPaint = Paint().apply { color = Color.parseColor("#222222"); style = Paint.Style.FILL; isAntiAlias = true }
    private val wheelSpokePaint = Paint().apply { color = Color.parseColor("#888888"); style = Paint.Style.STROKE; strokeWidth = 3f; isAntiAlias = true }
    private val coinPaint = Paint().apply { color = Color.parseColor("#FFD700"); style = Paint.Style.FILL; isAntiAlias = true }
    private val coinTextPaint = Paint().apply { color = Color.BLACK; textSize = 14f; textAlign = Paint.Align.CENTER; isFakeBoldText = true }
    private val hudTextPaint = Paint().apply { color = Color.WHITE; textSize = 32f; isFakeBoldText = true; setShadowLayer(4f, 2f, 2f, Color.BLACK) }
    private val hudSmallPaint = Paint().apply { color = Color.parseColor("#AAAAAA"); textSize = 22f }
    private val fuelBgPaint = Paint().apply { color = Color.parseColor("#33FFFFFF"); style = Paint.Style.FILL }
    private val fuelFillPaint = Paint().apply { color = Color.parseColor("#00D084"); style = Paint.Style.FILL }
    private val nitroPaint = Paint().apply { color = Color.parseColor("#FF6B00"); style = Paint.Style.FILL }
    private val skyGradientPaint = Paint()

    private val terrainPath = Path()
    private var cameraX = 0f

    private val carScreenX get() = width * 0.35f
    private val carScreenY get() = height * 0.55f

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val eng = engine ?: run { drawPlaceholder(canvas); return }

        wheelRotation += eng.speed * 0.5f
        cameraX = eng.position - carScreenX / 10f

        drawSky(canvas)
        drawParallaxBackground(canvas)
        drawTerrain(canvas, eng)
        drawCoins(canvas, eng)
        drawCar(canvas, eng)
        drawHUD(canvas, eng)

        invalidate()   
    }

    private fun drawSky(canvas: Canvas) {
        val gradient = LinearGradient(0f, 0f, 0f, height * 0.6f,
            Color.parseColor("#0D1B2A"), Color.parseColor("#1C3A5E"), Shader.TileMode.CLAMP)
        skyGradientPaint.shader = gradient
        canvas.drawRect(0f, 0f, width.toFloat(), height * 0.6f, skyGradientPaint)

        canvas.drawRect(0f, height * 0.6f, width.toFloat(), height.toFloat(), terrainPaint)
    }

    private fun drawParallaxBackground(canvas: Canvas) {

        val parallaxOffset = -cameraX * 0.3f % (width * 2f)
        val mountainPaint = Paint().apply { color = Color.parseColor("#162B3C"); style = Paint.Style.FILL; isAntiAlias = true }
        val path = Path()
        val baseY = height * 0.55f
        path.reset()
        path.moveTo(parallaxOffset, baseY)
        for (i in 0..20) {
            val x = parallaxOffset + i * width * 0.12f
            val y = baseY - 80f - sin(i * 1.3f) * 60f - cos(i * 0.7f) * 40f
            path.lineTo(x, y)
        }
        path.lineTo(parallaxOffset + 20 * width * 0.12f, baseY)
        path.close()
        canvas.drawPath(path, mountainPaint)
    }

    private fun drawTerrain(canvas: Canvas, eng: GameEngine) {
        val scaleX = 10f  
        val baseY = height * 0.55f

        terrainPath.reset()
        terrainPath.moveTo(-100f, height.toFloat())

        val startIdx = ((cameraX / scaleX) - 5).toInt().coerceAtLeast(0)
        val endIdx = (startIdx + (width / scaleX).toInt() + 20).coerceAtMost(eng.terrain.size - 1)

        for (i in startIdx..endIdx) {
            val screenX = i * scaleX - cameraX * scaleX + carScreenX - eng.position
            val screenY = baseY - eng.terrain[i]
            if (i == startIdx) terrainPath.moveTo(screenX, screenY)
            else terrainPath.lineTo(screenX, screenY)
        }
        terrainPath.lineTo(width.toFloat() + 100f, height.toFloat())
        terrainPath.lineTo(-100f, height.toFloat())
        terrainPath.close()

        canvas.drawPath(terrainPath, terrainPaint)
        canvas.drawPath(terrainPath, terrainLinePaint)
    }

    private fun drawCoins(canvas: Canvas, eng: GameEngine) {
        val baseY = height * 0.55f
        for (coinX in eng.coinPositions) {
            val screenX = coinX - eng.position + carScreenX
            if (screenX < -30f || screenX > width + 30f) continue
            val terrainY = eng.getTerrainY(coinX)
            val screenY = baseY - terrainY - 30f
            canvas.drawCircle(screenX, screenY, 18f, coinPaint)
            canvas.drawText("$", screenX, screenY + 6f, coinTextPaint)
        }
    }

    private fun drawCar(canvas: Canvas, eng: GameEngine) {
        val baseY = height * 0.55f
        val terrainY = eng.getTerrainY(eng.position)
        val angle = eng.getCurrentTerrainAngle()
        val carX = carScreenX
        val carY = baseY - terrainY

        canvas.save()
        canvas.translate(carX, carY)
        canvas.rotate(Math.toDegrees(angle.toDouble()).toFloat())

        canvas.drawRoundRect(RectF(-55f, -28f, 55f, 0f), 8f, 8f, carBodyPaint)

        canvas.drawRoundRect(RectF(-30f, -52f, 30f, -28f), 6f, 6f, carRoofPaint)

        if (eng.isNitroActive) {
            canvas.drawOval(RectF(-75f, -15f, -55f, 5f), nitroPaint)
        }

        drawWheel(canvas, -35f, 0f)
        drawWheel(canvas, 35f, 0f)

        canvas.restore()
    }

    private fun drawWheel(canvas: Canvas, offsetX: Float, offsetY: Float) {
        canvas.save()
        canvas.translate(offsetX, offsetY)
        canvas.rotate(wheelRotation)
        canvas.drawCircle(0f, 0f, 18f, wheelPaint)

        for (i in 0..3) {
            val a = Math.toRadians(i * 45.0)
            canvas.drawLine(
                (-12f * cos(a)).toFloat(), (-12f * sin(a)).toFloat(),
                (12f * cos(a)).toFloat(), (12f * sin(a)).toFloat(),
                wheelSpokePaint
            )
        }
        canvas.restore()
    }

    private fun drawHUD(canvas: Canvas, eng: GameEngine) {

        val fuelW = 200f; val fuelH = 20f; val fuelX = 20f; val fuelY = 24f
        canvas.drawRoundRect(RectF(fuelX, fuelY, fuelX + fuelW, fuelY + fuelH), 10f, 10f, fuelBgPaint)
        val fuelRatio = (eng.fuel / eng.fuelCapacity).coerceIn(0f, 1f)
        fuelFillPaint.color = when {
            fuelRatio > 0.5f -> Color.parseColor("#00D084")
            fuelRatio > 0.25f -> Color.parseColor("#FFB800")
            else -> Color.parseColor("#FF2D55")
        }
        canvas.drawRoundRect(RectF(fuelX, fuelY, fuelX + fuelW * fuelRatio, fuelY + fuelH), 10f, 10f, fuelFillPaint)
        canvas.drawText("⛽", fuelX - 5f, fuelY + fuelH + 5f, hudSmallPaint)

        canvas.drawText("${eng.speed.toInt()} km/h", 20f, fuelY + fuelH + 40f, hudTextPaint)

        canvas.drawText("${eng.position.toInt()} m", width / 2f - 60f, 50f, hudTextPaint)

        canvas.drawText("💰 ${eng.coins}", width - 200f, 50f, hudTextPaint)

        val gearText = "Bieg: ${eng.currentGear}"
        canvas.drawText(gearText, width - 180f, 90f, hudSmallPaint)

        val hpW = 120f; val hpX = 20f; val hpY = fuelY + fuelH + 60f
        val hpBg = Paint().apply { color = Color.parseColor("#33FFFFFF") }
        val hpFill = Paint().apply { color = Color.parseColor("#FF2D55") }
        canvas.drawRoundRect(RectF(hpX, hpY, hpX + hpW, hpY + 14f), 7f, 7f, hpBg)
        canvas.drawRoundRect(RectF(hpX, hpY, hpX + hpW * eng.health, hpY + 14f), 7f, 7f, hpFill)
        canvas.drawText("❤", hpX - 5f, hpY + 16f, hudSmallPaint)
    }

    private fun drawPlaceholder(canvas: Canvas) {
        canvas.drawColor(Color.parseColor("#0D0D0F"))
        val p = Paint().apply { color = Color.WHITE; textSize = 40f; textAlign = Paint.Align.CENTER }
        canvas.drawText("Ładowanie...", width / 2f, height / 2f, p)
    }
}
