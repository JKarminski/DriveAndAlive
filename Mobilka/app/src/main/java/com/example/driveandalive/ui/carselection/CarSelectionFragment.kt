package com.example.driveandalive.ui.carselection

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.example.driveandalive.R
import com.example.driveandalive.databinding.FragmentCarSelectionBinding
import com.example.driveandalive.ranking.RankingActivity
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import kotlin.math.abs

class CarSelectionFragment : Fragment() {

    private var _binding: FragmentCarSelectionBinding? = null
    private val binding get() = _binding!!
    private val viewModel: CarSelectionViewModel by viewModels()
    private lateinit var adapter: CarPagerAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCarSelectionBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnRanking.setOnClickListener {
            startActivity(Intent(requireContext(), RankingActivity::class.java))
        }

        adapter = CarPagerAdapter { vehicle, action ->
            when (action) {
                CarAction.SELECT -> {
                    viewModel.selectVehicle(vehicle.id)
                    Snackbar.make(binding.root, "Wybrano: ${vehicle.name}", Snackbar.LENGTH_SHORT).show()
                }
                CarAction.UNLOCK -> viewModel.unlockVehicle(vehicle)
            }
        }

        binding.viewPagerCars.adapter = adapter
        binding.viewPagerCars.offscreenPageLimit = 3

        // Ustawienia clippingu – żeby sąsiednie karty były widoczne
        val recyclerView = binding.viewPagerCars.getChildAt(0) as? RecyclerView
        recyclerView?.let {
            it.clipToPadding = false
            it.clipChildren = false
            (it.parent as? ViewGroup)?.clipChildren = false
        }
        binding.viewPagerCars.clipToPadding = false
        binding.viewPagerCars.clipChildren = false

        // Efekt pomniejszania sąsiednich kart
        binding.viewPagerCars.setPageTransformer { page, position ->
            val r = 1 - abs(position)
            val scale = 0.85f + 0.15f * r
            page.scaleX = scale
            page.scaleY = scale
            page.alpha = 0.6f + 0.4f * r
        }

        // Obserwacja listy pojazdów
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.vehicles.collectLatest { vehicles ->
                adapter.submitList(vehicles)
            }
        }

        // Obserwacja profilu (monety i wybrany pojazd)
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.playerProfile.collectLatest { profile ->
                binding.tvCoins.text = "💰 ${profile?.coins}"
                val selectedIdx = adapter.currentList.indexOfFirst { it.id == profile?.selectedVehicleId }
                if (selectedIdx >= 0) {
                    binding.viewPagerCars.setCurrentItem(selectedIdx, true)
                }
            }
        }

        // Callback do aktualizacji wskaźnika i wyboru pojazdu
        binding.viewPagerCars.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                val size = adapter.currentList.size
                if (size > 0) {
                    binding.tvPageIndicator.text = "${position + 1} / $size"
                    val vehicle = adapter.currentList.getOrNull(position)
                    if (vehicle != null && vehicle.isUnlocked) {
                        viewModel.selectVehicle(vehicle.id)
                    }
                }
            }
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}