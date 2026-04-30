import React from "react";
import globalStyles from "./PageShared.module.scss";
import legalStyles from "./Legal.module.scss";
import { useI18n } from "../context/I18nContext";

export default function Cookies(): JSX.Element {
  const { t } = useI18n();

  return (
    <div className={globalStyles.page}>
      <div className={legalStyles.legalContainer}>
        <div className={`${globalStyles.pageHeader} fade-up`}>
          <span className="section-label">🍪 {t("cookies.label")}</span>
          <h1 className="section-title">{t("cookies.title")}</h1>
          <p className="section-sub">{t("cookies.subtitle")}</p>
        </div>

        <div className={`${legalStyles.legalCard} glass-card fade-up`}>
          <span className={legalStyles.dateMeta}>{t("cookies.lastUpdate")}</span>

          {/* 1. Czym są cookies */}
          <h2>1. {t("cookies.h1")}</h2>
          <p>{t("cookies.p1")}</p>

          {/* 2. Rodzaje cookies */}
          <h2>2. {t("cookies.h2")}</h2>
          <p>{t("cookies.p2")}</p>
          <ul>
            <li>
              <strong>{t("cookies.li2_1_strong")}</strong> {t("cookies.li2_1")}
            </li>
            <li>
              <strong>{t("cookies.li2_2_strong")}</strong> {t("cookies.li2_2")}
            </li>
          </ul>

          {/* 3. Cookies własne i zewnętrzne */}
          <h2>3. {t("cookies.h3")}</h2>
          <p>{t("cookies.p3")}</p>

          {/* 4. Czas przechowywania */}
          <h2>4. {t("cookies.h4")}</h2>
          <ul>
            <li>{t("cookies.li4_1")}</li>
            <li>{t("cookies.li4_2")}</li>
          </ul>

          {/* 5. Local Storage */}
          <h2>5. {t("cookies.h5")}</h2>
          <p>{t("cookies.p5")}</p>
          <ul>
            <li>{t("cookies.li5_1")}</li>
            <li>{t("cookies.li5_2")}</li>
            <li>{t("cookies.li5_3")}</li>
          </ul>

          {/* 6. Zarządzanie cookies */}
          <h2>6. {t("cookies.h6")}</h2>
          <p>{t("cookies.p6")}</p>
          <ul>
            <li>{t("cookies.li6_1")}</li>
            <li>{t("cookies.li6_2")}</li>
            <li>{t("cookies.li6_3")}</li>
          </ul>
          <p>{t("cookies.p6_2")}</p>

          {/* 7. Informacje o przetwarzaniu */}
          <h2>7. {t("cookies.h7")}</h2>
          <p>{t("cookies.p7")}</p>
        </div>
      </div>
    </div>
  );
}
