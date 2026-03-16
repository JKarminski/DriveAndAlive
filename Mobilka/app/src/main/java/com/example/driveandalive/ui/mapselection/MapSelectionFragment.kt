package com.example.driveandalive.ui.mapselection

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.viewpager2.widget.ViewPager2
import com.example.driveandalive.databinding.FragmentMapSelectionBinding
import com.example.driveandalive.ui.carselection.CarouselPageTransformer
import com.example.driveandalive.ui.game.GameActivity
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class MapSelectionFragment : Fragment() {

    private var _binding: FragmentMapSelectionBinding? = null
    private val binding get() = _binding!!
    private val viewModel: MapSelectionViewModel by viewModels()
    private lateinit var adapter: MapPagerAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentMapSelectionBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = MapPagerAdapter { map, action ->
            when (action) {
                MapAction.SELECT -> {
                    viewModel.selectMap(map.id)
                    viewModel.loadWeather(map)
                }
                MapAction.UNLOCK -> {
                    val success = viewModel.playerProfile.value?.coins ?: 0 >= map.unlockCost
                    if (!success) Snackbar.make(binding.root, "Za mało monet!", Snackbar.LENGTH_SHORT).show()
                    else viewModel.unlockMap(map)
                }
            }
        }

        binding.viewPagerMaps.adapter = adapter
        binding.viewPagerMaps.offscreenPageLimit = 2
        binding.viewPagerMaps.setPageTransformer(CarouselPageTransformer())

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.maps.collectLatest { maps ->
                adapter.submitList(maps)
            }
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.playerProfile.collectLatest { profile ->
                profile?.let {
                    binding.tvCoins.text = "💰 ${it.coins}"
                    val selectedIdx = adapter.currentList.indexOfFirst { m -> m.id == it.selectedMapId }
                    if (selectedIdx >= 0) binding.viewPagerMaps.setCurrentItem(selectedIdx, false)
                }
            }
        }

        viewModel.currentWeather.observe(viewLifecycleOwner) { weather ->
            if (weather != null) {
                binding.tvWeather.visibility = View.VISIBLE
                binding.tvWeather.text = weather.description
            } else {
                binding.tvWeather.visibility = View.GONE
            }
        }

        binding.viewPagerMaps.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                val size = adapter.currentList.size
                binding.tvPageIndicator.text = "${position + 1} / $size"

                val map = adapter.currentList.getOrNull(position)
                if (map != null) {
                    viewModel.loadWeather(map)

                    if (map.isUnlocked) {
                        viewModel.selectMap(map.id)
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
