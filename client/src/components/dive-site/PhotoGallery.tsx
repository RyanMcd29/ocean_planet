import React, { useState } from "react";
import { Photo } from "@shared/schema";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PhotoGalleryProps {
  photos: Photo[];
  thumbnailSize?: "small" | "medium" | "large";
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ 
  photos, 
  thumbnailSize = "medium" 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  const getThumbnailClass = () => {
    switch (thumbnailSize) {
      case "small":
        return "grid grid-cols-3 gap-2 h-20";
      case "large":
        return "grid grid-cols-2 gap-3 h-40 sm:grid-cols-3";
      case "medium":
      default:
        return "grid grid-cols-3 gap-2 h-32";
    }
  };
  
  if (!photos || photos.length === 0) {
    return (
      <div className="bg-[#F5F5F5] p-6 rounded-lg text-center">
        <p className="text-[#757575]">No photos have been uploaded yet.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className={getThumbnailClass()}>
        {photos.map((photo) => (
          <img 
            key={photo.id}
            src={photo.imageUrl} 
            alt={photo.caption || "Dive site photo"} 
            className="w-full h-full object-cover rounded-lg shadow-sm hover:opacity-90 transition cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>
      
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="relative">
            <img 
              src={selectedPhoto?.imageUrl} 
              alt={selectedPhoto?.caption || "Dive site photo"}
              className="w-full max-h-[80vh] object-contain"
            />
            
            <DialogClose className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/80">
              <X className="h-6 w-6" />
            </DialogClose>
          </div>
          
          {selectedPhoto?.caption && (
            <div className="p-4 bg-white">
              <DialogTitle className="text-lg font-montserrat mb-2">
                Photo Details
              </DialogTitle>
              <p className="text-[#757575]">{selectedPhoto.caption}</p>
              
              {selectedPhoto.speciesTags && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold mb-1">Tagged Species:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedPhoto.speciesTags) && selectedPhoto.speciesTags.map((speciesId: number) => (
                      <Button 
                        key={speciesId} 
                        variant="outline" 
                        size="sm"
                        className="bg-[#E0F7FA] text-[#0A4D68] border-[#05BFDB] text-xs"
                      >
                        Species #{speciesId}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-3 text-xs text-[#757575]">
                Uploaded on {new Date(selectedPhoto.dateUploaded).toLocaleDateString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGallery;
