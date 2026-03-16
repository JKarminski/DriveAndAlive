package com.example.driveandalive.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "game_maps")
data class GameMap(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val name: String,
    val description: String,
    val drawableName: String,   
    val difficultyBase: Int = 1, 
    val isUnlocked: Boolean = false,
    val unlockCost: Int = 0,
    val hasWeatherApi: Boolean = false,  
    val latitude: Double = 52.0,         
    val longitude: Double = 21.0
)
