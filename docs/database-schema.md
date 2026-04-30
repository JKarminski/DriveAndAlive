# 🗄️ Architektura Baz Danych

Projekt **DriveAndAlive** wykorzystuje rozproszoną architekturę danych, dopasowaną do wymogów wydajnościowych zarówno na urządzeniach mobilnych, jak i w chmurze. 

Używamy hybrydowego podejścia poliglotycznego, w którym różne typy baz danych obsługują specyficzne zadania.

## 1. Wykorzystane technologie bazodanowe
1. **SQLite (Relacyjna, Lokalna):** Wykorzystywana w aplikacji mobilnej do szybkiego zapisu postępów gracza (stan gry, odblokowane auta) bez konieczności połączenia z internetem.
2. **Firebase (NoSQL / Chmura):** Wykorzystywany do przechowywania najlepszych wyników graczy i wyświetlania rankingów w grze oraz na stronie webowej.
3. **JSON (Pliki lokalne):** Służą jako bazy słowników (tłumaczenia i18n na stronie webowej) oraz jako konfiguracje proceduralnie generowanych map w grze mobilnej.

---

## 2. Diagram powiązań danych (ERD)

Poniższy graficzny schemat przedstawia architekturę przepływu danych pomiędzy systemami aplikacji:

```mermaid
erDiagram
    PLAYER_PROFILE ||--o{ VEHICLE_STATS : upgrades
    PLAYER_PROFILE {
        int id PK
        int coins
        int selectedVehicleId FK
        int selectedMapId FK
        int totalDistance
        string userName "nazwa gracza (SharedPreferences)"
        string userId "UUID (SharedPreferences)"
    }
    VEHICLE {
        int id PK
        string name
        string drawableName
        string wheelDrawableName
        boolean isUnlocked
        int unlockCost
        float wheelLeftBias
        float wheelRightBias
        float wheelVerticalBias
        float bodyVerticalOffsetM
    }
    VEHICLE_STATS {
        int vehicleId PK,FK
        int engineLevel
        int gripLevel
        int fuelLevel
        int durabilityLevel
        int maxLevel
    }
    GAME_MAP {
        int id PK
        string name
        string drawableName
        boolean isUnlocked
        int unlockCost
        boolean hasWeatherApi
        double latitude
        double longitude
    }
    MAP_RECORD {
        int id PK
        int mapId FK
        int vehicleId FK
        int distanceMeters
        int coinsEarned
        float maxSpeedKmh
        int gearChanges
        string endReason
    }
    SCORE_FIREBASE {
        string playerUUID "tylko w chmurze"
        string playerName
        string trackSlug
        string carModel
        int points
        float timeInSeconds
        string countryCode
    }
```

## 3. Komunikacja z chmurą

Aplikacja mobilna komunikuje się bezpośrednio z Firebase Realtime Database (bez pośredniego backendu).
Po zakończeniu wyścigu wynik jest zapisywany do Firebase za pomocą klasy FirebaseRankingRepository (transakcja zapewniająca aktualizację tylko lepszego wyniku).
Odczyt rankingu do wyświetlenia w aplikacji oraz na stronie webowej odbywa się przez to samo API Firebase (nasłuch na węźle scores).
