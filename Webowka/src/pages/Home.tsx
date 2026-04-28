import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";

/* ── Mock news posts ─────────────────────────────────────── */
const POSTS = [
  {
    id: 1,
    tag: "Aktualizacja",
    date: "28 kwi 2026",
    title: "Patch 1.4 – nowe trasy i dynamiczna pogoda",
    excerpt:
      "Dodaliśmy 3 nowe trasy górskie, zintegrowane z systemem pogodowym. Deszcz, mgła i burze wpływają teraz na przyczepność i widoczność.",
    emoji: "🌩️",
    accent: "var(--accent2)",
  },
  {
    id: 2,
    tag: "Społeczność",
    date: "22 kwi 2026",
    title: "Turniej Wiosenny – wyniki i rekordy",
    excerpt:
      "Ponad 2 400 graczy wzięło udział w turnieju. Sprawdź tabelę wyników i odbierz nagrodę jeśli ukończyłeś top 10%.",
    emoji: "🏆",
    accent: "var(--accent)",
  },
  {
    id: 3,
    tag: "Map Creator",
    date: "15 kwi 2026",
    title: "Nowości w edytorze map – tryb terenu proceduralnego",
    excerpt:
      "Map Creator dostał potężną aktualizację: generowanie terenu z parametrami seed, import GPX tras i eksport do formatu .daa.",
    emoji: "🗺️",
    accent: "var(--accent3)",
  },
  {
    id: 4,
    tag: "Osiągnięcia",
    date: "10 kwi 2026",
    title: "Nowe odznaki: Mistrz Asfaltu i Król Szutru",
    excerpt:
      "Zdobądź nowe osiągnięcia pokonując 500 km na asfalcie lub 200 km na terenach szutrowych. Specjalne skiny dla pierwszych 500 graczy.",
    emoji: "🎖️",
    accent: "var(--accent)",
  },
];

/* ── Feature tiles ───────────────────────────────────────── */
const FEATURES = [
  {
    to: "/leaderboard",
    icon: "🏆",
    label: "Tabela wyników",
    desc: "Globalne rankingi tras",
    color: "#f59e0b",
  },
  {
    to: "/achievements",
    icon: "🎯",
    label: "Osiągnięcia",
    desc: "Setki wyzwań i nagród",
    color: "var(--accent)",
  },
  {
    to: "/map-creator",
    icon: "🗺️",
    label: "Map Creator",
    desc: "Twórz własne trasy",
    color: "var(--accent2)",
  },
];

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
          <span className="section-label">🎮 Mobilna gra wyścigowa</span>
          <h1 className={styles.heroTitle}>
            Poczuj<br />
            <span className="grad-text">adrenalinę</span><br />
            drogi
          </h1>
          <p className={styles.heroSub}>
            DriveAndAlive to mobilna gra wyścigowa z dynamiczną pogodą,
            proceduralnymi trasami i globalnym rankingiem graczy.
          </p>
          <div className={styles.heroCta}>
            <Link to="/download" className="btn btn-primary">
              ⬇️ Pobierz za darmo
            </Link>
            <Link to="/leaderboard" className="btn btn-outline">
              🏆 Tabela wyników
            </Link>
          </div>

          {/* Stats bar */}
          <div className={styles.statsBar}>
            {[
              { val: "48K+",  label: "Graczy" },
              { val: "120+",  label: "Tras" },
              { val: "4.8★",  label: "Ocena" },
              { val: "12",    label: "Krajów" },
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
              <span className="section-label">📰 Aktualności</span>
              <h2 className="section-title">Co nowego?</h2>
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
                <button className={styles.postReadMore}>Czytaj więcej →</button>
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
              <h2 className={styles.ctaTitle}>Gotowy na jazdę?</h2>
              <p className={styles.ctaSub}>Dołącz do 48 000+ graczy i stań się legendą asfaltu.</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link to="/download" className="btn btn-primary">⬇️ Pobierz teraz</Link>
              <Link to="/login"    className="btn btn-outline">Zaloguj się</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
