package com.example.driveandalive.repository

import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.database.entities.*
import com.example.driveandalive.network.RetrofitClient
import com.example.driveandalive.network.WeatherResult
import kotlinx.coroutines.flow.Flow

class GameRepository(private val db: AppDatabase) {

    val playerProfile: Flow<PlayerProfile?> = db.playerProfileDao().getProfile()

    suspend fun getCoins(): Int = db.playerProfileDao().getCoins()

    suspend fun spendCoins(amount: Int): Boolean {
        val changed = db.playerProfileDao().spendCoins(amount)
        return changed > 0
    }

    suspend fun addCoins(amount: Int) = db.playerProfileDao().addCoins(amount)

    suspend fun setSelectedVehicle(vehicleId: Int) =
        db.playerProfileDao().setSelectedVehicle(vehicleId)

    suspend fun setSelectedMap(mapId: Int) =
        db.playerProfileDao().setSelectedMap(mapId)

    suspend fun updateAfterRun(distance: Int, coins: Int) =
        db.playerProfileDao().updateAfterRun(distance, coins)

    val allVehicles: Flow<List<Vehicle>> = db.vehicleDao().getAllVehicles()

    suspend fun getVehicleById(id: Int): Vehicle? = db.vehicleDao().getVehicleById(id)

    suspend fun unlockVehicle(vehicleId: Int) = db.vehicleDao().unlockVehicle(vehicleId)

    fun getVehicleStats(vehicleId: Int): Flow<VehicleStats?> =
        db.vehicleStatsDao().getStats(vehicleId)

    suspend fun getVehicleStatsSuspend(vehicleId: Int): VehicleStats? =
        db.vehicleStatsDao().getStatsSuspend(vehicleId)

    suspend fun upgradeVehicleStat(vehicleId: Int, stat: StatType, cost: Int): Boolean {
        val spent = spendCoins(cost)
        if (!spent) return false
        when (stat) {
            StatType.ENGINE -> db.vehicleStatsDao().upgradeEngine(vehicleId)
            StatType.GRIP -> db.vehicleStatsDao().upgradeGrip(vehicleId)
            StatType.FUEL -> db.vehicleStatsDao().upgradeFuel(vehicleId)
            StatType.DURABILITY -> db.vehicleStatsDao().upgradeDurability(vehicleId)
        }
        return true
    }

    fun getActiveSkills(vehicleId: Int): Flow<List<VehicleSkill>> =
        db.vehicleSkillDao().getActiveSkills(vehicleId)

    suspend fun addSkill(skill: VehicleSkill) = db.vehicleSkillDao().insertSkill(skill)

    suspend fun deactivateSkill(skillId: Int) = db.vehicleSkillDao().deactivateSkill(skillId)

    val allMaps: Flow<List<GameMap>> = db.gameMapDao().getAllMaps()

    suspend fun getMapById(id: Int): GameMap? = db.gameMapDao().getMapById(id)

    suspend fun unlockMap(mapId: Int) = db.gameMapDao().unlockMap(mapId)

    suspend fun getBestRecord(mapId: Int): MapRecord? = db.mapRecordDao().getBestRecord(mapId)

    fun getRecentRecords(mapId: Int): Flow<List<MapRecord>> =
        db.mapRecordDao().getRecentRecords(mapId)

    suspend fun saveRecord(record: MapRecord) = db.mapRecordDao().insertRecord(record)

    suspend fun getLatestRecord(): MapRecord? = db.mapRecordDao().getLatestRecord()

    suspend fun getWeatherForMap(map: GameMap): WeatherResult? {
        if (!map.hasWeatherApi) return null
        return try {
            RetrofitClient.weatherApi.getCurrentWeather(
                latitude = map.latitude,
                longitude = map.longitude,
                currentParams = "rain,wind_speed_10m,weather_code"
            )
        } catch (e: Exception) {
            null 
        }
    }
}

enum class StatType { ENGINE, GRIP, FUEL, DURABILITY }
