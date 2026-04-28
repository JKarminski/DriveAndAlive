import React, { useState } from "react";
import styles from "./PageShared.module.scss";

const TRACKS = [
  "Wszystkie trasy",
  "Alpejska Przeprawa",
  "Szutrowy Sprint",
  "Nocna Autostrada",
  "Górska Pętla",
  "Pustynny Slalom",
];

const generate = (track: string) =>
  Array.from({ length: 20 }, (_, i) => ({
    rank: i + 1,
    name: [
      "xX_DriftKing_Xx","PolishRacer","SpeedDemon99","NightDriver","AlpineMaster",
      "TarmacTerror","GravelKing","TurboWojtek","FjordRacer","SunsetDrifter",
      "JakubPL","SilentCorner","ApexHunter","DustDevil","MidnightRunner",
      "RedlineRacer","SnowFox","ThrottleQueen","GhostLap","BlazingKarol",
    ][i],
    time: `${Math.floor(Math.random() * 3 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2,"0")}.${String(Math.floor(Math.random() * 999)).padStart(3,"0")}`,
    car: ["BMW M3","Subaru WRX","Ford Fiesta R5","VW Polo GTI","Mitsubishi Evo"][Math.floor(Math.random() * 5)],
    country: ["🇵🇱","🇩🇪","🇫🇷","🇮🇹","🇳🇴","🇸🇪"][Math.floor(Math.random() * 6)],
    pts: Math.floor(10000 - i * 400 - Math.random() * 200),
    track,
  }));

export default function Leaderboard(): JSX.Element {
  const [activeTrack, setActiveTrack] = useState(TRACKS[0]);
  const rows = generate(activeTrack);

  const medal = (r: number) => {
    if (r === 1) return "🥇";
    if (r === 2) return "🥈";
    if (r === 3) return "🥉";
    return `#${r}`;
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">🏆 Globalny ranking</span>
          <h1 className="section-title">Tabela wyników</h1>
          <p className="section-sub">
            Porównaj swoje czasy z najlepszymi graczami na świecie. Wyniki aktualizowane w czasie rzeczywistym.
          </p>
        </div>

        {/* Track filter */}
        <div className={styles.chipBar}>
          {TRACKS.map((t) => (
            <button
              key={t}
              className={`${styles.chip} ${activeTrack === t ? styles.chipActive : ""}`}
              onClick={() => setActiveTrack(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className={`${styles.tableWrap} glass-card`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Gracz</th>
                <th>Auto</th>
                <th>Czas</th>
                <th>Punkty</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.rank} className={row.rank <= 3 ? styles.topRow : ""}>
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
      </div>
    </div>
  );
}
