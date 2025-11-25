import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function setupDatabase() {
  console.log("Setting up database tables...");

  try {
    // Create tables manually using SQL
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_image_url VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      DROP TABLE IF EXISTS dive_sites CASCADE;
      CREATE TABLE dive_sites (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        country TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        difficulty TEXT NOT NULL,
        min_depth INTEGER,
        max_depth INTEGER,
        min_visibility INTEGER,
        max_visibility INTEGER,
        min_temp INTEGER,
        max_temp INTEGER,
        current TEXT,
        best_season TEXT,
        peak_visibility_month TEXT,
        conservation_status TEXT,
        conservation_info TEXT,
        main_image TEXT,
        highlights TEXT[],
        habitats TEXT[]
      );
    `);

    await db.execute(sql`
      DROP TABLE IF EXISTS species CASCADE;
      CREATE TABLE species (
        id SERIAL PRIMARY KEY,
        common_name TEXT NOT NULL,
        scientific_name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        conservation_status TEXT,
        category TEXT,
        habitats TEXT[],
        fun_facts TEXT[]
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS dive_site_species (
        id SERIAL PRIMARY KEY,
        dive_site_id INTEGER REFERENCES dive_sites(id) ON DELETE CASCADE,
        species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
        frequency VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(dive_site_id, species_id)
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        dive_site_id INTEGER REFERENCES dive_sites(id) ON DELETE CASCADE,
        url VARCHAR(255) NOT NULL,
        caption TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        dive_site_id INTEGER REFERENCES dive_sites(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS dive_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        dive_site_id INTEGER REFERENCES dive_sites(id) ON DELETE CASCADE,
        dive_date DATE NOT NULL,
        max_depth INTEGER,
        duration_minutes INTEGER,
        water_temperature INTEGER,
        visibility_meters INTEGER,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      DROP TABLE IF EXISTS nearby_dive_sites CASCADE;
      CREATE TABLE nearby_dive_sites (
        id SERIAL PRIMARY KEY,
        dive_site_id INTEGER REFERENCES dive_sites(id) ON DELETE CASCADE,
        nearby_dive_site_id INTEGER REFERENCES dive_sites(id) ON DELETE CASCADE,
        distance REAL
      );
    `);

    await db.execute(sql`
      DROP TABLE IF EXISTS dive_centers CASCADE;
      CREATE TABLE dive_centers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        dive_site_id INTEGER REFERENCES dive_sites(id) ON DELETE CASCADE,
        certification TEXT,
        description TEXT,
        contact_info TEXT,
        icon_type TEXT
      );
    `);

    await db.execute(sql`
      DROP TABLE IF EXISTS water_conditions CASCADE;
      CREATE TABLE water_conditions (
        id SERIAL PRIMARY KEY,
        dive_site_id INTEGER REFERENCES dive_sites(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        temperature INTEGER,
        visibility INTEGER,
        current_strength TEXT,
        weather_conditions TEXT
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        dive_site_id INTEGER REFERENCES dive_sites(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, dive_site_id)
      );
    `);

    console.log("Database tables created successfully!");

    // Now run the seeding
    const { seedDatabase } = await import("./server/seed-database");
    await seedDatabase();

    console.log("Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
