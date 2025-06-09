import React, { useMemo } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { DiveSite } from "@shared/schema";

interface RegionalClusterProps {
  sites: DiveSite[];
  regionName: string;
  centerLat: number;
  centerLng: number;
  onClick: () => void;
}

const RegionalCluster: React.FC<RegionalClusterProps> = ({ 
  sites, 
  regionName, 
  centerLat, 
  centerLng, 
  onClick 
}) => {
  const map = useMap();
  
  const clusterIcon = useMemo(() => {
    const zoom = map.getZoom();
    const siteCount = sites.length;
    
    // Scale cluster size based on zoom level and site count
    let size, fontSize;
    if (zoom <= 3) {
      size = Math.min(30 + siteCount * 2, 45);
      fontSize = 11;
    } else if (zoom <= 5) {
      size = Math.min(35 + siteCount * 2, 50);
      fontSize = 12;
    } else {
      size = Math.min(40 + siteCount * 2, 55);
      fontSize = 13;
    }
    
    return divIcon({
      html: `
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          cursor: pointer;
        ">
          <!-- Regional flag background -->
          <div style="
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0A4D68 0%, #05BFDB 100%);
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              color: white;
              font-size: ${fontSize}px;
              font-weight: bold;
              text-align: center;
              line-height: 1;
            ">
              ${siteCount}
            </div>
          </div>
          <!-- Small flag indicator -->
          <div style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 12px;
            height: 8px;
            background: linear-gradient(to right, white 0%, white 50%, #EB6440 50%, #EB6440 100%);
            border: 1px solid #333;
            border-radius: 1px;
          "></div>
        </div>
      `,
      className: 'regional-cluster-icon',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2 - 10],
    });
  }, [map, sites.length]);

  return (
    <Marker
      position={[centerLat, centerLng]}
      icon={clusterIcon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="p-3">
          <h3 className="font-montserrat font-semibold text-sm mb-2">{regionName}</h3>
          <p className="text-xs text-gray-600 mb-2">{sites.length} dive sites</p>
          <div className="space-y-1">
            {sites.slice(0, 3).map((site) => (
              <div key={site.id} className="text-xs">
                • {site.name}
              </div>
            ))}
            {sites.length > 3 && (
              <div className="text-xs text-gray-500">
                +{sites.length - 3} more sites...
              </div>
            )}
          </div>
          <button 
            className="mt-2 bg-[#05BFDB] hover:bg-[#0A4D68] text-white text-xs w-full py-1 rounded transition duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Zoom to Region
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default RegionalCluster;