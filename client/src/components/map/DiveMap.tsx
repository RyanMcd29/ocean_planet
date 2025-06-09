import React from "react";
import { DiveSite } from "@shared/schema";
import GoogleMap from "./GoogleMap";

interface DiveMapProps {
  onSelectDiveSite: (diveSite: DiveSite) => void;
  selectedDiveSiteId?: number;
}

const DiveMap: React.FC<DiveMapProps> = ({ onSelectDiveSite, selectedDiveSiteId }) => {
  return (
    <GoogleMap 
      onSelectDiveSite={onSelectDiveSite}
      selectedDiveSiteId={selectedDiveSiteId}
    />
  );
};

export default DiveMap;