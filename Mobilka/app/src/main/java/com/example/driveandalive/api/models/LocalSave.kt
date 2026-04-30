package com.example.driveandalive.api.models

data class LocalSave(
    val saveId: Int,
    val playerUUID: String,
    val localSettings: String,
    val offlineScore: Int
)