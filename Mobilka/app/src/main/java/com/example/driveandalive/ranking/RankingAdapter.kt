package com.example.driveandalive.ranking

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.driveandalive.api.models.Score
import com.example.driveandalive.databinding.ItemRankingBinding

class RankingAdapter(
    private val trackNames: Map<String, String>,   // slug -> nazwa mapy
    private val carNames: Map<String, String>      // slug -> nazwa pojazdu
) : RecyclerView.Adapter<RankingAdapter.RankingViewHolder>() {

    private var items = listOf<Score>()

    fun submitList(list: List<Score>) {
        items = list
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RankingViewHolder {
        val binding = ItemRankingBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return RankingViewHolder(binding)
    }

    override fun onBindViewHolder(holder: RankingViewHolder, position: Int) {
        holder.bind(items[position], position + 1, trackNames, carNames)
    }

    override fun getItemCount() = items.size

    class RankingViewHolder(private val binding: ItemRankingBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(score: Score, pos: Int, trackNames: Map<String, String>, carNames: Map<String, String>) {
            binding.tvPosition.text = pos.toString()
            binding.tvName.text = score.playerName
            binding.tvTrack.text = trackNames[score.trackSlug] ?: score.trackSlug
            binding.tvCar.text = carNames[score.carModel] ?: score.carModel
            binding.tvPoints.text = "🏆 ${score.points}"
        }
    }
}