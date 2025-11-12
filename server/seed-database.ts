import { db, pool } from './db';
import { diveSites, species, diveSiteSpecies, nearbyDiveSites, diveCenters, waterConditions, countries, users, diveLogs, diveLogSpecies, certifications, userCertifications } from "@shared/schema";
import { sql, eq, and } from "drizzle-orm";

async function createTablesIfNotExists() {
  const client = await pool.connect();
  try {
    // Create countries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        code TEXT UNIQUE NOT NULL,
        latitude REAL,
        longitude REAL
      );
    `);

    // Add country_id column to users table if it doesn't exist
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS country_id INTEGER;
    `);

    // Create dive_logs table if it doesn't exist (DO NOT DROP EXISTING DATA)
    await client.query(`
      CREATE TABLE IF NOT EXISTS dive_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        dive_site_id INTEGER NOT NULL,
        dive_date TIMESTAMP NOT NULL,
        dive_time TEXT NOT NULL,
        duration INTEGER NOT NULL,
        max_depth REAL NOT NULL,
        avg_depth REAL,
        water_temp REAL,
        visibility REAL,
        current TEXT,
        conditions TEXT,
        description TEXT,
        equipment TEXT,
        certification_level TEXT,
        buddy_name TEXT,
        date_logged TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create dive_log_species table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dive_log_species (
        id SERIAL PRIMARY KEY,
        dive_log_id INTEGER NOT NULL,
        species_id INTEGER NOT NULL,
        quantity INTEGER,
        notes TEXT
      );
    `);

    // Create certifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        agency TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create user_certifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_certifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        certification_id INTEGER NOT NULL,
        date_obtained DATE,
        certification_number TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, certification_id)
      );
    `);

    // Create lesson_progress table for tracking completed lessons
    await client.query(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        lesson_id TEXT NOT NULL,
        completed_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(user_id, lesson_id)
      );
    `);

    // Create category_badges table for tracking earned category badges
    await client.query(`
      CREATE TABLE IF NOT EXISTS category_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        badge_name TEXT NOT NULL,
        badge_icon TEXT NOT NULL,
        unlocked_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(user_id, category)
      );
    `);

    // Create posts table for community posts
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        photo_url TEXT,
        tags TEXT[],
        location TEXT,
        dive_site_id INTEGER,
        species_spotted TEXT[],
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add linked_lesson_id column to posts table if it doesn't exist
    await client.query(`
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS linked_lesson_id TEXT;
    `);

    // Create post_likes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(user_id, post_id)
      );
    `);

    // Create post_comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS post_comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create events table for community events
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP,
        location TEXT NOT NULL,
        city TEXT,
        dive_site_id INTEGER,
        latitude REAL,
        longitude REAL,
        organizer_name TEXT NOT NULL,
        description TEXT NOT NULL,
        external_link TEXT,
        cost TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add new species taxonomic and educational fields
    await client.query(`
      ALTER TABLE species ADD COLUMN IF NOT EXISTS domain TEXT;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS kingdom TEXT;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS phylum TEXT;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS class TEXT;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS "order" TEXT;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS family TEXT;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS genus TEXT;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS region_found TEXT;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS tags TEXT[];
      ALTER TABLE species ADD COLUMN IF NOT EXISTS dive_site_areas TEXT[];
      ALTER TABLE species ADD COLUMN IF NOT EXISTS seasonal_occurrence TEXT;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS key_facts JSONB;
      ALTER TABLE species ADD COLUMN IF NOT EXISTS mini_lesson_recommendations TEXT;
    `);

    console.log('Tables created/verified successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
}

async function seedCountries() {
  console.log('Seeding countries...');
  
  const existingCountries = await db.select().from(countries);
  if (existingCountries.length > 0) {
    console.log('Countries already seeded, skipping...');
    return;
  }

  const countriesData = [
    { name: 'Australia', code: 'AU', latitude: -27.0, longitude: 133.0 },
    { name: 'United States', code: 'US', latitude: 39.8283, longitude: -98.5795 },
    { name: 'Canada', code: 'CA', latitude: 56.1304, longitude: -106.3468 },
    { name: 'United Kingdom', code: 'GB', latitude: 55.3781, longitude: -3.4360 },
    { name: 'New Zealand', code: 'NZ', latitude: -40.9006, longitude: 174.8860 },
    { name: 'Germany', code: 'DE', latitude: 51.1657, longitude: 10.4515 },
    { name: 'France', code: 'FR', latitude: 46.2276, longitude: 2.2137 },
    { name: 'Japan', code: 'JP', latitude: 36.2048, longitude: 138.2529 },
    { name: 'Maldives', code: 'MV', latitude: 3.2028, longitude: 73.2207 },
    { name: 'Philippines', code: 'PH', latitude: 12.8797, longitude: 121.7740 },
    { name: 'Indonesia', code: 'ID', latitude: -0.7893, longitude: 113.9213 },
    { name: 'Thailand', code: 'TH', latitude: 15.8700, longitude: 100.9925 },
    { name: 'Malaysia', code: 'MY', latitude: 4.2105, longitude: 101.9758 },
    { name: 'Egypt', code: 'EG', latitude: 26.0975, longitude: 31.1367 },
    { name: 'Mexico', code: 'MX', latitude: 23.6345, longitude: -102.5528 },
    { name: 'Belize', code: 'BZ', latitude: 17.1899, longitude: -88.4976 },
    { name: 'Costa Rica', code: 'CR', latitude: 9.7489, longitude: -83.7534 },
    { name: 'Bahamas', code: 'BS', latitude: 25.0343, longitude: -77.3963 },
    { name: 'South Africa', code: 'ZA', latitude: -30.5595, longitude: 22.9375 },
    { name: 'Brazil', code: 'BR', latitude: -14.2350, longitude: -51.9253 },
  ];

  for (const country of countriesData) {
    await db.insert(countries).values(country);
  }
  
  console.log(`Seeded ${countriesData.length} countries`);
}

async function seedCertifications() {
  console.log('Seeding certifications...');
  
  const existingCertifications = await db.select().from(certifications);
  if (existingCertifications.length > 0) {
    console.log('Certifications already seeded, skipping...');
    return;
  }

  // PADI Certifications
  const padiCertifications = [
    { name: "Discover Scuba Diving", agency: "PADI", description: "Introductory scuba experience in a pool or confined water" },
    { name: "Scuba Diver", agency: "PADI", description: "Basic certification for diving to 12 meters with a dive professional" },
    { name: "Open Water Diver", agency: "PADI", description: "Entry-level certification for diving to 18 meters" },
    { name: "Adventure Diver", agency: "PADI", description: "First step after Open Water, complete 3 adventure dives" },
    { name: "Advanced Open Water Diver", agency: "PADI", description: "Advanced certification for diving to 30 meters" },
    { name: "Rescue Diver", agency: "PADI", description: "Learn to prevent and manage dive emergencies" },
    { name: "Divemaster", agency: "PADI", description: "Professional level certification to guide certified divers" },
    { name: "Open Water Scuba Instructor", agency: "PADI", description: "Qualified to teach scuba diving courses" },
    { name: "Master Scuba Diver Trainer", agency: "PADI", description: "Specialty instructor certification" },
    { name: "Course Director", agency: "PADI", description: "Highest level PADI instructor certification" },
    { name: "Enriched Air Diver", agency: "PADI", description: "Nitrox specialty certification" },
    { name: "Deep Diver", agency: "PADI", description: "Specialty for diving to 40 meters" },
    { name: "Wreck Diver", agency: "PADI", description: "Specialty for exploring shipwrecks" },
    { name: "Night Diver", agency: "PADI", description: "Specialty for night and limited visibility diving" },
    { name: "Underwater Photographer", agency: "PADI", description: "Specialty for underwater photography" },
    { name: "Peak Performance Buoyancy", agency: "PADI", description: "Specialty for mastering buoyancy control" }
  ];

  // SSI Certifications
  const ssiCertifications = [
    { name: "Try Scuba", agency: "SSI", description: "Introductory scuba experience" },
    { name: "Scuba Diver", agency: "SSI", description: "Basic certification for guided diving to 12 meters" },
    { name: "Open Water Diver", agency: "SSI", description: "Entry-level certification for independent diving to 18 meters" },
    { name: "Advanced Adventurer", agency: "SSI", description: "Advanced skills development program" },
    { name: "Advanced Open Water Diver", agency: "SSI", description: "Advanced certification for diving to 30 meters" },
    { name: "Stress & Rescue", agency: "SSI", description: "Emergency response and rescue training" },
    { name: "Dive Guide", agency: "SSI", description: "Professional level certification" },
    { name: "Divemaster", agency: "SSI", description: "Leadership level certification" },
    { name: "Open Water Instructor", agency: "SSI", description: "Instructor level certification" },
    { name: "Enriched Air Nitrox", agency: "SSI", description: "Nitrox specialty certification" },
    { name: "Deep Diving", agency: "SSI", description: "Deep diving specialty to 40 meters" },
    { name: "Wreck Diving", agency: "SSI", description: "Wreck exploration specialty" },
    { name: "Night Diving & Limited Visibility", agency: "SSI", description: "Night diving specialty" },
    { name: "Digital Underwater Photography", agency: "SSI", description: "Underwater photography specialty" }
  ];

  // SDI Certifications
  const sdiCertifications = [
    { name: "Open Water Scuba Diver", agency: "SDI", description: "Entry-level recreational diving certification" },
    { name: "Advanced Diver", agency: "SDI", description: "Advanced recreational diving certification" },
    { name: "Rescue Diver", agency: "SDI", description: "Rescue and emergency response certification" },
    { name: "Master Scuba Diver", agency: "SDI", description: "Highest recreational diving certification" },
    { name: "Divemaster", agency: "SDI", description: "Professional level certification" },
    { name: "Instructor", agency: "SDI", description: "Instructor level certification" },
    { name: "Nitrox Diver", agency: "SDI", description: "Enriched air specialty" },
    { name: "Deep Diver", agency: "SDI", description: "Deep diving specialty" },
    { name: "Wreck Diver", agency: "SDI", description: "Wreck diving specialty" },
    { name: "Night/Limited Visibility Diver", agency: "SDI", description: "Night diving specialty" }
  ];

  // TDI Certifications (Technical Diving)
  const tdiCertifications = [
    { name: "Nitrox Diver", agency: "TDI", description: "Technical nitrox diving certification" },
    { name: "Advanced Nitrox Diver", agency: "TDI", description: "Advanced technical nitrox certification" },
    { name: "Decompression Procedures Diver", agency: "TDI", description: "Decompression diving certification" },
    { name: "Extended Range Diver", agency: "TDI", description: "Extended range technical diving" },
    { name: "Trimix Diver", agency: "TDI", description: "Trimix technical diving certification" },
    { name: "Advanced Trimix Diver", agency: "TDI", description: "Advanced trimix certification" },
    { name: "CCR Diver", agency: "TDI", description: "Closed circuit rebreather certification" },
    { name: "Cave Diver", agency: "TDI", description: "Technical cave diving certification" },
    { name: "Technical Instructor", agency: "TDI", description: "Technical diving instructor" }
  ];

  // Insert all certifications
  const allCertifications = [...padiCertifications, ...ssiCertifications, ...sdiCertifications, ...tdiCertifications];
  
  for (const cert of allCertifications) {
    await db.insert(certifications).values(cert);
  }

  console.log(`Successfully seeded ${allCertifications.length} certifications`);
}

async function addBlackspottedTuskfish() {
  console.log('Checking for Blackspotted Tuskfish...');
  
  // Check if species already exists
  const existing = await db.select().from(species).where(sql`scientific_name = 'Choerodon schoenleinii'`);
  
  if (existing.length > 0) {
    console.log('Blackspotted Tuskfish already exists, skipping...');
    return;
  }
  
  console.log('Adding Blackspotted Tuskfish with full taxonomic data...');
  
  await db.insert(species).values({
    commonName: "Blackspotted Tuskfish",
    scientificName: "Choerodon schoenleinii",
    description: "Large tuskfish with black spot at base of dorsal fin. This impressive reef fish is known for its powerful jaws and distinctive markings, making it a favorite among divers exploring Western Australia's coral and rocky reefs.",
    conservationStatus: "Least Concern",
    category: "Fish",
    habitats: ["Coral Reef", "Rocky Reef", "Tropical Waters"],
    imageUrl: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    
    // Taxonomic classification
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Actinopterygii",
    order: "Labriformes",
    family: "Labridae",
    genus: "Choerodon",
    
    // Geographic and ecological data
    regionFound: "Gascoyne Coast Bioregion",
    tags: ["reef"],
    diveSiteAreas: ["Ningaloo Reef", "Dampier"],
    seasonalOccurrence: "Year-round",
    
    // Educational content with structured key facts
    keyFacts: [
      {
        title: "Protogynous Hermaphrodite",
        summary: "Is a protogynous sequential hermaphrodite - starts life as a female and later changes into a male, usually when it grows larger or when a dominant male is absent.",
        details: "This sex change is common among wrasses and tuskfishes (family Labridae) and helps balance reproduction in their social groups. One large male defends a territory with several females, and when he disappears, the largest female transforms to take his place.",
        subPoints: [
          "Sequential hermaphrodite: An organism that changes sex during its lifetime - starting as one sex and later becoming the other.",
          "Protandry: Starts as a male, later changes to female (e.g. clownfish).",
          "Protogyny: Starts as a female, later changes to male (e.g. many wrasses and parrotfish).",
          "This ability is usually triggered by social or environmental cues - like the absence of a dominant male or changes in population structure - and helps maximize reproductive success in different conditions."
        ]
      }
    ],
    miniLessonRecommendations: "Discuss hermaphroditism in wrasses and parrotfishes.",
    
    funFacts: [
      "🐟 Blackspotted Tuskfish can change sex from female to male as they mature",
      "💪 They have powerful crushing jaws that can crack open mollusks and crustaceans",
      "🏠 Large males defend territories with multiple females in a harem-like social structure"
    ]
  });
  
  console.log('Successfully added Blackspotted Tuskfish!');
}

async function linkBlackspottedTuskfishToDiveSites() {
  console.log('Linking Blackspotted Tuskfish to dive sites...');
  
  // Find the Blackspotted Tuskfish
  const [tuskfish] = await db.select().from(species).where(eq(species.scientificName, 'Choerodon schoenleinii'));
  
  if (!tuskfish) {
    console.log('WARNING: Blackspotted Tuskfish not found, skipping dive site linking');
    return;
  }
  
  // Define dive sites and their frequencies based on known encounter likelihood
  const diveSiteLinks = [
    { name: "Navy Pier", frequency: "Common" },
    { name: "Dibley-s Drop-Off", frequency: "Uncommon" },
    { name: "Blizzard Ridge", frequency: "Uncommon" },
    { name: "Gulliver's", frequency: "Rare" }
  ];
  
  for (const link of diveSiteLinks) {
    // Find the dive site by exact name
    const [site] = await db.select().from(diveSites).where(eq(diveSites.name, link.name));
    
    if (!site) {
      console.log(`WARNING: Dive site "${link.name}" not found, skipping link`);
      continue;
    }
    
    // Check if link already exists
    const [existingLink] = await db
      .select()
      .from(diveSiteSpecies)
      .where(
        and(
          eq(diveSiteSpecies.diveSiteId, site.id),
          eq(diveSiteSpecies.speciesId, tuskfish.id)
        )
      );
    
    if (existingLink) {
      console.log(`Link between Blackspotted Tuskfish and ${link.name} already exists, skipping`);
      continue;
    }
    
    // Create the link
    await db.insert(diveSiteSpecies).values({
      diveSiteId: site.id,
      speciesId: tuskfish.id,
      frequency: link.frequency
    });
    
    console.log(`✓ Linked Blackspotted Tuskfish to ${link.name} (${link.frequency})`);
  }
  
  console.log('Blackspotted Tuskfish dive site linking complete!');
}

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // First, ensure tables exist
    await createTablesIfNotExists();

    // Always seed countries first (they are needed for registration)
    await seedCountries();

    // Always seed certifications (they are needed for profile management)
    await seedCertifications();

    // Add new species with extended taxonomic data
    await addBlackspottedTuskfish();

    // Link Blackspotted Tuskfish to specific dive sites
    await linkBlackspottedTuskfishToDiveSites();

    // Check if we already have data
    const existingDiveSites = await db.select().from(diveSites);

    if (existingDiveSites.length > 0) {
      console.log('Database already contains dive sites, skipping dive site seeding.');
      return;
    }

    // Seed sample dive sites
    console.log('Adding sample dive sites...');
    const [greatBarrierReef] = await db.insert(diveSites).values({
      name: "Great Barrier Reef",
      difficulty: "Intermediate",
      description: "The Great Barrier Reef is the world's largest coral reef system, stretching over 2,300 kilometers along the coast of Queensland, Australia. It offers some of the most spectacular diving experiences with its vibrant coral formations and diverse marine life.",
      location: "Queensland, Australia",
      country: "Australia",
      latitude: -16.7525,
      longitude: 146.5361,
      current: "Mild",
      minDepth: 15,
      maxDepth: 30,
      minVisibility: 10,
      maxVisibility: 30,
      minTemp: 24,
      maxTemp: 30,
      bestSeason: "June - November",
      peakVisibilityMonth: "September",
      conservationStatus: "Protected Area",
      conservationInfo: "The Great Barrier Reef is a UNESCO World Heritage site facing threats from climate change, water pollution, and coastal development. Visitors are required to follow strict guidelines to minimize impact.",
      mainImage: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Coral Gardens", "Reef Sharks", "Sea Turtles", "Manta Rays", "Wreck Diving", "Night Dives"],
      habitats: ["Coral Gardens", "Drop-offs", "Sandy Flats", "Sea Grass Beds"]
    }).returning();

    const [bluehole] = await db.insert(diveSites).values({
      name: "The Blue Hole",
      difficulty: "Advanced",
      description: "The Blue Hole in Belize is a world-renowned dive site that is part of the Lighthouse Reef System. This perfectly circular underwater sinkhole is over 300 meters across and 125 meters deep, offering divers a chance to see incredible marine life and geological formations.",
      location: "Lighthouse Reef Atoll, Belize",
      country: "Belize",
      latitude: 17.3158,
      longitude: -87.5358,
      current: "Moderate",
      minDepth: 5,
      maxDepth: 40,
      minVisibility: 15,
      maxVisibility: 40,
      minTemp: 26,
      maxTemp: 29,
      bestSeason: "April - June",
      peakVisibilityMonth: "May",
      conservationStatus: "Marine Reserve",
      conservationInfo: "Part of the Belize Barrier Reef Reserve System, a UNESCO World Heritage site requiring careful conservation efforts to protect its unique ecosystem.",
      mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Deep Blue Waters", "Stalactites", "Sharks", "Coral Formations", "Clear Visibility"],
      habitats: ["Sinkhole", "Reef Wall", "Open Ocean"]
    }).returning();

    const [tubbataha] = await db.insert(diveSites).values({
      name: "Tubbataha Reefs",
      difficulty: "Advanced",
      description: "The Tubbataha Reefs Natural Park is a remote diving destination in the Sulu Sea, Philippines. This protected marine sanctuary features extraordinary biodiversity with pristine coral reefs and an abundance of marine life.",
      location: "Sulu Sea, Philippines",
      country: "Philippines",
      latitude: 8.8011,
      longitude: 119.8902,
      current: "Strong",
      minDepth: 10,
      maxDepth: 40,
      minVisibility: 20,
      maxVisibility: 45,
      minTemp: 26,
      maxTemp: 30,
      bestSeason: "March - June",
      peakVisibilityMonth: "April",
      conservationStatus: "UNESCO World Heritage Site",
      conservationInfo: "Strictly protected marine sanctuary with limited visitor access to preserve its unique marine ecosystem.",
      mainImage: "https://images.unsplash.com/photo-1533713692156-f70938dc0d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Pristine Corals", "Sharks", "Manta Rays", "Sea Turtles", "Wall Diving"],
      habitats: ["Coral Reef", "Reef Wall", "Atolls"]
    }).returning();

    const [crystalPalace] = await db.insert(diveSites).values({
      name: "Crystal Palace",
      difficulty: "Beginner to Intermediate",
      description: "Known for its brilliant limestone reef systems and elaborate swim-throughs. Divers have noted the unique phenomenon where bubbles rise through holes in the reef, resembling crystals.",
      location: "Western Australia",
      country: "Australia",
      latitude: -32.02668,
      longitude: 115.54372,
      current: "Minimal to Moderate",
      minDepth: 8,
      maxDepth: 18,
      minVisibility: 15,
      maxVisibility: 25,
      minTemp: 18,
      maxTemp: 24,
      bestSeason: "October to April",
      peakVisibilityMonth: "December",
      conservationStatus: "Marine Protected Area",
      conservationInfo: "Protected reef system requiring careful diving practices to preserve unique limestone formations.",
      mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Limestone Formations", "Swim-throughs", "Crystal Caverns", "Diverse Marine Life"],
      habitats: ["Limestone Reef", "Swim-throughs", "Rocky Reef"]
    }).returning();

    const [roeReef] = await db.insert(diveSites).values({
      name: "Roe Reef",
      difficulty: "Intermediate",
      description: "A renowned Western Australian dive site featuring diverse marine ecosystems and excellent underwater topography.",
      location: "Perth",
      country: "Australia",
      latitude: -31.97917,
      longitude: 115.54000,
      current: "Light to Moderate",
      minDepth: 10,
      maxDepth: 25,
      minVisibility: 12,
      maxVisibility: 20,
      minTemp: 18,
      maxTemp: 22,
      bestSeason: "November to March",
      peakVisibilityMonth: "January",
      conservationStatus: "Marine Protected Area",
      conservationInfo: "Protected reef system supporting diverse marine ecosystems requiring sustainable diving practices.",
      mainImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Rocky Formations", "Kelp Forest", "Diverse Fish Species", "Underwater Topography"],
      habitats: ["Rocky Reef", "Kelp Forest", "Sandy Bottom"]
    }).returning();

    // Seed sample species
    console.log('Adding sample marine species...');
    const [clownfish] = await db.insert(species).values({
      commonName: "Clownfish",
      scientificName: "Amphiprioninae",
      description: "Small, brightly colored fish known for their symbiotic relationship with sea anemones.",
      conservationStatus: "Least Concern",
      habitats: ["Coral Reef", "Shallow Reef"],
      imageUrl: "https://images.unsplash.com/photo-1576806021995-9f68eb39f10b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Fish"
    }).returning();

    const [greenSeaTurtle] = await db.insert(species).values({
      commonName: "Green Sea Turtle",
      scientificName: "Chelonia mydas",
      description: "Large sea turtle with a heart-shaped shell and small head. Named for the green fat beneath its shell.",
      conservationStatus: "Endangered",
      habitats: ["Coral Reef", "Seagrass Beds", "Open Ocean"],
      imageUrl: "https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Reptile"
    }).returning();

    const [reefShark] = await db.insert(species).values({
      commonName: "Reef Shark",
      scientificName: "Carcharhinus melanopterus",
      description: "Medium-sized shark easily identified by the black tips on its fins. Common around coral reefs.",
      conservationStatus: "Near Threatened",
      habitats: ["Coral Reef", "Shallow Reef", "Reef Drop-offs"],
      imageUrl: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Shark"
    }).returning();

    const [mantaRay] = await db.insert(species).values({
      commonName: "Manta Ray",
      scientificName: "Mobula birostris",
      description: "One of the largest rays with a wingspan reaching up to 7 meters. Known for their intelligence and graceful swimming.",
      conservationStatus: "Vulnerable",
      habitats: ["Open Ocean", "Reef Drop-offs", "Cleaning Stations"],
      imageUrl: "https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Ray"
    }).returning();

    // Crystal Palace specific species
    const [blueGroper] = await db.insert(species).values({
      commonName: "Blue Groper",
      scientificName: "Achoerodus gouldii",
      description: "Large blue fish commonly seen patrolling Western Australian reefs. Males develop a distinctive bright blue coloration.",
      conservationStatus: "Least Concern",
      habitats: ["Rocky Reef", "Limestone Reef", "Temperate Reef"],
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Fish"
    }).returning();

    const [westernBlueDevil] = await db.insert(species).values({
      commonName: "Western Blue Devil",
      scientificName: "Paraplesiops meleagris",
      description: "Prefers caves and overhangs of reef systems. Has distinctive blue coloration with spotted patterns.",
      conservationStatus: "Least Concern",
      habitats: ["Rocky Reef", "Caves", "Overhangs"],
      imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Fish"
    }).returning();

    const [harlequinFish] = await db.insert(species).values({
      commonName: "Harlequin Fish",
      scientificName: "Othos dentex",
      description: "Often spotted near reef edges. Known for their distinctive patterned appearance.",
      conservationStatus: "Least Concern",
      habitats: ["Reef Edges", "Rocky Reef", "Open Water"],
      imageUrl: "https://images.unsplash.com/photo-1566551329999-ece81cad59fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Fish"
    }).returning();

    const [dhufish] = await db.insert(species).values({
      commonName: "Dhufish",
      scientificName: "Glaucosoma hebraicum",
      description: "Inhabits deeper sections of reefs and is naturally wary of divers. Prized by recreational fishers.",
      conservationStatus: "Near Threatened",
      habitats: ["Deep Reef", "Rocky Reef", "Continental Shelf"],
      imageUrl: "https://images.unsplash.com/photo-1574781330855-d0db3eb7e905?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Fish"
    }).returning();

    const [buffaloBream] = await db.insert(species).values({
      commonName: "Buffalo Bream",
      scientificName: "Kyphosus cornelii",
      description: "Seen grazing in groups across reef systems. Known for their schooling behavior.",
      conservationStatus: "Least Concern",
      habitats: ["Rocky Reef", "Seagrass Beds", "Open Water"],
      imageUrl: "https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Fish"
    }).returning();

    const [wobbegongShark] = await db.insert(species).values({
      commonName: "Wobbegong Shark",
      scientificName: "Orectolobus spp.",
      description: "Lies motionless during the day and becomes active at night. Master of camouflage on reef floors.",
      conservationStatus: "Least Concern",
      habitats: ["Rocky Reef", "Sandy Bottom", "Caves"],
      imageUrl: "https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Shark"
    }).returning();

    const [portJacksonShark] = await db.insert(species).values({
      commonName: "Port Jackson Shark",
      scientificName: "Heterodontus portusjacksoni",
      description: "Commonly encountered resting in sandy areas during the day. Has distinctive harness-like markings.",
      conservationStatus: "Least Concern",
      habitats: ["Sandy Bottom", "Rocky Reef", "Temperate Waters"],
      imageUrl: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Shark"
    }).returning();

    const [westernRockLobster] = await db.insert(species).values({
      commonName: "Western Rock Lobster",
      scientificName: "Panulirus cygnus",
      description: "Found in abundance within reef crevices. Commercially important species in Western Australia.",
      conservationStatus: "Least Concern",
      habitats: ["Rocky Reef", "Crevices", "Limestone Reef"],
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Crustacean"
    }).returning();

    const [scalyfin] = await db.insert(species).values({
      commonName: "Scalyfin",
      scientificName: "Parma occidentalis",
      description: "Defends its territory aggressively. Small but feisty fish common on Western Australian reefs.",
      conservationStatus: "Least Concern",
      habitats: ["Rocky Reef", "Territorial Areas", "Shallow Reef"],
      imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Fish"
    }).returning();

    const [moonWrasse] = await db.insert(species).values({
      commonName: "Moon Wrasse",
      scientificName: "Thalassoma lunare",
      description: "Adds vibrant color to the reefscape with its brilliant blue and green patterns.",
      conservationStatus: "Least Concern",
      habitats: ["Coral Reef", "Rocky Reef", "Tropical Waters"],
      imageUrl: "https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Fish"
    }).returning();

    // Add Blackspotted Tuskfish with full taxonomic and educational data
    const [blackspottedTuskfish] = await db.insert(species).values({
      commonName: "Blackspotted Tuskfish",
      scientificName: "Choerodon schoenleinii",
      description: "Large tuskfish with black spot at base of dorsal fin. This impressive reef fish is known for its powerful jaws and distinctive markings, making it a favorite among divers exploring Western Australia's coral and rocky reefs.",
      conservationStatus: "Least Concern",
      category: "Fish",
      habitats: ["Coral Reef", "Rocky Reef", "Tropical Waters"],
      imageUrl: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      
      // Taxonomic classification
      domain: "Eukarya",
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Actinopterygii",
      order: "Labriformes",
      family: "Labridae",
      genus: "Choerodon",
      
      // Geographic and ecological data
      regionFound: "Gascoyne Coast Bioregion",
      tags: ["reef"],
      diveSiteAreas: ["Ningaloo Reef", "Dampier"],
      seasonalOccurrence: "Year-round",
      
      // Educational content with structured key facts
      keyFacts: [
        {
          title: "Protogynous Hermaphrodite",
          summary: "Is a protogynous sequential hermaphrodite - starts life as a female and later changes into a male, usually when it grows larger or when a dominant male is absent.",
          details: "This sex change is common among wrasses and tuskfishes (family Labridae) and helps balance reproduction in their social groups. One large male defends a territory with several females, and when he disappears, the largest female transforms to take his place.",
          subPoints: [
            "Sequential hermaphrodite: An organism that changes sex during its lifetime - starting as one sex and later becoming the other.",
            "Protandry: Starts as a male, later changes to female (e.g. clownfish).",
            "Protogyny: Starts as a female, later changes to male (e.g. many wrasses and parrotfish).",
            "This ability is usually triggered by social or environmental cues - like the absence of a dominant male or changes in population structure - and helps maximize reproductive success in different conditions."
          ]
        }
      ],
      miniLessonRecommendations: "Discuss hermaphroditism in wrasses and parrotfishes.",
      
      funFacts: [
        "🐟 Blackspotted Tuskfish can change sex from female to male as they mature",
        "💪 They have powerful crushing jaws that can crack open mollusks and crustaceans",
        "🏠 Large males defend territories with multiple females in a harem-like social structure"
      ]
    }).returning();

    // Associate species with dive sites
    console.log('Associating species with dive sites...');
    await db.insert(diveSiteSpecies).values({
      diveSiteId: greatBarrierReef.id,
      speciesId: clownfish.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: greatBarrierReef.id,
      speciesId: greenSeaTurtle.id,
      frequency: "Frequent"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: greatBarrierReef.id,
      speciesId: reefShark.id,
      frequency: "Occasional"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: bluehole.id,
      speciesId: reefShark.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: bluehole.id,
      speciesId: mantaRay.id,
      frequency: "Rare"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: tubbataha.id,
      speciesId: clownfish.id,
      frequency: "Abundant"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: tubbataha.id,
      speciesId: greenSeaTurtle.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: tubbataha.id,
      speciesId: mantaRay.id,
      frequency: "Occasional"
    });

    // Crystal Palace species associations
    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: blueGroper.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: westernBlueDevil.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: harlequinFish.id,
      frequency: "Frequent"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: dhufish.id,
      frequency: "Occasional"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: buffaloBream.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: wobbegongShark.id,
      frequency: "Frequent"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: portJacksonShark.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: westernRockLobster.id,
      frequency: "Abundant"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: scalyfin.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: crystalPalace.id,
      speciesId: moonWrasse.id,
      frequency: "Frequent"
    });

    // Roe Reef species associations (sharing some species with Crystal Palace)
    await db.insert(diveSiteSpecies).values({
      diveSiteId: roeReef.id,
      speciesId: blueGroper.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: roeReef.id,
      speciesId: westernBlueDevil.id,
      frequency: "Occasional"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: roeReef.id,
      speciesId: portJacksonShark.id,
      frequency: "Frequent"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: roeReef.id,
      speciesId: westernRockLobster.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: roeReef.id,
      speciesId: scalyfin.id,
      frequency: "Abundant"
    });

    // Add nearby dive sites
    console.log('Adding nearby dive site relationships...');
    await db.insert(nearbyDiveSites).values({
      diveSiteId: greatBarrierReef.id,
      nearbyDiveSiteId: tubbataha.id,
      distance: 4500
    });

    await db.insert(nearbyDiveSites).values({
      diveSiteId: bluehole.id,
      nearbyDiveSiteId: tubbataha.id,
      distance: 3200
    });

    // Add dive centers
    console.log('Adding dive centers...');
    await db.insert(diveCenters).values({
      name: "GBR Dive Adventures",
      diveSiteId: greatBarrierReef.id,
      description: "Premier dive operator for Great Barrier Reef expeditions.",
      certification: "PADI 5-Star",
      contactInfo: "info@gbrdive.com",
      iconType: "padi"
    });

    await db.insert(diveCenters).values({
      name: "Blue Hole Exploration",
      diveSiteId: bluehole.id,
      description: "Specialized in technical diving at the Great Blue Hole.",
      certification: "NAUI & TDI",
      contactInfo: "dive@bluehole-explore.com",
      iconType: "naui"
    });

    await db.insert(diveCenters).values({
      name: "Tubbataha Voyages",
      diveSiteId: tubbataha.id,
      description: "Liveaboard expeditions to Tubbataha Reefs Natural Park.",
      certification: "PADI & SSI",
      contactInfo: "booking@tubbatahavoyages.com",
      iconType: "ssi"
    });

    // Seed water conditions
    await seedWaterConditions(greatBarrierReef, bluehole, tubbataha, crystalPalace, roeReef);

    // Add educational content for the Learn feature
    console.log('Database seeding complete!');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function seedWaterConditions(greatBarrierReef: any, bluehole: any, tubbataha: any, crystalPalace: any, roeReef: any) {
  console.log('Seeding water conditions...');

  // Great Barrier Reef current conditions
  await db.insert(waterConditions).values({
    diveSiteId: greatBarrierReef.id,
    waterTemp: 26,
    visibility: 30,
    currentStrength: 'Light',
    currentDirection: 'Southeast',
    waveHeight: 1.2,
    windSpeed: 15,
    windDirection: 'Northeast',
    weatherConditions: 'Partly cloudy',
    surfaceConditions: 'Calm',
    divingConditions: 'Excellent',
    reportedBy: 'Marine Weather Station',
    additionalNotes: 'Perfect conditions for diving. High visibility and calm seas.'
  });

  // Blue Hole current conditions
  await db.insert(waterConditions).values({
    diveSiteId: bluehole.id,
    waterTemp: 24,
    visibility: 45,
    currentStrength: 'Moderate',
    currentDirection: 'East',
    waveHeight: 0.8,
    windSpeed: 12,
    windDirection: 'East',
    weatherConditions: 'Sunny',
    surfaceConditions: 'Smooth',
    divingConditions: 'Excellent',
    reportedBy: 'Dive Center Belize',
    additionalNotes: 'Crystal clear water with excellent visibility. Light current at depth.'
  });

  // Tubbataha Reefs current conditions
  await db.insert(waterConditions).values({
    diveSiteId: tubbataha.id,
    waterTemp: 28,
    visibility: 25,
    currentStrength: 'Strong',
    currentDirection: 'Southwest',
    waveHeight: 2.1,
    windSpeed: 22,
    windDirection: 'Southwest',
    weatherConditions: 'Partly cloudy',
    surfaceConditions: 'Choppy',
    divingConditions: 'Good',
    reportedBy: 'Philippine Coast Guard',
    additionalNotes: 'Strong currents present. Recommended for experienced divers only.'
  });

  // Crystal Palace current conditions
  await db.insert(waterConditions).values({
    diveSiteId: crystalPalace.id,
    waterTemp: 18,
    visibility: 20,
    currentStrength: 'Light',
    currentDirection: 'West',
    waveHeight: 1.2,
    windSpeed: 16,
    windDirection: 'Southwest',
    weatherConditions: 'Partly cloudy',
    surfaceConditions: 'Calm',
    divingConditions: 'Good',
    reportedBy: 'WA Marine Parks',
    additionalNotes: 'Excellent limestone formations with good visibility. Light current ideal for all skill levels.'
  });

  // Roe Reef current conditions
  await db.insert(waterConditions).values({
    diveSiteId: roeReef.id,
    waterTemp: 19,
    visibility: 15,
    currentStrength: 'Light to Moderate',
    currentDirection: 'Southwest',
    waveHeight: 1.5,
    windSpeed: 18,
    windDirection: 'West',
    weatherConditions: 'Clear',
    surfaceConditions: 'Slight chop',
    divingConditions: 'Good',
    reportedBy: 'Perth Diving Academy',
    additionalNotes: 'Diverse marine ecosystem with kelp forest. Good visibility with moderate current suitable for intermediate divers.'
  });
}

// Export the seed function so it can be called from elsewhere
export { seedDatabase };