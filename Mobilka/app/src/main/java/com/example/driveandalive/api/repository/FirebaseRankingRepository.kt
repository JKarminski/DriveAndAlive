package com.example.driveandalive.api.repository

import android.util.Log
import com.example.driveandalive.api.models.Score
import com.google.firebase.database.*
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await   // WAŻNY IMPORT

class FirebaseRankingRepository : RankingRepository {

    private val database = FirebaseDatabase.getInstance()
    private val scoresRef = database.getReference("scores")

    override fun getRanking(trackSlug: String?, carModel: String?): Flow<List<Score>> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val allScores = mutableListOf<Score>()
                snapshot.children.forEach { userSnapshot ->
                    userSnapshot.children.forEach { trackSnapshot ->
                        trackSnapshot.children.forEach { carSnapshot ->
                            val score = carSnapshot.getValue(Score::class.java)
                            if (score != null) allScores.add(score)
                        }
                    }
                }
                val filtered = allScores.filter { score ->
                    (trackSlug == null || score.trackSlug == trackSlug) &&
                            (carModel == null || score.carModel == carModel)
                }.sortedByDescending { it.points }
                trySend(filtered)
            }
            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        scoresRef.addValueEventListener(listener)
        awaitClose { scoresRef.removeEventListener(listener) }
    }

    override suspend fun submitScore(score: Score): Result<Score> {
        val userId = score.playerUUID
        val trackSlug = score.trackSlug
        val carModel = score.carModel
        val newPoints = score.points

        val userScoreRef = scoresRef.child(userId).child(trackSlug).child(carModel)

        return try {
            val snapshot = userScoreRef.get().await()
            val existingScore = snapshot.getValue(Score::class.java)
            if (existingScore == null || newPoints > existingScore.points) {
                userScoreRef.setValue(score).await()
                Result.success(score)
            } else {
                Result.success(existingScore) // lub failure, ale wynik nie zmieniony
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updatePlayerNameInAllScores(userId: String, newName: String) {
        val userRef = scoresRef.child(userId)
        try {
            val snapshot = userRef.get().await()
            snapshot.children.forEach { trackSnapshot ->
                trackSnapshot.children.forEach { carSnapshot ->
                    val score = carSnapshot.getValue(Score::class.java)
                    if (score != null && score.playerUUID == userId) {
                        score.playerName = newName
                        carSnapshot.ref.setValue(score).await()
                    }
                }
            }
            Log.d("FirebaseRepo", "Zaktualizowano nazwę dla użytkownika $userId na $newName")
        } catch (e: Exception) {
            Log.e("FirebaseRepo", "Błąd aktualizacji nazwy: ${e.message}")
        }
    }
}