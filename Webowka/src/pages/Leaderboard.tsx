import React, { useState, useEffect } from "react";
import styles from "./PageShared.module.scss";
import { useI18n } from "../context/I18nContext";
import { database } from "../firebase";
import { ref, get } from "firebase/database";
import type { LeaderboardEntry } from "../services/api"; // zachowujemy ten sam typ

const TRACK_SLUGS = [
  "all",
  "alpine-crossing",
  "gravel-sprint",
  "night-highway",
  "mountain-loop",
  "desert-slalom",
];

// Mapowanie slugów z Firebase na slugi używane w filtrze (zakładam, że w bazie są np. "prairie", "mountains"...)
// Musisz dostosować to do swoich danych. Jeśli w Firebase używasz innych identyfikatorów, zmień mapowanie.
// Na potrzeby przykładu zakładam, że w Firebase trackSlug to "prairie", "mountains", "arctic", "jungle", "sinusoida".
// Poniżej funkcja pomocnicza do konwersji.
function mapFirebaseTrackToAppTrack(firebaseSlug: string): string {
  switch (firebaseSlug) {
    case "prairie": return "alpine-crossing";
    case "mountains": return "gravel-sprint";
    case "arctic": return "night-highway";
    case "jungle": return "mountain-loop";
    case "sinusoida": return "desert-slalom";
    default: return firebaseSlug;
  }
}

function mapAppTrackToFirebase(appSlug: string): string {
  switch (appSlug) {
    case "alpine-crossing": return "prairie";
    case "gravel-sprint": return "mountains";
    case "night-highway": return "arctic";
    case "mountain-loop": return "jungle";
    case "desert-slalom": return "sinusoida";
    default: return appSlug;
  }
}

const medal = (r: number) => {
  if (r === 1) return "🥇";
  if (r === 2) return "🥈";
  if (r === 3) return "🥉";
  return `#${r}`;
};

export default function Leaderboard(): JSX.Element {
  const { t } = useI18n();

  const TRACK_LABELS: Record<string, string> = {
    "all":             t("leaderboard.trackAll"),
    "alpine-crossing": t("leaderboard.trackAlpine"),
    "gravel-sprint":   t("leaderboard.trackGravel"),
    "night-highway":   t("leaderboard.trackNight"),
    "mountain-loop":   t("leaderboard.trackMountain"),
    "desert-slalom":   t("leaderboard.trackDesert"),
  };

  const [activeTrack, setActiveTrack] = useState("all");
  const [page, setPage]               = useState(1);
  const LIMIT = 20;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dbRef = ref(database);
        const snapshot = await get(dbRef);
        if (!snapshot.exists()) {
          setAllEntries([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }

        const scoresData = snapshot.val().scores || {};
        const entries: LeaderboardEntry[] = [];

        // Iteracja po strukturze: scores/{userId}/{trackSlug}/{carModel}
        Object.values(scoresData).forEach((userScores: any) => {
          Object.entries(userScores).forEach(([trackSlug, cars]: [string, any]) => {
            Object.values(cars).forEach((score: any) => {
              const firebaseTrack = trackSlug;
              const appTrack = mapFirebaseTrackToAppTrack(firebaseTrack);
              // Filtrowanie po aktywnym torze (jeśli nie "all")
              if (activeTrack !== "all" && appTrack !== activeTrack) return;

              entries.push({
                id: `${score.playerUUID}_${firebaseTrack}_${score.carModel}`,
                rank: 0, // tymczasowo
                name: score.playerName || "Anonim",
                car: score.carModel || "",
                time: "—", // brak czasu w danych – możesz ustawić placeholder
                pts: score.points || 0,
                country: "", // brak kraju – możesz ustawić pusty string lub domyślny emoji
              });
            });
          });
        });

        // Sortowanie według punktów malejąco
        entries.sort((a, b) => b.pts - a.pts);
        // Przypisanie rankingu
        entries.forEach((entry, idx) => { entry.rank = idx + 1; });

        // Paginacja
        const start = (page - 1) * LIMIT;
        const paginated = entries.slice(start, start + LIMIT);
        setAllEntries(paginated);
        setTotalPages(Math.ceil(entries.length / LIMIT));
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Błąd ładowania rankingu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTrack, page]);

  const rows = allEntries;

  const handleTrackChange = (slug: string) => {
    setActiveTrack(slug);
    setPage(1);
  };

  return (
      <div className={styles.page}>
        <div className="container">
          {/* Header */}
          <div className={`${styles.pageHeader} fade-up`}>
            <span className="section-label">🏆 {t("leaderboard.label")}</span>
            <h1 className="section-title">{t("leaderboard.title")}</h1>
            <p className="section-sub">{t("leaderboard.subtitle")}</p>
          </div>

          {/* Track filter */}
          <div className={styles.chipBar}>
            {TRACK_SLUGS.map((slug) => (
                <button
                    key={slug}
                    id={`track-filter-${slug}`}
                    className={`${styles.chip} ${activeTrack === slug ? styles.chipActive : ""}`}
                    onClick={() => handleTrackChange(slug)}
                >
                  {TRACK_LABELS[slug] ?? slug}
                </button>
            ))}
          </div>

          {/* States */}
          {loading && (
              <div className={styles.weatherLoading}>
                <div className={styles.spinner} />
                {t("leaderboard.loading") || "Ładowanie..."}
              </div>
          )}
          {error && (
              <div className={styles.weatherError}>
                ⚠️ {error}
                <p style={{ fontSize: "0.8rem", marginTop: 8, color: "var(--muted)" }}>
                  {t("leaderboard.apiError") || "Nie udało się pobrać danych z Firebase."}
                </p>
              </div>
          )}

          {/* Table */}
          {!loading && !error && (
              <div className={`${styles.tableWrap} glass-card`}>
                <table className={styles.table}>
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>{t("leaderboard.colPlayer")}</th>
                    <th>{t("leaderboard.colCar")}</th>
                    <th>{t("leaderboard.colTime")}</th>
                    <th>{t("leaderboard.colPts")}</th>
                  </tr>
                  </thead>
                  <tbody>
                  {rows.map((row) => (
                      <tr key={row.id} className={row.rank <= 3 ? styles.topRow : ""}>
                        <td className={styles.rankCell}>
                      <span className={row.rank <= 3 ? styles.medal : styles.rankNum}>
                        {medal(row.rank)}
                      </span>
                        </td>
                        <td className={styles.playerCell}>
                          <span className={styles.flag}>{row.country}</span>
                          <span className={styles.playerName}>{row.name}</span>
                        </td>
                        <td className={styles.carCell}>{row.car}</td>
                        <td className={styles.timeCell}>{row.time}</td>
                        <td className={styles.ptsCell}>
                          <span className={styles.pts}>{row.pts.toLocaleString()}</span>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                    id="leaderboard-prev"
                    className={`btn btn-outline ${styles.pageBtn}`}
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                  ← {t("leaderboard.prev") || "Poprzednia"}
                </button>
                <span className={styles.pageInfo}>
              {page} / {totalPages}
            </span>
                <button
                    id="leaderboard-next"
                    className={`btn btn-outline ${styles.pageBtn}`}
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                  {t("leaderboard.next") || "Następna"} →
                </button>
              </div>
          )}
        </div>
      </div>
  );
}
