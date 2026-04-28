import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Terms from "./pages/Terms";
import ScrollToTop from "./components/ScrollToTop";

export default function App(): JSX.Element {
  const location = useLocation();
  const showFooter = location.pathname !== "/login";

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="page-wrapper">
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
          <Route path="/privacy"      element={<Privacy />} />
          <Route path="/cookies"      element={<Cookies />} />
          <Route path="/terms"        element={<Terms />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </>
  );
}
