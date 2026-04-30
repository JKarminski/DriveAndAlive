/**
 * DriveAndAlive API client.
 *
 * All communication with the backend REST API goes through this module.
 * Base URL is picked from the Vite env variable VITE_API_URL,
 * falling back to http://localhost:4000/api in development.
 */

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:4000/api";

/* ─────────────────────────────────────────────────────────── */
/*  Shared fetch helper                                        */
/* ─────────────────────────────────────────────────────────── */

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res  = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `API error ${res.status}`);
  }

  return json as T;
}

/* ─────────────────────────────────────────────────────────── */
/*  Types                                                      */
/* ─────────────────────────────────────────────────────────── */

export interface LeaderboardEntry {
  id:      string;
  rank:    number;
  name:    string;
  car:     string;
  country: string;
  time:    string;
  timeMs:  number;
  pts:     number;
  track:   string;
}

export interface LeaderboardResponse {
  success:    boolean;
  data:       LeaderboardEntry[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  track:      string;
}

export interface Achievement {
  id:       string;
  icon:     string;
  slug:     string;
  category: string;
  pts:      number;
  name:     string;
  desc:     string;
}

export interface AchievementsResponse {
  success: boolean;
  data:    Achievement[];
  total:   number;
}

export interface AchievementStats {
  success:    boolean;
  total:      number;
  totalPts:   number;
  categories: string[];
}

export interface WeatherData {
  city:        string;
  country:     string;
  description: string;
  icon:        string;
  temp:        number;
  feelsLike:   number;
  humidity:    number;
  pressure:    number;
  windSpeed:   number;
  visibility:  number | null;
  sunrise:     number | null;
  sunset:      number | null;
  timestamp:   number;
  _mock?:      boolean;
}

export interface WeatherResponse {
  success: boolean;
  data:    WeatherData;
  mock:    boolean;
}

export interface NewsPost {
  id:      string;
  tag:     string;
  date:    string;
  title:   string;
  excerpt: string;
  emoji:   string;
  accent:  string;
}

export interface NewsResponse {
  success: boolean;
  data:    NewsPost[];
  total:   number;
}

export interface GameStats {
  players:   number;
  tracks:    number;
  rating:    number;
  countries: number;
  version:   string;
}

export interface StatsResponse {
  success: boolean;
  data:    GameStats;
}

export interface AuthUser {
  id:        string;
  name:      string;
  avatar:    string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user:    AuthUser;
}

/* ─────────────────────────────────────────────────────────── */
/*  API methods                                               */
/* ─────────────────────────────────────────────────────────── */

export const api = {
  /* ── Leaderboard ── */
  leaderboard: {
    get: (params: { track?: string; page?: number; limit?: number } = {}) => {
      const q = new URLSearchParams();
      if (params.track)            q.set("track", params.track);
      if (params.page  !== undefined) q.set("page",  String(params.page));
      if (params.limit !== undefined) q.set("limit", String(params.limit));
      const qs = q.toString() ? `?${q}` : "";
      return apiFetch<LeaderboardResponse>(`/leaderboard${qs}`);
    },
    tracks: () => apiFetch<{ success: boolean; tracks: string[] }>("/leaderboard/tracks"),
    top:    (n = 3) => apiFetch<{ success: boolean; data: LeaderboardEntry[] }>(`/leaderboard/top?n=${n}`),
  },

  /* ── Achievements ── */
  achievements: {
    get: (params: { category?: string; lang?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.category) q.set("category", params.category);
      if (params.lang)     q.set("lang",     params.lang);
      const qs = q.toString() ? `?${q}` : "";
      return apiFetch<AchievementsResponse>(`/achievements${qs}`);
    },
    byId:  (id: string, lang = "en") =>
      apiFetch<{ success: boolean; data: Achievement }>(`/achievements/${id}?lang=${lang}`),
    stats: () => apiFetch<AchievementStats>("/achievements/stats"),
  },

  /* ── Weather ── */
  weather: {
    get: (city: string, opts?: { lat?: number; lon?: number; units?: "metric" | "imperial"; lang?: string }) => {
      const units = opts?.units ?? "metric";
      const lang = opts?.lang ?? "pl";
      const q = new URLSearchParams({ units, lang });
      if (city) q.set("city", city);
      if (opts?.lat !== undefined) q.set("lat", String(opts.lat));
      if (opts?.lon !== undefined) q.set("lon", String(opts.lon));
      return apiFetch<WeatherResponse>(`/weather?${q}`);
    },
  },

  /* ── News ── */
  news: {
    get:   (lang = "en") => apiFetch<NewsResponse>(`/news?lang=${lang}`),
    byId:  (id: string, lang = "en") =>
      apiFetch<{ success: boolean; data: NewsPost }>(`/news/${id}?lang=${lang}`),
  },

  /* ── Stats ── */
  stats: {
    get: () => apiFetch<StatsResponse>("/stats"),
  },

  /* ── Auth ── */
  auth: {
    register: (name: string, password: string, avatarSeed = "alpha") =>
      apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, password, avatarSeed }),
      }),
    login: (name: string, password: string) =>
      apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ name, password }),
      }),
    profile: (id: string) =>
      apiFetch<{ success: boolean; user: AuthUser }>(`/auth/profile/${id}`),
  },
};
