import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, db } from "./database-storage";
import { sql } from "drizzle-orm";
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
  insertDiveMapSchema,
  insertDiveLogSchema,
  insertDiveLogSpeciesSchema,
  registrationSchema,
  loginSchema,
  insertCountrySchema,
  insertCertificationSchema,
  insertUserCertificationSchema,
  updateProfileSchema,
  insertLessonProgressSchema,
  insertCategoryBadgeSchema,
  insertPostSchema,
  insertPostCommentSchema,
  insertPostLikeSchema,
  insertEventSchema
} from "@shared/schema";
import bcrypt from 'bcryptjs';
import { OceanDataService } from "./services/oceanData";
import { EmailService } from "./services/emailService";
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
      cb(new Error('Only image files are allowed'));
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
  // Countries endpoint
  app.get('/api/countries', async (req: Request, res: Response) => {
    try {
      const countries = await storage.getAllCountries();
      res.status(200).json({
        success: true,
        countries: countries
      });
    } catch (error) {
      console.error('Get countries error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch countries"
      });
    }
  });

  // User registration endpoint
  app.post('/api/users/register', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validationResult = registrationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors
        });
      }

      const { confirmPassword, ...userData } = validationResult.data;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: {
            email: ["Email already exists"]
          }
        });
      }

      // Validate country_id if provided
      if (userData.countryId) {
        const country = await storage.getCountry(userData.countryId);
        if (!country) {
          return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: {
              countryId: ["Invalid country selected"]
            }
          });
        }
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create the user with backward compatibility
      const newUser = await storage.createUser({
        name: userData.name,
        lastname: userData.lastname,
        email: userData.email,
        password: hashedPassword,
        preferredActivity: userData.preferredActivity,
        profilePicture: userData.profilePicture || null,
        bio: userData.bio || null,
        countryId: userData.countryId || null
      });

      // Send welcome email (don't block registration if email fails)
      EmailService.sendRegistrationEmail(newUser.email, newUser.name || 'Diver')
        .catch(err => console.error('Failed to send welcome email:', err));

      // Return success response (exclude password)
      const { password, ...userResponse } = newUser;
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: userResponse
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // User login endpoint
  app.post('/api/users/login', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validationResult = loginSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors
        });
      }

      const { email, password } = validationResult.data;

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Store user session (simple session approach)
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
      });

      // Return success response (exclude password)
      const { password: _, ...userResponse } = user;
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: userResponse
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get current user endpoint (check authentication)
  app.get('/api/users/me', async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
      }

      const user = await storage.getUserWithCountry(req.session.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      // Return user data (exclude password)
      const { password, ...userResponse } = user;
      res.status(200).json({
        success: true,
        user: userResponse
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // User logout endpoint
  app.post('/api/users/logout', async (req: Request, res: Response) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({
            success: false,
            message: "Failed to logout"
          });
        }
        
        res.clearCookie('connect.sid'); // Default session cookie name
        res.status(200).json({
          success: true,
          message: "Logged out successfully"
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // API endpoints
  const apiRouter = app.route('/api');
  
  // Dive Sites
  app.get('/api/dive-sites', async (req: Request, res: Response) => {
    try {
      console.log('=== DIVE SITES ENDPOINT DEBUG ===');
      console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
      console.log('Request query:', req.query);
      
      const query = req.query.q as string || '';
      const filters: Record<string, any> = {};
      
      // Apply filters from query parameters if present
      if (req.query.difficulty) filters.difficulty = req.query.difficulty;
      if (req.query.region) filters.region = req.query.region;
      if (req.query.minDepth) filters.minDepth = parseInt(req.query.minDepth as string);
      if (req.query.maxDepth) filters.maxDepth = parseInt(req.query.maxDepth as string);
      
      console.log('Applied filters:', filters);
      console.log('Search query:', query);
      
      // If no query or filters, return all dive sites - ALWAYS FROM DATABASE
      const hasFilters = Object.keys(filters).length > 0;
      console.log('Has filters:', hasFilters);
      
      let diveSites;
      if (query || hasFilters) {
        console.log('Calling storage.searchDiveSites()');
        diveSites = await storage.searchDiveSites(query, filters);
      } else {
        console.log('Calling storage.getAllDiveSites()');
        diveSites = await storage.getAllDiveSites();
      }
      
      console.log('Retrieved dive sites count:', diveSites?.length || 0);
      console.log('=== END DIVE SITES DEBUG ===');
      
      res.json(diveSites);
    } catch (error) {
      console.error('=== DIVE SITES ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('=== END ERROR DEBUG ===');
      res.status(500).json({ error: 'Failed to fetch dive sites' });
    }
  });

  // Create new dive site
  app.post('/api/dive-sites', async (req: Request, res: Response) => {
    try {
      console.log('POST /api/dive-sites - Creating new dive site');
      console.log('Request body:', req.body);
      
      // Validate the request body against the schema
      const validatedData = insertDiveSiteSchema.parse(req.body);
      console.log('Validated data:', validatedData);
      
      // Create the dive site using storage
      const newDiveSite = await storage.createDiveSite(validatedData);
      console.log('Created dive site:', newDiveSite);
      
      res.status(201).json(newDiveSite);
    } catch (error) {
      console.error('Error creating dive site:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid dive site data', details: error.message });
      }
      res.status(500).json({ error: 'Failed to create dive site' });
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
  
  // Dive Logs endpoints
  // Get all dive logs for authenticated user
  app.get('/api/dive-logs', async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
      }

      const diveLogs = await storage.getUserDiveLogs(req.session.userId);
      
      // Fetch dive site and species information for each log
      const diveLogsWithDetails = await Promise.all(
        diveLogs.map(async (log) => {
          const diveSite = await storage.getDiveSite(log.diveSiteId);
          const species = await storage.getDiveLogSpecies(log.id);
          return {
            ...log,
            diveSite,
            species
          };
        })
      );

      res.status(200).json({
        success: true,
        diveLogs: diveLogsWithDetails
      });
    } catch (error) {
      console.error('Get dive logs error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dive logs"
      });
    }
  });

  // Create new dive log
  app.post('/api/dive-logs', async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
      }

      // Transform the date string to a Date object and add userId
      const requestData = {
        ...req.body,
        diveDate: new Date(req.body.diveDate),
        userId: req.session.userId
      };

      const validationResult = insertDiveLogSchema.safeParse(requestData);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid dive log data",
          errors: validationResult.error.flatten().fieldErrors
        });
      }

      const diveLogData = validationResult.data;

      const newDiveLog = await storage.createDiveLog(diveLogData);

      // If species were spotted during the dive, add them
      if (req.body.species && Array.isArray(req.body.species) && req.body.species.length > 0) {
        for (const speciesData of req.body.species) {
          if (speciesData && speciesData.speciesId) {
            await storage.addSpeciesToDiveLog({
              diveLogId: newDiveLog.id,
              speciesId: speciesData.speciesId,
              quantity: speciesData.quantity || 1,
              notes: speciesData.notes || ""
            });
          }
        }
      }

      res.status(201).json({
        success: true,
        message: "Dive log created successfully",
        diveLog: newDiveLog
      });
    } catch (error) {
      console.error('Create dive log error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to create dive log"
      });
    }
  });

  // Get specific dive log
  app.get('/api/dive-logs/:id', async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
      }

      const diveLogId = parseInt(req.params.id);
      const diveLog = await storage.getDiveLog(diveLogId);

      if (!diveLog) {
        return res.status(404).json({
          success: false,
          message: "Dive log not found"
        });
      }

      // Check if dive log belongs to authenticated user
      if (diveLog.userId !== req.session.userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      const diveSite = await storage.getDiveSite(diveLog.diveSiteId);
      const species = await storage.getDiveLogSpecies(diveLog.id);

      res.status(200).json({
        success: true,
        diveLog: {
          ...diveLog,
          diveSite,
          species
        }
      });
    } catch (error) {
      console.error('Get dive log error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dive log"
      });
    }
  });

  // Update dive log
  app.put('/api/dive-logs/:id', async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
      }

      const diveLogId = parseInt(req.params.id);
      const existingDiveLog = await storage.getDiveLog(diveLogId);

      if (!existingDiveLog) {
        return res.status(404).json({
          success: false,
          message: "Dive log not found"
        });
      }

      // Check ownership
      if (existingDiveLog.userId !== req.session.userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      // Transform the date string to a Date object if provided (same as POST route)
      const requestData = {
        ...req.body,
        ...(req.body.diveDate && { diveDate: new Date(req.body.diveDate) })
      };

      const validationResult = insertDiveLogSchema.partial().safeParse(requestData);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid dive log data",
          errors: validationResult.error.flatten().fieldErrors
        });
      }

      const updatedDiveLog = await storage.updateDiveLog(diveLogId, validationResult.data);

      // Handle species updates: first remove existing species, then add new ones
      if (req.body.species && Array.isArray(req.body.species)) {
        // Delete existing species for this dive log
        await storage.deleteDiveLogSpecies(diveLogId);
        
        // Add new species if any
        if (req.body.species.length > 0) {
          for (const speciesData of req.body.species) {
            if (speciesData && speciesData.speciesId) {
              await storage.addSpeciesToDiveLog({
                diveLogId: diveLogId,
                speciesId: speciesData.speciesId,
                quantity: speciesData.quantity || 1,
                notes: speciesData.notes || ""
              });
            }
          }
        }
      }

      res.status(200).json({
        success: true,
        message: "Dive log updated successfully",
        diveLog: updatedDiveLog
      });
    } catch (error) {
      console.error('Update dive log error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to update dive log"
      });
    }
  });

  // Delete dive log
  app.delete('/api/dive-logs/:id', async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
      }

      const diveLogId = parseInt(req.params.id);
      const existingDiveLog = await storage.getDiveLog(diveLogId);

      if (!existingDiveLog) {
        return res.status(404).json({
          success: false,
          message: "Dive log not found"
        });
      }

      // Check ownership
      if (existingDiveLog.userId !== req.session.userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      const deleted = await storage.deleteDiveLog(diveLogId);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: "Dive log deleted successfully"
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to delete dive log"
        });
      }
    } catch (error) {
      console.error('Delete dive log error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to delete dive log"
      });
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

  // Profile Management Endpoints
  app.get('/api/users/profile', async (req: Request, res: Response) => {
    console.log('NEW PROFILE ENDPOINT HIT');
    
    if (!req.session?.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
      console.log('Getting user with ID:', req.session.userId);
      const user = await storage.getUserWithCountry(req.session.userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      console.log('SUCCESS - returning user data');
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Profile error:', error);
      res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
  });

  app.put('/api/users/profile', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const profileData = validateRequest(updateProfileSchema, req.body);
      if (!profileData) {
        return res.status(400).json({ success: false, message: "Invalid profile data" });
      }

      // Check if email is already taken by another user
      const existingUser = await storage.getUserByEmail(profileData.email);
      if (existingUser && existingUser.id !== req.session.userId) {
        return res.status(400).json({ success: false, message: "Email is already taken" });
      }

      const updatedUser = await storage.updateUserProfile(req.session.userId, profileData);
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ success: false, message: "Failed to update profile" });
    }
  });

  // Certification Management Endpoints
  app.get('/api/certifications', async (req: Request, res: Response) => {
    try {
      const certifications = await storage.getAllCertifications();
      res.json({ success: true, certifications });
    } catch (error) {
      console.error('Error fetching certifications:', error);
      res.status(500).json({ success: false, message: "Failed to fetch certifications" });
    }
  });

  app.get('/api/users/certifications', async (req: Request, res: Response) => {
    console.log('=== NEW WORKING CERTIFICATIONS ENDPOINT ===');
    
    if (!req.session?.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
      // Use direct SQL query to get user certifications with certification details
      const query = `
        SELECT 
          uc.id,
          uc.date_obtained as "dateObtained",
          uc.certification_number as "certificationNumber",
          uc.created_at as "createdAt",
          c.id as "certificationId",
          c.name as "certificationName",
          c.agency,
          c.level,
          c.description
        FROM user_certifications uc
        JOIN certifications c ON uc.certification_id = c.id
        WHERE uc.user_id = $1
        ORDER BY uc.created_at DESC
      `;
      
      const result = await db.execute(sql.raw(query, [req.session.userId]));
      
      console.log('Raw user certifications query result:', result.rows);
      
      // Transform the result to match expected format
      const userCertifications = result.rows.map((row: any) => ({
        id: row.id,
        dateObtained: row.dateObtained,
        certificationNumber: row.certificationNumber,
        createdAt: row.createdAt,
        certification: {
          id: row.certificationId,
          name: row.certificationName,
          agency: row.agency,
          level: row.level,
          description: row.description
        }
      }));

      console.log('Processed user certifications:', userCertifications);
      
      res.json({ success: true, certifications: userCertifications });
    } catch (error: any) {
      console.error('=== CERTIFICATIONS GET ERROR ===');
      console.error('Error:', error);
      res.status(500).json({ success: false, message: "Failed to fetch user certifications", error: error.message });
    }
  });

  app.post('/api/users/certifications', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      console.log('Certification request body:', req.body);
      
      // Validate the basic structure first
      if (!req.body.certificationId) {
        return res.status(400).json({ success: false, message: "Certification ID is required" });
      }

      const certificationData = {
        certificationId: req.body.certificationId,
        dateObtained: req.body.dateObtained || null,
        certificationNumber: req.body.certificationNumber || null,
      };

      console.log('Processed certification data:', certificationData);

      // Verify the certification exists
      const certification = await storage.getCertification(certificationData.certificationId);
      if (!certification) {
        return res.status(400).json({ success: false, message: "Certification not found" });
      }

      // Add the user ID from session
      const userCertificationData = {
        ...certificationData,
        userId: req.session.userId
      };

      const userCertification = await storage.addUserCertification(userCertificationData);
      res.status(201).json({ success: true, certification: userCertification });
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ success: false, message: "You already have this certification" });
      }
      console.error('Error adding user certification:', error);
      res.status(500).json({ success: false, message: "Failed to add certification" });
    }
  });

  app.delete('/api/users/certifications/:id', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const certificationId = parseInt(req.params.id);
      if (isNaN(certificationId)) {
        return res.status(400).json({ success: false, message: "Invalid certification ID" });
      }

      const success = await storage.removeUserCertification(certificationId, req.session.userId);
      if (!success) {
        return res.status(404).json({ success: false, message: "Certification not found" });
      }

      res.json({ success: true, message: "Certification removed successfully" });
    } catch (error) {
      console.error('Error removing user certification:', error);
      res.status(500).json({ success: false, message: "Failed to remove certification" });
    }
  });

  // Lesson Progress endpoints
  
  // GET /api/progress - Get user's lesson progress
  app.get('/api/progress', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const progress = await storage.getUserLessonProgress(req.session.userId);
      res.json({ success: true, progress });
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      res.status(500).json({ success: false, message: "Failed to fetch progress" });
    }
  });

  // POST /api/progress/:lessonId - Mark a lesson as complete
  app.post('/api/progress/:lessonId', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const { lessonId } = req.params;
      
      // Mark lesson as complete
      const lessonProgress = await storage.markLessonComplete(req.session.userId, lessonId);
      
      // Check if this completion unlocks a category badge
      const badge = await storage.checkAndUnlockBadge(req.session.userId, lessonId);
      
      res.status(201).json({ 
        success: true, 
        progress: lessonProgress,
        badgeUnlocked: badge || null
      });
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ success: false, message: "Lesson already completed" });
      }
      console.error('Error marking lesson complete:', error);
      res.status(500).json({ success: false, message: "Failed to mark lesson complete" });
    }
  });

  // GET /api/badges - Get user's earned badges
  app.get('/api/badges', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const badges = await storage.getUserBadges(req.session.userId);
      res.json({ success: true, badges });
    } catch (error) {
      console.error('Error fetching badges:', error);
      res.status(500).json({ success: false, message: "Failed to fetch badges" });
    }
  });

  // Community Posts endpoints

  // GET /api/posts - Get all posts with filters
  app.get('/api/posts', async (req: Request, res: Response) => {
    try {
      const { sort, tag, location } = req.query;
      const posts = await storage.getAllPosts(sort as string, tag as string, location as string);
      res.json({ success: true, posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ success: false, message: "Failed to fetch posts" });
    }
  });

  // POST /api/posts - Create a new post
  app.post('/api/posts', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const validationResult = insertPostSchema.safeParse({
        ...req.body,
        userId: req.session.userId
      });

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors
        });
      }

      const post = await storage.createPost(validationResult.data);
      res.status(201).json({ success: true, post });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ success: false, message: "Failed to create post" });
    }
  });

  // POST /api/posts/:postId/like - Like/unlike a post
  app.post('/api/posts/:postId/like', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const postId = parseInt(req.params.postId);
      const result = await storage.togglePostLike(postId, req.session.userId);
      res.json({ success: true, liked: result.liked });
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({ success: false, message: "Failed to toggle like" });
    }
  });

  // GET /api/posts/:postId/comments - Get comments for a post
  app.get('/api/posts/:postId/comments', async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getPostComments(postId);
      res.json({ success: true, comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ success: false, message: "Failed to fetch comments" });
    }
  });

  // POST /api/posts/:postId/comments - Add a comment to a post
  app.post('/api/posts/:postId/comments', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const postId = parseInt(req.params.postId);
      const validationResult = insertPostCommentSchema.safeParse({
        postId,
        userId: req.session.userId,
        content: req.body.content
      });

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors
        });
      }

      const comment = await storage.createPostComment(validationResult.data);
      res.status(201).json({ success: true, comment });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ success: false, message: "Failed to create comment" });
    }
  });

  // Community Events endpoints

  // GET /api/events - Get all events with filters
  app.get('/api/events', async (req: Request, res: Response) => {
    try {
      const { location, date, type } = req.query;
      const events = await storage.getAllEvents(
        location as string,
        date as string,
        type as string
      );
      res.json({ success: true, events });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
  });

  // POST /api/events - Create a new event
  app.post('/api/events', async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const validationResult = insertEventSchema.safeParse({
        ...req.body,
        userId: req.session.userId
      });

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors
        });
      }

      const event = await storage.createEvent(validationResult.data);
      res.status(201).json({ success: true, event });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ success: false, message: "Failed to create event" });
    }
  });

  // GET /api/events/:eventId - Get event details
  app.get('/api/events/:eventId', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const event = await storage.getEventById(eventId);
      
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      res.json({ success: true, event });
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ success: false, message: "Failed to fetch event" });
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
