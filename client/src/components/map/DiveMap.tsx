import React from "react";
import { DiveSite } from "@shared/schema";
import InteractiveMap from "./InteractiveMap";

interface DiveMapProps {
  onSelectDiveSite: (diveSite: DiveSite) => void;
  selectedDiveSiteId?: number;
}

const DiveMap: React.FC<DiveMapProps> = ({ onSelectDiveSite, selectedDiveSiteId }) => {
  return (
    <div className="relative w-full h-full">
      <InteractiveMap 
        onSelectDiveSite={onSelectDiveSite}
        selectedDiveSiteId={selectedDiveSiteId}
      />
    </div>
  );
};

export default DiveMap;