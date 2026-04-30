import React, { useState } from "react";
import styles from "./PageShared.module.scss";
import { useI18n } from "../context/I18nContext";
import { useApi } from "../hooks/useApi";
import { api } from "../services/api";
import type { LeaderboardEntry } from "../services/api";

// Slugi tras zgodne z Twoim JSON-em
const TRACK_SLUGS = [
  "all",
  "prairie",
  "mountains",
  "arctic",
  "jungle",
];

const medal = (r: number) => {
  if (r === 1) return "🥇";
  if (r === 2) return "🥈";
  if (r === 3) return "🥉";
  return `#${r}`;
};

export default function Leaderboard(): JSX.Element {
  const { t } = useI18n();

  // Nazwy tras zgodne z JSON-em
  const TRACK_LABELS: Record<string, string> = {
    "all":       t("leaderboard.trackAll"),
    "prairie":   t("leaderboard.trackPrairie"),
    "mountains": t("leaderboard.trackMountains"),
    "arctic":    t("leaderboard.trackArctic"),
    "jungle":    t("leaderboard.trackJungle"),
  };

  const [activeTrack, setActiveTrack] = useState("all");
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const { data, loading, error } = useApi(
    () => api.leaderboard.get({ track: activeTrack, page, limit: LIMIT }),
    [activeTrack, page]
  );

  const rows: LeaderboardEntry[] = data?.data ?? [];

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
              {TRACK_LABELS[slug]}
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
              {t("leaderboard.apiError") || "Sprawdź czy backend jest uruchomiony."}
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
        {data && data.totalPages > 1 && (
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
              {page} / {data.totalPages}
            </span>

            <button
              id="leaderboard-next"
              className={`btn btn-outline ${styles.pageBtn}`}
              disabled={page >= data.totalPages}
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
