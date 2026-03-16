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

@Database(
    entities = [
        Vehicle::class,
        VehicleStats::class,
        VehicleSkill::class,
        GameMap::class,
        MapRecord::class,
        PlayerProfile::class
    ],
    version = 1,
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
                    "drive_alive.db"
                )
                    .addCallback(DatabaseCallback())
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }

    private class DatabaseCallback : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            INSTANCE?.let { database ->
                CoroutineScope(Dispatchers.IO).launch {
                    seedDatabase(database)
                }
            }
        }

        private suspend fun seedDatabase(database: AppDatabase) {

            val vehicles = listOf(
                Vehicle(id = 1, name = "Terenówka", description = "Solidny SUV do każdego terenu",
                    drawableName = "car_01_offroader", isUnlocked = true, unlockCost = 0),
                Vehicle(id = 2, name = "Muscle Car", description = "Mocny silnik, słaby grip",
                    drawableName = "car_02_muscle", isUnlocked = false, unlockCost = 300),
                Vehicle(id = 3, name = "Buggy", description = "Lekki i zwinny – mistrz pagórków",
                    drawableName = "car_03_buggy", isUnlocked = false, unlockCost = 600),
                Vehicle(id = 4, name = "Monster Truck", description = "Potężny – przejedzie wszystko",
                    drawableName = "car_04_monster", isUnlocked = false, unlockCost = 1200),
                Vehicle(id = 5, name = "Quad ATV", description = "Małe, ale zwrotne",
                    drawableName = "car_05_atv", isUnlocked = false, unlockCost = 900)
            )
            database.vehicleDao().insertAll(vehicles)

            vehicles.forEach { vehicle ->
                database.vehicleStatsDao().insertStats(
                    VehicleStats(vehicleId = vehicle.id)
                )
            }

            val maps = listOf(
                GameMap(id = 1, name = "Preria", description = "Płaski teren dla początkujących",
                    drawableName = "map_01_prairie", difficultyBase = 1,
                    isUnlocked = true, unlockCost = 0,
                    hasWeatherApi = false),
                GameMap(id = 2, name = "Góry", description = "Strome zbocza i ostre zakręty",
                    drawableName = "map_02_mountains", difficultyBase = 2,
                    isUnlocked = false, unlockCost = 400,
                    hasWeatherApi = false),
                GameMap(id = 3, name = "Arktyk", description = "Lód i śnieg – zmienna pogoda!",
                    drawableName = "map_03_arctic", difficultyBase = 3,
                    isUnlocked = false, unlockCost = 800,
                    hasWeatherApi = true, latitude = 69.6, longitude = 18.9),
                GameMap(id = 4, name = "Dżungla", description = "Tropikalna burza zmienia wszystko",
                    drawableName = "map_04_jungle", difficultyBase = 2,
                    isUnlocked = false, unlockCost = 600,
                    hasWeatherApi = true, latitude = -3.4, longitude = -60.0)
            )
            database.gameMapDao().insertAll(maps)

            database.playerProfileDao().insertProfile(
                PlayerProfile(id = 1, coins = 500)
            )
        }
    }
}
