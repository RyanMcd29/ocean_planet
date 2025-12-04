import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db, pool } from './db';
import {
  diveSites,
  species,
  diveSiteSpecies,
  countries,
  certifications,
  images,
  speciesImages,
  users,
  diveLogs,
  diveLogSpecies,
  posts,
  postImages,
  postSpecies,
  userCertifications,
  type Species as SpeciesRecord,
  type DiveSite as DiveSiteRecord,
} from "@shared/schema";
import { sql, eq, and } from "drizzle-orm";

type SpeciesCsvRow = Record<string, string>;
type DiveSiteCsvRow = Record<string, string>;

const seedDataRoot = path.join(process.cwd(), 'server', 'seed-data');
const speciesCsvPath = path.join(seedDataRoot, 'species', 'species.csv');
const speciesImagesDir = path.join(seedDataRoot, 'species', 'images');
const diveSitesCsvPath = path.join(seedDataRoot, 'dive-sites', 'dive-sites.csv');
const uploadsSeedDir = path.join(process.cwd(), 'uploads', 'seed-species');

const fallbackImagePool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80'
];

// Track CSV rows for image lookups
const speciesRowLookup = new Map<string, SpeciesCsvRow>();

const normalizeName = (value?: string | null) => cleanString(value)?.replace(/[✔]/g, '').trim() ?? null;

function cleanString(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value
    .replace(/\uFEFF/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/�/g, '°')
    .trim();
  return normalized.length ? normalized : null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '') // drop apostrophes so names like "Shaw's" match filenames without them
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitToArray(value?: string | null): string[] | null {
  const cleaned = cleanString(value);
  if (!cleaned) return null;
  const normalized = cleaned.replace(/•/g, ',');
  const parts = normalized
    .split(/[,;|]/)
    .flatMap((part) => part.split(/\n+/))
    .map((part) => part.replace(/^[-•\s]+/, '').trim())
    .filter(Boolean);
  return parts.length ? parts : null;
}

function parseNumberRange(value?: string | null): { min: number | null; max: number | null } {
  if (!value) return { min: null, max: null };
  const numbers = (value.match(/-?\d+(?:\.\d+)?/g) || []).map((num) => Number(num)).filter((num) => !Number.isNaN(num));
  if (numbers.length === 0) return { min: null, max: null };
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] };
  const [first, second] = numbers;
  return {
    min: Math.min(first, second),
    max: Math.max(first, second),
  };
}

function roundToInt(value: number | null | undefined): number | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return Math.round(value);
}

function parseDms(part: string): number | null {
  const cleaned = part.replace(/−/g, '-');
  const parts = (cleaned.match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter((n) => !Number.isNaN(n));
  if (parts.length === 0) return null;
  const [deg, min = 0, sec = 0] = parts;
  const sign = /[SW]/i.test(part) || deg < 0 ? -1 : 1;
  const value = Math.abs(deg) + min / 60 + sec / 3600;
  return value * sign;
}

function parseCoordinates(raw: string | null, fallbackIndex = 0): { lat: number; lng: number } {
  const cleaned = cleanString(raw);
  if (cleaned) {
    const normalized = cleaned.replace(/[º�]/g, '°').replace(/\s+/g, ' ').trim();
    const decimalMatch = normalized.match(/-?\d+(?:\.\d+)?/g);
    if (decimalMatch && decimalMatch.length >= 2 && !normalized.includes('°') && !normalized.includes("'")) {
      return { lat: Number(decimalMatch[0]), lng: Number(decimalMatch[1]) };
    }

    const dmsParts = normalized.split(/[ ,]+(?=[-]?\d)/).filter(Boolean);
    if (dmsParts.length >= 2) {
      const lat = parseDms(dmsParts[0]);
      const lng = parseDms(dmsParts[1]);
      if (lat !== null && lng !== null) {
        return { lat, lng };
      }
    }

    if (decimalMatch && decimalMatch.length >= 4) {
      const [degLat, minLat, degLng, minLng] = decimalMatch.map(Number);
      if (![degLat, minLat, degLng, minLng].some((num) => Number.isNaN(num))) {
        return {
          lat: degLat + minLat / 60,
          lng: degLng + minLng / 60,
        };
      }
    }
  }

  // Fallback near Perth metro area with slight offsets to avoid identical coordinates
  return {
    lat: -31.95 - fallbackIndex * 0.02,
    lng: 115.86 + fallbackIndex * 0.02,
  };
}

function simplifyDifficulty(raw: string | null): string {
  const cleaned = cleanString(raw);
  if (!cleaned) return 'Intermediate';
  const lower = cleaned.toLowerCase();
  if (lower.includes('advanced')) return 'Advanced';
  if (lower.includes('beginner')) return 'Beginner';
  if (lower.includes('intermediate')) return 'Intermediate';
  if (lower.includes('expert')) return 'Expert';
  return cleaned.split(/[,(]/)[0].trim() || 'Intermediate';
}

function buildDiveSiteDescription(row: DiveSiteCsvRow): string {
  const parts = [
    cleanString(row.Location_Description),
    cleanString(row.Habitat_Type),
    cleanString(row.Unique_Features),
    cleanString(row.Marine_Species),
    cleanString(row.Community_Notes),
  ].filter(Boolean);

  if (parts.length === 0 && row.Name) {
    return `${row.Name} is a dive site recorded from CSV seed data.`;
  }

  return parts.join(' ');
}

function extractFunFacts(text: string): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.replace(/^[-•\s]+/, '').trim())
    .filter((line) => line.length > 0 && /[A-Za-z]/.test(line))
    .slice(0, 3);
}

function ensureUploadsDir() {
  fs.mkdirSync(uploadsSeedDir, { recursive: true });
}

function buildSpeciesImageLookup(): Map<string, string[]> {
  const lookup = new Map<string, string[]>();
  if (!fs.existsSync(speciesImagesDir)) return lookup;

  for (const file of fs.readdirSync(speciesImagesDir)) {
    const fullPath = path.join(speciesImagesDir, file);
    if (!fs.statSync(fullPath).isFile()) continue;

    const baseSlug = slugify(path.parse(file).name.replace(/_/g, ' '));
    const existing = lookup.get(baseSlug) ?? [];
    existing.push(fullPath);
    lookup.set(baseSlug, existing);
  }

  return lookup;
}

function copyLocalImageToUploads(sourcePath: string, slug: string, index: number): string {
  ensureUploadsDir();
  const ext = path.extname(sourcePath) || '.jpg';
  const targetName = `${slug}-${index + 1}${ext.toLowerCase()}`;
  const targetPath = path.join(uploadsSeedDir, targetName);
  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(sourcePath, targetPath);
  }
  return `/uploads/seed-species/${targetName}`;
}

async function ensureImageRecord(
  url: string,
  options?: {
    alt?: string | null;
    userId?: number | null;
    source?: string | null;
  },
) {
  const alt = options?.alt ?? null;
  const userId = options?.userId ?? null;
  const source = options?.source ?? 'seed';

  const [existing] = await db.select().from(images).where(eq(images.url, url));
  if (existing) {
    // Backfill missing alt/userId if provided
    if ((!existing.alt && alt) || (!existing.userId && userId)) {
      const [updated] = await db
        .update(images)
        .set({
          alt: existing.alt ?? alt ?? undefined,
          userId: existing.userId ?? userId ?? undefined,
        })
        .where(eq(images.id, existing.id))
        .returning();
      return updated;
    }
    return existing;
  }

  const [created] = await db
    .insert(images)
    .values({
      url,
      alt: alt ?? undefined,
      userId: userId ?? undefined,
      source: source ?? undefined,
    })
    .returning();
  return created;
}

function shuffle<T>(array: T[]): T[] {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function randomFrequency(): string {
  const options = ['Abundant', 'Common', 'Occasional', 'Rare'];
  return options[Math.floor(Math.random() * options.length)];
}

async function truncateTables(tables: string[]) {
  const client = await pool.connect();
  try {
    for (const table of tables) {
      try {
        await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
        console.log(`Truncated ${table}`);
      } catch (error: any) {
        console.log(`Skipping truncate for ${table}: ${error.message}`);
      }
    }
  } finally {
    client.release();
  }
}

function inferCountry(location: string | null): string {
  if (!location) return 'Australia';
  const lower = location.toLowerCase();
  if (lower.includes('philippines')) return 'Philippines';
  if (lower.includes('belize')) return 'Belize';
  if (lower.includes('bahamas')) return 'Bahamas';
  if (lower.includes('mexico')) return 'Mexico';
  if (lower.includes('egypt')) return 'Egypt';
  if (lower.includes('maldives')) return 'Maldives';
  return 'Australia';
}

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

    // Core image tables for species and posts
    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        alt TEXT,
        user_id INTEGER,
        source TEXT DEFAULT 'seed',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS species_images (
        id SERIAL PRIMARY KEY,
        species_id INTEGER NOT NULL REFERENCES species(id) ON DELETE CASCADE,
        image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
        is_primary BOOLEAN DEFAULT FALSE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS post_images (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS post_species (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        species_id INTEGER NOT NULL REFERENCES species(id) ON DELETE CASCADE
      );
    `);

    // Backfill helper columns
    await client.query(`ALTER TABLE IF EXISTS species ADD COLUMN IF NOT EXISTS primary_image_id INTEGER;`);
    await client.query(`ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS primary_image_id INTEGER;`);
    await client.query(`ALTER TABLE IF EXISTS photos ADD COLUMN IF NOT EXISTS image_id INTEGER;`);

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

async function seedSpeciesFromCsv(): Promise<SpeciesRecord[]> {
  console.log('Seeding species from CSV...');

  speciesRowLookup.clear();
  let rows: SpeciesCsvRow[] = [];
  try {
    const fileContents = fs.readFileSync(speciesCsvPath, 'utf-8');
    rows = parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
    }) as SpeciesCsvRow[];
  } catch (error) {
    console.error('Unable to read species CSV file:', error);
    return [];
  }

  const seeded: SpeciesRecord[] = [];

  for (const row of rows) {
    const commonName = normalizeName(row['Common Name']);
    if (!commonName) continue;

    const slug = slugify(commonName);
    speciesRowLookup.set(slug, row);

    const scientificName = normalizeName(row['Scientific Name']) || commonName;
    const keyFactsRaw = cleanString(row['Key Facts & Learning']);
    const description = keyFactsRaw && keyFactsRaw.length > 0
      ? keyFactsRaw.slice(0, 1500)
      : `Details about ${commonName}.`;

    const keyFacts = keyFactsRaw
      ? [
          {
            title: `${commonName} overview`,
            summary: keyFactsRaw.slice(0, 280),
            details: keyFactsRaw,
          },
        ]
      : undefined;

    const funFacts = extractFunFacts(keyFactsRaw ?? '');

    const payload: any = {
      commonName,
      scientificName,
      description,
      category: cleanString(row['Class']) || 'Marine Life',
    };

    const optionalFields: Record<string, any> = {
      conservationStatus: cleanString(row['Conservation Status']),
      imageUrl: cleanString(row['Photo']),
      domain: cleanString(row['Domain']),
      kingdom: cleanString(row['Kingdom']),
      phylum: cleanString(row['Phylum']),
      class: cleanString(row['Class']),
      order: cleanString(row['Order']),
      family: cleanString(row['Family']),
      genus: cleanString(row['Genus']),
      regionFound: cleanString(row['Region Found']),
      tags: splitToArray(row['Tags']),
      diveSiteAreas: splitToArray(row['Dive Site Areas']),
      seasonalOccurrence: cleanString(row['Seasonal Occurrence ']) || cleanString((row as any)['Seasonal Occurrence']),
      miniLessonRecommendations: cleanString(row['Mini Lesson Recommendations ']),
    };

    if (funFacts.length) optionalFields.funFacts = funFacts;
    if (keyFacts) optionalFields.keyFacts = keyFacts;

    Object.entries(optionalFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)) {
        payload[key] = value;
      }
    });

    const [existing] = await db.select().from(species).where(eq(species.commonName, commonName));
    if (existing) {
      const [updated] = await db.update(species).set(payload).where(eq(species.id, existing.id)).returning();
      seeded.push(updated);
    } else {
      const [created] = await db.insert(species).values(payload).returning();
      seeded.push(created);
    }
  }

  console.log(`Seeded or refreshed ${seeded.length} species records from CSV`);
  return seeded;
}

async function seedDiveSitesFromCsv(): Promise<DiveSiteRecord[]> {
  console.log('Seeding dive sites from CSV...');

  let rows: DiveSiteCsvRow[] = [];
  try {
    const fileContents = fs.readFileSync(diveSitesCsvPath, 'utf-8');
    rows = parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
    }) as DiveSiteCsvRow[];
  } catch (error) {
    console.error('Unable to read dive site CSV file:', error);
    return [];
  }

  const seeded: DiveSiteRecord[] = [];
  let index = 0;

  for (const row of rows) {
    const name = cleanString(row.Name);
    if (!name) continue;

    const coords = parseCoordinates(row.Coordinates ?? null, index);
    const depthRange = parseNumberRange(row.Depth_Range);
    const visibilityRange = parseNumberRange(row.Visibility);
    const temperatureRange = parseNumberRange(row.Water_Temperature);
    const location = cleanString(row.Region) || cleanString(row.Location_Description) || 'Perth, Western Australia';
    const description = buildDiveSiteDescription(row);

    const payload: any = {
      name,
      difficulty: simplifyDifficulty(row.Experience_Level),
      description,
      location,
      country: inferCountry(location),
      latitude: coords.lat,
      longitude: coords.lng,
    };

    const optionalFields: Record<string, any> = {
      minDepth: roundToInt(depthRange.min),
      maxDepth: roundToInt(depthRange.max),
      minVisibility: roundToInt(visibilityRange.min),
      maxVisibility: roundToInt(visibilityRange.max),
      minTemp: roundToInt(temperatureRange.min),
      maxTemp: roundToInt(temperatureRange.max),
      current: cleanString(row.Current_and_Surge),
      bestSeason: cleanString(row.Best_Time_to_Dive),
      conservationStatus: cleanString(row.Conservation_Info),
      conservationInfo: cleanString(row.Community_Notes),
      highlights: splitToArray(row.Unique_Features) || splitToArray(row.Marine_Species),
      habitats: splitToArray(row.Habitat_Type),
      accessType: cleanString(row.Access_Type),
      entryConditions: cleanString(row.Entry_Conditions),
      surgeConditions: cleanString(row.Current_and_Surge),
      seasonalEvents: cleanString(row.Seasonal_Events),
      uniqueFeatures: cleanString(row.Unique_Features),
      userExperienceNotes: cleanString(row.User_Experience),
      diveSiteLayout: cleanString(row.Dive_Site_Layout),
      conservationPark: cleanString(row.Region)?.includes('Marine Park') ? cleanString(row.Region) : undefined,
    };

    Object.entries(optionalFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)) {
        payload[key] = value;
      }
    });

    const [existing] = await db.select().from(diveSites).where(eq(diveSites.name, name));
    if (existing) {
      const [updated] = await db.update(diveSites).set(payload).where(eq(diveSites.id, existing.id)).returning();
      seeded.push(updated);
    } else {
      const [created] = await db.insert(diveSites).values(payload).returning();
      seeded.push(created);
    }

    index += 1;
  }

  console.log(`Seeded or refreshed ${seeded.length} dive sites from CSV`);
  return seeded;
}

async function clearSeedData() {
  console.log('Removing existing seed data (truncate + reset identities)...');
  const tablesToClear = [
    'dive_log_species',
    'dive_logs',
    'post_species',
    'post_images',
    'posts',
    'species_images',
    'images',
    'dive_site_species',
    'nearby_dive_sites',
    'water_conditions',
    'dive_centers',
    'photos',
    'reviews',
    'user_certifications',
    'certifications',
    'species',
    'dive_sites',
    'users',
    'countries',
  ];

  await truncateTables(tablesToClear);
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

async function seedSpeciesImages() {
  console.log('Backfilling species images (including uploads) into central images table...');
  const allSpecies = await db.select().from(species);
  const localImages = buildSpeciesImageLookup();
  let createdLinks = 0;

  for (const sp of allSpecies) {
    const slug = slugify(sp.commonName);
    const csvRow = speciesRowLookup.get(slug);
    const photoFromCsv = csvRow ? cleanString(csvRow['Photo']) : null;

    const existingLinks = await db.select().from(speciesImages).where(eq(speciesImages.speciesId, sp.id));
    const existingImageIds = new Set(existingLinks.map((link) => link.imageId));
    let hasPrimary = existingLinks.some((link) => link.isPrimary);

    const mediaSources = new Set<string>();
    const localMatches = localImages.get(slug) || [];

    localMatches.forEach((file, idx) => {
      mediaSources.add(copyLocalImageToUploads(file, slug, idx));
    });

    if (photoFromCsv) mediaSources.add(photoFromCsv);
    if (sp.imageUrl) mediaSources.add(sp.imageUrl);

    if (mediaSources.size === 0) {
      mediaSources.add(fallbackImagePool[sp.id % fallbackImagePool.length]);
    }

    let index = 0;
    for (const url of mediaSources) {
      const image = await ensureImageRecord(url, { alt: sp.commonName });
      if (existingImageIds.has(image.id)) {
        index += 1;
        continue;
      }

      const isPrimary = !hasPrimary && index === 0;

      await db.insert(speciesImages).values({
        speciesId: sp.id,
        imageId: image.id,
        isPrimary,
      });

      if (isPrimary) {
        await db
          .update(species)
          .set({
            primaryImageId: image.id,
            imageUrl: url,
          })
          .where(eq(species.id, sp.id));
        hasPrimary = true;
      }

      createdLinks += 1;
      index += 1;
    }
  }

  console.log(`Seeded ${createdLinks} species image links (with multi-image support)`);
}

async function seedRandomDiveSiteSpeciesLinks() {
  console.log('Creating random dive site/species relationships for testing...');
  const allDiveSites = await db.select().from(diveSites);
  const allSpecies = await db.select().from(species);

  if (!allDiveSites.length || !allSpecies.length) {
    console.log('Not enough dive sites or species to create relationships.');
    return;
  }

  let created = 0;

  for (const site of allDiveSites) {
    const existingLinks = await db
      .select()
      .from(diveSiteSpecies)
      .where(eq(diveSiteSpecies.diveSiteId, site.id));

    const shuffled = shuffle(allSpecies);
    const targetCount = Math.min(Math.max(3, Math.floor(Math.random() * 4) + 3), shuffled.length);
    let added = 0;

    for (const sp of shuffled) {
      if (added >= targetCount) break;
      if (existingLinks.some((link) => link.speciesId === sp.id)) continue;

      await db.insert(diveSiteSpecies).values({
        diveSiteId: site.id,
        speciesId: sp.id,
        frequency: randomFrequency(),
      });

      created += 1;
      added += 1;
    }
  }

  console.log(`Created ${created} random dive site/species links`);
}

async function seedSampleTestData() {
  console.log('Adding sample users, posts, and dive logs for testing...');

  const allDiveSites = await db.select().from(diveSites);
  const allSpecies = await db.select().from(species);
  const [australia] = await db.select().from(countries).where(eq(countries.code, 'AU')).limit(1);

  const existingUser = await db.select().from(users).limit(1);
  if (existingUser.length > 0) {
    console.log('Users already exist, skipping sample user seeding.');
    return;
  }

  const [userA, userB] = await db
    .insert(users)
    .values([
      {
        username: 'ava_diver',
        name: 'Ava',
        lastname: 'Diver',
        email: 'ava@example.com',
        password: 'password',
        preferredActivity: 'diving',
        countryId: australia?.id ?? null,
      },
      {
        username: 'niko_explorer',
        name: 'Niko',
        lastname: 'Explorer',
        email: 'niko@example.com',
        password: 'password',
        preferredActivity: 'diving',
        countryId: australia?.id ?? null,
      },
    ])
    .returning();

  const certs = await db.select().from(certifications).limit(2);
  if (certs.length) {
    await db.insert(userCertifications).values(
      certs.map((cert, idx) => ({
        userId: idx % 2 === 0 ? userA.id : userB.id,
        certificationId: cert.id,
        dateObtained: new Date('2024-01-01'),
      })),
    );
  }

  const siteA = allDiveSites[0];
  const siteB = allDiveSites[1] ?? siteA;
  const speciesA = allSpecies[0];
  const speciesB = allSpecies[1] ?? speciesA;

  const heroImage = await ensureImageRecord(
    'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
    { alt: 'Jetty life', userId: userA.id, source: 'seed' },
  );
  const reefImage = await ensureImageRecord(
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    { alt: 'Reef scene', userId: userB.id, source: 'seed' },
  );

  const [postOne] = await db
    .insert(posts)
    .values({
      userId: userA.id,
      content: 'Great morning dive - heaps of macro critters on the pylons.',
      tags: ['trip-report', 'macro'],
      location: siteA?.location ?? 'Perth, WA',
      diveSiteId: siteA?.id ?? null,
      speciesSpotted: speciesA ? [speciesA.commonName] : [],
      photoUrl: heroImage.url,
      primaryImageId: heroImage.id,
    })
    .returning();

  await db.insert(postImages).values({
    postId: postOne.id,
    imageId: heroImage.id,
  });

  if (speciesA) {
    await db.insert(postSpecies).values({
      postId: postOne.id,
      speciesId: speciesA.id,
    });
  }

  const [postTwo] = await db
    .insert(posts)
    .values({
      userId: userB.id,
      content: 'Blue water and a couple of friendly rays at the outer wall.',
      tags: ['conditions', 'viz'],
      location: siteB?.location ?? 'WA Coast',
      diveSiteId: siteB?.id ?? null,
      speciesSpotted: [speciesA?.commonName, speciesB?.commonName].filter(Boolean) as string[],
      photoUrl: reefImage.url,
      primaryImageId: reefImage.id,
    })
    .returning();

  await db.insert(postImages).values({
    postId: postTwo.id,
    imageId: reefImage.id,
  });

  if (speciesB) {
    await db.insert(postSpecies).values({
      postId: postTwo.id,
      speciesId: speciesB.id,
    });
  }

  if (siteA) {
    const [logA] = await db
      .insert(diveLogs)
      .values({
        userId: userA.id,
        diveSiteId: siteA.id,
        diveDate: new Date('2024-12-01T08:00:00Z'),
        diveTime: '08:00',
        duration: 42,
        maxDepth: 18,
        avgDepth: 12,
        waterTemp: 20,
        visibility: 8,
        current: 'Light',
        conditions: 'Good',
        description: 'Training dive focused on buoyancy and photography.',
        equipment: '7mm wetsuit, single tank',
        certificationLevel: 'Open Water',
        buddyName: 'Niko',
      })
      .returning();

    if (speciesA) {
      await db.insert(diveLogSpecies).values({
        diveLogId: logA.id,
        speciesId: speciesA.id,
        quantity: 3,
        notes: 'At the mid-span pylons',
      });
    }
  }

  if (siteB) {
    const [logB] = await db
      .insert(diveLogs)
      .values({
        userId: userB.id,
        diveSiteId: siteB.id,
        diveDate: new Date('2024-12-08T10:30:00Z'),
        diveTime: '10:30',
        duration: 55,
        maxDepth: 22,
        avgDepth: 14,
        waterTemp: 21,
        visibility: 10,
        current: 'Moderate',
        conditions: 'Excellent',
        description: 'Great vis, followed a pair of rays along the wall.',
        equipment: '5mm wetsuit, single tank',
        certificationLevel: 'Advanced',
        buddyName: 'Ava',
      })
      .returning();

    if (speciesB) {
      await db.insert(diveLogSpecies).values({
        diveLogId: logB.id,
        speciesId: speciesB.id,
        quantity: 2,
        notes: 'Spotted near the turn point',
      });
    }
  }

  console.log('Sample users, posts, and logs seeded');
}

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    await createTablesIfNotExists();
    await seedCountries();
    await seedCertifications();

    await seedSpeciesFromCsv();
    await seedDiveSitesFromCsv();
    await addBlackspottedTuskfish();
    await seedSpeciesImages();
    await seedRandomDiveSiteSpeciesLinks();
    await seedSampleTestData();

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function reseedDatabase() {
  console.log('Reseeding database (full reset + seed)...');
  await clearSeedData();
  await seedDatabase();
}

// Export the seed function so it can be called from elsewhere
export { seedDatabase, reseedDatabase, clearSeedData };
