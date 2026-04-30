import React, { useState, useEffect } from "react";
import styles from "./Docs.module.scss";

// ----------------------------------------------------
// DANE SEKCJI: PORTAL WEBOWY
// ----------------------------------------------------
const webSections = [
  { id: "web-nav", title: "Nawigacja (Navbar)", desc: "Szklany pasek nawigacyjny z systemem ruterów, responsywny na urządzeniach mobilnych.", img: "/screenshots/web/nav.png" },
  { id: "web-home", title: "Strona Główna", desc: "Hero section, dynamiczny zarys środowiska, przewijane nowości oraz Call To Action.", img: "/screenshots/web/home.png" },
  { id: "web-leaderboard", title: "Tabela Wyników", desc: "Globalny ranking z paginacją. Dane pobierane asynchronicznie, pokazujące najlepsze czasy graczy.", img: "/screenshots/web/leaderboard.png" },
  { id: "web-achievements", title: "Osiągnięcia", desc: "Katalog wyzwań podzielony na zdobyte i zablokowane. Płynne podświetlanie odblokowanych celów.", img: "/screenshots/web/achievements.png" },
  { id: "web-map", title: "Map Creator", desc: "Wizualne środowisko dla graczy do konfiguracji szorstkości, wysokości i zakrętów map z opcją eksportu (Seed).", img: "/screenshots/web/map.png" },
  { id: "web-weather", title: "Stacja Pogodowa", desc: "Terminal pobierający realne dane atmosferyczne z chmury, determinujące fizykę jazdy.", img: "/screenshots/web/weather.png" },
  { id: "web-download", title: "Pobierz Grę", desc: "Rozbudowana podstrona dystrybucyjna dla platform Android i iOS z wymaganiami sprzętowymi.", img: "/screenshots/web/download.png" },
  { id: "web-about", title: "Dokumentacja", desc: "Ten oto potężny moduł techniczny. Glassmorphism, scrollspy i nagrodowe layouty Awwwards.", img: "/screenshots/web/about.png" },
  { id: "web-login", title: "Profil Gracza", desc: "Zarządzanie sesją, avatarem oraz widok osobistych rekordów pobrany z bazy autoryzacji.", img: "/screenshots/web/login.png" },
  { id: "web-policies", title: "Polityka & Regulamin", desc: "Klauzule RODO, pliki cookies oraz szczegółowe ramy prawne dla bezpieczeństwa gracza.", img: "/screenshots/web/policies.png" },
  { id: "web-footer", title: "Stopka (Footer)", desc: "Zakończenie układu strony, mapowanie linków oraz notki o prawach autorskich.", img: "/screenshots/web/footer.png" },
];

// ----------------------------------------------------
// DANE SEKCJI: GRA MOBILNA
// ----------------------------------------------------
const mobileSections = [
  { id: "mob-car", title: "Wybór Auta", desc: "Garaż gracza. Wybór maszyny determinujący wagę, przyśpieszenie i układ napędowy.", img: "/screenshots/mobile/car.png" },
  { id: "mob-map", title: "Wybór Mapy", desc: "Odblokowane tereny. Dostęp do tras szutrowych, alpejskich oraz asfaltowych autostrad.", img: "/screenshots/mobile/map.png" },
  { id: "mob-upgrades", title: "Wybór Ulepszeń", desc: "Warsztat tuningowy. Dostosowanie opon, silnika i aerodynamiki do panujących na trasie warunków.", img: "/screenshots/mobile/upgrades.png" },
  { id: "mob-powerups", title: "Powerupy", desc: "Menu zebranych ulepszeń tymczasowych (Boost, Tarcza) do aktywacji w trakcie wyścigu.", img: "/screenshots/mobile/powerups.png" },
  { id: "mob-engine", title: "Silnik Gry", desc: "Właściwa rozgrywka. Realistyczny symulator tarcia, zawieszenie 3D oraz trasy generowane proceduralnie w locie.", img: "/screenshots/mobile/engine.png" },
  { id: "mob-gameover", title: "Ekran Końcowy", desc: "Rozbicie pojazdu. Wyświetlenie statystyk, zdobytych monet i podsumowanie dystansu.", img: "/screenshots/mobile/gameover.png" },
  { id: "mob-leaderboards", title: "Tabela (Mobilna)", desc: "Synchronizacja wyników w czasie rzeczywistym z lokalnego SQLite wprost na główne serwery gry.", img: "/screenshots/mobile/leaderboards.png" },
];

export default function Docs(): JSX.Element {
  const [activeSection, setActiveSection] = useState("intro");
  
  // States for tracking active split-screen items
  const [activeWebItem, setActiveWebItem] = useState("web-nav");
  const [activeMobItem, setActiveMobItem] = useState("mob-car");

  useEffect(() => {
    // Observer for sidebar sections
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            // Replace URL without jumping
            if (entry.target.id && !entry.target.id.includes("scrollBlock")) {
              window.history.replaceState(null, "", `#${entry.target.id}`);
            }
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    document.querySelectorAll("section[id]").forEach((el) => sectionObserver.observe(el));

    // Observer for scroll items (Web)
    const webObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveWebItem(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    webSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) webObserver.observe(el);
    });

    // Observer for scroll items (Mobile)
    const mobObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveMobItem(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    mobileSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) mobObserver.observe(el);
    });

    return () => {
      sectionObserver.disconnect();
      webObserver.disconnect();
      mobObserver.disconnect();
    };
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Helper function to render the pinned scroll layout
  const renderPinnedScroll = (items: any[], activeId: string, isMobile: boolean = false) => {
    return (
      <div className={styles.splitSection}>
        {/* LEWA STRONA (ZABLOKOWANA/STICKY) */}
        <div className={styles.splitLeft}>
          <div className={`${styles.imageStack} ${isMobile ? styles.mobileStack : ""}`}>
            {items.map((item, index) => {
              const activeIndex = items.findIndex((i) => i.id === activeId);
              let cardClass = styles.stackedImage;
              
              if (index === activeIndex) cardClass += ` ${styles.active}`;
              else if (index < activeIndex) cardClass += ` ${styles.previous}`;
              else cardClass += ` ${styles.buried}`;

              return (
                <div key={item.id} className={cardClass}>
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove(styles.hiddenSpan);
                    }}
                  />
                  <span className={styles.hiddenSpan}>Miejsce na:<br/>{item.img}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRAWA STRONA (SCROLL) */}
        <div className={styles.splitRight}>
          {items.map((item) => (
            <div 
              key={item.id} 
              id={item.id} 
              className={`${styles.scrollBlock} ${activeId === item.id ? styles.active : ""}`}
            >
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.docsLayout}>
      
      {/* ====================================
          LEWY PANEL (STICKY SIDEBAR) 
          ==================================== */}
      <aside className={styles.sidebar}>
        <div className={styles.navTitle}>Spis Treści</div>
        <nav>
          <a href="#intro" onClick={(e) => scrollTo(e, "intro")} className={`${styles.navLink} ${activeSection === "intro" ? styles.active : ""}`}>
            Wstęp
          </a>
          <a href="#architecture" onClick={(e) => scrollTo(e, "architecture")} className={`${styles.navLink} ${activeSection === "architecture" ? styles.active : ""}`}>
            Architektura
          </a>
          
          {/* Aplikacja Webowa + Zagnieżdżenia */}
          <a href="#apps-web" onClick={(e) => scrollTo(e, "apps-web")} className={`${styles.navLink} ${styles.navSubLink} ${activeSection === "apps-web" || activeSection.startsWith("web-") ? styles.active : ""}`}>
            ↳ Portal Webowy
          </a>
          {webSections.map(s => (
             <a key={`nav-${s.id}`} href={`#${s.id}`} onClick={(e) => scrollTo(e, s.id)} className={`${styles.navLink} ${styles.navDeepLink} ${activeWebItem === s.id && (activeSection === "apps-web" || activeSection.startsWith("web-")) ? styles.active : ""}`}>
               {s.title}
             </a>
          ))}

          {/* Aplikacja Mobilna + Zagnieżdżenia */}
          <a href="#apps-mobile" onClick={(e) => scrollTo(e, "apps-mobile")} className={`${styles.navLink} ${styles.navSubLink} ${activeSection === "apps-mobile" || activeSection.startsWith("mob-") ? styles.active : ""}`}>
            ↳ Gra Mobilna
          </a>
          {mobileSections.map(s => (
             <a key={`nav-${s.id}`} href={`#${s.id}`} onClick={(e) => scrollTo(e, s.id)} className={`${styles.navLink} ${styles.navDeepLink} ${activeMobItem === s.id && (activeSection === "apps-mobile" || activeSection.startsWith("mob-")) ? styles.active : ""}`}>
               {s.title}
             </a>
          ))}

          <a href="#database" onClick={(e) => scrollTo(e, "database")} className={`${styles.navLink} ${activeSection === "database" ? styles.active : ""}`}>
            Bazy Danych
          </a>
          <a href="#team" onClick={(e) => scrollTo(e, "team")} className={`${styles.navLink} ${activeSection === "team" ? styles.active : ""}`}>
            Podział Prac
          </a>
          <a href="#testing" onClick={(e) => scrollTo(e, "testing")} className={`${styles.navLink} ${activeSection === "testing" ? styles.active : ""}`}>
            Środowisko QA
          </a>
        </nav>
      </aside>

      {/* ====================================
          PRAWY PANEL (CONTENT)
          ==================================== */}
      <main className={styles.content}>

        {/* --- SEKCJA 0: WSTĘP (HERO WOW EFFECT) --- */}
        <section id="intro" className={`${styles.section} ${styles.introSection}`}>
          <div className={styles.introTitle}>DriveAndAlive<br />Ecosystem</div>
          <p className={styles.introDesc}>
            Interaktywna dokumentacja systemu. Scrolluj, aby doświadczyć potęgi architektury, poznawać 
            ekrany z logiką Pinned Parallax i zgłębiać każdy zaimplementowany mechanizm.
          </p>
        </section>

        {/* --- SEKCJA 1: ARCHITEKTURA --- */}
        <section id="architecture" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Kluczowy filar</span>
            <h2>Architektura Rozproszona</h2>
            <p>Zastosowano całkowity podział na mikroserwisy frontendowe, backendowe i silnik mobilny.</p>
          </div>

          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoCard} ${styles.cardFront}`}>
              <div className={styles.bentoGlow} />
              <div className={styles.iconWrapper}><span className={styles.icon}>🌐</span></div>
              <div className={styles.bentoContent}>
                <h3>Web Frontend</h3>
                <p>React 19 + Vite. Glassmorphism, Lenis Scroll, zaawansowane animacje oparte na <code>Intersection Observer</code>.</p>
              </div>
              <div className={styles.decorativeCode}>
                <div className={styles.codeLine} style={{width: '80%'}}></div>
                <div className={styles.codeLine} style={{width: '60%'}}></div>
                <div className={styles.codeLine} style={{width: '90%'}}></div>
              </div>
            </div>

            <div className={`${styles.bentoCard} ${styles.cardMobile}`}>
              <div className={styles.bentoGlow} />
              <div className={styles.iconWrapper}><span className={styles.icon}>📱</span></div>
              <div className={styles.bentoContent}>
                <h3>Mobile Engine</h3>
                <p>Fizyka 2D, proceduralne generowanie tras, system zawieszenia i zderzeń w czasie rzeczywistym.</p>
              </div>
              <div className={styles.decorativeCircles}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
              </div>
            </div>

            <div className={`${styles.bentoCard} ${styles.cardLogic}`}>
              <div className={styles.bentoGlow} />
              <div className={styles.iconWrapper}><span className={styles.icon}>⚙️</span></div>
              <div className={styles.bentoContent}>
                <h3>Node.js Backend</h3>
                <p>Skalowalna architektura mikroserwisowa. Bezpieczeństwo i wydajność z JWT i bcrypt.</p>
              </div>
              <div className={styles.decorativeNodes}>
                <div className={styles.node}></div><div className={styles.line}></div>
                <div className={styles.node}></div><div className={styles.line}></div>
                <div className={styles.node}></div>
              </div>
            </div>

            <div className={`${styles.bentoCard} ${styles.cardAPI}`}>
              <div className={styles.bentoGlow} />
              <div className={styles.iconWrapper}><span className={styles.icon}>⚡</span></div>
              <div className={styles.bentoContent}>
                <h3>REST API</h3>
                <p>Express-validator, Helmet i Rate Limiting chroniące rdzeń gry.</p>
              </div>
            </div>

            <div className={`${styles.bentoCard} ${styles.cardDB}`}>
              <div className={styles.bentoGlow} />
              <div className={styles.iconWrapper}><span className={styles.icon}>🗄️</span></div>
              <div className={styles.bentoContent}>
                <h3>MongoDB</h3>
                <p>Agregacje, geospatial indexes dla map oraz błyskawiczne tabele wyników.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEKCJA 1.5: APLIKACJE WEBOWE (SPLIT SCREEN) --- */}
        <section id="apps-web" className={styles.section} style={{ padding: 0 }}>
          <div className={styles.sectionHeader} style={{ padding: '8rem 4rem 4rem 4rem', margin: 0 }}>
            <span className={styles.tag}>Widoki Serwisu</span>
            <h2>Portal Webowy</h2>
            <p>Sprawdź wszystkie wyrenderowane ekrany. Asymetryczne wsuwanie elementów linijka po linijce.</p>
          </div>
          
          <div id="web-nav" className={styles.standaloneBlock}>
            <div className={styles.standaloneDesc}>
              <h3>Nawigacja (Navbar)</h3>
              <p>Szklany pasek nawigacyjny. Główna oś komunikacji w portalu, przyklejona zawsze do szczytu ekranu.</p>
            </div>
            <img src="/screenshots/web/nav.png" alt="Navbar" className={styles.standaloneImg} onError={(e) => (e.target as HTMLImageElement).style.opacity = '0.1'} />
          </div>

          {renderPinnedScroll(webSections.filter(s => s.id !== 'web-nav' && s.id !== 'web-footer'), activeWebItem, false)}

          <div id="web-footer" className={styles.standaloneBlock}>
            <div className={styles.standaloneDesc}>
              <h3>Stopka (Footer)</h3>
              <p>Zakończenie układu strony, mapowanie linków oraz notki o prawach autorskich chroniące projekt.</p>
            </div>
            <img src="/screenshots/web/footer.png" alt="Footer" className={styles.standaloneImg} onError={(e) => (e.target as HTMLImageElement).style.opacity = '0.1'} />
          </div>
        </section>

        {/* --- SEKCJA 1.6: APLIKACJE MOBILNE (SPLIT SCREEN) --- */}
        <section id="apps-mobile" className={styles.section} style={{ padding: 0 }}>
          <div className={styles.sectionHeader} style={{ padding: '8rem 4rem 0 4rem' }}>
            <span className={styles.tag}>Jądro Systemu</span>
            <h2>Gra Mobilna</h2>
            <p>Ekrany z jądra gry mobilnej renderującej zaawansowaną fizykę i generowanie terenu w czasie rzeczywistym.</p>
          </div>

          {renderPinnedScroll(mobileSections, activeMobItem, true)}
        </section>

        {/* --- SEKCJA 2: BAZY DANYCH --- */}
        <section id="database" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Pamięć systemu</span>
            <h2>Hybrydowe Bazy Danych</h2>
          </div>

          <div className={styles.isoContainer}>
            <div className={styles.isoLayer}>
              <div className={styles.layerHeader}><div className={styles.dbIcon}>📱</div><h3>SQLite / JSON</h3></div>
              <p>Lokalna pamięć podręczna na smartfonie. Szybki odczyt seedów trasy.</p>
            </div>
            <div className={styles.isoLayer}>
              <div className={styles.layerHeader}><div className={styles.dbIcon}>☁️</div><h3>Firebase</h3></div>
              <p>Chmura odpowiedzialna za uwierzytelnianie sesji autoryzacyjnej graczy (NoSQL).</p>
            </div>
            <div className={styles.isoLayer}>
              <div className={styles.layerHeader}><div className={styles.dbIcon}>🗄️</div><h3>MySQL</h3></div>
              <p>Potężna baza relacyjna optymalizująca zapytania wyników globalnych leaderboardów.</p>
            </div>
          </div>
        </section>

        {/* --- SEKCJA 3: ZESPÓŁ --- */}
        <section id="team" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Ojcowie sukcesu</span>
            <h2>Twórcy Projektu</h2>
          </div>
          <div className={styles.teamGrid}>
            <div className={styles.teamCard}><div className={styles.avatar}>💻</div><h3>Johny</h3><h4>Architekt & Full-Stack</h4><p>Silnik, UI, testy, pełny Frontend & Backend webowy z animacjami glassmorphism.</p></div>
            <div className={styles.teamCard}><div className={styles.avatar}>☁️</div><h3>Goliat</h3><h4>Cloud Specialist</h4><p>Implementacja baz danych MySQL oraz podłączenie systemów Firebase.</p></div>
            <div className={styles.teamCard}><div className={styles.avatar}>🌍</div><h3>Merteno</h3><h4>Localization</h4><p>Opracowanie tekstów, internacjonalizacja (i18n) i wdrożenie warstwy językowej.</p></div>
          </div>
        </section>

        {/* --- SEKCJA 4: TESTY --- */}
        <section id="testing" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Kontrola Jakości</span>
            <h2>Środowisko QA (Testy)</h2>
          </div>
          <div className={styles.terminalWrapper}>
            <div className={styles.terminalHeader}><span/><span/><span/></div>
            <div className={styles.terminalWindow}>
              <div className={styles.logLine}><span className={styles.time}>[10:42:01]</span><span className={`${styles.status} ${styles.statusInfo}`}>INFO</span><span className={styles.msg}>Vitest: Render Frontendu pomyślny.</span></div>
              <div className={styles.logLine}><span className={styles.time}>[10:42:02]</span><span className={`${styles.status} ${styles.statusPass}`}>PASS</span><span className={styles.msg}>Testy użycia hooka api i walidacji zakończone.</span></div>
              <div className={styles.logLine}><span className={styles.time}>[10:42:03]</span><span className={`${styles.status} ${styles.statusInfo}`}>INFO</span><span className={styles.msg}>Jest & Supertest: Start logiki backendu...</span></div>
              <div className={styles.logLine}><span className={styles.time}>[10:42:05]</span><span className={`${styles.status} ${styles.statusPass}`}>PASS</span><span className={styles.msg}>Wszystkie 48 test-case'ów zaliczone. Zero nieszczelności pamięci.<span className={styles.cursor}></span></span></div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
