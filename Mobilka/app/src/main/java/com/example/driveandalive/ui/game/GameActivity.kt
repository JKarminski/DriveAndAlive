package com.example.driveandalive.ui.game

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.MotionEvent
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.database.entities.MapRecord
import com.example.driveandalive.database.entities.VehicleStats
import com.example.driveandalive.databinding.ActivityGameBinding
import com.example.driveandalive.repository.GameRepository
import com.example.driveandalive.ui.result.ResultActivity
import com.example.driveandalive.ui.game.MapType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class GameActivity : AppCompatActivity() {

    private lateinit var binding: ActivityGameBinding
    private lateinit var gameEngine: GameEngine
    private val gameHandler = Handler(Looper.getMainLooper())
    private var isRunning = false
    private lateinit var repo: GameRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_FULLSCREEN or
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        )

        binding = ActivityGameBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val db = AppDatabase.getDatabase(this)
        repo = GameRepository(db)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                android.util.Log.d("GameActivity", "Start loading setup")
                val profile = repo.playerProfile
                val profileData = db.playerProfileDao().getProfileSuspend()
                val vehicleId = profileData?.selectedVehicleId ?: 1
                android.util.Log.d("GameActivity", "Vehicle ID: $vehicleId")

                val statsDb = repo.getVehicleStatsSuspend(vehicleId) ?: VehicleStats(vehicleId = 1)
                android.util.Log.d("GameActivity", "Stats loaded")

                val mapId = profileData?.selectedMapId ?: 1
                android.util.Log.d("GameActivity", "Map ID: $mapId")

                val map = repo.getMapById(mapId)
                android.util.Log.d("GameActivity", "Map loaded")

                val skills = db.vehicleSkillDao().getActiveSkillsSuspend(statsDb.vehicleId)
                android.util.Log.d("GameActivity", "Skills loaded")

                val weather = map?.let { repo.getWeatherForMap(it) }?.current
                android.util.Log.d("GameActivity", "Weather loaded")

                var layoutConfig: List<com.example.driveandalive.ui.game.TerrainLayer>? = null
                try {
                    val layoutJson = try {
                        assets.open("map_layouts/layout_$mapId.json").bufferedReader().use { it.readText() }
                    } catch(e: Exception) { null }
                    
                    if (layoutJson != null) {
                        val array = org.json.JSONArray(layoutJson)
                        val layers = mutableListOf<com.example.driveandalive.ui.game.TerrainLayer>()
                        for(i in 0 until array.length()) {
                            val obj = array.getJSONObject(i)
                            layers.add(com.example.driveandalive.ui.game.TerrainLayer(
                                obj.getString("type"),
                                obj.getDouble("amplitude").toFloat(),
                                obj.getDouble("frequency").toFloat()
                            ))
                        }
                        layoutConfig = layers
                    }
                } catch (e: Exception) {
                    android.util.Log.e("GameActivity", "Error loading layout: ${e.message}")
                }

                withContext(Dispatchers.Main) {
                    // Mapowanie id mapy na enum MapType
                    val mapType = when (mapId) {
                        1    -> MapType.PRAIRIE
                        2    -> MapType.MOUNTAINS
                        3    -> MapType.ARCTIC
                        4    -> MapType.JUNGLE
                        5    -> MapType.SINUSOIDA
                        else -> MapType.PRAIRIE
                    }
                    val dm = resources.displayMetrics
                    gameEngine = GameEngine(
                        stats          = statsDb,
                        weather        = weather,
                        mapType        = mapType,
                        terrainLayers  = layoutConfig,
                        screenWidthPx  = dm.widthPixels.toFloat(),
                        screenHeightPx = dm.heightPixels.toFloat()
                    ).apply {
                        isAutoGearbox = skills.any { it.skillType == "auto_gearbox" }
                        hasNitro      = skills.any { it.skillType == "nitro" }
                        hasShield     = skills.any { it.skillType == "shield" }
                        hasMagnet     = skills.any { it.skillType == "magnet" }
                        if (skills.any { it.skillType == "extra_fuel" }) {
                            fuel *= 1.5f
                        }
                    }
                    binding.gameView.engine = gameEngine

                    binding.gameView.setPtm(GameEngine.PTM)
                    binding.gameView.loadVehicle(vehicleId)

                    setupControls()
                    startGameLoop()
                }
            } catch (e: Throwable) {
                android.util.Log.e("GameActivity", "Error loading game: ${e.message}", e)
            }
        }
    }

    private fun setupControls() {

        binding.btnGas.setOnTouchListener { v, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> gameEngine.gasPressed = true
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    gameEngine.gasPressed = false
                    v.performClick()
                }
            }
            true
        }

        binding.btnReverse.setOnTouchListener { v, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> gameEngine.reversePressed = true
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    gameEngine.reversePressed = false
                    v.performClick()
                }
            }
            true
        }

        binding.btnGearUp.setOnClickListener {
            if (!gameEngine.isAutoGearbox) gameEngine.shiftUp()
        }

        binding.btnGearDown.setOnClickListener {
            if (!gameEngine.isAutoGearbox) gameEngine.shiftDown()
        }

        binding.btnNitro.visibility = if (gameEngine.hasNitro) View.VISIBLE else View.GONE
        binding.btnNitro.setOnClickListener {
            gameEngine.activateNitro()
            binding.btnNitro.visibility = View.GONE
        }

        if (gameEngine.isAutoGearbox) {
            binding.btnGearUp.visibility = View.GONE
            binding.btnGearDown.visibility = View.GONE
        }
    }

    private fun startGameLoop() {
        isRunning = true
        val gameRunnable = object : Runnable {
            override fun run() {
                if (!isRunning) return
                gameEngine.update()
                if (gameEngine.isGameOver) {
                    onGameOver()
                    return
                }
                gameHandler.postDelayed(this, GameEngine.TICK_MS)
            }
        }
        gameHandler.post(gameRunnable)
    }

    private fun onGameOver() {
        isRunning = false
        lifecycleScope.launch(Dispatchers.IO) {
            val profile = repo.playerProfile
            val profileData = AppDatabase.getDatabase(this@GameActivity).playerProfileDao().getProfileSuspend()
            val mapId = profileData?.selectedMapId ?: 1
            val vehicleId = profileData?.selectedVehicleId ?: 1

            repo.addCoins(gameEngine.coins)
            repo.updateAfterRun(gameEngine.positionM.toInt(), gameEngine.coins)
            val record = MapRecord(
                mapId = mapId,
                vehicleId = vehicleId,
                distanceMeters = gameEngine.positionM.toInt(),
                coinsEarned = gameEngine.coins,
                maxSpeedKmh = gameEngine.maxSpeedMs * 3.6f,
                gearChanges = gameEngine.gearChanges,
                endReason = gameEngine.endReason
            )
            repo.saveRecord(record)

            withContext(Dispatchers.Main) {

                val intent = Intent(this@GameActivity, ResultActivity::class.java).apply {
                    putExtra("distance", gameEngine.positionM.toInt())
                    putExtra("coins", gameEngine.coins)
                    putExtra("maxSpeed", gameEngine.maxSpeedMs * 3.6f)
                    putExtra("gearChanges", gameEngine.gearChanges)
                    putExtra("endReason", gameEngine.endReason)
                }
                startActivity(intent)
                finish()
            }
        }
    }

    override fun onPause() {
        super.onPause()
        isRunning = false
        gameHandler.removeCallbacksAndMessages(null)
    }

    override fun onResume() {
        super.onResume()
        if (::gameEngine.isInitialized && !gameEngine.isGameOver) {
            startGameLoop()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        gameHandler.removeCallbacksAndMessages(null)
    }
}
