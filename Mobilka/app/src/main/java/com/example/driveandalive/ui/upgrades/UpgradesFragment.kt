package com.example.driveandalive.ui.upgrades

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.databinding.FragmentUpgradesBinding
import com.example.driveandalive.ranking.RankingActivity
import com.example.driveandalive.repository.GameRepository
import com.example.driveandalive.repository.StatType
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class UpgradesFragment : Fragment() {

    private var _binding: FragmentUpgradesBinding? = null
    private val binding get() = _binding!!

    private val viewModel: UpgradesViewModel by viewModels {
        object : ViewModelProvider.Factory {
            override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                val db = AppDatabase.getDatabase(requireContext())
                val repository = GameRepository(db)
                return UpgradesViewModel(repository) as T
            }
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentUpgradesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnRanking.setOnClickListener {
            startActivity(Intent(requireContext(), RankingActivity::class.java))
        }

        binding.btnUpgradeEngine.setOnClickListener { viewModel.upgrade(StatType.ENGINE) }
        binding.btnUpgradeGrip.setOnClickListener { viewModel.upgrade(StatType.GRIP) }
        binding.btnUpgradeFuel.setOnClickListener { viewModel.upgrade(StatType.FUEL) }
        binding.btnUpgradeDurability.setOnClickListener { viewModel.upgrade(StatType.DURABILITY) }

        lifecycleScope.launch {
            viewModel.playerProfile.collectLatest { profile ->
                binding.tvCoinsBalance.text = "💰 ${profile?.coins ?: 0}"
            }
        }

        lifecycleScope.launch {
            viewModel.vehicleStats.collectLatest { stats ->
                if (stats == null || stats.vehicleId == -1) return@collectLatest
                val max = stats.maxLevel


                Log.d("UpgradesFrag", "Setting progress: engine=${stats.engineLevel}, max=$max")
                binding.progressEngine.max = max
                binding.progressEngine.progress = stats.engineLevel
                val engineCost = viewModel.upgradeCost(stats.engineLevel)
                binding.btnUpgradeEngine.text = if (stats.engineLevel >= max) "MAX" else "$engineCost 💰"
                binding.btnUpgradeEngine.isEnabled = stats.engineLevel < max

                binding.progressEngine.post {
                    binding.progressEngine.progress = stats.engineLevel
                }
                binding.progressEngine.invalidate() // wymusza przerysowanie

                binding.progressGrip.max = max
                binding.progressGrip.progress = stats.gripLevel
                val gripCost = viewModel.upgradeCost(stats.gripLevel)
                binding.btnUpgradeGrip.text = if (stats.gripLevel >= max) "MAX" else "$gripCost 💰"
                binding.btnUpgradeGrip.isEnabled = stats.gripLevel < max

                binding.progressGrip.post {
                    binding.progressGrip.progress = stats.gripLevel
                }
                binding.progressGrip.invalidate() // wymusza przerysowanie

                binding.progressFuel.max = max
                binding.progressFuel.progress = stats.fuelLevel
                val fuelCost = viewModel.upgradeCost(stats.fuelLevel)
                binding.btnUpgradeFuel.text = if (stats.fuelLevel >= max) "MAX" else "$fuelCost 💰"
                binding.btnUpgradeFuel.isEnabled = stats.fuelLevel < max

                binding.progressFuel.post {
                    binding.progressFuel.progress = stats.fuelLevel
                }
                binding.progressFuel.invalidate() // wymusza przerysowanie

                binding.progressDurability.max = max
                binding.progressDurability.progress = stats.durabilityLevel
                val durCost = viewModel.upgradeCost(stats.durabilityLevel)
                binding.btnUpgradeDurability.text = if (stats.durabilityLevel >= max) "MAX" else "$durCost 💰"
                binding.btnUpgradeDurability.isEnabled = stats.durabilityLevel < max

                binding.progressDurability.post {
                    binding.progressDurability.progress = stats.durabilityLevel
                }
                binding.progressDurability.invalidate() // wymusza przerysowanie
            }
        }

        lifecycleScope.launch {
            viewModel.upgradeResult.collectLatest { result ->
                val msg = when (result) {
                    is UpgradeResult.Success -> "✅ Ulepszono! (-${result.cost} monet)"
                    UpgradeResult.NotEnoughCoins -> "❌ Za mało monet!"
                    UpgradeResult.AlreadyMax -> "✅ Już na max poziomie!"
                }
                Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}