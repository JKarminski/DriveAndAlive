package com.example.driveandalive.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.driveandalive.database.dao.*
import com.example.driveandalive.database.entities.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlin.Float

@Database(
    entities = [
        Vehicle::class,
        VehicleStats::class,
        VehicleSkill::class,
        GameMap::class,
        MapRecord::class,
        PlayerProfile::class
    ],
    version = 19,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun vehicleDao(): VehicleDao
    abstract fun vehicleStatsDao(): VehicleStatsDao
    abstract fun vehicleSkillDao(): VehicleSkillDao
    abstract fun gameMapDao(): GameMapDao
    abstract fun mapRecordDao(): MapRecordDao
    abstract fun playerProfileDao(): PlayerProfileDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "drive_alive_v19.db"
                )
                    .fallbackToDestructiveMigration() // reset przy zmianie wersji
                    .addCallback(DatabaseCallback(context))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        fun resetDatabase(context: Context) {
            synchronized(this) {
                INSTANCE?.close()
                INSTANCE = null
                context.applicationContext.deleteDatabase("drive_alive_v19.db")
            }
        }
    }

    private class DatabaseCallback(private val context: Context) : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            INSTANCE?.let { database ->
                CoroutineScope(Dispatchers.IO).launch {
                    seedDatabase(database, context)
                }
            }
        }

        private suspend fun seedDatabase(database: AppDatabase, context: Context) {

            val vehicles = listOf(
                Vehicle(id = 1, name = "Terenówka", description = "Solidny SUV do każdego terenu",
                    drawableName = "car_01_offroader", isUnlocked = true, unlockCost = 0, wheelDrawableName = "car_01_wheel", wheelVerticalBias = 0.22f,
                    carBodyVerticalOffset = -0.2f),
                Vehicle(id = 2, name = "Muscle Car", description = "Mocny silnik, słaby grip",
                    drawableName = "car_02_muscle", isUnlocked = false, unlockCost = 300, wheelDrawableName = "car_02_wheel", wheelVerticalBias = 0.14f),
                Vehicle(id = 3, name = "Buggy", description = "Lekki i zwinny – mistrz pagórków",
                    drawableName = "car_03_buggy", isUnlocked = false, unlockCost = 600, wheelDrawableName = "car_03_wheel", wheelVerticalBias = 0.195f,
                    carBodyVerticalOffset = -0.2f),
                Vehicle(id = 4, name = "Monster Truck", description = "Potężny – przejedzie wszystko",
                    drawableName = "car_04_monster", isUnlocked = false, unlockCost = 1200, wheelDrawableName = "car_04_wheel", wheelVerticalBias = 0.21f,
                    carBodyVerticalOffset = -0.3f),
                Vehicle(id = 5, name = "Quad ATV", description = "Małe, ale zwrotne",
                    drawableName = "car_05_atv", isUnlocked = false, unlockCost = 900, wheelDrawableName = "car_05_wheel", wheelVerticalBias = 0.35f,
                    wheelLeftBias = 0.7f, wheelRightBias = 0.24f, carBodyVerticalOffset = -0.4f)
            )
            database.vehicleDao().insertAll(vehicles)

            vehicles.forEach { vehicle ->
                database.vehicleStatsDao().insertStats(
                    VehicleStats(vehicleId = vehicle.id)
                )
            }

            val mapsList = mutableListOf<GameMap>()
            try {
                val mapFiles = context.assets.list("maps") ?: emptyArray()
                for (file in mapFiles) {
                    if (file.endsWith(".json")) {
                        val jsonString = context.assets.open("maps/$file").bufferedReader().use { it.readText() }
                        val json = org.json.JSONObject(jsonString)
                        mapsList.add(
                            GameMap(
                                id = json.getInt("id"),
                                name = json.getString("name"),
                                description = json.getString("description"),
                                drawableName = json.getString("drawableName"),
                                difficultyBase = json.getInt("difficultyBase"),
                                isUnlocked = json.getBoolean("isUnlocked"),
                                unlockCost = json.getInt("unlockCost"),
                                hasWeatherApi = json.getBoolean("hasWeatherApi"),
                                latitude = if (json.has("latitude")) json.getDouble("latitude") else 52.0,
                                longitude = if (json.has("longitude")) json.getDouble("longitude") else 21.0
                            )
                        )
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
            database.gameMapDao().insertAll(mapsList)

            database.playerProfileDao().insertProfile(
                PlayerProfile(id = 1, coins = 500)
            )
        }
    }
}
