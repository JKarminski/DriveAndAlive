package com.example.driveandalive.api
import com.example.driveandalive.api.models.Player
import com.example.driveandalive.api.models.Score
import retrofit2.http.*

interface ApiService {

    @GET("scores")
    suspend fun getScores(
        @Query("trackSlug") trackSlug: String? = null,
        @Query("carModel") carModel: String? = null
    ): List<Score>

    @POST("scores")
    suspend fun submitScore(@Body score: Score): Score

    @GET("players/{uuid}")
    suspend fun getPlayer(@Path("uuid") uuid: String): Player

    @POST("players")
    suspend fun createPlayer(@Body player: Player): Player
}