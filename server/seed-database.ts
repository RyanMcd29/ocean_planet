import { db } from './db';
import { diveSites, species, diveSiteSpecies, nearbyDiveSites, diveCenters } from "@shared/schema";

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Check if we already have data
    const existingDiveSites = await db.select().from(diveSites);
    
    if (existingDiveSites.length > 0) {
      console.log('Database already contains data, skipping seed.');
      return;
    }
    
    // Seed sample dive sites
    console.log('Adding sample dive sites...');
    const [greatBarrierReef] = await db.insert(diveSites).values({
      name: "Great Barrier Reef",
      difficulty: "Intermediate",
      description: "The largest coral reef system composed of over 2,900 individual reefs and 900 islands.",
      location: "Queensland",
      country: "Australia",
      latitude: -18.2871,
      longitude: 147.7000,
      current: "Moderate",
      minDepth: 5,
      maxDepth: 30,
      visibility: "Excellent",
      bestTimeToVisit: "June to October",
      temperature: "21°C to 29°C",
      marineLifeRichness: "Extremely High",
      habitats: ["Coral Reef", "Shallow Reef", "Wall Dive"]
    }).returning();

    const [bluehole] = await db.insert(diveSites).values({
      name: "Great Blue Hole",
      difficulty: "Advanced",
      description: "A giant marine sinkhole and world-class diving destination for experienced divers.",
      location: "Lighthouse Reef",
      country: "Belize",
      latitude: 17.3158,
      longitude: -87.5347,
      current: "Minimal",
      minDepth: 15,
      maxDepth: 125,
      visibility: "Very Good",
      bestTimeToVisit: "April to June",
      temperature: "26°C to 28°C",
      marineLifeRichness: "Moderate",
      habitats: ["Blue Hole", "Wall Dive", "Deep Dive"]
    }).returning();

    const [tubbataha] = await db.insert(diveSites).values({
      name: "Tubbataha Reefs",
      difficulty: "Intermediate to Advanced",
      description: "A protected marine sanctuary home to a vast array of marine life and pristine coral reefs.",
      location: "Sulu Sea",
      country: "Philippines",
      latitude: 8.8016,
      longitude: 119.8858,
      current: "Strong",
      minDepth: 10,
      maxDepth: 40,
      visibility: "Excellent",
      bestTimeToVisit: "March to June",
      temperature: "26°C to 30°C",
      marineLifeRichness: "Extremely High",
      habitats: ["Coral Reef", "Wall Dive", "Atoll"]
    }).returning();
    
    // Seed sample species
    console.log('Adding sample marine species...');
    const [clownfish] = await db.insert(species).values({
      commonName: "Clownfish",
      scientificName: "Amphiprioninae",
      description: "Small, brightly colored fish known for their symbiotic relationship with sea anemones.",
      conservationStatus: "Least Concern",
      habitats: ["Coral Reef", "Shallow Reef"],
      imageUrl: "https://images.unsplash.com/photo-1576806021995-9f68eb39f10b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Fish"
    }).returning();

    const [greenSeaTurtle] = await db.insert(species).values({
      commonName: "Green Sea Turtle",
      scientificName: "Chelonia mydas",
      description: "Large sea turtle with a heart-shaped shell and small head. Named for the green fat beneath its shell.",
      conservationStatus: "Endangered",
      habitats: ["Coral Reef", "Seagrass Beds", "Open Ocean"],
      imageUrl: "https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Reptile"
    }).returning();

    const [reefShark] = await db.insert(species).values({
      commonName: "Reef Shark",
      scientificName: "Carcharhinus melanopterus",
      description: "Medium-sized shark easily identified by the black tips on its fins. Common around coral reefs.",
      conservationStatus: "Near Threatened",
      habitats: ["Coral Reef", "Shallow Reef", "Reef Drop-offs"],
      imageUrl: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Shark"
    }).returning();

    const [mantaRay] = await db.insert(species).values({
      commonName: "Manta Ray",
      scientificName: "Mobula birostris",
      description: "One of the largest rays with a wingspan reaching up to 7 meters. Known for their intelligence and graceful swimming.",
      conservationStatus: "Vulnerable",
      habitats: ["Open Ocean", "Reef Drop-offs", "Cleaning Stations"],
      imageUrl: "https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Ray"
    }).returning();
    
    // Associate species with dive sites
    console.log('Associating species with dive sites...');
    await db.insert(diveSiteSpecies).values({
      diveSiteId: greatBarrierReef.id,
      speciesId: clownfish.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: greatBarrierReef.id,
      speciesId: greenSeaTurtle.id,
      frequency: "Frequent"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: greatBarrierReef.id,
      speciesId: reefShark.id,
      frequency: "Occasional"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: bluehole.id,
      speciesId: reefShark.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: bluehole.id,
      speciesId: mantaRay.id,
      frequency: "Rare"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: tubbataha.id,
      speciesId: clownfish.id,
      frequency: "Abundant"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: tubbataha.id,
      speciesId: greenSeaTurtle.id,
      frequency: "Common"
    });

    await db.insert(diveSiteSpecies).values({
      diveSiteId: tubbataha.id,
      speciesId: mantaRay.id,
      frequency: "Occasional"
    });
    
    // Add nearby dive sites
    console.log('Adding nearby dive site relationships...');
    await db.insert(nearbyDiveSites).values({
      diveSiteId: greatBarrierReef.id,
      nearbyDiveSiteId: tubbataha.id,
      distance: 4500
    });

    await db.insert(nearbyDiveSites).values({
      diveSiteId: bluehole.id,
      nearbyDiveSiteId: tubbataha.id,
      distance: 3200
    });
    
    // Add dive centers
    console.log('Adding dive centers...');
    await db.insert(diveCenters).values({
      name: "GBR Dive Adventures",
      diveSiteId: greatBarrierReef.id,
      description: "Premier dive operator for Great Barrier Reef expeditions.",
      certification: "PADI 5-Star",
      contactInfo: "info@gbrdive.com",
      iconType: "padi"
    });

    await db.insert(diveCenters).values({
      name: "Blue Hole Exploration",
      diveSiteId: bluehole.id,
      description: "Specialized in technical diving at the Great Blue Hole.",
      certification: "NAUI & TDI",
      contactInfo: "dive@bluehole-explore.com",
      iconType: "naui"
    });

    await db.insert(diveCenters).values({
      name: "Tubbataha Voyages",
      diveSiteId: tubbataha.id,
      description: "Liveaboard expeditions to Tubbataha Reefs Natural Park.",
      certification: "PADI & SSI",
      contactInfo: "booking@tubbatahavoyages.com",
      iconType: "ssi"
    });

    // Seed water conditions
    await seedWaterConditions();

    // Add educational content for the Learn feature
    console.log('Database seeding complete!');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function seedWaterConditions() {
  console.log('Seeding water conditions...');
  
  // Great Barrier Reef current conditions
  await storage.createWaterConditions({
    diveSiteId: 1,
    waterTemp: 26,
    visibility: 30,
    currentStrength: 'Light',
    currentDirection: 'Southeast',
    waveHeight: 1.2,
    windSpeed: 15,
    windDirection: 'Northeast',
    weatherConditions: 'Partly cloudy',
    surfaceConditions: 'Calm',
    divingConditions: 'Excellent',
    reportedBy: 'Marine Weather Station',
    additionalNotes: 'Perfect conditions for diving. High visibility and calm seas.'
  });

  // Blue Hole current conditions
  await storage.createWaterConditions({
    diveSiteId: 2,
    waterTemp: 24,
    visibility: 45,
    currentStrength: 'Moderate',
    currentDirection: 'East',
    waveHeight: 0.8,
    windSpeed: 12,
    windDirection: 'East',
    weatherConditions: 'Sunny',
    surfaceConditions: 'Smooth',
    divingConditions: 'Excellent',
    reportedBy: 'Dive Center Belize',
    additionalNotes: 'Crystal clear water with excellent visibility. Light current at depth.'
  });

  // Tubbataha Reefs current conditions
  await storage.createWaterConditions({
    diveSiteId: 3,
    waterTemp: 28,
    visibility: 25,
    currentStrength: 'Strong',
    currentDirection: 'Southwest',
    waveHeight: 2.1,
    windSpeed: 22,
    windDirection: 'Southwest',
    weatherConditions: 'Partly cloudy',
    surfaceConditions: 'Choppy',
    divingConditions: 'Good',
    reportedBy: 'Philippine Coast Guard',
    additionalNotes: 'Strong currents present. Recommended for experienced divers only.'
  });

  // Roe Reef current conditions
  await storage.createWaterConditions({
    diveSiteId: 4,
    waterTemp: 18,
    visibility: 15,
    currentStrength: 'Light',
    currentDirection: 'West',
    waveHeight: 1.5,
    windSpeed: 18,
    windDirection: 'Southwest',
    weatherConditions: 'Cloudy',
    surfaceConditions: 'Moderate',
    divingConditions: 'Fair',
    reportedBy: 'Perth Diving Club',
    additionalNotes: 'Cooler water temperature typical for Perth winter. Reduced visibility due to recent storms.'
  });
}

// Export the seed function so it can be called from elsewhere
export { seedDatabase };