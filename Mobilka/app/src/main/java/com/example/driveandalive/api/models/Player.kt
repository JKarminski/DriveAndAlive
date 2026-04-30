package com.example.driveandalive.api.models

import com.google.gson.annotations.SerializedName
import java.util.Date

data class Player(
    @SerializedName("UUID")
    val uuid: String,
    @SerializedName("Username")
    val username: String,
    @SerializedName("AvatarSeed")
    val avatarSeed: String? = null,
    @SerializedName("CreatedAt")
    val createdAt: Date? = null
)