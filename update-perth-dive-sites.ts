import { db } from './server/db';
import { diveSites } from "@shared/schema";
import { eq } from 'drizzle-orm';

async function updatePerthDiveSites() {
  console.log('Updating Perth dive sites with comprehensive information...');

  try {
    // Update Kwinana Grain Terminal
    await db.update(diveSites).set({
      name: "Kwinana Grain Terminal",
      description: "The Kwinana Grain Terminal jetty extends into Cockburn Sound, creating an artificial reef environment with pylons encrusted in marine life. This 800-meter jetty offers 450 meters of diveable structure, providing excellent macro photography opportunities with abundant nudibranchs, seahorses, and cuttlefish. The industrial backdrop creates a unique diving experience in an artificial reef setting.",
      location: "Kwinana Beach, Western Australia",
      country: "Australia", 
      latitude: -32.2576,
      longitude: 115.7506,
      difficulty: "Intermediate",
      minDepth: 4,
      maxDepth: 15,
      minVisibility: 5,
      maxVisibility: 10,
      minTemp: 18,
      maxTemp: 24,
      current: "Mild",
      bestSeason: "Year-round, best in calm weather",
      peakVisibilityMonth: "April-October",
      conservationStatus: "Working grain terminal - respect industrial operations",
      conservationInfo: "Shore-based jetty dive with working grain terminal operations. Divers should avoid diving when large vessels are docked and follow safety protocols. The artificial reef environment supports diverse marine life despite industrial activities.",
      mainImage: "https://images.unsplash.com/photo-1573160813959-fc02eb5c3e58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Nudibranchs", "Seahorses", "Cuttlefish", "Blue Swimmer Crabs", "Razor Clams", "Sand Dollars", "Soft Corals", "Macro Photography"],
      habitats: ["Artificial Reef", "Sandy Bottom", "Jetty Pylons", "Industrial Marine Environment"]
    }).where(eq(diveSites.name, "Kwinana Grain Terminal"));

    // Update Long Jetty
    await db.update(diveSites).set({
      name: "Long Jetty (Ocean Jetty)",
      description: "Historic remnants of Fremantle's original port jetty at Bathers Beach, protected under the Maritime Archaeology Act of 1973. With approximately 30 visible pylons extending 65 meters and submerged sections reaching 170 meters, this shallow site offers glimpses into Fremantle's maritime history. While marine life is limited, it serves as an excellent training site for novice divers.",
      location: "Bathers Beach, Fremantle, Western Australia",
      country: "Australia",
      latitude: -32.0592,
      longitude: 115.7409,
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 5,
      minVisibility: 3,
      maxVisibility: 8,
      minTemp: 18,
      maxTemp: 24,
      current: "None",
      bestSeason: "Calm weather conditions",
      peakVisibilityMonth: "April-May, September-October",
      conservationStatus: "Historic site protected under Maritime Archaeology Act 1973",
      conservationInfo: "Protected historic dive site with archaeological significance. Divers must not disturb or collect artifacts. The site represents Fremantle's maritime heritage and requires respectful exploration. Limited marine life but important for historical understanding.",
      mainImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Historic Jetty Remains", "Maritime Archaeology", "Training Site", "Blennies", "White Mussels", "Buff Bream"],
      habitats: ["Historic Artificial Reef", "Sandy Bottom", "Sparse Seagrass", "Debris Field"]
    }).where(eq(diveSites.name, "Long Jetty"));

    // Update MAAC
    await db.update(diveSites).set({
      name: "MAAC (Marmion Angling & Aquatic Club)",
      description: "Located within Marmion Marine Park, Western Australia's first marine park established in 1987, MAAC offers natural limestone reef diving with diverse marine life. The site features accessible shore entry near a boat ramp, with reef formations extending to 7 meters depth. Known for occasional Weedy Sea Dragon sightings and abundant fish life including bream, morwong, and trevally.",
      location: "Marmion, Western Australia",
      country: "Australia",
      latitude: -31.8392,
      longitude: 115.7489,
      difficulty: "Beginner to Intermediate", 
      minDepth: 5,
      maxDepth: 7,
      minVisibility: 6,
      maxVisibility: 20,
      minTemp: 18,
      maxTemp: 24,
      current: "Minimal",
      bestSeason: "Low easterly winds, early mornings",
      peakVisibilityMonth: "March-May, September-November",
      conservationStatus: "Marmion Marine Park - Protected Marine Environment",
      conservationInfo: "Protected within Marmion Marine Park with strict conservation guidelines. Divers must respect marine life and habitats, avoid disturbing seagrass beds, and follow marine park regulations. The reef system supports diverse marine species including threatened Weedy Sea Dragons.",
      mainImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Weedy Sea Dragons", "Bream", "Red-lipped Morwong", "Trevally", "Staircase Sponges", "Egg Urchins", "Natural Limestone Reef"],
      habitats: ["Natural Limestone Reef", "Seagrass Beds", "Reef Overhangs", "Marine Park Environment"]
    }).where(eq(diveSites.name, "MAAC"));

    // Update Mettams Pool
    await db.update(diveSites).set({
      name: "Mettams Pool",
      description: "A natural limestone reef formation creating a sheltered lagoon with crystal-clear waters in North Beach. Part of Marmion Marine Park, this popular snorkeling and diving destination offers easy access from the beach with depths ranging from 1.5 to 7 meters. The protected lagoon environment provides excellent conditions for beginners and underwater photography enthusiasts.",
      location: "North Beach, Western Australia", 
      country: "Australia",
      latitude: -31.8673,
      longitude: 115.7520,
      difficulty: "Beginner",
      minDepth: 2,
      maxDepth: 7,
      minVisibility: 6,
      maxVisibility: 20,
      minTemp: 18,
      maxTemp: 24,
      current: "Minimal",
      bestSeason: "Calm weather, early mornings",
      peakVisibilityMonth: "March-May, September-October",
      conservationStatus: "Marmion Marine Park - Natural Lagoon Protection",
      conservationInfo: "Protected natural lagoon within Marmion Marine Park requiring careful environmental stewardship. The reef ecosystem supports juvenile fish populations and delicate marine communities. Divers should avoid contact with the reef and respect the shallow lagoon environment.",
      mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      highlights: ["Natural Lagoon", "Crystal Clear Waters", "Beginner Friendly", "Reef Fish", "Seagrass Meadows", "Protected Marine Environment"],
      habitats: ["Natural Lagoon", "Limestone Reef", "Seagrass Beds", "Shallow Marine Environment"]
    }).where(eq(diveSites.name, "Mettams Pool"));

    console.log('Perth dive sites updated successfully!');
    
  } catch (error) {
    console.error('Error updating Perth dive sites:', error);
    throw error;
  }
}

// Run the update
updatePerthDiveSites().then(() => {
  console.log('Update complete');
  process.exit(0);
}).catch(error => {
  console.error('Update failed:', error);
  process.exit(1);
});