import React, { useMemo } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { Icon, divIcon } from "leaflet";
import { DiveSite } from "@shared/schema";
import { Link } from "wouter";

interface MapMarkerProps {
  diveSite: DiveSite;
  isActive: boolean;
  onClick: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ diveSite, isActive, onClick }) => {
  const map = useMap();
  
  // Create responsive dive flag marker icons based on zoom level
  const icon = useMemo(() => {
    const zoom = map.getZoom();
    const flagColor = isActive ? '#EB6440' : '#0A4D68';
    
    // Scale flag size based on zoom level
    let flagWidth, flagHeight, poleHeight, poleWidth;
    if (zoom <= 3) {
      flagWidth = 12; flagHeight = 8; poleHeight = 20; poleWidth = 1.5;
    } else if (zoom <= 5) {
      flagWidth = 16; flagHeight = 10; poleHeight = 24; poleWidth = 2;
    } else {
      flagWidth = 20; flagHeight = 12; poleHeight = 28; poleWidth = 2;
    }
    
    const totalWidth = flagWidth + 4;
    const totalHeight = poleHeight + 2;
    
    return divIcon({
      html: `
        <div style="
          position: relative;
          width: ${totalWidth}px;
          height: ${totalHeight}px;
          cursor: pointer;
        ">
          <!-- Flag pole -->
          <div style="
            position: absolute;
            left: 2px;
            top: 0;
            width: ${poleWidth}px;
            height: ${poleHeight}px;
            background-color: #333;
          "></div>
          <!-- Flag -->
          <div style="
            position: absolute;
            left: ${2 + poleWidth}px;
            top: 2px;
            width: ${flagWidth}px;
            height: ${flagHeight}px;
            background: linear-gradient(to right, white 0%, white 50%, ${flagColor} 50%, ${flagColor} 100%);
            border: 1px solid #333;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            transition: transform 0.2s ease;
          "></div>
        </div>
      `,
      className: 'custom-dive-flag-icon',
      iconSize: [totalWidth, totalHeight],
      iconAnchor: [2, totalHeight],
      popupAnchor: [totalWidth/2, -totalHeight],
    });
  }, [isActive, map]);

  return (
    <Marker
      position={[diveSite.latitude, diveSite.longitude]}
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-montserrat font-semibold">{diveSite.name}</h3>
          <p className="text-xs text-gray-600">{diveSite.location}</p>
          <div className="mt-2 flex space-x-2">
            <span className="bg-[#0A4D68] text-white text-xs px-2 py-1 rounded">
              {diveSite.difficulty}
            </span>
            {diveSite.minDepth && diveSite.maxDepth && (
              <span className="bg-[#088395] text-white text-xs px-2 py-1 rounded">
                {diveSite.minDepth}-{diveSite.maxDepth}m
              </span>
            )}
          </div>
          <Link href={`/dive-site/${diveSite.id}`}>
            <button 
              className="mt-2 bg-[#05BFDB] hover:bg-[#0A4D68] text-white text-xs w-full py-1 rounded transition duration-200"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              View Details
            </button>
          </Link>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;