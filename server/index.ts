import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import FileStore from "session-file-store";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed-database";
import { db } from "./db";
import type { Server } from "http";

const app = express();

// Trust proxy for production (required for secure cookies behind reverse proxy)
if (process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT === '1') {
  app.set('trust proxy', 1);
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Configure sessions with persistent file store
const SessionFileStore = FileStore(session);

app.use(session({
  store: new SessionFileStore({
    path: './sessions',
    ttl: 86400, // 24 hours in seconds
    retries: 5,
    logFn: () => {} // Disable logging
  }),
  secret: process.env.SESSION_SECRET || 'ocean-planet-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT === '1', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: (process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT === '1') ? 'none' : 'lax', // Required for CORS in production
  }
}));

// Serve static files from attached_assets directory with proper MIME types
app.use('/attached_assets', express.static('attached_assets', {
  setHeaders: (res, path) => {
    if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    } else if (path.endsWith('.jpeg') || path.endsWith('.jpg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

// Serve uploaded files from uploads directory
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    } else if (path.endsWith('.jpeg') || path.endsWith('.jpg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function listenWithFallback(
  server: Server,
  startPort: number,
  host: string,
  reusePort?: boolean,
  maxAttempts = 5,
): Promise<number> {
  let port = startPort;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const onError = (err: NodeJS.ErrnoException) => {
          cleanup();
          reject(err);
        };

        const onListening = () => {
          cleanup();
          resolve();
        };

        function cleanup() {
          server.removeListener("error", onError);
          server.removeListener("listening", onListening);
        }

        server.once("error", onError);
        server.listen({ port, host, reusePort }, onListening);
      });

      return port;
    } catch (error: any) {
      if (error?.code === "EADDRINUSE") {
        const nextPort = port + 1;
        log(`port ${port} is in use, trying ${nextPort}`, "express");
        port = nextPort;
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `Unable to bind to a port after ${maxAttempts} attempts starting from ${startPort}`,
  );
}

(async () => {
  // Seed the database with initial data
  try {
    await seedDatabase();
    // Add missing columns to users table if they don't exist
  try {
    await db.execute(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS name text,
      ADD COLUMN IF NOT EXISTS lastname text,
      ADD COLUMN IF NOT EXISTS preferred_activity text,
      ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now(),
      ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now()
    `);
    
    // Update existing users with default values
    await db.execute(`
      UPDATE users SET 
        name = COALESCE(name, 'User'),
        lastname = COALESCE(lastname, 'Name'),
        preferred_activity = COALESCE(preferred_activity, 'diving'),
        created_at = COALESCE(created_at, now()),
        updated_at = COALESCE(updated_at, now())
      WHERE name IS NULL OR lastname IS NULL OR preferred_activity IS NULL
    `);
    
    console.log('User table migration completed');
  } catch (error: any) {
    console.log('User table migration may have already been completed or failed:', error.message);
  }

  // Add missing columns to dive_sites table if they don't exist
  try {
    await db.execute(`
      ALTER TABLE dive_sites 
      ADD COLUMN IF NOT EXISTS access_type text,
      ADD COLUMN IF NOT EXISTS entry_conditions text,
      ADD COLUMN IF NOT EXISTS surge_conditions text,
      ADD COLUMN IF NOT EXISTS seasonal_events text,
      ADD COLUMN IF NOT EXISTS unique_features text,
      ADD COLUMN IF NOT EXISTS user_experience_notes text,
      ADD COLUMN IF NOT EXISTS dive_site_layout text,
      ADD COLUMN IF NOT EXISTS conservation_park text,
      ADD COLUMN IF NOT EXISTS linked_lesson_id text
    `);
    
    console.log('Dive sites table migration completed');
  } catch (error: any) {
    console.log('Dive sites table migration may have already been completed or failed:', error.message);
  }

  // Link dive sites to their related lessons
  try {
    await db.execute(`
      UPDATE dive_sites 
      SET linked_lesson_id = 'camilla-wreck-maritime-history'
      WHERE name = 'Camilla Wreck'
    `);
    
    await db.execute(`
      UPDATE dive_sites 
      SET linked_lesson_id = 'long-jetty-maritime-history'
      WHERE name = 'Long Jetty (Ocean Jetty)'
    `);
    
    console.log('Dive site lesson links updated');
  } catch (error: any) {
    console.log('Error updating dive site lesson links:', error.message);
  }

  console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = Number(process.env.PORT) || 3000;
  const host = "0.0.0.0";
  const reusePort = process.env.REPLIT_DEPLOYMENT === "1";
  const port = await listenWithFallback(
    server,
    preferredPort,
    host,
    reusePort,
    10,
  );

  log(`serving on http://${host}:${port}`);
})();
