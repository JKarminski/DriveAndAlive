package com.example.driveandalive.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "map_records")
data class MapRecord(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val mapId: Int,
    val vehicleId: Int,
    val distanceMeters: Int,    
    val coinsEarned: Int,       
    val maxSpeedKmh: Float,     
    val gearChanges: Int,       
    val endReason: String,      
    val timestamp: Long = System.currentTimeMillis()
)
