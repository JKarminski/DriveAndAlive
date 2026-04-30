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

          {/* 1. Administrator */}
          <h2>1. {t("privacy.h1")}</h2>
          <p>{t("privacy.p1")}</p>

          {/* 2. Jakie dane gromadzimy */}
          <h2>2. {t("privacy.h2")}</h2>
          <p>{t("privacy.p2")}</p>
          <ul>
            <li><strong>{t("privacy.li2_1_strong")}</strong> {t("privacy.li2_1")}</li>
            <li><strong>{t("privacy.li2_2_strong")}</strong> {t("privacy.li2_2")}</li>
            <li><strong>{t("privacy.li2_3_strong")}</strong> {t("privacy.li2_3")}</li>
          </ul>

          {/* 3. Cele i podstawy prawne */}
          <h2>3. {t("privacy.h3")}</h2>
          <p>{t("privacy.p3")}</p>
          <ul>
            <li>{t("privacy.li3_1")}</li>
            <li>{t("privacy.li3_2")}</li>
            <li>{t("privacy.li3_3")}</li>
            <li>{t("privacy.li3_4")}</li>
            <li>{t("privacy.li3_5")}</li>
          </ul>
          <p>{t("privacy.p3_2")}</p>

          {/* 4. Okres przechowywania */}
          <h2>4. {t("privacy.h4")}</h2>
          <ul>
            <li>{t("privacy.li4_1")}</li>
            <li>{t("privacy.li4_2")}</li>
            <li>{t("privacy.li4_3")}</li>
            <li>{t("privacy.li4_4")}</li>
          </ul>

          {/* 5. Kto ma dostęp */}
          <h2>5. {t("privacy.h5")}</h2>
          <p>{t("privacy.p5")}</p>

          {/* 6. Czy podanie danych jest obowiązkowe */}
          <h2>6. {t("privacy.h6")}</h2>
          <p>{t("privacy.p6")}</p>

          {/* 7. Twoje prawa */}
          <h2>7. {t("privacy.h7")}</h2>
          <p>{t("privacy.p7")}</p>
          <ul>
            <li>{t("privacy.li7_1")}</li>
            <li>{t("privacy.li7_2")}</li>
            <li>{t("privacy.li7_3")}</li>
            <li>{t("privacy.li7_4")}</li>
            <li>{t("privacy.li7_5")}</li>
            <li>{t("privacy.li7_6")}</li>
            <li>{t("privacy.li7_7")}</li>
          </ul>
          <p>{t("privacy.p7_2")}</p>

          {/* 8. Kontakt */}
          <h2>8. {t("privacy.h8")}</h2>
          <p>{t("privacy.p8")}</p>
        </div>
      </div>
    </div>
  );
}
