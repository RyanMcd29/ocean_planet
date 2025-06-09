import { DiveSite } from "@shared/schema";

export interface RegionalCluster {
  id: string;
  regionName: string;
  sites: DiveSite[];
  centerLat: number;
  centerLng: number;
}

// Define regional groupings based on geographic proximity
const REGIONAL_DEFINITIONS = [
  {
    name: "Great Barrier Reef Region",
    bounds: { minLat: -25, maxLat: -10, minLng: 140, maxLng: 155 },
    keywords: ["Great Barrier", "Queensland", "Australia"]
  },
  {
    name: "Caribbean Region",
    bounds: { minLat: 10, maxLat: 30, minLng: -90, maxLng: -60 },
    keywords: ["Belize", "Bahamas", "Caribbean"]
  },
  {
    name: "Indo-Pacific Region",
    bounds: { minLat: -15, maxLat: 15, minLng: 90, maxLng: 140 },
    keywords: ["Indonesia", "Malaysia", "Philippines", "Thailand", "Maldives"]
  },
  {
    name: "Pacific Islands",
    bounds: { minLat: -25, maxLat: 25, minLng: -180, maxLng: -120 },
    keywords: ["Hawaii", "French Polynesia", "Galapagos", "Costa Rica"]
  },
  {
    name: "Red Sea & Mediterranean",
    bounds: { minLat: 20, maxLat: 40, minLng: 30, maxLng: 50 },
    keywords: ["Egypt", "Red Sea"]
  },
  {
    name: "Southern Ocean",
    bounds: { minLat: -50, maxLat: -25, minLng: 20, maxLng: 40 },
    keywords: ["South Africa", "Aliwal"]
  },
  {
    name: "North Atlantic",
    bounds: { minLat: 60, maxLat: 70, minLng: -25, maxLng: -15 },
    keywords: ["Iceland", "Silfra"]
  },
  {
    name: "Southwest Pacific",
    bounds: { minLat: -45, maxLat: -30, minLng: 160, maxLng: 180 },
    keywords: ["New Zealand", "Vanuatu", "Poor Knights"]
  },
  {
    name: "Central America",
    bounds: { minLat: 15, maxLat: 25, minLng: -100, maxLng: -80 },
    keywords: ["Mexico", "Tulum", "Cenote"]
  },
  {
    name: "Micronesia",
    bounds: { minLat: 0, maxLat: 15, minLng: 130, maxLng: 140 },
    keywords: ["Palau"]
  }
];

function assignToRegion(site: DiveSite): string {
  // First try to match by bounds
  for (const region of REGIONAL_DEFINITIONS) {
    const { bounds } = region;
    if (site.latitude >= bounds.minLat && site.latitude <= bounds.maxLat &&
        site.longitude >= bounds.minLng && site.longitude <= bounds.maxLng) {
      return region.name;
    }
  }
  
  // Then try to match by keywords in location
  for (const region of REGIONAL_DEFINITIONS) {
    const locationText = `${site.location} ${site.country}`.toLowerCase();
    if (region.keywords.some(keyword => locationText.includes(keyword.toLowerCase()))) {
      return region.name;
    }
  }
  
  // Default fallback - create region based on general area
  if (site.latitude > 30) return "Northern Regions";
  if (site.latitude < -30) return "Southern Regions";
  if (site.longitude < -30) return "Atlantic Region";
  if (site.longitude > 100) return "Pacific Region";
  return "Other Regions";
}

export function clusterDiveSites(sites: DiveSite[], zoomLevel: number): {
  clusters: RegionalCluster[];
  individualSites: DiveSite[];
} {
  // Show individual sites at zoom 6+
  if (zoomLevel >= 6) {
    return {
      clusters: [],
      individualSites: sites
    };
  }
  
  // Group sites by region
  const regionGroups: { [key: string]: DiveSite[] } = {};
  
  sites.forEach(site => {
    const regionName = assignToRegion(site);
    if (!regionGroups[regionName]) {
      regionGroups[regionName] = [];
    }
    regionGroups[regionName].push(site);
  });
  
  const clusters: RegionalCluster[] = [];
  const individualSites: DiveSite[] = [];
  
  Object.entries(regionGroups).forEach(([regionName, regionSites]) => {
    if (regionSites.length === 1) {
      // Single site regions show as individual markers
      individualSites.push(...regionSites);
    } else {
      // Calculate center point for cluster
      const centerLat = regionSites.reduce((sum, site) => sum + site.latitude, 0) / regionSites.length;
      const centerLng = regionSites.reduce((sum, site) => sum + site.longitude, 0) / regionSites.length;
      
      clusters.push({
        id: regionName.replace(/\s+/g, '-').toLowerCase(),
        regionName,
        sites: regionSites,
        centerLat,
        centerLng
      });
    }
  });
  
  return { clusters, individualSites };
}

export function getRegionBounds(sites: DiveSite[]): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  const lats = sites.map(s => s.latitude);
  const lngs = sites.map(s => s.longitude);
  
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs)
  };
}