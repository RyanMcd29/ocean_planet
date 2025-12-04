// Import database and query builder tools
import { db, pool } from './db';
import { eq, and, or, sql, like, isNotNull, gte, lte, inArray } from 'drizzle-orm';

// Import schema types and tables
import {
  users, countries, diveSites, species, diveSiteSpecies, photos, reviews,
  nearbyDiveSites, diveCenters, userFavorites, userSpottedSpecies, waterConditions,
  diveMaps, diveLogs, diveLogSpecies, certifications, userCertifications, lessonProgress, categoryBadges,
  posts, postLikes, postComments, events, images, speciesImages, postImages, postSpecies,
  type User, type InsertUser, type Country, type InsertCountry, type DiveSite, type InsertDiveSite,
  type Species, type InsertSpecies, type DiveSiteSpecies, type InsertDiveSiteSpecies,
  type Photo, type InsertPhoto, type Review, type InsertReview,
  type NearbyDiveSite, type InsertNearbyDiveSite, type DiveCenter, type InsertDiveCenter,
  type UserFavorite, type InsertUserFavorite, type UserSpottedSpecies, type InsertUserSpottedSpecies,
  type WaterConditions, type InsertWaterConditions, type DiveMap, type InsertDiveMap,
  type DiveLog, type InsertDiveLog, type DiveLogSpecies, type InsertDiveLogSpecies,
  type Certification, type InsertCertification, type UserCertification, type InsertUserCertification,
  type UpdateProfile, type LessonProgress, type InsertLessonProgress,
  type CategoryBadge, type InsertCategoryBadge,
  type Post, type InsertPost, type PostLike, type InsertPostLike,
  type PostComment, type InsertPostComment, type Event, type InsertEvent,
  type Image, type InsertImage, type SpeciesImage, type InsertSpeciesImage,
  type PostImage, type InsertPostImage, type PostSpecies, type InsertPostSpecies
} from "@shared/schema";

// Import the storage interface
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // Ensure species records always return a usable image URL from the central images table
  private async attachImagesToSpeciesList(items: Species[]): Promise<Species[]> {
    if (items.length === 0) return [];

    const speciesIds = items.map((sp) => sp.id);
    const imageRows = await db
      .select({
        speciesId: speciesImages.speciesId,
        image: images,
        isPrimary: speciesImages.isPrimary,
      })
      .from(speciesImages)
      .leftJoin(images, eq(speciesImages.imageId, images.id))
      .where(inArray(speciesImages.speciesId, speciesIds));

    const grouped = new Map<number, { image: Image | null; isPrimary: boolean }[]>();
    for (const row of imageRows) {
      const list = grouped.get(row.speciesId) ?? [];
      list.push({ image: row.image ?? null, isPrimary: !!row.isPrimary });
      grouped.set(row.speciesId, list);
    }

    return items.map((sp) => {
      const linked = grouped.get(sp.id) ?? [];
      const primary = linked.find((row) => row.isPrimary && row.image) ?? linked.find((row) => row.image);
      const imageUrl = sp.imageUrl || primary?.image?.url || null;
      const primaryImageId = sp.primaryImageId ?? primary?.image?.id ?? null;
      return { ...sp, imageUrl, primaryImageId } as Species;
    });
  }

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
      console.log('=== getUserWithCountry called with ID:', id);
      
      // First get user directly to see if it exists
      const userOnly = await db.select().from(users).where(eq(users.id, id));
      console.log('Direct user query result:', userOnly);
      
      if (!userOnly.length) {
        console.log('No user found with ID:', id);
        return undefined;
      }

      const user = userOnly[0];
      console.log('Found user:', user);

      // Now get country if user has countryId
      let country = undefined;
      if (user.countryId) {
        console.log('Getting country for countryId:', user.countryId);
        const countryResult = await db.select().from(countries).where(eq(countries.id, user.countryId));
        country = countryResult.length > 0 ? countryResult[0] : undefined;
        console.log('Country result:', country);
      }

      const result = {
        ...user,
        country
      };
      
      console.log('Returning final result:', result);
      return result;
    } catch (error) {
      console.error('=== Database error in getUserWithCountry ===');
      console.error('Error:', error);
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
        minVisibility: diveSite.minVisibility ?? null,
        maxVisibility: diveSite.maxVisibility ?? null,
        minTemp: diveSite.minTemp ?? null,
        maxTemp: diveSite.maxTemp ?? null,
        bestSeason: diveSite.bestSeason ?? null,
        peakVisibilityMonth: diveSite.peakVisibilityMonth ?? null,
        conservationStatus: diveSite.conservationStatus ?? null,
        conservationInfo: diveSite.conservationInfo ?? null,
        mainImage: diveSite.mainImage ?? null,
        highlights: diveSite.highlights ?? null,
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
    const [created] = await db
      .insert(species)
      .values({
        commonName: speciesData.commonName,
        scientificName: speciesData.scientificName,
        description: speciesData.description ?? null,
        conservationStatus: speciesData.conservationStatus ?? null,
        habitats: speciesData.habitats ?? null,
        imageUrl: speciesData.imageUrl ?? null,
        category: speciesData.category ?? null,
        primaryImageId: speciesData.primaryImageId ?? null
      })
      .returning();

    let speciesRecord = created;

    // If a new image URL was provided, mirror it into the central images table
    if (!speciesData.primaryImageId && speciesData.imageUrl) {
      const [image] = await db
        .insert(images)
        .values({
          url: speciesData.imageUrl,
          alt: speciesData.commonName,
          source: 'seed',
        })
        .returning();

      await db.insert(speciesImages).values({
        speciesId: created.id,
        imageId: image.id,
        isPrimary: true,
      });

      const [updated] = await db
        .update(species)
        .set({ primaryImageId: image.id })
        .where(eq(species.id, created.id))
        .returning();

      speciesRecord = updated;
    } else if (speciesData.primaryImageId) {
      await db.insert(speciesImages).values({
        speciesId: created.id,
        imageId: speciesData.primaryImageId,
        isPrimary: true,
      });
    }

    return speciesRecord;
  }

  async getSpecies(id: number): Promise<Species | undefined> {
    const result = await db.select().from(species).where(eq(species.id, id));
    if (!result.length) return undefined;
    const [withImage] = await this.attachImagesToSpeciesList([result[0]]);
    return withImage;
  }

  async getAllSpecies(): Promise<Species[]> {
    const records = await db.select().from(species);
    return this.attachImagesToSpeciesList(records);
  }

  async searchSpecies(query: string): Promise<Species[]> {
    if (!query) {
      return this.getAllSpecies();
    }
    
    const lowerQuery = `%${query.toLowerCase()}%`;
    const results = await db.select().from(species).where(
      or(
        like(sql`lower(${species.commonName})`, lowerQuery),
        like(sql`lower(${species.scientificName})`, lowerQuery),
        and(
          isNotNull(species.description),
          like(sql`lower(${species.description})`, lowerQuery)
        )
      )
    );

    return this.attachImagesToSpeciesList(results);
  }

  async getSpeciesImages(speciesId: number): Promise<Image[]> {
    const rows = await db
      .select({
        image: images,
      })
      .from(speciesImages)
      .leftJoin(images, eq(speciesImages.imageId, images.id))
      .where(eq(speciesImages.speciesId, speciesId));

    return rows
      .map((row) => row.image)
      .filter((img): img is Image => Boolean(img));
  }

  async addSpeciesImage(link: InsertSpeciesImage): Promise<SpeciesImage> {
    const [record] = await db.insert(speciesImages).values(link).returning();

    const [image] = await db.select().from(images).where(eq(images.id, link.imageId));
    const [sp] = await db.select().from(species).where(eq(species.id, link.speciesId));

    if (image && sp && (link.isPrimary || !sp.primaryImageId)) {
      await db
        .update(species)
        .set({
          primaryImageId: image.id,
          imageUrl: sp.imageUrl || image.url,
        })
        .where(eq(species.id, link.speciesId));
    }

    return record;
  }

  async createImage(image: InsertImage): Promise<Image> {
    const [record] = await db
      .insert(images)
      .values({
        url: image.url,
        alt: image.alt ?? null,
        userId: image.userId ?? null,
        source: image.source ?? 'seed',
      })
      .returning();
    return record;
  }

  async getImage(id: number): Promise<Image | undefined> {
    const [image] = await db.select().from(images).where(eq(images.id, id));
    return image;
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
    
    const speciesWithImages = await this.attachImagesToSpeciesList(results.map((result) => result.species));
    
    return results.map((result, idx) => ({
      species: speciesWithImages[idx],
      frequency: result.frequency || 'Unknown'
    }));
  }

  // Photo Uploads
  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    let imageId = photo.imageId ?? null;

    if (!imageId && photo.imageUrl) {
      const [image] = await db
        .insert(images)
        .values({
          url: photo.imageUrl,
          alt: photo.caption || 'Dive site photo',
          userId: photo.userId,
          source: 'user-upload',
        })
        .returning();
      imageId = image.id;
    }

    const result = await db
      .insert(photos)
      .values({
        userId: photo.userId,
        diveSiteId: photo.diveSiteId,
        imageId,
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

  async deleteDiveLogSpecies(diveLogId: number): Promise<boolean> {
    const result = await db.delete(diveLogSpecies).where(eq(diveLogSpecies.diveLogId, diveLogId));
    return result.rowCount !== undefined && result.rowCount >= 0;
  }

  async deleteDiveLog(id: number): Promise<boolean> {
    // First delete related species sightings
    await this.deleteDiveLogSpecies(id);
    
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

  // Water Conditions Management
  async createWaterConditions(conditions: InsertWaterConditions): Promise<WaterConditions> {
    const [newConditions] = await db
      .insert(waterConditions)
      .values({
        diveSiteId: conditions.diveSiteId,
        waterTemp: conditions.waterTemp ?? null,
        visibility: conditions.visibility ?? null,
        currentStrength: conditions.currentStrength ?? null,
        currentDirection: conditions.currentDirection ?? null,
        waveHeight: conditions.waveHeight ?? null,
        windSpeed: conditions.windSpeed ?? null,
        windDirection: conditions.windDirection ?? null,
        weatherConditions: conditions.weatherConditions ?? null,
        surfaceConditions: conditions.surfaceConditions ?? null,
        divingConditions: conditions.divingConditions ?? null,
        reportedBy: conditions.reportedBy ?? null,
        additionalNotes: conditions.additionalNotes ?? null,
        timestamp: conditions.timestamp ?? new Date()
      })
      .returning();
    return newConditions;
  }

  async getLatestWaterConditions(diveSiteId: number): Promise<WaterConditions | undefined> {
    // Use raw SQL to match actual database columns (temperature, date, etc.)
    const result = await db.execute(sql`
      SELECT id, dive_site_id as "diveSiteId", temperature as "waterTemp", visibility, 
             current_strength as "currentStrength", weather_conditions as "weatherConditions", 
             date, timestamp
      FROM water_conditions 
      WHERE dive_site_id = ${diveSiteId} 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);
    return result.rows[0] as WaterConditions | undefined;
  }

  async getWaterConditionsHistory(diveSiteId: number, days: number = 7): Promise<WaterConditions[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return await db
      .select()
      .from(waterConditions)
      .where(
        and(
          eq(waterConditions.diveSiteId, diveSiteId),
          gte(waterConditions.timestamp, cutoffDate)
        )
      )
      .orderBy(sql`${waterConditions.timestamp} DESC`);
  }

  // Lesson Progress Management
  async getUserLessonProgress(userId: number): Promise<LessonProgress[]> {
    return await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId))
      .orderBy(sql`${lessonProgress.completedAt} DESC`);
  }

  async markLessonComplete(userId: number, lessonId: string): Promise<LessonProgress> {
    const [progress] = await db
      .insert(lessonProgress)
      .values({
        userId,
        lessonId
      })
      .returning();
    return progress;
  }

  async checkAndUnlockBadge(userId: number, lessonId: string): Promise<CategoryBadge | null> {
    // Complete mapping of all lessons to their categories and badge info
    const lessonCategories: Record<string, { category: string; badgeName: string; badgeIcon: string }> = {
      // Conservation
      'bottom-trawling-enhanced': { category: 'conservation', badgeName: 'Ocean Guardian', badgeIcon: '🌱' },
      'high-seas-treaty-enhanced': { category: 'conservation', badgeName: 'Ocean Guardian', badgeIcon: '🌱' },
      'southern-right-whale-climate': { category: 'conservation', badgeName: 'Ocean Guardian', badgeIcon: '🌱' },
      
      // Oceanic Physics
      'ocean-currents-enhanced': { category: 'oceanic-physics', badgeName: 'Physics Master', badgeIcon: '⚛️' },
      'leeuwin-current-enhanced': { category: 'oceanic-physics', badgeName: 'Physics Master', badgeIcon: '⚛️' },
      
      // Species
      'western-rock-lobster-enhanced': { category: 'species', badgeName: 'Species Expert', badgeIcon: '🧬' },
      'reef-fish-enhanced': { category: 'species', badgeName: 'Species Expert', badgeIcon: '🧬' },
      
      // Reef Ecology
      'coral-reefs-enhanced': { category: 'reef-ecology', badgeName: 'Reef Master', badgeIcon: '📘' },
      'jetty-biodiversity-lesson': { category: 'reef-ecology', badgeName: 'Reef Master', badgeIcon: '📘' },
      
      // Ocean Literacy
      'ocean-literacy-principle-1': { category: 'ocean-literacy', badgeName: 'Ocean Scholar', badgeIcon: '🌊' },
      'ocean-literacy-principle-2': { category: 'ocean-literacy', badgeName: 'Ocean Scholar', badgeIcon: '🌊' },
      'ocean-literacy-principle-3': { category: 'ocean-literacy', badgeName: 'Ocean Scholar', badgeIcon: '🌊' },
      'ocean-literacy-principle-4': { category: 'ocean-literacy', badgeName: 'Ocean Scholar', badgeIcon: '🌊' },
      'ocean-literacy-principle-5': { category: 'ocean-literacy', badgeName: 'Ocean Scholar', badgeIcon: '🌊' },
      'ocean-literacy-principle-6': { category: 'ocean-literacy', badgeName: 'Ocean Scholar', badgeIcon: '🌊' },
      'ocean-literacy-principle-7': { category: 'ocean-literacy', badgeName: 'Ocean Scholar', badgeIcon: '🌊' },
      
      // Species Identification
      'southern-right-whale-migration': { category: 'species-identification', badgeName: 'Species Expert', badgeIcon: '🧬' },
      
      // Marine Research
      'whale-science-101': { category: 'marine-research', badgeName: 'Marine Researcher', badgeIcon: '🧪' },
      'tracking-tech-innovation': { category: 'marine-research', badgeName: 'Marine Researcher', badgeIcon: '🧪' },
      'ecosystem-guardians': { category: 'marine-research', badgeName: 'Marine Researcher', badgeIcon: '🧪' },
      
      // Maritime History
      'camilla-wreck-maritime-history': { category: 'maritime-history', badgeName: 'History Keeper', badgeIcon: '📜' },
      'long-jetty-maritime-history': { category: 'maritime-history', badgeName: 'History Keeper', badgeIcon: '📜' },
      
      // Marine Mammals
      'swan-river-dolphins-marine-mammals': { category: 'marine-mammals', badgeName: 'Whale Expert', badgeIcon: '🐋' },
      'pygmy-blue-whales-marine-mammals': { category: 'marine-mammals', badgeName: 'Whale Expert', badgeIcon: '🐋' },
      'bunbury-dolphins-marine-mammals': { category: 'marine-mammals', badgeName: 'Whale Expert', badgeIcon: '🐋' },
      'australian-sea-lion-marine-mammals': { category: 'marine-mammals', badgeName: 'Whale Expert', badgeIcon: '🐋' },
      'humpback-highway-marine-mammals': { category: 'marine-mammals', badgeName: 'Whale Expert', badgeIcon: '🐋' },
      'orca-mysteries-bremer-bay': { category: 'marine-mammals', badgeName: 'Whale Expert', badgeIcon: '🐋' },
      
      // Human-Ocean Interaction
      'ocean-literacy-principle-6': { category: 'human-ocean-interaction', badgeName: 'Ocean Advocate', badgeIcon: '🤝' },
    };

    const lessonInfo = lessonCategories[lessonId];
    if (!lessonInfo) {
      return null; // Unknown lesson, can't unlock badge
    }

    // Check if user already has this badge
    const existingBadge = await db
      .select()
      .from(categoryBadges)
      .where(
        and(
          eq(categoryBadges.userId, userId),
          eq(categoryBadges.category, lessonInfo.category)
        )
      );

    if (existingBadge.length > 0) {
      return null; // Badge already unlocked
    }

    // Get all completed lessons for this user
    const completed = await this.getUserLessonProgress(userId);
    const completedLessonIds = completed.map(p => p.lessonId);

    // Count how many lessons in this category are complete
    const categoryLessons = Object.keys(lessonCategories).filter(
      id => lessonCategories[id].category === lessonInfo.category
    );
    const completedInCategory = categoryLessons.filter(id => completedLessonIds.includes(id));

    // If all lessons in category are complete, unlock badge
    if (completedInCategory.length === categoryLessons.length) {
      const [badge] = await db
        .insert(categoryBadges)
        .values({
          userId,
          category: lessonInfo.category,
          badgeName: lessonInfo.badgeName,
          badgeIcon: lessonInfo.badgeIcon
        })
        .returning();
      return badge;
    }

    return null;
  }

  async getUserBadges(userId: number): Promise<CategoryBadge[]> {
    return await db
      .select()
      .from(categoryBadges)
      .where(eq(categoryBadges.userId, userId))
      .orderBy(sql`${categoryBadges.unlockedAt} DESC`);
  }

  async createBadge(badge: InsertCategoryBadge): Promise<CategoryBadge> {
    const [newBadge] = await db
      .insert(categoryBadges)
      .values(badge)
      .returning();
    return newBadge;
  }

  // Community Posts Management
  async getAllPosts(sort?: string, tag?: string, location?: string): Promise<(Post & { user: User; likeCount: number; commentCount: number; isLiked?: boolean })[]> {
    const query = db
      .select({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        photoUrl: posts.photoUrl,
        tags: posts.tags,
        location: posts.location,
        diveSiteId: posts.diveSiteId,
        speciesSpotted: posts.speciesSpotted,
        linkedLessonId: posts.linkedLessonId,
        primaryImageId: posts.primaryImageId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: users,
        likeCount: sql<number>`(SELECT COUNT(*) FROM ${postLikes} WHERE ${postLikes.postId} = ${posts.id})`,
        commentCount: sql<number>`(SELECT COUNT(*) FROM ${postComments} WHERE ${postComments.postId} = ${posts.id})`
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id));

    let results = await query;

    // Filter by tag if provided
    if (tag) {
      results = results.filter((post: any) => post.tags && post.tags.includes(tag));
    }

    // Filter by location if provided (case-insensitive partial match)
    if (location) {
      results = results.filter((post: any) => 
        post.location && post.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Sort results
    if (sort === 'popular') {
      results.sort((a: any, b: any) => b.likeCount - a.likeCount);
    } else {
      // Default to newest
      results.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const postIds = results.map((post: any) => post.id);

    // Fetch attached images
    const imagesByPost = new Map<number, Image[]>();
    if (postIds.length > 0) {
      const imageRows = await db
        .select({
          postId: postImages.postId,
          image: images,
        })
        .from(postImages)
        .leftJoin(images, eq(postImages.imageId, images.id))
        .where(inArray(postImages.postId, postIds));

      for (const row of imageRows) {
        if (!row.image) continue;
        const list = imagesByPost.get(row.postId) ?? [];
        list.push(row.image as Image);
        imagesByPost.set(row.postId, list);
      }
    }

    // Fetch linked species for posts
    const speciesByPost = new Map<number, Species[]>();
    if (postIds.length > 0) {
      const speciesRows = await db
        .select({
          postId: postSpecies.postId,
          species: species,
        })
        .from(postSpecies)
        .leftJoin(species, eq(postSpecies.speciesId, species.id))
        .where(inArray(postSpecies.postId, postIds));

      const uniqueSpecies = speciesRows
        .map((row) => row.species)
        .filter((sp): sp is Species => Boolean(sp));
      const hydrated = uniqueSpecies.length
        ? await this.attachImagesToSpeciesList(uniqueSpecies)
        : [];
      const speciesById = new Map<number, Species>();
      hydrated.forEach((sp) => speciesById.set(sp.id, sp));

      for (const row of speciesRows) {
        if (!row.species) continue;
        const linkedSpecies = speciesById.get(row.species.id);
        if (!linkedSpecies) continue;
        const list = speciesByPost.get(row.postId) ?? [];
        list.push(linkedSpecies);
        speciesByPost.set(row.postId, list);
      }
    }

    return results.map((post: any) => {
      const postImagesList = imagesByPost.get(post.id) ?? [];
      const linkedSpecies = speciesByPost.get(post.id) ?? [];
      const primaryImageUrl = post.photoUrl || postImagesList[0]?.url || null;
      const primaryImageId = post.primaryImageId || postImagesList[0]?.id || null;

      return {
        ...post,
        photoUrl: primaryImageUrl,
        primaryImageId,
        images: postImagesList,
        linkedSpecies,
      };
    }) as any;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }

  async addPostImages(postId: number, imageIds: number[]): Promise<PostImage[]> {
    const created: PostImage[] = [];
    for (const imageId of imageIds) {
      const [record] = await db
        .insert(postImages)
        .values({ postId, imageId })
        .returning();
      created.push(record);
    }

    if (imageIds.length > 0) {
      const [primaryImage] = await db.select().from(images).where(eq(images.id, imageIds[0]));
      const updateData: Partial<typeof posts.$inferInsert> = {
        primaryImageId: imageIds[0],
      };

      if (primaryImage?.url) {
        updateData.photoUrl = primaryImage.url;
      }

      await db.update(posts).set(updateData).where(eq(posts.id, postId));
    }

    return created;
  }

  async addPostSpecies(postId: number, speciesIds: number[]): Promise<PostSpecies[]> {
    const created: PostSpecies[] = [];
    for (const speciesId of speciesIds) {
      const [record] = await db
        .insert(postSpecies)
        .values({ postId, speciesId })
        .returning();
      created.push(record);
    }
    return created;
  }

  async togglePostLike(postId: number, userId: number): Promise<{ liked: boolean }> {
    // Check if like exists
    const existingLike = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));

    if (existingLike.length > 0) {
      // Unlike
      await db
        .delete(postLikes)
        .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
      return { liked: false };
    } else {
      // Like
      await db
        .insert(postLikes)
        .values({ postId, userId });
      return { liked: true };
    }
  }

  async getPostComments(postId: number): Promise<(PostComment & { user: User })[]> {
    const results = await db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        userId: postComments.userId,
        content: postComments.content,
        createdAt: postComments.createdAt,
        user: users
      })
      .from(postComments)
      .leftJoin(users, eq(postComments.userId, users.id))
      .where(eq(postComments.postId, postId))
      .orderBy(sql`${postComments.createdAt} ASC`);

    return results as any;
  }

  async createPostComment(insertComment: InsertPostComment): Promise<PostComment> {
    const [comment] = await db
      .insert(postComments)
      .values(insertComment)
      .returning();
    return comment;
  }

  // Community Events Management
  async getAllEvents(location?: string, date?: string, type?: string): Promise<(Event & { user: User })[]> {
    let query = db
      .select({
        id: events.id,
        userId: events.userId,
        name: events.name,
        type: events.type,
        startDate: events.startDate,
        endDate: events.endDate,
        location: events.location,
        city: events.city,
        diveSiteId: events.diveSiteId,
        latitude: events.latitude,
        longitude: events.longitude,
        organizerName: events.organizerName,
        description: events.description,
        externalLink: events.externalLink,
        cost: events.cost,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
        user: users
      })
      .from(events)
      .leftJoin(users, eq(events.userId, users.id));

    let results = await query;

    // Filter by location if provided
    if (location && location !== 'all') {
      results = results.filter((event: any) => 
        event.city?.toLowerCase().includes(location.toLowerCase()) ||
        event.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by type if provided
    if (type && type !== 'all') {
      results = results.filter((event: any) => event.type === type);
    }

    // Filter by date if provided
    if (date) {
      const now = new Date();
      if (date === 'week') {
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        results = results.filter((event: any) => 
          new Date(event.startDate) >= now && new Date(event.startDate) <= weekFromNow
        );
      } else if (date === 'month') {
        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        results = results.filter((event: any) => 
          new Date(event.startDate) >= now && new Date(event.startDate) <= monthFromNow
        );
      }
    }

    // Sort by start date (soonest first)
    results.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return results as any;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async getEventById(eventId: number): Promise<(Event & { user: User }) | undefined> {
    const results = await db
      .select({
        id: events.id,
        userId: events.userId,
        name: events.name,
        type: events.type,
        startDate: events.startDate,
        endDate: events.endDate,
        location: events.location,
        city: events.city,
        diveSiteId: events.diveSiteId,
        latitude: events.latitude,
        longitude: events.longitude,
        organizerName: events.organizerName,
        description: events.description,
        externalLink: events.externalLink,
        cost: events.cost,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
        user: users
      })
      .from(events)
      .leftJoin(users, eq(events.userId, users.id))
      .where(eq(events.id, eventId));

    return results.length > 0 ? results[0] as any : undefined;
  }
}

export const storage = new DatabaseStorage();
export { db };
