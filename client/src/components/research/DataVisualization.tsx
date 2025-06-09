import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Thermometer, Waves, Fish, Calendar, Download, Filter, RefreshCw } from "lucide-react";

interface DataPoint {
  date: string;
  temperature: number;
  salinity: number;
  visibility: number;
  depth: number;
  speciesCount: number;
  diveSiteId: number;
  siteName: string;
  latitude: number;
  longitude: number;
}

interface SpeciesData {
  species: string;
  count: number;
  frequency: number;
  conservationStatus: string;
  depth: number;
}

interface ResearchDataProps {
  data: DataPoint[];
  speciesData: SpeciesData[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onExportData: () => void;
}

const COLORS = {
  primary: "#0891b2",
  secondary: "#06b6d4",
  accent: "#f59e0b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  temperature: "#dc2626",
  salinity: "#2563eb",
  visibility: "#059669",
  species: "#7c3aed"
};

const CHART_COLORS = [
  "#0891b2", "#06b6d4", "#10b981", "#f59e0b", 
  "#ef4444", "#7c3aed", "#ec4899", "#14b8a6"
];

export function DataVisualization({ 
  data, 
  speciesData, 
  timeRange, 
  onTimeRangeChange, 
  onExportData 
}: ResearchDataProps) {
  const [selectedChart, setSelectedChart] = useState("temperature");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [viewType, setViewType] = useState("temporal");

  // Process data for different visualizations
  const processedData = useMemo(() => {
    return data.map(point => ({
      ...point,
      date: new Date(point.date).toLocaleDateString(),
      temperatureRange: point.temperature < 20 ? "Cold" : point.temperature < 25 ? "Moderate" : "Warm",
      depthCategory: point.depth < 10 ? "Shallow" : point.depth < 30 ? "Medium" : "Deep"
    }));
  }, [data]);

  // Temperature trend analysis
  const temperatureTrend = useMemo(() => {
    if (data.length < 2) return null;
    const recent = data.slice(-7).reduce((sum, d) => sum + d.temperature, 0) / 7;
    const previous = data.slice(-14, -7).reduce((sum, d) => sum + d.temperature, 0) / 7;
    return recent - previous;
  }, [data]);

  // Species diversity metrics
  const diversityMetrics = useMemo(() => {
    const totalSpecies = speciesData.length;
    const endangeredCount = speciesData.filter(s => s.conservationStatus === "Endangered").length;
    const commonCount = speciesData.filter(s => s.conservationStatus === "Least Concern").length;
    
    return {
      total: totalSpecies,
      endangered: endangeredCount,
      common: commonCount,
      diversity: totalSpecies > 0 ? (totalSpecies - endangeredCount) / totalSpecies : 0
    };
  }, [speciesData]);

  // Aggregated data for different chart types
  const aggregatedData = useMemo(() => {
    const byDepth = processedData.reduce((acc, point) => {
      const category = point.depthCategory;
      if (!acc[category]) {
        acc[category] = { 
          category, 
          temperature: 0, 
          salinity: 0, 
          visibility: 0, 
          speciesCount: 0, 
          count: 0 
        };
      }
      acc[category].temperature += point.temperature;
      acc[category].salinity += point.salinity;
      acc[category].visibility += point.visibility;
      acc[category].speciesCount += point.speciesCount;
      acc[category].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(byDepth).map((item: any) => ({
      category: item.category,
      temperature: item.temperature / item.count,
      salinity: item.salinity / item.count,
      visibility: item.visibility / item.count,
      speciesCount: item.speciesCount / item.count
    }));
  }, [processedData]);

  const renderTemperatureChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="date" 
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
          label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke={COLORS.temperature}
          strokeWidth={3}
          dot={{ fill: COLORS.temperature, strokeWidth: 2, r: 4 }}
          name="Water Temperature"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderMultiMetricChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="date" 
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke={COLORS.temperature}
          strokeWidth={2}
          name="Temperature (°C)"
        />
        <Line 
          type="monotone" 
          dataKey="salinity" 
          stroke={COLORS.salinity}
          strokeWidth={2}
          name="Salinity (PSU)"
        />
        <Line 
          type="monotone" 
          dataKey="visibility" 
          stroke={COLORS.visibility}
          strokeWidth={2}
          name="Visibility (m)"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderDepthAnalysis = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={aggregatedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="category" 
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar dataKey="temperature" fill={COLORS.temperature} name="Avg Temperature" />
        <Bar dataKey="speciesCount" fill={COLORS.species} name="Avg Species Count" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderSpeciesDistribution = () => {
    const pieData = speciesData.slice(0, 8).map((species, index) => ({
      name: species.species,
      value: species.count,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderScatterPlot = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          type="number" 
          dataKey="temperature" 
          name="Temperature"
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
          label={{ value: 'Temperature (°C)', position: 'bottom' }}
        />
        <YAxis 
          type="number" 
          dataKey="speciesCount" 
          name="Species Count"
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
          label={{ value: 'Species Count', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
          formatter={(value, name) => [value, name === "temperature" ? "Temperature (°C)" : "Species Count"]}
          labelFormatter={(label) => `Site: ${processedData[label]?.siteName || 'Unknown'}`}
        />
        <Scatter dataKey="speciesCount" fill={COLORS.species} />
      </ScatterChart>
    </ResponsiveContainer>
  );

  const renderTrendArea = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="date" 
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
          tick={{ fill: "#64748b" }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="visibility" 
          stackId="1" 
          stroke={COLORS.visibility} 
          fill={COLORS.visibility}
          fillOpacity={0.6}
          name="Visibility (m)"
        />
        <Area 
          type="monotone" 
          dataKey="speciesCount" 
          stackId="1" 
          stroke={COLORS.species} 
          fill={COLORS.species}
          fillOpacity={0.6}
          name="Species Count"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Research Data Visualization</h2>
          <p className="text-slate-600 mt-1">Advanced analytics for marine research data</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={onExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Thermometer className="h-4 w-4 mr-2" />
              Avg Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {data.length > 0 ? (data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(1) : '0'}°C
              </span>
              {temperatureTrend && (
                <div className={`flex items-center ${temperatureTrend > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {temperatureTrend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm ml-1">{Math.abs(temperatureTrend).toFixed(1)}°</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Waves className="h-4 w-4 mr-2" />
              Avg Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {data.length > 0 ? (data.reduce((sum, d) => sum + d.visibility, 0) / data.length).toFixed(1) : '0'}m
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Fish className="h-4 w-4 mr-2" />
              Species Diversity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{diversityMetrics.total}</span>
              <Badge variant={diversityMetrics.endangered > 5 ? "destructive" : "secondary"}>
                {diversityMetrics.endangered} endangered
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.length}</div>
            <p className="text-sm text-slate-600">across {new Set(data.map(d => d.diveSiteId)).size} sites</p>
          </CardContent>
        </Card>
      </div>

      {/* Main visualization area */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Data Analysis
              </CardTitle>
              <CardDescription>
                Interactive charts showing marine environmental and biological data trends
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewType === "temporal" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("temporal")}
              >
                <LineChartIcon className="h-4 w-4 mr-2" />
                Temporal
              </Button>
              <Button
                variant={viewType === "comparative" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("comparative")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Comparative
              </Button>
              <Button
                variant={viewType === "distribution" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("distribution")}
              >
                <PieChartIcon className="h-4 w-4 mr-2" />
                Distribution
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="temperature" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="multi">Multi-Metric</TabsTrigger>
              <TabsTrigger value="depth">Depth Analysis</TabsTrigger>
              <TabsTrigger value="species">Species</TabsTrigger>
              <TabsTrigger value="correlation">Correlation</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="temperature" className="mt-6">
              {renderTemperatureChart()}
            </TabsContent>
            
            <TabsContent value="multi" className="mt-6">
              {renderMultiMetricChart()}
            </TabsContent>
            
            <TabsContent value="depth" className="mt-6">
              {renderDepthAnalysis()}
            </TabsContent>
            
            <TabsContent value="species" className="mt-6">
              {renderSpeciesDistribution()}
            </TabsContent>
            
            <TabsContent value="correlation" className="mt-6">
              {renderScatterPlot()}
            </TabsContent>
            
            <TabsContent value="trends" className="mt-6">
              {renderTrendArea()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Species analysis table */}
      <Card>
        <CardHeader>
          <CardTitle>Species Distribution Analysis</CardTitle>
          <CardDescription>Detailed breakdown of marine species observations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 font-medium text-slate-700">Species</th>
                  <th className="text-left p-3 font-medium text-slate-700">Count</th>
                  <th className="text-left p-3 font-medium text-slate-700">Frequency</th>
                  <th className="text-left p-3 font-medium text-slate-700">Avg Depth</th>
                  <th className="text-left p-3 font-medium text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {speciesData.slice(0, 10).map((species, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{species.species}</td>
                    <td className="p-3 text-slate-700">{species.count}</td>
                    <td className="p-3 text-slate-700">{(species.frequency * 100).toFixed(1)}%</td>
                    <td className="p-3 text-slate-700">{species.depth}m</td>
                    <td className="p-3">
                      <Badge 
                        variant={
                          species.conservationStatus === "Endangered" ? "destructive" :
                          species.conservationStatus === "Vulnerable" ? "secondary" : "outline"
                        }
                      >
                        {species.conservationStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}