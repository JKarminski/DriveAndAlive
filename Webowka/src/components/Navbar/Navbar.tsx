import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../context/I18nContext";

const NAV_ITEMS = [
  { to: "/leaderboard",  i18nKey: "nav.leaderboard",  icon: "🏆" },
  { to: "/achievements", i18nKey: "nav.achievements", icon: "🎯" },
  { to: "/map-creator",  i18nKey: "nav.mapCreator",   icon: "🗺️" },
  { to: "/weather",      i18nKey: "nav.weather",      icon: "⛅" },
  { to: "/download",     i18nKey: "nav.download",     icon: "⬇️" },
  { to: "/about",        i18nKey: "nav.about",        icon: "ℹ️" },
  { to: "/docs",         i18nKey: "nav.docs",         icon: "📚" },
];

export default function Navbar(): JSX.Element {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [user, setUser]           = useState<{ name: string; avatar: string } | null>(null);
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang, t } = useI18n();

  const cycleTheme = () => {
    if (theme === "dark") setTheme("formal");
    else if (theme === "formal") setTheme("light");
    else setTheme("dark");
  };

  const getThemeIcon = () => {
    if (theme === "dark") return "🌙";
    if (theme === "formal") return "👔";
    return "☀️";
  };

  // Close menu on route change
  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      setMenuOpen(false);
      prevPath.current = location.pathname;
    }
  }, [location]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fake auth – read from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("daa_user");
    if (stored) setUser(JSON.parse(stored));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("daa_user");
    setUser(null);
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`${styles.inner} container`}>
        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>🏎️</span>
          <span className={styles.brandName}>
            Drive<span className={styles.brandAccent}>And</span>Alive
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              target={item.to === "/docs" ? "_blank" : undefined}
              rel={item.to === "/docs" ? "noopener noreferrer" : undefined}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.linkIcon}>{item.icon}</span>
              {t(item.i18nKey)}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className={styles.right}>
          <button className={styles.themeToggle} onClick={toggleLang} title="Zmień język">
            {lang === "pl" ? "🇵🇱" : "🇬🇧"}
          </button>
          <button className={styles.themeToggle} onClick={cycleTheme} title="Zmień motyw">
            {getThemeIcon()}
          </button>
          {user ? (
            <div className={styles.userMenu}>
              <Link to="/settings" className={styles.avatar}>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name.split(" ")[0]}</span>
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <Link to="/login" className={`btn btn-primary ${styles.loginBtn}`}>
              {t("nav.login")}
            </Link>
          )}

          {/* Burger */}
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            target={item.to === "/docs" ? "_blank" : undefined}
            rel={item.to === "/docs" ? "noopener noreferrer" : undefined}
            className={({ isActive }) =>
              `${styles.drawerLink} ${isActive ? styles.active : ""}`
            }
          >
            <span>{item.icon}</span> {t(item.i18nKey)}
          </NavLink>
        ))}
        {!user && (
          <Link to="/login" className={`btn btn-primary ${styles.drawerLogin}`}>
            {t("nav.login")}
          </Link>
        )}
      </div>
    </header>
  );
}
