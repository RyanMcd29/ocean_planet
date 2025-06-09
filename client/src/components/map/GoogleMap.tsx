import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useQuery } from '@tanstack/react-query';
import { fetchDiveSites } from '@/lib/api';
import { DiveSite } from '@shared/schema';

interface GoogleMapProps {
  onSelectDiveSite: (site: DiveSite) => void;
  selectedDiveSiteId?: number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ onSelectDiveSite, selectedDiveSiteId }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const markerClusterRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { data: diveSites } = useQuery({
    queryKey: ['/api/dive-sites'],
    queryFn: fetchDiveSites,
  });

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['marker', 'geometry']
      });

      try {
        await loader.load();
        
        if (mapRef.current && !mapInstanceRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: -20.0, lng: 140.0 }, // Center on Australia
            zoom: 4,
            styles: [
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#05BFDB' }]
              },
              {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
              }
            ],
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true
          });

          mapInstanceRef.current = map;
          setIsMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Add markers when dive sites are loaded
  useEffect(() => {
    if (isMapLoaded && diveSites && mapInstanceRef.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Create custom dive flag icon
      const diveFlagIcon = {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#05BFDB;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#088395;stop-opacity:1" />
              </linearGradient>
            </defs>
            <!-- Flag pole -->
            <rect x="2" y="8" width="2" height="32" fill="#0A4D68"/>
            <!-- Flag -->
            <path d="M4 8 L26 8 L26 20 L16 15 L4 20 Z" fill="url(#flagGradient)" stroke="#0A4D68" stroke-width="1"/>
            <!-- Flag wave effect -->
            <path d="M26 8 Q28 10 26 12 Q28 14 26 16 Q28 18 26 20" fill="none" stroke="url(#flagGradient)" stroke-width="2"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 40),
        anchor: new google.maps.Point(16, 40)
      };

      // Add markers for each dive site
      diveSites.forEach((site: DiveSite) => {
        const marker = new google.maps.Marker({
          position: { lat: site.latitude, lng: site.longitude },
          map: mapInstanceRef.current,
          title: site.name,
          icon: diveFlagIcon,
          animation: google.maps.Animation.DROP
        });

        // Add click listener
        marker.addListener('click', () => {
          onSelectDiveSite(site);
          
          // Animate selected marker
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => marker.setAnimation(null), 2000);
        });

        // Highlight selected marker
        if (selectedDiveSiteId === site.id) {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => marker.setAnimation(null), 2000);
        }

        markersRef.current.push(marker);
      });

      // Fit map to show all markers
      if (markersRef.current.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markersRef.current.forEach(marker => {
          const position = marker.getPosition();
          if (position) bounds.extend(position);
        });
        mapInstanceRef.current.fitBounds(bounds);
        
        // Ensure minimum zoom level
        const listener = google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
          if (mapInstanceRef.current!.getZoom()! > 10) {
            mapInstanceRef.current!.setZoom(10);
          }
          google.maps.event.removeListener(listener);
        });
      }
    }
  }, [isMapLoaded, diveSites, selectedDiveSiteId, onSelectDiveSite]);

  // Update selected marker when selectedDiveSiteId changes
  useEffect(() => {
    if (selectedDiveSiteId && diveSites && mapInstanceRef.current) {
      const selectedSite = diveSites.find(site => site.id === selectedDiveSiteId);
      if (selectedSite) {
        mapInstanceRef.current.setCenter({
          lat: selectedSite.latitude,
          lng: selectedSite.longitude
        });
        if (mapInstanceRef.current.getZoom()! < 8) {
          mapInstanceRef.current.setZoom(8);
        }
      }
    }
  }, [selectedDiveSiteId, diveSites]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#05BFDB] mx-auto mb-2"></div>
            <p className="text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      )}

      {/* Map controls overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-2 z-10">
        <div className="text-sm font-medium text-[#0A4D68] mb-1">
          {diveSites?.length || 0} Dive Sites
        </div>
        <div className="text-xs text-gray-600">
          Click markers to explore
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 z-10">
        <div className="flex items-center gap-2 text-sm">
          <svg width="20" height="25" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#05BFDB', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#088395', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <rect x="2" y="8" width="2" height="22" fill="#0A4D68"/>
            <path d="M4 8 L20 8 L20 18 L12 14 L4 18 Z" fill="url(#legendGradient)" stroke="#0A4D68" strokeWidth="1"/>
          </svg>
          <span className="text-[#0A4D68] font-medium">Dive Site</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;