/**
 * Weather service – proxies OpenWeatherMap to keep the API key server-side.
 */

const fetch = require("node-fetch");

const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Fetch current weather for a city.
 * @param {string} city
 * @param {string} [units="metric"]
 * @param {string} [lang="pl"]
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
async function getWeatherByCity(city, units = "metric", lang = "pl") {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === "your_openweather_api_key_here") {
    // Return realistic mock data when no API key is configured
    return { success: true, data: getMockWeather(city), mock: true };
  }

  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}&lang=${lang}`;
    const res  = await fetch(url, { timeout: 8000 });

    if (res.status === 404) {
      return { success: false, error: "City not found." };
    }
    if (!res.ok) {
      return { success: false, error: `Weather API error: ${res.status}` };
    }

    const json = await res.json();
    return { success: true, data: normalizeWeatherResponse(json), mock: false };
  } catch (err) {
    return { success: false, error: "Failed to reach weather service." };
  }
}

/**
 * Normalize the OpenWeather response to our internal shape.
 * This way the frontend only needs to know our schema, not OWM's.
 * @param {object} raw
 * @returns {object}
 */
function normalizeWeatherResponse(raw) {
  return {
    city:        raw.name,
    country:     raw.sys?.country ?? "??",
    description: raw.weather?.[0]?.description ?? "",
    icon:        raw.weather?.[0]?.icon ?? "01d",
    temp:        Math.round(raw.main?.temp ?? 0),
    feelsLike:   Math.round(raw.main?.feels_like ?? 0),
    humidity:    raw.main?.humidity ?? 0,
    pressure:    raw.main?.pressure ?? 0,
    windSpeed:   raw.wind?.speed ?? 0,
    visibility:  raw.visibility ?? null,
    sunrise:     raw.sys?.sunrise ?? null,
    sunset:      raw.sys?.sunset ?? null,
    timestamp:   Date.now(),
  };
}

/**
 * Generate mock weather data for demo/test purposes.
 * @param {string} city
 * @returns {object}
 */
function getMockWeather(city) {
  return {
    city:        city || "Warsaw",
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
}

/**
 * Fetch current weather for coordinates using Open-Meteo API.
 * @param {number} lat
 * @param {number} lon
 * @param {string} cityName
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
async function getWeatherByCoordinates(lat, lon, cityName = "Lokalizacja Mapy") {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,weather_code`;
    const res = await fetch(url, { timeout: 8000 });
    
    if (!res.ok) {
      return { success: false, error: `Open-Meteo API error: ${res.status}` };
    }

    const json = await res.json();
    return { success: true, data: normalizeOpenMeteoResponse(json, cityName), mock: false };
  } catch (err) {
    return { success: false, error: "Failed to reach Open-Meteo service." };
  }
}

function normalizeOpenMeteoResponse(raw, cityName) {
  const code = raw.current?.weather_code ?? 0;
  let description = "Czyste niebo";
  let icon = "01d";
  
  if (code >= 1 && code <= 3) {
    description = "Częściowe zachmurzenie";
    icon = "02d";
  } else if (code === 45 || code === 48) {
    description = "Mgła";
    icon = "50d";
  } else if (code >= 51 && code <= 67) {
    description = "Deszcz";
    icon = "09d";
  } else if (code >= 71 && code <= 82) {
    description = "Śnieg";
    icon = "13d";
  } else if (code >= 95) {
    description = "Burza";
    icon = "11d";
  }

  return {
    city:        cityName,
    country:     "Live Map",
    description: description,
    icon:        icon,
    temp:        Math.round(raw.current?.temperature_2m ?? 0),
    feelsLike:   Math.round(raw.current?.apparent_temperature ?? 0),
    humidity:    raw.current?.relative_humidity_2m ?? 0,
    pressure:    Math.round(raw.current?.surface_pressure ?? 0),
    windSpeed:   raw.current?.wind_speed_10m ?? 0,
    visibility:  10000,
    sunrise:     null,
    sunset:      null,
    timestamp:   Date.now(),
  };
}

module.exports = { getWeatherByCity, getWeatherByCoordinates, normalizeWeatherResponse, normalizeOpenMeteoResponse, getMockWeather };
