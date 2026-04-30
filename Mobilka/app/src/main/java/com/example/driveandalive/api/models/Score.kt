package com.example.driveandalive.api.models

import com.google.firebase.database.IgnoreExtraProperties
import com.google.firebase.database.PropertyName
import com.google.gson.annotations.SerializedName

@IgnoreExtraProperties
data class Score(
    @get:PropertyName("scoreId") @set:PropertyName("scoreId") var scoreId: Int = 0,
    @get:PropertyName("playerUUID") @set:PropertyName("playerUUID") var playerUUID: String = "",
    @get:PropertyName("playerName") @set:PropertyName("playerName") var playerName: String = "",
    @get:PropertyName("trackSlug") @set:PropertyName("trackSlug") var trackSlug: String = "",
    @get:PropertyName("carModel") @set:PropertyName("carModel") var carModel: String = "",
    @get:PropertyName("points") @set:PropertyName("points") var points: Int = 0,
    @get:PropertyName("time") @set:PropertyName("time") var time: String? = null
) {
    // Konstruktor bezargumentowy wymagany przez Firebase
    constructor() : this(0, "", "", "", "", 0, null)
}