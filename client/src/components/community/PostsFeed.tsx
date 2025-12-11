import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, MapPin, Send, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Image as StoredImage, Species } from "@shared/schema";

interface Post {
  id: number;
  userId: number;
  content: string;
  photoUrl?: string;
  primaryImageId?: number | null;
  images?: StoredImage[];
  linkedSpecies?: Species[];
  tags?: string[];
  location?: string;
  diveSiteId?: number;
  speciesSpotted?: string[];
  linkedLessonId?: string;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    lastname: string;
    username: string;
  };
  likeCount: number;
  commentCount: number;
  linkedLesson?: {
    id: string;
    title: string;
    category: string;
  };
}

interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
  user: {
    name: string;
    lastname: string;
  };
}

interface UploadedImage {
  id: number;
  url: string;
  alt?: string | null;
}

const POST_TAGS = ["Dive report", "Question", "Ocean fact", "Gear chat", "Beach cleanup", "Conservation"];

export function PostsFeed() {
  const [newPost, setNewPost] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [location, setLocation] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("all");
  const [expandedComments, setExpandedComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<Species[]>([]);
  const [speciesSearch, setSpeciesSearch] = useState("");
  const { toast } = useToast();

  // Fetch posts
  const { data: posts = [], isLoading, error } = useQuery<Post[]>({
    queryKey: ['/api/posts', { 
      sort: sortBy, 
      tag: filterTag === 'all' ? '' : filterTag,
      location: locationFilter
    }],
    select: (data: any) => data?.posts || [],
  });

  const { data: speciesOptions = [] } = useQuery<Species[]>({
    queryKey: ['/api/species'],
    select: (data: any) => data as Species[],
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; tags?: string[]; imageIds?: number[]; speciesIds?: number[]; photoUrl?: string; location?: string }) => {
      return await apiRequest('/api/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setNewPost("");
      setSelectedTag("");
      setPhotoPreview("");
      setUploadedImage(null);
      setSelectedSpecies([]);
      setSpeciesSearch("");
      setLocation("");
      toast({ title: "Post shared!", description: "Your post has been shared with the community." });
    },
    onError: (error: any) => {
      toast({
        title: "Could not share post",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Like/unlike post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return await apiRequest(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });

  // Fetch comments for a post
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: [`/api/posts/${expandedComments}/comments`],
    enabled: expandedComments !== null,
    select: (data: any) => data?.comments || [],
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      return await apiRequest(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${expandedComments}/comments`] });
      setCommentText("");
    },
  });

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "Photo must be less than 10MB", variant: "destructive" });
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to upload image");
      }

      const data = await res.json();
      const image: UploadedImage = data.image;
      setUploadedImage(image);
      setPhotoPreview(image.url);
      toast({ title: "Image uploaded", description: "Photo attached to your post." });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setUploadedImage(null);
  };

  const handleSharePost = () => {
    if (!newPost.trim()) {
      toast({ title: "Error", description: "Please write something to share.", variant: "destructive" });
      return;
    }

    const tags = selectedTag ? [selectedTag] : [];
    const imageIds = uploadedImage ? [uploadedImage.id] : [];
    const speciesIds = selectedSpecies.map((sp) => sp.id);
    const photoUrl = uploadedImage ? undefined : (photoPreview || undefined);
    const postLocation = location.trim() || undefined;
    
    if (isUploadingImage) {
      toast({ title: "Uploading image", description: "Please wait for the upload to finish.", variant: "destructive" });
      return;
    }

    createPostMutation.mutate({ content: newPost, tags, imageIds, speciesIds, photoUrl, location: postLocation });
  };

  const handleAddSpecies = (species: Species) => {
    if (selectedSpecies.find((sp) => sp.id === species.id)) return;
    setSelectedSpecies((prev) => [...prev, species]);
  };

  const handleRemoveSpecies = (id: number) => {
    setSelectedSpecies((prev) => prev.filter((sp) => sp.id !== id));
  };

  const filteredSpecies = speciesOptions
    .filter((sp) => {
      if (!speciesSearch) return true;
      const term = speciesSearch.toLowerCase();
      return (
        sp.commonName.toLowerCase().includes(term) ||
        sp.scientificName.toLowerCase().includes(term)
      );
    })
    .slice(0, 6);

  const handleToggleComments = (postId: number) => {
    setExpandedComments(expandedComments === postId ? null : postId);
    setCommentText("");
  };

  const handleAddComment = (postId: number) => {
    if (!commentText.trim()) return;
    createCommentMutation.mutate({ postId, content: commentText });
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading posts...</div>;
  }

  return (
    <div className="space-y-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          {/* New Post Card */}
          <Card className="mb-6" data-testid="card-new-post">
            <CardHeader>
              <CardTitle className="text-[#0A4D68]">+ New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Share your latest dive, species sighting, or ocean story..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-3"
                data-testid="input-new-post-content"
              />
              
              {/* Photo Preview */}
              {photoPreview && (
                <div className="relative mb-3">
                  <img src={photoPreview} alt="Preview" className="w-full max-h-64 object-cover rounded-lg" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemovePhoto}
                    data-testid="button-remove-photo"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Location Input */}
              <div className="mb-3">
                <Input
                  placeholder="Add location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  data-testid="input-post-location"
                />
              </div>

              {/* Species Linking */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-[#0A4D68] mb-1">Link species (optional)</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedSpecies.length === 0 && (
                    <span className="text-xs text-gray-500">No species linked yet.</span>
                  )}
                  {selectedSpecies.map((sp) => (
                    <Badge key={sp.id} variant="outline" className="flex items-center gap-1">
                      {sp.commonName}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecies(sp.id)}
                        aria-label={`Remove ${sp.commonName}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Search species to tag"
                  value={speciesSearch}
                  onChange={(e) => setSpeciesSearch(e.target.value)}
                />
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {filteredSpecies.map((sp) => (
                    <Button
                      key={sp.id}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => handleAddSpecies(sp)}
                    >
                      {sp.commonName}
                    </Button>
                  ))}
                  {filteredSpecies.length === 0 && (
                    <p className="text-xs text-gray-500 col-span-2">No matches yet. Try another name.</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex gap-2">
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="w-48" data-testid="select-post-tag">
                      <SelectValue placeholder="Add tag (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {POST_TAGS.map((tag) => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <label htmlFor="photo-upload">
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoSelect}
                      data-testid="input-photo-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      disabled={isUploadingImage}
                      data-testid="button-add-photo"
                    >
                      {isUploadingImage ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ImageIcon className="w-4 h-4 mr-2" />
                      )}
                      {isUploadingImage ? "Uploading..." : "Photo"}
                    </Button>
                  </label>
                </div>

                <Button 
                  className="bg-[#088395] hover:bg-[#0A4D68]"
                  onClick={handleSharePost}
                  disabled={createPostMutation.isPending || isUploadingImage}
                  data-testid="button-share-post"
                >
                  {createPostMutation.isPending ? "Sharing..." : "Share Post"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40" data-testid="select-sort-posts">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Liked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-48" data-testid="select-filter-tag">
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {POST_TAGS.map((tag) => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Search by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-64"
              data-testid="input-location-filter"
            />
          </div>

          {/* Posts List */}
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <p>No posts yet. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => {
              const displayImage = post.photoUrl || post.images?.[0]?.url;
              const speciesBadges =
                post.linkedSpecies && post.linkedSpecies.length > 0
                  ? post.linkedSpecies.map((sp) => ({ id: sp.id, label: sp.commonName }))
                  : (post.speciesSpotted || []).map((name, idx) => ({ id: idx, label: name }));

              return (
                <Card key={post.id} className="mb-4 hover:shadow-md transition-shadow" data-testid={`card-post-${post.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-[#05BFDB] text-white">
                            {post.user.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-[#0A4D68]">
                            {post.user.name} {post.user.lastname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {post.tags[0]}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.content}</p>

                    {speciesBadges.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {speciesBadges.map((badge) => (
                          <Badge key={badge.id} variant="outline" className="text-xs">
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {displayImage && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img 
                          src={displayImage} 
                          alt="Post image"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                    
                    {post.location && (
                      <Badge variant="outline" className="text-xs mb-3">
                        <MapPin className="w-3 h-3 mr-1" />
                        {post.location}
                      </Badge>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-red-500"
                          onClick={() => likePostMutation.mutate(post.id)}
                          data-testid={`button-like-${post.id}`}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likeCount}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-[#05BFDB]"
                          onClick={() => handleToggleComments(post.id)}
                          data-testid={`button-comments-${post.id}`}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.commentCount}
                        </Button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {expandedComments === post.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="space-y-3 mb-3" data-testid={`comments-list-${post.id}`}>
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-[#05BFDB] text-white text-xs">
                                  {comment.user.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                <p className="text-sm font-semibold text-[#0A4D68]">
                                  {comment.user.name} {comment.user.lastname}
                                </p>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="min-h-[60px]"
                            data-testid={`input-comment-${post.id}`}
                          />
                          <Button
                            size="sm"
                            className="bg-[#088395] hover:bg-[#0A4D68]"
                            onClick={() => handleAddComment(post.id)}
                            disabled={createCommentMutation.isPending}
                            data-testid={`button-send-comment-${post.id}`}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0A4D68] text-lg">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Share respectful, ocean-friendly content</p>
                <p>• Help identify species accurately</p>
                <p>• Report dive conditions honestly</p>
                <p>• Support conservation efforts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#0A4D68] text-lg">Quick Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {POST_TAGS.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => setFilterTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
