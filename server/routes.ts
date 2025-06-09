import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertDiveSiteSchema, 
  insertSpeciesSchema, 
  insertDiveSiteSpeciesSchema, 
  insertPhotoSchema,
  insertReviewSchema,
  insertUserFavoriteSchema,
  insertUserSpottedSpeciesSchema
} from "@shared/schema";

function validateRequest<T>(schema: z.ZodType<T>, body: unknown): T | undefined {
  try {
    return schema.parse(body);
  } catch (error) {
    return undefined;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  const apiRouter = app.route('/api');
  
  // Dive Sites
  app.get('/api/dive-sites', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || '';
      const filters: Record<string, any> = {};
      
      // Apply filters from query parameters if present
      if (req.query.difficulty) filters.difficulty = req.query.difficulty;
      if (req.query.region) filters.region = req.query.region;
      if (req.query.minDepth) filters.minDepth = parseInt(req.query.minDepth as string);
      if (req.query.maxDepth) filters.maxDepth = parseInt(req.query.maxDepth as string);
      
      const diveSites = await storage.searchDiveSites(query, filters);
      res.json(diveSites);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dive sites' });
    }
  });

  app.get('/api/dive-sites/:id', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      const diveSite = await storage.getDiveSite(diveSiteId);
      
      if (!diveSite) {
        return res.status(404).json({ error: 'Dive site not found' });
      }
      
      res.json(diveSite);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dive site details' });
    }
  });
  
  // Species by Dive Site
  app.get('/api/dive-sites/:id/species', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      const species = await storage.getSpeciesByDiveSite(diveSiteId);
      
      res.json(species);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch species for dive site' });
    }
  });
  
  // Photos by Dive Site
  app.get('/api/dive-sites/:id/photos', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      const photos = await storage.getDiveSitePhotos(diveSiteId);
      
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch photos for dive site' });
    }
  });
  
  // Reviews by Dive Site
  app.get('/api/dive-sites/:id/reviews', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      const reviews = await storage.getDiveSiteReviews(diveSiteId);
      
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews for dive site' });
    }
  });
  
  // Nearby Dive Sites
  app.get('/api/dive-sites/:id/nearby', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      const nearbySites = await storage.getNearbyDiveSites(diveSiteId);
      
      res.json(nearbySites);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch nearby dive sites' });
    }
  });
  
  // Dive Centers by Dive Site
  app.get('/api/dive-sites/:id/dive-centers', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      const diveCenters = await storage.getDiveCentersByDiveSite(diveSiteId);
      
      res.json(diveCenters);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dive centers' });
    }
  });
  
  // Species
  app.get('/api/species', async (req, res) => {
    try {
      const query = req.query.q as string || '';
      let species;
      
      if (query) {
        species = await storage.searchSpecies(query);
      } else {
        species = await storage.getAllSpecies();
      }
      
      res.json(species);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch species' });
    }
  });
  
  app.get('/api/species/:id', async (req, res) => {
    try {
      const speciesId = parseInt(req.params.id);
      const species = await storage.getSpecies(speciesId);
      
      if (!species) {
        return res.status(404).json({ error: 'Species not found' });
      }
      
      res.json(species);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch species details' });
    }
  });
  
  // User Management
  app.post('/api/users', async (req, res) => {
    try {
      const userData = validateRequest(insertUserSchema, req.body);
      
      if (!userData) {
        return res.status(400).json({ error: 'Invalid user data' });
      }
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });
  
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Don't return password in the response
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });
  
  // Photo uploads
  app.post('/api/photos', async (req, res) => {
    try {
      const photoData = validateRequest(insertPhotoSchema, req.body);
      
      if (!photoData) {
        return res.status(400).json({ error: 'Invalid photo data' });
      }
      
      const photo = await storage.createPhoto(photoData);
      res.status(201).json(photo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload photo' });
    }
  });
  
  // Reviews
  app.post('/api/reviews', async (req, res) => {
    try {
      const reviewData = validateRequest(insertReviewSchema, req.body);
      
      if (!reviewData) {
        return res.status(400).json({ error: 'Invalid review data' });
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create review' });
    }
  });
  
  // User favorites
  app.post('/api/favorites', async (req, res) => {
    try {
      const favoriteData = validateRequest(insertUserFavoriteSchema, req.body);
      
      if (!favoriteData) {
        return res.status(400).json({ error: 'Invalid favorite data' });
      }
      
      const favorite = await storage.addFavoriteDiveSite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add favorite' });
    }
  });
  
  app.delete('/api/favorites', async (req, res) => {
    try {
      const { userId, diveSiteId } = req.body;
      
      if (!userId || !diveSiteId) {
        return res.status(400).json({ error: 'Missing userId or diveSiteId' });
      }
      
      const success = await storage.removeFavoriteDiveSite(userId, diveSiteId);
      
      if (!success) {
        return res.status(404).json({ error: 'Favorite not found' });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove favorite' });
    }
  });
  
  app.get('/api/users/:id/favorites', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const favorites = await storage.getUserFavoriteDiveSites(userId);
      
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  });
  
  // User spotted species
  app.post('/api/spotted-species', async (req, res) => {
    try {
      const spottedData = validateRequest(insertUserSpottedSpeciesSchema, req.body);
      
      if (!spottedData) {
        return res.status(400).json({ error: 'Invalid spotted species data' });
      }
      
      const spotted = await storage.addSpottedSpecies(spottedData);
      res.status(201).json(spotted);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add spotted species' });
    }
  });
  
  app.get('/api/users/:id/spotted-species', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const spotted = await storage.getUserSpottedSpecies(userId);
      
      res.json(spotted);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch spotted species' });
    }
  });

  // Water conditions endpoints
  app.get('/api/dive-sites/:id/conditions', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      if (isNaN(diveSiteId)) {
        return res.status(400).json({ error: "Invalid dive site ID" });
      }

      const conditions = await storage.getLatestWaterConditions(diveSiteId);
      if (!conditions) {
        return res.status(404).json({ error: "No water conditions found for this dive site" });
      }

      res.json(conditions);
    } catch (error) {
      console.error('Error fetching water conditions:', error);
      res.status(500).json({ error: "Failed to fetch water conditions" });
    }
  });

  app.get('/api/dive-sites/:id/conditions/history', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      if (isNaN(diveSiteId)) {
        return res.status(400).json({ error: "Invalid dive site ID" });
      }

      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const conditions = await storage.getWaterConditionsHistory(diveSiteId, days);
      res.json(conditions);
    } catch (error) {
      console.error('Error fetching water conditions history:', error);
      res.status(500).json({ error: "Failed to fetch water conditions history" });
    }
  });

  app.post('/api/dive-sites/:id/conditions', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      if (isNaN(diveSiteId)) {
        return res.status(400).json({ error: "Invalid dive site ID" });
      }

      const conditionsData = { ...req.body, diveSiteId };
      const conditions = await storage.createWaterConditions(conditionsData);
      res.status(201).json(conditions);
    } catch (error) {
      console.error('Error creating water conditions:', error);
      res.status(500).json({ error: "Failed to create water conditions" });
    }
  });

  // Research data endpoints
  app.get('/api/research/data', async (req: Request, res: Response) => {
    try {
      const timeRange = (req.query.timeRange as string) || '7d';
      const diveSites = await storage.getAllDiveSites();
      
      // Generate research data points by combining dive sites with water conditions
      const researchData = [];
      
      for (const site of diveSites) {
        const conditions = await storage.getWaterConditionsHistory(site.id, 30);
        const species = await storage.getSpeciesByDiveSite(site.id);
        
        // Create data points from conditions
        for (const condition of conditions) {
          researchData.push({
            date: condition.dateRecorded,
            temperature: condition.temperature,
            salinity: condition.salinity,
            visibility: condition.visibility,
            depth: condition.depth,
            speciesCount: species.length,
            diveSiteId: site.id,
            siteName: site.name,
            latitude: site.latitude,
            longitude: site.longitude
          });
        }
      }
      
      res.json(researchData);
    } catch (error) {
      console.error('Error fetching research data:', error);
      res.status(500).json({ error: "Failed to fetch research data" });
    }
  });

  app.get('/api/research/species-data', async (req: Request, res: Response) => {
    try {
      const allSpecies = await storage.getAllSpecies();
      const diveSites = await storage.getAllDiveSites();
      
      const speciesData = [];
      
      for (const species of allSpecies) {
        let totalSightings = 0;
        let totalDepth = 0;
        let sightingsCount = 0;
        
        // Calculate aggregated data for each species
        for (const site of diveSites) {
          const siteSpecies = await storage.getSpeciesByDiveSite(site.id);
          const speciesAtSite = siteSpecies.find(s => s.species.id === species.id);
          
          if (speciesAtSite) {
            totalSightings += 1;
            totalDepth += site.maxDepth || 0;
            sightingsCount += 1;
          }
        }
        
        const frequency = totalSightings / diveSites.length;
        const avgDepth = sightingsCount > 0 ? totalDepth / sightingsCount : 0;
        
        speciesData.push({
          species: species.commonName,
          count: totalSightings,
          frequency: frequency,
          conservationStatus: species.conservationStatus || 'Unknown',
          depth: Math.round(avgDepth)
        });
      }
      
      res.json(speciesData);
    } catch (error) {
      console.error('Error fetching species data:', error);
      res.status(500).json({ error: "Failed to fetch species data" });
    }
  });

  app.get('/api/research/projects', async (req: Request, res: Response) => {
    try {
      // Generate sample research projects based on actual data
      const diveSites = await storage.getAllDiveSites();
      const allSpecies = await storage.getAllSpecies();
      
      const projects = [
        {
          id: 1,
          title: "Coral Reef Health Assessment",
          description: "Monitoring coral bleaching and recovery patterns across tropical dive sites",
          status: "active" as const,
          participants: 156,
          dataPoints: diveSites.length * 30,
          startDate: "2024-01-15"
        },
        {
          id: 2,
          title: "Marine Species Migration Study",
          description: "Tracking seasonal migration patterns of marine megafauna",
          status: "active" as const,
          participants: 89,
          dataPoints: allSpecies.length * 15,
          startDate: "2024-03-01"
        },
        {
          id: 3,
          title: "Water Quality Impact Analysis",
          description: "Assessing the relationship between water conditions and biodiversity",
          status: "completed" as const,
          participants: 234,
          dataPoints: diveSites.length * 45,
          startDate: "2023-06-10"
        },
        {
          id: 4,
          title: "Deep Sea Exploration Initiative",
          description: "Documenting species in previously unexplored deep water environments",
          status: "pending" as const,
          participants: 67,
          dataPoints: 120,
          startDate: "2024-07-01"
        }
      ];
      
      res.json(projects);
    } catch (error) {
      console.error('Error fetching research projects:', error);
      res.status(500).json({ error: "Failed to fetch research projects" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
