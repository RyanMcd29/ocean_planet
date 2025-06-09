import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DiveSite } from "@shared/schema";
import MapMarker from "./MapMarker";
import MapFilters from "./MapFilters";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSites } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface DiveMapProps {
  onSelectDiveSite: (diveSite: DiveSite) => void;
  selectedDiveSiteId?: number;
}

// Component to handle map center changes
const MapCenterControl: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

const DiveMap: React.FC<DiveMapProps> = ({ onSelectDiveSite, selectedDiveSiteId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 20]); // Center on global view
  
  const { data: diveSites, isLoading, error } = useQuery({
    queryKey: ['/api/dive-sites', searchQuery, filters],
    queryFn: () => fetchDiveSites(searchQuery, filters)
  });


  
  // Update map center when a dive site is selected
  useEffect(() => {
    if (selectedDiveSiteId && diveSites) {
      const selectedSite = diveSites.find(site => site.id === selectedDiveSiteId);
      if (selectedSite) {
        setMapCenter([selectedSite.latitude, selectedSite.longitude]);
      }
    }
  }, [selectedDiveSiteId, diveSites]);
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };
  
  if (isLoading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-[#E0F7FA]">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#E0F7FA]">
        <p className="text-[#EB6440] font-semibold">Failed to load dive sites</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <MapCenterControl center={mapCenter} />
        
        {diveSites && diveSites.map(diveSite => (
          <MapMarker
            key={diveSite.id}
            diveSite={diveSite}
            isActive={diveSite.id === selectedDiveSiteId}
            onClick={() => onSelectDiveSite(diveSite)}
          />
        ))}
      </MapContainer>
      
      <div className="absolute top-4 left-4 right-4 z-[400]">
        <MapFilters 
          onSearchChange={handleSearchChange} 
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default DiveMap;
