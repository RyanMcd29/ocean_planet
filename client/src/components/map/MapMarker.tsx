import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { DiveSite } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface MapMarkerProps {
  diveSite: DiveSite;
  isActive: boolean;
  onClick: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ diveSite, isActive, onClick }) => {
  console.log('MapMarker rendering for:', diveSite.name, 'at coordinates:', diveSite.latitude, diveSite.longitude);
  
  // Create custom marker icons
  const activeIcon = new Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#EB6440" />
        <circle cx="12" cy="12" r="6" fill="#FFFFFF" />
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  const defaultIcon = new Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#0A4D68" />
        <circle cx="12" cy="12" r="6" fill="#05BFDB" />
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  return (
    <Marker
      position={[diveSite.latitude, diveSite.longitude]}
      icon={isActive ? activeIcon : defaultIcon}
      eventHandlers={{
        click: onClick
      }}
      className={cn(
        "marker",
        isActive && "active-marker"
      )}
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