package com.example.driveandalive.ui.upgrades

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import com.example.driveandalive.databinding.FragmentUpgradesBinding
import com.example.driveandalive.repository.StatType
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class UpgradesFragment : Fragment() {

    private var _binding: FragmentUpgradesBinding? = null
    private val binding get() = _binding!!
    private val viewModel: UpgradesViewModel by viewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentUpgradesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnUpgradeEngine.setOnClickListener { viewModel.upgrade(StatType.ENGINE) }
        binding.btnUpgradeGrip.setOnClickListener { viewModel.upgrade(StatType.GRIP) }
        binding.btnUpgradeFuel.setOnClickListener { viewModel.upgrade(StatType.FUEL) }
        binding.btnUpgradeDurability.setOnClickListener { viewModel.upgrade(StatType.DURABILITY) }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.playerProfile.collectLatest { profile ->
                binding.tvCoinsBalance.text = "💰 ${profile?.coins ?: 0}"
            }
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.vehicleStats.collectLatest { stats ->
                stats ?: return@collectLatest
                val max = stats.maxLevel

                binding.progressEngine.max = max
                binding.progressEngine.progress = stats.engineLevel
                binding.tvEngineLevel.text = "Poz. ${stats.engineLevel}/$max"
                val engineCost = viewModel.upgradeCost(stats.engineLevel)
                binding.btnUpgradeEngine.text = if (stats.engineLevel >= max) "MAX" else "$engineCost 💰"
                binding.btnUpgradeEngine.isEnabled = stats.engineLevel < max

                binding.progressGrip.max = max
                binding.progressGrip.progress = stats.gripLevel
                binding.tvGripLevel.text = "Poz. ${stats.gripLevel}/$max"
                val gripCost = viewModel.upgradeCost(stats.gripLevel)
                binding.btnUpgradeGrip.text = if (stats.gripLevel >= max) "MAX" else "$gripCost 💰"
                binding.btnUpgradeGrip.isEnabled = stats.gripLevel < max

                binding.progressFuel.max = max
                binding.progressFuel.progress = stats.fuelLevel
                binding.tvFuelLevel.text = "Poz. ${stats.fuelLevel}/$max"
                val fuelCost = viewModel.upgradeCost(stats.fuelLevel)
                binding.btnUpgradeFuel.text = if (stats.fuelLevel >= max) "MAX" else "$fuelCost 💰"
                binding.btnUpgradeFuel.isEnabled = stats.fuelLevel < max

                binding.progressDurability.max = max
                binding.progressDurability.progress = stats.durabilityLevel
                binding.tvDurabilityLevel.text = "Poz. ${stats.durabilityLevel}/$max"
                val durCost = viewModel.upgradeCost(stats.durabilityLevel)
                binding.btnUpgradeDurability.text = if (stats.durabilityLevel >= max) "MAX" else "$durCost 💰"
                binding.btnUpgradeDurability.isEnabled = stats.durabilityLevel < max
            }
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.upgradeResult.collectLatest { result ->
                result ?: return@collectLatest
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
