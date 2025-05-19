import { apiRequest } from "@/lib/queryClient";
import type { DiveSite, Species, DiveCenter, Photo, Review } from "@shared/schema";

// Type for species with frequency information
export interface SpeciesWithFrequency {
  species: Species;
  frequency: string;
}

// Type for nearby dive sites with distance information
export interface NearbyDiveSiteWithDistance {
  diveSite: DiveSite;
  distance: number;
}

// API functions for dive sites
export async function fetchDiveSites(query: string = "", filters?: Record<string, any>) {
  let url = `/api/dive-sites?q=${encodeURIComponent(query)}`;
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        url += `&${key}=${encodeURIComponent(value.toString())}`;
      }
    });
  }
  
  const res = await apiRequest("GET", url);
  return await res.json() as DiveSite[];
}

export async function fetchDiveSite(id: number) {
  const res = await apiRequest("GET", `/api/dive-sites/${id}`);
  return await res.json() as DiveSite;
}

export async function fetchDiveSiteSpecies(diveSiteId: number) {
  const res = await apiRequest("GET", `/api/dive-sites/${diveSiteId}/species`);
  return await res.json() as SpeciesWithFrequency[];
}

export async function fetchDiveSitePhotos(diveSiteId: number) {
  const res = await apiRequest("GET", `/api/dive-sites/${diveSiteId}/photos`);
  return await res.json() as Photo[];
}

export async function fetchDiveSiteReviews(diveSiteId: number) {
  const res = await apiRequest("GET", `/api/dive-sites/${diveSiteId}/reviews`);
  return await res.json() as Review[];
}

export async function fetchNearbyDiveSites(diveSiteId: number) {
  const res = await apiRequest("GET", `/api/dive-sites/${diveSiteId}/nearby`);
  return await res.json() as NearbyDiveSiteWithDistance[];
}

export async function fetchDiveCenters(diveSiteId: number) {
  const res = await apiRequest("GET", `/api/dive-sites/${diveSiteId}/dive-centers`);
  return await res.json() as DiveCenter[];
}

// API functions for species
export async function fetchSpecies(query: string = "") {
  const res = await apiRequest("GET", `/api/species?q=${encodeURIComponent(query)}`);
  return await res.json() as Species[];
}

export async function fetchSpeciesById(id: number) {
  const res = await apiRequest("GET", `/api/species/${id}`);
  return await res.json() as Species;
}

// API functions for user interaction
export async function uploadPhoto(photoData: FormData) {
  const res = await fetch('/api/photos', {
    method: 'POST',
    body: photoData,
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to upload photo');
  }
  
  return await res.json();
}

export async function addReview(reviewData: {
  userId: number;
  diveSiteId: number;
  rating: number;
  comment?: string;
}) {
  const res = await apiRequest("POST", `/api/reviews`, reviewData);
  return await res.json();
}

export async function toggleFavorite(userId: number, diveSiteId: number, isFavorite: boolean) {
  if (isFavorite) {
    const res = await apiRequest("DELETE", `/api/favorites`, { userId, diveSiteId });
    return await res.json();
  } else {
    const res = await apiRequest("POST", `/api/favorites`, { userId, diveSiteId });
    return await res.json();
  }
}

export async function fetchUserFavorites(userId: number) {
  const res = await apiRequest("GET", `/api/users/${userId}/favorites`);
  return await res.json() as DiveSite[];
}

export async function addSpottedSpecies(spottedData: {
  userId: number;
  speciesId: number;
  diveSiteId: number;
  photoId?: number;
  notes?: string;
}) {
  const res = await apiRequest("POST", `/api/spotted-species`, spottedData);
  return await res.json();
}

export async function fetchUserSpottedSpecies(userId: number) {
  const res = await apiRequest("GET", `/api/users/${userId}/spotted-species`);
  return await res.json();
}
