import React, { useState } from "react";
import styles from "./PageShared.module.scss";
import { useI18n } from "../context/I18nContext";

export default function Achievements(): JSX.Element {
  const { t } = useI18n();

  const CATEGORIES = [
    t("achiev.catAll"), t("achiev.catSpeed"), t("achiev.catDist"),
    t("achiev.catCond"), t("achiev.catSocial"), t("achiev.catSpecial")
  ];

  const ACHIEVEMENTS = [
    { id:1, icon:"⚡", name:t("achiev.a1Name"), desc:t("achiev.a1Desc"), pts:500, cat:t("achiev.catSpeed"), earned:true },
    { id:2, icon:"🛣️", name:t("achiev.a2Name"), desc:t("achiev.a2Desc"), pts:1000, cat:t("achiev.catDist"), earned:true },
    { id:3, icon:"🌧️", name:t("achiev.a3Name"), desc:t("achiev.a3Desc"), pts:750, cat:t("achiev.catCond"), earned:true },
    { id:4, icon:"🔥", name:t("achiev.a4Name"), desc:t("achiev.a4Desc"), pts:800, cat:t("achiev.catSpeed"), earned:false },
    { id:5, icon:"❄️", name:t("achiev.a5Name"), desc:t("achiev.a5Desc"), pts:600, cat:t("achiev.catCond"), earned:false },
    { id:6, icon:"🗺️", name:t("achiev.a6Name"), desc:t("achiev.a6Desc"), pts:900, cat:t("achiev.catSocial"), earned:true },
    { id:7, icon:"🏔️", name:t("achiev.a7Name"), desc:t("achiev.a7Desc"), pts:1200, cat:t("achiev.catSpecial"), earned:false },
    { id:8, icon:"🌙", name:t("achiev.a8Name"), desc:t("achiev.a8Desc"), pts:700, cat:t("achiev.catCond"), earned:false },
    { id:9, icon:"👑", name:t("achiev.a9Name"), desc:t("achiev.a9Desc"), pts:2000, cat:t("achiev.catSpecial"), earned:false },
    { id:10,icon:"🤝", name:t("achiev.a10Name"), desc:t("achiev.a10Desc"), pts:650, cat:t("achiev.catSocial"), earned:true },
    { id:11,icon:"🏁", name:t("achiev.a11Name"), desc:t("achiev.a11Desc"), pts:100, cat:t("achiev.catDist"), earned:true },
    { id:12,icon:"💨", name:t("achiev.a12Name"), desc:t("achiev.a12Desc"), pts:1500, cat:t("achiev.catSpeed"), earned:false },
  ];

  const [cat, setCat] = useState(CATEGORIES[0]);
  const [filter, setFilter] = useState<"all"|"earned"|"locked">("all");

  const filtered = ACHIEVEMENTS
    .filter((a) => cat === CATEGORIES[0] || a.cat === cat)
    .filter((a) => filter === "all" || (filter === "earned" ? a.earned : !a.earned));

  const earned = ACHIEVEMENTS.filter((a) => a.earned).length;
  const totalPts = ACHIEVEMENTS.filter((a) => a.earned).reduce((s, a) => s + a.pts, 0);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">🎯 {t("achiev.label")}</span>
          <h1 className="section-title">{t("achiev.title")}</h1>
          <p className="section-sub">
            {t("achiev.subtitle")}
          </p>
        </div>

        {/* Progress summary */}
        <div className={styles.progressBar}>
          <div className={styles.progressStats}>
            <div className={styles.progressStat}>
              <strong>{earned}</strong><span>/ {ACHIEVEMENTS.length} {t("achiev.earned")}</span>
            </div>
            <div className={styles.progressStat}>
              <strong className={styles.green}>{totalPts.toLocaleString()}</strong><span>{t("achiev.points")}</span>
            </div>
          </div>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${(earned / ACHIEVEMENTS.length) * 100}%` }} />
          </div>
        </div>

        {/* Category chips */}
        <div className={styles.chipBar}>
          {CATEGORIES.map((c) => (
            <button key={c} className={`${styles.chip} ${cat === c ? styles.chipActive : ""}`}
              onClick={() => setCat(c)}>{c}</button>
          ))}
          <div className={styles.chipSpacer} />
          {(["all","earned","locked"] as const).map((f) => (
            <button key={f} className={`${styles.chip} ${filter === f ? styles.chipActive : ""}`}
              onClick={() => setFilter(f)}>
              {f === "all" ? t("achiev.filterAll") : f === "earned" ? t("achiev.filterEarned") : t("achiev.filterLocked")}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.achievGrid}>
          {filtered.map((a, i) => (
            <div
              key={a.id}
              className={`${styles.achievCard} glass-card ${a.earned ? styles.earned : styles.locked} fade-up`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={styles.achievIcon}>{a.earned ? a.icon : "🔒"}</div>
              <div className={styles.achievBody}>
                <h3 className={styles.achievName}>{a.name}</h3>
                <p className={styles.achievDesc}>{a.desc}</p>
                <div className={styles.achievFooter}>
                  <span className={styles.achievCat}>{a.cat}</span>
                  <span className={styles.achievPts}>+{a.pts} {t("achiev.ptsShort")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
