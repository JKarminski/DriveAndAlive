package com.example.driveandalive.ranking

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.driveandalive.api.models.Score
import com.example.driveandalive.api.repository.MockRankingRepository
import com.example.driveandalive.api.repository.RankingRepository
import kotlinx.coroutines.flow.*

class RankingViewModel(
    private val repository: RankingRepository = MockRankingRepository() // na razie mock
) : ViewModel() {

    private val _trackSlug = MutableStateFlow<String?>(null)
    private val _carModel = MutableStateFlow<String?>(null)

    val ranking: StateFlow<List<Score>> = combine(_trackSlug, _carModel) { track, car ->
        Pair(track, car)
    }.flatMapLatest { (track, car) ->
        repository.getRanking(track, car)
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    fun setTrack(trackSlug: String?) { _trackSlug.value = trackSlug }
    fun setCar(carModel: String?) { _carModel.value = carModel }

    suspend fun submitScore(score: Score): Result<Score> = repository.submitScore(score)
}