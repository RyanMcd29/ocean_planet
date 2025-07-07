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
      {/* Enhanced Header with Hero Image */}
      <div className="relative">
        <div className="relative overflow-hidden">
          <img 
            src={diveSite.mainImage || 'https://images.unsplash.com/photo-1682687982501-1e58ab6d8433?q=80&w=1470&auto=format&fit=crop'}
            alt={`${diveSite.name} underwater scene`} 
            className="w-full h-64 sm:h-72 md:h-80 object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-gradient-to-r from-[#05BFDB] to-[#088395] text-white px-3 py-1.5 rounded-full text-sm font-semibold font-montserrat shadow-lg">
                  {diveSite.difficulty}
                </span>
                <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold font-montserrat border border-white/20">
                  {diveSite.minDepth}-{diveSite.maxDepth}m depth
                </span>
                <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold font-montserrat border border-white/20">
                  {diveSite.current} current
                </span>
              </div>
              <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold mb-2 leading-tight">
                {diveSite.name}
              </h1>
              <p className="text-white/90 flex items-center text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {diveSite.location}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur-sm hover:bg-white text-[#0A4D68] rounded-full h-10 w-10 shadow-lg border-white/30">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur-sm hover:bg-white text-[#0A4D68] rounded-full h-10 w-10 shadow-lg border-white/30">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-[#05BFDB] to-[#088395] rounded-full flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1"></path>
              </svg>
            </div>
            <p className="text-[#0A4D68] text-sm font-semibold mb-1">Visibility</p>
            <p className="text-xl font-montserrat font-bold text-[#088395]">{diveSite.minVisibility}-{diveSite.maxVisibility}m</p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#EE5A52] rounded-full flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
              </svg>
            </div>
            <p className="text-[#0A4D68] text-sm font-semibold mb-1">Temperature</p>
            <p className="text-xl font-montserrat font-bold text-[#088395]">{diveSite.minTemp}-{diveSite.maxTemp}°C</p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] rounded-full flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="M4.93 4.93l1.41 1.41"></path>
                <path d="M17.66 17.66l1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="M6.34 17.66l-1.41 1.41"></path>
                <path d="M19.07 4.93l-1.41 1.41"></path>
              </svg>
            </div>
            <p className="text-[#0A4D68] text-sm font-semibold mb-1">Current</p>
            <p className="text-xl font-montserrat font-bold text-[#088395]">{diveSite.current}</p>
          </div>
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

          {/* Enhanced Site Overview for AMMO Jetty */}
          {diveSite.name === 'AMMO Jetty' ? (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-[#0A4D68] to-[#088395] p-6 rounded-t-2xl">
                <h3 className="text-2xl font-montserrat font-bold text-white mb-1 flex items-center">
                  🌍 <span className="ml-2">AMMO Jetty Site Overview</span>
                </h3>
                <p className="text-white/80 text-sm">Shore-based jetty dive near Fremantle, Western Australia</p>
              </div>
              <div className="bg-white border border-[#E0F7FA] p-6 rounded-b-2xl shadow-sm">
                
                {/* Site Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE] rounded-lg border border-[#BAE6FD]">
                      <h4 className="font-bold text-[#0369A1] mb-2">📍 Location & Access</h4>
                      <p className="text-sm text-[#0C4A6E] leading-relaxed">
                        <strong>Coordinates:</strong> 32°07'27.9"S 115°45'26.0"E<br/>
                        <strong>Distance:</strong> 15 minutes south of Fremantle, ~40 km from Perth CBD<br/>
                        <strong>Access:</strong> Shore dive from jetty - walk-in entry via jetty steps<br/>
                        <strong>Facilities:</strong> Toilets and rinse showers available near car park
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-[#FEFCE8] to-[#FEF3C7] rounded-lg border border-[#FDE68A]">
                      <h4 className="font-bold text-[#A16207] mb-2">🤿 Experience Level</h4>
                      <p className="text-sm text-[#92400E] leading-relaxed">
                        Ideal for <strong>beginner to intermediate divers</strong><br/>
                        Suitable for Open Water certification and refresher courses<br/>
                        <strong>Depth Range:</strong> Maximum depth of roughly 9m along jetty structure
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] rounded-lg border border-[#BBF7D0]">
                      <h4 className="font-bold text-[#166534] mb-2">🌊 Conditions</h4>
                      <p className="text-sm text-[#14532D] leading-relaxed">
                        <strong>Best Conditions:</strong> Swell &lt;1.5m, period ~11s<br/>
                        <strong>Optimal Winds:</strong> East to southeast winds<br/>
                        <strong>Visibility:</strong> 3-4m typical, 1m after storms, up to 15m on calm days<br/>
                        <strong>Current:</strong> Mild currents, especially under northerly winds
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-[#FDF2F8] to-[#FCE7F3] rounded-lg border border-[#F9A8D4]">
                      <h4 className="font-bold text-[#BE185D] mb-2">🐠 Marine Ecosystem</h4>
                      <p className="text-sm text-[#9D174D] leading-relaxed">
                        <strong>Ecosystem Type:</strong> Jetty with silty rubble seabed - artificial reef<br/>
                        <strong>Specialty:</strong> Rich macro hotspot for invertebrates and small species<br/>
                        <strong>Night Life:</strong> Rays, dolphins, and sea lions observed at night
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-[#E5E7EB] pt-6">
                  <h4 className="font-bold text-[#374151] mb-3 flex items-center">
                    <span className="mr-2">🗺️</span> Dive Route & Layout
                  </h4>
                  <p className="text-[#6B7280] leading-relaxed">
                    Typically dive one side of jetty pylons out to ~100m then return on the opposite side. 
                    Clockwise or anti-clockwise routes recommended. Complete loop covers entire jetty length, 
                    showcasing towering pylons encrusted with marine growth.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-[#0A4D68] to-[#088395] p-6 rounded-t-2xl">
                <h3 className="text-xl font-montserrat font-bold text-white mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Site Overview
                </h3>
                <p className="text-white/80 text-sm">Discover what makes this dive site special</p>
              </div>
              <div className="bg-white border border-[#E0F7FA] p-6 rounded-b-2xl shadow-sm">
                <p className="text-base leading-relaxed text-[#424242] font-light">
                  {diveSite.description}
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Highlights Section */}
          {diveSite.highlights && diveSite.highlights.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-[#EB6440] to-[#F4845F] p-6 rounded-t-2xl">
                <h3 className="text-xl font-montserrat font-bold text-white mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  Key Highlights
                </h3>
                <p className="text-white/80 text-sm">What to expect at this dive site</p>
              </div>
              <div className="bg-white border border-[#FFE0CC] p-6 rounded-b-2xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diveSite.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start p-3 bg-gradient-to-r from-[#FFF8F0] to-[#FFE6CC] rounded-lg border border-[#FFD4A3]">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#EB6440] to-[#F4845F] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white h-4 w-4">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-[#424242] font-medium text-sm leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Featured Species */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-montserrat font-bold text-white mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                    Featured Species
                  </h3>
                  <p className="text-white/80 text-sm">Discover the marine life at this dive site</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("species")}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white"
                >
                  View All
                </Button>
              </div>
            </div>
            <div className="bg-white border border-[#DBEAFE] p-6 rounded-b-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isLoadingSpecies ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-xl overflow-hidden shadow-sm border border-[#E2E8F0]">
                      <Skeleton className="w-full h-32" />
                      <div className="p-3">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-3/4 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))
                ) : species && species.length > 0 ? (
                  species.slice(0, 4).map(({ species: speciesItem }) => (
                    <Link key={speciesItem.id} href={`/species/${speciesItem.id}`}>
                      <a className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-xl overflow-hidden shadow-sm border border-[#E2E8F0] hover:shadow-md hover:scale-105 transition-all duration-300 block">
                        <div className="relative">
                          <img 
                            src={speciesItem.imageUrl || 'https://images.unsplash.com/photo-1567425928496-1ab66c650131?q=80&w=1074&auto=format&fit=crop'} 
                            alt={speciesItem.commonName} 
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              speciesItem.conservationStatus === 'Least Concern' ? 'bg-green-100 text-green-700' :
                              speciesItem.conservationStatus === 'Near Threatened' ? 'bg-yellow-100 text-yellow-700' :
                              speciesItem.conservationStatus === 'Vulnerable' ? 'bg-orange-100 text-orange-700' :
                              speciesItem.conservationStatus === 'Endangered' ? 'bg-red-100 text-red-700' :
                              speciesItem.conservationStatus === 'Critically Endangered' ? 'bg-red-200 text-red-800' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {speciesItem.conservationStatus || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-montserrat font-bold text-sm text-[#0F172A] mb-1 leading-tight">
                            {speciesItem.commonName}
                          </h4>
                          <p className="text-xs text-[#64748B] italic mb-1">
                            {speciesItem.scientificName}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-[#475569] bg-[#E2E8F0] px-2 py-1 rounded-full">
                              {speciesItem.category || 'Marine Life'}
                            </span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="text-[#64748B] mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <p className="text-[#64748B] text-sm">No species data available for this dive site</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Habitat Information */}
          <HabitatInfo diveSite={diveSite} />

          {/* Enhanced Dive Conditions */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] p-6 rounded-t-2xl">
              <h3 className="text-xl font-montserrat font-bold text-white mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3">
                  <path d="M12 2v10l8-8-8 8H2l10-10z"></path>
                  <path d="M12 12v10"></path>
                </svg>
                Best Diving Conditions
              </h3>
              <p className="text-white/80 text-sm">Optimal times for your underwater adventure</p>
            </div>
            <div className="bg-white border border-[#E0F2F1] p-6 rounded-b-2xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1] p-4 rounded-xl border border-[#A7F3D0]">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1"></path>
                      </svg>
                    </div>
                    <p className="font-bold text-[#064E3B]">Best Season</p>
                  </div>
                  <p className="text-[#047857] font-medium ml-11">{diveSite.bestSeason}</p>
                </div>
                <div className="bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1] p-4 rounded-xl border border-[#A7F3D0]">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                        <circle cx="12" cy="12" r="5"></circle>
                        <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1"></path>
                      </svg>
                    </div>
                    <p className="font-bold text-[#064E3B]">Peak Visibility</p>
                  </div>
                  <p className="text-[#047857] font-medium ml-11">{diveSite.peakVisibilityMonth}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] p-4 rounded-lg border border-[#E2E8F0]">
                <p className="text-[#475569] leading-relaxed">
                  The optimal diving window for <span className="font-semibold text-[#0F172A]">{diveSite.name}</span> occurs during {diveSite.bestSeason} when environmental conditions align for the best underwater experience. Visibility reaches its peak during {diveSite.peakVisibilityMonth}, offering exceptional clarity for underwater photography and marine life observation.
                </p>
              </div>
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

          {/* Enhanced Marine Life Section for AMMO Jetty */}
          {diveSite.name === 'AMMO Jetty' && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] p-6 rounded-t-2xl">
                <h3 className="text-xl font-montserrat font-bold text-white mb-1 flex items-center">
                  🐠 <span className="ml-2">Marine Life & Ecosystem</span>
                </h3>
                <p className="text-white/80 text-sm">Abundant macro-life in an artificial reef environment</p>
              </div>
              <div className="bg-white border border-[#FEE2E2] p-6 rounded-b-2xl shadow-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-gradient-to-r from-[#FEF2F2] to-[#FECACA] rounded-lg border border-[#FCA5A5]">
                    <h4 className="font-bold text-[#7F1D1D] mb-3 flex items-center">
                      <span className="mr-2">🏊‍♂️</span> Common Species Sightings
                    </h4>
                    <div className="space-y-2 text-sm text-[#991B1B]">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-[#DC2626] rounded-full mr-2"></span>
                        <span>Diverse leatherjackets and pygmy filefish</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-[#DC2626] rounded-full mr-2"></span>
                        <span>Crested morwong schools</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-[#DC2626] rounded-full mr-2"></span>
                        <span>Boxfish and various flatworms</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-[#DC2626] rounded-full mr-2"></span>
                        <span>Colorful anemones</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-[#F3E8FF] to-[#DDD6FE] rounded-lg border border-[#C4B5FD]">
                    <h4 className="font-bold text-[#581C87] mb-3 flex items-center">
                      <span className="mr-2">🌙</span> Night Diving Encounters
                    </h4>
                    <div className="space-y-2 text-sm text-[#6B21A8]">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-2"></span>
                        <span>Occasional rays and stingrays</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-2"></span>
                        <span>Dolphins (rarely observed)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-2"></span>
                        <span>Sea lions during night dives</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-2"></span>
                        <span>Enhanced marine activity after dark</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-[#FEF7FF] to-[#F3E8FF] rounded-lg border border-[#DDD6FE] mb-4">
                  <h4 className="font-bold text-[#581C87] mb-2 flex items-center">
                    <span className="mr-2">⚠️</span> Diving Safety & Tips
                  </h4>
                  <p className="text-sm text-[#6B21A8] leading-relaxed">
                    <strong>Important:</strong> Divers occasionally report line entanglement under the jetty due to 
                    discarded fishing tackle. <strong>Recommendations:</strong> Stay aware of hooks, bring a dive knife, 
                    and maintain proper buoyancy to protect the silty bottom and avoid stirring up sediment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Conservation Status */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#10B981] to-[#059669] p-6 rounded-t-2xl">
              <h3 className="text-xl font-montserrat font-bold text-white mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  <path d="M19 3v4"></path>
                  <path d="M21 5h-4"></path>
                </svg>
                Conservation & Protection
              </h3>
              <p className="text-white/80 text-sm">Environmental protection and sustainable diving practices</p>
            </div>
            <div className="bg-white border border-[#D1FAE5] p-6 rounded-b-2xl shadow-sm">
              <div className="flex items-center mb-4 p-4 bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5] rounded-xl border border-[#A7F3D0]">
                <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white h-6 w-6">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="font-montserrat font-bold text-[#064E3B] text-lg">{diveSite.conservationStatus}</p>
                  <p className="text-[#047857] text-sm">Current protection level</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] p-4 rounded-lg border border-[#E2E8F0] mb-4">
                <p className="text-[#475569] leading-relaxed">
                  {diveSite.conservationInfo}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/learn">
                  <Button className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white flex items-center gap-2 flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    Learn About Conservation
                  </Button>
                </Link>
                <Button variant="outline" className="text-[#059669] border-[#059669] hover:bg-[#F0FDF4] flex items-center gap-2 flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    <path d="m15 5 4 4"></path>
                  </svg>
                  Report Issues
                </Button>
              </div>
            </div>
          </div>

          {/* Learn Section for AMMO Jetty */}
          {diveSite.name === 'AMMO Jetty' && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] p-6 rounded-t-2xl">
                <h3 className="text-xl font-montserrat font-bold text-white mb-1 flex items-center">
                  📘 <span className="ml-2">Learn Section</span>
                </h3>
                <p className="text-white/80 text-sm">Suggested mini-lessons for deeper understanding</p>
              </div>
              <div className="bg-white border border-[#DDD6FE] p-6 rounded-b-2xl shadow-sm">
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-[#F8FAFC] to-[#EEF2FF] rounded-lg border border-[#C7D2FE] hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#4C1D95] mb-2">
                          "Biodiversity of Jetty Macro Ecosystems"
                        </h4>
                        <p className="text-sm text-[#6B21A8] leading-relaxed">
                          Explore why pylons foster dense colonization by anemones, flatworms, nudibranchs, 
                          and small fish. Learn about artificial reef formation and the unique ecological 
                          niche created by jetty structures.
                        </p>
                        <Link href="/learn/jetty-ecosystems">
                          <Button variant="outline" className="mt-3 text-[#7C3AED] border-[#7C3AED] hover:bg-[#F5F3FF] text-xs">
                            Start Learning →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5] rounded-lg border border-[#BBF7D0] hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#059669] to-[#10B981] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#065F46] mb-2">
                          "Threats from Fishing Debris & Marine Conservation Efforts"
                        </h4>
                        <p className="text-sm text-[#047857] leading-relaxed">
                          Discuss the impact of lost tackle on marine habitats and how community clean-ups 
                          support environmental stewardship. Learn about marine debris prevention and 
                          responsible diving practices.
                        </p>
                        <Link href="/learn/marine-conservation">
                          <Button variant="outline" className="mt-3 text-[#059669] border-[#059669] hover:bg-[#F0FDF4] text-xs">
                            Start Learning →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-[#FEF7FF] to-[#F3E8FF] rounded-lg border border-[#DDD6FE]">
                  <p className="text-center text-sm text-[#6B21A8]">
                    <strong>Community Contributions:</strong> Local divers frequently contribute observation maps 
                    and macro-life sketches. Join annual cleanup events led by Dolphin Dive and other local dive shops.
                  </p>
                </div>
              </div>
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