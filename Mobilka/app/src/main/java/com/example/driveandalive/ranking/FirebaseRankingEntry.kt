package com.example.driveandalive.ranking

data class FirebaseRankingEntry(
    val userId: String = "",
    val userName: String = "Gracz",
    val distance: Int = 0,
    val coins: Int = 0,
    val timestamp: Long = 0L
)