package com.example.driveandalive.ui.carselection

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.driveandalive.R
import com.example.driveandalive.database.entities.Vehicle
import com.example.driveandalive.databinding.ItemCarCardBinding
import android.graphics.drawable.LayerDrawable
import androidx.constraintlayout.widget.ConstraintLayout

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

            // ---------- Nadwozie ----------
            val bodyResId = ctx.resources.getIdentifier(vehicle.drawableName, "drawable", ctx.packageName)
            if (bodyResId != 0) {
                binding.ivCar.setImageResource(bodyResId)
            } else {
                binding.ivCar.setImageResource(R.drawable.ic_car_placeholder)
            }

            // ---------- Koła ----------
            val wheelResId = ctx.resources.getIdentifier(vehicle.wheelDrawableName, "drawable", ctx.packageName)
            if (wheelResId != 0) {
                binding.ivWheelLeft.setImageResource(wheelResId)
                binding.ivWheelRight.setImageResource(wheelResId)

                // Maksymalne przesunięcie w pionie (w dół) – 80dp
                val maxOffsetYDp = 80
                val maxOffsetYPx = (maxOffsetYDp * ctx.resources.displayMetrics.density).toInt()
                val offsetY = (vehicle.wheelVerticalBias * maxOffsetYPx).toInt()
                binding.ivWheelLeft.translationY = offsetY.toFloat()
                binding.ivWheelRight.translationY = offsetY.toFloat()

                // Maksymalne przesunięcie w poziomie (lewo/prawo) – 60dp
                val maxOffsetXDp = 60
                val maxOffsetXPx = (maxOffsetXDp * ctx.resources.displayMetrics.density).toInt()

                // Przelicz bias (0..1) na przesunięcie: -max..+max
                val offsetLeftX = ((vehicle.wheelLeftBias * 2 - 1) * maxOffsetXPx).toInt()
                val offsetRightX = ((vehicle.wheelRightBias * 2 - 1) * maxOffsetXPx).toInt()

                binding.ivWheelLeft.translationX = offsetLeftX.toFloat()
                binding.ivWheelRight.translationX = offsetRightX.toFloat()
            } else {
                binding.ivWheelLeft.setImageDrawable(null)
                binding.ivWheelRight.setImageDrawable(null)
            }

            // ---------- Blokada / przycisk ----------
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
