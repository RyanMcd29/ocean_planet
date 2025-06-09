import React from "react";
import { WaterConditions } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Thermometer, 
  Eye, 
  Wind, 
  Waves, 
  Activity,
  Clock,
  AlertTriangle
} from "lucide-react";

interface WaterConditionsCardProps {
  conditions: WaterConditions | LiveOceanConditions;
  compact?: boolean;
}

interface LiveOceanConditions {
  seaSurfaceTemperature: number;
  currentSpeed: number;
  currentDirection: string;
  windDirection: string;
  windSpeed: number;
  waveHeight: number;
  timestamp: string;
}

const WaterConditionsCard: React.FC<WaterConditionsCardProps> = ({ 
  conditions, 
  compact = false 
}) => {
  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'dangerous': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather?.toLowerCase()) {
      case 'sunny': return '☀️';
      case 'partly cloudy': return '⛅';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'stormy': return '⛈️';
      default: return '🌤️';
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isLiveData = 'seaSurfaceTemperature' in conditions;

  if (compact) {
    return (
      <div className="bg-white rounded-lg p-3 shadow-sm border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-[#088395]" />
            <span className="text-sm font-medium">
              {isLiveData ? 'Live AODN Data' : 'Current Conditions'}
            </span>
          </div>
          {!isLiveData && 'divingConditions' in conditions && (
            <Badge className={getConditionColor(conditions.divingConditions || '')}>
              {conditions.divingConditions}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Thermometer className="h-3 w-3 text-red-500" />
            <span>
              {isLiveData 
                ? conditions.seaSurfaceTemperature 
                : ('waterTemp' in conditions ? conditions.waterTemp : 'N/A')
              }°C
            </span>
          </div>
          {isLiveData ? (
            <>
              <div className="flex items-center space-x-1">
                <Wind className="h-3 w-3 text-gray-500" />
                <span>{conditions.windSpeed}kts {conditions.windDirection}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Waves className="h-3 w-3 text-cyan-500" />
                <span>{conditions.waveHeight}m</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3 text-blue-500" />
                <span>{conditions.visibility}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <Waves className="h-3 w-3 text-cyan-500" />
                <span>{conditions.waveHeight}m</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-[#088395]" />
            <span>Water Conditions</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {formatTime(conditions.timestamp)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Diving Conditions */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Diving Conditions</span>
          <Badge className={getConditionColor(conditions.divingConditions || '')}>
            {conditions.divingConditions}
          </Badge>
        </div>

        {/* Weather Overview */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getWeatherIcon(conditions.weatherConditions || '')}</span>
            <span className="font-medium">{conditions.weatherConditions}</span>
          </div>
          <span className="text-sm text-gray-600">{conditions.surfaceConditions}</span>
        </div>

        {/* Water Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <Thermometer className="h-6 w-6 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Water Temperature</p>
              <p className="font-bold text-lg">{conditions.waterTemp}°C</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Eye className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Visibility</p>
              <p className="font-bold text-lg">{conditions.visibility}m</p>
            </div>
          </div>
        </div>

        {/* Current & Wave Conditions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-[#088395]" />
              <span className="text-sm font-medium">Current</span>
            </div>
            <p className="text-sm">
              <span className="font-medium">{conditions.currentStrength}</span>
              {conditions.currentDirection && (
                <span className="text-gray-600"> from {conditions.currentDirection}</span>
              )}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Waves className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-medium">Waves</span>
            </div>
            <p className="text-sm font-medium">{conditions.waveHeight}m</p>
          </div>
        </div>

        {/* Wind Conditions */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Wind</span>
          </div>
          <div className="text-right">
            <p className="font-medium">{conditions.windSpeed} km/h</p>
            {conditions.windDirection && (
              <p className="text-sm text-gray-600">from {conditions.windDirection}</p>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        {conditions.additionalNotes && (
          <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Additional Notes</p>
                <p className="text-sm text-yellow-700">{conditions.additionalNotes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Data Source */}
        <div className="text-xs text-gray-500 text-center">
          Reported by: {conditions.reportedBy || 'Unknown'}
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterConditionsCard;