# 🧪 Sprawozdanie z Testów

Aplikacja webowa **DriveAndAlive** została poddana rygorystycznym testom jakości, aby zapewnić bezawaryjne działanie na etapie produkcyjnym. Zastosowaliśmy strategię *Test-Driven* – pokrywając zarówno kluczowe usługi logiczne (Backend) jak i interakcje użytkownika (Frontend).

## 1. Architektura Testowa

Wdrożyliśmy dwa odrębne środowiska testowe dopasowane do wymagań warstwy:

### Backend (API & Serwisy)
- **Framework:** `Jest` – standard branżowy do testowania aplikacji w ekosystemie Node.js.
- **Integracje HTTP:** `Supertest` – użyty do symulacji prawdziwych żądań klienta (GET/POST) w celu weryfikacji nagłówków, kodów statusu i poprawności zwracanych danych (bez fizycznego uruchamiania serwera na danym porcie).
- **Zestaw Testów:** Pliki z sufiksem `.test.js` w katalogu `backend/__tests__/`.

### Frontend (Komponenty React & UI)
- **Framework:** `Vitest` – nowoczesne, błyskawiczne środowisko testowe zbudowane wokół Vite.
- **Środowisko:** `jsdom` – emuluje przeglądarkę internetową, pozwalając na renderowanie drzewa DOM.
- **Narzędzia UI:** `@testing-library/react` (RTL) – symuluje interakcje użytkownika (kliknięcia, wpisywanie tekstu) w sposób odzwierciedlający prawdziwe korzystanie ze strony.

---

## 2. Zrealizowane Scenariusze Testowe

Z powodzeniem napisano i zaliczono łącznie **kilkadziesiąt przypadków testowych (Test Cases)**.

### A. Testy Integracyjne (Backend - `api.integration.test.js`)
Testy te sprawdzają działanie routera Express i autoryzacji:
- ✅ **[Healthcheck]** Poprawna weryfikacja dostępności serwera (200 OK).
- ✅ **[Auth]** Rejestracja nowego użytkownika - weryfikacja walidacji haseł i kolizji nazw.
- ✅ **[Auth]** Logowanie z błędnym hasłem - poprawne rzucenie błędu (401 Unauthorized).
- ✅ **[Data Fetch]** Pobieranie tablicy Leaderboard - testowanie paginacji (`limit`, `page`).
- ✅ **[Error Handling]** Sprawdzanie czy endpoint dla nieznanych tras zwraca prawidłowy kod 404.

### B. Testy Jednostkowe Logiki (Backend)
Testy te weryfikują działanie warstwy z danymi w oderwaniu od serwera Express:
- ✅ **[`leaderboardService`]** Test sortowania rekordów punktowych w kolejności malejącej.
- ✅ **[`weatherService`]** Test mapowania odpowiedzi z zewnętrznego interfejsu (OpenWeatherMap) na nasz wewnętrzny standardowy obiekt JSON oraz test zachowania przy błędnym API KEY.

### C. Testy Komponentów UI (Frontend)
- ✅ **[`Login.test.tsx`]** Weryfikacja przełączania się kart (Logowanie / Rejestracja), blokowanie wysyłania pustego formularza oraz weryfikacja przekierowania po poprawnym zalogowaniu (zapis do `localStorage`).
- ✅ **[`Navbar.test.tsx`]** Weryfikacja renderowania menu na urządzeniach mobilnych (burger menu), test działania przełącznika zmiany języka (i18n).
- ✅ **[`Weather.test.tsx`]** Walidacja obsługi stanu *Loading* i *Error* podczas fetchowania danych oraz poprawne odświeżanie po wpisaniu nowej miejscowości w wyszukiwarkę.

---

## 3. Podsumowanie
Cały rygor testowy potwierdza, że rozdzielona architektura aplikacji działa wzorowo. Modułowy podział (osobno backend, osobno frontend) znacząco przyspieszył proces weryfikacji. 

Wszystkie asercje przechodzą z wynikiem pozytywnym. Aplikacja spełnia wymagania stabilności do przekazania na produkcję.
