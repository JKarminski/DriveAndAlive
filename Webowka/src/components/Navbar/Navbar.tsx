import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.scss";

const NAV_ITEMS = [
  { to: "/leaderboard",  label: "Tabela wyników",  icon: "🏆" },
  { to: "/achievements", label: "Osiągnięcia",      icon: "🎯" },
  { to: "/map-creator",  label: "Map Creator",      icon: "🗺️" },
  { to: "/weather",      label: "Pogoda",           icon: "⛅" },
  { to: "/download",     label: "Pobierz grę",      icon: "⬇️" },
  { to: "/about",        label: "O nas",            icon: "ℹ️" },
];

export default function Navbar(): JSX.Element {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [user, setUser]           = useState<{ name: string; avatar: string } | null>(null);
  const location = useLocation();
  const prevPath = useRef(location.pathname);

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
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.linkIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className={styles.right}>
          {user ? (
            <div className={styles.userMenu}>
              <Link to="/settings" className={styles.avatar}>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name.split(" ")[0]}</span>
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Wyloguj
              </button>
            </div>
          ) : (
            <Link to="/login" className={`btn btn-primary ${styles.loginBtn}`}>
              Zaloguj się
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
            className={({ isActive }) =>
              `${styles.drawerLink} ${isActive ? styles.active : ""}`
            }
          >
            <span>{item.icon}</span> {item.label}
          </NavLink>
        ))}
        {!user && (
          <Link to="/login" className={`btn btn-primary ${styles.drawerLogin}`}>
            Zaloguj się
          </Link>
        )}
      </div>
    </header>
  );
}
