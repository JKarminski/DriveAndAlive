package com.example.driveandalive

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.databinding.ActivityMainBinding
import com.example.driveandalive.repository.GameRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var repo: GameRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val db = AppDatabase.getDatabase(this)
        repo = GameRepository(db)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        val navController = navHostFragment.navController

        binding.bottomNavigationView.setupWithNavController(navController)

        binding.btnPlayGlobal.setOnClickListener {
            startActivity(android.content.Intent(this, com.example.driveandalive.ui.game.GameActivity::class.java))
        }

        // DEBUG: Add 1000 coins
        binding.btnDebugAddCoins.setOnClickListener {
            lifecycleScope.launch(Dispatchers.IO) {
                repo.addCoins(1000)
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@MainActivity, "+1000 💰 dodano!", Toast.LENGTH_SHORT).show()
                }
            }
        }

        // DEBUG: Reset all data
        binding.btnDebugReset.setOnClickListener {
            AlertDialog.Builder(this)
                .setTitle("♻ Reset aplikacji")
                .setMessage("Czy na pewno chcesz zresetować wszystkie dane? Monety, ulepszenia i rekordy zostaną usunięte.")
                .setPositiveButton("Tak, resetuj") { _, _ ->
                    lifecycleScope.launch(Dispatchers.IO) {
                        // Delete and recreate the database
                        AppDatabase.resetDatabase(this@MainActivity)
                        withContext(Dispatchers.Main) {
                            Toast.makeText(this@MainActivity, "✅ Zresetowano! Uruchom ponownie.", Toast.LENGTH_LONG).show()
                            // Restart activity to reinitialize everything
                            finish()
                            startActivity(intent)
                        }
                    }
                }
                .setNegativeButton("Anuluj", null)
                .show()
        }
    }
}
