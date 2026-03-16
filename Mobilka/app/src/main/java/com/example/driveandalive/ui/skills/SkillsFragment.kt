package com.example.driveandalive.ui.skills

import android.animation.ObjectAnimator
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.DecelerateInterpolator
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import com.example.driveandalive.databinding.FragmentSkillsBinding
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class SkillsFragment : Fragment() {

    private var _binding: FragmentSkillsBinding? = null
    private val binding get() = _binding!!
    private val viewModel: SkillsViewModel by viewModels()

    private val skillInfo = mapOf(
        "nitro" to Triple("🚀", "Dopalacz", "Jednorazowy boost prędkości"),
        "shield" to Triple("🛡", "Tarcza", "Ignoruje jedno uderzenie"),
        "extra_fuel" to Triple("⛽", "Dodatkowe Paliwo", "+50% pojemności zbiornika"),
        "auto_gearbox" to Triple("⚙", "Auto-skrzynia", "Automatyczna skrzynia biegów"),
        "magnet" to Triple("🧲", "Magnes", "Zbiera monety automatycznie")
    )

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentSkillsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnSpin.text = "LOSUJ! (${SkillsViewModel.SPIN_COST} 💰)"
        binding.btnSpin.setOnClickListener { viewModel.spinForSkill() }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.playerProfile.collectLatest { profile ->
                binding.tvCoins.text = "💰 ${profile?.coins ?: 0}"
            }
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.activeSkills.collectLatest { skills ->
                binding.tvNoSkills.visibility = if (skills.isEmpty()) View.VISIBLE else View.GONE
                binding.llActiveSkills.removeAllViews()
                skills.forEach { skill ->
                    val (emoji, name, desc) = skillInfo[skill.skillType] ?: return@forEach
                    val tv = layoutInflater.inflate(android.R.layout.simple_list_item_2, binding.llActiveSkills, false)
                    (tv.findViewById<android.widget.TextView>(android.R.id.text1)).apply {
                        text = "$emoji $name"
                        setTextColor(resources.getColor(android.R.color.white, null))
                    }
                    (tv.findViewById<android.widget.TextView>(android.R.id.text2)).apply {
                        text = desc
                        setTextColor(resources.getColor(android.R.color.darker_gray, null))
                    }
                    binding.llActiveSkills.addView(tv)
                }
            }
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.isSpinning.collectLatest { spinning ->
                binding.btnSpin.isEnabled = !spinning
                if (spinning) animateSpinButton()
            }
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.spinResult.collectLatest { result ->
                result ?: return@collectLatest
                when (result) {
                    is SpinResult.Won -> {
                        val (emoji, name, _) = skillInfo[result.skillType] ?: return@collectLatest
                        binding.tvSpinResult.text = "Wylosowano: $emoji $name!"
                        binding.tvSpinResult.visibility = View.VISIBLE
                        animateResult()
                    }
                    SpinResult.NotEnoughCoins -> {
                        Toast.makeText(requireContext(), "❌ Za mało monet!", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    private fun animateSpinButton() {
        ObjectAnimator.ofFloat(binding.btnSpin, "rotationY", 0f, 360f).apply {
            duration = 600
            interpolator = DecelerateInterpolator()
            start()
        }
    }

    private fun animateResult() {
        binding.tvSpinResult.alpha = 0f
        binding.tvSpinResult.animate().alpha(1f).scaleX(1.2f).scaleY(1.2f).setDuration(300)
            .withEndAction {
                binding.tvSpinResult.animate().scaleX(1f).scaleY(1f).setDuration(200).start()
            }.start()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
