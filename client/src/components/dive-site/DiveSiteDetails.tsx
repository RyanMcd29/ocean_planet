import React, { useState, useEffect } from "react";
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
  type SpeciesWithFrequency,
  fetchLiveConditions
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
  const [waterConditions, setWaterConditions] = useState<any | null>(null);
  const [liveConditions, setLiveConditions] = useState<any | null>(null);
  const [isLoadingConditions, setIsLoadingConditions] = useState(true);
  const [showLiveData, setShowLiveData] = useState(false);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

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

  const { data: reviews } = useQuery({
    queryKey: [`/api/dive-sites/${diveSite.id}/reviews`],
    queryFn: () => fetchDiveSiteReviews(diveSite.id),
  });

  // Fetch water conditions
  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await fetch(`/api/dive-sites/${diveSite.id}/conditions`);
        if (response.ok) {
          const conditions = await response.json();
          setWaterConditions(conditions);
        }
      } catch (error) {
        console.error('Error fetching water conditions:', error);
      } finally {
        setIsLoadingConditions(false);
      }
    };

    fetchConditions();
  }, [diveSite.id]);

  // Fetch live conditions
  const fetchLiveData = async () => {
    setIsLoadingLive(true);
    try {
      const live = await fetchLiveConditions(diveSite.id);
      setLiveConditions(live);
      setShowLiveData(true);
    } catch (error) {
      console.error('Error fetching live conditions:', error);
    } finally {
      setIsLoadingLive(false);
    }
  };

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
              <>
                <WaterConditionsCard conditions={waterConditions} compact={true} />
                <div className="mt-3 flex gap-2">
                  <Button 
                    onClick={fetchLiveData}
                    disabled={isLoadingLive}
                    className="bg-[#05BFDB] hover:bg-[#088395] text-white"
                  >
                    {isLoadingLive ? 'Loading...' : 'Get Live Data'}
                  </Button>
                  {showLiveData && liveConditions && (
                    <Button 
                      variant="outline"
                      onClick={() => setShowLiveData(false)}
                      className="text-[#088395] border-[#088395]"
                    >
                      Show Static Data
                    </Button>
                  )}
                </div>
                {showLiveData && liveConditions && (
                  <div className="mt-4">
                    <WaterConditionsCard conditions={liveConditions} compact={true} />
                    <p className="text-xs text-[#757575] mt-2">Live data from AODN • Updated: {new Date(liveConditions.timestamp).toLocaleString()}</p>
                  </div>
                )}
              </>
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

          {/* AMMO Jetty specific sections */}
          {diveSite.name === "AMMO Jetty" && (
            <>
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

              {/* Key Highlights */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-orange-600 font-semibold text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Key Highlights
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">What to expect at this dive site</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Shore dive from jetty with walk-in entry
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Macro photography hotspot with abundant invertebrates
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Easy access via jetty steps with facilities nearby
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Artificial reef ecosystem on silty rubble seabed
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Night diving opportunities with rays and marine mammals
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Suitable for Open Water certification and refresher courses
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Rich marine growth on encrusted pylons
                    </div>
                  </div>
                </div>
              </div>

              {/* Dive Map & Route */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-teal-100 to-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-teal-600 font-semibold text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Dive Map
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-teal-600 border-teal-400 hover:bg-teal-50 text-xs"
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.413V13H5.5z" />
                      </svg>
                      Upload Map
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">Site layout and recommended routes</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Typically dive one side of jetty pylons out to ~100m</div>
                    <div>• Return on opposite side (clockwise or anti-clockwise)</div>
                    <div>• Complete loop covers entire jetty length</div>
                    <div>• Maximum depth ~9m along jetty structure</div>
                  </div>
                </div>
              </div>

              {/* Learn Section */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-purple-600 font-semibold text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Learn Section
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">Suggested mini-lessons for deeper understanding</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">1</div>
                        <span className="text-sm text-gray-700">"Biodiversity of Jetty Macro Ecosystems"</span>
                      </div>
                      <button className="text-purple-600 text-xs px-2 py-1 border border-purple-300 rounded hover:bg-purple-50">
                        Start Learning →
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">2</div>
                        <span className="text-sm text-gray-700">"Threats from Fishing Debris & Marine Conservation Efforts"</span>
                      </div>
                      <button className="text-green-600 text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50">
                        Start Learning →
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <strong>Community Contributions:</strong> Local divers frequently contribute observation maps and macro-life sketches. Join annual cleanup events led by Dolphin Dive and other local dive shops.
                  </div>
                </div>
              </div>

              {/* User Experience & Safety */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-600 font-semibold text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      User Experience & Safety Tips
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• <strong>Facilities:</strong> Toilets and rinse showers available near car park</div>
                    <div>• <strong>Safety:</strong> Watch for discarded fishing tackle under jetty - bring dive knife</div>
                    <div>• <strong>Buoyancy:</strong> Maintain good buoyancy control to protect silty bottom</div>
                    <div>• <strong>Best Conditions:</strong> Calm with swell less than 1.5m, east to southeast winds</div>
                    <div>• <strong>Avoid:</strong> Strong westerly winds that enhance swell</div>
                  </div>
                </div>
              </div>
            </>
          )}





          {/* Habitat Information */}
          <HabitatInfo diveSite={diveSite} />



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