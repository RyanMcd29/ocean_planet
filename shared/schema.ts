import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User account table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Dive site information table
export const diveSites = pgTable("dive_sites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  country: text("country").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  difficulty: text("difficulty").notNull(), // Beginner, Intermediate, Advanced, Expert
  minDepth: integer("min_depth"), // in meters
  maxDepth: integer("max_depth"), // in meters
  minVisibility: integer("min_visibility"), // in meters
  maxVisibility: integer("max_visibility"), // in meters
  minTemp: integer("min_temp"), // in celsius
  maxTemp: integer("max_temp"), // in celsius
  current: text("current"), // None, Mild, Moderate, Strong
  bestSeason: text("best_season"),
  peakVisibilityMonth: text("peak_visibility_month"),
  conservationStatus: text("conservation_status"),
  conservationInfo: text("conservation_info"),
  mainImage: text("main_image"),
  highlights: text("highlights").array(),
  habitats: text("habitats").array(),
});

export const insertDiveSiteSchema = createInsertSchema(diveSites).omit({
  id: true,
});

// Marine species information table
export const species = pgTable("species", {
  id: serial("id").primaryKey(),
  commonName: text("common_name").notNull(),
  scientificName: text("scientific_name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  conservationStatus: text("conservation_status"),
  category: text("category"), // Fish, Mammal, Reptile, Invertebrate, Coral, etc.
  habitats: text("habitats").array(),
  funFacts: text("fun_facts").array(),
});

export const insertSpeciesSchema = createInsertSchema(species).omit({
  id: true,
});

// Dive site species relationship table
export const diveSiteSpecies = pgTable("dive_site_species", {
  id: serial("id").primaryKey(),
  diveSiteId: integer("dive_site_id").notNull(),
  speciesId: integer("species_id").notNull(),
  frequency: text("frequency"), // Common, Uncommon, Rare
});

export const insertDiveSiteSpeciesSchema = createInsertSchema(diveSiteSpecies).omit({
  id: true,
});

// Photo uploads table
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  diveSiteId: integer("dive_site_id").notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  dateUploaded: timestamp("date_uploaded").defaultNow(),
  speciesTags: jsonb("species_tags"), // Array of species IDs tagged in the photo
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  dateUploaded: true,
});

// Dive site reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  diveSiteId: integer("dive_site_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  datePosted: timestamp("date_posted").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  datePosted: true,
});

// Nearby dive sites relationship
export const nearbyDiveSites = pgTable("nearby_dive_sites", {
  id: serial("id").primaryKey(),
  diveSiteId: integer("dive_site_id").notNull(),
  nearbyDiveSiteId: integer("nearby_dive_site_id").notNull(),
  distance: real("distance"), // in kilometers
});

export const insertNearbyDiveSiteSchema = createInsertSchema(nearbyDiveSites).omit({
  id: true,
});

// Dive centers information
export const diveCenters = pgTable("dive_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  diveSiteId: integer("dive_site_id").notNull(),
  certification: text("certification"),
  description: text("description"),
  contactInfo: text("contact_info"),
  iconType: text("icon_type"), // For UI representation
});

export const insertDiveCenterSchema = createInsertSchema(diveCenters).omit({
  id: true,
});

// User favorite dive sites
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  diveSiteId: integer("dive_site_id").notNull(),
  dateAdded: timestamp("date_added").defaultNow(),
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  dateAdded: true,
});

// User spotted species
export const userSpottedSpecies = pgTable("user_spotted_species", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  speciesId: integer("species_id").notNull(),
  diveSiteId: integer("dive_site_id").notNull(),
  dateSpotted: timestamp("date_spotted").defaultNow(),
  photoId: integer("photo_id"),
  notes: text("notes"),
});

export const insertUserSpottedSpeciesSchema = createInsertSchema(userSpottedSpecies).omit({
  id: true,
  dateSpotted: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DiveSite = typeof diveSites.$inferSelect;
export type InsertDiveSite = z.infer<typeof insertDiveSiteSchema>;

export type Species = typeof species.$inferSelect;
export type InsertSpecies = z.infer<typeof insertSpeciesSchema>;

export type DiveSiteSpecies = typeof diveSiteSpecies.$inferSelect;
export type InsertDiveSiteSpecies = z.infer<typeof insertDiveSiteSpeciesSchema>;

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type NearbyDiveSite = typeof nearbyDiveSites.$inferSelect;
export type InsertNearbyDiveSite = z.infer<typeof insertNearbyDiveSiteSchema>;

export type DiveCenter = typeof diveCenters.$inferSelect;
export type InsertDiveCenter = z.infer<typeof insertDiveCenterSchema>;

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;

export type UserSpottedSpecies = typeof userSpottedSpecies.$inferSelect;
export type InsertUserSpottedSpecies = z.infer<typeof insertUserSpottedSpeciesSchema>;

// Water conditions tracking table
export const waterConditions = pgTable("water_conditions", {
  id: serial("id").primaryKey(),
  diveSiteId: integer("dive_site_id").notNull().references(() => diveSites.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  waterTemp: real("water_temp"), // in celsius
  visibility: real("visibility"), // in meters
  currentStrength: text("current_strength"), // None, Light, Moderate, Strong
  currentDirection: text("current_direction"), // N, NE, E, SE, S, SW, W, NW
  waveHeight: real("wave_height"), // in meters
  windSpeed: real("wind_speed"), // in km/h
  windDirection: text("wind_direction"), // N, NE, E, SE, S, SW, W, NW
  weatherConditions: text("weather_conditions"), // Sunny, Partly Cloudy, Cloudy, Rainy, Stormy
  surfaceConditions: text("surface_conditions"), // Calm, Choppy, Rough
  divingConditions: text("diving_conditions"), // Excellent, Good, Fair, Poor, Dangerous
  reportedBy: text("reported_by"), // Manual, WeatherAPI, SensorNetwork
  additionalNotes: text("additional_notes"),
});

export const insertWaterConditionsSchema = createInsertSchema(waterConditions).omit({
  id: true,
  timestamp: true,
});

export type WaterConditions = typeof waterConditions.$inferSelect;
export type InsertWaterConditions = z.infer<typeof insertWaterConditionsSchema>;

// Dive logs table - tracks individual dives by users
export const diveLogs = pgTable("dive_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  diveSiteId: integer("dive_site_id").notNull(),
  diveDate: timestamp("dive_date").notNull(),
  diveTime: text("dive_time").notNull(), // Start time in HH:MM format
  duration: integer("duration").notNull(), // Duration in minutes
  maxDepth: real("max_depth").notNull(), // Maximum depth reached in meters
  avgDepth: real("avg_depth"), // Average depth in meters
  waterTemp: real("water_temp"), // Water temperature in celsius
  visibility: real("visibility"), // Visibility in meters
  current: text("current"), // None, Light, Moderate, Strong
  conditions: text("conditions"), // Excellent, Good, Fair, Poor
  description: text("description"), // User's dive experience description
  equipment: text("equipment"), // Equipment used (tank type, wetsuit, etc.)
  certificationLevel: text("certification_level"), // Open Water, Advanced, etc.
  buddyName: text("buddy_name"), // Dive buddy's name
  dateLogged: timestamp("date_logged").defaultNow(),
});

export const insertDiveLogSchema = createInsertSchema(diveLogs).omit({
  id: true,
  dateLogged: true,
});

// Dive log species sightings - tracks species seen during specific dives
export const diveLogSpecies = pgTable("dive_log_species", {
  id: serial("id").primaryKey(),
  diveLogId: integer("dive_log_id").notNull(),
  speciesId: integer("species_id").notNull(),
  quantity: integer("quantity"), // How many were seen
  notes: text("notes"), // Additional notes about the sighting
});

export const insertDiveLogSpeciesSchema = createInsertSchema(diveLogSpecies).omit({
  id: true,
});

export type DiveLog = typeof diveLogs.$inferSelect;
export type InsertDiveLog = z.infer<typeof insertDiveLogSchema>;

// Dive maps table - user-uploaded dive site maps and route guides
export const diveMaps = pgTable("dive_maps", {
  id: serial("id").primaryKey(),
  diveSiteId: integer("dive_site_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  uploadedBy: integer("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertDiveMapSchema = createInsertSchema(diveMaps).omit({
  id: true,
  uploadedAt: true,
});

export type DiveMap = typeof diveMaps.$inferSelect;
export type InsertDiveMap = z.infer<typeof insertDiveMapSchema>;
export type DiveLogSpecies = typeof diveLogSpecies.$inferSelect;
export type InsertDiveLogSpecies = z.infer<typeof insertDiveLogSpeciesSchema>;
