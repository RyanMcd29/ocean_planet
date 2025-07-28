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
import DiveMapTab from "./DiveMapTab";
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
    <div className="lg:overflow-y-auto lg:max-h-[calc(100vh-64px)]">
      {/* Hero Header Image and Info */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-200 via-blue-400 to-blue-800">
          <img 
            src={diveSite.mainImage || 'https://images.unsplash.com/photo-1682687982501-1e58ab6d8433?q=80&w=1470&auto=format&fit=crop'}
            alt={`${diveSite.name} underwater scene`} 
            className="w-full h-full object-cover mix-blend-overlay opacity-80"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                {diveSite.difficulty}
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                {diveSite.minDepth}-{diveSite.maxDepth}m
              </span>
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                {diveSite.country}
              </span>
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-montserrat font-bold mb-3 drop-shadow-2xl">
              {diveSite.name}
            </h2>
            <p className="text-white/90 text-lg flex items-center drop-shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {diveSite.location}
            </p>
          </div>
        </div>

        <div className="absolute top-6 right-6 flex space-x-3">
          <Button variant="outline" size="icon" className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-2xl h-12 w-12 backdrop-blur-md transition-all duration-300 hover:scale-110">
            <Heart className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-2xl h-12 w-12 backdrop-blur-md transition-all duration-300 hover:scale-110">
            <Share2 className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="bg-gradient-to-r from-teal-100 via-blue-100 to-indigo-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-teal-200 to-blue-300 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-white/30 rounded-full p-3">
                <svg className="w-6 h-6 text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-teal-800 text-sm font-bold mb-1">Visibility Range</p>
            <p className="text-2xl font-montserrat font-bold text-teal-900">
              {diveSite.minVisibility}-{diveSite.maxVisibility}m
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-200 to-indigo-300 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-white/30 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-blue-800 text-sm font-bold mb-1">Water Temperature</p>
            <p className="text-2xl font-montserrat font-bold text-blue-900">
              {diveSite.minTemp}-{diveSite.maxTemp}°C
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-200 to-purple-300 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-white/30 rounded-full p-3">
                <svg className="w-6 h-6 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-indigo-800 text-sm font-bold mb-1">Current Strength</p>
            <p className="text-2xl font-montserrat font-bold text-indigo-900">
              {diveSite.current || 'Variable'}
            </p>
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-gradient-to-r from-slate-100 to-blue-50 px-6 pt-4">
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto space-x-2">
            <TabsTrigger 
              value="overview" 
              className="px-6 py-3 font-montserrat font-semibold rounded-t-2xl border-0 bg-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-slate-600 hover:bg-white/90 hover:text-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="species" 
              className="px-6 py-3 font-montserrat font-semibold rounded-t-2xl border-0 bg-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-slate-600 hover:bg-white/90 hover:text-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Species
            </TabsTrigger>
            <TabsTrigger 
              value="dive-map" 
              className="px-6 py-3 font-montserrat font-semibold rounded-t-2xl border-0 bg-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-slate-600 hover:bg-white/90 hover:text-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Dive Map
            </TabsTrigger>
            <TabsTrigger 
              value="gallery" 
              className="px-6 py-3 font-montserrat font-semibold rounded-t-2xl border-0 bg-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-slate-600 hover:bg-white/90 hover:text-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="px-6 py-3 font-montserrat font-semibold rounded-t-2xl border-0 bg-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-slate-600 hover:bg-white/90 hover:text-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="bg-gradient-to-br from-white to-blue-50/50 p-8 mt-0 min-h-[600px]">
          {/* Enhanced Water Conditions Section */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-3 mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 010 2h-1v1a1 1 0 11-2 0V4H8a1 1 0 010-2h1V1a1 1 0 112 0v1h1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-slate-800">Current Water Conditions</h3>
            </div>
            
            {isLoadingConditions ? (
              <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl shadow-lg border border-teal-100 p-6">
                <Skeleton className="h-8 w-64 mb-6 bg-gradient-to-r from-teal-200 to-blue-200" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Skeleton className="h-24 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200" />
                  <Skeleton className="h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200" />
                  <Skeleton className="h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200" />
                </div>
              </div>
            ) : waterConditions ? (
              <div className="bg-gradient-to-br from-white to-teal-50/30 rounded-2xl shadow-lg border border-teal-100/50 overflow-hidden">
                <WaterConditionsCard conditions={waterConditions} compact={true} />
                <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50">
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={fetchLiveData}
                      disabled={isLoadingLive}
                      className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoadingLive ? 'Loading...' : '🌊 Get Live Data'}
                    </Button>
                    {showLiveData && liveConditions && (
                      <Button 
                        variant="outline"
                        onClick={() => setShowLiveData(false)}
                        className="border-teal-300 text-teal-700 hover:bg-teal-50 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                      >
                        📊 Show Static Data
                      </Button>
                    )}
                  </div>
                  {showLiveData && liveConditions && (
                    <div className="mt-6 bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
                      <WaterConditionsCard conditions={liveConditions} compact={true} />
                      <p className="text-sm text-slate-600 mt-3 font-medium">
                        🛰️ Live data from AODN • Updated: {new Date(liveConditions.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 rounded-2xl p-6 text-center shadow-lg">
                <div className="text-blue-700 font-semibold text-lg mb-2">📊 Water Conditions Unavailable</div>
                <p className="text-blue-600">Water conditions data not available for this dive site.</p>
              </div>
            )}
          </div>

          {/* Enhanced About Section */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-3 mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-slate-800">About This Dive Site</h3>
            </div>
            <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl shadow-lg border border-emerald-100/50 p-8">
              <p className="text-lg leading-relaxed text-slate-700 font-medium">
                {diveSite.description}
              </p>
            </div>
          </div>

          {/* AMMO Jetty specific sections */}
          {diveSite.name === "AMMO Jetty" && (
            <>
              {/* Enhanced Featured Species */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 mr-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-montserrat font-bold text-slate-800">Featured Species</h3>
                  </div>
                  <Button 
                    onClick={() => setActiveTab("species")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    🐠 View All Species
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoadingSpecies ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="bg-gradient-to-br from-white to-purple-50 rounded-2xl overflow-hidden shadow-lg border border-purple-100">
                        <Skeleton className="w-full h-32 bg-gradient-to-r from-purple-200 to-pink-200" />
                        <div className="p-4">
                          <Skeleton className="h-6 w-32 mb-2 bg-gradient-to-r from-purple-200 to-pink-200" />
                          <Skeleton className="h-4 w-40 bg-gradient-to-r from-gray-200 to-gray-300" />
                        </div>
                      </div>
                    ))
                  ) : (
                    species?.slice(0, 4).map(({ species }) => (
                      <Link key={species.id} href={`/species/${species.id}`}>
                        <a className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-purple-100/50 transition-all duration-300 hover:scale-105 block group">
                          <div className="relative overflow-hidden">
                            <img 
                              src={species.imageUrl || 'https://images.unsplash.com/photo-1567425928496-1ab66c650131?q=80&w=1074&auto=format&fit=crop'} 
                              alt={species.commonName} 
                              className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-montserrat font-bold text-lg text-slate-800 mb-1 group-hover:text-purple-700 transition-colors duration-300">
                              {species.commonName}
                            </h4>
                            <p className="text-sm text-slate-600 italic font-medium">{species.scientificName}</p>
                          </div>
                        </a>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Enhanced Key Highlights */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-3 mr-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-montserrat font-bold text-slate-800">Key Highlights</h3>
                </div>
                <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-2xl shadow-lg border border-orange-100/50 p-8">
                  <p className="text-lg text-slate-700 mb-6 font-medium">What to expect at this dive site</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 mr-4">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">Shore dive from jetty with walk-in entry</span>
                    </div>
                    <div className="flex items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 mr-4">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">Macro photography hotspot with abundant invertebrates</span>
                    </div>
                    <div className="flex items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 mr-4">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">Easy access via jetty steps with facilities nearby</span>
                    </div>
                    <div className="flex items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 mr-4">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">Artificial reef ecosystem on silty rubble seabed</span>
                    </div>
                    <div className="flex items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 mr-4">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">Night diving opportunities with rays and marine mammals</span>
                    </div>
                    <div className="flex items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 mr-4">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">Suitable for Open Water certification and refresher courses</span>
                    </div>
                    <div className="flex items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 mr-4">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">Rich marine growth on encrusted pylons</span>
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
                      onClick={() => setActiveTab("dive-map")}
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

          {/* Blackwall Reach specific sections */}
          {diveSite.name === "Blackwall Reach" && (
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
                    Array(6).fill(0).map((_, i) => (
                      <div key={i} className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm">
                        <Skeleton className="w-full h-24" />
                        <div className="p-2">
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                  ) : (
                    species?.slice(0, 6).map(({ species }) => (
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
                  <p className="text-sm text-gray-700 mb-3">What to expect at this urban wreck diving site</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Shore-based entry via bush track and wade ~200m
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Perth's only accessible freshwater wreck diving
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Submerged cars, barges, and urban debris wrecks
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Unique freshwater-estuarine ecosystem
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Macro photography opportunities in murky conditions
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Riverine species: bream, jellyfish, crabs, tube worms
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Requires moderate experience and navigation skills
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
                      onClick={() => setActiveTab("dive-map")}
                      className="text-teal-600 border-teal-400 hover:bg-teal-50 text-xs"
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.413V13H5.5z" />
                      </svg>
                      Upload Map
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">Site layout and recommended navigation routes</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Typical dives begin at buoy 527 proceeding along shallow wall</div>
                    <div>• Navigate toward buoy 716 using grid-style navigation patterns</div>
                    <div>• Multiple wrecks: sunken cars, old barges, river debris</div>
                    <div>• Maximum depth ~15m in central river channel</div>
                    <div>• Use torch and track landmarks to avoid disorientation</div>
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
                  <p className="text-sm text-gray-700 mb-3">Educational content about urban reef ecosystems</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">1</div>
                        <span className="text-sm text-gray-700">"Life Among Wrecks – How Submerged Structures Become Urban Reefs"</span>
                      </div>
                      <button className="text-purple-600 text-xs px-2 py-1 border border-purple-300 rounded hover:bg-purple-50">
                        Start Learning →
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">2</div>
                        <span className="text-sm text-gray-700">"River Health and Water Clarity – What Affects Visibility in Estuarine Dives?"</span>
                      </div>
                      <button className="text-green-600 text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50">
                        Start Learning →
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <strong>Community Contributions:</strong> Explore how sunken objects transform into microhabitats and understand water chemistry effects on visibility in river environments.
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
                    <div>• <strong>Access:</strong> Bush track entry, wade ~200m to diving area near buoys</div>
                    <div>• <strong>Safety:</strong> Must use surface marker buoy, watch for boat traffic and ferry wake</div>
                    <div>• <strong>Equipment:</strong> Bring torch and gloves - essential for macro life and wreck exploration</div>
                    <div>• <strong>Best Conditions:</strong> Stable weather, avoid post-rainfall periods (releases tannins/silt)</div>
                    <div>• <strong>Navigation:</strong> Good buoyancy control essential - silty conditions change quickly</div>
                    <div>• <strong>Experience:</strong> Feels like treasure hunt - murky but fascinating with unexpected species</div>
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

          {/* Enhanced User Contribution Button */}
          <div className="flex justify-center mt-12 mb-8">
            <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              📸 Share Your Experience
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="species" className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 mt-0 min-h-[600px]">
          <SpeciesTab diveSiteId={diveSite.id} />
        </TabsContent>

        <TabsContent value="dive-map" className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 mt-0 min-h-[600px]">
          <DiveMapTab diveSiteId={diveSite.id} />
        </TabsContent>

        <TabsContent value="gallery" className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 mt-0 min-h-[600px]">
          <GalleryTab diveSiteId={diveSite.id} />
        </TabsContent>

        <TabsContent value="reviews" className="bg-gradient-to-br from-orange-50 to-red-50 p-8 mt-0 min-h-[600px]">
          <ReviewsTab diveSiteId={diveSite.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiveSiteDetails;