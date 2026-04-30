import React from "react";
import styles from "./PageShared.module.scss";
import { useI18n } from "../context/I18nContext";


const TEAM = [
  { nameKey: "about.name_developer", roleKey: "about.role_developer", emoji: "⚙️" },
  { nameKey: "about.name_backend", roleKey: "about.role_backend", emoji: "🌐" },
  { nameKey: "about.name_designer", roleKey: "about.role_designer", emoji: "🎨" },
  { nameKey: "about.name_tester", roleKey: "about.role_tester", emoji: "🗺️" },
];

const TIMELINE = [
  { date: "Sty 2025", ev: "Początek projektu – prototyp silnika fizyki" },
  { date: "Mar 2025", ev: "Pierwsza grywalana wersja alpha" },
  { date: "Cze 2025", ev: "Integracja systemu pogodowego" },
  { date: "Wrz 2025", ev: "Wdrożenie Map Creatora i rankingów" },
  { date: "Kwi 2026", ev: "Patch 1.4 – nowe trasy i turnieje" },


];

export default function About(): JSX.Element {
  const { t } = useI18n();

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">ℹ️ {t("about.label")}</span>
          <h1 className="section-title">{t("about.title")}</h1>
          <p className="section-sub">
            {t("about.subtitle")}
          </p>
        </div>

        {/* Mission */}
        <div className={`${styles.aboutMission} glass-card fade-up`}>
          <span className={styles.aboutMissionIcon}>🚀</span>
          <div>
            <h2 className={styles.aboutMissionTitle}>{t("about.missionTitle")}</h2>
            <p className={styles.aboutMissionText}>
              {t("about.missionText")}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className={`${styles.techSection} reveal-element`}>
          <h2 className={styles.aboutSectionTitle}>🛠️ {t("about.techTitle")}</h2>
          <div className={styles.techGrid}>
            {[
              { icon: "📱", name: t("about.tech1Name"), desc: t("about.tech1Desc") },
              { icon: "⚛️", name: t("about.tech2Name"), desc: t("about.tech2Desc") },
              { icon: "☁️", name: t("about.tech3Name"), desc: t("about.tech3Desc") },
              { icon: "🗄️", name: t("about.tech4Name"), desc: t("about.tech4Desc") },
            ].map((tech) => (
              <div key={tech.name} className={`${styles.techCard} glass-card`}>
                <span className={styles.techIcon}>{tech.icon}</span>
                <strong className={styles.techName}>{tech.name}</strong>
                <span className={styles.techDesc}>{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className={`${styles.teamSection} reveal-element delay-1`}>
          <h2 className={styles.aboutSectionTitle}>👥 {t("about.teamTitle")}</h2>
          <div className={styles.teamGrid}>
            {TEAM.map((m) => (
              <div key={m.nameKey} className={`${styles.teamCard} glass-card`}>
                <span className={styles.teamEmoji}>{m.emoji}</span>
                <strong className={styles.teamName}>{t(m.nameKey)}</strong>
                <span className={styles.teamRole}>{t(m.roleKey)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className={`${styles.timelineSection} reveal-element delay-2`}>
          <h2 className={styles.aboutSectionTitle}>📅 {t("about.historyTitle")}</h2>
          <div className={styles.timeline}>
            {TIMELINE.map((timelineData, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <span className={styles.timelineDate}>{t(`about.historyDate${i+1}`)}</span>
                  <p className={styles.timelineEvent}>{t(`about.historyEvent${i+1}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
