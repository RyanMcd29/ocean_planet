import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataVisualization } from "@/components/research/DataVisualization";
import { Microscope, Database, TrendingUp, FileSpreadsheet, Globe, Users, Calendar, AlertTriangle } from "lucide-react";

interface WaterCondition {
  id: number;
  diveSiteId: number;
  temperature: number;
  salinity: number;
  visibility: number;
  current: string;
  dateRecorded: string;
  depth: number;
}

interface DiveSite {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  maxDepth: number;
  country: string;
}

interface Species {
  id: number;
  commonName: string;
  scientificName: string;
  conservationStatus: string;
}

interface ResearchProject {
  id: number;
  title: string;
  description: string;
  status: "active" | "completed" | "pending";
  participants: number;
  dataPoints: number;
  startDate: string;
}

export default function ResearchPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // Fetch dive sites data
  const { data: diveSites = [] } = useQuery<DiveSite[]>({
    queryKey: ['/api/dive-sites'],
  });

  // Generate research data based on real dive sites
  const generateResearchData = () => {
    const data = [];
    const speciesData = [];
    const currentDate = new Date();
    
    // Generate water condition data for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      diveSites.slice(0, 3).forEach((site, siteIndex) => {
        // Generate realistic water conditions based on location
        const baseTemp = site.country === "Australia" ? 22 : 
                        site.country === "Maldives" ? 28 : 24;
        const seasonalVariation = Math.sin((i / 30) * Math.PI * 2) * 3;
        const dailyVariation = (Math.random() - 0.5) * 2;
        
        data.push({
          date: date.toISOString(),
          temperature: baseTemp + seasonalVariation + dailyVariation,
          salinity: 34 + (Math.random() - 0.5) * 2,
          visibility: Math.max(5, 25 + (Math.random() - 0.5) * 10),
          depth: site.maxDepth || 30,
          speciesCount: Math.floor(15 + Math.random() * 25),
          diveSiteId: site.id,
          siteName: site.name,
          latitude: site.latitude,
          longitude: site.longitude
        });
      });
    }

    // Generate species distribution data
    const commonSpecies = [
      { name: "Clownfish", status: "Least Concern", baseDepth: 15 },
      { name: "Green Sea Turtle", status: "Endangered", baseDepth: 10 },
      { name: "Reef Shark", status: "Vulnerable", baseDepth: 25 },
      { name: "Manta Ray", status: "Vulnerable", baseDepth: 20 },
      { name: "Coral Grouper", status: "Least Concern", baseDepth: 18 },
      { name: "Parrotfish", status: "Least Concern", baseDepth: 12 },
      { name: "Moray Eel", status: "Least Concern", baseDepth: 22 },
      { name: "Hawksbill Turtle", status: "Critically Endangered", baseDepth: 8 },
      { name: "Whale Shark", status: "Endangered", baseDepth: 30 },
      { name: "Barracuda", status: "Least Concern", baseDepth: 15 }
    ];

    commonSpecies.forEach(species => {
      speciesData.push({
        species: species.name,
        count: Math.floor(50 + Math.random() * 200),
        frequency: Math.random() * 0.8 + 0.1,
        conservationStatus: species.status,
        depth: species.baseDepth + (Math.random() - 0.5) * 10
      });
    });

    return { data, speciesData };
  };

  const { data: researchData, speciesData } = generateResearchData();

  // Mock research projects
  const researchProjects: ResearchProject[] = [
    {
      id: 1,
      title: "Coral Reef Health Monitoring",
      description: "Long-term study of coral reef ecosystems and bleaching patterns",
      status: "active",
      participants: 45,
      dataPoints: 1247,
      startDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Marine Species Migration Patterns",
      description: "Tracking seasonal migration of key marine species",
      status: "active",
      participants: 28,
      dataPoints: 892,
      startDate: "2024-03-01"
    },
    {
      id: 3,
      title: "Water Quality Impact Assessment",
      description: "Analyzing the relationship between water conditions and marine biodiversity",
      status: "completed",
      participants: 62,
      dataPoints: 2156,
      startDate: "2023-09-12"
    },
    {
      id: 4,
      title: "Climate Change Effects on Tropical Reefs",
      description: "Measuring temperature changes and their impact on reef ecosystems",
      status: "pending",
      participants: 15,
      dataPoints: 324,
      startDate: "2024-06-01"
    }
  ];

  const handleExportData = () => {
    const exportData = {
      waterConditions: researchData,
      species: speciesData,
      exportDate: new Date().toISOString(),
      timeRange: timeRange
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ocean-research-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const activeProjects = researchProjects.filter(p => p.status === "active");
  const totalDataPoints = researchProjects.reduce((sum, p) => sum + p.dataPoints, 0);
  const totalParticipants = researchProjects.reduce((sum, p) => sum + p.participants, 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Microscope className="h-10 w-10 text-blue-600" />
          Marine Research Dashboard
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Advanced data visualization and analysis tools for marine scientific research. 
          Collaborate with researchers worldwide to understand ocean ecosystems.
        </p>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Total Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalDataPoints.toLocaleString()}</div>
            <p className="text-sm text-slate-600">across all research projects</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Research Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalParticipants}</div>
            <p className="text-sm text-slate-600">citizen scientists and researchers</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeProjects.length}</div>
            <p className="text-sm text-slate-600">ongoing research initiatives</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Study Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{diveSites.length}</div>
            <p className="text-sm text-slate-600">monitored dive locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualization">Data Visualization</TabsTrigger>
          <TabsTrigger value="projects">Research Projects</TabsTrigger>
          <TabsTrigger value="contribute">Contribute Data</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="mt-6">
          <DataVisualization
            data={researchData}
            speciesData={speciesData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            onExportData={handleExportData}
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Research Projects</h2>
              <Button>
                <Microscope className="h-4 w-4 mr-2" />
                Start New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {researchProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="mt-2">{project.description}</CardDescription>
                      </div>
                      <Badge 
                        variant={
                          project.status === "active" ? "default" :
                          project.status === "completed" ? "secondary" : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Contributors</p>
                        <p className="font-semibold">{project.participants}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Data Points</p>
                        <p className="font-semibold">{project.dataPoints.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Started</p>
                        <p className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contribute" className="mt-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Contribute to Marine Research
                </CardTitle>
                <CardDescription>
                  Help scientists understand ocean ecosystems by contributing your dive observations and water condition measurements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-dashed border-slate-200 hover:border-blue-300 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Database className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Upload Water Data</h3>
                      <p className="text-slate-600 mb-4">
                        Share temperature, visibility, and salinity measurements from your dives
                      </p>
                      <Button>Upload Measurements</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed border-slate-200 hover:border-green-300 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Microscope className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Report Species Sightings</h3>
                      <p className="text-slate-600 mb-4">
                        Log marine species observations to help track biodiversity changes
                      </p>
                      <Button>Report Sightings</Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-800">Data Quality Guidelines</h4>
                        <p className="text-amber-700 text-sm mt-1">
                          Please ensure all measurements are accurate and include GPS coordinates, depth, and timestamp information. 
                          Quality data helps improve research outcomes and marine conservation efforts.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-slate-600">Contributors this month</div>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-green-600">2,400+</div>
                    <div className="text-sm text-slate-600">Data points submitted</div>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-slate-600">Research papers published</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}