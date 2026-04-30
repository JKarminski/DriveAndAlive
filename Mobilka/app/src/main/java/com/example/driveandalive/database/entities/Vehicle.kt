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
    val wheelDrawableName: String,
    val isUnlocked: Boolean = false,
    val unlockCost: Int = 0,
    val wheelLeftBias: Float = 0.75f,
    val wheelRightBias: Float = 0.28f,
    val wheelVerticalBias: Float = 0.33f,
    val carBodyVerticalOffset: Float = 0f
) {
    override fun toString(): String = name
}