import React, { useState } from "react";
import styles from "./PageShared.module.scss";
import { useI18n } from "../context/I18nContext";

export default function Settings(): JSX.Element {
  const [tab, setTab] = useState<"profile"|"general">("profile");
  const [notif, setNotif]   = useState(true);
  const [sounds, setSounds] = useState(true);
  const [metric, setMetric] = useState(true);
  
  const { lang, setLang, t } = useI18n();

  const stored = localStorage.getItem("daa_user");
  const user   = stored ? JSON.parse(stored) : null;

  return (
    <div className={styles.page}>
      <div className="container" style={{ maxWidth: 840 }}>
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">⚙️ {t("settings.config")}</span>
          <h1 className="section-title">{t("settings.title")}</h1>
        </div>

        {/* Tabs */}
        <div className={styles.authTabs} style={{ marginBottom: 32 }}>
          <button className={`${styles.authTab} ${tab === "profile" ? styles.authTabActive : ""}`}
            onClick={() => setTab("profile")}>👤 {t("settings.tabProfile")}</button>
          <button className={`${styles.authTab} ${tab === "general" ? styles.authTabActive : ""}`}
            onClick={() => setTab("general")}>🌐 {t("settings.tabGeneral")}</button>
        </div>

        {tab === "profile" && (
          <div className={`${styles.settingsCard} glass-card fade-up`}>
            {user ? (
              <>
                <div className={styles.profileHeader} style={{ marginBottom: 28 }}>
                  <img src={user.avatar} alt={user.name} className={styles.profileAvatar} />
                  <div>
                    <h2 className={styles.profileName}>{user.name}</h2>
                    <p className={styles.profileSub}>Zalogowany gracz</p>
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Zmień nazwę gracza</label>
                  <input className={styles.fieldInput} defaultValue={user.name} placeholder="Nowa nazwa..." />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Nowe hasło</label>
                  <input className={styles.fieldInput} type="password" placeholder="••••••••" />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Potwierdź hasło</label>
                  <input className={styles.fieldInput} type="password" placeholder="••••••••" />
                </div>
                <button className="btn btn-primary" style={{ marginTop: 8 }}>💾 Zapisz zmiany</button>
              </>
            ) : (
              <div className={styles.noUser}>
                <span>🔒</span>
                <p>Musisz być zalogowany aby edytować profil.</p>
                <a href="/login" className="btn btn-primary">Zaloguj się</a>
              </div>
            )}
          </div>
        )}

        {tab === "general" && (
          <div className={`${styles.settingsCard} glass-card fade-up`}>
            <h3 className={styles.settingsGroup}>{t("settings.notifAndSound")}</h3>
            {[
              { label:t("settings.pushNotif"), val:notif,  set:setNotif  },
              { label:t("settings.uiSounds"),  val:sounds, set:setSounds },
            ].map((item) => (
              <div key={item.label} className={styles.toggleRow}>
                <span>{item.label}</span>
                <button
                  className={`${styles.toggle} ${item.val ? styles.toggleOn : ""}`}
                  onClick={() => item.set((v: boolean) => !v)}
                >
                  <span className={styles.toggleThumb} />
                </button>
              </div>
            ))}

            <h3 className={styles.settingsGroup} style={{ marginTop: 24 }}>{t("settings.unitsAndLang")}</h3>
            <div className={styles.toggleRow}>
              <span>{t("settings.metricUnits")}</span>
              <button
                className={`${styles.toggle} ${metric ? styles.toggleOn : ""}`}
                onClick={() => setMetric((v) => !v)}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
            <div className={styles.fieldGroup} style={{ marginTop: 16 }}>
              <label className={styles.fieldLabel}>{t("settings.uiLang")}</label>
              <select className={styles.fieldInput} value={lang} onChange={(e) => setLang(e.target.value)}>
                <option value="pl">🇵🇱 Polski</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 8 }}>💾 {t("settings.saveSettings")}</button>
          </div>
        )}
      </div>
    </div>
  );
}
