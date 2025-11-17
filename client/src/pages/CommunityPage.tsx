import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Camera, Star } from "lucide-react";
import { PostsFeed } from "@/components/community/PostsFeed";
import { EventsList } from "@/components/community/EventsList";

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#088395] to-[#05BFDB] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
              Ocean Planet Community
            </h1>
            <p className="text-xl mb-6 text-blue-100">
              Connect with fellow ocean lovers, share discoveries, and join ocean events
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>Growing Community</span>
              </div>
              <div className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                <span>Share Your Experiences</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                <span>Discover Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="posts" data-testid="tab-posts">Posts</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-0">
            <PostsFeed />
          </TabsContent>

          <TabsContent value="events" className="space-y-0">
            <EventsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityPage;
