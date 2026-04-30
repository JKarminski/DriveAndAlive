package com.example.driveandalive.ui.upgrades

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.driveandalive.database.entities.PlayerProfile
import com.example.driveandalive.database.entities.VehicleStats
import com.example.driveandalive.repository.GameRepository
import com.example.driveandalive.repository.StatType
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class UpgradesViewModel(
    private val repository: GameRepository
) : ViewModel() {

    val playerProfile: Flow<PlayerProfile?> = repository.playerProfile

    private val selectedVehicleId: Flow<Int> = playerProfile
        .filterNotNull()
        .map { it.selectedVehicleId }
        .distinctUntilChanged()

    // MutableStateFlow do ręcznej aktualizacji
    private val _vehicleStats = MutableStateFlow<VehicleStats?>(null)
    val vehicleStats: StateFlow<VehicleStats?> = _vehicleStats.asStateFlow()

    init {
        viewModelScope.launch {
            selectedVehicleId.collect { vehicleId ->
                Log.d("UpgradesVM", "Selected vehicle changed: $vehicleId")
                val stats = repository.getOrCreateVehicleStats(vehicleId)
                _vehicleStats.value = stats
            }
        }
    }

    fun upgradeCost(currentLevel: Int): Int = 50 + currentLevel * 10

    private val _upgradeResult = MutableSharedFlow<UpgradeResult>()
    val upgradeResult: SharedFlow<UpgradeResult> = _upgradeResult.asSharedFlow()

    fun upgrade(statType: StatType) {
        viewModelScope.launch {
            val currentStats = _vehicleStats.value ?: return@launch
            val profile = playerProfile.first() ?: return@launch

            val currentLevel = when (statType) {
                StatType.ENGINE -> currentStats.engineLevel
                StatType.GRIP -> currentStats.gripLevel
                StatType.FUEL -> currentStats.fuelLevel
                StatType.DURABILITY -> currentStats.durabilityLevel
            }

            if (currentLevel >= currentStats.maxLevel) {
                _upgradeResult.emit(UpgradeResult.AlreadyMax)
                return@launch
            }

            val cost = upgradeCost(currentLevel)
            if (profile.coins < cost) {
                _upgradeResult.emit(UpgradeResult.NotEnoughCoins)
                return@launch
            }

            val success = repository.upgradeVehicleStat(profile.selectedVehicleId, statType, cost)
            if (success) {
                val updated = repository.getOrCreateVehicleStats(profile.selectedVehicleId)
                _vehicleStats.value = updated
                _upgradeResult.emit(UpgradeResult.Success(cost))
            } else {
                _upgradeResult.emit(UpgradeResult.NotEnoughCoins)
            }
        }
    }
}

sealed class UpgradeResult {
    data class Success(val cost: Int) : UpgradeResult()
    object NotEnoughCoins : UpgradeResult()
    object AlreadyMax : UpgradeResult()
}