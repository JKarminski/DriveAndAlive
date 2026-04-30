package com.example.driveandalive.ui.result

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.driveandalive.MainActivity
import com.example.driveandalive.R
import com.example.driveandalive.api.models.Score
import com.example.driveandalive.api.repository.FirebaseRankingRepository
import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.databinding.ActivityResultBinding
import com.example.driveandalive.repository.GameRepository
import com.example.driveandalive.ui.game.GameActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ResultActivity : AppCompatActivity() {

    private lateinit var binding: ActivityResultBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityResultBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Sprawdź, czy gracz ma już nazwę – jeśli nie, poproś o nią
        val prefs = getSharedPreferences("user", MODE_PRIVATE)
        if (!prefs.contains("userName")) {
            showChangeNameDialog()
        }

        val distance = intent.getIntExtra("distance", 0)
        val coins = intent.getIntExtra("coins", 0)
        val maxSpeed = intent.getFloatExtra("maxSpeed", 0f)
        val gearChanges = intent.getIntExtra("gearChanges", 0)
        val endReason = intent.getStringExtra("endReason") ?: "fuel"
        val mapId = intent.getIntExtra("mapId", 1)
        val vehicleId = intent.getIntExtra("vehicleId", 1)

        when (endReason) {
            "fuel" -> {
                binding.tvResultTitle.text = "Zabrakło Paliwa! ⛽"
                binding.tvResultEmoji.text = "😤"
            }
            "crash" -> {
                binding.tvResultTitle.text = "Rozbity! 💥"
                binding.tvResultEmoji.text = "💀"
            }
            else -> {
                binding.tvResultTitle.text = "Dobra Jazda! 🏁"
                binding.tvResultEmoji.text = "🏆"
            }
        }

        binding.tvDistance.text = "📍 Dystans: $distance m"
        binding.tvCoinsEarned.text = "💰 Zarobione: $coins monet"
        binding.tvMaxSpeed.text = "🚀 Max prędkość: ${maxSpeed.toInt()} km/h"
        binding.tvGearChanges.text = "⚙ Zmiany biegu: $gearChanges"

        // Pobranie lub wygenerowanie identyfikatora użytkownika
        val userId = getUserId()
        val trackSlug = mapIdToSlug(mapId)
        val carModel = vehicleIdToModel(vehicleId)
        val userName = getUserName() // odczytuje nazwę z SharedPreferences
        Log.d("RESULT", "userName = $userName")
        val score = Score(
            playerUUID = userId,
            playerName = userName,
            trackSlug = trackSlug,
            carModel = carModel,
            points = distance,
            time = null
        )
        val rankingRepo = FirebaseRankingRepository()
        lifecycleScope.launch {
            rankingRepo.submitScore(score)
        }

        // Sprawdź czy to nowy rekord (lokalny)
        lifecycleScope.launch(Dispatchers.IO) {
            val repo = GameRepository(AppDatabase.getDatabase(this@ResultActivity))
            val bestRecord = repo.getBestRecord(mapId)

            withContext(Dispatchers.Main) {
                if (bestRecord != null && bestRecord.distanceMeters == distance) {
                    binding.tvNewRecord.visibility = View.VISIBLE
                    binding.tvNewRecord.startAnimation(
                        AnimationUtils.loadAnimation(this@ResultActivity, android.R.anim.fade_in)
                    )
                }
            }
        }

        binding.tvResultEmoji.startAnimation(
            AnimationUtils.loadAnimation(this, android.R.anim.slide_in_left)
        )

        binding.btnPlayAgain.setOnClickListener {
            startActivity(Intent(this, GameActivity::class.java))
            finish()
        }

        binding.btnBackToMenu.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
            })
            finish()
        }
    }

    private fun getUserId(): String {
        val prefs = getSharedPreferences("user", MODE_PRIVATE)
        var id = prefs.getString("userId", null)
        if (id == null) {
            id = java.util.UUID.randomUUID().toString()
            prefs.edit().putString("userId", id).apply()
        }
        return id
    }

    private fun getUserName(): String {
        val prefs = getSharedPreferences("user", MODE_PRIVATE)
        return prefs.getString("userName", null) ?: "Gracz_${(1000..9999).random()}"
    }

    private fun showChangeNameDialog() {
        val input = android.widget.EditText(this)
        input.hint = "Twoja nazwa"
        val prefs = getSharedPreferences("user", MODE_PRIVATE)
        input.setText(prefs.getString("userName", ""))

        AlertDialog.Builder(this)
            .setTitle("Zmień nazwę gracza")
            .setView(input)
            .setPositiveButton("Zapisz") { _, _ ->
                val newName = input.text.toString().trim()
                if (newName.isNotEmpty()) {
                    prefs.edit().putString("userName", newName).apply()
                    Toast.makeText(this, "Nazwa zmieniona", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Anuluj", null)
            .show()
    }

    private fun mapIdToSlug(mapId: Int): String = when (mapId) {
        1 -> "prairie"
        2 -> "mountains"
        3 -> "arctic"
        4 -> "jungle"
        5 -> "sinusoida"
        else -> "prairie"
    }

    private fun vehicleIdToModel(vehicleId: Int): String = when (vehicleId) {
        1 -> "offroader"
        2 -> "muscle"
        3 -> "buggy"
        4 -> "monster"
        5 -> "quad"
        else -> "offroader"
    }
}