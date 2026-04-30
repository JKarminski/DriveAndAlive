/**
 * Frontend component tests – Leaderboard page
 *
 * Mocks the API call and verifies rendering of the table, filters,
 * loading state, and error state.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Leaderboard from "../../pages/Leaderboard";
import { I18nContext } from "../../context/I18nContext";

/* ── Mock the API module ── */
vi.mock("../../services/api", () => ({
  api: {
    leaderboard: {
      get: vi.fn(),
    },
  },
}));

import { api } from "../../services/api";

const mockEntry = (rank: number) => ({
  id:      `all-${rank}`,
  rank,
  name:    `Player${rank}`,
  car:     "BMW M3",
  country: "🇵🇱",
  time:    "1:23.456",
  timeMs:  83456,
  pts:     10000 - rank * 400,
  track:   "all",
});

const mockLeaderboardResponse = {
  success: true,
  data:       [mockEntry(1), mockEntry(2), mockEntry(3)],
  total:      20,
  page:       1,
  limit:      20,
  totalPages: 1,
  track:      "all",
};

const mockI18n = {
  lang: "pl" as const,
  toggleLang: vi.fn(),
  t: (key: string) => {
    const map: Record<string, string> = {
      "leaderboard.label":       "Globalny ranking",
      "leaderboard.title":       "Tabela wyników",
      "leaderboard.subtitle":    "Porównaj swoje czasy.",
      "leaderboard.trackAll":    "Wszystkie trasy",
      "leaderboard.trackAlpine": "Alpejska Przeprawa",
      "leaderboard.trackGravel": "Szutrowy Sprint",
      "leaderboard.trackNight":  "Nocna Autostrada",
      "leaderboard.trackMountain":"Górska Pętla",
      "leaderboard.trackDesert": "Pustynny Slalom",
      "leaderboard.colPlayer":   "Gracz",
      "leaderboard.colCar":      "Auto",
      "leaderboard.colTime":     "Czas",
      "leaderboard.colPts":      "Punkty",
      "leaderboard.loading":     "Ładowanie...",
      "leaderboard.prev":        "Poprzednia",
      "leaderboard.next":        "Następna",
    };
    return map[key] ?? key;
  },
};

function renderLeaderboard() {
  return render(
    <MemoryRouter>
      <I18nContext.Provider value={mockI18n as any}>
        <Leaderboard />
      </I18nContext.Provider>
    </MemoryRouter>
  );
}

describe("Leaderboard page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.leaderboard.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockLeaderboardResponse);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page title", async () => {
    renderLeaderboard();
    await waitFor(() => {
      expect(screen.getByText("Tabela wyników")).toBeInTheDocument();
    });
  });

  it("renders track filter chips", async () => {
    renderLeaderboard();
    await waitFor(() => {
      expect(screen.getByText("Wszystkie trasy")).toBeInTheDocument();
      expect(screen.getByText("Alpejska Przeprawa")).toBeInTheDocument();
    });
  });

  it("renders table headers", async () => {
    renderLeaderboard();
    await waitFor(() => {
      expect(screen.getByText("Gracz")).toBeInTheDocument();
      expect(screen.getByText("Auto")).toBeInTheDocument();
      expect(screen.getByText("Czas")).toBeInTheDocument();
      expect(screen.getByText("Punkty")).toBeInTheDocument();
    });
  });

  it("renders player data from API", async () => {
    renderLeaderboard();
    await waitFor(() => {
      expect(screen.getByText("Player1")).toBeInTheDocument();
      expect(screen.getByText("Player2")).toBeInTheDocument();
      expect(screen.getByText("Player3")).toBeInTheDocument();
    });
  });

  it("shows medals for top 3 players", async () => {
    renderLeaderboard();
    await waitFor(() => {
      expect(screen.getByText("🥇")).toBeInTheDocument();
      expect(screen.getByText("🥈")).toBeInTheDocument();
      expect(screen.getByText("🥉")).toBeInTheDocument();
    });
  });

  it("calls API with new track when filter is clicked", async () => {
    renderLeaderboard();
    await waitFor(() => screen.getByText("Alpejska Przeprawa"));

    fireEvent.click(screen.getById("track-filter-alpine-crossing"));

    await waitFor(() => {
      expect(api.leaderboard.get).toHaveBeenCalledWith(
        expect.objectContaining({ track: "alpine-crossing" })
      );
    });
  });

  it("shows loading state initially", () => {
    // Don't resolve the promise right away
    (api.leaderboard.get as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {})
    );
    renderLeaderboard();
    expect(screen.getByText("Ładowanie...")).toBeInTheDocument();
  });

  it("shows error state when API fails", async () => {
    (api.leaderboard.get as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network error")
    );
    renderLeaderboard();
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it("hides pagination when only 1 page", async () => {
    renderLeaderboard();
    await waitFor(() => screen.getByText("Player1"));
    expect(screen.queryByText("Poprzednia")).not.toBeInTheDocument();
  });

  it("shows pagination when multiple pages exist", async () => {
    (api.leaderboard.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockLeaderboardResponse,
      totalPages: 3,
    });
    renderLeaderboard();
    await waitFor(() => {
      expect(screen.getByText("Następna →")).toBeInTheDocument();
    });
  });
});

/* ── Helper to get element by id ── */
declare global {
  interface Screen {
    getByid: (id: string) => HTMLElement;
  }
}
function getByIdHelper(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id="${id}" not found`);
  return el;
}
// Extend screen object
(screen as any).getById = getByIdHelper;
