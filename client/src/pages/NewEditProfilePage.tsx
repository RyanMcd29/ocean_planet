import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Save, IdCard, Award, Plus, X, Calendar } from "lucide-react";

// Validation schema for profile updates
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  preferredActivity: z.enum(['diving', 'freediving', 'snorkeling', 'other']),
  countryId: z.number().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

const addCertificationSchema = z.object({
  certificationId: z.number().min(1, "Please select a certification"),
  dateObtained: z.string().optional(),
  certificationNumber: z.string().optional(),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
type AddCertificationForm = z.infer<typeof addCertificationSchema>;

export default function NewEditProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddCertification, setShowAddCertification] = useState(false);

  // Use the working /api/users/me endpoint instead of the broken profile endpoint
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/users/me'],
  });

  // Fetch available countries
  const { data: countriesData } = useQuery({
    queryKey: ['/api/countries'],
  });

  // Fetch available certifications
  const { data: certificationsData } = useQuery({
    queryKey: ['/api/certifications'],
  });

  // Fetch user's current certifications
  const { data: userCertifications, isLoading: certificationsLoading } = useQuery({
    queryKey: ['/api/users/certifications'],
  });

  // Profile form
  const profileForm = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      preferredActivity: "diving",
      countryId: undefined,
      bio: "",
    },
  });

  // Certification form
  const certificationForm = useForm<AddCertificationForm>({
    resolver: zodResolver(addCertificationSchema),
    defaultValues: {
      certificationId: 0,
      dateObtained: "",
      certificationNumber: "",
    },
  });

  // Set form values when user data loads - using the working /api/users/me response
  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      console.log('Setting form values with user data:', user);
      profileForm.reset({
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
        preferredActivity: user.preferredActivity || "diving",
        countryId: user.countryId || undefined,
        bio: user.bio || "",
      });
    }
  }, [userData, profileForm]);

  // Profile update mutation - will create a working endpoint
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileForm) => {
      const response = await apiRequest("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Add certification mutation
  const addCertificationMutation = useMutation({
    mutationFn: (data: AddCertificationForm) => {
      const payload = {
        certificationId: data.certificationId,
        dateObtained: data.dateObtained || null,
        certificationNumber: data.certificationNumber || null,
      };
      return apiRequest("/api/users/certifications", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Certification added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users/certifications'] });
      setShowAddCertification(false);
      certificationForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add certification",
        variant: "destructive",
      });
    },
  });

  // Remove certification mutation
  const removeCertificationMutation = useMutation({
    mutationFn: (certificationId: number) => apiRequest(`/api/users/certifications/${certificationId}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Certification removed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users/certifications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove certification",
        variant: "destructive",
      });
    },
  });

  const onSubmitProfile = (data: UpdateProfileForm) => {
    console.log('Submitting profile data:', data);
    updateProfileMutation.mutate(data);
  };

  const onSubmitCertification = (data: AddCertificationForm) => {
    addCertificationMutation.mutate(data);
  };

  const handleRemoveCertification = (certificationId: number) => {
    if (confirm("Are you sure you want to remove this certification?")) {
      removeCertificationMutation.mutate(certificationId);
    }
  };

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const countries = countriesData?.countries || [];
  const certifications = certificationsData?.certifications || [];
  const userCerts = userCertifications?.certifications || [];
  const user = userData?.user;

  // Group certifications by agency
  const certificationsByAgency = certifications.reduce((acc: any, cert: any) => {
    if (!acc[cert.agency]) {
      acc[cert.agency] = [];
    }
    acc[cert.agency].push(cert);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/profile")}
            className="text-[#088395] hover:bg-[#E0F7FA]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold text-[#0A4D68]">Edit Profile</h1>
        </div>


        <div className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#0A4D68] flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="preferredActivity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Activity</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your preferred activity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="diving">Scuba Diving</SelectItem>
                              <SelectItem value="freediving">Freediving</SelectItem>
                              <SelectItem value="snorkeling">Snorkeling</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="countryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country: any) => (
                                <SelectItem key={country.id} value={country.id.toString()}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="bg-[#05BFDB] hover:bg-[#088395] text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Certifications Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-[#0A4D68] flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Diving Certifications
                </CardTitle>
                <Button
                  onClick={() => setShowAddCertification(!showAddCertification)}
                  className="bg-[#05BFDB] hover:bg-[#088395] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Certification Form */}
              {showAddCertification && (
                <Card className="bg-[#F5F5F5]">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0A4D68]">Add New Certification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...certificationForm}>
                      <form onSubmit={certificationForm.handleSubmit(onSubmitCertification)} className="space-y-4">
                        <FormField
                          control={certificationForm.control}
                          name="certificationId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certification</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a certification" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(certificationsByAgency).map(([agency, certs]: [string, any]) => (
                                    <div key={agency}>
                                      <div className="px-2 py-1 text-sm font-semibold text-[#088395]">
                                        {agency}
                                      </div>
                                      {certs.map((cert: any) => (
                                        <SelectItem key={cert.id} value={cert.id.toString()}>
                                          {cert.name}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={certificationForm.control}
                            name="dateObtained"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date Obtained (Optional)</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={certificationForm.control}
                            name="certificationNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certification Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            type="submit" 
                            disabled={addCertificationMutation.isPending}
                            className="bg-[#05BFDB] hover:bg-[#088395] text-white"
                          >
                            {addCertificationMutation.isPending ? "Adding..." : "Add Certification"}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setShowAddCertification(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {/* Current Certifications */}
              <div>
                <h3 className="text-lg font-semibold text-[#0A4D68] mb-4">Your Certifications</h3>
                {certificationsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(4).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : userCerts.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(
                      userCerts.reduce((acc: any, userCert: any) => {
                        const agency = userCert.certification.agency;
                        if (!acc[agency]) acc[agency] = [];
                        acc[agency].push(userCert);
                        return acc;
                      }, {})
                    ).map(([agency, certs]: [string, any]) => (
                      <div key={agency}>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-[#088395] border-[#088395]">
                            {agency}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {certs.map((userCert: any) => (
                            <Card key={userCert.id} className="relative">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-[#0A4D68]">
                                      {userCert.certification.name}
                                    </h4>
                                    {userCert.dateObtained && (
                                      <div className="flex items-center text-sm text-[#757575] mt-1">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(userCert.dateObtained).toLocaleDateString()}
                                      </div>
                                    )}
                                    {userCert.certificationNumber && (
                                      <div className="text-sm text-[#757575] mt-1">
                                        Cert #: {userCert.certificationNumber}
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveCertification(userCert.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <Separator className="my-4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#757575]">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No certifications added yet.</p>
                    <p className="text-sm">Add your diving certifications to showcase your qualifications.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}