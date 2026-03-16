package com.example.driveandalive.database.entities

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "vehicle_stats",
    foreignKeys = [ForeignKey(
        entity = Vehicle::class,
        parentColumns = ["id"],
        childColumns = ["vehicleId"],
        onDelete = ForeignKey.CASCADE
    )]
)
data class VehicleStats(
    @PrimaryKey
    val vehicleId: Int,         
    val engineLevel: Int = 1,   
    val gripLevel: Int = 1,     
    val fuelLevel: Int = 1,     
    val durabilityLevel: Int = 1, 
    val maxLevel: Int = 10      
)
