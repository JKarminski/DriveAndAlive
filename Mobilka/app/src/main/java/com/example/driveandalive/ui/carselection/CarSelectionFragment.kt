package com.example.driveandalive.ui.carselection

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.viewpager2.widget.ViewPager2
import com.example.driveandalive.databinding.FragmentCarSelectionBinding
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class CarSelectionFragment : Fragment() {

    private var _binding: FragmentCarSelectionBinding? = null
    private val binding get() = _binding!!
    private val viewModel: CarSelectionViewModel by viewModels()
    private lateinit var adapter: CarPagerAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentCarSelectionBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

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

        binding.viewPagerCars.offscreenPageLimit = 2
        binding.viewPagerCars.setPageTransformer(CarouselPageTransformer())

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.vehicles.collectLatest { vehicles ->
                adapter.submitList(vehicles)
            }
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.playerProfile.collectLatest { profile ->
                profile?.let {
                    binding.tvCoins.text = "💰 ${it.coins}"

                    val selectedIdx = adapter.currentList.indexOfFirst { v -> v.id == it.selectedVehicleId }
                    if (selectedIdx >= 0) binding.viewPagerCars.setCurrentItem(selectedIdx, false)
                }
            }
        }

        binding.viewPagerCars.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                val size = adapter.currentList.size
                binding.tvPageIndicator.text = "${position + 1} / $size"

                val vehicle = adapter.currentList.getOrNull(position)
                if (vehicle != null && vehicle.isUnlocked) {
                    viewModel.selectVehicle(vehicle.id)
                }
            }
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
