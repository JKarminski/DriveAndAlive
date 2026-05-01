import React, { useState } from "react";
import styles from "./PageShared.module.scss";
import { useI18n } from "../context/I18nContext";

export default function MapCreator(): JSX.Element {
  const { t } = useI18n();

  const TOOLS = [
    { id: "terrain", label: t("mapCreator.toolTerrain"),    icon: "🏔️" },
    { id: "road",    label: t("mapCreator.toolRoad"),    icon: "🛣️" },
    { id: "objects", label: t("mapCreator.toolObjects"),  icon: "🌲" },
    { id: "weather", label: t("mapCreator.toolWeather"),   icon: "⛅" },
    { id: "export",  label: t("mapCreator.toolExport"),  icon: "📤" },
  ];

  const [activeTool, setActiveTool] = useState("terrain");
  const [seed, setSeed] = useState("42");
  const [mapName, setMapName] = useState("Moja trasa");

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">🗺️ {t("mapCreator.label")}</span>
          <h1 className="section-title">{t("mapCreator.title")}</h1>
          <p className="section-sub">
            {t("mapCreator.subtitle")}
          </p>
        </div>

        <div className={styles.creatorLayout}>
          <div className={styles.creatorComingSoon}>
            <h2>{t("mapCreator.comingSoonTitle")}</h2>
            <p>{t("mapCreator.comingSoonDesc")}</p>
          </div>

          {/* Sidebar */}
          <aside className={`${styles.creatorSidebar} glass-card`}>
            <div className={styles.sidebarSection}>
              <label className={styles.sidebarLabel}>{t("mapCreator.trackName")}</label>
              <input
                className={styles.sidebarInput}
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
              />
            </div>

            <div className={styles.sidebarSection}>
              <label className={styles.sidebarLabel}>{t("mapCreator.seed")}</label>
              <input
                className={styles.sidebarInput}
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                type="number"
              />
            </div>

            <div className={styles.sidebarSection}>
              <label className={styles.sidebarLabel}>{t("mapCreator.tools")}</label>
              <div className={styles.toolList}>
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    className={`${styles.toolBtn} ${activeTool === tool.id ? styles.toolActive : ""}`}
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <span>{tool.icon}</span> {tool.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <label className={styles.sidebarLabel}>{t("mapCreator.params")}</label>
              {[
                { label: t("mapCreator.height"), def: 65 },
                { label: t("mapCreator.roughness"), def: 40 },
                { label: t("mapCreator.curvature"), def: 55 },
              ].map((p) => (
                <div key={p.label} className={styles.sliderRow}>
                  <span className={styles.sliderLabel}>{p.label}</span>
                  <input type="range" min={0} max={100} defaultValue={p.def} className={styles.slider} />
                  <span className={styles.sliderVal}>{p.def}%</span>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
              📤 {t("mapCreator.exportBtn")}
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
                {t("mapCreator.canvasHint")}
              </p>
              <p className={styles.canvasHintSub}>Seed: {seed} · {t("mapCreator.track")}: {mapName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
