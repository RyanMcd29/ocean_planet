import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDiveSitePhotos } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotoGallery from "./PhotoGallery";
import PhotoUploader from "@/components/upload/PhotoUploader";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera } from "lucide-react";

interface GalleryTabProps {
  diveSiteId: number;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ diveSiteId }) => {
  const [showUploader, setShowUploader] = useState(false);
  const [galleryTab, setGalleryTab] = useState("all");
  
  const { data: photos, isLoading, error } = useQuery({
    queryKey: [`/api/dive-sites/${diveSiteId}/photos`],
    queryFn: () => fetchDiveSitePhotos(diveSiteId),
  });
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-montserrat font-bold text-[#0A4D68]">Photo Gallery</h3>
        
        <Button 
          className={`bg-[${showUploader ? '#757575' : '#EB6440'}] hover:bg-[${showUploader ? '#5A5A5A' : '#FFAB91'}] text-white`}
          onClick={() => setShowUploader(!showUploader)}
        >
          {showUploader ? "Cancel" : (
            <>
              <Camera className="h-4 w-4 mr-2" /> Upload Photos
            </>
          )}
        </Button>
      </div>
      
      {showUploader ? (
        <PhotoUploader diveSiteId={diveSiteId} onComplete={() => setShowUploader(false)} />
      ) : (
        <>
          <Tabs defaultValue="all" value={galleryTab} onValueChange={setGalleryTab} className="w-full mb-4">
            <TabsList className="w-full grid grid-cols-3 bg-[#F5F5F5]">
              <TabsTrigger value="all">All Photos</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array(9).fill(0).map((_, i) => (
                <Skeleton key={i} className="w-full h-40 rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-lg text-center text-red-600">
              Failed to load photos. Please try again later.
            </div>
          ) : photos && photos.length > 0 ? (
            <PhotoGallery photos={photos} thumbnailSize="large" />
          ) : (
            <div className="bg-[#F5F5F5] p-6 rounded-lg text-center">
              <p className="text-[#757575] mb-4">No photos have been uploaded yet for this dive site.</p>
              <Button 
                className="bg-[#05BFDB] hover:bg-[#088395] text-white"
                onClick={() => setShowUploader(true)}
              >
                Be the first to share a photo
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryTab;
