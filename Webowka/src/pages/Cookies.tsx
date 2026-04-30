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

          <h2>1. {t("cookies.h1")}</h2>
          <p>
            {t("cookies.p1")}
          </p>

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

          <h2>3. {t("cookies.h3")}</h2>
          <p>
            {t("cookies.p3")}
          </p>

          <h2>4. {t("cookies.h4")}</h2>
          <p>
            {t("cookies.p4")}
          </p>
        </div>
      </div>
    </div>
  );
}
