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
  
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`Failed to fetch dive sites: ${res.statusText}`);
  }
  return await res.json() as DiveSite[];
}

export async function fetchDiveSite(id: number) {
  const res = await fetch(`/api/dive-sites/${id}`, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`Failed to fetch dive site: ${res.statusText}`);
  }
  return await res.json() as DiveSite;
}

export async function fetchDiveSiteSpecies(diveSiteId: number) {
  const res = await fetch(`/api/dive-sites/${diveSiteId}/species`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch species: ${res.statusText}`);
  return await res.json() as SpeciesWithFrequency[];
}

export async function fetchDiveSitePhotos(diveSiteId: number) {
  const res = await fetch(`/api/dive-sites/${diveSiteId}/photos`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch photos: ${res.statusText}`);
  return await res.json() as Photo[];
}

export async function fetchDiveSiteReviews(diveSiteId: number) {
  const res = await fetch(`/api/dive-sites/${diveSiteId}/reviews`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.statusText}`);
  return await res.json() as Review[];
}

export async function fetchNearbyDiveSites(diveSiteId: number) {
  const res = await fetch(`/api/dive-sites/${diveSiteId}/nearby`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch nearby sites: ${res.statusText}`);
  return await res.json() as NearbyDiveSiteWithDistance[];
}

export async function fetchDiveCenters(diveSiteId: number) {
  const res = await fetch(`/api/dive-sites/${diveSiteId}/dive-centers`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch dive centers: ${res.statusText}`);
  return await res.json() as DiveCenter[];
}

// API functions for species
export async function fetchSpecies(query: string = "") {
  const res = await fetch(`/api/species?q=${encodeURIComponent(query)}`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch species: ${res.statusText}`);
  return await res.json() as Species[];
}

export async function fetchSpeciesById(id: number) {
  const res = await fetch(`/api/species/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch species: ${res.statusText}`);
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
  const res = await fetch(`/api/users/${userId}/favorites`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch favorites: ${res.statusText}`);
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
  const res = await fetch(`/api/users/${userId}/spotted-species`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch spotted species: ${res.statusText}`);
  return await res.json();
}

// Fetch live ocean conditions from AODN
export async function fetchLiveConditions(diveSiteId: number) {
  const res = await fetch(`/api/dive-sites/${diveSiteId}/live-conditions`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch live conditions: ${res.statusText}`);
  return await res.json();
}

export async function fetchCourses() {
  const res = await fetch('/api/courses', { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch courses: ${res.statusText}`);
  const data = await res.json();
  return data.courses || [];
}

export async function fetchSpeciesLessons(speciesId: number) {
  const res = await fetch(`/api/species/${speciesId}/lessons`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch lessons for species: ${res.statusText}`);
  const data = await res.json();
  return data.lessons || [];
}

export async function fetchDiveSiteLessons(diveSiteId: number) {
  const res = await fetch(`/api/dive-sites/${diveSiteId}/lessons`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch lessons for dive site: ${res.statusText}`);
  const data = await res.json();
  return data.lessons || [];
}
