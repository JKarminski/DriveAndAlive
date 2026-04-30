package com.example.driveandalive.ranking

import com.google.firebase.database.*
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class RankingRepository {

    private val database = FirebaseDatabase.getInstance()
    private val rankingsRef = database.getReference("rankings")

    // Zapisanie lub aktualizacja wyniku użytkownika
    suspend fun updateUserRanking(userId: String, userName: String, coins: Int, totalDistance: Int) {
        val entry = RankingEntry(userId, userName, coins, totalDistance)
        rankingsRef.child(userId).setValue(entry).await()
    }

    // Pobiera ranking dla wszystkich map, ale dla konkretnego pojazdu
    fun getRankingForAllMaps(vehicleId: Int): Flow<List<FirebaseRankingEntry>> = callbackFlow {
        val ref = rankingsRef
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val allEntries = mutableListOf<FirebaseRankingEntry>()
                snapshot.children.forEach { mapSnapshot ->
                    mapSnapshot.child(vehicleId.toString()).children.forEach { userSnapshot ->
                        userSnapshot.getValue(FirebaseRankingEntry::class.java)?.let { allEntries.add(it) }
                    }
                }
                allEntries.sortByDescending { it.distance }
                trySend(allEntries)
            }
            override fun onCancelled(error: DatabaseError) { close(error.toException()) }
        }
        ref.addValueEventListener(listener)
        awaitClose { ref.removeEventListener(listener) }
    }

    // Pobiera ranking dla wszystkich pojazdów, ale dla konkretnej mapy
    fun getRankingForAllVehicles(mapId: Int): Flow<List<FirebaseRankingEntry>> = callbackFlow {
        val ref = rankingsRef.child(mapId.toString())
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val allEntries = mutableListOf<FirebaseRankingEntry>()
                snapshot.children.forEach { vehicleSnapshot ->
                    vehicleSnapshot.children.forEach { userSnapshot ->
                        userSnapshot.getValue(FirebaseRankingEntry::class.java)?.let { allEntries.add(it) }
                    }
                }
                allEntries.sortByDescending { it.distance }
                trySend(allEntries)
            }
            override fun onCancelled(error: DatabaseError) { close(error.toException()) }
        }
        ref.addValueEventListener(listener)
        awaitClose { ref.removeEventListener(listener) }
    }

    // Pobiera ranking dla wszystkich map i wszystkich pojazdów
    fun getAllRanking(): Flow<List<FirebaseRankingEntry>> = callbackFlow {
        val ref = rankingsRef
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val allEntries = mutableListOf<FirebaseRankingEntry>()
                snapshot.children.forEach { mapSnapshot ->
                    mapSnapshot.children.forEach { vehicleSnapshot ->
                        vehicleSnapshot.children.forEach { userSnapshot ->
                            userSnapshot.getValue(FirebaseRankingEntry::class.java)?.let { allEntries.add(it) }
                        }
                    }
                }
                allEntries.sortByDescending { it.distance }
                trySend(allEntries)
            }
            override fun onCancelled(error: DatabaseError) { close(error.toException()) }
        }
        ref.addValueEventListener(listener)
        awaitClose { ref.removeEventListener(listener) }
    }

    // Aktualizuje ranking dla konkretnej mapy i pojazdu – zapisuje tylko jeśli nowy wynik jest lepszy
    suspend fun updateBestScore(
        mapId: Int,
        vehicleId: Int,
        userId: String,
        userName: String,
        distance: Int,
        coins: Int
    ) {
        val ref = rankingsRef.child("$mapId").child("$vehicleId").child(userId)
        try {
            val snapshot = ref.get().await()
            val currentBest = snapshot.getValue(FirebaseRankingEntry::class.java)
            if (currentBest == null || distance > currentBest.distance) {
                val newEntry = FirebaseRankingEntry(userId, userName, distance, coins, System.currentTimeMillis())
                ref.setValue(newEntry).await()
            }
        } catch (e: Exception) {
            // obsługa błędu – np. log
        }
    }

    // Pobiera ranking dla danej mapy i pojazdu (posortowany według dystansu malejąco)
    fun getRankingFor(mapId: Int, vehicleId: Int): Flow<List<FirebaseRankingEntry>> = callbackFlow {
        val ref = rankingsRef.child("$mapId").child("$vehicleId")
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<FirebaseRankingEntry>()
                snapshot.children.forEach { child ->
                    child.getValue(FirebaseRankingEntry::class.java)?.let { list.add(it) }
                }
                list.sortByDescending { it.distance }
                trySend(list)
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        ref.addValueEventListener(listener)
        awaitClose { ref.removeEventListener(listener) }
    }

    // Obserwowanie rankingu w czasie rzeczywistym (posortowane według monet)
    fun getRankingFlow(): Flow<List<RankingEntry>> = callbackFlow {
        try {
            val listener = object : ValueEventListener {
                override fun onDataChange(snapshot: DataSnapshot) {
                    val list = mutableListOf<RankingEntry>()
                    snapshot.children.forEach { child ->
                        child.getValue(RankingEntry::class.java)?.let { list.add(it) }
                    }
                    list.sortByDescending { it.coins }
                    trySend(list)
                }
                override fun onCancelled(error: DatabaseError) {
                    close(error.toException())
                }
            }
            rankingsRef.addValueEventListener(listener)
            awaitClose { rankingsRef.removeEventListener(listener) }
        } catch (e: Exception) {
            close(e)
        }
    }
}