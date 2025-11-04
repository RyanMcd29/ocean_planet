# Production Deployment Fix Guide

## Problem
Your production deployment is **failing to start** because the DATABASE_URL environment variable is missing. This causes the server to crash immediately, which is why:
- The map shows "Failed to load dive sites"
- Login shows "Internal Server Error"  
- Species page shows errors

## Required Steps to Fix

### 1. Add DATABASE_URL to Production Secrets

Your production deployment needs a PostgreSQL database connection string.

**Option A: Use Replit's Built-in Database (Recommended)**
1. Go to your Replit deployment
2. In the Deployments pane, go to the "Configuration" tab
3. Look for database provisioning options
4. Enable the PostgreSQL database for your deployment
5. The DATABASE_URL will be automatically set

**Option B: Manual Secret Configuration**
If you already have a Neon database for production:
1. Go to Deployments → Configuration → Secrets
2. Add a new secret:
   - Key: `DATABASE_URL`
   - Value: Your Neon PostgreSQL connection string (starts with `postgresql://`)
3. Save the secret

### 2. Add SESSION_SECRET (Optional but Recommended)

For better security in production:
1. In Deployments → Configuration → Secrets
2. Add another secret:
   - Key: `SESSION_SECRET`
   - Value: Any random string (e.g., a long random password)
3. Save the secret

### 3. Republish Your Deployment

After adding the secrets:
1. Click the "Republish" button you mentioned seeing
2. Wait for the deployment to complete
3. The app should now work correctly

## How to Verify It's Working

After republishing, visit your production URL:
- **Home page** - Should show a map with blue dive site markers
- **Login page** - Should allow you to log in without errors
- **Species page** - Should show a grid of marine species

## Why This Happened

The development environment has DATABASE_URL automatically set by Replit, but production deployments need you to explicitly configure database access through the deployment settings.

## Need Help?

If you see "Republish" instead of "Publish", that's correct - you're updating an existing deployment. Just click Republish after adding the DATABASE_URL secret.
