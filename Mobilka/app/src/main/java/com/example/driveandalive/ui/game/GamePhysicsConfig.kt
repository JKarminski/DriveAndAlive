package com.example.driveandalive.ui.game

object GamePhysicsConfig {

    // ==========================================
    // 🌍 GRAWITACJA I ŚWIAT
    // ==========================================
    
    // Siła grawitacji. Im niższa wartość na minusie (np. -30f, -40f), tym silniej auto będzie przyciągane do ziemi.
    // Domyślnie -35f. Jeśli auto wydaje się zbyt lekkie, ustaw -25f lub -30f.
    var GRAVITY_Y = -25f 

    // ==========================================
    // 🏎 KAROSERIA (CHASSIS) - ZACHOWANIE BUDY
    // ==========================================

    // Ciężar budy samochodu. Wyższa wartość = masa mocniej dociskająca do ziemi, ale ciężej przyspieszyć / podjechać pod górę.
    var CHASSIS_DENSITY = 5.5f

    // Opór obrotowy (damping) maski. 
    // Wysoka wartość (np. 3.0f) = auto bardzo "sztywne", ciężko obraca się w locie i ma nienaturalne powroty.
    // Niska wartość (np. 0.5f - 1.0f) = auto bardzo swobodne w locie ("lata jak na księżycu", może zbytnio falować).
    // Domyślnie teraz 1.8f - polecam pobawić się z przedziałem 1.0f - 2.5f.
    var CHASSIS_ANGULAR_DAMPING = 1f 

    // Tarcie karoserii o ziemię, podczas wywrotki lub suwania przodem po trawie.
    var CHASSIS_FRICTION = 0.3f
    
    // Sprężystość/odbijanie karoserii od ziemi. 0.0 to brak odbicia, 1.0 to jak kauczuk.
    var CHASSIS_RESTITUTION = 0.4f

    // ==========================================
    // ⚙️ KOŁA (WHEELS)
    // ==========================================

    // Ciężar kół. Czym cięższe, z tym większą siłą kręcenia uderzają w ziemię, ale mocniej dociskają sam dół auta.
    var WHEEL_DENSITY = 2.2f

    // Bazowy modyfikator przyczepności. Im większy, tym koła trudniej wpadają na mapie w poślizg i lepiej drą pod strome góry.
    var WHEEL_FRICTION_MULTIPLIER = 1.5f 

    // Rozmiar opon kół. Nie polecam zmieniać drastycznie - 0.42f to optymalny dopasowany radius fizyczny.
    var WHEEL_RADIUS = 0.42f

    // ==========================================
    // 🔩 ZAWIESZENIE (SUSPENSION)
    // ==========================================

    // Twardość sprężyn (w Herzach). Im wyższa wartość, tym silniej wózek wraca na koła; zbytnia wysoka wyrzuca go jak katapulta.
    var SUSPENSION_FREQUENCY_HZ = 5.0f

    // Tłumienie amortyzatorów (Damping). Utrzymuje podskoki w ryzach. 1.0f to sztywne tłumienie bez efektu bujania.
    var SUSPENSION_DAMPING_RATIO = 0.8f

    // ==========================================
    // ✈️ ZACHOWANIE W LOCIE
    // ==========================================

    // Siła kontrolowanych przez gracza obrotów (Frontflip / Backflip), gdy wciskasz przyciski bez dotyku o ziemię.
    // Im wyższa wartość (np. 30f), tym szybciej i gwałtowniej gra kręci budą auta w locie.
    var AIR_ROTATION_TORQUE = 150f

    // ==========================================
    // 🚙 SIŁY NAPĘDOWE / JAZDA I HAMULCE
    // ==========================================

    // Siła hamowania (Braking). To wskaźnik mocy wstawianej we wsteczny ruch przeciwko mocy silnika.
    // Zbyt niska (0.2f) = bardzo długie hamowanie. Zbyt wysoka (1.2f) = dęba i fiknięcie auta przez maskę do przodu.
    var BRAKING_TORQUE_FACTOR = 0.5f

    // Siła naturalnego zwalniania w skutek oporu, gdy w ogóle puścisz i gaz i hamulec ("engine braking").
    // Im wyższa, tym auto gwałtowniej zwalnia przy braku dotykania czegokolwiek. Zbyt niska = zjeżdża nieskończenie po łagodnym spadku.
    var ENGINE_BRAKING_FACTOR = 0.02f

    // Zabezpieczenie przez ciągłym "Wheelie" (stawaniem dęba).
    // Gdy auto podczas przyspieszania ma przedni nos podniesiony o > 20 stopni w górę, obcinamy moc silnika w kołach o ten czynnik.
    // 0.05f = dławienie do 5% mocy. 1.0 = całkowity brak zabezpieczenia przed unoszeniem przodu gazem.
    var WHEELIE_PREVENTION_FACTOR = 0.05f

    // Moc silnika w trybie "Nitro" (przyśpieszenie mnożone).
    var NITRO_TORQUE_MULTIPLIER = 2.0f

    // ==========================================
    // 📊 EKRAN ROZBUDOWY SAMOCHODU / ULEPSZENIA
    // ==========================================
    // Poniżej ustawiasz, co dają poszczególne poziomy ulepszeń w garażu.
    // Zmienna "level" to level kupionego ulepszenia (odpowiedznie 0, 1, 2, ...).

    // Funkcja na to JAK MOCNY staje się moment obrotowy (zryw) silnika per level silnika.
    fun engineToTorque(level: Int): Float {
        return 40f + (level * 20f)
    }

    // Funkcja jak WYSOKI staje się limit maks. prędkości per level silnika. (Box2D używa m/s x 3.6 to ok. prędkość w km/h).
    fun engineToMaxSpeed(level: Int): Float {
        return 20f + (level * 10f)
    }

    // Funkcja obliczająca PULL OPON na mapie ze sklepu. (Np. Base = 0.9f, z każdym poziomem w garażu wzrasta o 0.05).
    fun gripToFriction(level: Int): Float {
        return 0.9f + (level * 0.05f)
    }

    // Pojemność baku paliwa generowana z danym levelem w garażu.
    fun fuelLevelToCapacity(level: Int): Float {
        return 100f + (level * 50f)
    }

    // ==========================================
    // 🔢 SKRZYNIA BIEGÓW (Mnożniki potęgi dla poszczególnych biegów)
    // ==========================================

    // Kolejność indeksowych biegów do FloatArray to:
    // [0] = Luz, [1] = Bieg Pierwszy, [2] = B.Drugi, [3] = B.Trzeci, [4] = B.Czwarty, [5] = Piątka 

    // Ograniczenia prędkości maskymalnej silnika na dany bieg. 
    // Na przykład 1-ka (0.35f) to vmax to 35% całości zdolności Twojego auta.
    val GEAR_SPEED_MULTIPLIERS = floatArrayOf(0f, 0.25f, 0.45f, 0.65f, 0.85f, 1.0f)

    // Odblokowanie mocy skrętu (siły wyciągającej) per bieg. 
    // Tutaj na 1 bieg auto ciągnie mocą w koła 2.5x bazowej (potwór zrywowy), a 5 bieg ciągnie tylko o ułamek mocy 0.1x (trudno utrzymać obroty na pochyłach bez pośmigu z innych biegów)
    val GEAR_TORQUE_MULTIPLIERS = floatArrayOf(0f, 2.5f, 1.2f, 0.6f, 0.3f, 0.10f)

    // Mnożniki konsumpcji paliwa: Im niższy bieg tym auto przepala kosmiczną ilość ropy na dystans.
    val GEAR_FUEL_MULTIPLIERS = floatArrayOf(0f, 2.0f, 1.5f, 1.2f, 1.0f, 0.8f)
}
