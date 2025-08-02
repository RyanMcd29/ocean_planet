# Ocean Planet - Diving Platform

## Overview

Ocean Planet is a comprehensive diving platform that connects ocean enthusiasts worldwide. It's built as a full-stack web application featuring an interactive map of dive sites, marine species identification, educational content, and community features. The platform serves as both an exploration tool for divers and an educational resource for ocean conservation.

## System Architecture

The application follows a modern full-stack architecture:

**Frontend**: React with TypeScript, built using Vite
- Component-based UI using shadcn/ui components
- Tailwind CSS for styling with ocean-themed color palette
- React Query for data fetching and state management
- Wouter for client-side routing

**Backend**: Express.js with TypeScript
- RESTful API architecture
- Session-based request handling
- Modular route organization

**Database**: PostgreSQL with Drizzle ORM
- Neon serverless PostgreSQL for scalable database hosting
- Type-safe database operations
- Migration support through Drizzle Kit

**Deployment**: Replit with autoscaling
- Development and production builds handled by npm scripts
- Static asset serving for images and attachments

## Key Components

### Database Schema
The application uses a comprehensive schema for diving-related data:
- **Users**: Account management with profiles and bio information
- **Dive Sites**: Location data with coordinates, depth ranges, conditions, and conservation info
- **Species**: Marine life catalog with identification details and conservation status
- **Photos**: User-generated content with dive site associations
- **Reviews**: Community feedback and ratings
- **Dive Logs**: Personal diving records with species sightings

### Frontend Architecture
- **Pages**: Route-based page components (Home, DiveSite, Species, Profile, etc.)
- **Components**: Reusable UI components organized by functionality
- **Interactive Map**: Leaflet-based mapping with clustering for dive sites
- **Educational Content**: Structured lessons and quizzes for ocean literacy

### API Structure
RESTful endpoints organized by resource:
- `/api/dive-sites` - Dive site CRUD operations with search and filtering
- `/api/species` - Marine species catalog management
- `/api/users` - User profile and favorites management
- `/api/photos` - Image upload and gallery features
- `/api/reviews` - Community review system

## Data Flow

1. **User Interaction**: Users interact with the React frontend components
2. **API Requests**: Frontend makes HTTP requests using React Query
3. **Route Processing**: Express.js routes handle incoming requests
4. **Data Layer**: Drizzle ORM manages database operations with PostgreSQL
5. **Response**: JSON data flows back through the same path
6. **UI Updates**: React Query manages cache and UI state updates

## External Dependencies

### Core Technologies
- **React 18**: Frontend framework with hooks and modern patterns
- **TypeScript**: Type safety across the entire stack
- **Drizzle ORM**: Database management with migrations
- **TailwindCSS**: Utility-first styling framework
- **Leaflet**: Interactive mapping functionality

### Third-party Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Unsplash**: Placeholder images for dive sites and species
- **shadcn/ui**: Pre-built accessible UI components

### Development Tools
- **Vite**: Fast development server and build tool
- **ESBuild**: Production bundling for server code
- **Replit**: Development environment and deployment platform

## Deployment Strategy

The application is configured for Replit's autoscaling deployment:

**Development**: 
- `npm run dev` starts the development server with hot reload
- Vite handles frontend compilation and serving
- TSX runs the TypeScript backend directly

**Production**:
- `npm run build` creates optimized client and server bundles
- Client assets are built to `dist/public`
- Server code is bundled with ESBuild to `dist/index.js`
- `npm run start` runs the production server

**Database Management**:
- `npm run db:push` applies schema changes to the database
- Migrations are handled through Drizzle Kit
- Connection pooling is configured for serverless environments

## Changelog

- June 16, 2025. Initial setup
- June 16, 2025. Enhanced lesson template system with consistent conversational style across all micro-lessons
- June 16, 2025. Updated mobile navigation: replaced Log button with Community, changed Species icon, added Log Dive buttons to dive site pages and Profile
- June 16, 2025. Created Ocean Literacy Principle 1 lesson with enhanced interactive format, 3 quizzes, and improved action items formatting
- June 16, 2025. Created Ocean Literacy Principle 2 lesson covering how ocean and marine life shape Earth's features, with 3 interactive quizzes and examples of coral reef islands, volcanic formations, and coastal erosion
- June 16, 2025. Expanded species database from ~60 to 477 unique marine species across 15+ categories including fish, sharks, mammals, crustaceans, mollusks, specialized groups, and microscopic life. Removed 24 duplicate entries to ensure database integrity.
- June 16, 2025. Added High Seas Treaty lesson covering the historic 2023 international agreement to protect ocean biodiversity in international waters. Follows enhanced lesson format with conversational style, 3 interactive quizzes, and comprehensive action items.
- January 7, 2025. Updated Blackwall Reach dive site with comprehensive information including detailed site overview, conditions, marine life, dive map details, and conservation info. Added 6 riverine species (Buffalo Bream, Jellyfish, Hermit Crab, Goby, Sea Anemone, Blue Crab) with frequency data. Implemented same layout structure as AMMO Jetty with urban wreck diving focus.
- January 9, 2025. Significantly expanded marine species database by adding comprehensive pinniped collection: 28 new species including seals, sea lions, fur seals, and walrus. Each species includes detailed descriptions with engaging fun facts about diving abilities, unique behaviors, and conservation status. Cleaned up duplicate entries to maintain database integrity.
- January 9, 2025. Added dedicated Fun Facts section to species detail pages with emoji icons and engaging information about unique behaviors, physical traits, and conservation status. Updated species schema to include funFacts field with structured data for enhanced educational content.
- January 9, 2025. Added 3 new whale research lessons: "Whale Science 101: Tracking Giants" (Beginner), "Tracking Tech: Innovation in Whale Science" (Intermediate), and "Ecosystem Guardians: Managing Krill and Whales" (Advanced). Lessons cover whale tracking technology, satellite tagging, sonobuoys, drone research, krill ecosystem management, and CCAMLR conservation policies. Total lesson count now at 20.
- January 10, 2025. Completed comprehensive update of 18 Perth dive sites with detailed information matching AMMO Jetty layout: Kwinana Grain Terminal, Long Jetty, MAAC, Mettams Pool, North Mole, Omeo Wreck, Palm Beach Jetty, Point Peron, Robbs Jetty, Rockingham Dive Trail, Rocky Bay, South Mole, The Coombe Reserve, Trigg Beach, Waikiki Beach, Woodman Point Groin, Wells Park Jetty, and Yanchep Lagoon. Updated all coordinates to correct decimal degrees, added comprehensive descriptions, conservation info, and species associations. Added 11 new marine species to support dive site updates.

## User Preferences

Preferred communication style: Simple, everyday language.