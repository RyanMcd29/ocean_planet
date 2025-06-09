import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { Icon, divIcon } from "leaflet";
import { DiveSite } from "@shared/schema";
import { Link } from "wouter";

interface MapMarkerProps {
  diveSite: DiveSite;
  isActive: boolean;
  onClick: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ diveSite, isActive, onClick }) => {
  // Create custom marker icons using divIcon for better compatibility
  const icon = useMemo(() => {
    return divIcon({
      html: `
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: ${isActive ? '#EB6440' : '#0A4D68'};
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      className: 'custom-div-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    });
  }, [isActive]);

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