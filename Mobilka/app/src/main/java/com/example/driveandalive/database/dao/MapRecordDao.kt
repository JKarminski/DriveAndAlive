package com.example.driveandalive.database.dao

import androidx.room.*
import com.example.driveandalive.database.entities.MapRecord
import kotlinx.coroutines.flow.Flow

@Dao
interface MapRecordDao {

    @Query("SELECT * FROM map_records WHERE mapId = :mapId ORDER BY distanceMeters DESC LIMIT 1")
    suspend fun getBestRecord(mapId: Int): MapRecord?

    @Query("SELECT * FROM map_records WHERE mapId = :mapId ORDER BY timestamp DESC LIMIT 10")
    fun getRecentRecords(mapId: Int): Flow<List<MapRecord>>

    @Insert
    suspend fun insertRecord(record: MapRecord)

    @Query("SELECT COALESCE(SUM(distanceMeters), 0) FROM map_records")
    suspend fun getTotalDistance(): Int

    @Query("SELECT * FROM map_records ORDER BY timestamp DESC LIMIT 1")
    suspend fun getLatestRecord(): MapRecord?
}
