/**
 * In-memory news / posts data store.
 * Will be replaced by DB layer.
 */

const NEWS = [
  {
    id: "n1",
    tag:     { pl: "Aktualizacja",  en: "Update"       },
    date:    "2026-04-28",
    title:   { pl: "Patch 1.4 – nowe trasy i dynamiczna pogoda",              en: "Patch 1.4 – New Tracks & Dynamic Weather"            },
    excerpt: { pl: "Dodaliśmy 3 nowe trasy górskie zintegrowane z systemem pogodowym. Deszcz, mgła i burze wpływają na przyczepność.", en: "We added 3 new mountain tracks integrated with the weather system. Rain, fog and storms affect traction." },
    emoji:   "🌩️",
    accent:  "accent2",
  },
  {
    id: "n2",
    tag:     { pl: "Społeczność",   en: "Community"    },
    date:    "2026-04-22",
    title:   { pl: "Turniej Wiosenny – wyniki i rekordy",                     en: "Spring Tournament – Results & Records"               },
    excerpt: { pl: "Ponad 2 400 graczy wzięło udział w turnieju. Sprawdź tabelę wyników.",                                              en: "Over 2,400 players took part in the tournament. Check the leaderboard."                               },
    emoji:   "🏆",
    accent:  "accent",
  },
  {
    id: "n3",
    tag:     { pl: "Map Creator",  en: "Map Creator"   },
    date:    "2026-04-15",
    title:   { pl: "Nowości w edytorze map – tryb terenu proceduralnego",     en: "Map Editor Update – Procedural Terrain Mode"         },
    excerpt: { pl: "Map Creator dostał potężną aktualizację: seed, import GPX i eksport .daa.",                                         en: "Map Creator got a major update: seed generation, GPX import and .daa export."                          },
    emoji:   "🗺️",
    accent:  "accent3",
  },
  {
    id: "n4",
    tag:     { pl: "Osiągnięcia",  en: "Achievements"  },
    date:    "2026-04-10",
    title:   { pl: "Nowe odznaki: Mistrz Asfaltu i Król Szutru",             en: "New Badges: Asphalt Master & Gravel King"            },
    excerpt: { pl: "Zdobądź nowe osiągnięcia pokonując 500 km na asfalcie lub 200 km na szutrze.",                                      en: "Earn new achievements by covering 500 km on asphalt or 200 km on gravel."                             },
    emoji:   "🎖️",
    accent:  "accent",
  },
];

module.exports = { NEWS };
