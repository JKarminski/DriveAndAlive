package com.example.driveandalive.ui.mapselection

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
import com.example.driveandalive.databinding.FragmentMapSelectionBinding
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import kotlin.math.abs

class MapSelectionFragment : Fragment() {

    private var _binding: FragmentMapSelectionBinding? = null
    private val binding get() = _binding!!
    private val viewModel: MapSelectionViewModel by viewModels()
    private lateinit var adapter: MapPagerAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
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
                    val enoughCoins = (viewModel.playerProfile.value?.coins ?: 0) >= map.unlockCost
                    if (!enoughCoins) {
                        Snackbar.make(binding.root, "Za mało monet!", Snackbar.LENGTH_SHORT).show()
                    } else {
                        viewModel.unlockMap(map)
                    }
                }
            }
        }

        binding.viewPagerMaps.adapter = adapter
        binding.viewPagerMaps.offscreenPageLimit = 5   // większy dla płynności

        // Clipping – aby sąsiednie karty były widoczne
        val recyclerView = binding.viewPagerMaps.getChildAt(0) as? RecyclerView
        recyclerView?.let {
            it.clipToPadding = false
            it.clipChildren = false
            (it.parent as? ViewGroup)?.clipChildren = false
        }
        binding.viewPagerMaps.clipToPadding = false
        binding.viewPagerMaps.clipChildren = false

        // Prosty PageTransformer (skala + alpha) – bez CompositePageTransformer
        binding.viewPagerMaps.setPageTransformer { page, position ->
            val r = 1 - abs(position)
            val scale = 0.85f + 0.15f * r
            page.scaleX = scale
            page.scaleY = scale
            page.alpha = 0.6f + 0.4f * r
        }

        // Obserwacja listy map
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.maps.collectLatest { maps ->
                adapter.submitList(maps)
            }
        }

        // Obserwacja profilu (monety i wybrana mapa) – używamy Flow, nie .value
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.playerProfile.collectLatest { profile ->
                binding.tvCoins.text = "💰 ${profile?.coins}"
                val idx = adapter.currentList.indexOfFirst { it.id == profile?.selectedMapId }
                if (idx >= 0) {
                    binding.viewPagerMaps.setCurrentItem(idx, false)
                }
            }
        }

        // Obserwacja pogody (LiveData)
        viewModel.currentWeather.observe(viewLifecycleOwner) { weather ->
            if (weather != null) {
                binding.tvWeather.visibility = View.VISIBLE
                binding.tvWeather.text = weather.description
            } else {
                binding.tvWeather.visibility = View.GONE
            }
        }

        // Callback – aktualizacja wskaźnika i wybór mapy
        binding.viewPagerMaps.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                val size = adapter.currentList.size
                binding.tvPageIndicator.text = "${position + 1} / $size"
                val map = adapter.currentList.getOrNull(position)
                if (map != null) {
                    viewModel.loadWeather(map)
                    if (map.isUnlocked) viewModel.selectMap(map.id)
                }
            }
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}