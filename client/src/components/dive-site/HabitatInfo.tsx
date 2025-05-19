import React from "react";
import { DiveSite } from "@shared/schema";
import SpeciesTag from "@/components/ui/SpeciesTag";

interface HabitatInfoProps {
  diveSite: DiveSite;
}

const HabitatInfo: React.FC<HabitatInfoProps> = ({ diveSite }) => {
  if (!diveSite.habitats || diveSite.habitats.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-montserrat font-bold text-[#0A4D68] mb-2">Habitat</h3>
      <div className="bg-[#E0F7FA] p-3 rounded-lg">
        <p className="text-sm text-[#757575] mb-3">
          The {diveSite.name} consists of various habitats including:
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {diveSite.habitats.map((habitat, index) => (
            <SpeciesTag key={index} name={habitat} />
          ))}
        </div>
        
        {diveSite.mainImage && (
          <>
            <img 
              src={diveSite.mainImage}
              alt={`Aerial view of ${diveSite.name}`} 
              className="rounded-lg w-full h-32 object-cover mb-2"
            />
            <p className="text-xs text-[#757575] italic text-center">Aerial view of the reef system</p>
          </>
        )}
      </div>
    </div>
  );
};

export default HabitatInfo;
