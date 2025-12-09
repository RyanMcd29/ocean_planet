import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real, date, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Countries table
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(), // ISO country codes (AU, US, etc.)
  latitude: real("latitude"), // For future map centering
  longitude: real("longitude"), // For future map centering
});

// User account table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username"), // Keep for backward compatibility
  name: text("name"),
  lastname: text("lastname"),
  email: text("email").notNull().unique(),
  password: text("password_hash").notNull(), // Match actual DB column
  preferredActivity: text("preferred_activity"), // 'diving', 'freediving', 'snorkeling', 'other'
  profilePicture: text("profile_image_url"), // Match actual DB column
  bio: text("bio"),
  countryId: integer("country_id"), // Foreign key to countries table
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ one }) => ({
  country: one(countries, {
    fields: [users.countryId],
    references: [countries.id],
  }),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  users: many(users),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Registration schema with validation
export const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(8),
  countryId: z.number().optional(), // Optional, will default to Australia
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // Password strength validation
  const hasUpperCase = /[A-Z]/.test(data.password);
  const hasLowerCase = /[a-z]/.test(data.password);
  const hasNumbers = /\d/.test(data.password);
  return hasUpperCase && hasLowerCase && hasNumbers;
}, {
  message: "Password must contain uppercase, lowercase, and number",
  path: ["password"],
}).refine((data) => {
  // Name validation
  return data.name && data.name.length >= 2 && data.name.length <= 50;
}, {
  message: "Name must be 2-50 characters",
  path: ["name"],
}).refine((data) => {
  // Last name validation
  return data.lastname && data.lastname.length >= 2 && data.lastname.length <= 50;
}, {
  message: "Last name must be 2-50 characters",
  path: ["lastname"],
}).refine((data) => {
  // Preferred activity validation
  return data.preferredActivity && ['diving', 'freediving', 'snorkeling', 'other'].includes(data.preferredActivity);
}, {
  message: "Invalid preferred activity",
  path: ["preferredActivity"],
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
  accessType: text("access_type"), // Shore, Boat, Live-aboard, etc.
  entryConditions: text("entry_conditions"),
  surgeConditions: text("surge_conditions"),
  seasonalEvents: text("seasonal_events"),
  uniqueFeatures: text("unique_features"),
  userExperienceNotes: text("user_experience_notes"),
  diveSiteLayout: text("dive_site_layout"),
  conservationPark: text("conservation_park"),
  linkedLessonId: text("linked_lesson_id"),
});

export const insertDiveSiteSchema = createInsertSchema(diveSites).omit({
  id: true,
});

// Central image storage for seed and user uploads
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  alt: text("alt"),
  userId: integer("user_id"),
  source: text("source").default("seed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
});

// Marine species information table
export const species = pgTable("species", {
  id: serial("id").primaryKey(),
  commonName: text("common_name").notNull(),
  scientificName: text("scientific_name").notNull(),
  description: text("description"),
  conservationStatus: text("conservation_status"),
  category: text("category"), // Fish, Mammal, Reptile, Invertebrate, Coral, etc.
  habitats: text("habitats").array(),
  funFacts: text("fun_facts").array(),
  primaryImageId: integer("primary_image_id"),
  
  // Taxonomic classification
  domain: text("domain"),
  kingdom: text("kingdom"),
  phylum: text("phylum"),
  class: text("class"),
  order: text("order"),
  family: text("family"),
  genus: text("genus"),
  
  // Geographic and ecological data
  regionFound: text("region_found"),
  tags: text("tags").array(),
  diveSiteAreas: text("dive_site_areas").array(),
  seasonalOccurrence: text("seasonal_occurrence"),
  
  // Educational content
  keyFacts: jsonb("key_facts"), // {title: string, summary: string, details?: string, subPoints?: string[]}[]
  miniLessonRecommendations: text("mini_lesson_recommendations"),
});

// Zod schema for keyFacts structure
export const keyFactSchema = z.object({
  title: z.string(),
  summary: z.string(),
  details: z.string().optional(),
  subPoints: z.array(z.string()).optional(),
});

export const insertSpeciesSchema = createInsertSchema(species).omit({
  id: true,
}).extend({
  keyFacts: z.array(keyFactSchema).optional(),
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

// Species image relationships (many images per species, optional primary)
export const speciesImages = pgTable("species_images", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").notNull(),
  imageId: integer("image_id").notNull(),
  isPrimary: boolean("is_primary").default(false),
});

export const insertSpeciesImageSchema = createInsertSchema(speciesImages).omit({
  id: true,
});

// Photo uploads table
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  diveSiteId: integer("dive_site_id").notNull(),
  imageId: integer("image_id"),
  url: text("url"),
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

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;

// Species records do not store an image_url column anymore; imageUrl is derived from linked images.
export type Species = typeof species.$inferSelect & { imageUrl: string | null };
export type InsertSpecies = z.infer<typeof insertSpeciesSchema>;

export type DiveSiteSpecies = typeof diveSiteSpecies.$inferSelect;
export type InsertDiveSiteSpecies = z.infer<typeof insertDiveSiteSpeciesSchema>;

export type SpeciesImage = typeof speciesImages.$inferSelect;
export type InsertSpeciesImage = z.infer<typeof insertSpeciesImageSchema>;

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

// Lesson and course content
export interface LessonSource {
  title: string;
  url: string;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LessonStep {
  type: 'intro' | 'text' | 'image' | 'funFact' | 'quiz' | 'finalQuiz' | 'conclusion' | 'sources';
  title: string;
  content: string;
  image?: string;
  caption?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  highlight?: string;
  icon?: string;
  sources?: LessonSource[];
  questions?: LessonQuizQuestion[];
}

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(), // reuse stable lesson slugs from enhanced lessons
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  duration: integer("duration"),
  difficulty: text("difficulty").notNull(),
  steps: jsonb("steps").$type<LessonStep[]>().notNull(),
  thumbnail: text("thumbnail"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: text("difficulty"),
  category: text("category"),
  estimatedDuration: integer("estimated_duration"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courseLessons = pgTable("course_lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  lessonId: text("lesson_id").notNull().references(() => lessons.id),
  order: integer("order").default(0),
}, (table) => ({
  courseLessonUnique: unique().on(table.courseId, table.lessonId),
}));

export const speciesLessons = pgTable("species_lessons", {
  id: serial("id").primaryKey(),
  speciesId: integer("species_id").notNull().references(() => species.id),
  lessonId: text("lesson_id").notNull().references(() => lessons.id),
}, (table) => ({
  speciesLessonUnique: unique().on(table.speciesId, table.lessonId),
}));

export const diveSiteLessons = pgTable("dive_site_lessons", {
  id: serial("id").primaryKey(),
  diveSiteId: integer("dive_site_id").notNull().references(() => diveSites.id),
  lessonId: text("lesson_id").notNull().references(() => lessons.id),
}, (table) => ({
  diveSiteLessonUnique: unique().on(table.diveSiteId, table.lessonId),
}));

export const insertLessonSchema = createInsertSchema(lessons).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseLessonSchema = createInsertSchema(courseLessons).omit({
  id: true,
});

export const insertSpeciesLessonSchema = createInsertSchema(speciesLessons).omit({
  id: true,
});

export const insertDiveSiteLessonSchema = createInsertSchema(diveSiteLessons).omit({
  id: true,
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type CourseLesson = typeof courseLessons.$inferSelect;
export type InsertCourseLesson = z.infer<typeof insertCourseLessonSchema>;
export type SpeciesLesson = typeof speciesLessons.$inferSelect;
export type InsertSpeciesLesson = z.infer<typeof insertSpeciesLessonSchema>;
export type DiveSiteLesson = typeof diveSiteLessons.$inferSelect;
export type InsertDiveSiteLesson = z.infer<typeof insertDiveSiteLessonSchema>;

export const lessonsRelations = relations(lessons, ({ many }) => ({
  courseLinks: many(courseLessons),
  speciesLinks: many(speciesLessons),
  diveSiteLinks: many(diveSiteLessons),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(courseLessons),
}));

export const courseLessonsRelations = relations(courseLessons, ({ one }) => ({
  course: one(courses, {
    fields: [courseLessons.courseId],
    references: [courses.id],
  }),
  lesson: one(lessons, {
    fields: [courseLessons.lessonId],
    references: [lessons.id],
  }),
}));

export const speciesLessonsRelations = relations(speciesLessons, ({ one }) => ({
  species: one(species, {
    fields: [speciesLessons.speciesId],
    references: [species.id],
  }),
  lesson: one(lessons, {
    fields: [speciesLessons.lessonId],
    references: [lessons.id],
  }),
}));

export const diveSiteLessonsRelations = relations(diveSiteLessons, ({ one }) => ({
  diveSite: one(diveSites, {
    fields: [diveSiteLessons.diveSiteId],
    references: [diveSites.id],
  }),
  lesson: one(lessons, {
    fields: [diveSiteLessons.lessonId],
    references: [lessons.id],
  }),
}));

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export type LoginData = z.infer<typeof loginSchema>;

// Countries schema and types
export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;

// Certifications table - master list of all available diving certifications
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Open Water Diver"
  agency: text("agency").notNull(), // e.g., "PADI", "SSI", "SDI", "TDI"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User certifications table - tracks which certifications each user has
export const userCertifications = pgTable("user_certifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  certificationId: integer("certification_id").notNull(),
  dateObtained: date("date_obtained"), // nullable - user might not remember
  certificationNumber: text("certification_number"), // nullable 
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Prevent duplicate certifications for the same user
  userCertificationUnique: unique().on(table.userId, table.certificationId),
}));

// Define relations for certifications
export const certificationsRelations = relations(certifications, ({ many }) => ({
  userCertifications: many(userCertifications),
}));

export const userCertificationsRelations = relations(userCertifications, ({ one }) => ({
  user: one(users, {
    fields: [userCertifications.userId],
    references: [users.id],
  }),
  certification: one(certifications, {
    fields: [userCertifications.certificationId],
    references: [certifications.id],
  }),
}));

// Certification schemas and types
export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
  createdAt: true,
});

export const insertUserCertificationSchema = createInsertSchema(userCertifications).omit({
  id: true,
  createdAt: true,
});

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;

export type UserCertification = typeof userCertifications.$inferSelect;
export type InsertUserCertification = z.infer<typeof insertUserCertificationSchema>;

// Profile update schema - for editing user information
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  preferredActivity: z.enum(['diving', 'freediving', 'snorkeling', 'other']),
  countryId: z.number().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// Lesson progress table - tracks completed lessons for each user
export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: text("lesson_id").notNull().references(() => lessons.id), // e.g., "bunbury-bottlenose-dolphins"
  completedAt: timestamp("completed_at").defaultNow().notNull(),
}, (table) => ({
  // Prevent duplicate completion records for the same lesson
  userLessonUnique: unique().on(table.userId, table.lessonId),
}));

// Category badges table - tracks earned badges when users complete all lessons in a category
export const categoryBadges = pgTable("category_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(), // e.g., "marine-mammals"
  badgeName: text("badge_name").notNull(), // e.g., "Whale Expert"
  badgeIcon: text("badge_icon").notNull(), // e.g., "🐋"
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
}, (table) => ({
  // Prevent duplicate badges for the same category
  userCategoryBadgeUnique: unique().on(table.userId, table.category),
}));

// Define relations for lesson progress
export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [lessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
}));

// Define relations for category badges
export const categoryBadgesRelations = relations(categoryBadges, ({ one }) => ({
  user: one(users, {
    fields: [categoryBadges.userId],
    references: [users.id],
  }),
}));

// Lesson progress schemas and types
export const insertLessonProgressSchema = createInsertSchema(lessonProgress).omit({
  id: true,
  completedAt: true,
});

export const insertCategoryBadgeSchema = createInsertSchema(categoryBadges).omit({
  id: true,
  unlockedAt: true,
});

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;

export type CategoryBadge = typeof categoryBadges.$inferSelect;
export type InsertCategoryBadge = z.infer<typeof insertCategoryBadgeSchema>;

// Community Posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  photoUrl: text("photo_url"),
  tags: text("tags").array(), // 'Dive report', 'Question', 'Ocean fact', 'Gear chat'
  location: text("location"),
  diveSiteId: integer("dive_site_id"),
  speciesSpotted: text("species_spotted").array(),
  linkedLessonId: text("linked_lesson_id"), // For sharing lessons
  primaryImageId: integer("primary_image_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Post likes table
export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userPostLikeUnique: unique().on(table.userId, table.postId),
}));

// Post comments table
export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Creator
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Dive Trip', 'Beach Clean up', 'Talk / Lecture', 'Film Festival/ Film Night', 'Workshop', 'Other'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location").notNull(),
  city: text("city"),
  diveSiteId: integer("dive_site_id"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  organizerName: text("organizer_name").notNull(),
  description: text("description").notNull(),
  externalLink: text("external_link"),
  cost: text("cost"), // 'Free' or '$' text field
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations for posts
export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  diveSite: one(diveSites, {
    fields: [posts.diveSiteId],
    references: [diveSites.id],
  }),
  likes: many(postLikes),
  comments: many(postComments),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
}));

// Post image attachments
export const postImages = pgTable("post_images", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  imageId: integer("image_id").notNull(),
});

export const insertPostImageSchema = createInsertSchema(postImages).omit({
  id: true,
});

// Post-to-species links
export const postSpecies = pgTable("post_species", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  speciesId: integer("species_id").notNull(),
});

export const insertPostSpeciesSchema = createInsertSchema(postSpecies).omit({
  id: true,
});

// Define relations for events
export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
  diveSite: one(diveSites, {
    fields: [events.diveSiteId],
    references: [diveSites.id],
  }),
}));

// Posts schemas and types
export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostLikeSchema = createInsertSchema(postLikes).omit({
  id: true,
  createdAt: true,
});

export const insertPostCommentSchema = createInsertSchema(postComments).omit({
  id: true,
  createdAt: true,
});

// Events schemas and types
export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type PostImage = typeof postImages.$inferSelect;
export type InsertPostImage = z.infer<typeof insertPostImageSchema>;

export type PostSpecies = typeof postSpecies.$inferSelect;
export type InsertPostSpecies = z.infer<typeof insertPostSpeciesSchema>;

export type PostLike = typeof postLikes.$inferSelect;
export type InsertPostLike = z.infer<typeof insertPostLikeSchema>;

export type PostComment = typeof postComments.$inferSelect;
export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
