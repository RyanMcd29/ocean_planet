import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSiteSpecies } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SpeciesCard from "./SpeciesCard";
import { Skeleton } from "@/components/ui/skeleton";

interface SpeciesTabProps {
  diveSiteId: number;
}

const SpeciesTab: React.FC<SpeciesTabProps> = ({ diveSiteId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [conservationFilter, setConservationFilter] = useState("");
  
  const { data: speciesData, isLoading, error } = useQuery({
    queryKey: [`/api/dive-sites/${diveSiteId}/species`],
    queryFn: () => fetchDiveSiteSpecies(diveSiteId),
  });
  
  const filteredSpecies = speciesData?.filter(({ species }) => {
    const matchesSearch = searchQuery === "" || 
      species.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      species.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "" || categoryFilter === "all" || 
      species.category === categoryFilter;
      
    const matchesConservation = conservationFilter === "" || conservationFilter === "all" || 
      species.conservationStatus === conservationFilter;
      
    return matchesSearch && matchesCategory && matchesConservation;
  });
  
  // Get unique categories and conservation statuses for filters
  const categories = Array.from(new Set(speciesData?.map(({ species }) => species.category) || []));
  const conservationStatuses = Array.from(new Set(speciesData?.map(({ species }) => species.conservationStatus) || []));
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-4">Marine Species</h3>
      
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Input
          placeholder="Search species..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/2"
        />
        
        <div className="flex gap-2 md:w-1/2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.filter(Boolean).map((category) => (
                <SelectItem key={category} value={category || "unknown"}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={conservationFilter} onValueChange={setConservationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Conservation Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {conservationStatuses.filter(Boolean).map((status) => (
                <SelectItem key={status} value={status || "unknown"}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="w-full h-40" />
              <div className="p-4">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg text-center text-red-600">
          Failed to load species data. Please try again later.
        </div>
      ) : filteredSpecies && filteredSpecies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpecies.map(({ species, frequency }) => (
            <SpeciesCard 
              key={species.id} 
              species={species} 
              frequency={frequency}
              onSpotSpecies={() => {
                // Here would be the logic to mark a species as spotted by the user
                console.log(`Marked ${species.commonName} as spotted`);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#F5F5F5] p-6 rounded-lg text-center">
          <p className="text-[#757575]">No species match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SpeciesTab;
