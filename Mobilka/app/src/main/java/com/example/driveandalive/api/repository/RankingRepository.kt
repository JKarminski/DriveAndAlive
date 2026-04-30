package com.example.driveandalive.api.repository

import com.example.driveandalive.api.models.Score
import kotlinx.coroutines.flow.Flow

interface RankingRepository {
    fun getRanking(trackSlug: String?, carModel: String?): Flow<List<Score>>
    suspend fun submitScore(score: Score): Result<Score>
}