package com.example.driveandalive.database.dao

import androidx.room.*
import com.example.driveandalive.database.entities.VehicleStats
import kotlinx.coroutines.flow.Flow

@Dao
interface VehicleStatsDao {
    @Query("SELECT * FROM vehicle_stats WHERE vehicleId = :vehicleId")
    fun getStats(vehicleId: Int): Flow<VehicleStats?>

    @Query("SELECT * FROM vehicle_stats WHERE vehicleId = :vehicleId")
    suspend fun getStatsSuspend(vehicleId: Int): VehicleStats?

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertStats(stats: VehicleStats)

    @Update
    suspend fun updateStats(stats: VehicleStats)

    @Query("UPDATE vehicle_stats SET engineLevel = MIN(engineLevel + 1, maxLevel) WHERE vehicleId = :vehicleId")
    suspend fun upgradeEngine(vehicleId: Int)

    @Query("UPDATE vehicle_stats SET gripLevel = MIN(gripLevel + 1, maxLevel) WHERE vehicleId = :vehicleId")
    suspend fun upgradeGrip(vehicleId: Int)

    @Query("UPDATE vehicle_stats SET fuelLevel = MIN(fuelLevel + 1, maxLevel) WHERE vehicleId = :vehicleId")
    suspend fun upgradeFuel(vehicleId: Int)

    @Query("UPDATE vehicle_stats SET durabilityLevel = MIN(durabilityLevel + 1, maxLevel) WHERE vehicleId = :vehicleId")
    suspend fun upgradeDurability(vehicleId: Int)
}
