import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSpeciesById, fetchDiveSites } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, MapPin, Info, AlertTriangle, Check, BookOpen, Globe } from "lucide-react";
import SpeciesTag from "@/components/ui/SpeciesTag";

const SpeciesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const speciesId = parseInt(id);
  const [selectedDiveSiteId, setSelectedDiveSiteId] = useState<number | null>(null);
  const [showDiveSiteSelector, setShowDiveSiteSelector] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: species, isLoading, error } = useQuery({
    queryKey: [`/api/species/${speciesId}`],
    queryFn: () => fetchSpeciesById(speciesId),
    enabled: !isNaN(speciesId),
  });
  
  const { data: diveSites } = useQuery({
    queryKey: ['/api/dive-sites'],
    queryFn: () => fetchDiveSites(),
  });

  // Check if user has already spotted this species
  const { data: userSpottedSpecies } = useQuery({
    queryKey: ['/api/users/1/spotted-species'],
  });

  const isAlreadySpotted = userSpottedSpecies?.some((item: any) => item.species.id === speciesId);

  // Mutation to log species sighting
  const logSightingMutation = useMutation({
    mutationFn: async (data: { userId: number; diveSiteId: number; speciesId: number; notes?: string }) => {
      return apiRequest('/api/spotted-species', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Sighting Logged!",
        description: `Successfully logged your sighting of ${species?.commonName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/spotted-species'] });
      setShowDiveSiteSelector(false);
      setSelectedDiveSiteId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log sighting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogSighting = () => {
    if (!selectedDiveSiteId) {
      setShowDiveSiteSelector(true);
      return;
    }
    
    logSightingMutation.mutate({
      userId: 1, // Using hardcoded user ID for now
      diveSiteId: selectedDiveSiteId,
      speciesId: speciesId,
      notes: `Spotted during dive at ${diveSites?.find(site => site.id === selectedDiveSiteId)?.name}`
    });
  };
  
  // We would normally get this from an API call, but for now let's filter dive sites that might have this species
  // In a real implementation, there would be a separate endpoint for this data
  const relevantDiveSites = diveSites?.slice(0, 3);
  
  if (isNaN(speciesId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg text-center text-red-600">
          <p>Invalid species ID. Please check the URL and try again.</p>
          <Link href="/">
            <Button variant="link" className="mt-4 text-blue-600">Return to home page</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-4 flex-1">
      <div className="flex items-center mb-4">
        <Link href="/">
          <Button variant="outline" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-montserrat font-bold text-[#0A4D68]">
          {isLoading ? <Skeleton className="h-8 w-48" /> : species?.commonName}
        </h1>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="w-full h-96 rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-6 w-2/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg text-center text-red-600">
          <p>Failed to load species details. Please try again later.</p>
          <Link href="/">
            <Button variant="link" className="mt-4 text-blue-600">Return to home page</Button>
          </Link>
        </div>
      ) : species ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <img 
                src={species.imageUrl} 
                alt={species.commonName} 
                className="w-full h-[400px] object-cover"
              />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-montserrat font-bold text-[#0A4D68]">{species.commonName}</h2>
                    <p className="text-lg italic text-[#757575]">{species.scientificName}</p>
                  </div>
                  
                  <div>
                    <Badge className={
                      species.conservationStatus === "Least Concern" 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : (species.conservationStatus === "Near Threatened" || species.conservationStatus === "Vulnerable")
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }>
                      Conservation: {species.conservationStatus}
                    </Badge>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68] mb-2">Description</h3>
                  <p className="text-[#757575]">{species.description}</p>
                  
                  <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68] mt-6 mb-2">Habitats</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {species.habitats.map((habitat, index) => (
                      <SpeciesTag key={index} name={habitat} />
                    ))}
                  </div>
                  
                  {species.conservationStatus !== "Least Concern" && (
                    <div className="mt-6 bg-[#FFAB91] bg-opacity-10 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="text-[#EB6440] mr-2 h-5 w-5" />
                        <h3 className="font-montserrat font-semibold text-[#EB6440]">Conservation Concerns</h3>
                      </div>
                      <p className="text-sm text-[#757575]">
                        This species is classified as <strong>{species.conservationStatus}</strong>. It faces threats from habitat destruction, pollution, climate change, and overfishing. Conservation efforts are needed to protect this species.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {species.funFacts && species.funFacts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68] mb-4">🎯 Fun Facts</h3>
                  <div className="space-y-3">
                    {species.funFacts.map((fact, index) => (
                      <div key={index} className="flex items-start p-3 bg-[#E0F7FA] rounded-lg">
                        <span className="text-lg mr-3 flex-shrink-0">
                          {fact.split(' ')[0]}
                        </span>
                        <p className="text-[#0A4D68] text-sm leading-relaxed">
                          {fact.split(' ').slice(1).join(' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {species.keyFacts && species.keyFacts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-5 w-5 text-[#0A4D68] mr-2" />
                    <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68]">Key Facts & Learning</h3>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {species.keyFacts.map((fact: any, index: number) => (
                      <AccordionItem key={index} value={`fact-${index}`}>
                        <AccordionTrigger className="text-left font-medium text-[#0A4D68]">
                          {fact.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-[#088395]">{fact.summary}</p>
                            <p className="text-sm text-[#757575] leading-relaxed">{fact.details}</p>
                            {fact.subPoints && fact.subPoints.length > 0 && (
                              <div className="mt-3 pl-4 border-l-2 border-[#E0F7FA]">
                                <ul className="space-y-2">
                                  {fact.subPoints.map((point: string, idx: number) => (
                                    <li key={idx} className="text-sm text-[#757575] flex items-start">
                                      <span className="text-[#05BFDB] mr-2 flex-shrink-0">•</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68] mb-4">Citizen Science Contributions</h3>
                <p className="text-[#757575] mb-4">
                  Help marine scientists track and monitor {species.commonName} populations by logging your sightings during dives. Your data contributes to global conservation efforts.
                </p>
                
                {showDiveSiteSelector && !isAlreadySpotted && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#0A4D68] mb-2">
                      Where did you spot this species?
                    </label>
                    <Select onValueChange={(value) => setSelectedDiveSiteId(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dive site" />
                      </SelectTrigger>
                      <SelectContent>
                        {diveSites?.map((site: any) => (
                          <SelectItem key={site.id} value={site.id.toString()}>
                            {site.name} - {site.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {isAlreadySpotted ? (
                  <Button disabled className="bg-green-500 text-white">
                    <Check className="h-4 w-4 mr-2" />
                    Already Logged
                  </Button>
                ) : (
                  <Button 
                    className="bg-[#05BFDB] hover:bg-[#088395] text-white"
                    onClick={handleLogSighting}
                    disabled={logSightingMutation.isPending}
                  >
                    {logSightingMutation.isPending ? 'Logging...' : 'Log Sighting'}
                  </Button>
                )}
                
                {showDiveSiteSelector && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDiveSiteSelector(false)}
                    className="ml-2"
                  >
                    Cancel
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {(species.regionFound || species.tags?.length > 0 || species.seasonalOccurrence || relevantDiveSites?.length > 0) && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="h-5 w-5 text-[#0A4D68] mr-2" />
                    <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68]">Distribution & Ecology</h3>
                  </div>
                  <div className="space-y-3">
                    {species.regionFound && (
                      <div>
                        <p className="text-sm font-medium text-[#0A4D68]">Region</p>
                        <p className="text-[#757575]">{species.regionFound}</p>
                      </div>
                    )}
                    {species.seasonalOccurrence && (
                      <div>
                        <p className="text-sm font-medium text-[#0A4D68]">When to See</p>
                        <p className="text-[#757575]">{species.seasonalOccurrence}</p>
                      </div>
                    )}
                    {species.tags && species.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-[#0A4D68] mb-2">Environment Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {species.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#E0F7FA] text-[#088395] text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {relevantDiveSites && relevantDiveSites.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-[#0A4D68] mb-2">Where to Find</p>
                        <div className="space-y-2">
                          {relevantDiveSites.map((site) => (
                            <Link key={site.id} href={`/dive-site/${site.id}`}>
                              <a className="flex items-center p-2 bg-[#F5F5F5] rounded-lg hover:bg-[#E0F7FA] transition cursor-pointer">
                                <MapPin className="h-4 w-4 text-[#088395] mr-2 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-[#0A4D68]">{site.name}</p>
                                  <p className="text-xs text-[#757575]">{site.location}</p>
                                </div>
                              </a>
                            </Link>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2 text-[#088395] border-[#088395]">
                          <Info className="h-4 w-4 mr-1" /> View All Locations
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68] mb-4">Classification</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-[#0A4D68]">Category</p>
                    <p className="text-[#757575]">{species.category}</p>
                  </div>
                  
                  {(species.domain || species.kingdom || species.phylum || species.class || species.order || species.family || species.genus) && (
                    <div>
                      <p className="text-sm font-medium text-[#0A4D68] mb-2">Taxonomic Hierarchy</p>
                      <div className="text-xs space-y-1 bg-[#F5F5F5] p-3 rounded">
                        {species.domain && (
                          <div className="flex justify-between">
                            <span className="text-[#757575]">Domain:</span>
                            <span className="font-medium text-[#0A4D68]">{species.domain}</span>
                          </div>
                        )}
                        {species.kingdom && (
                          <div className="flex justify-between">
                            <span className="text-[#757575]">Kingdom:</span>
                            <span className="font-medium text-[#0A4D68]">{species.kingdom}</span>
                          </div>
                        )}
                        {species.phylum && (
                          <div className="flex justify-between">
                            <span className="text-[#757575]">Phylum:</span>
                            <span className="font-medium text-[#0A4D68]">{species.phylum}</span>
                          </div>
                        )}
                        {species.class && (
                          <div className="flex justify-between">
                            <span className="text-[#757575]">Class:</span>
                            <span className="font-medium text-[#0A4D68]">{species.class}</span>
                          </div>
                        )}
                        {species.order && (
                          <div className="flex justify-between">
                            <span className="text-[#757575]">Order:</span>
                            <span className="font-medium text-[#0A4D68]">{species.order}</span>
                          </div>
                        )}
                        {species.family && (
                          <div className="flex justify-between">
                            <span className="text-[#757575]">Family:</span>
                            <span className="font-medium text-[#0A4D68]">{species.family}</span>
                          </div>
                        )}
                        {species.genus && (
                          <div className="flex justify-between">
                            <span className="text-[#757575]">Genus:</span>
                            <span className="font-medium text-[#0A4D68] italic">{species.genus}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-[#E0E0E0] mt-1">
                          <span className="text-[#757575]">Species:</span>
                          <span className="font-medium text-[#0A4D68] italic">{species.scientificName}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-[#0A4D68]">Habitats</p>
                    <p className="text-[#757575]">{species.habitats.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A4D68]">Conservation Status</p>
                    <p className="text-[#757575]">{species.conservationStatus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {species.miniLessonRecommendations && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <BookOpen className="h-5 w-5 text-[#0A4D68] mr-2" />
                    <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68]">Recommended Lessons</h3>
                  </div>
                  <div className="bg-[#E0F7FA] p-3 rounded-lg">
                    <p className="text-sm text-[#0A4D68] mb-3">{species.miniLessonRecommendations}</p>
                    <Link href="/learn">
                      <Button variant="outline" size="sm" className="w-full text-[#088395] border-[#088395] hover:bg-[#088395] hover:text-white">
                        <BookOpen className="h-4 w-4 mr-1" /> Explore Lessons
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-montserrat font-semibold text-[#0A4D68] mb-4">Photography Tips</h3>
                <ul className="space-y-2 text-sm text-[#757575]">
                  <li className="flex items-start">
                    <span className="text-[#05BFDB] mr-2">•</span>
                    <span>Keep a safe distance and never touch or disturb the animal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#05BFDB] mr-2">•</span>
                    <span>Use natural light when possible to capture true colors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#05BFDB] mr-2">•</span>
                    <span>Try to photograph the species' distinctive features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#05BFDB] mr-2">•</span>
                    <span>Add scale reference when possible (safely)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-lg text-center text-yellow-700">
          <p>Species not found. It may have been removed or is no longer available.</p>
          <Link href="/">
            <Button variant="link" className="mt-4 text-blue-600">Return to home page</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SpeciesPage;
