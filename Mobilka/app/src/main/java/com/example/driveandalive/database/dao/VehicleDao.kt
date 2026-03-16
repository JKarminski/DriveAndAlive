package com.example.driveandalive.database.dao

import androidx.room.*
import com.example.driveandalive.database.entities.Vehicle
import kotlinx.coroutines.flow.Flow

@Dao
interface VehicleDao {

    @Query("SELECT * FROM vehicles ORDER BY id ASC")
    fun getAllVehicles(): Flow<List<Vehicle>>

    @Query("SELECT * FROM vehicles WHERE id = :vehicleId")
    suspend fun getVehicleById(vehicleId: Int): Vehicle?

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertVehicle(vehicle: Vehicle)

    @Query("UPDATE vehicles SET isUnlocked = 1 WHERE id = :vehicleId")
    suspend fun unlockVehicle(vehicleId: Int)

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(vehicles: List<Vehicle>)
}
