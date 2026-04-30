package com.example.driveandalive.ranking

data class RankingEntry(
    val userId: String = "",
    val userName: String = "Gracz",
    val coins: Int = 0,
    val totalDistance: Int = 0
)