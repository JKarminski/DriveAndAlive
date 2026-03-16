package com.example.driveandalive.ui.result

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.animation.AnimationUtils
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.driveandalive.MainActivity
import com.example.driveandalive.R
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

        val distance = intent.getIntExtra("distance", 0)
        val coins = intent.getIntExtra("coins", 0)
        val maxSpeed = intent.getFloatExtra("maxSpeed", 0f)
        val gearChanges = intent.getIntExtra("gearChanges", 0)
        val endReason = intent.getStringExtra("endReason") ?: "fuel"

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

        lifecycleScope.launch(Dispatchers.IO) {
            val repo = GameRepository(AppDatabase.getDatabase(this@ResultActivity))
            val profile = repo.playerProfile
            val mapId = AppDatabase.getDatabase(this@ResultActivity)
                .playerProfileDao().getProfileSuspend()?.selectedMapId ?: 1
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
}
