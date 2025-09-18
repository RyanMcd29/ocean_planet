import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Clock, Waves, Fish, Thermometer, FileText, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertDiveLogSchema, type InsertDiveLog } from "@shared/schema";
import { z } from "zod";

interface SpeciesSighting {
  speciesId: number;
  quantity: number;
  notes: string;
}

// Form schema for edit page (dates as strings for HTML inputs)
const editDiveSchema = z.object({
  diveSiteId: z.number(),
  diveDate: z.string(),
  diveTime: z.string(),
  duration: z.number(),
  maxDepth: z.number(),
  avgDepth: z.number().optional(),
  waterTemp: z.number().optional(),
  visibility: z.number().optional(),
  current: z.string().optional(),
  conditions: z.string().optional(),
  description: z.string().optional(),
  equipment: z.string().optional(),
  certificationLevel: z.string().optional(),
  buddyName: z.string().optional(),
});

type EditDiveFormData = z.infer<typeof editDiveSchema>;

export default function EditDivePage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesSighting[]>([]);
  const [speciesSearch, setSpeciesSearch] = useState("");

  // Fetch the dive log to edit
  const { data: diveLogData, isLoading: diveLogLoading } = useQuery({
    queryKey: [`/api/dive-logs/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/dive-logs/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dive log');
      }
      const data = await response.json();
      return data.diveLog;
    },
    enabled: !!id
  });

  // Set up form with existing data  
  const form = useForm<EditDiveFormData>({
    resolver: zodResolver(editDiveSchema),
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

  // Update form when dive log data loads
  useEffect(() => {
    if (diveLogData) {
      const diveDate = new Date(diveLogData.diveDate);
      const formattedDate = diveDate.toISOString().split('T')[0];
      
      form.reset({
        diveSiteId: diveLogData.diveSiteId,
        diveDate: formattedDate,
        diveTime: diveLogData.diveTime,
        duration: diveLogData.duration,
        maxDepth: diveLogData.maxDepth,
        avgDepth: diveLogData.avgDepth,
        waterTemp: diveLogData.waterTemp,
        visibility: diveLogData.visibility,
        current: diveLogData.current || "None",
        conditions: diveLogData.conditions || "Good",
        description: diveLogData.description || "",
        equipment: diveLogData.equipment || "",
        certificationLevel: diveLogData.certificationLevel || "Open Water",
        buddyName: diveLogData.buddyName || "",
      });
      
      // Set species data
      if (diveLogData.species) {
        setSelectedSpecies(diveLogData.species.map((s: any) => ({
          speciesId: s.species.id,
          quantity: s.quantity || 1,
          notes: s.notes || ""
        })));
      }
    }
  }, [diveLogData, form]);

  // Fetch dive sites for selection
  const { data: diveSites = [] } = useQuery({
    queryKey: ['/api/dive-sites'],
  });

  // Fetch species for selection
  const { data: allSpecies = [] } = useQuery({
    queryKey: ['/api/species'],
  });

  // Filter species based on search
  const filteredSpecies = (allSpecies as any[]).filter((species: any) =>
    species.commonName.toLowerCase().includes(speciesSearch.toLowerCase()) ||
    species.scientificName.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  // Update dive log mutation
  const updateDiveLogMutation = useMutation({
    mutationFn: async (data: Omit<InsertDiveLog, 'userId'> & { species: SpeciesSighting[] }) => {
      return apiRequest(`/api/dive-logs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Dive Updated Successfully!",
        description: "Your dive log has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dive-logs'] });
      queryClient.invalidateQueries({ queryKey: [`/api/dive-logs/${id}`] });
      // Navigate back to profile
      setLocation('/profile?tab=dives');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update dive. Please try again.",
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

  const onSubmit = (data: EditDiveFormData) => {
    // Convert form data to API format
    const submitData = {
      ...data,
      diveDate: new Date(data.diveDate), // Convert string to Date
      species: selectedSpecies
    };
    updateDiveLogMutation.mutate(submitData);
  };

  if (diveLogLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!diveLogData) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-[#757575] mb-4">Dive log not found.</p>
            <Button onClick={() => setLocation('/profile?tab=dives')}>
              Back to My Dives
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/profile?tab=dives')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Dives
        </Button>
        <div>
          <h1 className="text-2xl font-montserrat font-bold text-[#0A4D68]">Edit Dive Log</h1>
          <p className="text-[#757575]">
            Update your dive details and species sightings.
          </p>
        </div>
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
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a dive site" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(diveSites as any[]).map((site: any) => (
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

          {/* Depth & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-[#0A4D68]">
                <Waves className="w-5 h-5 mr-2" />
                Depth & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="maxDepth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Depth (m)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
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
                      <FormLabel>Avg Depth (m)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
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
                  name="waterTemp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
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
                      const species = (allSpecies as any[]).find((s: any) => s.id === sighting.speciesId);
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                          placeholder="Name of your diving partner..."
                          {...field}
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
                      <FormLabel>Visibility (m)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
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
                      <FormLabel>Current</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <FormLabel>Conditions</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation('/profile?tab=dives')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#05BFDB] hover:bg-[#088395] text-white"
              disabled={updateDiveLogMutation.isPending}
            >
              {updateDiveLogMutation.isPending ? "Updating..." : "Update Dive"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}