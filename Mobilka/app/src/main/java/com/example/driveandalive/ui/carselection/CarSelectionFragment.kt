package com.example.driveandalive.ui.carselection

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.ViewGroup.MarginLayoutParams
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.CompositePageTransformer
import androidx.viewpager2.widget.MarginPageTransformer
import androidx.viewpager2.widget.ViewPager2
import com.example.driveandalive.R
import com.example.driveandalive.databinding.FragmentCarSelectionBinding
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import kotlin.math.abs

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

        // Offscreen pages to keep neighbors ready
        binding.viewPagerCars.offscreenPageLimit = 3

        // Disable clipping on ViewPager2 and its internal RecyclerView so neighbors are visible
        val recyclerView = binding.viewPagerCars.getChildAt(0) as? RecyclerView
        recyclerView?.let {
            it.clipToPadding = false
            it.clipChildren = false
            (it.parent as? ViewGroup)?.clipChildren = false
        }
        binding.viewPagerCars.clipToPadding = false
        binding.viewPagerCars.clipChildren = false

        // Composite transformer: margin + scale + alpha + translationZ to ensure center page is above neighbors
        val compositeTransformer = CompositePageTransformer()
        val pageMarginPx = resources.getDimensionPixelSize(R.dimen.viewpager_page_margin)
        compositeTransformer.addTransformer(MarginPageTransformer(pageMarginPx))
        compositeTransformer.addTransformer { page, position ->
            val r = 1 - abs(position)
            val scale = 0.85f + 0.15f * r
            page.scaleX = scale
            page.scaleY = scale
            page.alpha = 0.6f + 0.4f * r

            val baseZ = resources.getDimension(R.dimen.viewpager_base_elevation)
            val extraZ = resources.getDimension(R.dimen.viewpager_extra_elevation)
            page.translationZ = baseZ + extraZ * r

            // Optional: adjust margins of item root if needed to increase spacing
            val lp = page.layoutParams
            if (lp is MarginLayoutParams) {
                val extraMargin = (pageMarginPx * 0.5f * (1 - r)).toInt()
                lp.marginStart = extraMargin
                lp.marginEnd = extraMargin
                page.layoutParams = lp
            }
        }
        binding.viewPagerCars.setPageTransformer(compositeTransformer)

        // Observe vehicles and profile
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
