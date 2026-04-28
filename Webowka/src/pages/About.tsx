import React from "react";
import styles from "./PageShared.module.scss";

const TEAM = [
  { name: "Jakub K.", role: "Lead Developer / Game Engine", emoji: "⚙️" },
  { name: "TBA", role: "Backend & API", emoji: "🌐" },
  { name: "TBA", role: "UI / UX Design", emoji: "🎨" },
  { name: "TBA", role: "Map Design & QA", emoji: "🗺️" },
];

const TIMELINE = [
  { date: "Sty 2025", ev: "Początek projektu – prototyp silnika fizyki" },
  { date: "Mar 2025", ev: "Pierwsza grywalana wersja alpha" },
  { date: "Cze 2025", ev: "Integracja systemu pogodowego" },
  { date: "Wrz 2025", ev: "Wdrożenie Map Creatora i rankingów" },
  { date: "Kwi 2026", ev: "Patch 1.4 – nowe trasy i turnieje" },


];

export default function About(): JSX.Element {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">ℹ️ O projekcie</span>
          <h1 className="section-title">O nas</h1>
          <p className="section-sub">
            DriveAndAlive to pasja, prędkość i technologia. Tworzymy grę mobilną, która łączy realizm fizyki z
            dynamiczną pogodą i żywą społecznością graczy.
          </p>
        </div>

        {/* Mission */}
        <div className={`${styles.aboutMission} glass-card fade-up`}>
          <span className={styles.aboutMissionIcon}>🚀</span>
          <div>
            <h2 className={styles.aboutMissionTitle}>Nasza misja</h2>
            <p className={styles.aboutMissionText}>
              Chcemy udowodnić, że mobilna gra wyścigowa może być równie immersyjna jak gry na konsole.
              Każdy szczegół – od fizyki opon po efekty pogodowe – jest opracowany z myślą o maksymalnym realizmie.
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className={`${styles.techSection} reveal-element`}>
          <h2 className={styles.aboutSectionTitle}>🛠️ Technologie</h2>
          <div className={styles.techGrid}>
            {[
              { icon: "📱", name: "Kotlin / Jetpack Compose", desc: "Natywna aplikacja Android" },
              { icon: "⚛️", name: "React + Vite", desc: "Strona webowa" },
              { icon: "☁️", name: "OpenWeatherMap API", desc: "Dynamiczna pogoda w grze" },
              { icon: "🗄️", name: "REST API", desc: "Rankingi i profile graczy" },
            ].map((t) => (
              <div key={t.name} className={`${styles.techCard} glass-card`}>
                <span className={styles.techIcon}>{t.icon}</span>
                <strong className={styles.techName}>{t.name}</strong>
                <span className={styles.techDesc}>{t.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className={`${styles.teamSection} reveal-element delay-1`}>
          <h2 className={styles.aboutSectionTitle}>👥 Zespół</h2>
          <div className={styles.teamGrid}>
            {TEAM.map((m) => (
              <div key={m.name} className={`${styles.teamCard} glass-card`}>
                <span className={styles.teamEmoji}>{m.emoji}</span>
                <strong className={styles.teamName}>{m.name}</strong>
                <span className={styles.teamRole}>{m.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className={`${styles.timelineSection} reveal-element delay-2`}>
          <h2 className={styles.aboutSectionTitle}>📅 Historia projektu</h2>
          <div className={styles.timeline}>
            {TIMELINE.map((t, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <span className={styles.timelineDate}>{t.date}</span>
                  <p className={styles.timelineEvent}>{t.ev}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
