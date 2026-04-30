import React, { useState } from "react";
import styles from "./PageShared.module.scss";
import { useI18n } from "../context/I18nContext";
import { useApi } from "../hooks/useApi";
import { api } from "../services/api";
import type { WeatherData } from "../services/api";

const GAME_MAPS = [
  { key: "trackPrairie", lat: 52.0, lon: 21.0 },
  { key: "trackMountains", lat: 49.2, lon: 19.9 },
  { key: "trackArctic", lat: 69.6, lon: 18.9 },
  { key: "trackJungle", lat: -3.4, lon: -60.0 }
];

const weatherEmoji = (desc: string): string => {
  const d = desc.toLowerCase();
  if (d.includes("rain") || d.includes("deszcz")) return "🌧️";
  if (d.includes("cloud") || d.includes("chmur")) return "☁️";
  if (d.includes("snow") || d.includes("śnieg"))  return "❄️";
  if (d.includes("storm") || d.includes("burz"))  return "⛈️";
  if (d.includes("mist") || d.includes("mgł"))    return "🌫️";
  return "☀️";
};

export default function Weather(): JSX.Element {
  const { t, lang } = useI18n();
  const [activeMap, setActiveMap] = useState<{key: string; lat: number; lon: number} | null>(GAME_MAPS[0]);
  const [searchCity, setSearchCity] = useState("");
  const [input, setInput] = useState("");

  const { data: res, loading, error, refetch } = useApi(
    () => activeMap 
      ? api.weather.get(t(`leaderboard.${activeMap.key}`), { lat: activeMap.lat, lon: activeMap.lon, lang })
      : api.weather.get(searchCity, { lang }),
    [activeMap, searchCity, lang]
  );

  const displayed: WeatherData | null = res?.data ?? null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      setActiveMap(null);
      setSearchCity(trimmed);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container" style={{ maxWidth: 780 }}>
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">⛅ {t("weather.label")}</span>
          <h1 className="section-title">{t("weather.title")}</h1>
          <p className="section-sub">{t("weather.subtitle")}</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className={styles.weatherSearch}>
          <input
            id="weather-city-input"
            className={styles.weatherInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("weather.placeholder")}
          />
          <button id="weather-search-btn" type="submit" className="btn btn-primary">
            🔍 {t("weather.searchBtn")}
          </button>
        </form>

        {/* Quick city chips */}
        <div className={styles.chipBar} style={{ marginBottom: 32 }}>
          {GAME_MAPS.map((m) => (
            <button
              key={m.key}
              id={`city-chip-${m.key.toLowerCase()}`}
              className={`${styles.chip} ${activeMap?.key === m.key ? styles.chipActive : ""}`}
              onClick={() => { setActiveMap(m); setInput(t(`leaderboard.${m.key}`)); }}
            >
              {t(`leaderboard.${m.key}`)}
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && <div className={styles.weatherLoading}>⏳ {t("weather.loading")}</div>}
        {error   && (
          <div className={styles.weatherError}>
            ⚠️ {error}
            <button
              onClick={refetch}
              className="btn btn-outline"
              style={{ display: "block", margin: "12px auto 0", fontSize: "0.8rem" }}
            >
              {t("weather.tryAgain")}
            </button>
          </div>
        )}

        {/* Main weather card */}
        {displayed && !loading && (
          <div className={`${styles.weatherCard} glass-card fade-up`}>
            {res?.mock && (
              <p className={styles.demoNote}>{t("weather.demoNote")}</p>
            )}
            <div className={styles.weatherTop}>
              <div>
                <h2 className={styles.weatherCity}>
                  {displayed.city}, {displayed.country}
                </h2>
                <p className={styles.weatherDesc}>
                  {weatherEmoji(displayed.description)} {displayed.description}
                </p>
              </div>
              <div className={styles.weatherTemp}>{displayed.temp}°C</div>
            </div>
            <div className={styles.weatherStats}>
              {[
                { label: t("weather.statFeelsLike"), val: `${displayed.feelsLike}°C`       },
                { label: t("weather.statHumidity"),  val: `${displayed.humidity}%`          },
                { label: t("weather.statPressure"),  val: `${displayed.pressure} hPa`      },
                { label: t("weather.statWind"),      val: `${displayed.windSpeed} m/s`      },
              ].map((s) => (
                <div key={s.label} className={styles.weatherStat}>
                  <span className={styles.weatherStatVal}>{s.val}</span>
                  <span className={styles.weatherStatLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game weather note */}
        <div className={`${styles.infoBox} glass-card`} style={{ marginTop: 24 }}>
          <span className={styles.infoIcon}>🎮</span>
          <div>
            <strong>{t("weather.gameNoteTitle")}</strong>
            <p>{t("weather.gameNoteDesc")}</p>
          </div>
        </div>

        {/* Live data note */}
        <div className={`${styles.infoBox} glass-card`} style={{ marginTop: 12 }}>
          <span className={styles.infoIcon}>📡</span>
          <div>
            <strong>{t("weather.liveNoteTitle")}</strong>
            <p>{t("weather.liveNoteDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
