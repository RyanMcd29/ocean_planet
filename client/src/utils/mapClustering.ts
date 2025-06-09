import { DiveSite } from "@shared/schema";

export interface RegionalCluster {
  id: string;
  regionName: string;
  sites: DiveSite[];
  centerLat: number;
  centerLng: number;
}

// Define regional groupings based on geographic proximity and keywords
const REGIONAL_DEFINITIONS = [
  {
    name: "Australian Waters",
    keywords: ["Australia", "Queensland", "Great Barrier", "Yongala"]
  },
  {
    name: "Caribbean Basin",
    keywords: ["Belize", "Bahamas", "Caribbean", "Blue Hole"]
  },
  {
    name: "Southeast Asia",
    keywords: ["Indonesia", "Malaysia", "Philippines", "Thailand", "Sipadan", "Raja Ampat", "Anilao", "Richelieu"]
  },
  {
    name: "Pacific Ocean",
    keywords: ["Hawaii", "French Polynesia", "Galapagos", "Costa Rica", "Cocos", "Rangiroa", "Kona", "Wolf", "Darwin"]
  },
  {
    name: "Red Sea",
    keywords: ["Egypt", "Red Sea", "Thistlegorm"]
  },
  {
    name: "Indian Ocean",
    keywords: ["Maldives", "South Ari", "Maaya"]
  },
  {
    name: "Southern Africa",
    keywords: ["South Africa", "Aliwal"]
  },
  {
    name: "North Atlantic",
    keywords: ["Iceland", "Silfra"]
  },
  {
    name: "Southwest Pacific",
    keywords: ["New Zealand", "Vanuatu", "Poor Knights", "Coolidge"]
  },
  {
    name: "Central America",
    keywords: ["Mexico", "Tulum", "Cenote"]
  },
  {
    name: "Micronesia",
    keywords: ["Palau", "Blue Corner"]
  },
  {
    name: "Caribbean Islands",
    keywords: ["Bonaire", "1000 Steps"]
  }
];

function assignToRegion(site: DiveSite): string {
  // Match by keywords in location, country, or site name
  for (const region of REGIONAL_DEFINITIONS) {
    const searchText = `${site.name} ${site.location} ${site.country}`.toLowerCase();
    if (region.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))) {
      return region.name;
    }
  }
  
  // Geographic fallback based on coordinates
  if (site.latitude > 60) return "Arctic Waters";
  if (site.latitude > 30 && site.longitude < -60) return "North Atlantic";
  if (site.latitude > 10 && site.latitude < 30 && site.longitude > -100 && site.longitude < -60) return "Caribbean Basin";
  if (site.latitude < -30 && site.longitude > 100) return "Southern Pacific";
  if (site.latitude < -20 && site.longitude > 20 && site.longitude < 50) return "Southern Africa";
  if (site.latitude > -10 && site.latitude < 20 && site.longitude > 60 && site.longitude < 100) return "Indian Ocean";
  if (site.longitude > 100 && site.longitude < 180) return "Western Pacific";
  if (site.longitude < -60) return "Eastern Pacific";
  
  return "Other Waters";
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
      // Calculate center point for cluster based on actual dive site locations
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