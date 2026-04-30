package com.example.driveandalive.ranking

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.driveandalive.R

class RankingActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_ranking)

        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragment_container, RankingFragment())
                .commit()
        }
    }
}