export type GlobalDiveSiteSeed = {
  name: string;
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  minDepth: number;
  maxDepth: number;
  minVisibility: number;
  maxVisibility: number;
  minTemp: number;
  maxTemp: number;
  current: string;
  highlights: string[];
  habitats: string[];
  mainImage?: string;
};

type RegionSeed = {
  region: string;
  country: string;
  baseLat: number;
  baseLng: number;
  tempRange: [number, number];
  visibilityRange: [number, number];
  depthRange: [number, number];
  current: string;
  habitats: string[];
  highlights: string[];
  names: string[];
};

const difficultyRotation = ["Beginner", "Intermediate", "Advanced", "Expert"];

function buildSeeds(): GlobalDiveSiteSeed[] {
  const regions: RegionSeed[] = [
    {
      region: "Great Barrier Reef",
      country: "Australia",
      baseLat: -16.9186,
      baseLng: 145.7781,
      tempRange: [24, 28],
      visibilityRange: [15, 28],
      depthRange: [8, 26],
      current: "Gentle",
      habitats: ["Coral Reef", "Tropical"],
      highlights: ["Hard corals", "Turtles", "Blue water"],
      names: [
        "Ribbon Reef Drift",
        "Cod Hole Ledge",
        "Osprey Gardens",
        "Cairns Shelf",
        "Coral Castle",
        "Turtle Bommies",
        "Blue Maze",
        "Opal Ridge",
        "Reef Lighthouse",
        "Minke Alley",
      ],
    },
    {
      region: "Red Sea",
      country: "Egypt",
      baseLat: 27.2579,
      baseLng: 33.8116,
      tempRange: [23, 28],
      visibilityRange: [18, 35],
      depthRange: [12, 32],
      current: "Mild",
      habitats: ["Coral Reef", "Blue Water"],
      highlights: ["Drop-offs", "Sharks", "Soft corals"],
      names: [
        "Shark Plateau",
        "Brothers Blue",
        "Elphinstone Fingers",
        "Ras Mohammed Walls",
        "Dolphin Shoal",
        "Thistlegorm Wreck",
        "Giftun Gardens",
        "Abu Nuhas Arches",
        "Marsa Alam Pinnacles",
        "Safaga Drift",
      ],
    },
    {
      region: "Maldives Central Atolls",
      country: "Maldives",
      baseLat: 4.175,
      baseLng: 73.509,
      tempRange: [27, 30],
      visibilityRange: [18, 30],
      depthRange: [10, 28],
      current: "Drift",
      habitats: ["Atoll", "Coral Reef"],
      highlights: ["Manta cleaning", "Channels", "Colourful bommies"],
      names: [
        "Ari South Channel",
        "Maaya Thila",
        "Rasdhoo Corner",
        "Fotteyo Steps",
        "Vaavu Blue",
        "Baa Lagoon",
        "Manta Avenue",
        "North Male Caves",
        "South Male Canyons",
        "Laamu Ridge",
      ],
    },
    {
      region: "Galapagos",
      country: "Ecuador",
      baseLat: -0.953,
      baseLng: -90.965,
      tempRange: [22, 26],
      visibilityRange: [10, 22],
      depthRange: [10, 34],
      current: "Strong",
      habitats: ["Pelagic", "Volcanic Reef"],
      highlights: ["Schooling hammerheads", "Sea lions", "Volcanic ledges"],
      names: [
        "Darwin Arch",
        "Wolf Island Terrace",
        "Gordon Rocks",
        "Kicker Rock",
        "Cousins Reef",
        "Floreana Pinnacle",
        "Isabela Lava Flow",
        "Fernandina Dropoff",
        "Academy Bay Garden",
        "Bartolome Sandbar",
      ],
    },
    {
      region: "Hawaii",
      country: "United States",
      baseLat: 21.3069,
      baseLng: -157.8583,
      tempRange: [24, 27],
      visibilityRange: [15, 30],
      depthRange: [9, 27],
      current: "Gentle",
      habitats: ["Lava Reef", "Tropical"],
      highlights: ["Lava tubes", "Turtles", "Manta encounters"],
      names: [
        "Lanai Cathedrals",
        "Molokini Backwall",
        "Turtle Town",
        "Kona Manta Night",
        "Electric Beach",
        "Makaha Caverns",
        "Niihau Walls",
        "Kauai Tunnels",
        "Waikiki Reef",
        "Hanauma Rim",
      ],
    },
    {
      region: "Cyclades",
      country: "Greece",
      baseLat: 36.3932,
      baseLng: 25.4615,
      tempRange: [19, 25],
      visibilityRange: [18, 30],
      depthRange: [12, 28],
      current: "Calm",
      habitats: ["Rocky Reef", "Mediterranean"],
      highlights: ["Sea caves", "Sponges", "Ancient stones"],
      names: [
        "Santorini Walls",
        "Cyclades Caves",
        "Rhodes Blue Hole",
        "Crete Fortress",
        "Zakynthos Arches",
        "Naxos Meadows",
        "Kefalonia Drop",
        "Mykonos Reef",
        "Peloponnese Wreck",
        "Skyros Pinnacles",
      ],
    },
    {
      region: "Belize Barrier Reef",
      country: "Belize",
      baseLat: 17.223,
      baseLng: -87.96,
      tempRange: [26, 29],
      visibilityRange: [15, 28],
      depthRange: [8, 24],
      current: "Gentle",
      habitats: ["Barrier Reef", "Mangrove edges"],
      highlights: ["Blue holes", "Nurse sharks", "Healthy coral"],
      names: [
        "Blue Hole Rim",
        "Turneffe Elbow",
        "Half Moon Caye",
        "Ambergris Reef",
        "Placencia Drop",
        "Laughing Bird Wall",
        "Glover's Ledge",
        "South Water Caye",
        "Belize Barrier Patch",
        "Coral Garden Cut",
      ],
    },
    {
      region: "Philippines",
      country: "Philippines",
      baseLat: 10.7202,
      baseLng: 119.545,
      tempRange: [26, 30],
      visibilityRange: [12, 26],
      depthRange: [10, 26],
      current: "Mild",
      habitats: ["Coral Triangle", "Reef"],
      highlights: ["Macro life", "Colourful reefs", "Walls"],
      names: [
        "Tubbataha South",
        "Apo Island Slope",
        "Balicasag Sanctuary",
        "Moalboal Sardines",
        "Coron Wreck Alley",
        "Puerto Galera Steps",
        "Anilao Nudibranch Bay",
        "Malapascua Thresher",
        "El Nido Cathedral",
        "Siargao Lagoon",
      ],
    },
    {
      region: "Raja Ampat",
      country: "Indonesia",
      baseLat: -0.2345,
      baseLng: 130.5067,
      tempRange: [27, 30],
      visibilityRange: [15, 30],
      depthRange: [10, 30],
      current: "Drift",
      habitats: ["Coral Triangle", "Reef"],
      highlights: ["Soft corals", "Mantas", "Dense fish life"],
      names: [
        "Cape Kri Rush",
        "Blue Magic Ridge",
        "Manta Sandy",
        "Misool Lagoons",
        "Wayag Channels",
        "Alor Cliffs",
        "Komodo Castle",
        "Padar Gardens",
        "Nusa Penida Drift",
        "Bunaken Walls",
      ],
    },
    {
      region: "KwaZulu-Natal",
      country: "South Africa",
      baseLat: -30.0,
      baseLng: 30.9,
      tempRange: [19, 24],
      visibilityRange: [10, 22],
      depthRange: [14, 32],
      current: "Surge",
      habitats: ["Reef", "Pelagic"],
      highlights: ["Ragged-tooth sharks", "Sardine run route", "Reef sharks"],
      names: [
        "Aliwal Shoal North",
        "Protea Banks Southern",
        "Sodwana Caves",
        "Manta Point SA",
        "Raggie Ridge",
        "Blue Rock Pinnacle",
        "Umkomaas Canyon",
        "Reef Shark Alley",
        "Uvongo Reef",
        "Durban Wreck",
      ],
    },
  ];

  return regions.flatMap((region, regionIdx) =>
    region.names.map((name, idx) => {
      const latOffset = ((idx % 3) - 1) * 0.08 + Math.floor(idx / 3) * 0.05;
      const lngOffset = ((idx % 4) - 1.5) * 0.12 + Math.floor(idx / 4) * 0.03;
      const minDepth = Math.round(region.depthRange[0] + (idx % 3) * 2);
      const maxDepth = Math.round(region.depthRange[1] + (idx % 4) * 1.5);
      const minVisibility = Math.round(region.visibilityRange[0] + (idx % 3) * 1.5);
      const maxVisibility = Math.round(region.visibilityRange[1] + (idx % 4));
      const minTemp = Math.round(region.tempRange[0] + (idx % 2));
      const maxTemp = Math.round(region.tempRange[1] + ((idx + regionIdx) % 2));
      const difficulty = difficultyRotation[(regionIdx + idx) % difficultyRotation.length];

      return {
        name: `${region.region} - ${name}`,
        location: `${region.region}, ${region.country}`,
        country: region.country,
        latitude: Number((region.baseLat + latOffset).toFixed(5)),
        longitude: Number((region.baseLng + lngOffset).toFixed(5)),
        difficulty,
        minDepth,
        maxDepth,
        minVisibility,
        maxVisibility,
        minTemp,
        maxTemp,
        current: region.current,
        highlights: region.highlights.slice(0, 3),
        habitats: region.habitats,
      } as GlobalDiveSiteSeed;
    }),
  );
}

export const globalDiveSiteSeeds: GlobalDiveSiteSeed[] = buildSeeds();
