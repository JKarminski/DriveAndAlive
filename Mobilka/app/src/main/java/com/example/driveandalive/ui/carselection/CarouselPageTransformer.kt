package com.example.driveandalive.ui.carselection

import android.view.View
import androidx.viewpager2.widget.ViewPager2

class CarouselPageTransformer : ViewPager2.PageTransformer {
    override fun transformPage(page: View, position: Float) {
        val absPos = Math.abs(position)
        page.apply {
            translationX = -position * (width * 0.25f)
            scaleY = 1f - (absPos * 0.15f)
            scaleX = 1f - (absPos * 0.15f)
            alpha = 1f - (absPos * 0.4f)
        }
    }
}
