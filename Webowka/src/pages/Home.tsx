import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";
import { useI18n } from "../context/I18nContext";

/* ── Intersection observer hook ──────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function Home(): JSX.Element {
  const featuresReveal = useReveal();
  const postsReveal    = useReveal();
  const { t } = useI18n();

  const POSTS = [
    {
      id: 1,
      tag: t("home.post1Tag"),
      date: t("home.post1Date"),
      title: t("home.post1Title"),
      excerpt: t("home.post1Excerpt"),
      emoji: "🌩️",
      accent: "var(--accent2)",
    },
    {
      id: 2,
      tag: t("home.post2Tag"),
      date: t("home.post2Date"),
      title: t("home.post2Title"),
      excerpt: t("home.post2Excerpt"),
      emoji: "🏆",
      accent: "var(--accent)",
    },
    {
      id: 3,
      tag: t("home.post3Tag"),
      date: t("home.post3Date"),
      title: t("home.post3Title"),
      excerpt: t("home.post3Excerpt"),
      emoji: "🗺️",
      accent: "var(--accent3)",
    },
    {
      id: 4,
      tag: t("home.post4Tag"),
      date: t("home.post4Date"),
      title: t("home.post4Title"),
      excerpt: t("home.post4Excerpt"),
      emoji: "🎖️",
      accent: "var(--accent)",
    },
  ];

  const FEATURES = [
    {
      to: "/leaderboard",
      icon: "🏆",
      label: t("home.feat1Label"),
      desc: t("home.feat1Desc"),
      color: "#f59e0b",
    },
    {
      to: "/achievements",
      icon: "🎯",
      label: t("home.feat2Label"),
      desc: t("home.feat2Desc"),
      color: "var(--accent)",
    },
    {
      to: "/map-creator",
      icon: "🗺️",
      label: t("home.feat3Label"),
      desc: t("home.feat3Desc"),
      color: "var(--accent2)",
    },
  ];

  return (
    <div className={styles.home}>
      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section className={styles.hero}>
        {/* Video background placeholder – swap src when you have a clip */}
        <div className={styles.videoBg}>
          <div className={styles.videoOverlay} />
          <div className={styles.videoPlaceholder}>
            <div className={styles.carAnim}>
              <span className={styles.carEmoji}>🏎️</span>
              <div className={styles.speedLines}>
                {[...Array(6)].map((_, i) => (
                  <span key={i} className={styles.speedLine} style={{ "--i": i } as React.CSSProperties} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.heroContent} container`}>
          <span className="section-label">🎮 {t("home.heroLabel")}</span>
          <h1 className={styles.heroTitle}>
            {t("home.heroTitle1")}<br />
            <span className="grad-text">{t("home.heroTitleGrad")}</span><br />
            {t("home.heroTitle2")}
          </h1>
          <p className={styles.heroSub}>
            {t("home.heroSub")}
          </p>
          <div className={styles.heroCta}>
            <Link to="/download" className="btn btn-primary">
              ⬇️ {t("home.heroBtnDownload")}
            </Link>
            <Link to="/leaderboard" className="btn btn-outline">
              🏆 {t("home.heroBtnLeaderboard")}
            </Link>
          </div>

          {/* Stats bar */}
          <div className={styles.statsBar}>
            {[
              { val: "48K+",  label: t("home.statPlayers") },
              { val: "120+",  label: t("home.statTracks") },
              { val: "4.8★",  label: t("home.statRating") },
              { val: "12",    label: t("home.statCountries") },
            ].map((s) => (
              <div key={s.label} className={styles.statItem}>
                <strong>{s.val}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.scrollHint}>
          <span className={styles.scrollLine} />
          <span className={styles.scrollText}>scroll</span>
        </div>
      </section>

      {/* ═══ FEATURE TILES ══════════════════════════════════ */}
      <section className={styles.featuresSection}>
        <div
          ref={featuresReveal.ref}
          className={`${styles.featuresGrid} container ${featuresReveal.visible ? styles.revealed : ""}`}
        >
          {FEATURES.map((f, i) => (
            <Link
              key={f.to}
              to={f.to}
              className={styles.featureTile}
              style={{ "--delay": `${i * 0.1}s`, "--col": f.color } as React.CSSProperties}
            >
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureLabel}>{f.label}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
              <span className={styles.featureArrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ POSTS FEED ═════════════════════════════════════ */}
      <section className={styles.postsSection}>
        <div className="container">
          <div className={styles.postsHeader}>
            <div>
              <span className="section-label">📰 {t("home.newsLabel")}</span>
              <h2 className="section-title">{t("home.newsTitle")}</h2>
            </div>
          </div>

          <div
            ref={postsReveal.ref}
            className={`${styles.postsGrid} ${postsReveal.visible ? styles.revealed : ""}`}
          >
            {POSTS.map((p, i) => (
              <article
                key={p.id}
                className={`${styles.postCard} glass-card`}
                style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
              >
                <div className={styles.postEmoji} style={{ background: `${p.accent}20`, color: p.accent }}>
                  {p.emoji}
                </div>
                <div className={styles.postMeta}>
                  <span className={styles.postTag} style={{ color: p.accent }}>{p.tag}</span>
                  <span className={styles.postDate}>{p.date}</span>
                </div>
                <h3 className={styles.postTitle}>{p.title}</h3>
                <p className={styles.postExcerpt}>{p.excerpt}</p>
                <button className={styles.postReadMore}>{t("home.readMore")} →</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═════════════════════════════════════ */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>{t("home.ctaTitle")}</h2>
              <p className={styles.ctaSub}>{t("home.ctaSub")}</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link to="/download" className="btn btn-primary">⬇️ {t("home.ctaBtnDownload")}</Link>
              <Link to="/login"    className="btn btn-outline">{t("nav.login")}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
