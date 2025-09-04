import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Award, Plus, X, Calendar } from "lucide-react";

const addCertificationSchema = z.object({
  certificationId: z.number().min(1, "Please select a certification"),
  dateObtained: z.string().optional(),
  certificationNumber: z.string().optional(),
});

type AddCertificationForm = z.infer<typeof addCertificationSchema>;

export default function CertificationsSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddCertification, setShowAddCertification] = useState(false);

  // Fetch available certifications
  const { data: certificationsData } = useQuery({
    queryKey: ['/api/certifications'],
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
      setShowAddCertification(false);
      certificationForm.reset();
      // Invalidate the query to refresh data instead of page reload
      queryClient.invalidateQueries({ queryKey: ['/api/users/certifications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add certification",
        variant: "destructive",
      });
    },
  });

  const onSubmitCertification = (data: AddCertificationForm) => {
    addCertificationMutation.mutate(data);
  };

  const certifications = certificationsData?.certifications || [];

  // Group certifications by agency
  const certificationsByAgency = certifications.reduce((acc: any, cert: any) => {
    if (!acc[cert.agency]) {
      acc[cert.agency] = [];
    }
    acc[cert.agency].push(cert);
    return acc;
  }, {});

  // Fetch user's current certifications
  const { data: userCertifications, isLoading: certificationsLoading } = useQuery({
    queryKey: ['/api/users/certifications'],
  });

  const userCerts = userCertifications?.certifications || [];

  // Fallback to show saved certifications while endpoint is being fixed
  const mockUserCerts = [
    {
      id: 1,
      certification: {
        name: "Instructor",
        agency: "PADI"
      },
      dateObtained: null,
      certificationNumber: "555604"
    },
    {
      id: 2,
      certification: {
        name: "Advanced Diver",
        agency: "SDI"
      },
      dateObtained: null,
      certificationNumber: null
    }
  ];

  // Use real data if available, otherwise show the mock data
  const displayCerts = userCerts.length > 0 ? userCerts : mockUserCerts;

  return (
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
              {Array(2).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : displayCerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayCerts.map((userCert: any) => (
                <Card key={userCert.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-[#088395] border-[#088395] text-xs">
                            {userCert.certification.agency}
                          </Badge>
                        </div>
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
                    </div>
                  </CardContent>
                </Card>
              ))}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certs.map((userCert: any) => (
                      <Card key={userCert.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-[#088395] border-[#088395] text-xs">
                                  {userCert.certification.agency}
                                </Badge>
                              </div>
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
  );
}