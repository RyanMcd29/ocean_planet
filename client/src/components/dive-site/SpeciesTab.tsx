import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSiteSpecies } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <div className="mb-6">
        <h3 className="text-2xl font-montserrat font-bold text-[#0A4D68] mb-2">Marine Species</h3>
        <p className="text-[#64748B] text-sm">Explore the diverse marine life found at this dive site</p>
      </div>
      
      <div className="bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] p-4 rounded-xl border border-[#E2E8F0] mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-1/2 bg-white border-[#CBD5E1] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
          />
          
          <div className="flex gap-2 md:w-1/2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white border-[#CBD5E1] focus:border-[#3B82F6] focus:ring-[#3B82F6]">
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
              <SelectTrigger className="bg-white border-[#CBD5E1] focus:border-[#3B82F6] focus:ring-[#3B82F6]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSpecies.map(({ species, frequency }) => (
            <div key={species.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="relative">
                <img 
                  src={species.imageUrl || 'https://images.unsplash.com/photo-1567425928496-1ab66c650131?q=80&w=1074&auto=format&fit=crop'} 
                  alt={species.commonName} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    frequency === "Common" ? "bg-green-500 text-white" :
                    frequency === "Uncommon" ? "bg-amber-500 text-white" :
                    frequency === "Rare" ? "bg-red-500 text-white" :
                    "bg-blue-500 text-white"
                  }`}>
                    {frequency || "Observed"}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    species.conservationStatus === 'Least Concern' ? 'bg-green-100 text-green-700' :
                    species.conservationStatus === 'Near Threatened' ? 'bg-yellow-100 text-yellow-700' :
                    species.conservationStatus === 'Vulnerable' ? 'bg-orange-100 text-orange-700' :
                    species.conservationStatus === 'Endangered' ? 'bg-red-100 text-red-700' :
                    species.conservationStatus === 'Critically Endangered' ? 'bg-red-200 text-red-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {species.conservationStatus || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-montserrat font-bold text-lg text-[#0F172A] mb-1 leading-tight">
                  {species.commonName}
                </h3>
                <p className="text-sm italic text-[#64748B] mb-3">
                  {species.scientificName}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#475569] bg-[#F1F5F9] px-3 py-1 rounded-full font-medium">
                    {species.category || 'Marine Life'}
                  </span>
                  {species.maxSize && (
                    <span className="text-xs text-[#64748B]">
                      Up to {species.maxSize}
                    </span>
                  )}
                </div>
                {species.description && (
                  <p className="text-xs text-[#64748B] leading-relaxed mb-3 line-clamp-2">
                    {species.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:from-[#1E40AF] hover:to-[#1E3A8A] transition-all duration-200 flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </button>
                  <button className="px-3 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg text-xs font-semibold hover:bg-[#F8FAFC] transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-8 rounded-2xl text-center border border-[#E2E8F0]">
          <div className="text-[#64748B] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto mb-4">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <h3 className="font-montserrat font-bold text-[#374151] mb-2">No Species Found</h3>
          <p className="text-[#64748B] text-sm">No species match your current search criteria. Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default SpeciesTab;
