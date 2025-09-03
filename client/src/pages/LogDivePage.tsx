import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Clock, Thermometer, Eye, Waves, Users, FileText, Fish, Plus, X } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

// Form validation schema
const logDiveSchema = z.object({
  diveSiteId: z.number().min(1, "Please select a dive site"),
  diveDate: z.string().min(1, "Dive date is required"),
  diveTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  duration: z.number().min(1, "Duration must be at least 1 minute").max(300, "Duration cannot exceed 5 hours"),
  maxDepth: z.number().min(0.1, "Maximum depth is required").max(100, "Depth seems unrealistic"),
  avgDepth: z.number().optional(),
  waterTemp: z.number().optional(),
  visibility: z.number().optional(),
  current: z.string().optional(),
  conditions: z.string().optional(),
  description: z.string().min(10, "Please provide at least 10 characters describing your dive"),
  equipment: z.string().optional(),
  certificationLevel: z.string().optional(),
  buddyName: z.string().optional(),
});

type LogDiveFormData = z.infer<typeof logDiveSchema>;

interface SpeciesSighting {
  speciesId: number;
  quantity: number;
  notes: string;
}

const LogDivePage: React.FC = () => {
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesSighting[]>([]);
  const [speciesSearch, setSpeciesSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const form = useForm<LogDiveFormData>({
    resolver: zodResolver(logDiveSchema),
    defaultValues: {
      diveSiteId: undefined,
      diveDate: new Date().toISOString().split('T')[0],
      diveTime: "10:00",
      duration: 45,
      maxDepth: 18,
      avgDepth: 12,
      waterTemp: undefined,
      visibility: undefined,
      current: "None",
      conditions: "Good",
      description: "",
      equipment: "",
      certificationLevel: "Open Water",
      buddyName: "",
    },
  });

  // Fetch dive sites for selection
  const { data: diveSites = [] } = useQuery({
    queryKey: ['/api/dive-sites'],
  });

  // Fetch species for selection
  const { data: allSpecies = [] } = useQuery({
    queryKey: ['/api/species'],
  });

  // Filter species based on search
  const filteredSpecies = allSpecies.filter((species: any) =>
    species.commonName.toLowerCase().includes(speciesSearch.toLowerCase()) ||
    species.scientificName.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  // Create dive log mutation
  const createDiveLogMutation = useMutation({
    mutationFn: async (data: LogDiveFormData & { species: SpeciesSighting[] }) => {
      return apiRequest('POST', '/api/dive-logs', data);
    },
    onSuccess: () => {
      toast({
        title: "Dive Logged Successfully!",
        description: "Your dive has been added to your logbook.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dive-logs'] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/spotted-species`] });
      form.reset();
      setSelectedSpecies([]);
      // Navigate to My Dives page
      setLocation('/profile?tab=dives');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log dive. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addSpeciesSighting = (species: any) => {
    if (!selectedSpecies.find(s => s.speciesId === species.id)) {
      setSelectedSpecies([...selectedSpecies, {
        speciesId: species.id,
        quantity: 1,
        notes: ""
      }]);
    }
    setSpeciesSearch("");
  };

  const removeSpeciesSighting = (speciesId: number) => {
    setSelectedSpecies(selectedSpecies.filter(s => s.speciesId !== speciesId));
  };

  const updateSpeciesSighting = (speciesId: number, field: keyof SpeciesSighting, value: any) => {
    setSelectedSpecies(selectedSpecies.map(s => 
      s.speciesId === speciesId ? { ...s, [field]: value } : s
    ));
  };

  const onSubmit = (data: LogDiveFormData) => {
    createDiveLogMutation.mutate({
      ...data,
      species: selectedSpecies
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-montserrat font-bold text-[#0A4D68] mb-4">
            Log Your Dive
          </h1>
          <p className="text-gray-600 text-lg">
            Record your diving experience and contribute to marine research
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Dive Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#0A4D68]">
                  <MapPin className="w-5 h-5 mr-2" />
                  Dive Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="diveSiteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dive Site</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a dive site" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {diveSites.map((site: any) => (
                              <SelectItem key={site.id} value={site.id.toString()}>
                                {site.name} - {site.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diveDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dive Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diveTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="300"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dive Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#0A4D68]">
                  <Eye className="w-5 h-5 mr-2" />
                  Dive Profile & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxDepth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Depth (meters)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            min="0.1"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avgDepth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average Depth (meters)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            min="0.1"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="waterTemp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Water Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility (meters)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="current"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Strength</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select current strength" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Light">Light</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Strong">Strong</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Conditions</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select conditions" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Species Sightings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#0A4D68]">
                  <Fish className="w-5 h-5 mr-2" />
                  Marine Life Spotted
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Search and Add Species</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        placeholder="Search for species..."
                        value={speciesSearch}
                        onChange={(e) => setSpeciesSearch(e.target.value)}
                      />
                    </div>
                    
                    {speciesSearch && filteredSpecies.length > 0 && (
                      <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                        {filteredSpecies.slice(0, 5).map((species: any) => (
                          <div
                            key={species.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => addSpeciesSighting(species)}
                          >
                            <div className="font-medium text-sm">{species.commonName}</div>
                            <div className="text-xs text-gray-500 italic">{species.scientificName}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedSpecies.length > 0 && (
                    <div className="space-y-3">
                      <Label>Species Sighted</Label>
                      {selectedSpecies.map((sighting) => {
                        const species = allSpecies.find((s: any) => s.id === sighting.speciesId);
                        return (
                          <div key={sighting.speciesId} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-medium text-sm">{species?.commonName}</div>
                                <div className="text-xs text-gray-500 italic">{species?.scientificName}</div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSpeciesSighting(sighting.speciesId)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Quantity</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={sighting.quantity}
                                  onChange={(e) => updateSpeciesSighting(
                                    sighting.speciesId, 
                                    'quantity', 
                                    parseInt(e.target.value)
                                  )}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Notes</Label>
                                <Input
                                  placeholder="Optional notes..."
                                  value={sighting.notes}
                                  onChange={(e) => updateSpeciesSighting(
                                    sighting.speciesId, 
                                    'notes', 
                                    e.target.value
                                  )}
                                  className="h-8"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#0A4D68]">
                  <FileText className="w-5 h-5 mr-2" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dive Experience Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your dive experience, what you saw, how it felt..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Used</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 12L steel tank, 5mm wetsuit..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certificationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certification Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select certification" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Open Water">Open Water</SelectItem>
                            <SelectItem value="Advanced Open Water">Advanced Open Water</SelectItem>
                            <SelectItem value="Rescue Diver">Rescue Diver</SelectItem>
                            <SelectItem value="Divemaster">Divemaster</SelectItem>
                            <SelectItem value="Instructor">Instructor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buddyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dive Buddy</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Buddy's name (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                size="lg"
                className="bg-[#088395] hover:bg-[#0A4D68] text-white px-8"
                disabled={createDiveLogMutation.isPending}
              >
                {createDiveLogMutation.isPending ? "Logging Dive..." : "Log Dive"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LogDivePage;