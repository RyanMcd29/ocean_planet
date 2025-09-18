import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, MapPin, Clock, Waves, Fish, Thermometer } from "lucide-react";
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