package com.example.driveandalive.api.repository

import com.example.driveandalive.api.ApiService
import com.example.driveandalive.api.models.Score
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class ApiRankingRepository(
    private val apiService: ApiService
) : RankingRepository {

    override fun getRanking(trackSlug: String?, carModel: String?): Flow<List<Score>> = flow {
        val result = apiService.getScores(trackSlug, carModel)
        emit(result)
    }

    override suspend fun submitScore(score: Score): Result<Score> = runCatching {
        apiService.submitScore(score)
    }
}