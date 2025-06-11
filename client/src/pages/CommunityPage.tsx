import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Camera, MessageCircle, Heart, Share2, MapPin, Calendar, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityPost {
  id: number;
  username: string;
  avatar?: string;
  timestamp: string;
  content: string;
  image?: string;
  diveSite?: string;
  species?: string[];
  likes: number;
  comments: number;
  type: 'photo' | 'sighting' | 'review' | 'event';
}

interface LeaderboardEntry {
  id: number;
  username: string;
  points: number;
  contributions: number;
  rank: number;
  badges: string[];
}

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [newPost, setNewPost] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isPosting, setIsPosting] = useState(false);

  // Handler functions
  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      setSelectedPhotos(prev => [...prev, ...files]);
    };
    input.click();
  };

  const handleLocationSelect = () => {
    // In a real app, this would open a location picker/map modal
    const location = prompt("Enter dive site location:") || "";
    if (location) {
      setSelectedLocation(location);
    }
  };

  const handleSharePost = async () => {
    if (!newPost.trim() && selectedPhotos.length === 0) {
      alert("Please add some content or photos to share");
      return;
    }

    setIsPosting(true);
    try {
      // In a real app, this would make an API call to create the post
      // For now, we'll simulate a successful post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setNewPost("");
      setSelectedPhotos([]);
      setSelectedLocation("");
      
      alert("Post shared successfully!");
    } catch (error) {
      alert("Failed to share post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Mock data - in real app this would come from API
  const communityPosts: CommunityPost[] = [
    {
      id: 1,
      username: "MarineBiologist_Sarah",
      timestamp: "2 hours ago",
      content: "Just spotted a magnificent Green Sea Turtle at the Great Barrier Reef! The coral formations were absolutely stunning today. Water visibility was perfect at 30+ meters.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      diveSite: "Great Barrier Reef",
      species: ["Green Sea Turtle", "Clownfish"],
      likes: 47,
      comments: 12,
      type: 'sighting'
    },
    {
      id: 2,
      username: "DiveExplorer_Mike",
      timestamp: "5 hours ago",
      content: "Amazing dive at Blue Hole today! The visibility was incredible and we saw several reef sharks. Definitely recommend early morning dives here.",
      diveSite: "Blue Hole, Belize",
      likes: 23,
      comments: 8,
      type: 'review'
    },
    {
      id: 3,
      username: "UnderwaterPhotog_Alex",
      timestamp: "1 day ago",
      content: "Captured this beautiful moment with a Manta Ray at Tubbataha Reef. The graceful movement of these gentle giants never fails to amaze me.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      diveSite: "Tubbataha Reef",
      species: ["Manta Ray"],
      likes: 89,
      comments: 24,
      type: 'photo'
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    {
      id: 1,
      username: "MarineBiologist_Sarah",
      points: 2847,
      contributions: 156,
      rank: 1,
      badges: ["Expert Spotter", "Conservation Hero", "Photo Master"]
    },
    {
      id: 2,
      username: "UnderwaterPhotog_Alex",
      points: 2134,
      contributions: 98,
      rank: 2,
      badges: ["Photo Master", "Explorer"]
    },
    {
      id: 3,
      username: "DiveExplorer_Mike",
      points: 1876,
      contributions: 72,
      rank: 3,
      badges: ["Explorer", "Dive Logger"]
    }
  ];

  const PostCard = ({ post }: { post: CommunityPost }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-[#05BFDB] text-white">
                {post.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-[#0A4D68]">{post.username}</p>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              post.type === 'sighting' && "bg-green-100 text-green-800",
              post.type === 'photo' && "bg-blue-100 text-blue-800",
              post.type === 'review' && "bg-purple-100 text-purple-800",
              post.type === 'event' && "bg-orange-100 text-orange-800"
            )}
          >
            {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-700 mb-3">{post.content}</p>
        
        {post.image && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img 
              src={post.image} 
              alt="Community post"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {post.diveSite && (
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {post.diveSite}
            </Badge>
          )}
          {post.species?.map((species, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
              {species}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
              <Heart className="w-4 h-4 mr-1" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#05BFDB]">
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.comments}
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#088395]">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const LeaderboardCard = ({ entry }: { entry: LeaderboardEntry }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
              entry.rank === 1 && "bg-yellow-500",
              entry.rank === 2 && "bg-gray-400",
              entry.rank === 3 && "bg-orange-500",
              entry.rank > 3 && "bg-[#088395]"
            )}>
              {entry.rank}
            </div>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-[#05BFDB] text-white">
                {entry.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-[#0A4D68]">{entry.username}</p>
              <p className="text-sm text-gray-500">{entry.contributions} contributions</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-[#088395]">{entry.points.toLocaleString()}</p>
            <p className="text-xs text-gray-500">points</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {entry.badges.map((badge, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              <Trophy className="w-3 h-3 mr-1" />
              {badge}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

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
              Connect with fellow divers, share discoveries, and contribute to marine science
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>12,847 Active Divers</span>
              </div>
              <div className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                <span>45,623 Photos Shared</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                <span>8,912 Species Spotted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="contribute">Contribute</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-[#0A4D68]">Share Your Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Share your latest dive, species sighting, or underwater photography..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="mb-3"
                    />
                    
                    {/* Selected Photos Preview */}
                    {selectedPhotos.length > 0 && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Selected Photos ({selectedPhotos.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPhotos.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Selected ${index + 1}`}
                                className="w-16 h-16 object-cover rounded border"
                              />
                              <button
                                onClick={() => removePhoto(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Selected Location */}
                    {selectedLocation && (
                      <div className="mb-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-sm text-blue-800">{selectedLocation}</span>
                          </div>
                          <button
                            onClick={() => setSelectedLocation("")}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handlePhotoUpload}
                          disabled={isPosting}
                        >
                          <Camera className="w-4 h-4 mr-1" />
                          Photo
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleLocationSelect}
                          disabled={isPosting}
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          Location
                        </Button>
                      </div>
                      <Button 
                        className="bg-[#088395] hover:bg-[#0A4D68]"
                        onClick={handleSharePost}
                        disabled={isPosting}
                      >
                        {isPosting ? "Sharing..." : "Share Post"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {communityPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A4D68] text-lg">Top Contributors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {leaderboard.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="flex items-center space-x-3 mb-3 last:mb-0">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs",
                          entry.rank === 1 && "bg-yellow-500",
                          entry.rank === 2 && "bg-gray-400",
                          entry.rank === 3 && "bg-orange-500"
                        )}>
                          {entry.rank}
                        </div>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#05BFDB] text-white text-sm">
                            {entry.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-[#0A4D68]">{entry.username}</p>
                          <p className="text-xs text-gray-500">{entry.points.toLocaleString()} points</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A4D68] text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">New species spotted at Coral Triangle</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Underwater cleanup event organized</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-600">New dive site added to database</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <div className="max-w-3xl mx-auto">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-[#0A4D68]">Community Leaderboard</CardTitle>
                  <p className="text-gray-600">Earn points by sharing photos, logging species, and contributing to marine research</p>
                </CardHeader>
              </Card>

              {leaderboard.map((entry) => (
                <LeaderboardCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-[#0A4D68]">Upcoming Events</CardTitle>
                  <p className="text-gray-600">Join community dives, conservation efforts, and educational events</p>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#088395] text-white p-3 rounded-lg">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0A4D68] mb-2">Coral Restoration Dive</h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Join our team in planting coral fragments at the Great Barrier Reef restoration site.
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          June 15, 2024
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          Great Barrier Reef, Australia
                        </div>
                        <Button size="sm" className="bg-[#088395] hover:bg-[#0A4D68]">
                          Join Event
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#EB6440] text-white p-3 rounded-lg">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0A4D68] mb-2">Underwater Photography Workshop</h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Learn advanced techniques for capturing stunning underwater wildlife photography.
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          June 22, 2024
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          Blue Hole, Belize
                        </div>
                        <Button size="sm" className="bg-[#EB6440] hover:bg-[#FFAB91]">
                          Register
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contribute" className="space-y-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-[#0A4D68]">Contribute to Marine Science</CardTitle>
                  <p className="text-gray-600">Your observations help researchers track marine biodiversity and ecosystem health</p>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0A4D68]">Species Sighting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Report marine species you've encountered during your dives</p>
                    <Button className="w-full bg-[#088395] hover:bg-[#0A4D68]">
                      Log Species Sighting
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0A4D68]">Photo Contribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Share your underwater photography to help with species identification</p>
                    <Button className="w-full bg-[#EB6440] hover:bg-[#FFAB91]">
                      Upload Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0A4D68]">Water Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Report current water conditions to help other divers</p>
                    <Button className="w-full bg-[#05BFDB] hover:bg-[#088395]">
                      Report Conditions
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0A4D68]">Dive Site Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Share your experience and rate dive sites for the community</p>
                    <Button className="w-full bg-[#088395] hover:bg-[#0A4D68]">
                      Write Review
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityPage;