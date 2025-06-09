import React, { useState } from "react";
import { DiveSite } from "@shared/schema";
import MapFilters from "./MapFilters";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSites } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MapPin, Waves } from "lucide-react";

interface DiveMapProps {
  onSelectDiveSite: (diveSite: DiveSite) => void;
  selectedDiveSiteId?: number;
}

const DiveMap: React.FC<DiveMapProps> = ({ onSelectDiveSite, selectedDiveSiteId }) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  const { data: diveSites, isLoading, error } = useQuery({
    queryKey: ['/api/dive-sites'],
    queryFn: () => fetchDiveSites(),
  });

  // Apply filters
  const filteredDiveSites = diveSites?.filter(site => {
    const regionMatch = selectedRegions.length === 0 || selectedRegions.includes(site.region || '');
    const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(site.difficulty);
    return regionMatch && difficultyMatch;
  }) || [];

  // Group sites by region for better organization
  const sitesByRegion = filteredDiveSites.reduce((acc, site) => {
    const region = site.region || 'Other';
    if (!acc[region]) acc[region] = [];
    acc[region].push(site);
    return acc;
  }, {} as Record<string, DiveSite[]>);

  const handleFilterChange = (type: 'region' | 'difficulty', values: string[]) => {
    if (type === 'region') {
      setSelectedRegions(values);
    } else {
      setSelectedDifficulties(values);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Waves className="h-8 w-8 animate-bounce text-[#05BFDB] mx-auto mb-2" />
          <p className="text-[#0A4D68] font-medium">Loading dive sites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading dive sites</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-cyan-50">
      <MapFilters 
        diveSites={diveSites || []}
        onFilterChange={handleFilterChange}
      />
      
      {/* Interactive Dive Site Explorer */}
      <div className="p-4 h-full overflow-y-auto">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-[#0A4D68] mb-2">World-Class Dive Sites</h2>
          <p className="text-[#757575]">
            {filteredDiveSites.length} amazing locations to explore
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(sitesByRegion).map(([region, sites]) => (
            <div key={region} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#05BFDB] to-[#088395] text-white p-3">
                <h3 className="font-bold text-lg">{region}</h3>
                <p className="text-sm opacity-90">{sites.length} dive sites</p>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedDiveSiteId === site.id
                        ? 'border-[#05BFDB] bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-[#05BFDB]'
                    }`}
                    onClick={() => onSelectDiveSite(site)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-[#0A4D68] text-sm">{site.name}</h4>
                      <MapPin className="h-4 w-4 text-[#05BFDB] flex-shrink-0" />
                    </div>
                    
                    <p className="text-xs text-[#757575] mb-2">{site.location}, {site.country}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        site.difficulty === 'Beginner' 
                          ? 'bg-green-100 text-green-800'
                          : site.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {site.difficulty}
                      </span>
                      
                      {site.minDepth && site.maxDepth && (
                        <span className="text-xs text-[#757575]">
                          {site.minDepth}-{site.maxDepth}m
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredDiveSites.length === 0 && (
          <div className="text-center py-12">
            <Waves className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#0A4D68] mb-2">No dive sites found</h3>
            <p className="text-[#757575] mb-4">
              Try adjusting your filters to see more locations
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedRegions([]);
                setSelectedDifficulties([]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiveMap;