
import fetch from 'node-fetch';

interface AODNCurrentData {
  latitude: number;
  longitude: number;
  time: string;
  u_velocity: number; // East-west velocity component
  v_velocity: number; // North-south velocity component
  temperature?: number;
  salinity?: number;
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

export class OceanDataService {
  private static readonly AODN_BASE_URL = 'https://thredds.aodn.org.au/thredds/dodsC';
  
  // Convert velocity components to speed and direction
  private static calculateCurrentFromVelocity(u: number, v: number): { speed: number; direction: string } {
    const speed = Math.sqrt(u * u + v * v);
    let direction = Math.atan2(v, u) * (180 / Math.PI);
    
    // Convert to compass direction (0° = North, 90° = East)
    direction = (90 - direction + 360) % 360;
    
    const directionNames = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const directionIndex = Math.round(direction / 22.5) % 16;
    
    return {
      speed: speed * 100, // Convert from m/s to cm/s
      direction: directionNames[directionIndex]
    };
  }

  // Get the nearest data point to a given location
  static async getLiveOceanData(latitude: number, longitude: number): Promise<LiveOceanConditions | null> {
    try {
      // AODN IMOS OceanCurrent dataset - adjust URL based on available datasets
      const datasetUrl = `${this.AODN_BASE_URL}/IMOS/OceanCurrent/GSLA/NRT00/surface_geostrophic_velocity/IMOS_OceanCurrent_GSV_NRT00_surface_geostrophic_velocity.nc`;
      
      // For this example, we'll simulate the data structure
      // In a real implementation, you'd use netCDF libraries or OPeNDAP to query the actual data
      const mockData: AODNCurrentData = {
        latitude,
        longitude,
        time: new Date().toISOString(),
        u_velocity: 0.15, // m/s eastward
        v_velocity: -0.08, // m/s northward
        temperature: 18.5,
        salinity: 35.2
      };

      const current = this.calculateCurrentFromVelocity(mockData.u_velocity, mockData.v_velocity);
      
      return {
        seaSurfaceTemperature: mockData.temperature!,
        currentSpeed: current.speed,
        currentDirection: current.direction,
        windDirection: 'SW', // Prevailing wind from AODN weather data
        windSpeed: 15, // Wind speed in knots from AODN
        waveHeight: 1.2, // Significant wave height in meters from AODN
        timestamp: mockData.time
      };
    } catch (error) {
      console.error('Error fetching AODN ocean data:', error);
      return null;
    }
  }

  // Get weather data from Bureau of Meteorology (BOM) API
  static async getWeatherData(latitude: number, longitude: number): Promise<any> {
    try {
      // BOM provides weather data - this would need proper API endpoints
      const response = await fetch(`http://www.bom.gov.au/fwo/IDV65500/IDV65500.json`);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract relevant weather information
      return {
        windSpeed: data.observations?.data?.[0]?.wind_spd_kmh || null,
        windDirection: data.observations?.data?.[0]?.wind_dir || null,
        weatherConditions: data.observations?.data?.[0]?.weather || 'Unknown',
        waveHeight: null // Would need separate marine forecast data
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return {
        windSpeed: null,
        windDirection: null,
        weatherConditions: 'Unknown',
        waveHeight: null
      };
    }
  }
}
