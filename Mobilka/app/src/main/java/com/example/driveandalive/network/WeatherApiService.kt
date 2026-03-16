package com.example.driveandalive.network

import com.google.gson.annotations.SerializedName
import retrofit2.http.GET
import retrofit2.http.Query

interface WeatherApiService {
    @GET("v1/forecast")
    suspend fun getCurrentWeather(
        @Query("latitude") latitude: Double,
        @Query("longitude") longitude: Double,
        @Query("current") currentParams: String,
        @Query("forecast_days") forecastDays: Int = 1
    ): WeatherResult
}

data class WeatherResult(
    val current: CurrentWeather?
)

data class CurrentWeather(
    val rain: Float = 0f,
    @SerializedName("wind_speed_10m") val windSpeed: Float = 0f,
    @SerializedName("weather_code") val weatherCode: Int = 0
) {

    val isRaining: Boolean get() = rain > 0f

    val isWindy: Boolean get() = windSpeed > 30f

    val isStormy: Boolean get() = weatherCode >= 80

    val description: String get() = when {
        isStormy -> "⛈ Burza"
        isRaining -> "🌧 Deszcz"
        isWindy -> "💨 Wiatr"
        else -> "☀ Słonecznie"
    }

    val gripModifier: Float get() = if (isRaining) 0.8f else 1.0f

    val fuelDrainModifier: Float get() = if (isStormy) 1.1f else 1.0f
}
