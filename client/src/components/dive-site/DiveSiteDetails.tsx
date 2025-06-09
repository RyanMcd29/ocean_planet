import React, { useState } from "react";
import { DiveSite, DiveCenter } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchDiveSiteSpecies, 
  fetchDiveCenters, 
  fetchNearbyDiveSites, 
  fetchDiveSitePhotos,
  fetchDiveSiteReviews, 
  type NearbyDiveSiteWithDistance,
  type SpeciesWithFrequency 
} from "@/lib/api";
import { Heart, Share2 } from "lucide-react";
import { Link } from "wouter";
import SpeciesTab from "./SpeciesTab";
import GalleryTab from "./GalleryTab";
import ReviewsTab from "./ReviewsTab";
import HabitatInfo from "./HabitatInfo";
import { Skeleton } from "@/components/ui/skeleton";
import PhotoGallery from "./PhotoGallery";
import WaterConditionsCard from "@/components/conditions/WaterConditionsCard";

interface DiveSiteDetailsProps {
  diveSite: DiveSite;
}

const DiveSiteDetails: React.FC<DiveSiteDetailsProps> = ({ diveSite }) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: species, isLoading: isLoadingSpecies } = useQuery({
    queryKey: [`/api/dive-sites/${diveSite.id}/species`],
    queryFn: () => fetchDiveSiteSpecies(diveSite.id),
  });
  
  const { data: diveCenters, isLoading: isLoadingDiveCenters } = useQuery({
    queryKey: [`/api/dive-sites/${diveSite.id}/dive-centers`],
    queryFn: () => fetchDiveCenters(diveSite.id),
  });
  
  const { data: nearbySites, isLoading: isLoadingNearbySites } = useQuery({
    queryKey: [`/api/dive-sites/${diveSite.id}/nearby`],
    queryFn: () => fetchNearbyDiveSites(diveSite.id),
  });
  
  const { data: photos } = useQuery({
    queryKey: [`/api/dive-sites/${diveSite.id}/photos`],
    queryFn: () => fetchDiveSitePhotos(diveSite.id),
  });

  const { data: waterConditions, isLoading: isLoadingConditions } = useQuery({
    queryKey: [`/api/dive-sites/${diveSite.id}/conditions`],
    queryFn: async () => {
      const response = await fetch(`/api/dive-sites/${diveSite.id}/conditions`);
      if (!response.ok) {
        throw new Error('Failed to fetch water conditions');
      }
      return response.json();
    },
  });
  
  const { data: reviews } = useQuery({
    queryKey: [`/api/dive-sites/${diveSite.id}/reviews`],
    queryFn: () => fetchDiveSiteReviews(diveSite.id),
  });
  
  return (
    <div className="bg-white shadow-md lg:overflow-y-auto lg:max-h-[calc(100vh-64px)]">
      {/* Header Image and Info */}
      <div className="relative">
        <img 
          src={diveSite.mainImage || 'https://images.unsplash.com/photo-1682687982501-1e58ab6d8433?q=80&w=1470&auto=format&fit=crop'}
          alt={`${diveSite.name} underwater scene`} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5">
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-[#05BFDB] text-white px-2 py-1 rounded text-xs font-montserrat">
              {diveSite.difficulty}
            </span>
            <span className="bg-[#088395] text-white px-2 py-1 rounded text-xs font-montserrat">
              {diveSite.minDepth}-{diveSite.maxDepth}m
            </span>
          </div>
          <h2 className="text-white text-2xl font-montserrat font-bold">{diveSite.name}</h2>
          <p className="text-white opacity-90 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {diveSite.location}
          </p>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white text-[#0A4D68] rounded-full h-9 w-9">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white text-[#0A4D68] rounded-full h-9 w-9">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-[#E0F7FA]">
        <div className="text-center">
          <p className="text-[#0A4D68] text-sm font-semibold">Visibility</p>
          <p className="text-lg font-montserrat font-bold">{diveSite.minVisibility}-{diveSite.maxVisibility}m</p>
        </div>
        <div className="text-center">
          <p className="text-[#0A4D68] text-sm font-semibold">Temperature</p>
          <p className="text-lg font-montserrat font-bold">{diveSite.minTemp}-{diveSite.maxTemp}°C</p>
        </div>
        <div className="text-center">
          <p className="text-[#0A4D68] text-sm font-semibold">Current</p>
          <p className="text-lg font-montserrat font-bold">{diveSite.current}</p>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b border-[#E0E0E0] rounded-none h-auto bg-transparent p-0">
          <TabsTrigger 
            value="overview" 
            className="px-4 py-3 font-montserrat rounded-none border-b-2 border-transparent data-[state=active]:border-[#EB6440] data-[state=active]:text-[#0A4D68] data-[state=active]:font-semibold text-[#757575] hover:text-[#0A4D68]"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="species" 
            className="px-4 py-3 font-montserrat rounded-none border-b-2 border-transparent data-[state=active]:border-[#EB6440] data-[state=active]:text-[#0A4D68] data-[state=active]:font-semibold text-[#757575] hover:text-[#0A4D68]"
          >
            Species
          </TabsTrigger>
          <TabsTrigger 
            value="gallery" 
            className="px-4 py-3 font-montserrat rounded-none border-b-2 border-transparent data-[state=active]:border-[#EB6440] data-[state=active]:text-[#0A4D68] data-[state=active]:font-semibold text-[#757575] hover:text-[#0A4D68]"
          >
            Gallery
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="px-4 py-3 font-montserrat rounded-none border-b-2 border-transparent data-[state=active]:border-[#EB6440] data-[state=active]:text-[#0A4D68] data-[state=active]:font-semibold text-[#757575] hover:text-[#0A4D68]"
          >
            Reviews
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="p-4 mt-0">
          {/* Current Water Conditions */}
          <div className="mb-6">
            {isLoadingConditions ? (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ) : waterConditions ? (
              <WaterConditionsCard conditions={waterConditions} compact={true} />
            ) : (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-700">Water conditions data not available for this dive site.</p>
              </div>
            )}
          </div>

          {/* About section */}
          <div className="mb-6">
            <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-2">About this dive site</h3>
            <p className="text-sm leading-relaxed text-[#757575]">
              {diveSite.description}
            </p>
          </div>
          
          {/* Highlights */}
          {diveSite.highlights && diveSite.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-2">Highlights</h3>
              <ul className="grid grid-cols-2 gap-2">
                {diveSite.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center text-sm text-[#757575]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#EB6440] mr-2 h-4 w-4">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Featured Species */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-montserrat font-bold text-[#0A4D68]">Featured Species</h3>
              <Button 
                variant="link" 
                onClick={() => setActiveTab("species")}
                className="text-sm text-[#088395] hover:text-[#0A4D68] font-semibold p-0"
              >
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {isLoadingSpecies ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm">
                    <Skeleton className="w-full h-24" />
                    <div className="p-2">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              ) : (
                species?.slice(0, 4).map(({ species }) => (
                  <Link key={species.id} href={`/species/${species.id}`}>
                    <a className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200 block">
                      <img 
                        src={species.imageUrl || 'https://images.unsplash.com/photo-1567425928496-1ab66c650131?q=80&w=1074&auto=format&fit=crop'} 
                        alt={species.commonName} 
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-2">
                        <h4 className="font-montserrat font-semibold text-sm">{species.commonName}</h4>
                        <p className="text-xs text-[#757575] italic">{species.scientificName}</p>
                      </div>
                    </a>
                  </Link>
                ))
              )}
            </div>
          </div>
          
          {/* Habitat Information */}
          <HabitatInfo diveSite={diveSite} />
          
          {/* Dive Conditions */}
          <div className="mb-6">
            <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-2">Best Time to Dive</h3>
            <div className="bg-[#F5F5F5] p-3 rounded-lg">
              <div className="flex justify-between mb-3">
                <div className="text-center flex-1">
                  <p className="font-bold text-[#0A4D68]">Best Season</p>
                  <p className="text-sm">{diveSite.bestSeason}</p>
                </div>
                <div className="text-center flex-1">
                  <p className="font-bold text-[#0A4D68]">Peak Visibility</p>
                  <p className="text-sm">{diveSite.peakVisibilityMonth}</p>
                </div>
              </div>
              <p className="text-xs text-[#757575]">
                The best time to dive {diveSite.name} is during {diveSite.bestSeason} when rainfall is lower and visibility is at its peak. Water temperatures remain pleasant year-round.
              </p>
            </div>
          </div>
          
          {/* Recent Community Uploads */}
          {photos && photos.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-montserrat font-bold text-[#0A4D68]">Recent Community Photos</h3>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("gallery")}
                  className="text-sm text-[#088395] hover:text-[#0A4D68] font-semibold p-0"
                >
                  View all
                </Button>
              </div>
              
              <PhotoGallery photos={photos.slice(0, 6)} thumbnailSize="small" />
            </div>
          )}
          
          {/* Conservation Status */}
          <div className="mb-6">
            <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-2">Conservation Status</h3>
            <div className="bg-[#FFAB91] bg-opacity-10 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#EB6440] mr-2 h-5 w-5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <p className="font-montserrat font-semibold text-[#EB6440]">{diveSite.conservationStatus}</p>
              </div>
              <p className="text-sm text-[#757575]">
                {diveSite.conservationInfo}
              </p>
              <div className="mt-3">
                <Link href="/conservation">
                  <a className="text-[#088395] hover:text-[#0A4D68] text-sm font-semibold flex items-center">
                    Learn about conservation efforts 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Nearby Dive Sites */}
          {nearbySites && nearbySites.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-2">Nearby Dive Sites</h3>
              <div className="space-y-3">
                {isLoadingNearbySites ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="flex bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm">
                      <Skeleton className="w-24 h-20" />
                      <div className="p-2 flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-40 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))
                ) : (
                  nearbySites.map(({ diveSite: site, distance }: NearbyDiveSiteWithDistance) => (
                    <Link key={site.id} href={`/dive-site/${site.id}`}>
                      <a className="flex bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                        <img 
                          src={site.mainImage || 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1074&auto=format&fit=crop'} 
                          alt={site.name} 
                          className="w-24 h-full object-cover"
                        />
                        <div className="p-2 flex-1">
                          <h4 className="font-montserrat font-semibold text-[#0A4D68]">{site.name}</h4>
                          <p className="text-xs text-[#757575] mb-1">{site.location}</p>
                          <div className="flex items-center">
                            <span className="text-xs bg-[#088395] text-white px-1.5 py-0.5 rounded">{site.difficulty}</span>
                            <span className="text-xs text-[#757575] ml-2">{site.minDepth}-{site.maxDepth}m</span>
                          </div>
                        </div>
                        <div className="flex items-center p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#757575]">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </div>
                      </a>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Dive Centers */}
          {diveCenters && diveCenters.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-2">Dive Centers</h3>
              <div className="space-y-2">
                {isLoadingDiveCenters ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center p-3 bg-[#F5F5F5] rounded-lg shadow-sm">
                      <Skeleton className="h-10 w-10 rounded-full mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))
                ) : (
                  diveCenters.map((center: DiveCenter) => (
                    <div key={center.id} className="flex items-center p-3 bg-[#F5F5F5] rounded-lg shadow-sm hover:shadow transition">
                      <div className="w-10 h-10 bg-[#0A4D68] rounded-full flex items-center justify-center text-white mr-3">
                        {center.iconType === 'ship' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M15 2H9v6h6V2z"></path>
                            <path d="M1 7h4"></path>
                            <path d="M19 7h4"></path>
                            <path d="M5 7l2 9h10l2-9"></path>
                            <path d="M12 16v6"></path>
                            <path d="M8 22h8"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M2 12h20"></path>
                            <path d="M12 2c3.5 4 7 8 7 12a7 7 0 1 1-14 0c0-4 3.5-8 7-12z"></path>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-montserrat font-semibold text-[#0A4D68]">{center.name}</h4>
                        <p className="text-xs text-[#757575]">{center.certification}</p>
                      </div>
                      <Button size="sm" className="bg-[#088395] hover:bg-[#0A4D68] text-white">
                        Contact
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* User Contribution Button */}
          <div className="mt-8 mb-4">
            <Button className="w-full bg-[#EB6440] hover:bg-[#FFAB91] text-white py-3 rounded-lg transition font-montserrat font-semibold flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Share Your Experience
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="species" className="mt-0">
          <SpeciesTab diveSiteId={diveSite.id} />
        </TabsContent>
        
        <TabsContent value="gallery" className="mt-0">
          <GalleryTab diveSiteId={diveSite.id} />
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-0">
          <ReviewsTab diveSiteId={diveSite.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiveSiteDetails;
