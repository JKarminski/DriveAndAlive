import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import MapCreator from "./pages/MapCreator";
import Login from "./pages/Login";
import Download from "./pages/Download";
import Weather from "./pages/Weather";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Docs from "./pages/Docs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ScrollToTop from "./components/ScrollToTop";

export default function App(): JSX.Element {
  const location = useLocation();
  const showFooter = location.pathname !== "/login";

  useEffect(() => {
    // 1. Initialize Smooth Scrolling (Lenis)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Intersection Observer for Reveal Effects
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal-element").forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      lenis.destroy();
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      {location.pathname !== "/docs" && <Navbar />}
      <div className="page-wrapper" style={{ paddingTop: location.pathname === "/docs" ? 0 : undefined }}>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/leaderboard"  element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/map-creator"  element={<MapCreator />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/download"     element={<Download />} />
          <Route path="/weather"      element={<Weather />} />
          <Route path="/settings"     element={<Settings />} />
          <Route path="/about"        element={<About />} />
          <Route path="/docs"         element={<Docs />} />
          <Route path="/privacy"      element={<Privacy />} />
          <Route path="/terms"        element={<Terms />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showFooter && location.pathname !== "/docs" && <Footer />}
    </>
  );
}
