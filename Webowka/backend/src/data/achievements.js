/**
 * In-memory achievements data store.
 * NOTE: Will be replaced with DB layer.
 */

const ACHIEVEMENTS = [
  {
    id: "a1",
    icon: "⚡",
    slug: "lightning",
    category: "speed",
    name: { pl: "Błyskawica",       en: "Lightning"        },
    desc: { pl: "Ukończ trasę w czasie poniżej 2 minut",        en: "Finish a track in under 2 minutes"          },
    pts: 500,
  },
  {
    id: "a2",
    icon: "🛣️",
    slug: "marathoner",
    category: "distance",
    name: { pl: "Maratończyk",      en: "Marathoner"       },
    desc: { pl: "Pokonaj łącznie 1000 km we wszystkich trasach", en: "Cover 1000 km total across all tracks"       },
    pts: 1000,
  },
  {
    id: "a3",
    icon: "🌧️",
    slug: "rain-pilot",
    category: "conditions",
    name: { pl: "Deszczowy pilot",  en: "Rain Pilot"       },
    desc: { pl: "Ukończ 10 tras podczas deszczowej pogody",      en: "Finish 10 tracks in rainy weather"          },
    pts: 750,
  },
  {
    id: "a4",
    icon: "🔥",
    slug: "win-streak",
    category: "speed",
    name: { pl: "Seria zwycięstw", en: "Win Streak"        },
    desc: { pl: "Wygraj 5 tras z rzędu",                        en: "Win 5 tracks in a row"                      },
    pts: 800,
  },
  {
    id: "a5",
    icon: "❄️",
    slug: "ice-king",
    category: "conditions",
    name: { pl: "Lodowy król",      en: "Ice King"         },
    desc: { pl: "Ukończ trasę przy temperaturze -10°C",         en: "Finish a track at -10°C"                    },
    pts: 600,
  },
  {
    id: "a6",
    icon: "🗺️",
    slug: "explorer",
    category: "social",
    name: { pl: "Odkrywca",         en: "Explorer"         },
    desc: { pl: "Stwórz i opublikuj własną mapę",               en: "Create and publish your own map"            },
    pts: 900,
  },
  {
    id: "a7",
    icon: "🏔️",
    slug: "alpine-master",
    category: "special",
    name: { pl: "Alpinista",        en: "Alpine Master"    },
    desc: { pl: "Zdobądź wszystkie trasy górskie",              en: "Complete all mountain tracks"               },
    pts: 1200,
  },
  {
    id: "a8",
    icon: "🌙",
    slug: "night-rider",
    category: "conditions",
    name: { pl: "Nocny jeździec",   en: "Night Rider"      },
    desc: { pl: "Ukończ 20 tras w porze nocnej",                en: "Finish 20 tracks at night"                  },
    pts: 700,
  },
  {
    id: "a9",
    icon: "👑",
    slug: "asphalt-legend",
    category: "special",
    name: { pl: "Legenda asfaltu",  en: "Asphalt Legend"   },
    desc: { pl: "Zdobądź top 1% globalnego rankingu",           en: "Reach top 1% of the global ranking"         },
    pts: 2000,
  },
  {
    id: "a10",
    icon: "🤝",
    slug: "team-spirit",
    category: "social",
    name: { pl: "Duch drużyny",     en: "Team Spirit"      },
    desc: { pl: "Zagraj 50 tras z przyjaciółmi",                en: "Play 50 tracks with friends"                },
    pts: 650,
  },
  {
    id: "a11",
    icon: "🏁",
    slug: "first-step",
    category: "distance",
    name: { pl: "Pierwszy krok",    en: "First Step"       },
    desc: { pl: "Ukończ swoją pierwszą trasę",                  en: "Finish your first track"                    },
    pts: 100,
  },
  {
    id: "a12",
    icon: "💨",
    slug: "east-wind",
    category: "speed",
    name: { pl: "Wiatr ze wschodu", en: "East Wind"        },
    desc: { pl: "Zdobądź medal złoty na każdej trasie",         en: "Get gold medal on every track"              },
    pts: 1500,
  },
];

const CATEGORIES = ["speed", "distance", "conditions", "social", "special"];

module.exports = { ACHIEVEMENTS, CATEGORIES };
