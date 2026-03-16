package com.example.driveandalive.ui.carselection

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.database.entities.Vehicle
import com.example.driveandalive.repository.GameRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class CarSelectionViewModel(application: Application) : AndroidViewModel(application) {
    private val repo = GameRepository(AppDatabase.getDatabase(application))

    val vehicles = repo.allVehicles.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())
    val playerProfile = repo.playerProfile.stateIn(viewModelScope, SharingStarted.Lazily, null)

    fun selectVehicle(vehicleId: Int) = viewModelScope.launch {
        repo.setSelectedVehicle(vehicleId)
    }

    fun unlockVehicle(vehicle: Vehicle) = viewModelScope.launch {
        val success = repo.spendCoins(vehicle.unlockCost)
        if (success) repo.unlockVehicle(vehicle.id)
    }
}
