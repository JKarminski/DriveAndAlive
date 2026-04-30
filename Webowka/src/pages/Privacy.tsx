import React from "react";
import globalStyles from "./PageShared.module.scss";
import legalStyles from "./Legal.module.scss";
import { useI18n } from "../context/I18nContext";

export default function Privacy(): JSX.Element {
  const { t } = useI18n();

  return (
    <div className={globalStyles.page}>
      <div className={legalStyles.legalContainer}>
        <div className={`${globalStyles.pageHeader} fade-up`}>
          <span className="section-label">🔒 {t("privacy.label")}</span>
          <h1 className="section-title">{t("privacy.title")}</h1>
          <p className="section-sub">{t("privacy.subtitle")}</p>
        </div>

        <div className={`${legalStyles.legalCard} glass-card fade-up`}>
          <span className={legalStyles.dateMeta}>{t("privacy.lastUpdate")}</span>

          <h2>1. {t("privacy.h1")}</h2>
          <p>
            {t("privacy.p1")}
          </p>

          <h2>2. {t("privacy.h2")}</h2>
          <p>{t("privacy.p2")}</p>
          <ul>
            <li><strong>{t("privacy.li2_1_strong")}</strong> {t("privacy.li2_1")}</li>
            <li><strong>{t("privacy.li2_2_strong")}</strong> {t("privacy.li2_2")}</li>
            <li><strong>{t("privacy.li2_3_strong")}</strong> {t("privacy.li2_3")}</li>
          </ul>

          <h2>3. {t("privacy.h3")}</h2>
          <p>{t("privacy.p3")}</p>
          <ul>
            <li>{t("privacy.li3_1")}</li>
            <li>{t("privacy.li3_2")}</li>
            <li>{t("privacy.li3_3")}</li>
          </ul>

          <h2>4. {t("privacy.h4")}</h2>
          <p>
            {t("privacy.p4")}
          </p>

          <h2>5. {t("privacy.h5")}</h2>
          <p>
            {t("privacy.p5")} <strong>privacy@driveandalive.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
