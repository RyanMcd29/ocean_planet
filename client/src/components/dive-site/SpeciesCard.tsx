import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Species } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle } from "lucide-react";

interface SpeciesCardProps {
  species: Species;
  frequency?: string;
  isSpotted?: boolean;
  onSpotSpecies?: () => void;
}

const SpeciesCard: React.FC<SpeciesCardProps> = ({ 
  species, 
  frequency, 
  isSpotted = false,
  onSpotSpecies
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md bg-[#F5F5F5]">
      <div className="relative">
        <img 
          src={species.imageUrl} 
          alt={species.commonName} 
          className="w-full h-40 object-cover"
        />
        {frequency && (
          <Badge 
            className={`absolute top-2 right-2 ${
              frequency === "Common" 
                ? "bg-green-500" 
                : frequency === "Uncommon" 
                ? "bg-amber-500" 
                : "bg-red-500"
            }`}
          >
            {frequency}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-montserrat font-semibold text-[#0A4D68]">{species.commonName}</h3>
            <p className="text-sm italic text-[#757575]">{species.scientificName}</p>
          </div>
          {isSpotted && (
            <Badge variant="outline" className="bg-[#05BFDB] text-white border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              Spotted
            </Badge>
          )}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {species.habitats?.slice(0, 3).map((habitat, index) => (
            <Badge key={index} variant="outline" className="bg-[#E0F7FA] text-[#0A4D68] text-xs border-[#05BFDB]">
              {habitat}
            </Badge>
          ))}
          {species.habitats && species.habitats.length > 3 && (
            <Badge variant="outline" className="bg-transparent text-[#088395] text-xs border-[#088395]">
              +{species.habitats.length - 3} more
            </Badge>
          )}
        </div>
        
        {species.conservationStatus && (
          <div className="mt-2">
            <Badge variant={species.conservationStatus === "Least Concern" ? "outline" : "destructive"} className={
              species.conservationStatus === "Least Concern" 
                ? "bg-green-100 text-green-800 border-green-200" 
                : (species.conservationStatus === "Near Threatened" || species.conservationStatus === "Vulnerable")
                ? "bg-amber-100 text-amber-800 border-amber-200"
                : "bg-red-100 text-red-800 border-red-200"
            }>
              {species.conservationStatus}
            </Badge>
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <Link href={`/species/${species.id}`}>
            <Button variant="outline" size="sm" className="text-[#088395] border-[#088395] hover:bg-[#E0F7FA]">
              <Eye className="h-4 w-4 mr-1" /> Details
            </Button>
          </Link>
          
          {onSpotSpecies && !isSpotted && (
            <Button 
              size="sm" 
              className="bg-[#05BFDB] hover:bg-[#088395] text-white"
              onClick={onSpotSpecies}
            >
              Mark as spotted
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeciesCard;
