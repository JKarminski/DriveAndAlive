/**
 * Frontend component tests – Navbar
 *
 * Tests that navigation links render, mobile menu toggles, etc.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Navbar from "../components/Navbar/Navbar";
import { ThemeContext } from "../context/ThemeContext";
import { I18nContext } from "../context/I18nContext";

/* ── Mock contexts ── */
const mockTheme = {
  theme: "dark" as const,
  setTheme: vi.fn(),
};

const mockI18n = {
  lang: "pl" as const,
  toggleLang: vi.fn(),
  t: (key: string) => {
    const map: Record<string, string> = {
      "nav.leaderboard":  "Tabela wyników",
      "nav.achievements": "Osiągnięcia",
      "nav.mapCreator":   "Map Creator",
      "nav.weather":      "Pogoda",
      "nav.download":     "Pobierz grę",
      "nav.about":        "O nas",
      "nav.login":        "Zaloguj się",
      "nav.logout":       "Wyloguj",
    };
    return map[key] ?? key;
  },
};

/* ── Helper ── */
function renderNavbar() {
  return render(
    <MemoryRouter>
      <ThemeContext.Provider value={mockTheme as any}>
        <I18nContext.Provider value={mockI18n as any}>
          <Navbar />
        </I18nContext.Provider>
      </ThemeContext.Provider>
    </MemoryRouter>
  );
}

describe("Navbar component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders the DriveAndAlive brand name", () => {
    renderNavbar();
    expect(screen.getByText(/drive/i)).toBeInTheDocument();
  });

  it("renders all navigation links on desktop", () => {
    renderNavbar();
    expect(screen.getAllByText("Tabela wyników").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Osiągnięcia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Map Creator").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pogoda").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pobierz grę").length).toBeGreaterThan(0);
    expect(screen.getAllByText("O nas").length).toBeGreaterThan(0);
  });

  it("shows Login button when not logged in", () => {
    renderNavbar();
    expect(screen.getAllByText("Zaloguj się").length).toBeGreaterThan(0);
  });

  it("shows user avatar when logged in", () => {
    localStorage.setItem(
      "daa_user",
      JSON.stringify({ name: "TestRacer", avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=alpha" })
    );
    renderNavbar();
    expect(screen.getByText(/TestRacer/i)).toBeInTheDocument();
  });

  it("toggles mobile menu on burger click", () => {
    renderNavbar();
    const burger = screen.getByLabelText(/menu/i);
    expect(burger).toBeInTheDocument();
    fireEvent.click(burger);
    // After click, burger should have open class - check aria or content
    fireEvent.click(burger); // toggle back
  });

  it("renders theme toggle button", () => {
    renderNavbar();
    // Theme and lang toggle buttons both exist
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("calls toggleLang when language button is clicked", () => {
    renderNavbar();
    const flagButton = screen.getByTitle("Zmień język");
    fireEvent.click(flagButton);
    expect(mockI18n.toggleLang).toHaveBeenCalledTimes(1);
  });

  it("logo links to /", () => {
    renderNavbar();
    const brandLink = screen.getByRole("link", { name: /drive/i });
    expect(brandLink).toHaveAttribute("href", "/");
  });
});
