// Import database and query builder tools
import { db, pool } from './db';
import { eq, and, or, sql, like, isNotNull, gte, lte } from 'drizzle-orm';

// Import schema types and tables
import {
  users, diveSites, species, diveSiteSpecies, photos, reviews,
  nearbyDiveSites, diveCenters, userFavorites, userSpottedSpecies, diveMaps,
  type User, type InsertUser, type DiveSite, type InsertDiveSite,
  type Species, type InsertSpecies, type DiveSiteSpecies, type InsertDiveSiteSpecies,
  type Photo, type InsertPhoto, type Review, type InsertReview,
  type NearbyDiveSite, type InsertNearbyDiveSite, type DiveCenter, type InsertDiveCenter,
  type UserFavorite, type InsertUserFavorite, type UserSpottedSpecies, type InsertUserSpottedSpecies,
  type DiveMap, type InsertDiveMap
} from "@shared/schema";

// Import the storage interface
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        username: insertUser.username,
        password: insertUser.password,
        email: insertUser.email,
        profilePicture: insertUser.profilePicture ?? null,
        bio: insertUser.bio ?? null
      })
      .returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({
        ...userData,
        profilePicture: userData.profilePicture ?? undefined,
        bio: userData.bio ?? undefined
      })
      .where(eq(users.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  // Dive Site Management
  async createDiveSite(diveSite: InsertDiveSite): Promise<DiveSite> {
    const result = await db
      .insert(diveSites)
      .values({
        name: diveSite.name,
        difficulty: diveSite.difficulty,
        description: diveSite.description,
        location: diveSite.location,
        country: diveSite.country,
        latitude: diveSite.latitude,
        longitude: diveSite.longitude,
        current: diveSite.current ?? null,
        minDepth: diveSite.minDepth ?? null,
        maxDepth: diveSite.maxDepth ?? null,
        visibility: diveSite.visibility ?? null,
        bestTimeToVisit: diveSite.bestTimeToVisit ?? null,
        temperature: diveSite.temperature ?? null,
        marineLifeRichness: diveSite.marineLifeRichness ?? null,
        habitats: diveSite.habitats ?? null
      })
      .returning();
    return result[0];
  }

  async getDiveSite(id: number): Promise<DiveSite | undefined> {
    const result = await db.select().from(diveSites).where(eq(diveSites.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllDiveSites(): Promise<DiveSite[]> {
    try {
      console.log('Starting getAllDiveSites with raw SQL...');
      
      // Use the connection pool directly to bypass any ORM limitations
      const client = await pool.connect();
      const queryResult = await client.query(`
        SELECT id, name, description, location, country, latitude, longitude, difficulty,
               min_depth, max_depth, 
               min_visibility, max_visibility,
               min_temp, max_temp,
               current, best_season, peak_visibility_month,
               conservation_status, conservation_info,
               main_image, highlights, habitats
        FROM dive_sites
        ORDER BY id
      `);
      client.release();
      
      const rawResults = queryResult.rows;
      console.log(`Raw SQL query returned ${rawResults.length} dive sites`);
      console.log('Raw results:', rawResults.map(r => ({ id: r.id, name: r.name })));
      
      // Convert raw results to proper DiveSite objects
      const results = rawResults.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        location: row.location,
        country: row.country,
        latitude: row.latitude,
        longitude: row.longitude,
        difficulty: row.difficulty,
        minDepth: row.min_depth,
        maxDepth: row.max_depth,
        minVisibility: row.min_visibility,
        maxVisibility: row.max_visibility,
        minTemp: row.min_temp,
        maxTemp: row.max_temp,
        current: row.current,
        bestSeason: row.best_season,
        peakVisibilityMonth: row.peak_visibility_month,
        conservationStatus: row.conservation_status,
        conservationInfo: row.conservation_info,
        mainImage: row.main_image,
        highlights: row.highlights || [],
        habitats: row.habitats || []
      })) as DiveSite[];
      
      console.log(`Returning ${results.length} dive sites:`, results.map(r => r.name));
      return results;
    } catch (error) {
      console.error('Error fetching dive sites:', error);
      throw error;
    }
  }

  async searchDiveSites(query: string, filters?: Record<string, any>): Promise<DiveSite[]> {
    let queryBuilder = db.select().from(diveSites);
    
    // Apply text search if provided
    if (query) {
      const lowerQuery = `%${query.toLowerCase()}%`;
      queryBuilder = queryBuilder.where(
        or(
          like(sql`lower(${diveSites.name})`, lowerQuery),
          like(sql`lower(${diveSites.location})`, lowerQuery),
          like(sql`lower(${diveSites.country})`, lowerQuery),
          like(sql`lower(${diveSites.description})`, lowerQuery)
        )
      );
    }
    
    // Apply additional filters if provided
    if (filters) {
      if (filters.region) {
        queryBuilder = queryBuilder.where(eq(diveSites.country, filters.region));
      }
      
      if (filters.difficulty) {
        queryBuilder = queryBuilder.where(eq(diveSites.difficulty, filters.difficulty));
      }
      
      if (filters.minDepth !== undefined) {
        queryBuilder = queryBuilder.where(
          and(
            isNotNull(diveSites.minDepth),
            gte(diveSites.minDepth, filters.minDepth)
          )
        );
      }
      
      if (filters.maxDepth !== undefined) {
        queryBuilder = queryBuilder.where(
          and(
            isNotNull(diveSites.maxDepth),
            lte(diveSites.maxDepth, filters.maxDepth)
          )
        );
      }
    }
    
    return await queryBuilder;
  }

  // Species Management
  async createSpecies(speciesData: InsertSpecies): Promise<Species> {
    const result = await db
      .insert(species)
      .values({
        commonName: speciesData.commonName,
        scientificName: speciesData.scientificName,
        description: speciesData.description ?? null,
        conservationStatus: speciesData.conservationStatus ?? null,
        habitats: speciesData.habitats ?? null,
        imageUrl: speciesData.imageUrl ?? null,
        category: speciesData.category ?? null
      })
      .returning();
    return result[0];
  }

  async getSpecies(id: number): Promise<Species | undefined> {
    const result = await db.select().from(species).where(eq(species.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllSpecies(): Promise<Species[]> {
    return await db.select().from(species);
  }

  async searchSpecies(query: string): Promise<Species[]> {
    if (!query) {
      return this.getAllSpecies();
    }
    
    const lowerQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(species).where(
      or(
        like(sql`lower(${species.commonName})`, lowerQuery),
        like(sql`lower(${species.scientificName})`, lowerQuery),
        and(
          isNotNull(species.description),
          like(sql`lower(${species.description})`, lowerQuery)
        )
      )
    );
  }

  // Dive Site Species Relationships
  async addSpeciesToDiveSite(relation: InsertDiveSiteSpecies): Promise<DiveSiteSpecies> {
    const result = await db
      .insert(diveSiteSpecies)
      .values({
        diveSiteId: relation.diveSiteId,
        speciesId: relation.speciesId,
        frequency: relation.frequency ?? null
      })
      .returning();
    return result[0];
  }

  async getDiveSiteSpecies(diveSiteId: number): Promise<DiveSiteSpecies[]> {
    return await db
      .select()
      .from(diveSiteSpecies)
      .where(eq(diveSiteSpecies.diveSiteId, diveSiteId));
  }

  async getSpeciesByDiveSite(diveSiteId: number): Promise<{ species: Species, frequency: string }[]> {
    const results = await db
      .select({
        species: species,
        frequency: diveSiteSpecies.frequency
      })
      .from(diveSiteSpecies)
      .innerJoin(
        species,
        eq(diveSiteSpecies.speciesId, species.id)
      )
      .where(eq(diveSiteSpecies.diveSiteId, diveSiteId));
    
    return results.map(result => ({
      species: result.species,
      frequency: result.frequency || 'Unknown'
    }));
  }

  // Photo Uploads
  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const result = await db
      .insert(photos)
      .values({
        userId: photo.userId,
        diveSiteId: photo.diveSiteId,
        imageUrl: photo.imageUrl,
        caption: photo.caption ?? null,
        dateUploaded: new Date(),
        speciesTags: photo.speciesTags ?? null
      })
      .returning();
    return result[0];
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    const result = await db.select().from(photos).where(eq(photos.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getDiveSitePhotos(diveSiteId: number): Promise<Photo[]> {
    return await db
      .select()
      .from(photos)
      .where(eq(photos.diveSiteId, diveSiteId));
  }

  async getUserPhotos(userId: number): Promise<Photo[]> {
    return await db
      .select()
      .from(photos)
      .where(eq(photos.userId, userId));
  }

  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    const result = await db
      .insert(reviews)
      .values({
        userId: review.userId,
        diveSiteId: review.diveSiteId,
        rating: review.rating,
        comment: review.comment ?? null,
        datePosted: new Date()
      })
      .returning();
    return result[0];
  }

  async getDiveSiteReviews(diveSiteId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.diveSiteId, diveSiteId));
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId));
  }

  // Nearby Dive Sites
  async addNearbyDiveSite(relation: InsertNearbyDiveSite): Promise<NearbyDiveSite> {
    const result = await db
      .insert(nearbyDiveSites)
      .values({
        diveSiteId: relation.diveSiteId,
        nearbyDiveSiteId: relation.nearbyDiveSiteId,
        distance: relation.distance ?? null
      })
      .returning();
    return result[0];
  }

  async getNearbyDiveSites(diveSiteId: number): Promise<{ diveSite: DiveSite, distance: number }[]> {
    const results = await db
      .select({
        diveSite: diveSites,
        distance: nearbyDiveSites.distance
      })
      .from(nearbyDiveSites)
      .innerJoin(
        diveSites,
        eq(nearbyDiveSites.nearbyDiveSiteId, diveSites.id)
      )
      .where(eq(nearbyDiveSites.diveSiteId, diveSiteId));
    
    return results.map(result => ({
      diveSite: result.diveSite,
      distance: result.distance || 0
    }));
  }

  // Dive Centers
  async createDiveCenter(diveCenter: InsertDiveCenter): Promise<DiveCenter> {
    const result = await db
      .insert(diveCenters)
      .values({
        name: diveCenter.name,
        diveSiteId: diveCenter.diveSiteId,
        description: diveCenter.description ?? null,
        certification: diveCenter.certification ?? null,
        contactInfo: diveCenter.contactInfo ?? null,
        iconType: diveCenter.iconType ?? null
      })
      .returning();
    return result[0];
  }

  async getDiveCentersByDiveSite(diveSiteId: number): Promise<DiveCenter[]> {
    return await db
      .select()
      .from(diveCenters)
      .where(eq(diveCenters.diveSiteId, diveSiteId));
  }

  // User Favorites
  async addFavoriteDiveSite(favorite: InsertUserFavorite): Promise<UserFavorite> {
    const result = await db
      .insert(userFavorites)
      .values({
        userId: favorite.userId,
        diveSiteId: favorite.diveSiteId,
        dateAdded: new Date(),
        notes: favorite.notes ?? null
      })
      .returning();
    return result[0];
  }

  async removeFavoriteDiveSite(userId: number, diveSiteId: number): Promise<boolean> {
    const result = await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.diveSiteId, diveSiteId)
        )
      );
    
    // We'll just return true if the operation was successful
    return true;
  }

  async getUserFavoriteDiveSites(userId: number): Promise<DiveSite[]> {
    const results = await db
      .select({
        diveSite: diveSites
      })
      .from(userFavorites)
      .innerJoin(
        diveSites,
        eq(userFavorites.diveSiteId, diveSites.id)
      )
      .where(eq(userFavorites.userId, userId));
    
    return results.map(result => result.diveSite);
  }

  // User Spotted Species
  async addSpottedSpecies(spotted: InsertUserSpottedSpecies): Promise<UserSpottedSpecies> {
    const result = await db
      .insert(userSpottedSpecies)
      .values({
        userId: spotted.userId,
        diveSiteId: spotted.diveSiteId,
        speciesId: spotted.speciesId,
        dateSpotted: new Date(),
        photoId: spotted.photoId ?? null,
        notes: spotted.notes ?? null
      })
      .returning();
    return result[0];
  }

  async getUserSpottedSpecies(userId: number): Promise<{ species: Species, diveSite: DiveSite, dateSpotted: Date }[]> {
    const results = await db
      .select({
        species: species,
        diveSite: diveSites,
        dateSpotted: userSpottedSpecies.dateSpotted
      })
      .from(userSpottedSpecies)
      .innerJoin(
        species,
        eq(userSpottedSpecies.speciesId, species.id)
      )
      .innerJoin(
        diveSites,
        eq(userSpottedSpecies.diveSiteId, diveSites.id)
      )
      .where(eq(userSpottedSpecies.userId, userId));
    
    // Force non-null dateSpotted since we've set it as a Date when inserting
    return results.map(r => ({ ...r, dateSpotted: r.dateSpotted || new Date() }));
  }

  // Dive Maps Management
  async createDiveMap(diveMap: InsertDiveMap): Promise<DiveMap> {
    const result = await db.insert(diveMaps).values(diveMap).returning();
    return result[0];
  }

  async getDiveMaps(diveSiteId: number): Promise<DiveMap[]> {
    return db
      .select()
      .from(diveMaps)
      .where(eq(diveMaps.diveSiteId, diveSiteId))
      .orderBy(sql`${diveMaps.uploadedAt} DESC`);
  }
}