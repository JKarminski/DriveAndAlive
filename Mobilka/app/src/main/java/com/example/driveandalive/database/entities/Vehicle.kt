package com.example.driveandalive.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "vehicles")
data class Vehicle(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val name: String,           
    val description: String,   
    val drawableName: String,  
    val isUnlocked: Boolean = false,
    val unlockCost: Int = 0    
)
