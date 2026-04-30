/**
 * Unit tests – weatherService.js
 */

const {
  normalizeWeatherResponse,
  getMockWeather,
} = require("../../src/services/weatherService");

describe("weatherService", () => {
  /* ── getMockWeather ── */
  describe("getMockWeather()", () => {
    it("returns an object with required fields", () => {
      const w = getMockWeather("Warsaw");
      expect(w).toHaveProperty("city", "Warsaw");
      expect(w).toHaveProperty("country");
      expect(w).toHaveProperty("description");
      expect(w).toHaveProperty("temp");
      expect(w).toHaveProperty("feelsLike");
      expect(w).toHaveProperty("humidity");
      expect(w).toHaveProperty("pressure");
      expect(w).toHaveProperty("windSpeed");
      expect(w).toHaveProperty("timestamp");
    });

    it("uses the provided city name", () => {
      expect(getMockWeather("Berlin").city).toBe("Berlin");
      expect(getMockWeather("Tokyo").city).toBe("Tokyo");
    });

    it("sets _mock flag to true", () => {
      expect(getMockWeather("London")._mock).toBe(true);
    });

    it("temperature is a number", () => {
      expect(typeof getMockWeather("Paris").temp).toBe("number");
    });

    it("humidity is between 0 and 100", () => {
      const h = getMockWeather("Oslo").humidity;
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(100);
    });
  });

  /* ── normalizeWeatherResponse ── */
  describe("normalizeWeatherResponse()", () => {
    const mockOwmResponse = {
      name: "Warsaw",
      weather: [{ description: "clear sky", icon: "01d" }],
      main: { temp: 21.4, feels_like: 20.1, humidity: 55, pressure: 1015 },
      wind: { speed: 3.5 },
      visibility: 10000,
      sys: { country: "PL", sunrise: 1700000000, sunset: 1700050000 },
    };

    it("maps name to city", () => {
      const n = normalizeWeatherResponse(mockOwmResponse);
      expect(n.city).toBe("Warsaw");
    });

    it("maps sys.country to country", () => {
      const n = normalizeWeatherResponse(mockOwmResponse);
      expect(n.country).toBe("PL");
    });

    it("rounds temperature", () => {
      const n = normalizeWeatherResponse(mockOwmResponse);
      expect(n.temp).toBe(21);
    });

    it("rounds feelsLike", () => {
      const n = normalizeWeatherResponse(mockOwmResponse);
      expect(n.feelsLike).toBe(20);
    });

    it("maps wind.speed to windSpeed", () => {
      const n = normalizeWeatherResponse(mockOwmResponse);
      expect(n.windSpeed).toBe(3.5);
    });

    it("maps weather description", () => {
      const n = normalizeWeatherResponse(mockOwmResponse);
      expect(n.description).toBe("clear sky");
    });

    it("adds a timestamp", () => {
      const n = normalizeWeatherResponse(mockOwmResponse);
      expect(typeof n.timestamp).toBe("number");
    });

    it("handles missing optional fields gracefully", () => {
      const minimal = {
        name: "X",
        weather: [{}],
        main: {},
        wind: {},
        sys: {},
      };
      const n = normalizeWeatherResponse(minimal);
      expect(n.city).toBe("X");
      expect(n.temp).toBe(0);
    });
  });
});
