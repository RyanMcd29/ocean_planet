import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDiveSites } from '@/lib/api';
import { DiveSite } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Waves, ZoomIn, ZoomOut, Navigation } from 'lucide-react';

interface InteractiveMapProps {
  onSelectDiveSite: (site: DiveSite) => void;
  selectedDiveSiteId?: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onSelectDiveSite, selectedDiveSiteId }) => {
  const [zoom, setZoom] = useState(2);
  const [center, setCenter] = useState({ lat: -20, lng: 140 });
  const [hoveredSite, setHoveredSite] = useState<number | null>(null);

  const { data: diveSites, isLoading } = useQuery({
    queryKey: ['/api/dive-sites'],
    queryFn: () => fetchDiveSites(),
  });

  // Calculate visible dive sites based on zoom and center
  const getVisibleSites = () => {
    if (!diveSites) return [];
    
    const latRange = 180 / Math.pow(2, zoom);
    const lngRange = 360 / Math.pow(2, zoom);
    
    return diveSites.filter(site => {
      const latDiff = Math.abs(site.latitude - center.lat);
      const lngDiff = Math.abs(site.longitude - center.lng);
      return latDiff <= latRange && lngDiff <= lngRange;
    });
  };

  const visibleSites = getVisibleSites();

  // Convert coordinates to screen position
  const getScreenPosition = (site: DiveSite) => {
    const mapWidth = 800;
    const mapHeight = 600;
    
    const latRange = 180 / Math.pow(2, zoom);
    const lngRange = 360 / Math.pow(2, zoom);
    
    const x = ((site.longitude - (center.lng - lngRange)) / (2 * lngRange)) * mapWidth;
    const y = mapHeight - (((site.latitude - (center.lat - latRange)) / (2 * latRange)) * mapHeight);
    
    return { x: Math.max(0, Math.min(mapWidth, x)), y: Math.max(0, Math.min(mapHeight, y)) };
  };

  const handleSiteClick = (site: DiveSite) => {
    onSelectDiveSite(site);
    setCenter({ lat: site.latitude, lng: site.longitude });
    if (zoom < 4) setZoom(4);
  };

  const handleZoomIn = () => setZoom(Math.min(6, zoom + 1));
  const handleZoomOut = () => setZoom(Math.max(1, zoom - 1));

  const resetView = () => {
    setCenter({ lat: -20, lng: 140 });
    setZoom(2);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Waves className="h-8 w-8 animate-bounce text-[#05BFDB] mx-auto mb-2" />
          <p className="text-[#0A4D68] font-medium">Loading dive sites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-50 overflow-hidden">
      {/* World Map Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(5, 191, 219, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(8, 131, 149, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(10, 77, 104, 0.2) 0%, transparent 50%)
          `
        }}
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button
          onClick={handleZoomIn}
          size="sm"
          className="w-10 h-10 p-0 bg-white/90 hover:bg-white text-[#0A4D68] border border-gray-200 shadow-md"
          disabled={zoom >= 6}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleZoomOut}
          size="sm"
          className="w-10 h-10 p-0 bg-white/90 hover:bg-white text-[#0A4D68] border border-gray-200 shadow-md"
          disabled={zoom <= 1}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          onClick={resetView}
          size="sm"
          className="w-10 h-10 p-0 bg-white/90 hover:bg-white text-[#0A4D68] border border-gray-200 shadow-md"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Info */}
      <div className="absolute top-4 left-4 z-20">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="text-sm font-medium text-[#0A4D68] mb-1">
              Ocean Planet Dive Sites
            </div>
            <div className="text-xs text-gray-600">
              {visibleSites.length} of {diveSites?.length || 0} visible
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Zoom: {zoom}/6
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Dive Sites */}
      <div className="absolute inset-0">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          className="w-full h-full"
        >
          {/* Grid lines for reference */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(5, 191, 219, 0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />

          {/* Dive Site Markers */}
          {visibleSites.map((site) => {
            const pos = getScreenPosition(site);
            const isSelected = selectedDiveSiteId === site.id;
            const isHovered = hoveredSite === site.id;
            
            return (
              <g key={site.id}>
                {/* Marker Shadow */}
                <circle
                  cx={pos.x + 2}
                  cy={pos.y + 2}
                  r={isSelected ? 12 : isHovered ? 10 : 8}
                  fill="rgba(0, 0, 0, 0.2)"
                />
                
                {/* Marker */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 12 : isHovered ? 10 : 8}
                  fill={isSelected ? "#EB6440" : "#05BFDB"}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => handleSiteClick(site)}
                  onMouseEnter={() => setHoveredSite(site.id)}
                  onMouseLeave={() => setHoveredSite(null)}
                />
                
                {/* Marker Icon */}
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="8"
                  className="pointer-events-none"
                >
                  🤿
                </text>

                {/* Site Name on Hover */}
                {(isHovered || isSelected) && (
                  <g>
                    <rect
                      x={pos.x - 40}
                      y={pos.y - 35}
                      width="80"
                      height="20"
                      rx="4"
                      fill="rgba(10, 77, 104, 0.9)"
                      stroke="#05BFDB"
                      strokeWidth="1"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 25}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize="10"
                      className="font-medium"
                    >
                      {site.name.length > 12 ? site.name.substring(0, 12) + '...' : site.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Region Labels */}
      <div className="absolute bottom-4 left-4 z-20">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-[#05BFDB]"></div>
              <span className="text-[#0A4D68] font-medium">Dive Site</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <div className="w-3 h-3 rounded-full bg-[#EB6440]"></div>
              <span className="text-[#0A4D68] font-medium">Selected</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-20">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="text-xs text-gray-600 max-w-48">
              Click markers to explore dive sites. Use zoom controls to navigate.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveMap;