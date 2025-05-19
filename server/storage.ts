import {
  User,
  InsertUser,
  DiveSite,
  InsertDiveSite,
  Species,
  InsertSpecies,
  DiveSiteSpecies,
  InsertDiveSiteSpecies,
  Photo,
  InsertPhoto,
  Review,
  InsertReview,
  NearbyDiveSite,
  InsertNearbyDiveSite,
  DiveCenter,
  InsertDiveCenter,
  UserFavorite,
  InsertUserFavorite,
  UserSpottedSpecies,
  InsertUserSpottedSpecies
} from "@shared/schema";

// Storage interface for all app data
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;

  // Dive site management
  createDiveSite(diveSite: InsertDiveSite): Promise<DiveSite>;
  getDiveSite(id: number): Promise<DiveSite | undefined>;
  getAllDiveSites(): Promise<DiveSite[]>;
  searchDiveSites(query: string, filters?: Record<string, any>): Promise<DiveSite[]>;
  
  // Species management
  createSpecies(species: InsertSpecies): Promise<Species>;
  getSpecies(id: number): Promise<Species | undefined>;
  getAllSpecies(): Promise<Species[]>;
  searchSpecies(query: string): Promise<Species[]>;
  
  // Dive site species relationships
  addSpeciesToDiveSite(relation: InsertDiveSiteSpecies): Promise<DiveSiteSpecies>;
  getDiveSiteSpecies(diveSiteId: number): Promise<DiveSiteSpecies[]>;
  getSpeciesByDiveSite(diveSiteId: number): Promise<{species: Species, frequency: string}[]>;
  
  // Photo uploads
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  getPhoto(id: number): Promise<Photo | undefined>;
  getDiveSitePhotos(diveSiteId: number): Promise<Photo[]>;
  getUserPhotos(userId: number): Promise<Photo[]>;
  
  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getDiveSiteReviews(diveSiteId: number): Promise<Review[]>;
  getUserReviews(userId: number): Promise<Review[]>;
  
  // Nearby dive sites
  addNearbyDiveSite(relation: InsertNearbyDiveSite): Promise<NearbyDiveSite>;
  getNearbyDiveSites(diveSiteId: number): Promise<{diveSite: DiveSite, distance: number}[]>;
  
  // Dive centers
  createDiveCenter(diveCenter: InsertDiveCenter): Promise<DiveCenter>;
  getDiveCentersByDiveSite(diveSiteId: number): Promise<DiveCenter[]>;
  
  // User favorites
  addFavoriteDiveSite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFavoriteDiveSite(userId: number, diveSiteId: number): Promise<boolean>;
  getUserFavoriteDiveSites(userId: number): Promise<DiveSite[]>;
  
  // User spotted species
  addSpottedSpecies(spotted: InsertUserSpottedSpecies): Promise<UserSpottedSpecies>;
  getUserSpottedSpecies(userId: number): Promise<{species: Species, diveSite: DiveSite, dateSpotted: Date}[]>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private diveSites: Map<number, DiveSite>;
  private species: Map<number, Species>;
  private diveSiteSpecies: Map<number, DiveSiteSpecies>;
  private photos: Map<number, Photo>;
  private reviews: Map<number, Review>;
  private nearbyDiveSites: Map<number, NearbyDiveSite>;
  private diveCenters: Map<number, DiveCenter>;
  private userFavorites: Map<number, UserFavorite>;
  private userSpottedSpecies: Map<number, UserSpottedSpecies>;
  
  private currentIds: {
    user: number;
    diveSite: number;
    species: number;
    diveSiteSpecies: number;
    photo: number;
    review: number;
    nearbyDiveSite: number;
    diveCenter: number;
    userFavorite: number;
    userSpottedSpecies: number;
  };

  constructor() {
    this.users = new Map();
    this.diveSites = new Map();
    this.species = new Map();
    this.diveSiteSpecies = new Map();
    this.photos = new Map();
    this.reviews = new Map();
    this.nearbyDiveSites = new Map();
    this.diveCenters = new Map();
    this.userFavorites = new Map();
    this.userSpottedSpecies = new Map();
    
    this.currentIds = {
      user: 1,
      diveSite: 1,
      species: 1,
      diveSiteSpecies: 1,
      photo: 1,
      review: 1,
      nearbyDiveSite: 1,
      diveCenter: 1,
      userFavorite: 1,
      userSpottedSpecies: 1
    };
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // Initialize with essential sample data to make the app usable
  private async initializeSampleData() {
    // Sample dive sites
    const greatBarrierReef: InsertDiveSite = {
      name: "Great Barrier Reef",
      description: "The Great Barrier Reef is the world's largest coral reef system, stretching over 2,300 kilometers along the coast of Queensland, Australia. It offers some of the most spectacular diving experiences with its vibrant coral formations and diverse marine life.",
      location: "Queensland, Australia",
      country: "Australia",
      latitude: -16.7525,
      longitude: 146.5361,
      difficulty: "Intermediate",
      minDepth: 15,
      maxDepth: 30,
      minVisibility: 10,
      maxVisibility: 30,
      minTemp: 24,
      maxTemp: 30,
      current: "Mild",
      bestSeason: "June - November",
      peakVisibilityMonth: "September",
      conservationStatus: "Protected Area",
      conservationInfo: "The Great Barrier Reef is a UNESCO World Heritage site facing threats from climate change, water pollution, and coastal development. Visitors are required to follow strict guidelines to minimize impact.",
      mainImage: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Coral Gardens", "Reef Sharks", "Sea Turtles", "Manta Rays", "Wreck Diving", "Night Dives"],
      habitats: ["Coral Gardens", "Drop-offs", "Sandy Flats", "Sea Grass Beds"],
    };
    await this.createDiveSite(greatBarrierReef);

    const blueholeData: InsertDiveSite = {
      name: "The Blue Hole",
      description: "The Blue Hole in Belize is a world-renowned dive site that is part of the Lighthouse Reef System. This perfectly circular underwater sinkhole is over 300 meters across and 125 meters deep, offering divers a chance to see incredible marine life and geological formations.",
      location: "Lighthouse Reef Atoll, Belize",
      country: "Belize",
      latitude: 17.3158,
      longitude: -87.5358,
      difficulty: "Advanced",
      minDepth: 5,
      maxDepth: 40,
      minVisibility: 15,
      maxVisibility: 40,
      minTemp: 26,
      maxTemp: 29,
      current: "Moderate",
      bestSeason: "April - June",
      peakVisibilityMonth: "May",
      conservationStatus: "Marine Reserve",
      conservationInfo: "Part of the Belize Barrier Reef Reserve System, a UNESCO World Heritage site requiring careful conservation efforts to protect its unique ecosystem.",
      mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Deep Blue Waters", "Stalactites", "Sharks", "Coral Formations", "Clear Visibility"],
      habitats: ["Sinkhole", "Reef Wall", "Open Ocean"],
    };
    await this.createDiveSite(blueholeData);
    
    const tubbatahaData: InsertDiveSite = {
      name: "Tubbataha Reefs",
      description: "The Tubbataha Reefs Natural Park is a remote diving destination in the Sulu Sea, Philippines. This protected marine sanctuary features extraordinary biodiversity with pristine coral reefs and an abundance of marine life.",
      location: "Sulu Sea, Philippines",
      country: "Philippines",
      latitude: 8.8011,
      longitude: 119.8902,
      difficulty: "Advanced",
      minDepth: 10,
      maxDepth: 40,
      minVisibility: 20,
      maxVisibility: 45,
      minTemp: 26,
      maxTemp: 30,
      current: "Strong",
      bestSeason: "March - June",
      peakVisibilityMonth: "April",
      conservationStatus: "UNESCO World Heritage Site",
      conservationInfo: "Strictly protected marine sanctuary with limited visitor access to preserve its unique marine ecosystem.",
      mainImage: "https://images.unsplash.com/photo-1533713692156-f70938dc0d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Pristine Corals", "Sharks", "Manta Rays", "Sea Turtles", "Wall Diving"],
      habitats: ["Coral Reef", "Reef Wall", "Atolls"],
    };
    await this.createDiveSite(tubbatahaData);
    
    // Sample species
    const clownfish: InsertSpecies = {
      commonName: "Clownfish",
      scientificName: "Amphiprioninae",
      description: "Clownfish are small, brightly colored fish known for their symbiotic relationship with sea anemones. They are popular in marine aquariums due to their striking orange coloration with white stripes.",
      imageUrl: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      conservationStatus: "Least Concern",
      category: "Fish",
      habitats: ["Coral Reefs", "Sea Anemones"],
    };
    
    const greenSeaTurtle: InsertSpecies = {
      commonName: "Green Sea Turtle",
      scientificName: "Chelonia mydas",
      description: "The green sea turtle is a large sea turtle belonging to the family Cheloniidae. It is the only species in the genus Chelonia. Its range extends throughout tropical and subtropical seas around the world.",
      imageUrl: "https://images.unsplash.com/photo-1591025207163-942350e47db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      conservationStatus: "Endangered",
      category: "Reptile",
      habitats: ["Coral Reefs", "Seagrass Beds", "Open Ocean"],
    };
    
    const reefShark: InsertSpecies = {
      commonName: "Reef Shark",
      scientificName: "Carcharhinus melanopterus",
      description: "The blacktip reef shark is a species of requiem shark, characterized by the prominent black tips on its fins. It is a relatively small shark inhabiting shallow, tropical waters around coral reefs.",
      imageUrl: "https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      conservationStatus: "Near Threatened",
      category: "Fish",
      habitats: ["Coral Reefs", "Lagoons", "Shallow Waters"],
    };
    
    const mantaRay: InsertSpecies = {
      commonName: "Manta Ray",
      scientificName: "Mobula birostris",
      description: "The giant manta ray is the largest ray in the world, with a wingspan that can reach up to 7 meters. These gentle giants are filter feeders, consuming large quantities of zooplankton.",
      imageUrl: "https://pixabay.com/get/gaf02b3a3125289a2986417e690c3eb8ece64052d5e2e8369c391846000ac8c971abbb185b9062479775d5e0bb1c5a028c8f6b8483fe384a475adf460a79b4321_1280.jpg",
      conservationStatus: "Vulnerable",
      category: "Fish",
      habitats: ["Open Ocean", "Coastal Areas", "Cleaning Stations"],
    };
    
    const clownfishId = (await this.createSpecies(clownfish)).id;
    const turtleId = (await this.createSpecies(greenSeaTurtle)).id;
    const sharkId = (await this.createSpecies(reefShark)).id;
    const mantaId = (await this.createSpecies(mantaRay)).id;
    
    // Link species to dive sites
    await this.addSpeciesToDiveSite({
      diveSiteId: 1,
      speciesId: clownfishId,
      frequency: "Common"
    });
    
    await this.addSpeciesToDiveSite({
      diveSiteId: 1,
      speciesId: turtleId,
      frequency: "Common"
    });
    
    await this.addSpeciesToDiveSite({
      diveSiteId: 1,
      speciesId: sharkId,
      frequency: "Common"
    });
    
    await this.addSpeciesToDiveSite({
      diveSiteId: 1,
      speciesId: mantaId,
      frequency: "Uncommon"
    });
    
    // Add nearby dive sites for Great Barrier Reef
    await this.addNearbyDiveSite({
      diveSiteId: 1,
      nearbyDiveSiteId: 2,
      distance: 1500
    });
    
    await this.addNearbyDiveSite({
      diveSiteId: 1,
      nearbyDiveSiteId: 3,
      distance: 2200
    });
    
    // Add dive centers
    await this.createDiveCenter({
      name: "Pro Dive Cairns",
      diveSiteId: 1,
      certification: "PADI 5 Star Operator",
      description: "Professional dive center offering daily trips to the Great Barrier Reef.",
      contactInfo: "info@prodivecairns.com",
      iconType: "ship"
    });
    
    await this.createDiveCenter({
      name: "Reef Magic Cruises",
      diveSiteId: 1,
      certification: "Day Trips Available",
      description: "Luxury reef tours and dive trips to the Great Barrier Reef.",
      contactInfo: "bookings@reefmagic.com",
      iconType: "water"
    });
    
    // Add community photos
    if (this.users.size > 0) {
      await this.createPhoto({
        userId: 1,
        diveSiteId: 1,
        imageUrl: "https://pixabay.com/get/g0ac712df8a5d74429b5d91c77da2fd51926d4bad99b1076d115db3acfa71ee7627f1b11b0962c9ad25b629e7ff71f0e68bca70ebc3968dba05215e8e948b8d0b_1280.jpg",
        caption: "Coral formations at the Great Barrier Reef",
        speciesTags: [clownfishId]
      });
    }
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Dive site management
  async createDiveSite(diveSite: InsertDiveSite): Promise<DiveSite> {
    const id = this.currentIds.diveSite++;
    const newDiveSite: DiveSite = { ...diveSite, id };
    this.diveSites.set(id, newDiveSite);
    return newDiveSite;
  }

  async getDiveSite(id: number): Promise<DiveSite | undefined> {
    return this.diveSites.get(id);
  }

  async getAllDiveSites(): Promise<DiveSite[]> {
    return Array.from(this.diveSites.values());
  }

  async searchDiveSites(query: string, filters?: Record<string, any>): Promise<DiveSite[]> {
    let results = Array.from(this.diveSites.values());
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(site => 
        site.name.toLowerCase().includes(lowerQuery) ||
        site.location.toLowerCase().includes(lowerQuery) ||
        site.country.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply additional filters if provided
    if (filters) {
      if (filters.difficulty) {
        results = results.filter(site => site.difficulty === filters.difficulty);
      }
      
      if (filters.region) {
        results = results.filter(site => site.country === filters.region);
      }
      
      if (filters.minDepth) {
        results = results.filter(site => 
          (site.minDepth && site.minDepth >= filters.minDepth) || 
          (site.maxDepth && site.maxDepth >= filters.minDepth)
        );
      }
      
      if (filters.maxDepth) {
        results = results.filter(site => 
          (site.maxDepth && site.maxDepth <= filters.maxDepth) || 
          (site.minDepth && site.minDepth <= filters.maxDepth)
        );
      }
    }
    
    return results;
  }

  // Species management
  async createSpecies(species: InsertSpecies): Promise<Species> {
    const id = this.currentIds.species++;
    const newSpecies: Species = { ...species, id };
    this.species.set(id, newSpecies);
    return newSpecies;
  }

  async getSpecies(id: number): Promise<Species | undefined> {
    return this.species.get(id);
  }

  async getAllSpecies(): Promise<Species[]> {
    return Array.from(this.species.values());
  }

  async searchSpecies(query: string): Promise<Species[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.species.values()).filter(
      species => 
        species.commonName.toLowerCase().includes(lowerQuery) || 
        species.scientificName.toLowerCase().includes(lowerQuery)
    );
  }

  // Dive site species relationships
  async addSpeciesToDiveSite(relation: InsertDiveSiteSpecies): Promise<DiveSiteSpecies> {
    const id = this.currentIds.diveSiteSpecies++;
    const diveSiteSpecies: DiveSiteSpecies = { ...relation, id };
    this.diveSiteSpecies.set(id, diveSiteSpecies);
    return diveSiteSpecies;
  }

  async getDiveSiteSpecies(diveSiteId: number): Promise<DiveSiteSpecies[]> {
    return Array.from(this.diveSiteSpecies.values()).filter(
      rel => rel.diveSiteId === diveSiteId
    );
  }

  async getSpeciesByDiveSite(diveSiteId: number): Promise<{species: Species, frequency: string}[]> {
    const relations = await this.getDiveSiteSpecies(diveSiteId);
    return Promise.all(
      relations.map(async rel => {
        const species = await this.getSpecies(rel.speciesId);
        return {
          species: species!,
          frequency: rel.frequency || "Unknown"
        };
      })
    );
  }

  // Photo uploads
  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const id = this.currentIds.photo++;
    const dateUploaded = new Date();
    const newPhoto: Photo = { ...photo, id, dateUploaded };
    this.photos.set(id, newPhoto);
    return newPhoto;
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async getDiveSitePhotos(diveSiteId: number): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      photo => photo.diveSiteId === diveSiteId
    );
  }

  async getUserPhotos(userId: number): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      photo => photo.userId === userId
    );
  }

  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentIds.review++;
    const datePosted = new Date();
    const newReview: Review = { ...review, id, datePosted };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getDiveSiteReviews(diveSiteId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.diveSiteId === diveSiteId
    );
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.userId === userId
    );
  }

  // Nearby dive sites
  async addNearbyDiveSite(relation: InsertNearbyDiveSite): Promise<NearbyDiveSite> {
    const id = this.currentIds.nearbyDiveSite++;
    const nearbyDiveSite: NearbyDiveSite = { ...relation, id };
    this.nearbyDiveSites.set(id, nearbyDiveSite);
    return nearbyDiveSite;
  }

  async getNearbyDiveSites(diveSiteId: number): Promise<{diveSite: DiveSite, distance: number}[]> {
    const relations = Array.from(this.nearbyDiveSites.values()).filter(
      rel => rel.diveSiteId === diveSiteId
    );
    
    return Promise.all(
      relations.map(async rel => {
        const diveSite = await this.getDiveSite(rel.nearbyDiveSiteId);
        return {
          diveSite: diveSite!,
          distance: rel.distance || 0
        };
      })
    );
  }

  // Dive centers
  async createDiveCenter(diveCenter: InsertDiveCenter): Promise<DiveCenter> {
    const id = this.currentIds.diveCenter++;
    const newDiveCenter: DiveCenter = { ...diveCenter, id };
    this.diveCenters.set(id, newDiveCenter);
    return newDiveCenter;
  }

  async getDiveCentersByDiveSite(diveSiteId: number): Promise<DiveCenter[]> {
    return Array.from(this.diveCenters.values()).filter(
      center => center.diveSiteId === diveSiteId
    );
  }

  // User favorites
  async addFavoriteDiveSite(favorite: InsertUserFavorite): Promise<UserFavorite> {
    const id = this.currentIds.userFavorite++;
    const dateAdded = new Date();
    const newFavorite: UserFavorite = { ...favorite, id, dateAdded };
    this.userFavorites.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavoriteDiveSite(userId: number, diveSiteId: number): Promise<boolean> {
    const favorites = Array.from(this.userFavorites.values());
    const favoriteToRemove = favorites.find(
      fav => fav.userId === userId && fav.diveSiteId === diveSiteId
    );
    
    if (favoriteToRemove) {
      this.userFavorites.delete(favoriteToRemove.id);
      return true;
    }
    
    return false;
  }

  async getUserFavoriteDiveSites(userId: number): Promise<DiveSite[]> {
    const favorites = Array.from(this.userFavorites.values()).filter(
      fav => fav.userId === userId
    );
    
    return Promise.all(
      favorites.map(async fav => {
        const diveSite = await this.getDiveSite(fav.diveSiteId);
        return diveSite!;
      })
    );
  }

  // User spotted species
  async addSpottedSpecies(spotted: InsertUserSpottedSpecies): Promise<UserSpottedSpecies> {
    const id = this.currentIds.userSpottedSpecies++;
    const dateSpotted = new Date();
    const newSpotted: UserSpottedSpecies = { ...spotted, id, dateSpotted };
    this.userSpottedSpecies.set(id, newSpotted);
    return newSpotted;
  }

  async getUserSpottedSpecies(userId: number): Promise<{species: Species, diveSite: DiveSite, dateSpotted: Date}[]> {
    const spotted = Array.from(this.userSpottedSpecies.values()).filter(
      item => item.userId === userId
    );
    
    return Promise.all(
      spotted.map(async item => {
        const species = await this.getSpecies(item.speciesId);
        const diveSite = await this.getDiveSite(item.diveSiteId);
        return {
          species: species!,
          diveSite: diveSite!,
          dateSpotted: item.dateSpotted
        };
      })
    );
  }
}

export const storage = new MemStorage();
