import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Camera, Fish, Star, Calendar, Award, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSites, fetchUserFavorites, fetchUserSpottedSpecies, fetchSpeciesById } from "@/lib/api";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import PhotoGallery from "@/components/dive-site/PhotoGallery";

// Mock user data - would normally come from authentication system
const currentUser = {
  id: 1,
  username: "diverjane",
  email: "jane@example.com",
  profilePicture: null,
  bio: "PADI Advanced Open Water diver with a passion for marine conservation and underwater photography. Exploring reefs around the world since 2015.",
  divesCompleted: 48,
  speciesSpotted: 127,
  memberSince: "2021-03-15"
};

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch user's favorite dive sites
  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: [`/api/users/${currentUser.id}/favorites`],
    queryFn: () => fetchUserFavorites(currentUser.id),
  });
  
  // Fetch user's spotted species
  const { data: spottedSpecies, isLoading: spottedLoading } = useQuery({
    queryKey: [`/api/users/${currentUser.id}/spotted-species`],
    queryFn: () => fetchUserSpottedSpecies(currentUser.id),
  });
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-[#0A4D68] text-white text-xl">JD</AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-montserrat font-bold text-[#0A4D68]">{currentUser.username}</h2>
                <p className="text-[#757575] text-sm mb-4">{currentUser.email}</p>
                
                <div className="flex space-x-2 mb-4">
                  <Badge className="bg-[#05BFDB]">Advanced Diver</Badge>
                  <Badge variant="outline" className="border-[#088395] text-[#088395]">Contributor</Badge>
                </div>
                
                <Button variant="outline" size="sm" className="mb-6">
                  <Edit className="h-4 w-4 mr-1" /> Edit Profile
                </Button>
                
                <div className="w-full grid grid-cols-3 gap-2 text-center border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-xl font-bold text-[#0A4D68]">{currentUser.divesCompleted}</p>
                    <p className="text-xs text-[#757575]">Dives</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#0A4D68]">{currentUser.speciesSpotted}</p>
                    <p className="text-xs text-[#757575]">Species</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#0A4D68]">
                      {favorites?.length || 0}
                    </p>
                    <p className="text-xs text-[#757575]">Favorites</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-[#0A4D68] mb-2">About</h3>
                <p className="text-sm text-[#757575]">{currentUser.bio}</p>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center text-sm text-[#757575]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Member since {new Date(currentUser.memberSince).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg text-[#0A4D68]">Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-[#05BFDB] mr-2" />
                <div>
                  <p className="font-medium">PADI Advanced Open Water</p>
                  <p className="text-xs text-[#757575]">Completed April 2018</p>
                </div>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-[#05BFDB] mr-2" />
                <div>
                  <p className="font-medium">PADI Nitrox Specialty</p>
                  <p className="text-xs text-[#757575]">Completed May 2019</p>
                </div>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-[#05BFDB] mr-2" />
                <div>
                  <p className="font-medium">PADI Underwater Photography</p>
                  <p className="text-xs text-[#757575]">Completed July 2020</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dives">My Dives</TabsTrigger>
              <TabsTrigger value="species">Species</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link href="/log-dive" className="flex-1">
                  <Button className="w-full bg-[#05BFDB] hover:bg-[#088395] text-white flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    Log New Dive
                  </Button>
                </Link>
                <Link href="/community" className="flex-1">
                  <Button variant="outline" className="w-full border-[#088395] text-[#088395] hover:bg-[#088395] hover:text-white flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Share Experience
                  </Button>
                </Link>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0A4D68]">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E0F7FA]">
                        <MapPin className="h-5 w-5 text-[#05BFDB]" />
                      </div>
                      <div>
                        <p className="font-medium">Logged a new dive at Great Barrier Reef</p>
                        <p className="text-sm text-[#757575]">2 days ago • 65 minutes at 18m depth</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E0F7FA]">
                        <Camera className="h-5 w-5 text-[#05BFDB]" />
                      </div>
                      <div>
                        <p className="font-medium">Uploaded 5 new photos</p>
                        <p className="text-sm text-[#757575]">3 days ago • Great Barrier Reef</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E0F7FA]">
                        <Fish className="h-5 w-5 text-[#05BFDB]" />
                      </div>
                      <div>
                        <p className="font-medium">Spotted Manta Ray for the first time</p>
                        <p className="text-sm text-[#757575]">1 week ago • Great Barrier Reef</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E0F7FA]">
                        <Star className="h-5 w-5 text-[#05BFDB]" />
                      </div>
                      <div>
                        <p className="font-medium">Added Blue Hole to favorite dive sites</p>
                        <p className="text-sm text-[#757575]">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0A4D68]">Favorite Dive Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  {favoritesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array(2).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.slice(0, 2).map((site) => (
                        <Link key={site.id} href={`/dive-site/${site.id}`}>
                          <a className="block">
                            <div className="relative h-40 rounded-lg overflow-hidden">
                              <img 
                                src={site.mainImage} 
                                alt={site.name} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                                <h3 className="text-white font-semibold">{site.name}</h3>
                                <div className="flex items-center text-white/80 text-sm">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{site.location}</span>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#757575]">You haven't added any favorite dive sites yet.</p>
                  )}
                  
                  {favorites && favorites.length > 0 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 text-[#088395]"
                      onClick={() => setActiveTab("dives")}
                    >
                      View All Favorites
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0A4D68]">Recent Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* This would normally fetch the user's photos from the API */}
                  <PhotoGallery photos={[]} thumbnailSize="medium" />
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 text-[#088395]"
                    onClick={() => setActiveTab("photos")}
                  >
                    View All Photos
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="dives" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-[#0A4D68]">My Dive Log</CardTitle>
                  <Button className="bg-[#05BFDB] hover:bg-[#088395] text-white">
                    Log New Dive
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-[#757575] italic text-center py-8">
                    Dive log feature coming soon! Track your dive history, conditions, and encounters.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0A4D68]">Favorite Dive Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  {favoritesLoading ? (
                    <div className="space-y-4">
                      {Array(4).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : favorites && favorites.length > 0 ? (
                    <div className="space-y-3">
                      {favorites.map((site) => (
                        <Link key={site.id} href={`/dive-site/${site.id}`}>
                          <a className="flex bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                            <img 
                              src={site.mainImage} 
                              alt={site.name} 
                              className="w-24 h-20 object-cover"
                            />
                            <div className="p-3 flex-1">
                              <h4 className="font-montserrat font-semibold text-[#0A4D68]">{site.name}</h4>
                              <p className="text-xs text-[#757575] mb-1">{site.location}</p>
                              <div className="flex items-center">
                                <span className="text-xs bg-[#088395] text-white px-1.5 py-0.5 rounded">{site.difficulty}</span>
                                <span className="text-xs text-[#757575] ml-2">{site.minDepth}-{site.maxDepth}m</span>
                              </div>
                            </div>
                            <div className="flex items-center p-3">
                              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#757575] mb-4">You haven't added any favorite dive sites yet.</p>
                      <Link href="/">
                        <Button className="bg-[#05BFDB] hover:bg-[#088395] text-white">
                          Explore Dive Sites
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="species" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-[#0A4D68]">Species I've Spotted</CardTitle>
                  <Button className="bg-[#05BFDB] hover:bg-[#088395] text-white">
                    <Fish className="h-4 w-4 mr-2" /> Log Sighting
                  </Button>
                </CardHeader>
                <CardContent>
                  {spottedLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : spottedSpecies && spottedSpecies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {spottedSpecies.map(({ species, diveSite, dateSpotted }) => (
                        <Card key={species.id} className="overflow-hidden">
                          <img 
                            src={species.imageUrl} 
                            alt={species.commonName} 
                            className="w-full h-40 object-cover"
                          />
                          <CardContent className="p-4">
                            <h3 className="font-montserrat font-semibold text-[#0A4D68]">{species.commonName}</h3>
                            <p className="text-sm italic text-[#757575] mb-2">{species.scientificName}</p>
                            
                            <div className="flex items-center text-xs text-[#757575] mb-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{diveSite.name}</span>
                            </div>
                            
                            <div className="flex items-center text-xs text-[#757575]">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(dateSpotted).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="mt-3">
                              <Link href={`/species/${species.id}`}>
                                <Button variant="outline" size="sm" className="w-full text-[#088395] border-[#088395]">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#757575] mb-4">You haven't logged any species sightings yet.</p>
                      <Link href="/species">
                        <Button className="bg-[#05BFDB] hover:bg-[#088395] text-white">
                          Browse Species
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0A4D68]">Species Wish List</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#757575] italic text-center py-8">
                    Species wish list feature coming soon! Create a list of marine species you hope to encounter on future dives.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="photos" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-[#0A4D68]">My Photo Gallery</CardTitle>
                  <Button className="bg-[#05BFDB] hover:bg-[#088395] text-white">
                    <Camera className="h-4 w-4 mr-2" /> Upload Photos
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-[#757575] italic text-center py-8">
                    You haven't uploaded any photos yet. Share your underwater experiences with the community!
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0A4D68]">Photography Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-[#E0F7FA] p-4 rounded-lg">
                      <p className="text-2xl font-bold text-[#0A4D68]">0</p>
                      <p className="text-sm text-[#757575]">Photos Shared</p>
                    </div>
                    <div className="bg-[#E0F7FA] p-4 rounded-lg">
                      <p className="text-2xl font-bold text-[#0A4D68]">0</p>
                      <p className="text-sm text-[#757575]">Species Tagged</p>
                    </div>
                    <div className="bg-[#E0F7FA] p-4 rounded-lg">
                      <p className="text-2xl font-bold text-[#0A4D68]">0</p>
                      <p className="text-sm text-[#757575]">Dive Sites</p>
                    </div>
                    <div className="bg-[#E0F7FA] p-4 rounded-lg">
                      <p className="text-2xl font-bold text-[#0A4D68]">0</p>
                      <p className="text-sm text-[#757575]">Likes Received</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
