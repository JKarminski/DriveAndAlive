package com.example.driveandalive.api.models

data class Achievement(
    val slug: String,
    val playerUUID: String,
    val unlockedAt: Long
)