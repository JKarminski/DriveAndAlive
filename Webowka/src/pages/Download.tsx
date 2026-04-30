import React from "react";
import styles from "./PageShared.module.scss";
import { useI18n } from "../context/I18nContext";

export default function Download(): JSX.Element {
  const { t } = useI18n();

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
      icon: "🍎",
      name: "iOS",
      store: "App Store",
      badge: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg",
      color: "#007aff",
      version: "v1.4.2",
      size: "112 MB",
    },
  ];

  const FEATURES = [
    { icon:"🏎️", text: t("download.feat1") },
    { icon:"🌦️", text: t("download.feat2") },
    { icon:"🏆", text: t("download.feat3") },
    { icon:"🗺️", text: t("download.feat4") },
    { icon:"🎯", text: t("download.feat5") },
    { icon:"🌙", text: t("download.feat6") },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">⬇️ {t("download.label")}</span>
          <h1 className="section-title">{t("download.title")}</h1>
          <p className="section-sub">
            {t("download.subtitle")}
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
                <span>{t("download.version")} {p.version}</span>
                <span>·</span>
                <span>{p.size}</span>
              </div>
              <button className={`btn btn-primary ${styles.downloadBtn}`}
                style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` }}>
                {t("download.downloadOn")} {p.name}
              </button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className={styles.downloadFeatures}>
          <h2 className={styles.downloadFeatTitle}>{t("download.whatsInside")}</h2>
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
          <h3>📋 {t("download.sysReq")}</h3>
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
              <strong>🍎 iOS</strong>
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
