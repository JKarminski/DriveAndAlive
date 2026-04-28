import React, { useState } from "react";
import styles from "./PageShared.module.scss";

const CATEGORIES = ["Wszystkie", "Prędkość", "Dystans", "Warunki", "Społeczność", "Specjalne"];

const ACHIEVEMENTS = [
  { id:1, icon:"⚡", name:"Błyskawica",       desc:"Ukończ trasę w czasie poniżej 2 minut",       pts:500,  cat:"Prędkość",      earned:true  },
  { id:2, icon:"🛣️", name:"Maratończyk",      desc:"Pokonaj łącznie 1000 km we wszystkich trasach",pts:1000, cat:"Dystans",       earned:true  },
  { id:3, icon:"🌧️", name:"Deszczowy pilot",  desc:"Ukończ 10 tras podczas deszczowej pogody",    pts:750,  cat:"Warunki",       earned:true  },
  { id:4, icon:"🔥", name:"Seria zwycięstw",   desc:"Wygraj 5 tras z rzędu",                       pts:800,  cat:"Prędkość",      earned:false },
  { id:5, icon:"❄️", name:"Lodowy król",       desc:"Ukończ trasę przy temperaturze -10°C",        pts:600,  cat:"Warunki",       earned:false },
  { id:6, icon:"🗺️", name:"Odkrywca",         desc:"Stwórz i opublikuj własną mapę",               pts:900,  cat:"Społeczność",   earned:true  },
  { id:7, icon:"🏔️", name:"Alpinista",         desc:"Zdobądź wszystkie trasy górskie",              pts:1200, cat:"Specjalne",     earned:false },
  { id:8, icon:"🌙", name:"Nocny jeździec",    desc:"Ukończ 20 tras w porze nocnej",               pts:700,  cat:"Warunki",       earned:false },
  { id:9, icon:"👑", name:"Legenda asfaltu",   desc:"Zdobądź top 1% globalnego rankingu",          pts:2000, cat:"Specjalne",     earned:false },
  { id:10,icon:"🤝", name:"Duch drużyny",      desc:"Zagraj 50 tras z przyjaciółmi",               pts:650,  cat:"Społeczność",   earned:true  },
  { id:11,icon:"🏁", name:"Pierwszy krok",     desc:"Ukończ swoją pierwszą trasę",                 pts:100,  cat:"Dystans",       earned:true  },
  { id:12,icon:"💨", name:"Wiatr ze wschodu",  desc:"Zdobądź medal złoty na każdej trasie",        pts:1500, cat:"Prędkość",      earned:false },
];

export default function Achievements(): JSX.Element {
  const [cat, setCat] = useState("Wszystkie");
  const [filter, setFilter] = useState<"all"|"earned"|"locked">("all");

  const filtered = ACHIEVEMENTS
    .filter((a) => cat === "Wszystkie" || a.cat === cat)
    .filter((a) => filter === "all" || (filter === "earned" ? a.earned : !a.earned));

  const earned = ACHIEVEMENTS.filter((a) => a.earned).length;
  const totalPts = ACHIEVEMENTS.filter((a) => a.earned).reduce((s, a) => s + a.pts, 0);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">🎯 Twoje postępy</span>
          <h1 className="section-title">Osiągnięcia</h1>
          <p className="section-sub">
            Zdobywaj odznaki, zbieraj punkty i udowodnij że jesteś mistrzem drogi.
          </p>
        </div>

        {/* Progress summary */}
        <div className={styles.progressBar}>
          <div className={styles.progressStats}>
            <div className={styles.progressStat}>
              <strong>{earned}</strong><span>/ {ACHIEVEMENTS.length} zdobytych</span>
            </div>
            <div className={styles.progressStat}>
              <strong className={styles.green}>{totalPts.toLocaleString()}</strong><span>punktów</span>
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
              {f === "all" ? "Wszystkie" : f === "earned" ? "✅ Zdobyte" : "🔒 Zablokowane"}
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
                  <span className={styles.achievPts}>+{a.pts} pkt</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
