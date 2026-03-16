package com.example.driveandalive.ui.mapselection

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.database.entities.GameMap
import com.example.driveandalive.network.CurrentWeather
import com.example.driveandalive.repository.GameRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MapSelectionViewModel(application: Application) : AndroidViewModel(application) {
    private val repo = GameRepository(AppDatabase.getDatabase(application))

    val maps = repo.allMaps.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())
    val playerProfile = repo.playerProfile.stateIn(viewModelScope, SharingStarted.Lazily, null)

    val currentWeather = MutableLiveData<CurrentWeather?>(null)

    fun selectMap(mapId: Int) = viewModelScope.launch {
        repo.setSelectedMap(mapId)
    }

    fun unlockMap(map: GameMap) = viewModelScope.launch {
        val success = repo.spendCoins(map.unlockCost)
        if (success) repo.unlockMap(map.id)
    }

    fun loadWeather(map: GameMap) = viewModelScope.launch {
        if (map.hasWeatherApi) {
            val result = repo.getWeatherForMap(map)
            currentWeather.postValue(result?.current)
        } else {
            currentWeather.postValue(null)
        }
    }
}
