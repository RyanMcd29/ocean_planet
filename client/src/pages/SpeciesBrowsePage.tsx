import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchSpecies } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  Fish, 
  Waves,
  Camera,
  MapPin,
  Info
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SpeciesBrowsePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [conservationFilter, setConservationFilter] = useState("");

  const { data: species, isLoading, error } = useQuery({
    queryKey: ['/api/species'],
    queryFn: () => fetchSpecies(),
  });

  const filteredSpecies = species?.filter(sp => {
    const matchesSearch = searchQuery === "" || 
      sp.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "" || categoryFilter === "all" || 
      sp.category === categoryFilter;
      
    const matchesConservation = conservationFilter === "" || conservationFilter === "all" || 
      sp.conservationStatus === conservationFilter;
      
    return matchesSearch && matchesCategory && matchesConservation;
  });

  // Get unique categories and conservation statuses for filters
  const categories = Array.from(new Set(species?.map(sp => sp.category).filter(Boolean) || []));
  const conservationStatuses = Array.from(new Set(species?.map(sp => sp.conservationStatus).filter(Boolean) || []));

  const getConservationBadgeStyle = (status: string) => {
    switch (status) {
      case "Least Concern":
        return "bg-green-100 text-green-800 border-green-200";
      case "Near Threatened":
      case "Vulnerable":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Endangered":
      case "Critically Endangered":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg text-center text-red-600">
          <p>Error loading species data. Please try again later.</p>
          <Link href="/">
            <Button variant="link" className="mt-4 text-blue-600">Return to home page</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-bold text-[#0A4D68] mb-2">
          Marine Species Directory
        </h1>
        <p className="text-[#757575] text-lg">
          Discover and learn about the incredible diversity of marine life found in our oceans
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search species by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category || 'unknown'}>
                    {category || 'Unknown'}
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
                {conservationStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Species Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="w-full h-48 mb-4 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSpecies && filteredSpecies.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-[#757575]">
            Found {filteredSpecies.length} species {searchQuery && `matching "${searchQuery}"`}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecies.map((sp) => (
              <Card key={sp.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={sp.imageUrl || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                      alt={sp.commonName}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getConservationBadgeStyle(sp.conservationStatus)}>
                        {sp.conservationStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68] mb-1">
                      {sp.commonName}
                    </h3>
                    <p className="text-sm italic text-[#757575] mb-2">
                      {sp.scientificName}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {sp.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-[#757575] mb-4 line-clamp-3">
                      {sp.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link href={`/species/${sp.id}`}>
                        <Button size="sm" className="bg-[#05BFDB] hover:bg-[#088395] text-white">
                          <Info className="h-4 w-4 mr-1" />
                          Learn More
                        </Button>
                      </Link>
                      
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Fish className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0A4D68] mb-2">No species found</h3>
          <p className="text-[#757575] mb-4">
            {searchQuery 
              ? `No species match your search for "${searchQuery}"`
              : "No species match your current filters"
            }
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("");
              setConservationFilter("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-[#0A4D68] flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Contribute to Marine Science
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Camera className="h-6 w-6 text-[#05BFDB] mt-1" />
              <div>
                <h4 className="font-semibold text-[#0A4D68] mb-1">Log Species Sightings</h4>
                <p className="text-sm text-[#757575] mb-2">
                  Help researchers by recording your marine life encounters during dives
                </p>
                <Link href="/log-dive">
                  <Button size="sm" variant="outline">Log a Dive</Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 text-[#05BFDB] mt-1" />
              <div>
                <h4 className="font-semibold text-[#0A4D68] mb-1">Find Dive Sites</h4>
                <p className="text-sm text-[#757575] mb-2">
                  Discover where you're most likely to encounter specific species
                </p>
                <Link href="/">
                  <Button size="sm" variant="outline">Explore Map</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeciesBrowsePage;