// Import database and query builder tools
import { db, pool } from './db';
import { eq, and, or, sql, like, isNotNull, gte, lte } from 'drizzle-orm';

// Import schema types and tables
import {
  users, countries, diveSites, species, diveSiteSpecies, photos, reviews,
  nearbyDiveSites, diveCenters, userFavorites, userSpottedSpecies, waterConditions,
  diveMaps, diveLogs, diveLogSpecies, certifications, userCertifications,
  type User, type InsertUser, type Country, type InsertCountry, type DiveSite, type InsertDiveSite,
  type Species, type InsertSpecies, type DiveSiteSpecies, type InsertDiveSiteSpecies,
  type Photo, type InsertPhoto, type Review, type InsertReview,
  type NearbyDiveSite, type InsertNearbyDiveSite, type DiveCenter, type InsertDiveCenter,
  type UserFavorite, type InsertUserFavorite, type UserSpottedSpecies, type InsertUserSpottedSpecies,
  type WaterConditions, type InsertWaterConditions, type DiveMap, type InsertDiveMap,
  type DiveLog, type InsertDiveLog, type DiveLogSpecies, type InsertDiveLogSpecies,
  type Certification, type InsertCertification, type UserCertification, type InsertUserCertification,
  type UpdateProfile
} from "@shared/schema";

// Import the storage interface
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // Country Management
  async getAllCountries(): Promise<Country[]> {
    return await db.select().from(countries).orderBy(countries.name);
  }

  async getCountry(id: number): Promise<Country | undefined> {
    const result = await db.select().from(countries).where(eq(countries.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getCountryByCode(code: string): Promise<Country | undefined> {
    const result = await db.select().from(countries).where(eq(countries.code, code));
    return result.length > 0 ? result[0] : undefined;
  }

  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const result = await db
      .insert(countries)
      .values({
        name: insertCountry.name,
        code: insertCountry.code,
        latitude: insertCountry.latitude ?? null,
        longitude: insertCountry.longitude ?? null
      })
      .returning();
    return result[0];
  }

  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Get Australia's ID as default country (we'll add countries seeding later)
    let countryId = insertUser.countryId;
    if (!countryId) {
      // Default to Australia if no country specified
      const australia = await db.select().from(countries).where(eq(countries.code, 'AU')).limit(1);
      countryId = australia.length > 0 ? australia[0].id : null;
    }

    const result = await db
      .insert(users)
      .values({
        username: `${insertUser.name}_${insertUser.lastname}`.toLowerCase().replace(/\s+/g, '_'), // Generate username from name
        name: insertUser.name || 'User',
        lastname: insertUser.lastname || 'Name',
        email: insertUser.email,
        password: insertUser.password, // This maps to password_hash in DB
        preferredActivity: insertUser.preferredActivity || 'diving',
        profilePicture: insertUser.profilePicture ?? null,
        bio: insertUser.bio ?? null,
        countryId: countryId
      })
      .returning();
    return result[0];
  }

  async getUserWithCountry(id: number): Promise<(User & { country?: Country }) | undefined> {
    try {
      const result = await db
        .select()
        .from(users)
        .leftJoin(countries, eq(users.countryId, countries.id))
        .where(eq(users.id, id));

      if (!result.length) {
        return undefined;
      }

      const row = result[0];
      return {
        id: row.users.id,
        username: row.users.username,
        name: row.users.name,
        lastname: row.users.lastname,
        email: row.users.email,
        password: row.users.password,
        preferredActivity: row.users.preferredActivity,
        profilePicture: row.users.profilePicture,
        bio: row.users.bio,
        countryId: row.users.countryId,
        createdAt: row.users.createdAt,
        updatedAt: row.users.updatedAt,
        country: row.countries ? row.countries : undefined
      };
    } catch (error) {
      console.error('Database error in getUserWithCountry:', error);
      throw error;
    }
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
    // Get species from dive logs (species spotted during logged dives)
    const diveLogSpeciesResults = await db
      .select({
        species: species,
        diveSite: diveSites,
        dateSpotted: diveLogs.diveDate
      })
      .from(diveLogSpecies)
      .innerJoin(
        diveLogs,
        eq(diveLogSpecies.diveLogId, diveLogs.id)
      )
      .innerJoin(
        species,
        eq(diveLogSpecies.speciesId, species.id)
      )
      .innerJoin(
        diveSites,
        eq(diveLogs.diveSiteId, diveSites.id)
      )
      .where(eq(diveLogs.userId, userId));

    // Get species from user spotted species table (general sightings)
    const userSpottedResults = await db
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

    // Combine both results and remove duplicates by species ID
    const allSightings = [...diveLogSpeciesResults, ...userSpottedResults];
    const uniqueSightings = allSightings.filter((sighting, index, self) => 
      index === self.findIndex(s => s.species.id === sighting.species.id)
    );

    return uniqueSightings.map(r => ({ ...r, dateSpotted: r.dateSpotted || new Date() }));
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

  // Dive Logs Management
  async createDiveLog(diveLog: InsertDiveLog): Promise<DiveLog> {
    const result = await db
      .insert(diveLogs)
      .values({
        userId: diveLog.userId,
        diveSiteId: diveLog.diveSiteId,
        diveDate: diveLog.diveDate,
        diveTime: diveLog.diveTime,
        duration: diveLog.duration,
        maxDepth: diveLog.maxDepth,
        avgDepth: diveLog.avgDepth ?? null,
        waterTemp: diveLog.waterTemp ?? null,
        visibility: diveLog.visibility ?? null,
        current: diveLog.current ?? null,
        conditions: diveLog.conditions ?? null,
        description: diveLog.description,
        equipment: diveLog.equipment ?? null,
        certificationLevel: diveLog.certificationLevel ?? null,
        buddyName: diveLog.buddyName ?? null
      })
      .returning();
    return result[0];
  }

  async getDiveLog(id: number): Promise<DiveLog | undefined> {
    const result = await db.select().from(diveLogs).where(eq(diveLogs.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserDiveLogs(userId: number): Promise<any[]> {
    const results = await db
      .select({
        id: diveLogs.id,
        userId: diveLogs.userId,
        diveSiteId: diveLogs.diveSiteId,
        diveDate: diveLogs.diveDate,
        diveTime: diveLogs.diveTime,
        duration: diveLogs.duration,
        maxDepth: diveLogs.maxDepth,
        avgDepth: diveLogs.avgDepth,
        waterTemp: diveLogs.waterTemp,
        visibility: diveLogs.visibility,
        current: diveLogs.current,
        conditions: diveLogs.conditions,
        description: diveLogs.description,
        equipment: diveLogs.equipment,
        certificationLevel: diveLogs.certificationLevel,
        buddyName: diveLogs.buddyName,
        dateLogged: diveLogs.dateLogged,
        diveSite: {
          id: diveSites.id,
          name: diveSites.name,
          location: diveSites.location
        }
      })
      .from(diveLogs)
      .leftJoin(diveSites, eq(diveLogs.diveSiteId, diveSites.id))
      .where(eq(diveLogs.userId, userId))
      .orderBy(sql`${diveLogs.diveDate} DESC`);
    
    return results;
  }

  async getDiveSiteLogs(diveSiteId: number): Promise<DiveLog[]> {
    return await db
      .select()
      .from(diveLogs)
      .where(eq(diveLogs.diveSiteId, diveSiteId))
      .orderBy(sql`${diveLogs.diveDate} DESC`);
  }

  async addSpeciesToDiveLog(diveLogSpeciesData: InsertDiveLogSpecies): Promise<DiveLogSpecies> {
    const result = await db
      .insert(diveLogSpecies)
      .values({
        diveLogId: diveLogSpeciesData.diveLogId,
        speciesId: diveLogSpeciesData.speciesId,
        quantity: diveLogSpeciesData.quantity,
        notes: diveLogSpeciesData.notes ?? null
      })
      .returning();
    return result[0];
  }

  async getDiveLogSpecies(diveLogId: number): Promise<{species: Species, quantity: number, notes: string}[]> {
    const results = await db
      .select({
        species: species,
        quantity: diveLogSpecies.quantity,
        notes: diveLogSpecies.notes
      })
      .from(diveLogSpecies)
      .innerJoin(
        species,
        eq(diveLogSpecies.speciesId, species.id)
      )
      .where(eq(diveLogSpecies.diveLogId, diveLogId));
    
    return results.map(r => ({ ...r, notes: r.notes || '' }));
  }

  async updateDiveLog(id: number, diveLogData: Partial<InsertDiveLog>): Promise<DiveLog | undefined> {
    const result = await db
      .update(diveLogs)
      .set({
        diveSiteId: diveLogData.diveSiteId,
        diveDate: diveLogData.diveDate,
        diveTime: diveLogData.diveTime,
        duration: diveLogData.duration,
        maxDepth: diveLogData.maxDepth,
        avgDepth: diveLogData.avgDepth ?? undefined,
        waterTemp: diveLogData.waterTemp ?? undefined,
        visibility: diveLogData.visibility ?? undefined,
        current: diveLogData.current ?? undefined,
        conditions: diveLogData.conditions ?? undefined,
        description: diveLogData.description,
        equipment: diveLogData.equipment ?? undefined,
        certificationLevel: diveLogData.certificationLevel ?? undefined,
        buddyName: diveLogData.buddyName ?? undefined
      })
      .where(eq(diveLogs.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteDiveLog(id: number): Promise<boolean> {
    // First delete related species sightings
    await db.delete(diveLogSpecies).where(eq(diveLogSpecies.diveLogId, id));
    
    // Then delete the dive log
    const result = await db.delete(diveLogs).where(eq(diveLogs.id, id));
    return result.rowCount !== undefined && result.rowCount > 0;
  }

  // Profile Management
  async updateUserProfile(userId: number, profileData: UpdateProfile): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({
        name: profileData.name,
        lastname: profileData.lastname,
        email: profileData.email,
        preferredActivity: profileData.preferredActivity,
        countryId: profileData.countryId,
        bio: profileData.bio,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  // Certification Management
  async getAllCertifications(): Promise<Certification[]> {
    return await db.select().from(certifications).orderBy(certifications.agency, certifications.name);
  }

  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const result = await db
      .insert(certifications)
      .values(insertCertification)
      .returning();
    return result[0];
  }

  async getUserCertifications(userId: number): Promise<Array<UserCertification & { certification: Certification }>> {
    const results = await db
      .select({
        id: userCertifications.id,
        userId: userCertifications.userId,
        certificationId: userCertifications.certificationId,
        dateObtained: userCertifications.dateObtained,
        certificationNumber: userCertifications.certificationNumber,
        createdAt: userCertifications.createdAt,
        certification: {
          id: certifications.id,
          name: certifications.name,
          agency: certifications.agency,
          description: certifications.description,
          createdAt: certifications.createdAt
        }
      })
      .from(userCertifications)
      .leftJoin(certifications, eq(userCertifications.certificationId, certifications.id))
      .where(eq(userCertifications.userId, userId))
      .orderBy(certifications.agency, certifications.name);

    return results.map(r => ({
      id: r.id,
      userId: r.userId,
      certificationId: r.certificationId,
      dateObtained: r.dateObtained,
      certificationNumber: r.certificationNumber,
      createdAt: r.createdAt,
      certification: r.certification as Certification
    }));
  }

  async addUserCertification(insertUserCertification: InsertUserCertification): Promise<UserCertification> {
    const result = await db
      .insert(userCertifications)
      .values(insertUserCertification)
      .returning();
    return result[0];
  }

  async removeUserCertification(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(userCertifications)
      .where(and(eq(userCertifications.id, id), eq(userCertifications.userId, userId)));
    return result.rowCount !== undefined && result.rowCount > 0;
  }

  async getCertification(id: number): Promise<Certification | undefined> {
    const result = await db.select().from(certifications).where(eq(certifications.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
}

export const storage = new DatabaseStorage();