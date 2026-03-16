package com.example.driveandalive.database.dao

import androidx.room.*
import com.example.driveandalive.database.entities.PlayerProfile
import kotlinx.coroutines.flow.Flow

@Dao
interface PlayerProfileDao {
    @Query("SELECT * FROM player_profile WHERE id = 1")
    fun getProfile(): Flow<PlayerProfile?>

    @Query("SELECT * FROM player_profile WHERE id = 1")
    suspend fun getProfileSuspend(): PlayerProfile?

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertProfile(profile: PlayerProfile)

    @Update
    suspend fun updateProfile(profile: PlayerProfile)

    @Query("UPDATE player_profile SET coins = coins + :amount WHERE id = 1")
    suspend fun addCoins(amount: Int)

    @Query("UPDATE player_profile SET coins = coins - :amount WHERE id = 1 AND coins >= :amount")
    suspend fun spendCoins(amount: Int): Int  

    @Query("SELECT coins FROM player_profile WHERE id = 1")
    suspend fun getCoins(): Int

    @Query("UPDATE player_profile SET selectedVehicleId = :vehicleId WHERE id = 1")
    suspend fun setSelectedVehicle(vehicleId: Int)

    @Query("UPDATE player_profile SET selectedMapId = :mapId WHERE id = 1")
    suspend fun setSelectedMap(mapId: Int)

    @Query("""UPDATE player_profile 
              SET totalDistanceMeters = totalDistanceMeters + :distance,
                  totalCoinsEarned = totalCoinsEarned + :coins,
                  totalRuns = totalRuns + 1
              WHERE id = 1""")
    suspend fun updateAfterRun(distance: Int, coins: Int)
}
