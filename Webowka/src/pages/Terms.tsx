import React from "react";
import globalStyles from "./PageShared.module.scss";
import legalStyles from "./Legal.module.scss";
import { useI18n } from "../context/I18nContext";

export default function Terms(): JSX.Element {
  const { t } = useI18n();

  return (
    <div className={globalStyles.page}>
      <div className={legalStyles.legalContainer}>
        <div className={`${globalStyles.pageHeader} fade-up`}>
          <span className="section-label">📜 {t("terms.label")}</span>
          <h1 className="section-title">{t("terms.title")}</h1>
          <p className="section-sub">{t("terms.subtitle")}</p>
        </div>

        <div className={`${legalStyles.legalCard} glass-card fade-up`}>
          <span className={legalStyles.dateMeta}>{t("terms.lastUpdate")}</span>

          {/* §1 */}
          <h2>§1 {t("terms.h1")}</h2>
          <p>{t("terms.p1")}</p>

          {/* §2 */}
          <h2>§2 {t("terms.h2")}</h2>
          <ul>
            <li>{t("terms.li2_1")}</li>
            <li>{t("terms.li2_2")}</li>
            <li>{t("terms.li2_3")}</li>
          </ul>

          {/* §3 */}
          <h2>§3 {t("terms.h3")}</h2>
          <p>{t("terms.p3_1")}</p>
          <ul>
            <li>{t("terms.li3_1")}</li>
            <li>{t("terms.li3_2")}</li>
          </ul>
          <p>{t("terms.p3_2")}</p>

          {/* §4 */}
          <h2>§4 {t("terms.h4")}</h2>
          <p>{t("terms.p4")}</p>

          {/* §5 */}
          <h2>§5 {t("terms.h5")}</h2>
          <p>{t("terms.p5")}</p>
        </div>
      </div>
    </div>
  );
}
