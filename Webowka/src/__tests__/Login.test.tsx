/**
 * Frontend component tests – Login page
 *
 * Tests form rendering, validation, tab switching, and localStorage interaction.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Login from "../pages/Login";
import { I18nContext } from "../context/I18nContext";

/* ── navigate mock ── */
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockI18n = {
  lang: "pl" as const,
  toggleLang: vi.fn(),
  t: (key: string) => {
    const map: Record<string, string> = {
      "login.tabLogin":      "Logowanie",
      "login.tabRegister":   "Rejestracja",
      "login.titleLogin":    "Witaj z powrotem 👋",
      "login.titleRegister": "Dołącz do gry 🏎️",
      "login.subLogin":      "Zaloguj się",
      "login.subRegister":   "Zarejestruj się",
      "login.chooseAvatar":  "Wybierz avatar",
      "login.playerName":    "Nazwa gracza",
      "login.password":      "Hasło",
      "login.errEmptyFields":"Wypełnij wszystkie pola.",
      "login.loggedInPlayer":"Zalogowany gracz",
      "login.myRecords":     "Moje rekordy",
      "login.recordsNote":   "Uwaga",
      "leaderboard.trackAlpine":  "Alpejska Przeprawa",
      "leaderboard.trackGravel":  "Szutrowy Sprint",
      "leaderboard.trackNight":   "Nocna Autostrada",
      "settings.title":      "Ustawienia",
      "nav.logout":          "Wyloguj",
    };
    return map[key] ?? key;
  },
};

function renderLogin() {
  return render(
    <MemoryRouter>
      <I18nContext.Provider value={mockI18n as any}>
        <Login />
      </I18nContext.Provider>
    </MemoryRouter>
  );
}

describe("Login page", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it("renders login tab by default", () => {
    renderLogin();
    expect(screen.getByText("Witaj z powrotem 👋")).toBeInTheDocument();
  });

  it("renders login and register tabs", () => {
    renderLogin();
    expect(screen.getAllByText("Logowanie").length).toBeGreaterThan(0);
    expect(screen.getByText("Rejestracja")).toBeInTheDocument();
  });

  it("switches to register mode on tab click", () => {
    renderLogin();
    fireEvent.click(screen.getByText("Rejestracja"));
    expect(screen.getByText("Dołącz do gry 🏎️")).toBeInTheDocument();
  });

  it("shows avatar picker only in register mode", () => {
    renderLogin();
    expect(screen.queryByText("Wybierz avatar")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Rejestracja"));
    expect(screen.getByText("Wybierz avatar")).toBeInTheDocument();
  });

  it("shows error when submitting empty form", () => {
    renderLogin();
    const submitBtn = screen.getAllByRole("button").find(
      (b) => b.getAttribute("type") === "submit"
    )!;
    fireEvent.click(submitBtn);
    expect(screen.getByText("Wypełnij wszystkie pola.")).toBeInTheDocument();
  });

  it("saves user to localStorage and navigates on valid login", async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText("np. SpeedKing99"), { target: { value: "TestUser" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password123" } });

    const submitBtn = screen.getAllByRole("button").find(
      (b) => b.getAttribute("type") === "submit"
    )!;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(localStorage.getItem("daa_user")).not.toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("renders profile view when user is already logged in", () => {
    localStorage.setItem(
      "daa_user",
      JSON.stringify({ name: "SpeedRacer", avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=alpha" })
    );
    renderLogin();
    expect(screen.getByText("SpeedRacer")).toBeInTheDocument();
    expect(screen.getByText("Zalogowany gracz")).toBeInTheDocument();
  });

  it("logout clears localStorage and navigates to /", async () => {
    localStorage.setItem(
      "daa_user",
      JSON.stringify({ name: "SpeedRacer", avatar: "https://api.dicebear.com/8.x/bottts/svg?seed=alpha" })
    );
    renderLogin();
    fireEvent.click(screen.getByText("Wyloguj"));
    await waitFor(() => {
      expect(localStorage.getItem("daa_user")).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
