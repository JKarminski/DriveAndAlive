package com.example.driveandalive.database.dao

import androidx.room.*
import com.example.driveandalive.database.entities.VehicleSkill
import kotlinx.coroutines.flow.Flow

@Dao
interface VehicleSkillDao {
    @Query("SELECT * FROM vehicle_skills WHERE vehicleId = :vehicleId AND isActive = 1")
    fun getActiveSkills(vehicleId: Int): Flow<List<VehicleSkill>>

    @Query("SELECT * FROM vehicle_skills WHERE vehicleId = :vehicleId AND isActive = 1")
    suspend fun getActiveSkillsSuspend(vehicleId: Int): List<VehicleSkill>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSkill(skill: VehicleSkill)

    @Query("UPDATE vehicle_skills SET isActive = 0 WHERE id = :skillId")
    suspend fun deactivateSkill(skillId: Int)

    @Query("DELETE FROM vehicle_skills WHERE vehicleId = :vehicleId")
    suspend fun clearSkills(vehicleId: Int)
}
