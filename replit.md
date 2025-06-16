# Ocean Planet - Dive Site Discovery & Marine Conservation Platform

## Overview

Ocean Planet is a full-stack web application designed to connect ocean enthusiasts with dive sites worldwide while promoting marine conservation and education. The platform combines an interactive dive site map with comprehensive species information, educational content, and citizen science features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom ocean-themed color palette
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Maps**: Leaflet integration for interactive dive site visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful architecture with structured endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Session-based authentication (infrastructure prepared)
- **File Uploads**: Integrated photo upload system for user-generated content

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Schema**: Comprehensive marine life and dive site data models
- **Key Tables**: 
  - Users (authentication and profiles)
  - Dive sites (locations, conditions, metadata)
  - Species (marine life classification and information)
  - Photos (user-generated content)
  - Reviews and ratings
  - Dive logs and species sightings

## Key Components

### Interactive Map System
- **Clustering**: Dynamic clustering based on zoom levels for performance
- **Real-time Data**: Integration with ocean data services for current conditions
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Performance**: Optimized rendering for large datasets

### Educational Platform
- **Micro-lessons**: Bite-sized educational content on marine conservation
- **Interactive Learning**: Step-by-step lessons with quizzes and assessments
- **Progress Tracking**: User progress and achievement system
- **Conservation Focus**: Emphasis on ocean literacy and environmental awareness

### Species Database
- **Comprehensive Catalog**: Detailed marine species information
- **Search and Filtering**: Advanced search capabilities with multiple criteria
- **Conservation Status**: Integration of IUCN Red List status and conservation information
- **User Contributions**: Citizen science features for species sightings

### Community Features
- **Dive Logging**: Comprehensive dive log system with species tracking
- **Photo Sharing**: User-generated content with moderation capabilities
- **Reviews and Ratings**: Community-driven dive site evaluations
- **Social Features**: User profiles, favorites, and community interactions

## Data Flow

### Client-Server Communication
1. **API Layer**: RESTful endpoints for all data operations
2. **Query Management**: TanStack Query handles caching, synchronization, and error states
3. **Real-time Updates**: Optimistic updates for better user experience
4. **Error Handling**: Comprehensive error boundaries and user feedback

### Database Operations
1. **Type Safety**: Drizzle ORM provides end-to-end type safety
2. **Connection Pooling**: Optimized database connections for serverless deployment
3. **Migrations**: Version-controlled database schema changes
4. **Seed Data**: Comprehensive sample data for development and testing

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **leaflet**: Interactive maps functionality
- **@radix-ui/***: Accessible UI component primitives

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-***: Replit-specific development enhancements

### External Services
- **Ocean Data APIs**: Integration with Australian Ocean Data Network (AODN) for real-time conditions
- **Image Hosting**: Unsplash integration for placeholder images
- **Conservation Data**: IUCN Red List integration for species conservation status

## Deployment Strategy

### Development Environment
- **Runtime**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 with automatic provisioning
- **Hot Reload**: Vite HMR for rapid development
- **Environment Variables**: Secure configuration management

### Production Deployment
- **Build Process**: Vite builds client assets, esbuild bundles server
- **Autoscale Deployment**: Configured for Replit's autoscale infrastructure
- **Static Assets**: Optimized asset serving with proper MIME types
- **Database**: Production-ready PostgreSQL with connection pooling

### Performance Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: WebP format support with fallbacks
- **Caching**: Strategic caching for API responses and static assets
- **Bundle Analysis**: Optimized bundle sizes for fast loading

## Changelog

Changelog:
- June 16, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.