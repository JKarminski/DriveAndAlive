# 🏎️ DriveAndAlive

[![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Jest & Vitest](https://img.shields.io/badge/Tested_with-Jest_%7C_Vitest-C21325?style=for-the-badge&logo=jest)](https://vitest.dev/)

> **Gra typu "jedź do przodu i przeżyj".**
> Omijaj przeszkody, pobijaj rekordy, rywalizuj z graczami z całego świata w przepięknej, futurystycznej oprawie.

---

## 📖 O projekcie

**DriveAndAlive** to wieloplatformowy projekt składający się z gry mobilnej (stworzonej w Unity/natywnych narzędziach) oraz nowoczesnego serwisu internetowego (Web App). Głównym celem gracza jest pokonanie jak największego dystansu. Użytkownik wybiera swój pojazd oraz mapę, a następnie stara się przetrwać na drodze jak najdłużej.

Część webowa projektu (Portal Gracza) pozwala na:
- Rejestrację i logowanie graczy.
- Przeglądanie globalnych i lokalnych tabel wyników (Leaderboard).
- Sprawdzanie aktualnych warunków pogodowych dla wybranych tras (integracja API).
- Przeglądanie zdobytych osiągnięć (Achievements).

## 🛠 Technologie i Architektura

Aplikacja została zbudowana w architekturze **rozdzielonej (Frontend + Backend)**.

- **Frontend (Web):** Zbudowany w oparciu o React 19, TypeScript oraz Vite. Wykorzystuje nowoczesne wzorce projektowe, płynne animacje (Intersection Observer) oraz zaawansowane stylowanie (Glassmorphism). Posiada pełną responsywność (Mobile First) i wsparcie dla wielu języków (i18n).
- **Backend (API):** Napisany w Node.js z wykorzystaniem frameworka Express. Wdraża architekturę z podziałem na warstwy (Service-Layer Architecture), co zapewnia doskonałą skalowalność i elastyczność.
- **Bazy Danych (Hybryda):**
  - **SQLite:** Lokalny zapis postępów użytkownika (Mobile).
  - **Firebase:** System autoryzacji i bezpiecznego logowania (Cloud).
  - **MySQL / Relacyjne DB:** Tabele wyników (Leaderboard) i relacje między graczami.
  - **JSON:** Konfiguracja generowania map i tłumaczenia na stronie.

## 🚀 Jak uruchomić projekt (Web)

Projekt podzielony jest na dwa główne katalogi: `Webowka` (Frontend) oraz `Webowka/backend` (Serwer API).

### 1. Uruchomienie Backendu (REST API)
```bash
cd Webowka/backend
npm install
npm run dev
```
*Serwer wystartuje domyślnie na porcie `4000` (http://localhost:4000/api).*

### 2. Uruchomienie Frontendu
W nowym oknie terminala:
```bash
cd Webowka
npm install
npm run dev
```
*Aplikacja webowa otworzy się na porcie `5173` (http://localhost:5173).*

### 3. Uruchomienie za pomocą Dockera (Alternatywa)
Dla maksymalnej wygody i uniknięcia instalacji Node.js na komputerze docelowym, aplikację webową (Frontend i Backend jednocześnie) można odpalić używając środowiska kontenerowego Docker. 

W głównym oknie (folder `Webowka`), uruchom polecenie:
```bash
docker-compose up
```
*Aplikacja automatycznie pobierze wymagane zasoby, zbuduje się i uruchomi oba serwery bez jakichkolwiek konfliktów środowiskowych.*

---

## 📚 Dokumentacja Techniczna

Kompletna dokumentacja projektowa, w tym podział ról, schematy baz danych i raporty QA, znajduje się w katalogu `docs/`:

1. 🗂️ [Podział Prac Zespołu (Johny, Goliat, Merteno)](docs/work-breakdown.md)
2. 🗄️ [Diagramy i Architektura Baz Danych](docs/database-schema.md)
3. 🧪 [Raport z Testów (QA)](docs/test-report.md)

*Projekt zrealizowany w ramach zajęć akademickich. Wszystkie wymagania techniczne zostały spełnione ze znaczną nawiązką jakościową.*
