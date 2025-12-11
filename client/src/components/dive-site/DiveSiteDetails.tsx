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
  fetchLiveConditions,
  fetchDiveSiteLessons
} from "@/lib/api";
import { Heart, Share2 } from "lucide-react";
import { Link, useLocation } from "wouter";
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
  const [, setLocation] = useLocation();

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

  const { data: lessonsForSite = [], isLoading: isLoadingLessons } = useQuery({
    queryKey: [`/api/dive-sites/${diveSite.id}/lessons`],
    queryFn: () => fetchDiveSiteLessons(diveSite.id),
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

  const lessonCallout = (
    <div className="space-y-2">
      {isLoadingLessons ? (
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 text-sm text-gray-600">
          Loading lessons...
        </div>
      ) : lessonsForSite.length > 0 ? (
        lessonsForSite.slice(0, 3).map((lesson: any) => (
          <div key={lesson.id} className="flex items-center justify-between bg-white p-2 rounded border">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                📚
              </div>
              <div>
                <p className="text-sm text-gray-800 font-medium">{lesson.title}</p>
                {lesson.courseTitle && (
                  <p className="text-xs text-gray-500">{lesson.courseTitle}</p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setLocation(`/learn?lesson=${lesson.id}`)}
              data-lesson-id={lesson.id}
              className="text-purple-600 text-xs px-2 py-1 border border-purple-300 rounded hover:bg-purple-50"
            >
              Start →
            </button>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">📚</div>
            <span className="text-sm text-gray-500">Lessons coming soon</span>
          </div>
          <button 
            disabled
            className="text-gray-400 text-xs px-2 py-1 border border-gray-200 rounded cursor-not-allowed"
          >
            Not Available
          </button>
        </div>
      )}
    </div>
  );

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

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#05BFDB] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="species" className="data-[state=active]:bg-[#05BFDB] data-[state=active]:text-white">
            Species
          </TabsTrigger>
          <TabsTrigger value="dive-map" className="data-[state=active]:bg-[#05BFDB] data-[state=active]:text-white">
            Dive Map
          </TabsTrigger>
          <TabsTrigger value="gallery" className="data-[state=active]:bg-[#05BFDB] data-[state=active]:text-white">
            Gallery
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-[#05BFDB] data-[state=active]:text-white">
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-4 mt-0">
          {/* Water Conditions - Hidden */}
          <div className="mb-6" style={{ display: 'none' }}>
            <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-3">Current Water Conditions</h3>
            {isLoadingConditions ? (
              <Skeleton className="h-24 w-full" />
            ) : waterConditions ? (
              <div className="bg-[#F5F5F5] rounded-lg overflow-hidden">
                <WaterConditionsCard conditions={waterConditions} compact={true} />
                <div className="p-3 bg-[#E0F7FA] border-t">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm"
                      onClick={fetchLiveData}
                      disabled={isLoadingLive}
                      className="bg-[#05BFDB] hover:bg-[#088395] text-white"
                    >
                      {isLoadingLive ? 'Loading...' : 'Get Live Data'}
                    </Button>
                    {showLiveData && liveConditions && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => setShowLiveData(false)}
                        className="border-[#088395] text-[#088395] hover:bg-[#E0F7FA]"
                      >
                        Show Static Data
                      </Button>
                    )}
                  </div>
                  {showLiveData && liveConditions && (
                    <div className="mt-3 bg-white rounded-lg p-3">
                      <WaterConditionsCard conditions={liveConditions} compact={true} />
                      <p className="text-xs text-[#757575] mt-2">
                        Live data from AODN • Updated: {new Date(liveConditions.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
                <p>Water conditions data not available for this dive site.</p>
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-3">About</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {diveSite.description}
            </p>
          </div>

          {/* Access & Entry Information */}
          {(diveSite.accessType || diveSite.entryConditions) && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 font-semibold text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    Access & Entry
                  </span>
                </div>
                {diveSite.accessType && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">Access Type: <span className="font-normal">{diveSite.accessType}</span></p>
                  </div>
                )}
                {diveSite.entryConditions && (
                  <p className="text-sm text-gray-700 whitespace-pre-line">{diveSite.entryConditions}</p>
                )}
              </div>
            </div>
          )}

          {/* Highlights */}
          {diveSite.highlights && diveSite.highlights.length > 0 && (
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
                  {diveSite.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dive Site Layout */}
          {diveSite.diveSiteLayout && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-teal-100 to-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-teal-600 font-semibold text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Dive Site Layout
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
                <p className="text-sm text-gray-700 whitespace-pre-line">{diveSite.diveSiteLayout}</p>
              </div>
            </div>
          )}

          {/* Surge & Water Conditions */}
          {diveSite.surgeConditions && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-cyan-100 to-cyan-50 border-l-4 border-cyan-400 p-4 rounded-r-lg">
                <div className="flex items-center mb-2">
                  <span className="text-cyan-600 font-semibold text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    Surge & Water Conditions
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">{diveSite.surgeConditions}</p>
              </div>
            </div>
          )}

          {/* Seasonal Events */}
          {diveSite.seasonalEvents && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <div className="flex items-center mb-2">
                  <span className="text-green-600 font-semibold text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Seasonal Events
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">{diveSite.seasonalEvents}</p>
              </div>
            </div>
          )}

          {/* Unique Features */}
          {diveSite.uniqueFeatures && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                <div className="flex items-center mb-2">
                  <span className="text-purple-600 font-semibold text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Unique Features
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">{diveSite.uniqueFeatures}</p>
              </div>
            </div>
          )}

          {/* User Experience & Safety */}
          {diveSite.userExperienceNotes && (
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
                <p className="text-sm text-gray-700 whitespace-pre-line">{diveSite.userExperienceNotes}</p>
              </div>
            </div>
          )}

          {/* Conservation Information */}
          {(diveSite.conservationPark || diveSite.conservationInfo) && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-lg">
                <div className="flex items-center mb-2">
                  <span className="text-emerald-600 font-semibold text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Conservation
                  </span>
                </div>
                {diveSite.conservationPark && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      <span className="inline-block px-2 py-1 bg-emerald-500 text-white rounded text-xs mr-2">{diveSite.conservationStatus || 'Protected'}</span>
                      {diveSite.conservationPark}
                    </p>
                  </div>
                )}
                {diveSite.conservationInfo && (
                  <p className="text-sm text-gray-700 whitespace-pre-line">{diveSite.conservationInfo}</p>
                )}
              </div>
            </div>
          )}

          {/* Canal Rocks Species Cards */}
          {diveSite.id === 46 && (
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Western Blue Groper */}
                <div className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200" data-testid="card-species-western-blue-groper">
                  <img 
                    src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&auto=format&fit=crop" 
                    alt="Western Blue Groper" 
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="font-montserrat font-semibold text-sm">Western Blue Groper</h4>
                    <p className="text-xs text-[#757575] italic mb-1">Achoerodus gouldii</p>
                    <p className="text-xs text-gray-600">Large, inquisitive fish commonly found around limestone reefs</p>
                  </div>
                </div>

                {/* Harlequin Wrasse */}
                <div className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200" data-testid="card-species-harlequin-wrasse">
                  <img 
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&auto=format&fit=crop" 
                    alt="Harlequin Wrasse" 
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="font-montserrat font-semibold text-sm">Harlequin Wrasse</h4>
                    <p className="text-xs text-[#757575] italic mb-1">Coris sandeyeri</p>
                    <p className="text-xs text-gray-600">Vibrant reef fish with distinctive coloration patterns</p>
                  </div>
                </div>

                {/* Dhufish */}
                <div className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200" data-testid="card-species-dhufish">
                  <img 
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop" 
                    alt="Dhufish" 
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="font-montserrat font-semibold text-sm">Dhufish</h4>
                    <p className="text-xs text-[#757575] italic mb-1">Glaucosoma hebraicum</p>
                    <p className="text-xs text-gray-600">Endemic Western Australian species, prized by divers and anglers</p>
                  </div>
                </div>

                {/* Southern Stingray */}
                <div className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200" data-testid="card-species-southern-stingray">
                  <img 
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&auto=format&fit=crop" 
                    alt="Southern Stingray" 
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="font-montserrat font-semibold text-sm">Southern Stingray</h4>
                    <p className="text-xs text-[#757575] italic mb-1">Dasyatis americana</p>
                    <p className="text-xs text-gray-600">Often seen near boat ramps scavenging for fish scraps</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  <p className="text-sm text-gray-700 mb-3">Explore maritime history and ecosystems</p>
                  <div className="space-y-2">
                    {lessonCallout}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <strong>Learn more:</strong> Dive deeper into the history, ecology, and conservation of this site.
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

          {/* Bulk Jetty specific sections */}
          {diveSite.name === "Bulk Jetty" && (
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
                        <div className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200 block cursor-pointer">
                          <img 
                            src={species.imageUrl || 'https://images.unsplash.com/photo-1567425928496-1ab66c650131?q=80&w=1074&auto=format&fit=crop'} 
                            alt={species.commonName} 
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <h4 className="font-montserrat font-semibold text-sm">{species.commonName}</h4>
                            <p className="text-xs text-[#757575] italic">{species.scientificName}</p>
                          </div>
                        </div>
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
                      Shore dive with surface swim to jetty structure
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Schools of scalyfin, bullseyes, and herring
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Octopuses, seahorses, and cuttlefish in pylons
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Industrial jetty in Cockburn Sound
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Port Jackson sharks and stingrays sightings
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Great for macro photography and beginners
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Artificial reef ecosystem with soft corals
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
                    <div>• Jetty runs straight into ocean with evenly spaced pylons</div>
                    <div>• Follow left or right side of structure exploring pylon growth</div>
                    <div>• Surface swim out, descend at central point, return opposite side</div>
                    <div>• Check under crossbeams for cryptic species</div>
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
                  <p className="text-sm text-gray-700 mb-3">Explore maritime history and ecosystems</p>
                  <div className="space-y-2">
                    {lessonCallout}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <strong>Learn more:</strong> Dive deeper into the history, ecology, and conservation of this site.
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
                    <div>• <strong>Access:</strong> Beach entry from Kwinana Beach with walk across sand</div>
                    <div>• <strong>Conditions:</strong> Best during low wind and slack tide, early mornings ideal</div>
                    <div>• <strong>Visibility:</strong> Generally 5-10m but drops after storms</div>
                    <div>• <strong>Safety:</strong> Watch for boat traffic near jetty, use surface marker</div>
                    <div>• <strong>Industrial Setting:</strong> Surprisingly rich marine life despite location</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Palm Beach Jetty specific sections */}
          {diveSite.name === "Palm Beach Jetty" && (
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
                        <div className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200 block cursor-pointer">
                          <img 
                            src={species.imageUrl || 'https://images.unsplash.com/photo-1567425928496-1ab66c650131?q=80&w=1074&auto=format&fit=crop'} 
                            alt={species.commonName} 
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <h4 className="font-montserrat font-semibold text-sm">{species.commonName}</h4>
                            <p className="text-xs text-[#757575] italic">{species.scientificName}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-600 font-semibold text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Key Highlights
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">Perfect for beginners and snorkelers</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Shore dive with easy sandy beach entry
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Shallow depths ideal for beginners (2-15m)
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Blennies, seahorses, and striped catfish
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      125-meter jetty in Mangles Bay
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Near Rockingham Wreck Trail
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Small schooling fish and nudibranchs
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
                  <p className="text-sm text-gray-700 mb-3">Site layout and navigation tips</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Enter from sandy beach area adjacent to jetty</div>
                    <div>• Explore jetty pylons and surrounding debris fields</div>
                    <div>• Head east (~90°) to floating pontoon and anchor buoy</div>
                    <div>• Check for additional submerged objects around pontoon</div>
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
                  <p className="text-sm text-gray-700 mb-3">Explore maritime history and ecosystems</p>
                  <div className="space-y-2">
                    {lessonCallout}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <strong>Learn more:</strong> Dive deeper into the history, ecology, and conservation of this site.
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
                    <div>• <strong>Access:</strong> End of Fisher Street, 45 minutes south of Perth CBD</div>
                    <div>• <strong>Entry:</strong> Sandy beach - avoid sharp rocks, watch for wave breaks</div>
                    <div>• <strong>Best Time:</strong> Early mornings with calm weather and easterly winds</div>
                    <div>• <strong>Visibility:</strong> 6-20m depending on conditions, better on calm days</div>
                    <div>• <strong>Caution:</strong> Avoid during high swell, watch for fishing lines and boat traffic</div>
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
                  <p className="text-sm text-gray-700 mb-3">Explore maritime history and ecosystems</p>
                  <div className="space-y-2">
                    {lessonCallout}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <strong>Learn more:</strong> Dive deeper into the history, ecology, and conservation of this site.
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

          {/* Camilla Wreck specific sections */}
          {diveSite.name === "Camilla Wreck" && (
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
                        <div className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200 block cursor-pointer">
                          <img 
                            src={species.imageUrl || 'https://images.unsplash.com/photo-1567425928496-1ab66c650131?q=80&w=1074&auto=format&fit=crop'} 
                            alt={species.commonName} 
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2">
                            <h4 className="font-montserrat font-semibold text-sm">{species.commonName}</h4>
                            <p className="text-xs text-[#757575] italic">{species.scientificName}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-amber-600 font-semibold text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Key Highlights
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">Historic shallow wreck perfect for beginners</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      1834 schooner wreck, scuttled in 1903
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Maximum depth only 3.6m - snorkeling possible
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      80m surface swim from Challenger Beach
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Paddle grass ecosystem with sea anemones
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Stripeys, cardinalfish, and wavy grubfish
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Protected maritime heritage site
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
                  <p className="text-sm text-gray-700 mb-3">Simple site layout near ALCOA Jetty</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• Walk north 120m to erosion point in dunes</div>
                    <div>• Head west into water, swim 80m to wreck</div>
                    <div>• Wreck is approximately 10m in length</div>
                    <div>• Surrounded by paddle grass beds</div>
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
                  <p className="text-sm text-gray-700 mb-3">Explore maritime history and ecosystems</p>
                  <div className="space-y-2">
                    {lessonCallout}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <strong>Learn more:</strong> Dive deeper into the history, ecology, and conservation of this site.
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
                    <div>• <strong>Access:</strong> Challenger Beach via Sutton Road off Cockburn Road</div>
                    <div>• <strong>Conditions:</strong> Site exposed, avoid rough weather and high winds</div>
                    <div>• <strong>Visibility:</strong> Low to moderate, easily disturbed sediment</div>
                    <div>• <strong>Navigation:</strong> Use dive flag - proximity to working jetty</div>
                    <div>• <strong>Heritage:</strong> Protected site - do not disturb or remove artifacts</div>
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

        <TabsContent value="dive-map" className="mt-0">
          <DiveMapTab diveSiteId={diveSite.id} />
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
