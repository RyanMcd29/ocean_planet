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
  
  const res = await apiRequest(url, { method: "GET" });
  return await res.json() as DiveSite[];
}

export async function fetchDiveSite(id: number) {
  const res = await apiRequest(`/api/dive-sites/${id}`, { method: "GET" });
  return await res.json() as DiveSite;
}

export async function fetchDiveSiteSpecies(diveSiteId: number) {
  const res = await apiRequest(`/api/dive-sites/${diveSiteId}/species`, { method: "GET" });
  return await res.json() as SpeciesWithFrequency[];
}

export async function fetchDiveSitePhotos(diveSiteId: number) {
  const res = await apiRequest(`/api/dive-sites/${diveSiteId}/photos`, { method: "GET" });
  return await res.json() as Photo[];
}

export async function fetchDiveSiteReviews(diveSiteId: number) {
  const res = await apiRequest(`/api/dive-sites/${diveSiteId}/reviews`, { method: "GET" });
  return await res.json() as Review[];
}

export async function fetchNearbyDiveSites(diveSiteId: number) {
  const res = await apiRequest(`/api/dive-sites/${diveSiteId}/nearby`, { method: "GET" });
  return await res.json() as NearbyDiveSiteWithDistance[];
}

export async function fetchDiveCenters(diveSiteId: number) {
  const res = await apiRequest(`/api/dive-sites/${diveSiteId}/dive-centers`, { method: "GET" });
  return await res.json() as DiveCenter[];
}

// API functions for species
export async function fetchSpecies(query: string = "") {
  const res = await apiRequest(`/api/species?q=${encodeURIComponent(query)}`, { method: "GET" });
  return await res.json() as Species[];
}

export async function fetchSpeciesById(id: number) {
  const res = await apiRequest(`/api/species/${id}`, { method: "GET" });
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
  const res = await apiRequest(`/api/reviews`, {
    method: "POST",
    body: JSON.stringify(reviewData)
  });
  return await res.json();
}

export async function toggleFavorite(userId: number, diveSiteId: number, isFavorite: boolean) {
  if (isFavorite) {
    const res = await apiRequest(`/api/favorites`, {
      method: "DELETE",
      body: JSON.stringify({ userId, diveSiteId })
    });
    return await res.json();
  } else {
    const res = await apiRequest(`/api/favorites`, {
      method: "POST",
      body: JSON.stringify({ userId, diveSiteId })
    });
    return await res.json();
  }
}

export async function fetchUserFavorites(userId: number) {
  const res = await apiRequest(`/api/users/${userId}/favorites`, { method: "GET" });
  return await res.json() as DiveSite[];
}

export async function addSpottedSpecies(spottedData: {
  userId: number;
  speciesId: number;
  diveSiteId: number;
  photoId?: number;
  notes?: string;
}) {
  const res = await apiRequest(`/api/spotted-species`, {
    method: "POST",
    body: JSON.stringify(spottedData)
  });
  return await res.json();
}

export async function fetchUserSpottedSpecies(userId: number) {
  const res = await apiRequest(`/api/users/${userId}/spotted-species`, { method: "GET" });
  return await res.json();
}

// Fetch live ocean conditions from AODN
export async function fetchLiveConditions(diveSiteId: number) {
  const res = await apiRequest(`/api/dive-sites/${diveSiteId}/live-conditions`, { method: "GET" });
  return await res.json();
}
