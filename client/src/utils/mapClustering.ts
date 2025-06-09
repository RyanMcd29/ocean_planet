import { DiveSite } from "@shared/schema";

export interface RegionalCluster {
  id: string;
  regionName: string;
  sites: DiveSite[];
  centerLat: number;
  centerLng: number;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
           Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function clusterDiveSites(sites: DiveSite[], zoomLevel: number): {
  clusters: RegionalCluster[];
  individualSites: DiveSite[];
} {
  // Show individual sites at zoom 5+ (was 6, now lower threshold)
  if (zoomLevel >= 5) {
    return {
      clusters: [],
      individualSites: sites
    };
  }
  
  // Use distance-based clustering for lower zoom levels
  const clusters: RegionalCluster[] = [];
  const individualSites: DiveSite[] = [];
  const processed: Set<number> = new Set();
  
  // Cluster distance threshold based on zoom level
  const clusterDistance = zoomLevel <= 2 ? 2000 : zoomLevel <= 3 ? 1500 : 1000; // km
  
  sites.forEach((site, index) => {
    if (processed.has(index)) return;
    
    const nearbySites: DiveSite[] = [site];
    processed.add(index);
    
    // Find nearby sites
    sites.forEach((otherSite, otherIndex) => {
      if (processed.has(otherIndex) || index === otherIndex) return;
      
      const distance = calculateDistance(
        site.latitude, site.longitude,
        otherSite.latitude, otherSite.longitude
      );
      
      if (distance <= clusterDistance) {
        nearbySites.push(otherSite);
        processed.add(otherIndex);
      }
    });
    
    if (nearbySites.length === 1) {
      // Single site - show as individual marker
      individualSites.push(site);
    } else {
      // Multiple sites - create cluster
      const centerLat = nearbySites.reduce((sum, s) => sum + s.latitude, 0) / nearbySites.length;
      const centerLng = nearbySites.reduce((sum, s) => sum + s.longitude, 0) / nearbySites.length;
      
      // Generate region name based on first site's location
      const regionName = site.country || site.location.split(',').pop()?.trim() || "Regional Cluster";
      
      clusters.push({
        id: `cluster-${index}`,
        regionName: `${regionName} Region`,
        sites: nearbySites,
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