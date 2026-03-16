package com.example.driveandalive.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "vehicle_skills")
data class VehicleSkill(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val vehicleId: Int,        
    val skillType: String,     
    val isActive: Boolean = true
)
