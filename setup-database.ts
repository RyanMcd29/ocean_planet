import { reseedDatabase } from "./server/seed-database";

async function setupDatabase() {
  console.log("Rebuilding database with fresh seed data...");
  try {
    await reseedDatabase();
    console.log("Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
