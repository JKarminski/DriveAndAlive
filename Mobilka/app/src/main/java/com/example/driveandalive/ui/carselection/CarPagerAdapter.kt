package com.example.driveandalive.ui.carselection

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.driveandalive.R
import com.example.driveandalive.database.entities.Vehicle
import com.example.driveandalive.databinding.ItemCarCardBinding

enum class CarAction { SELECT, UNLOCK }

class CarPagerAdapter(
    private val onAction: (Vehicle, CarAction) -> Unit
) : ListAdapter<Vehicle, CarPagerAdapter.CarViewHolder>(CarDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CarViewHolder {
        val binding = ItemCarCardBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CarViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CarViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class CarViewHolder(private val binding: ItemCarCardBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(vehicle: Vehicle) {
            binding.tvCarName.text = vehicle.name
            binding.tvCarDescription.text = vehicle.description

            val ctx = binding.root.context
            val resId = ctx.resources.getIdentifier(vehicle.drawableName, "drawable", ctx.packageName)
            if (resId != 0) {
                binding.ivCar.setImageResource(resId)
            } else {
                binding.ivCar.setImageResource(R.drawable.ic_car_placeholder)
            }

            if (vehicle.isUnlocked) {
                binding.btnAction.visibility = android.view.View.GONE
                binding.overlayLocked.visibility = android.view.View.GONE
            } else {
                binding.btnAction.visibility = android.view.View.VISIBLE
                binding.btnAction.text = "Odblokuj (${vehicle.unlockCost} 💰)"
                binding.btnAction.setOnClickListener { onAction(vehicle, CarAction.UNLOCK) }
                binding.overlayLocked.visibility = android.view.View.VISIBLE
            }
        }
    }

    class CarDiffCallback : DiffUtil.ItemCallback<Vehicle>() {
        override fun areItemsTheSame(oldItem: Vehicle, newItem: Vehicle) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: Vehicle, newItem: Vehicle) = oldItem == newItem
    }
}
