import React, { useEffect, useState } from "react";
import styles from "./PageShared.module.scss";

interface WeatherData {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  wind: { speed: number };
  sys: { country: string };
}

const CITIES = ["Warsaw","Berlin","Paris","London","Oslo","Tokyo","New York","Sydney"];

const weatherEmoji = (desc: string): string => {
  const d = desc.toLowerCase();
  if (d.includes("rain"))   return "🌧️";
  if (d.includes("cloud"))  return "☁️";
  if (d.includes("snow"))   return "❄️";
  if (d.includes("storm"))  return "⛈️";
  if (d.includes("mist") || d.includes("fog")) return "🌫️";
  return "☀️";
};

export default function Weather(): JSX.Element {
  const [city, setCity]       = useState("Warsaw");
  const [input, setInput]     = useState("Warsaw");
  const [data, setData]       = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const API_KEY = "demo"; // użytkownik powinien wstawić własny klucz OpenWeatherMap

  const fetchWeather = async (c: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(c)}&appid=${API_KEY}&units=metric&lang=pl`
      );
      if (!res.ok) throw new Error("Miasto nie znalezione");
      const json: WeatherData = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Błąd pobierania danych");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(city); }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCity(input.trim());
  };

  /* Mock data for when API key is "demo" */
  const mock: WeatherData = {
    name: city,
    weather: [{ description: "częściowe zachmurzenie", icon: "02d" }],
    main: { temp: 14, feels_like: 12, humidity: 68, pressure: 1013 },
    wind: { speed: 5.2 },
    sys: { country: "PL" },
  };
  const displayed = API_KEY === "demo" ? mock : data;

  return (
    <div className={styles.page}>
      <div className="container" style={{ maxWidth: 780 }}>
        <div className={`${styles.pageHeader} fade-up`}>
          <span className="section-label">⛅ Warunki drogowe</span>
          <h1 className="section-title">Pogoda na trasie</h1>
          <p className="section-sub">
            Sprawdź aktualne warunki pogodowe przed wyruszeniem. Pogoda w grze jest synchronizowana z rzeczywistą.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className={styles.weatherSearch}>
          <input className={styles.weatherInput} value={input}
            onChange={(e) => setInput(e.target.value)} placeholder="Wpisz miasto..." />
          <button type="submit" className="btn btn-primary">🔍 Szukaj</button>
        </form>

        {/* Quick cities */}
        <div className={styles.chipBar} style={{ marginBottom: 32 }}>
          {CITIES.map((c) => (
            <button key={c} className={`${styles.chip} ${city === c ? styles.chipActive : ""}`}
              onClick={() => { setCity(c); setInput(c); }}>
              {c}
            </button>
          ))}
        </div>

        {/* Main weather card */}
        {loading && <div className={styles.weatherLoading}>⏳ Pobieranie danych...</div>}
        {error   && <div className={styles.weatherError}>⚠️ {error}</div>}

        {displayed && !loading && (
          <div className={`${styles.weatherCard} glass-card fade-up`}>
            <div className={styles.weatherTop}>
              <div>
                <h2 className={styles.weatherCity}>
                  {displayed.name}, {displayed.sys.country}
                </h2>
                <p className={styles.weatherDesc}>
                  {weatherEmoji(displayed.weather[0].description)} {displayed.weather[0].description}
                </p>
              </div>
              <div className={styles.weatherTemp}>
                {Math.round(displayed.main.temp)}°C
              </div>
            </div>
            <div className={styles.weatherStats}>
              {[
                { label:"Odczuwalna", val: `${Math.round(displayed.main.feels_like)}°C` },
                { label:"Wilgotność",  val: `${displayed.main.humidity}%`                },
                { label:"Ciśnienie",   val: `${displayed.main.pressure} hPa`            },
                { label:"Wiatr",       val: `${displayed.wind.speed} m/s`               },
              ].map((s) => (
                <div key={s.label} className={styles.weatherStat}>
                  <span className={styles.weatherStatVal}>{s.val}</span>
                  <span className={styles.weatherStatLabel}>{s.label}</span>
                </div>
              ))}
            </div>
            {API_KEY === "demo" && (
              <p className={styles.demoNote}>
                ℹ️ Demo mode – dodaj klucz API OpenWeatherMap w <code>Weather.tsx</code> aby pobrać rzeczywiste dane.
              </p>
            )}
          </div>
        )}

        {/* Game weather note */}
        <div className={`${styles.infoBox} glass-card`} style={{ marginTop: 24 }}>
          <span className={styles.infoIcon}>🎮</span>
          <div>
            <strong>Jak pogoda wpływa na grę?</strong>
            <p>Deszcz zmniejsza przyczepność o 30%. Mgła ogranicza widoczność. Wiatr boczny wpływa na trajektorię pojazdu.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
