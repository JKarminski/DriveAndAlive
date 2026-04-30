import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PageShared.module.scss";
import { useI18n } from "../context/I18nContext";

const AVATARS = [
  "https://api.dicebear.com/8.x/bottts/svg?seed=alpha",
  "https://api.dicebear.com/8.x/bottts/svg?seed=beta",
  "https://api.dicebear.com/8.x/bottts/svg?seed=gamma",
  "https://api.dicebear.com/8.x/bottts/svg?seed=delta",
  "https://api.dicebear.com/8.x/bottts/svg?seed=epsilon",
  "https://api.dicebear.com/8.x/bottts/svg?seed=zeta",
];

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useI18n();

  const MOCK_RECORDS = [
    { track: t("leaderboard.trackAlpine") || "Alpejska Przeprawa", time: "2:14.381", rank: 12 },
    { track: t("leaderboard.trackGravel") || "Szutrowy Sprint",    time: "1:58.042", rank: 5  },
    { track: t("leaderboard.trackNight")  || "Nocna Autostrada",   time: "3:01.778", rank: 28 },
  ];

  const [mode, setMode]         = useState<"login"|"register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selAvatar, setSelAvatar] = useState(0);
  const [err, setErr]           = useState("");

  const stored = localStorage.getItem("daa_user");
  const user   = stored ? JSON.parse(stored) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setErr(t("login.errEmptyFields")); return; }
    const newUser = { name: username, avatar: AVATARS[selAvatar] };
    localStorage.setItem("daa_user", JSON.stringify(newUser));
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("daa_user");
    navigate("/");
  };

  /* ── Logged in – profile view ── */
  if (user) {
    return (
      <div className={styles.page}>
        <div className={`${styles.authCard} glass-card fade-up`}>
          <div className={styles.profileHeader}>
            <img src={user.avatar} alt={user.name} className={styles.profileAvatar} />
            <div>
              <h2 className={styles.profileName}>{user.name}</h2>
              <p className={styles.profileSub}>{t("login.loggedInPlayer")}</p>
            </div>
          </div>

          <div className={styles.recordsSection}>
            <h3 className={styles.recordsTitle}>🏁 {t("login.myRecords")}</h3>
            <div className={styles.recordsList}>
              {MOCK_RECORDS.map((r) => (
                <div key={r.track} className={styles.recordRow}>
                  <span className={styles.recordTrack}>{r.track}</span>
                  <span className={styles.recordTime}>⏱ {r.time}</span>
                  <span className={styles.recordRank}>#{r.rank}</span>
                </div>
              ))}
            </div>
            <p className={styles.recordsNote}>{t("login.recordsNote")}</p>
          </div>

          <div className={styles.profileActions}>
            <button className="btn btn-outline" onClick={() => navigate("/settings")}>⚙️ {t("settings.title")}</button>
            <button className="btn btn-ghost" onClick={handleLogout} style={{ color:"var(--danger)" }}>{t("nav.logout")}</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Guest – login/register form ── */
  return (
    <div className={styles.page}>
      <div className={`${styles.authCard} glass-card fade-up`}>
        {/* Tabs */}
        <div className={styles.authTabs}>
          <button className={`${styles.authTab} ${mode === "login" ? styles.authTabActive : ""}`}
            onClick={() => setMode("login")}>{t("login.tabLogin")}</button>
          <button className={`${styles.authTab} ${mode === "register" ? styles.authTabActive : ""}`}
            onClick={() => setMode("register")}>{t("login.tabRegister")}</button>
        </div>

        <h1 className={styles.authTitle}>
          {mode === "login" ? t("login.titleLogin") : t("login.titleRegister")}
        </h1>
        <p className={styles.authSub}>
          {mode === "login"
            ? t("login.subLogin")
            : t("login.subRegister")}
        </p>

        {/* Avatar picker (register only) */}
        {mode === "register" && (
          <div className={styles.avatarPicker}>
            <label className={styles.fieldLabel}>{t("login.chooseAvatar")}</label>
            <div className={styles.avatarGrid}>
              {AVATARS.map((av, i) => (
                <button key={i} className={`${styles.avatarOption} ${selAvatar === i ? styles.avatarSelected : ""}`}
                  onClick={() => setSelAvatar(i)} type="button">
                  <img src={av} alt={`avatar-${i}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t("login.playerName")}</label>
            <input className={styles.fieldInput} value={username}
              onChange={(e) => setUsername(e.target.value)} placeholder="np. SpeedKing99" />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t("login.password")}</label>
            <input className={styles.fieldInput} type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {err && <p className={styles.errMsg}>{err}</p>}
          <button type="submit" className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }}>
            {mode === "login" ? t("login.tabLogin") : t("login.tabRegister")}
          </button>
        </form>
      </div>
    </div>
  );
}
