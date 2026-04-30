/**
 * Frontend component tests – Weather page
 *
 * Mocks the API, tests search form, city chips, display card, and error state.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Weather from "../../pages/Weather";
import { I18nContext } from "../../context/I18nContext";

vi.mock("../../services/api", () => ({
  api: {
    weather: {
      get: vi.fn(),
    },
  },
}));

import { api } from "../../services/api";

const mockWeatherData = {
  city:        "Warsaw",
  country:     "PL",
  description: "częściowe zachmurzenie",
  icon:        "02d",
  temp:        14,
  feelsLike:   12,
  humidity:    68,
  pressure:    1013,
  windSpeed:   5.2,
  visibility:  10000,
  sunrise:     null,
  sunset:      null,
  timestamp:   Date.now(),
  _mock:       true,
};

const mockI18n = {
  lang: "pl" as const,
  toggleLang: vi.fn(),
  t: (key: string) => {
    const map: Record<string, string> = {
      "weather.label":        "Warunki drogowe",
      "weather.title":        "Pogoda na trasie",
      "weather.subtitle":     "Sprawdź warunki pogodowe.",
      "weather.placeholder":  "Wpisz miasto...",
      "weather.searchBtn":    "Szukaj",
      "weather.loading":      "Pobieranie danych...",
      "weather.demoNote":     "Demo mode",
      "weather.statFeelsLike":"Odczuwalna",
      "weather.statHumidity": "Wilgotność",
      "weather.statPressure": "Ciśnienie",
      "weather.statWind":     "Wiatr",
      "weather.gameNoteTitle":"Jak pogoda wpływa na grę?",
      "weather.gameNoteDesc": "Deszcz zmniejsza przyczepność.",
    };
    return map[key] ?? key;
  },
};

function renderWeather() {
  return render(
    <MemoryRouter>
      <I18nContext.Provider value={mockI18n as any}>
        <Weather />
      </I18nContext.Provider>
    </MemoryRouter>
  );
}

describe("Weather page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.weather.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data:    mockWeatherData,
      mock:    true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page title", async () => {
    renderWeather();
    await waitFor(() => {
      expect(screen.getByText("Pogoda na trasie")).toBeInTheDocument();
    });
  });

  it("renders the search input and button", () => {
    renderWeather();
    expect(screen.getById("weather-city-input")).toBeInTheDocument();
    expect(screen.getById("weather-search-btn")).toBeInTheDocument();
  });

  it("renders quick city chips", async () => {
    renderWeather();
    await waitFor(() => {
      expect(screen.getByText("Warsaw")).toBeInTheDocument();
      expect(screen.getByText("Berlin")).toBeInTheDocument();
      expect(screen.getByText("Tokyo")).toBeInTheDocument();
    });
  });

  it("displays weather data after load", async () => {
    renderWeather();
    await waitFor(() => {
      expect(screen.getByText(/Warsaw/)).toBeInTheDocument();
      expect(screen.getByText("14°C")).toBeInTheDocument();
    });
  });

  it("shows weather stats grid", async () => {
    renderWeather();
    await waitFor(() => {
      expect(screen.getByText("Odczuwalna")).toBeInTheDocument();
      expect(screen.getByText("Wilgotność")).toBeInTheDocument();
      expect(screen.getByText("Ciśnienie")).toBeInTheDocument();
      expect(screen.getByText("Wiatr")).toBeInTheDocument();
    });
  });

  it("shows mock banner when data is mock", async () => {
    renderWeather();
    await waitFor(() => {
      expect(screen.getByText("Demo mode")).toBeInTheDocument();
    });
  });

  it("shows game note box", async () => {
    renderWeather();
    await waitFor(() => {
      expect(screen.getByText("Jak pogoda wpływa na grę?")).toBeInTheDocument();
    });
  });

  it("fetches new city when search form is submitted", async () => {
    renderWeather();
    await waitFor(() => screen.getByText("14°C"));

    const input = screen.getById("weather-city-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Berlin" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(api.weather.get).toHaveBeenCalledWith("Berlin", "metric", "pl");
    });
  });

  it("fetches new city when city chip is clicked", async () => {
    renderWeather();
    await waitFor(() => screen.getByText("14°C"));

    fireEvent.click(screen.getById("city-chip-berlin"));

    await waitFor(() => {
      expect(api.weather.get).toHaveBeenCalledWith("Berlin", "metric", "pl");
    });
  });

  it("shows error state when API fails", async () => {
    (api.weather.get as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("City not found")
    );
    renderWeather();
    await waitFor(() => {
      expect(screen.getByText(/City not found/i)).toBeInTheDocument();
    });
  });
});

/* ── id helper ── */
function getByIdHelper(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id="${id}" not found`);
  return el;
}
(screen as any).getById = getByIdHelper;
