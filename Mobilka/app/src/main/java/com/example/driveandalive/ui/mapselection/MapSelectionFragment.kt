package com.example.driveandalive.ui.mapselection

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
        binding.viewPagerMaps.offscreenPageLimit = 3

        // Disable clipping so neighbors are visible
        val recyclerView = binding.viewPagerMaps.getChildAt(0) as? RecyclerView
        recyclerView?.let {
            it.clipToPadding = false
            it.clipChildren = false
            (it.parent as? ViewGroup)?.clipChildren = false
        }
        binding.viewPagerMaps.clipChildren = false
        binding.viewPagerMaps.clipToPadding = false

        // Composite transformer (margin + scale + alpha + Z-index)
        val transformer = CompositePageTransformer()
        val margin = resources.getDimensionPixelSize(R.dimen.viewpager_page_margin)
        transformer.addTransformer(MarginPageTransformer(margin))
        transformer.addTransformer { page, position ->
            val r = 1 - abs(position)
            val scale = 0.85f + 0.15f * r
            page.scaleX = scale
            page.scaleY = scale
            page.alpha = 0.6f + 0.4f * r

            val baseZ = resources.getDimension(R.dimen.viewpager_base_elevation)
            val extraZ = resources.getDimension(R.dimen.viewpager_extra_elevation)
            page.translationZ = baseZ + extraZ * r

            val lp = page.layoutParams
            if (lp is MarginLayoutParams) {
                val extraMargin = (margin * 0.5f * (1 - r)).toInt()
                lp.marginStart = extraMargin
                lp.marginEnd = extraMargin
                page.layoutParams = lp
            }
        }

        binding.viewPagerMaps.setPageTransformer(transformer)

        // Load maps
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.maps.collectLatest { maps ->
                adapter.submitList(maps)
            }
        }

        // Load profile + select current map
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.playerProfile.collectLatest { profile ->
                profile?.let {
                    binding.tvCoins.text = "💰 ${it.coins}"
                    val idx = adapter.currentList.indexOfFirst { m -> m.id == it.selectedMapId }
                    if (idx >= 0) binding.viewPagerMaps.setCurrentItem(idx, false)
                }
            }
        }

        // Weather updates
        viewModel.currentWeather.observe(viewLifecycleOwner) { weather ->
            if (weather != null) {
                binding.tvWeather.visibility = View.VISIBLE
                binding.tvWeather.text = weather.description
            } else {
                binding.tvWeather.visibility = View.GONE
            }
        }

        // Page indicator + auto-select unlocked map
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
