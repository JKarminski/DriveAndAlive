package com.example.driveandalive.ui.upgrades

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.database.entities.VehicleStats
import com.example.driveandalive.repository.GameRepository
import com.example.driveandalive.repository.StatType
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import kotlin.math.pow

class UpgradesViewModel(application: Application) : AndroidViewModel(application) {
    private val repo = GameRepository(AppDatabase.getDatabase(application))

    val playerProfile = repo.playerProfile.stateIn(viewModelScope, SharingStarted.Lazily, null)

    private val selectedVehicleId: Flow<Int> = repo.playerProfile
        .filterNotNull()
        .map { it.selectedVehicleId }

    val vehicleStats: StateFlow<VehicleStats?> = selectedVehicleId
        .flatMapLatest { repo.getVehicleStats(it) }
        .stateIn(viewModelScope, SharingStarted.Lazily, null)

    val upgradeResult = MutableStateFlow<UpgradeResult?>(null)

    fun upgradeCost(currentLevel: Int): Int = (50 * currentLevel.toDouble().pow(1.5)).toInt()

    fun upgrade(stat: StatType) = viewModelScope.launch {
        val stats = vehicleStats.value ?: return@launch
        val vehicleId = playerProfile.value?.selectedVehicleId ?: return@launch
        val currentLevel = when (stat) {
            StatType.ENGINE -> stats.engineLevel
            StatType.GRIP -> stats.gripLevel
            StatType.FUEL -> stats.fuelLevel
            StatType.DURABILITY -> stats.durabilityLevel
        }
        if (currentLevel >= stats.maxLevel) {
            upgradeResult.value = UpgradeResult.AlreadyMax
            return@launch
        }
        val cost = upgradeCost(currentLevel)
        val success = repo.upgradeVehicleStat(vehicleId, stat, cost)
        upgradeResult.value = if (success) UpgradeResult.Success(cost) else UpgradeResult.NotEnoughCoins
    }
}

sealed class UpgradeResult {
    data class Success(val cost: Int) : UpgradeResult()
    object NotEnoughCoins : UpgradeResult()
    object AlreadyMax : UpgradeResult()
}
