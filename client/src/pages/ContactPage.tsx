import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactForm) => {
    // Here you would normally send the data to your backend
    console.log("Contact form submission:", data);
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FA] to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-[#0A4D68] mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-[#757575] max-w-2xl mx-auto">
            Have questions about Ocean Planet? Want to share your diving experiences or report a site? 
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#0A4D68] flex items-center gap-2">
                <Send className="h-6 w-6" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <FormControl>
                          <Input placeholder="What is this about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your question, feedback, or dive site suggestion..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-[#05BFDB] hover:bg-[#088395] text-white"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#0A4D68]">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#E0F7FA] p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#05BFDB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A4D68] mb-1">Email</h3>
                    <p className="text-[#757575]">contact@oceanplanet.app</p>
                    <p className="text-[#757575]">support@oceanplanet.app</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E0F7FA] p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#05BFDB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A4D68] mb-1">Phone</h3>
                    <p className="text-[#757575]">+1 (555) 123-DIVE</p>
                    <p className="text-[#757575]">+1 (555) 123-3483</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E0F7FA] p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#05BFDB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A4D68] mb-1">Address</h3>
                    <p className="text-[#757575]">
                      Ocean Planet Headquarters<br />
                      123 Coral Reef Drive<br />
                      Marina Bay, CA 94123<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#E0F7FA] p-3 rounded-full">
                    <Clock className="h-6 w-6 text-[#05BFDB]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A4D68] mb-1">Office Hours</h3>
                    <p className="text-[#757575]">
                      Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                      Saturday: 10:00 AM - 4:00 PM PST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#0A4D68]">Quick Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#757575]">General Inquiries:</span>
                    <span className="text-[#0A4D68] font-medium">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Technical Support:</span>
                    <span className="text-[#0A4D68] font-medium">12 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Partnership Requests:</span>
                    <span className="text-[#0A4D68] font-medium">3-5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757575]">Media Inquiries:</span>
                    <span className="text-[#0A4D68] font-medium">48 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}