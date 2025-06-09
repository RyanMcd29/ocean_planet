import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DiveSite } from "@shared/schema";
import MapMarker from "./MapMarker";
import RegionalCluster from "./RegionalCluster";
import MapFilters from "./MapFilters";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSites } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { clusterDiveSites, getRegionBounds } from "@/utils/mapClustering";

interface DiveMapProps {
  onSelectDiveSite: (diveSite: DiveSite) => void;
  selectedDiveSiteId?: number;
}

// Component to handle map center and zoom changes
const MapCenterControl: React.FC<{ 
  center: [number, number]; 
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Component to handle zoom events and update clustering
const ZoomHandler: React.FC<{ onZoomChange: (zoom: number) => void }> = ({ onZoomChange }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  return null;
};

const DiveMap: React.FC<DiveMapProps> = ({ onSelectDiveSite, selectedDiveSiteId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 20]); // Center on global view
  const [currentZoom, setCurrentZoom] = useState(3);
  
  const { data: diveSites, isLoading, error } = useQuery({
    queryKey: ['/api/dive-sites', searchQuery, filters],
    queryFn: () => fetchDiveSites(searchQuery, filters)
  });

  // Cluster dive sites based on zoom level
  const { clusters, individualSites } = diveSites 
    ? clusterDiveSites(diveSites, currentZoom)
    : { clusters: [], individualSites: [] };
  
  // Update map center when a dive site is selected
  useEffect(() => {
    if (selectedDiveSiteId && diveSites) {
      const selectedSite = diveSites.find(site => site.id === selectedDiveSiteId);
      if (selectedSite) {
        setMapCenter([selectedSite.latitude, selectedSite.longitude]);
      }
    }
  }, [selectedDiveSiteId, diveSites]);

  const handleClusterClick = (clusterSites: DiveSite[]) => {
    const bounds = getRegionBounds(clusterSites);
    const centerLat = (bounds.minLat + bounds.maxLat) / 2;
    const centerLng = (bounds.minLng + bounds.maxLng) / 2;
    
    setMapCenter([centerLat, centerLng]);
    setCurrentZoom(6); // Zoom in to show individual sites
  };
  
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
        
        <MapCenterControl center={mapCenter} zoom={currentZoom} />
        <ZoomHandler onZoomChange={setCurrentZoom} />
        
        {/* Render regional clusters */}
        {clusters.map(cluster => (
          <RegionalCluster
            key={cluster.id}
            sites={cluster.sites}
            regionName={cluster.regionName}
            centerLat={cluster.centerLat}
            centerLng={cluster.centerLng}
            onClick={() => handleClusterClick(cluster.sites)}
          />
        ))}
        
        {/* Render individual dive sites */}
        {individualSites.map(diveSite => (
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
