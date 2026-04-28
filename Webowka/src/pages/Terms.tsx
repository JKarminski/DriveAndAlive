import React from "react";
import globalStyles from "./PageShared.module.scss";
import legalStyles from "./Legal.module.scss";

export default function Terms(): JSX.Element {
  return (
    <div className={globalStyles.page}>
      <div className={legalStyles.legalContainer}>
        <div className={`${globalStyles.pageHeader} fade-up`}>
          <span className="section-label">📜 Ramy Prawne Projektu</span>
          <h1 className="section-title">Regulamin</h1>
          <p className="section-sub">Ogólne warunki świadczenia usług platformy webowej oraz gry DriveAndAlive.</p>
        </div>

        <div className={`${legalStyles.legalCard} glass-card fade-up`}>
          <span className={legalStyles.dateMeta}>Obowiązuje od: 20 stycznia 2026 r.</span>

          <h2>§1 Postanowienia wstępne</h2>
          <p>
            Niniejszy Regulamin wchodzi w życie od razu z wejściem w interakcję z usługami zrzeszonymi w projekcie i określa zasady korzystania z usług dostarczanych poprzez portal wymiany baz danych i tabel użytkowników, potocznie nazywanych: <strong>DriveAndAlive</strong>.
          </p>

          <h2>§2 Rejestracja i konto użytkownika</h2>
          <ul>
            <li>Rejestracja w Serwisie jest dobrowolna oraz całkowicie darmowa.</li>
            <li>Gracz jest zobowiązany do posługiwania się nazwą użytkownika (pseudonimem), który nie jest wulgarna, obraźliwa ani nie narusza dóbr osobistych innych, pod karą wstrzymania postępów na profilu i trwałym usunięciu konta przez Administrację.</li>
            <li>Jeden Użytkownik powinien zarejestrować wyłącznie jedno główne Konto, powiązane z mobilną wersją zainstalowaną na lokalnym sprzęcie operacyjnym.</li>
          </ul>

          <h2>§3 Zasady zdrowej rywalizacji we wdrożeniach (Fair Play)</h2>
          <p>
            DriveAndAlive w pełni celebruje mechanizmy esportowe oraz szlifowane tygodniami zdolności swoich graczy. Surowo wzbrania się więc:
          </p>
          <ul>
            <li>Korzystania z nieoficjalnych skryptów, programów w tle generujących dodatkowe, fikcyjne punkty na trasach rajdowych.</li>
            <li>Przetwarzania kodów binarnych gry tak, aby zmniejszać grawitację lub sztucznie zwiększać moc pojazdów i łamać ograniczniki tabeli rekordów.</li>
          </ul>
          <p>Kary w wypadku takich działań są permanentne i narzucają wykluczenie serwerowe dożywotnio (w modelu systemowym Hard-Ban).</p>

          <h2>§4 Tworzenie map przez moduł Map Creator</h2>
          <p>
            Map Creator pozwala graczom kreować swoje drogi. Tworząc trasy rajdowe zgadzasz się przekazać nam bezpłatną, niewyłączną licencję do ich nieprzerywalnego serwowania i hostingu na wewnętrznych serwerach globalnych platformy dla ogółu zrzeszonej społeczności!
          </p>

          <h2>§5 Przerwy w dostępie technologicznym</h2>
          <p>
            Twórcy zastrzegają sobie prawo do niezapowiadanych konserwacji platformy w celu wdrażania kolejnych, kluczowych poprawek sieciowych z bazami serwerów zrzeszonymi za tabele systematyzujące ranking gier. Robimy wszystko, aby te przestoje odbywały się tylko w porach nocnych.
          </p>
        </div>
      </div>
    </div>
  );
}
