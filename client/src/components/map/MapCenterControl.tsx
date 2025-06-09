import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapCenterControlProps {
  center: [number, number];
}

const MapCenterControl: React.FC<MapCenterControlProps> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.setView(center, map.getZoom());
    }
  }, [map, center]);

  return null;
};

export default MapCenterControl;