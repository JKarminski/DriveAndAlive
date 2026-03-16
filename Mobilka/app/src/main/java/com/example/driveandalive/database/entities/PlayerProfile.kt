package com.example.driveandalive.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "player_profile")
data class PlayerProfile(
    @PrimaryKey
    val id: Int = 1,           
    val coins: Int = 500,      
    val selectedVehicleId: Int = 1,
    val selectedMapId: Int = 1,
    val totalDistanceMeters: Int = 0,
    val totalCoinsEarned: Int = 0,
    val totalRuns: Int = 0
)
