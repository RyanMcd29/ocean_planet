import React, { useState } from "react";
import DiveMap from "@/components/map/DiveMap";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSite } from "@/lib/api";
import DiveSiteDetails from "@/components/dive-site/DiveSiteDetails";
import { DiveSite } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage: React.FC = () => {
  const [selectedDiveSiteId, setSelectedDiveSiteId] = useState<number | undefined>(undefined);
  
  const { data: diveSite, isLoading } = useQuery({
    queryKey: [`/api/dive-sites/${selectedDiveSiteId}`],
    queryFn: () => fetchDiveSite(selectedDiveSiteId!),
    enabled: !!selectedDiveSiteId,
  });
  
  const handleSelectDiveSite = (site: DiveSite) => {
    setSelectedDiveSiteId(site.id);
  };
  
  return (
    <main className="flex-1 flex flex-col lg:flex-row">
      {/* Map Section */}
      <section className="map-container lg:w-2/3 h-[60vh] lg:h-auto relative">
        <div className="map-overlay absolute inset-0">
          <DiveMap 
            onSelectDiveSite={handleSelectDiveSite}
            selectedDiveSiteId={selectedDiveSiteId}
          />
        </div>
        {/* Scroll indicator for mobile - only show when no dive site is selected */}
        {!selectedDiveSiteId && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:hidden">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg flex items-center gap-2 text-[#0A4D68] text-sm font-medium">
              <span>Scroll down to explore</span>
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )}
      </section>
      
      {/* Side Panel Content */}
      <section className="lg:w-1/3 bg-white shadow-md lg:overflow-y-auto lg:max-h-[calc(100vh-64px)]">
        {selectedDiveSiteId ? (
          isLoading ? (
            <div className="p-4">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-8 w-2/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/3 mb-2" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ) : diveSite ? (
            <DiveSiteDetails diveSite={diveSite} />
          ) : (
            <div className="p-8 text-center">
              <p className="text-[#EB6440] font-semibold">Failed to load dive site details</p>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center min-h-[50vh] p-8 text-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-montserrat font-bold ocean-text-gradient mb-3">Welcome to Ocean Planet</h2>
              <p className="text-[#505050] mb-6">
                Explore the world's most fascinating dive sites. Click on any marker on the map to learn more about dive sites, marine species, and local diving conditions.
              </p>
              <div className="bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] p-4 rounded-lg shadow-md">
                <h3 className="text-[#088395] font-semibold mb-2">Getting Started</h3>
                <ul className="text-sm text-[#757575] text-left space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#05BFDB] h-5 w-5 mr-2 flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>Click on any blue marker on the map to view dive site details.</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#05BFDB] h-5 w-5 mr-2 flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>Use the search and filter options at the top of the map to find specific dive sites.</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#05BFDB] h-5 w-5 mr-2 flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>Explore marine species, view photos, and read reviews from the dive community.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
