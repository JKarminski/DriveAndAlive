package com.example.driveandalive.ranking

import android.app.AlertDialog
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Spinner
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.driveandalive.R
import com.example.driveandalive.api.models.Score
import com.example.driveandalive.api.repository.FirebaseRankingRepository
import com.example.driveandalive.database.AppDatabase
import com.example.driveandalive.database.entities.GameMap
import com.example.driveandalive.database.entities.Vehicle
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class RankingFragment : Fragment() {

    private lateinit var rvRanking: RecyclerView
    private lateinit var btnBack: ImageButton
    private lateinit var spinnerMap: Spinner
    private lateinit var spinnerVehicle: Spinner

    private val viewModel: RankingViewModel by viewModels {
        object : ViewModelProvider.Factory {
            override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                val repository = FirebaseRankingRepository()
                return RankingViewModel(repository) as T
            }
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        val view = inflater.inflate(R.layout.fragment_ranking, container, false)
        rvRanking = view.findViewById(R.id.rv_ranking)
        btnBack = view.findViewById(R.id.btn_back)
        spinnerMap = view.findViewById(R.id.spinner_map)
        spinnerVehicle = view.findViewById(R.id.spinner_vehicle)
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        rvRanking.layoutManager = LinearLayoutManager(requireContext())

        val trackNames = mapOf(
            "prairie" to "Preria",
            "mountains" to "Góry",
            "arctic" to "Arktyka",
            "jungle" to "Dżungla",
            "sinusoida" to "Sinusoida"
        )
        val carNames = mapOf(
            "offroader" to "Terenówka",
            "muscle" to "Muscle Car",
            "buggy" to "Buggy",
            "monster" to "Monster Truck",
            "quad" to "Quad ATV"
        )

        val adapter = RankingAdapter(trackNames, carNames)
        rvRanking.adapter = adapter

        btnBack.setOnClickListener { requireActivity().finish() }

        // Przycisk zmiany nazwy
        val btnEditName = view.findViewById<View>(R.id.btn_edit_name)
        btnEditName.setOnClickListener {
            showChangeNameDialog()
        }

        // Ładowanie list z bazy
        lifecycleScope.launch {
            val db = AppDatabase.getDatabase(requireContext())
            val mapsFromDb = db.gameMapDao().getAllMaps().first()
            val vehiclesFromDb = db.vehicleDao().getAllVehicles().first()

            val mapsWithAll = listOf(
                GameMap(id = -1, name = "Wszystkie", description = "", drawableName = "", difficultyBase = 0, isUnlocked = true, unlockCost = 0, hasWeatherApi = false)
            ) + mapsFromDb

            val vehiclesWithAll = listOf(
                Vehicle(id = -1, name = "Wszystkie", description = "", drawableName = "", wheelDrawableName = "", isUnlocked = true, unlockCost = 0)
            ) + vehiclesFromDb

            val mapAdapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, mapsWithAll)
            mapAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinnerMap.adapter = mapAdapter

            val vehicleAdapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, vehiclesWithAll)
            vehicleAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinnerVehicle.adapter = vehicleAdapter

            spinnerMap.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>, view: View, position: Int, id: Long) {
                    val selected = mapsWithAll[position]
                    if (selected.id == -1) {
                        viewModel.setTrack(null)
                    } else {
                        val trackSlug = mapIdToSlug(selected.id)
                        viewModel.setTrack(trackSlug)
                    }
                }
                override fun onNothingSelected(parent: AdapterView<*>) {}
            }

            spinnerVehicle.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>, view: View, position: Int, id: Long) {
                    val selected = vehiclesWithAll[position]
                    if (selected.id == -1) {
                        viewModel.setCar(null)
                    } else {
                        val carModel = vehicleIdToModel(selected.id)
                        viewModel.setCar(carModel)
                    }
                }
                override fun onNothingSelected(parent: AdapterView<*>) {}
            }
        }

        // Obserwacja rankingu z ViewModel
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.ranking.collectLatest { list: List<Score> ->
                adapter.submitList(list)
            }
        }
    }

    private fun getUserId(): String {
        val prefs = requireContext().getSharedPreferences("user", Context.MODE_PRIVATE)
        var id = prefs.getString("userId", null)
        if (id == null) {
            id = java.util.UUID.randomUUID().toString()
            prefs.edit().putString("userId", id).apply()
        }
        return id
    }

    private fun showChangeNameDialog() {
        val prefs = requireContext().getSharedPreferences("user", Context.MODE_PRIVATE)
        val currentName = prefs.getString("userName", "Gracz") ?: "Gracz"
        val userId = getUserId()  // pobieramy bieżący UUID gracza

        val input = EditText(requireContext())
        input.hint = "Nowa nazwa"
        input.setText(currentName)

        AlertDialog.Builder(requireContext())
            .setTitle("Zmień nazwę gracza")
            .setView(input)
            .setPositiveButton("Zapisz") { _, _ ->
                val newName = input.text.toString().trim()
                if (newName.isNotEmpty()) {
                    // 1. Zapisz nową nazwę w SharedPreferences
                    prefs.edit().putString("userName", newName).apply()
                    // 2. Zaktualizuj stare wyniki w Firebase (asynchronicznie)
                    lifecycleScope.launch {
                        FirebaseRankingRepository().updatePlayerNameInAllScores(userId, newName)
                    }
                    Toast.makeText(requireContext(), "Nazwa zmieniona na: $newName", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(requireContext(), "Nazwa nie może być pusta", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Anuluj", null)
            .show()
    }

    private fun mapIdToSlug(mapId: Int): String = when (mapId) {
        1 -> "prairie"
        2 -> "mountains"
        3 -> "arctic"
        4 -> "jungle"
        5 -> "sinusoida"
        else -> "prairie"
    }

    private fun vehicleIdToModel(vehicleId: Int): String = when (vehicleId) {
        1 -> "offroader"
        2 -> "muscle"
        3 -> "buggy"
        4 -> "monster"
        5 -> "quad"
        else -> "offroader"
    }
}