import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapFiltersProps {
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: Record<string, any>) => void;
  className?: string;
}

const MapFilters: React.FC<MapFiltersProps> = ({ onSearchChange, onFilterChange, className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [depthRange, setDepthRange] = useState<{min?: number, max?: number}>({});
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchQuery);
  };
  
  const applyFilters = () => {
    onFilterChange({
      region,
      difficulty,
      minDepth: depthRange.min,
      maxDepth: depthRange.max
    });
  };
  
  const clearFilters = () => {
    setRegion("");
    setDifficulty("");
    setDepthRange({});
    onFilterChange({});
  };
  
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="hidden md:flex justify-between">
        <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-lg shadow-lg flex items-center w-1/3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 mx-2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <Input
            type="text"
            placeholder="Search dive sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none outline-none shadow-none focus-visible:ring-0"
          />
        </form>
        
        <div className="flex space-x-2">
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="border-none min-w-[150px] focus:ring-0">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Belize">Belize</SelectItem>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
                <SelectItem value="Philippines">Philippines</SelectItem>
                <SelectItem value="Thailand">Thailand</SelectItem>
                <SelectItem value="Mexico">Mexico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="border-none min-w-[150px] focus:ring-0">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Difficulties</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-white p-2 rounded-lg shadow-lg flex items-center">
            <Button 
              variant="ghost" 
              className="border-none"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              More Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* More filters dropdown */}
      {showMoreFilters && (
        <div className="bg-white p-4 rounded-lg shadow-lg mt-2">
          <h3 className="font-montserrat font-semibold mb-3">Additional Filters</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Min Depth (meters)</label>
              <Input 
                type="number" 
                min={0}
                placeholder="Min depth"
                value={depthRange.min || ''}
                onChange={(e) => setDepthRange({...depthRange, min: e.target.value ? parseInt(e.target.value) : undefined})}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Max Depth (meters)</label>
              <Input 
                type="number"
                min={0}
                placeholder="Max depth"
                value={depthRange.max || ''}
                onChange={(e) => setDepthRange({...depthRange, max: e.target.value ? parseInt(e.target.value) : undefined})}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={clearFilters}>Clear</Button>
            <Button 
              className="bg-[#05BFDB] hover:bg-[#088395] text-white" 
              onClick={() => {
                applyFilters();
                setShowMoreFilters(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
      
      {/* Mobile search */}
      <div className="md:hidden bg-[#088395] px-4 py-2 shadow-md -mx-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input 
            type="text"
            placeholder="Search dive sites, species, regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 pr-10 rounded-lg border border-[#E0F7FA] focus:outline-none focus:ring-2 focus:ring-[#05BFDB]"
          />
          <Button 
            type="submit"
            variant="ghost" 
            className="absolute right-3 top-3 h-4 w-4 p-0 text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MapFilters;
