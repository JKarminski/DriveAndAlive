package com.example.driveandalive.ui.skills

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.database.entities.VehicleSkill
import com.example.driveandalive.repository.GameRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class SkillsViewModel(application: Application) : AndroidViewModel(application) {
    private val repo = GameRepository(AppDatabase.getDatabase(application))

    val playerProfile = repo.playerProfile.stateIn(viewModelScope, SharingStarted.Lazily, null)

    private val selectedVehicleId: Flow<Int> = repo.playerProfile
        .filterNotNull()
        .map { it.selectedVehicleId }

    val activeSkills: StateFlow<List<VehicleSkill>> = selectedVehicleId
        .flatMapLatest { repo.getActiveSkills(it) }
        .stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    val spinResult = MutableStateFlow<SpinResult?>(null)
    val isSpinning = MutableStateFlow(false)

    companion object {
        const val SPIN_COST = 150

        private val ALL_SKILLS = listOf(
            "nitro" to 0.20f,         
            "shield" to 0.20f,        
            "extra_fuel" to 0.25f,    
            "auto_gearbox" to 0.15f,  
            "magnet" to 0.20f         
        )
    }

    fun spinForSkill() = viewModelScope.launch {
        val vehicleId = playerProfile.value?.selectedVehicleId ?: return@launch
        val coins = playerProfile.value?.coins ?: 0
        if (coins < SPIN_COST) {
            spinResult.value = SpinResult.NotEnoughCoins
            return@launch
        }
        isSpinning.value = true
        val spent = repo.spendCoins(SPIN_COST)
        if (!spent) {
            spinResult.value = SpinResult.NotEnoughCoins
            isSpinning.value = false
            return@launch
        }

        val rand = Math.random().toFloat()
        var cumulative = 0f
        var chosenSkill = ALL_SKILLS.last().first
        for ((skill, probability) in ALL_SKILLS) {
            cumulative += probability
            if (rand <= cumulative) {
                chosenSkill = skill
                break
            }
        }

        repo.addSkill(VehicleSkill(vehicleId = vehicleId, skillType = chosenSkill))
        spinResult.value = SpinResult.Won(chosenSkill)
        isSpinning.value = false
    }
}

sealed class SpinResult {
    data class Won(val skillType: String) : SpinResult()
    object NotEnoughCoins : SpinResult()
}
