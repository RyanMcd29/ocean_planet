import { db } from './db';
import { diveSites } from '../shared/schema';

// Parse coordinate string like "32°07'27.9"S 115°45'26.0"E" to decimal degrees
function parseCoordinates(coordStr: string): { latitude: number; longitude: number } {
  const regex = /(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/;
  const match = coordStr.match(regex);
  
  if (!match) {
    throw new Error(`Invalid coordinate format: ${coordStr}`);
  }

  const [, latDeg, latMin, latSec, latHem, lonDeg, lonMin, lonSec, lonHem] = match;
  
  let latitude = parseInt(latDeg) + parseInt(latMin)/60 + parseFloat(latSec)/3600;
  let longitude = parseInt(lonDeg) + parseInt(lonMin)/60 + parseFloat(lonSec)/3600;
  
  if (latHem === 'S') latitude = -latitude;
  if (lonHem === 'W') longitude = -longitude;
  
  return { latitude, longitude };
}

export async function addPerthDiveSites() {
  console.log('Adding Perth dive sites...');

  const perthDiveSites = [
    {
      name: "AMMO Jetty",
      description: "A shore-based jetty dive featuring concrete pylons encrusted with marine growth and abundant macro-life. Located near Fremantle, this site offers diverse leatherjackets, pygmy filefish, crested morwong schools, boxfish, flatworms, anemones, and occasional rays. The silty rubble seabed creates an artificial reef environment perfect for macro photography.",
      location: "Fremantle, Western Australia",
      country: "Australia",
      coordinates: "32°07'27.9\"S 115°45'26.0\"E",
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 9,
      minVisibility: 1,
      maxVisibility: 15,
      minTemp: 16,
      maxTemp: 22,
      current: "Mild",
      bestSeason: "Year-round with optimal conditions in stable weather",
      peakVisibilityMonth: "Varies with weather",
      conservationStatus: "Protected",
      conservationInfo: "Located in John Graham Reserve, adjacent to marine park amenities. Regular clean-ups by local dive shops maintain site health.",
      mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Macro photography hotspot", "Artificial reef ecosystem", "Easy jetty access", "Night diving opportunities"],
      habitats: ["Jetty pylons", "Silty rubble", "Artificial reef", "Shallow water"]
    },
    {
      name: "Blackwall Reach",
      description: "A unique freshwater-estuarine dive site along the Swan River featuring submerged urban wrecks including cars and barges. This urban wreck reef offers diverse riverine species including bream, stripeys, jellyfish, and tube worms. The site provides an unusual diving experience with eerie underwater structures and surprising biodiversity.",
      location: "Swan River, Perth, Western Australia",
      country: "Australia",
      coordinates: "32°01'16.4\"S 115°46'58.9\"E",
      difficulty: "Intermediate",
      minDepth: 5,
      maxDepth: 15,
      minVisibility: 1,
      maxVisibility: 5,
      minTemp: 16,
      maxTemp: 22,
      current: "Mild",
      bestSeason: "Cool, calm weather avoiding post-rainfall periods",
      peakVisibilityMonth: "Dry season",
      conservationStatus: "Recreational Reserve",
      conservationInfo: "Located within recreational reserve. Divers must use surface marker buoy and be cautious of watercraft traffic.",
      mainImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Urban wreck diving", "Freshwater-estuarine ecosystem", "Unique underwater structures", "Diverse riverine species"],
      habitats: ["Urban wrecks", "Silty bottom", "Freshwater-estuarine", "Artificial structures"]
    },
    {
      name: "Bulk Jetty",
      description: "An industrial jetty dive in Kwinana offering excellent marine biodiversity despite its industrial setting. The site features schools of scalyfin, bullseyes, and herring, along with octopuses, seahorses, and cuttlefish hiding among the pylons. Nudibranchs and soft corals colonize the pylon structures creating a vibrant artificial reef ecosystem.",
      location: "Kwinana, Western Australia",
      country: "Australia",
      coordinates: "32°12'36.0\"S 115°46'02.3\"E",
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 10,
      minVisibility: 5,
      maxVisibility: 10,
      minTemp: 18,
      maxTemp: 24,
      current: "Mild",
      bestSeason: "Low wind conditions, early morning optimal",
      peakVisibilityMonth: "Calm weather periods",
      conservationStatus: "General Protection",
      conservationInfo: "Standard marine protection rules apply. Avoid disturbing marine organisms and be cautious of boat traffic.",
      mainImage: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Industrial marine ecology", "Cephalopod sightings", "Artificial reef system", "Easy access"],
      habitats: ["Industrial jetty", "Artificial reef", "Pylon structures", "Sandy bottom"]
    },
    {
      name: "Camilla Wreck",
      description: "A shallow historic wreck dive in Cockburn Sound, ideal for beginners and snorkelers. The wreck remains lie in just 3.6 meters of water, surrounded by paddle grass and sandy seabed. Small schools of stripeys, cardinalfish, and grubfish inhabit the area, along with sea anemones and occasional octopus sightings.",
      location: "Cockburn Sound, Kwinana, Western Australia",
      country: "Australia",
      coordinates: "32°11'15.6\"S 115°46'27.2\"E",
      difficulty: "Beginner",
      minDepth: 2,
      maxDepth: 4,
      minVisibility: 3,
      maxVisibility: 8,
      minTemp: 18,
      maxTemp: 24,
      current: "Minimal",
      bestSeason: "Calm weather conditions",
      peakVisibilityMonth: "Stable weather periods",
      conservationStatus: "Protected",
      conservationInfo: "Protected under Maritime Legislation. Divers must not disturb or remove artifacts from the wreck site.",
      mainImage: "https://images.unsplash.com/photo-1555169062-013468b47731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Historic wreck diving", "Shallow water perfect for beginners", "Paddle grass habitat", "Protected heritage site"],
      habitats: ["Historic wreck", "Paddle grass beds", "Sandy seabed", "Shallow water"]
    },
    {
      name: "Kwinana Grain Terminal",
      description: "An industrial dive site featuring the underwater infrastructure of the grain terminal. This unique site offers divers the chance to explore industrial maritime structures while observing how marine life adapts to and colonizes artificial environments in an active port setting.",
      location: "Kwinana, Western Australia",
      country: "Australia",
      coordinates: "32°12'00.0\"S 115°46'30.0\"E", // Approximate coordinates
      difficulty: "Intermediate",
      minDepth: 5,
      maxDepth: 12,
      minVisibility: 4,
      maxVisibility: 10,
      minTemp: 18,
      maxTemp: 24,
      current: "Moderate",
      bestSeason: "Low commercial activity periods",
      peakVisibilityMonth: "Calm weather",
      conservationStatus: "Industrial Zone",
      conservationInfo: "Special permissions required for diving in active port areas. Coordinate with port authorities.",
      mainImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Industrial marine infrastructure", "Unique port environment", "Marine colonization study", "Advanced dive planning required"],
      habitats: ["Industrial structures", "Port environment", "Artificial substrate", "Deep water"]
    },
    {
      name: "Long Jetty",
      description: "A traditional jetty dive offering reliable marine encounters in a sheltered environment. The extended jetty structure provides habitat for various fish species, crustaceans, and invertebrates. The site offers good conditions for underwater photography and marine observation.",
      location: "Perth Region, Western Australia",
      country: "Australia",
      coordinates: "32°10'00.0\"S 115°45'00.0\"E", // Approximate coordinates
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 8,
      minVisibility: 5,
      maxVisibility: 12,
      minTemp: 16,
      maxTemp: 22,
      current: "Mild",
      bestSeason: "Year-round with optimal calm conditions",
      peakVisibilityMonth: "Stable weather periods",
      conservationStatus: "General Protection",
      conservationInfo: "Standard marine protection guidelines apply. Respect marine life and maintain good buoyancy control.",
      mainImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Extended jetty structure", "Sheltered diving conditions", "Good for photography", "Reliable marine encounters"],
      habitats: ["Jetty pylons", "Sheltered waters", "Artificial reef", "Sandy bottom"]
    },
    {
      name: "MAAC",
      description: "A specialized dive site associated with the Marine and Aquatic Activity Centre, offering structured diving experiences with educational components. The site provides opportunities for training dives and marine observation in a controlled environment.",
      location: "Perth Region, Western Australia",
      country: "Australia",
      coordinates: "32°08'00.0\"S 115°44'00.0\"E", // Approximate coordinates
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 10,
      minVisibility: 5,
      maxVisibility: 15,
      minTemp: 16,
      maxTemp: 22,
      current: "Minimal",
      bestSeason: "Year-round training availability",
      peakVisibilityMonth: "Calm conditions",
      conservationStatus: "Educational Reserve",
      conservationInfo: "Managed for educational purposes. Follow center guidelines and respect training activities.",
      mainImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Educational dive center", "Training facilities", "Structured dive programs", "Marine education"],
      habitats: ["Training environment", "Controlled conditions", "Educational setup", "Shallow water"]
    },
    {
      name: "Mettams Pool",
      description: "A natural rock pool formation creating a unique shallow water dive environment. This sheltered site offers excellent conditions for beginning divers and snorkelers, with calm waters and interesting rock formations providing habitat for various marine species.",
      location: "Perth Region, Western Australia",
      country: "Australia",
      coordinates: "31°54'00.0\"S 115°45'00.0\"E", // Approximate coordinates
      difficulty: "Beginner",
      minDepth: 1,
      maxDepth: 6,
      minVisibility: 8,
      maxVisibility: 15,
      minTemp: 18,
      maxTemp: 24,
      current: "Minimal",
      bestSeason: "Year-round, especially summer",
      peakVisibilityMonth: "Summer months",
      conservationStatus: "Natural Reserve",
      conservationInfo: "Protected natural formation. Minimal impact diving practices required.",
      mainImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Natural rock pool", "Excellent beginner site", "Calm sheltered waters", "Unique geological formation"],
      habitats: ["Rock pools", "Natural formations", "Shallow reef", "Sheltered environment"]
    },
    {
      name: "North Mole",
      description: "A historic breakwater structure offering diverse marine habitats along its length. The North Mole provides shelter and structure for various fish species, invertebrates, and marine plants. The site offers different diving experiences depending on the section explored.",
      location: "Fremantle, Western Australia",
      country: "Australia",
      coordinates: "32°03'30.0\"S 115°44'30.0\"E", // Approximate coordinates
      difficulty: "Intermediate",
      minDepth: 5,
      maxDepth: 15,
      minVisibility: 5,
      maxVisibility: 12,
      minTemp: 16,
      maxTemp: 22,
      current: "Moderate",
      bestSeason: "Calm weather conditions",
      peakVisibilityMonth: "Stable weather periods",
      conservationStatus: "Historic Structure",
      conservationInfo: "Historic breakwater with heritage value. Respect structure and avoid damage to historic elements.",
      mainImage: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Historic breakwater", "Diverse marine habitats", "Varying dive conditions", "Heritage structure"],
      habitats: ["Breakwater structure", "Rocky substrate", "Artificial reef", "Variable depths"]
    },
    {
      name: "Omeo Wreck",
      description: "A historic steamship wreck offering one of Perth's premier wreck diving experiences. The Omeo provides excellent structure for marine life colonization and offers divers the opportunity to explore a significant piece of maritime history while observing the transformation of artificial reef environments.",
      location: "Perth Waters, Western Australia",
      country: "Australia",
      coordinates: "32°05'00.0\"S 115°45'00.0\"E", // Approximate coordinates
      difficulty: "Advanced",
      minDepth: 10,
      maxDepth: 25,
      minVisibility: 8,
      maxVisibility: 20,
      minTemp: 16,
      maxTemp: 22,
      current: "Moderate",
      bestSeason: "Calm weather, autumn-winter",
      peakVisibilityMonth: "Winter months",
      conservationStatus: "Historic Wreck",
      conservationInfo: "Protected historic wreck. No artifact removal permitted. Observe wreck diving safety protocols.",
      mainImage: "https://images.unsplash.com/photo-1555169062-013468b47731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Historic steamship wreck", "Significant maritime heritage", "Advanced wreck diving", "Excellent marine colonization"],
      habitats: ["Historic wreck", "Artificial reef", "Deep water", "Structured environment"]
    },
    {
      name: "Palm Beach Jetty",
      description: "A popular jetty dive site offering consistent marine encounters in a well-protected environment. The jetty structure provides excellent habitat for various fish species, with good visibility and easy access making it ideal for both beginners and experienced divers.",
      location: "Palm Beach, Western Australia",
      country: "Australia",
      coordinates: "32°07'00.0\"S 115°44'00.0\"E", // Approximate coordinates
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 8,
      minVisibility: 6,
      maxVisibility: 12,
      minTemp: 18,
      maxTemp: 24,
      current: "Mild",
      bestSeason: "Year-round with optimal summer conditions",
      peakVisibilityMonth: "Summer months",
      conservationStatus: "General Protection",
      conservationInfo: "Standard marine protection guidelines. Respect marine life and maintain environmental awareness.",
      mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Consistent marine encounters", "Well-protected environment", "Easy access", "Good visibility"],
      habitats: ["Jetty structure", "Protected waters", "Artificial reef", "Sandy bottom"]
    },
    {
      name: "Point Peron",
      description: "A scenic coastal dive site offering diverse underwater landscapes and marine habitats. Point Peron provides opportunities to explore reef systems, limestone formations, and varied marine ecosystems in a beautiful coastal setting.",
      location: "Rockingham, Western Australia",
      country: "Australia",
      coordinates: "32°17'00.0\"S 115°42'00.0\"E", // Approximate coordinates
      difficulty: "Intermediate",
      minDepth: 5,
      maxDepth: 18,
      minVisibility: 8,
      maxVisibility: 20,
      minTemp: 18,
      maxTemp: 24,
      current: "Moderate",
      bestSeason: "Calm weather conditions",
      peakVisibilityMonth: "Stable weather periods",
      conservationStatus: "Marine Reserve",
      conservationInfo: "Protected marine environment. Follow marine park guidelines and respect conservation zones.",
      mainImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Scenic coastal diving", "Diverse marine habitats", "Limestone formations", "Marine reserve protection"],
      habitats: ["Coastal reef", "Limestone formations", "Diverse ecosystems", "Protected environment"]
    },
    {
      name: "Robbs Jetty",
      description: "A well-established jetty dive site offering reliable marine encounters and good diving conditions. The jetty provides structured habitat for various species and offers excellent opportunities for underwater photography and marine observation.",
      location: "Perth Region, Western Australia",
      country: "Australia",
      coordinates: "32°08'30.0\"S 115°45'30.0\"E", // Approximate coordinates
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 10,
      minVisibility: 5,
      maxVisibility: 15,
      minTemp: 16,
      maxTemp: 22,
      current: "Mild",
      bestSeason: "Year-round with optimal calm conditions",
      peakVisibilityMonth: "Stable weather",
      conservationStatus: "General Protection",
      conservationInfo: "Standard marine protection applies. Maintain good diving practices and respect marine life.",
      mainImage: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Reliable marine encounters", "Good diving conditions", "Photography opportunities", "Structured habitat"],
      habitats: ["Jetty structure", "Artificial reef", "Various depths", "Marine colonization"]
    },
    {
      name: "Rockingham Wreck Trail",
      description: "A unique dive experience featuring multiple wreck sites along a designated trail. This advanced dive site offers the opportunity to explore several historic wrecks in one area, each providing different marine habitats and diving experiences.",
      location: "Rockingham, Western Australia",
      country: "Australia",
      coordinates: "32°16'00.0\"S 115°43'00.0\"E", // Approximate coordinates
      difficulty: "Advanced",
      minDepth: 12,
      maxDepth: 30,
      minVisibility: 10,
      maxVisibility: 25,
      minTemp: 16,
      maxTemp: 22,
      current: "Moderate to Strong",
      bestSeason: "Calm weather, experienced divers only",
      peakVisibilityMonth: "Winter months",
      conservationStatus: "Historic Wreck Trail",
      conservationInfo: "Protected historic wrecks. No artifact removal. Follow wreck diving safety protocols.",
      mainImage: "https://images.unsplash.com/photo-1555169062-013468b47731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Multiple historic wrecks", "Advanced wreck diving", "Designated trail system", "Diverse marine habitats"],
      habitats: ["Multiple wrecks", "Historic sites", "Artificial reefs", "Deep water"]
    },
    {
      name: "Rocky Bay",
      description: "A natural bay environment offering diverse marine habitats and excellent diving conditions. Rocky Bay provides opportunities to explore natural reef systems, rocky formations, and varied marine ecosystems in a protected coastal setting.",
      location: "Perth Region, Western Australia",
      country: "Australia",
      coordinates: "32°06'00.0\"S 115°44'00.0\"E", // Approximate coordinates
      difficulty: "Intermediate",
      minDepth: 5,
      maxDepth: 20,
      minVisibility: 8,
      maxVisibility: 18,
      minTemp: 16,
      maxTemp: 22,
      current: "Mild to Moderate",
      bestSeason: "Calm weather conditions",
      peakVisibilityMonth: "Stable weather periods",
      conservationStatus: "Natural Reserve",
      conservationInfo: "Protected natural environment. Follow minimal impact diving practices.",
      mainImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Natural bay environment", "Diverse marine habitats", "Rocky formations", "Protected coastal setting"],
      habitats: ["Natural reef", "Rocky formations", "Bay environment", "Protected waters"]
    },
    {
      name: "South Mole",
      description: "The counterpart to North Mole, this historic breakwater structure offers different diving experiences and marine habitats. South Mole provides varied underwater topography and serves as important habitat for marine life in the Fremantle area.",
      location: "Fremantle, Western Australia",
      country: "Australia",
      coordinates: "32°04'00.0\"S 115°44'00.0\"E", // Approximate coordinates
      difficulty: "Intermediate",
      minDepth: 5,
      maxDepth: 18,
      minVisibility: 6,
      maxVisibility: 15,
      minTemp: 16,
      maxTemp: 22,
      current: "Moderate",
      bestSeason: "Calm weather conditions",
      peakVisibilityMonth: "Stable weather periods",
      conservationStatus: "Historic Structure",
      conservationInfo: "Historic breakwater with heritage significance. Respect structure and marine environment.",
      mainImage: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Historic breakwater", "Varied underwater topography", "Marine habitat", "Heritage structure"],
      habitats: ["Breakwater structure", "Rocky substrate", "Artificial reef", "Historic environment"]
    },
    {
      name: "The Coombe Reserve",
      description: "A unique dive site within a protected coastal reserve offering pristine marine environments and diverse underwater landscapes. The site provides opportunities for conservation-focused diving and marine observation in a well-preserved ecosystem.",
      location: "Perth Region, Western Australia",
      country: "Australia",
      coordinates: "32°05'30.0\"S 115°43'30.0\"E", // Approximate coordinates
      difficulty: "Intermediate",
      minDepth: 8,
      maxDepth: 22,
      minVisibility: 10,
      maxVisibility: 20,
      minTemp: 16,
      maxTemp: 22,
      current: "Mild",
      bestSeason: "Year-round with optimal conditions",
      peakVisibilityMonth: "Calm weather periods",
      conservationStatus: "Protected Reserve",
      conservationInfo: "Strictly protected marine environment. Follow reserve guidelines and conservation protocols.",
      mainImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Protected coastal reserve", "Pristine marine environment", "Conservation focus", "Diverse underwater landscapes"],
      habitats: ["Protected reserve", "Pristine environment", "Natural reef", "Conservation area"]
    },
    {
      name: "Trigg Beach",
      description: "A popular beach dive site offering accessible shore diving with varied marine habitats. Trigg Beach provides opportunities to explore reef systems, sandy areas, and diverse marine life in a convenient coastal location.",
      location: "Trigg, Western Australia",
      country: "Australia",
      coordinates: "31°52'00.0\"S 115°45'00.0\"E", // Approximate coordinates
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 12,
      minVisibility: 8,
      maxVisibility: 15,
      minTemp: 18,
      maxTemp: 24,
      current: "Mild",
      bestSeason: "Year-round with optimal summer conditions",
      peakVisibilityMonth: "Summer months",
      conservationStatus: "General Protection",
      conservationInfo: "Standard marine protection guidelines. Respect beach environment and marine life.",
      mainImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Popular beach dive", "Accessible shore diving", "Varied marine habitats", "Convenient location"],
      habitats: ["Beach environment", "Reef systems", "Sandy areas", "Coastal waters"]
    },
    {
      name: "Waikiki Beach",
      description: "A scenic beach dive site offering excellent conditions for both beginners and experienced divers. Waikiki Beach provides diverse marine habitats including reef systems, sandy areas, and varied underwater topography in a beautiful coastal setting.",
      location: "Waikiki, Western Australia",
      country: "Australia",
      coordinates: "32°18'00.0\"S 115°42'00.0\"E", // Approximate coordinates
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 15,
      minVisibility: 10,
      maxVisibility: 18,
      minTemp: 18,
      maxTemp: 24,
      current: "Mild",
      bestSeason: "Year-round with optimal conditions",
      peakVisibilityMonth: "Summer months",
      conservationStatus: "General Protection",
      conservationInfo: "Standard marine protection applies. Maintain environmental awareness and respect marine life.",
      mainImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Scenic beach diving", "Excellent conditions", "Diverse marine habitats", "Beautiful coastal setting"],
      habitats: ["Beach environment", "Reef systems", "Sandy areas", "Varied topography"]
    },
    {
      name: "Woodman Point Groin",
      description: "A well-known dive site featuring a groin structure that provides excellent habitat for marine life. Located adjacent to recreational facilities, the site offers good diving conditions and diverse marine encounters in a convenient and accessible location.",
      location: "Woodman Point, Western Australia",
      country: "Australia",
      coordinates: "32°07'30.0\"S 115°45'00.0\"E", // Approximate coordinates
      difficulty: "Beginner",
      minDepth: 3,
      maxDepth: 10,
      minVisibility: 5,
      maxVisibility: 15,
      minTemp: 16,
      maxTemp: 22,
      current: "Mild",
      bestSeason: "Year-round with optimal calm conditions",
      peakVisibilityMonth: "Stable weather periods",
      conservationStatus: "General Protection",
      conservationInfo: "Standard marine protection guidelines. Adjacent to recreational facilities, maintain environmental awareness.",
      mainImage: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      highlights: ["Groin structure habitat", "Good diving conditions", "Diverse marine encounters", "Convenient access"],
      habitats: ["Groin structure", "Artificial reef", "Recreational area", "Protected waters"]
    }
  ];

  try {
    for (const site of perthDiveSites) {
      const { latitude, longitude } = parseCoordinates(site.coordinates);
      
      await db.insert(diveSites).values({
        name: site.name,
        description: site.description,
        location: site.location,
        country: site.country,
        latitude: latitude,
        longitude: longitude,
        difficulty: site.difficulty,
        minDepth: site.minDepth,
        maxDepth: site.maxDepth,
        minVisibility: site.minVisibility,
        maxVisibility: site.maxVisibility,
        minTemp: site.minTemp,
        maxTemp: site.maxTemp,
        current: site.current,
        bestSeason: site.bestSeason,
        peakVisibilityMonth: site.peakVisibilityMonth,
        conservationStatus: site.conservationStatus,
        conservationInfo: site.conservationInfo,
        mainImage: site.mainImage,
        highlights: site.highlights,
        habitats: site.habitats,
      });
      
      console.log(`✓ Added ${site.name}`);
    }
    
    console.log(`Successfully added ${perthDiveSites.length} Perth dive sites to the database!`);
  } catch (error) {
    console.error('Error adding Perth dive sites:', error);
    throw error;
  }
}

// Run the function if this file is executed directly
addPerthDiveSites()
  .then(() => {
    console.log('Perth dive sites addition completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to add Perth dive sites:', error);
    process.exit(1);
  });