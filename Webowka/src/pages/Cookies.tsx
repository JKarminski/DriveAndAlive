import React from "react";
import globalStyles from "./PageShared.module.scss";
import legalStyles from "./Legal.module.scss";

export default function Cookies(): JSX.Element {
  return (
    <div className={globalStyles.page}>
      <div className={legalStyles.legalContainer}>
        <div className={`${globalStyles.pageHeader} fade-up`}>
          <span className="section-label">🍪 Ustawienia śledzenia</span>
          <h1 className="section-title">Polityka Cookies</h1>
          <p className="section-sub">Pełna przejrzystość dotycząca zapisywania niewielkich plików danych na Twoim urządzeniu.</p>
        </div>

        <div className={`${legalStyles.legalCard} glass-card fade-up`}>
          <span className={legalStyles.dateMeta}>Ostatnia aktualizacja: 28 kwietnia 2026 r.</span>

          <h2>1. Czym są pliki cookies?</h2>
          <p>
            Pliki cookies (tzw. „ciasteczka”) stanowią dane informatyczne, w szczególności pliki tekstowe, które przechowywane są w urządzeniu końcowym Użytkownika Serwisu i przeznaczone są do korzystania z jego stron internetowych. 
            Cookies zazwyczaj zawierają nazwę witryny, czas przechowywania ich na urządzeniu oraz unikalny identyfikator uwierzytelniania w celu połączenia z Twoim portfelem w grze mobilnej.
          </p>

          <h2>2. Rodzaje wykorzystywanych plików cookies</h2>
          <p>Serwis używa dwóch zasadniczych mechanizmów do pracy nad autoryzacją Użytkownika:</p>
          <ul>
            <li>
              <strong>Niezbędne (techniczne):</strong> Umożliwiają poprawne działanie mechanizmu logowania i ustawień profilu (tzw. sesję "daa_user"). Bez ich użycia Twoja sesja wygasałaby przy każdym odświeżeniu witryny.
            </li>
            <li>
              <strong>Analityczne:</strong> Śledzimy za ich pomocą – w ramach narzędzi zanonimizowanych – ruch na konkretnych podstronach, na przykład by wiedzieć, czy nowa aktualizacja mapy w zakładce Map Creator cieszy się Twoim zainteresowaniem.
            </li>
          </ul>

          <h2>3. Przechowywanie danych testowych</h2>
          <p>
            Gra będąc jeszcze w fazie rozwoju posługuje się prostymi kluczami wykorzystującymi do tego przeglądarkowy interfejs <strong>Local Storage</strong>. To mechanizm pozwalający Twojej przeglądarce odczytywać z pamięci zadeklarowane opcje, jak wybrany avatar. Usunięcie historii pociąga za sobą również utratę kluczy lokalnych – to element w pełni uzależniony od Twoich preferencji przeglądania sieci u źródła.
          </p>

          <h2>4. Zmiana ustawień</h2>
          <p>
            Aplikacje do przeglądania stron domyślnie pozwalają na przechowywanie cookies. Możesz samodzielnie zdecydować o odmowie i ręcznie zablokować pliki dla portalu we właściwościach swojej przeglądarki, jednak miej na uwadze, że doprowadzi to do natychmiastowego zamknięcia aktywnej sesji użytkownika.
          </p>
        </div>
      </div>
    </div>
  );
}
