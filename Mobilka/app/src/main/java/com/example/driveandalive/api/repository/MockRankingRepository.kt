package com.example.driveandalive.api.repository

import com.example.driveandalive.api.models.Score
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class MockRankingRepository : RankingRepository {

    // Przykładowe dane – różne mapy i pojazdy (slugi)
    private val mockScores = mutableListOf(
        Score(playerUUID = "user1", playerName = "Gracz1", trackSlug = "prairie", carModel = "offroader", points = 1500),
        Score(playerUUID = "user2", playerName = "Gracz2", trackSlug = "prairie", carModel = "muscle", points = 1200),
        Score(playerUUID = "user3", playerName = "Gracz3", trackSlug = "mountains", carModel = "offroader", points = 1800),
        Score(playerUUID = "user4", playerName = "Gracz4", trackSlug = "arctic", carModel = "buggy", points = 950),
        Score(playerUUID = "user5", playerName = "Gracz5", trackSlug = "jungle", carModel = "monster", points = 2100),
        Score(playerUUID = "user6", playerName = "Gracz6", trackSlug = "prairie", carModel = "quad", points = 800),
        Score(playerUUID = "user7", playerName = "Gracz7", trackSlug = "mountains", carModel = "muscle", points = 1700),
        Score(playerUUID = "user8", playerName = "Gracz8", trackSlug = "sinusoida", carModel = "offroader", points = 2200)
    )

    override fun getRanking(trackSlug: String?, carModel: String?): Flow<List<Score>> = flow {
        android.util.Log.d("RankingRepo", "getRanking: trackSlug=$trackSlug, carModel=$carModel")
        delay(500)
        val filtered = mockScores.filter { score ->
            (trackSlug == null || score.trackSlug == trackSlug) &&
                    (carModel == null || score.carModel == carModel)
        }.sortedByDescending { it.points }
        android.util.Log.d("RankingRepo", "Filtered count: ${filtered.size}")
        emit(filtered)
    }

    override suspend fun submitScore(score: Score): Result<Score> {
        delay(300)
        val newScore = score.copy(scoreId = mockScores.size + 1)
        mockScores.add(newScore)
        return Result.success(newScore)
    }
}