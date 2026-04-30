import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
import { useI18n } from "../../context/I18nContext";

export default function Footer(): JSX.Element {
  const { t } = useI18n();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.topSection}>
          
          <div className={styles.brandContainer}>
            <Link to="/" className={styles.brand}>
              <svg className={styles.brandIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM7.5 16c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              <span className={styles.brandName}>
                Drive<span className={styles.brandAccent}>And</span>Alive
              </span>
            </Link>
            <p className={styles.slogan}>{t("footer.slogan")}</p>
          </div>

          <div className={styles.linksContainer}>
            <div className={styles.navLinks}>
              <h4 className={styles.linksTitle}>{t("footer.infoTitle")}</h4>
              <Link to="/about" className={styles.navLink}>{t("nav.about")}</Link>
              <Link to="/download" className={styles.navLink}>{t("nav.download")}</Link>
              <Link to="/settings" className={styles.navLink}>{t("settings.title")}</Link>
            </div>
            
            <div className={styles.navLinks}>
              <h4 className={styles.linksTitle}>{t("footer.privacyTitle")}</h4>
              <Link to="/privacy" target="_blank" rel="noopener noreferrer" className={styles.navLink}>{t("footer.privacyPolicy")}</Link>
              <Link to="/cookies" target="_blank" rel="noopener noreferrer" className={styles.navLink}>{t("footer.cookies")}</Link>
              <Link to="/terms" target="_blank" rel="noopener noreferrer" className={styles.navLink}>{t("footer.terms")}</Link>
            </div>
          </div>

          <div className={styles.actionContainer}>
            <Link to="/download" className={`btn btn-primary ${styles.downloadBtn}`}>
              ⬇️ {t("footer.downloadFree")}
            </Link>

            <div className={styles.socials}>
              {/* X / Twitter */}
              <a href="#" className={styles.socialIcon} aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className={styles.socialIcon} aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849C2.382 3.858 3.898 2.307 7.151 2.16 8.417 2.102 8.796 2.09 12 2.09zm0-2.09c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className={styles.socialIcon} aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.separator}></div>

        <div className={styles.bottomSection}>
          <p className={styles.copy}>{t("footer.copyright")}</p>
          <button className={styles.scrollTop} onClick={scrollToTop} aria-label="Do góry">
            <span className={styles.scrollIcon}>↑</span>
            <span>{t("footer.backToTop")}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
