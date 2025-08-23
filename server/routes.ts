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
  insertUserSpottedSpeciesSchema,
  insertDiveMapSchema
} from "@shared/schema";
import { OceanDataService } from "./services/oceanData";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'dive-maps');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `dive-map-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

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
      
      // If no query or filters, return all dive sites
      const hasFilters = Object.keys(filters).length > 0;
      const diveSites = query || hasFilters 
        ? await storage.searchDiveSites(query, filters)
        : await storage.getAllDiveSites();
      
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
      console.log('Fetching favorites for user:', userId);
      const favorites = await storage.getUserFavoriteDiveSites(userId);
      console.log('Favorites result:', favorites);
      
      res.json(favorites);
    } catch (error) {
      console.error('Error in getUserFavoriteDiveSites:', error);
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
      console.log('Fetching spotted species for user:', userId);
      const spotted = await storage.getUserSpottedSpecies(userId);
      console.log('Spotted species result:', spotted);
      
      res.json(spotted);
    } catch (error) {
      console.error('Error in getUserSpottedSpecies:', error);
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

  // Live ocean conditions from AODN
  app.get('/api/dive-sites/:id/live-conditions', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      if (isNaN(diveSiteId)) {
        return res.status(400).json({ error: "Invalid dive site ID" });
      }

      // Get dive site location
      const diveSite = await storage.getDiveSite(diveSiteId);
      if (!diveSite) {
        return res.status(404).json({ error: "Dive site not found" });
      }

      // Fetch live ocean data
      const [oceanData, weatherData] = await Promise.all([
        OceanDataService.getLiveOceanData(diveSite.latitude, diveSite.longitude),
        OceanDataService.getWeatherData(diveSite.latitude, diveSite.longitude)
      ]);

      const liveConditions = {
        diveSiteId,
        timestamp: new Date(),
        waterTemp: oceanData?.temperature || null,
        currentStrength: oceanData ? `${oceanData.currentSpeed.toFixed(1)} cm/s` : null,
        currentDirection: oceanData?.currentDirection || null,
        windSpeed: weatherData?.windSpeed || null,
        windDirection: weatherData?.windDirection || null,
        weatherConditions: weatherData?.weatherConditions || 'Unknown',
        salinity: oceanData?.salinity || null,
        reportedBy: 'AODN Live Data',
        additionalNotes: 'Live data from Australian Ocean Data Network'
      };

      res.json(liveConditions);
    } catch (error) {
      console.error('Error fetching live conditions:', error);
      res.status(500).json({ error: "Failed to fetch live conditions" });
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

  // Dive logs endpoints
  app.post('/api/dive-logs', async (req: Request, res: Response) => {
    try {
      const { species, ...diveLogData } = req.body;
      
      // Set current user ID (in a real app, this would come from authentication)
      const userId = 1;
      const logData = { ...diveLogData, userId };
      
      // Create the dive log
      const diveLog = await storage.createDiveLog(logData);
      
      // Add species sightings if provided
      if (species && species.length > 0) {
        for (const speciesSighting of species) {
          await storage.addSpeciesToDiveLog({
            diveLogId: diveLog.id,
            speciesId: speciesSighting.speciesId,
            quantity: speciesSighting.quantity || 1,
            notes: speciesSighting.notes || null
          });
        }
      }
      
      res.status(201).json(diveLog);
    } catch (error) {
      console.error('Error creating dive log:', error);
      res.status(500).json({ error: "Failed to create dive log" });
    }
  });

  app.get('/api/dive-logs/user/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const diveLogs = await storage.getUserDiveLogs(userId);
      res.json(diveLogs);
    } catch (error) {
      console.error('Error fetching user dive logs:', error);
      res.status(500).json({ error: "Failed to fetch dive logs" });
    }
  });

  app.get('/api/dive-logs/:id/species', async (req: Request, res: Response) => {
    try {
      const diveLogId = parseInt(req.params.id);
      if (isNaN(diveLogId)) {
        return res.status(400).json({ error: "Invalid dive log ID" });
      }
      
      const species = await storage.getDiveLogSpecies(diveLogId);
      res.json(species);
    } catch (error) {
      console.error('Error fetching dive log species:', error);
      res.status(500).json({ error: "Failed to fetch dive log species" });
    }
  });

  app.get('/api/species', async (req: Request, res: Response) => {
    try {
      const species = await storage.getAllSpecies();
      res.json(species);
    } catch (error) {
      console.error('Error fetching species:', error);
      res.status(500).json({ error: "Failed to fetch species" });
    }
  });

  // Dive Maps API endpoints
  app.get('/api/dive-sites/:id/dive-maps', async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      if (isNaN(diveSiteId)) {
        return res.status(400).json({ error: "Invalid dive site ID" });
      }
      
      console.log('Fetching dive maps for dive site:', diveSiteId);
      const diveMaps = await storage.getDiveMaps(diveSiteId);
      console.log('Found dive maps:', diveMaps);
      res.json(diveMaps);
    } catch (error) {
      console.error('Error fetching dive maps:', error);
      res.status(500).json({ error: "Failed to fetch dive maps" });
    }
  });

  app.post('/api/dive-sites/:id/dive-maps', upload.single('map'), async (req: Request, res: Response) => {
    try {
      const diveSiteId = parseInt(req.params.id);
      if (isNaN(diveSiteId)) {
        return res.status(400).json({ error: "Invalid dive site ID" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No map image provided" });
      }

      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      // Create the image URL (served from uploads folder)
      const imageUrl = `/uploads/dive-maps/${req.file.filename}`;

      const diveMapData = {
        diveSiteId,
        title,
        description: description || null,
        imageUrl,
        uploadedBy: 1, // TODO: Use actual authenticated user ID
      };

      const diveMap = await storage.createDiveMap(diveMapData);
      res.status(201).json(diveMap);
    } catch (error) {
      console.error('Error creating dive map:', error);
      res.status(500).json({ error: "Failed to upload dive map" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
