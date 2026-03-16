package com.example.driveandalive.ui.mapselection

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.driveandalive.R
import com.example.driveandalive.database.entities.GameMap
import com.example.driveandalive.databinding.ItemMapCardBinding

enum class MapAction { SELECT, UNLOCK }

class MapPagerAdapter(
    private val onAction: (GameMap, MapAction) -> Unit
) : ListAdapter<GameMap, MapPagerAdapter.MapViewHolder>(MapDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MapViewHolder {
        val binding = ItemMapCardBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return MapViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MapViewHolder, position: Int) = holder.bind(getItem(position))

    inner class MapViewHolder(private val binding: ItemMapCardBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(map: GameMap) {
            binding.tvMapName.text = map.name
            binding.tvMapDescription.text = map.description
            binding.tvDifficulty.text = when (map.difficultyBase) {
                1 -> "⭐ Łatwa"
                2 -> "⭐⭐ Średnia"
                else -> "⭐⭐⭐ Trudna"
            }
            binding.tvWeatherIcon.visibility = if (map.hasWeatherApi) android.view.View.VISIBLE else android.view.View.GONE

            val ctx = binding.root.context
            val resId = ctx.resources.getIdentifier(map.drawableName, "drawable", ctx.packageName)
            if (resId != 0) binding.ivMapPreview.setImageResource(resId)
            else binding.ivMapPreview.setImageResource(R.drawable.ic_map)

            if (map.isUnlocked) {
                binding.overlayLocked.visibility = android.view.View.GONE
                binding.btnMapAction.visibility = android.view.View.GONE
            } else {
                binding.overlayLocked.visibility = android.view.View.VISIBLE
                binding.btnMapAction.visibility = android.view.View.VISIBLE
                binding.btnMapAction.text = "Odblokuj (${map.unlockCost} 💰)"
                binding.btnMapAction.setOnClickListener { onAction(map, MapAction.UNLOCK) }
            }
            binding.root.setOnClickListener { if (map.isUnlocked) onAction(map, MapAction.SELECT) }
        }
    }

    class MapDiffCallback : DiffUtil.ItemCallback<GameMap>() {
        override fun areItemsTheSame(oldItem: GameMap, newItem: GameMap) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: GameMap, newItem: GameMap) = oldItem == newItem
    }
}
