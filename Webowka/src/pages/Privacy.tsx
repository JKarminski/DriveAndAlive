import React from "react";
import globalStyles from "./PageShared.module.scss";
import legalStyles from "./Legal.module.scss";

export default function Privacy(): JSX.Element {
  return (
    <div className={globalStyles.page}>
      <div className={legalStyles.legalContainer}>
        <div className={`${globalStyles.pageHeader} fade-up`}>
          <span className="section-label">🔒 Bezpieczeństwo danych</span>
          <h1 className="section-title">Polityka Prywatności</h1>
          <p className="section-sub">Dowiedz się, jak chronimy Twoje dane i szanujemy prywatność w świecie wirtualnych wyścigów.</p>
        </div>

        <div className={`${legalStyles.legalCard} glass-card fade-up`}>
          <span className={legalStyles.dateMeta}>Ostatnia aktualizacja: 28 kwietnia 2026 r.</span>

          <h2>1. Administrator Danych</h2>
          <p>
            Administratorem Twoich danych osobowych jest <strong>DriveAndAlive Studio</strong>. Zbieramy Twoje dane w celu zapewnienia prawidłowego działania funkcji gry, zliczania rankingów w czasie rzeczywistym oraz przechowywania informacji o koncie na bezpiecznych serwerach.
          </p>

          <h2>2. Jakie dane gromadzimy?</h2>
          <p>W trakcie Twojej rozgrywki gromadzimy minimalną niezbędną dawkę informacji:</p>
          <ul>
            <li><strong>Dane konta:</strong> Twój pseudonim (nick) w grze, adres e-mail użyty do rejestracji oraz hasło w zaszyfrowanej formie (hash).</li>
            <li><strong>Statystyki rozgrywki:</strong> Informacje o Twoich przejazdach, pokonanych czasach, zebranych osiągnięciach i wybranych trasach.</li>
            <li><strong>Dane techniczne:</strong> Informacje dotyczące urządzenia końcowego, z którego korzystasz z samej aplikacji (np. model urządzenia, wersja systemu), wyłącznie w celu optymalizacji i naprawiania błędów.</li>
          </ul>

          <h2>3. W jaki sposób wykorzystujemy dane?</h2>
          <p>Zebrane informacje wykorzystujemy tylko do:</p>
          <ul>
            <li>Synchronizacji z globalną tabelą wyników i przeliczania punktów na Twoim koncie.</li>
            <li>Przechowywania odznak, ustawień gier i ewentualnych kopii zapasowych zapisów chmurowych (Cloud Save).</li>
            <li>Analizy statystycznej pod kątem tego, które trasy mogą wymagać modyfikacji poziomu trudności dla społeczności graczy.</li>
          </ul>

          <h2>4. Kto ma dostęp do Twoich danych?</h2>
          <p>
            Zapewniamy najwyższe standardy obsługi – Twoje dane nigdy nie będą odsprzedawane firmom zrzeszonym. Korzystamy wyłącznie z technologii zweryfikowanych dostawców chmurowych operujących na terytorium EOG.
          </p>

          <h2>5. Prawa użytkowników</h2>
          <p>
            Po zalogowaniu się, jako autoryzowany użytkownik masz prawo w każdej chwili zażądać dostarczenia paczki z całą zgromadzoną telemetrią na Twój temat, a także prosić o całkowite, nieodwracalne skasowanie Twojego profilu. Kontakt w sprawie prywatności: e-mail <strong>privacy@driveandalive.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
