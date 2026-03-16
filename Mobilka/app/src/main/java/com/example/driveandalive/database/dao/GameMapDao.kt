package com.example.driveandalive.database.dao

import androidx.room.*
import com.example.driveandalive.database.entities.GameMap
import kotlinx.coroutines.flow.Flow

@Dao
interface GameMapDao {
    @Query("SELECT * FROM game_maps ORDER BY id ASC")
    fun getAllMaps(): Flow<List<GameMap>>

    @Query("SELECT * FROM game_maps WHERE id = :mapId")
    suspend fun getMapById(mapId: Int): GameMap?

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(maps: List<GameMap>)

    @Query("UPDATE game_maps SET isUnlocked = 1 WHERE id = :mapId")
    suspend fun unlockMap(mapId: Int)
}
