import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface DiveMapTabProps {
  diveSiteId: number;
}

interface DiveMap {
  id: number;
  diveSiteId: number;
  imageUrl: string;
  title: string;
  description?: string;
  uploadedBy: number;
  uploadedAt: Date;
}

const DiveMapTab: React.FC<DiveMapTabProps> = ({ diveSiteId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: diveMaps, isLoading } = useQuery({
    queryKey: [`/api/dive-sites/${diveSiteId}/dive-maps`],
    queryFn: async () => {
      const response = await fetch(`/api/dive-sites/${diveSiteId}/dive-maps`);
      if (!response.ok) throw new Error('Failed to fetch dive maps');
      return response.json() as Promise<DiveMap[]>;
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('map', file);
      formData.append('title', file.name);
      formData.append('diveSiteId', diveSiteId.toString());

      await apiRequest(`/api/dive-sites/${diveSiteId}/dive-maps`, {
        method: 'POST',
        body: formData,
      });

      // Invalidate and refetch dive maps
      queryClient.invalidateQueries({ queryKey: [`/api/dive-sites/${diveSiteId}/dive-maps`] });

      toast({
        title: "Map uploaded successfully",
        description: "Your dive map has been added to the site",
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your map. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-montserrat font-bold text-[#0A4D68]">Dive Site Maps</h3>
          <p className="text-sm text-[#757575]">Community-contributed dive site maps and route guides</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-[#05BFDB] hover:bg-[#088395] text-white"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.413V13H5.5z" />
                </svg>
                Upload Map
              </>
            )}
          </Button>
        </div>
      </div>

      {!diveMaps || diveMaps.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-[#E0F7FA] rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-[#088395]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <h4 className="text-lg font-montserrat font-semibold text-[#0A4D68] mb-2">No dive maps yet</h4>
          <p className="text-[#757575] mb-4">Be the first to share a dive map for this site!</p>
          <Button 
            onClick={handleUploadClick}
            disabled={isUploading}
            variant="outline"
            className="text-[#088395] border-[#088395] hover:bg-[#E0F7FA]"
          >
            Upload Your Map
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diveMaps.map((map) => (
            <div key={map.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={map.imageUrl} 
                  alt={map.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white/90 hover:bg-white text-[#0A4D68] text-xs"
                    onClick={() => window.open(map.imageUrl, '_blank')}
                  >
                    View Full Size
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-montserrat font-semibold text-[#0A4D68] mb-1">{map.title}</h4>
                {map.description && (
                  <p className="text-sm text-[#757575] mb-2">{map.description}</p>
                )}
                <p className="text-xs text-[#999999]">
                  Uploaded {new Date(map.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiveMapTab;