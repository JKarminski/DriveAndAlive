# 🗂️ Podział Pracy Zespołu

Projekt **DriveAndAlive** został zrealizowany przez 3-osobowy zespół. Poniższa tabela szczegółowo określa podział odpowiedzialności za poszczególne elementy aplikacji mobilnej, serwisu internetowego oraz testów.

| Obszar / Moduł | Zadanie | Wykonawca |
| :--- | :--- | :--- |
| **Aplikacja Mobilna** | Zrobienie początkowego wyglądu aplikacji (UI). | **Johny** |
| | Zrobienie silnika gry mobilnej (Mechanika). | **Johny** |
| | Logika map bazująca na odczytach JSON. | **Johny** |
| | Zrobienie lokalnej bazy danych SQLite dla progresu gracza. | **Johny** |
| | Poprawienie i optymalizacja wyglądu XML'i (Layouts). | **Goliat** |
| | Autoryzacja i logowanie w grze (Firebase). | **Goliat** |
| | Dodanie baz danych odpowiedzialnych za tablice rekordów (Scoreboards). | **Goliat** |
| **Aplikacja Webowa** | Utworzenie kompletnej aplikacji frontend (React) i backend (Node.js). | **Johny** |
| | Przygotowanie systemu tłumaczeń iT18 (języki PL/EN). | **Johny** |
| | Implementacja wszystkich animacji na stronie (Intersection Observer, Scroll). | **Johny** |
| | Ustawienie motywów na stronie (Dark / Formal / Light Mode). | **Johny** |
| | Podłączenie baz danych pod tabele wyników (Leaderboard) i integracja z API. | **Goliat** |
| | System logowania po stronie webowej (autoryzacja). | **Goliat** |
| | Finalna korekta tekstów i docelowe tłumaczenia na stronie. | **Merteno** |
| **Testy (QA)** | Zaimplementowanie testów jednostkowych i integracyjnych (Frontend - Vitest). | **Johny** |
| | Zaimplementowanie testów API i logiki serwera (Backend - Jest, Supertest). | **Johny** |

---

### Podsumowanie ról:
* **Johny:** Główny architekt i Full-Stack Developer. Odpowiedzialny za silnik gry, architekturę webową, animacje, testy i lokalną bazę danych SQLite.
* **Goliat:** Specjalista ds. Baz Danych i chmury. Odpowiedzialny za integrację Firebase, relacyjne bazy danych dla systemów rankingowych i poprawki w XML.
* **Merteno:** Specjalista ds. lokalizacji (Localization). Odpowiedzialny za dopracowanie warstwy tekstowej serwisu internetowego.
