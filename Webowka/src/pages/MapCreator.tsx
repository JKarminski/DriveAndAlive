import React, { useState } from "react";
import styles from "./PageShared.module.scss";

const TOOLS = [
  { id: "terrain", label: "Teren",    icon: "🏔️" },
  { id: "road",    label: "Droga",    icon: "🛣️" },
  { id: "objects", label: "Obiekty",  icon: "🌲" },
  { id: "weather", label: "Pogoda",   icon: "⛅" },
  { id: "export",  label: "Eksport",  icon: "📤" },
];

export default function MapCreator(): JSX.Element {
  const [activeTool, setActiveTool] = useState("terrain");
  const [seed, setSeed] = useState("42");
  const [mapName, setMapName] = useState("Moja trasa");

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">🗺️ Kreator</span>
          <h1 className="section-title">Map Creator</h1>
          <p className="section-sub">
            Projektuj własne trasy, konfiguruj teren i eksportuj do aplikacji mobilnej w formacie .daa
          </p>
        </div>

        <div className={styles.creatorLayout}>
          {/* Sidebar */}
          <aside className={`${styles.creatorSidebar} glass-card`}>
            <div className={styles.sidebarSection}>
              <label className={styles.sidebarLabel}>Nazwa trasy</label>
              <input
                className={styles.sidebarInput}
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
              />
            </div>

            <div className={styles.sidebarSection}>
              <label className={styles.sidebarLabel}>Seed generatora</label>
              <input
                className={styles.sidebarInput}
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                type="number"
              />
            </div>

            <div className={styles.sidebarSection}>
              <label className={styles.sidebarLabel}>Narzędzia</label>
              <div className={styles.toolList}>
                {TOOLS.map((t) => (
                  <button
                    key={t.id}
                    className={`${styles.toolBtn} ${activeTool === t.id ? styles.toolActive : ""}`}
                    onClick={() => setActiveTool(t.id)}
                  >
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <label className={styles.sidebarLabel}>Parametry terenu</label>
              {[
                { label: "Wysokość", def: 65 },
                { label: "Szorstkość", def: 40 },
                { label: "Krzywizna", def: 55 },
              ].map((p) => (
                <div key={p.label} className={styles.sliderRow}>
                  <span className={styles.sliderLabel}>{p.label}</span>
                  <input type="range" min={0} max={100} defaultValue={p.def} className={styles.slider} />
                  <span className={styles.sliderVal}>{p.def}%</span>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
              📤 Eksportuj .daa
            </button>
          </aside>

          {/* Canvas preview */}
          <div className={`${styles.creatorCanvas} glass-card`}>
            <div className={styles.canvasGrid}>
              {Array.from({ length: 20 * 12 }).map((_, i) => (
                <div key={i} className={styles.canvasCell} />
              ))}
            </div>
            <div className={styles.canvasOverlay}>
              <span className={styles.canvasIcon}>🗺️</span>
              <p className={styles.canvasHint}>
                Kliknij na siatkę aby rysować trasę
              </p>
              <p className={styles.canvasHintSub}>Seed: {seed} · Trasa: {mapName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
