import React from "react";
import styles from "./PageShared.module.scss";

const PLATFORMS = [
  {
    icon: "🤖",
    name: "Android",
    store: "Google Play",
    badge: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
    color: "#34a853",
    version: "v1.4.2",
    size: "87 MB",
  },
  {
    icon: "",
    name: "iOS",
    store: "App Store",
    badge: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg",
    color: "#007aff",
    version: "v1.4.2",
    size: "112 MB",
  },
];

const FEATURES = [
  { icon:"🏎️", text:"Ponad 120 tras w 12 krajach"          },
  { icon:"🌦️", text:"Dynamiczna pogoda wpływająca na fizykę" },
  { icon:"🏆", text:"Globalne tabele wyników"                },
  { icon:"🗺️", text:"Edytor własnych tras – Map Creator"     },
  { icon:"🎯", text:"Setki osiągnięć i wyzwań"               },
  { icon:"🌙", text:"Pełna rozgrywka offline"                 },
];

export default function Download(): JSX.Element {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">⬇️ Pobierz</span>
          <h1 className="section-title">DriveAndAlive – za darmo</h1>
          <p className="section-sub">
            Dostępna na Androida i iOS. Pobierz już teraz i poczuj adrenalinę mobilnych wyścigów.
          </p>
        </div>

        {/* Platform cards */}
        <div className={styles.downloadGrid}>
          {PLATFORMS.map((p) => (
            <div key={p.name} className={`${styles.downloadCard} glass-card fade-up`}
              style={{ "--col": p.color } as React.CSSProperties}>
              <div className={styles.downloadIcon}>{p.icon}</div>
              <h2 className={styles.downloadPlatform}>{p.name}</h2>
              <div className={styles.downloadMeta}>
                <span>Wersja {p.version}</span>
                <span>·</span>
                <span>{p.size}</span>
              </div>
              <button className={`btn btn-primary ${styles.downloadBtn}`}
                style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` }}>
                Pobierz na {p.name}
              </button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className={styles.downloadFeatures}>
          <h2 className={styles.downloadFeatTitle}>Co znajdziesz w grze?</h2>
          <div className={styles.downloadFeatGrid}>
            {FEATURES.map((f) => (
              <div key={f.text} className={`${styles.downloadFeat} glass-card`}>
                <span className={styles.downloadFeatIcon}>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System req */}
        <div className={`${styles.requirementsCard} glass-card`}>
          <h3>📋 Wymagania systemowe</h3>
          <div className={styles.reqGrid}>
            <div>
              <strong>🤖 Android</strong>
              <ul>
                <li>Android 8.0+</li>
                <li>2 GB RAM</li>
                <li>OpenGL ES 3.0</li>
              </ul>
            </div>
            <div>
              <strong> iOS</strong>
              <ul>
                <li>iOS 14+</li>
                <li>iPhone 8+</li>
                <li>2 GB RAM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
