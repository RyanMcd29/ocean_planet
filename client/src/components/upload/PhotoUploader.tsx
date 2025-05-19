import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { fetchSpecies } from '@/lib/api';
import { Species } from '@shared/schema';

interface PhotoUploaderProps {
  diveSiteId: number;
  onComplete: () => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ diveSiteId, onComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [speciesTags, setSpeciesTags] = useState<Record<number, number[]>>({});
  const [uploading, setUploading] = useState(false);
  
  const { data: species } = useQuery({
    queryKey: ['/api/species'],
    queryFn: () => fetchSpecies(),
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Create previews
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    
    setFiles(prev => [...prev, ...acceptedFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    setCaptions(prev => [...prev, ...Array(acceptedFiles.length).fill('')]);
    
    // Initialize species tags for new files
    const newSpeciesTags = { ...speciesTags };
    acceptedFiles.forEach((_, index) => {
      const fileIndex = previews.length + index;
      newSpeciesTags[fileIndex] = [];
    });
    setSpeciesTags(newSpeciesTags);
  }, [previews.length, speciesTags]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 10485760, // 10MB
  });
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    setCaptions(captions.filter((_, i) => i !== index));
    
    // Remove species tags for this file
    const newSpeciesTags = { ...speciesTags };
    delete newSpeciesTags[index];
    
    // Renumber keys after deletion
    const updatedSpeciesTags: Record<number, number[]> = {};
    Object.keys(newSpeciesTags).forEach((key, i) => {
      const numKey = parseInt(key);
      if (numKey > index) {
        updatedSpeciesTags[i] = newSpeciesTags[numKey];
      } else {
        updatedSpeciesTags[i] = newSpeciesTags[numKey];
      }
    });
    
    setSpeciesTags(updatedSpeciesTags);
  };
  
  const handleCaptionChange = (index: number, value: string) => {
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };
  
  const handleSpeciesTagChange = (fileIndex: number, speciesId: number) => {
    const currentTags = speciesTags[fileIndex] || [];
    
    // Toggle the species tag
    const newTags = currentTags.includes(speciesId)
      ? currentTags.filter(id => id !== speciesId)
      : [...currentTags, speciesId];
    
    setSpeciesTags({
      ...speciesTags,
      [fileIndex]: newTags
    });
  };
  
  const handleSubmit = async () => {
    setUploading(true);
    
    try {
      // In a real implementation, you would:
      // 1. Upload each image to storage/server
      // 2. Create database entries with the URLs and metadata
      
      // Mock implementation for demo purposes
      for (let i = 0; i < files.length; i++) {
        // Prepare the data that would be sent to the server
        const photoData = {
          userId: 1, // This would normally come from authentication
          diveSiteId,
          imageUrl: previews[i], // In a real app, this would be a server-generated URL
          caption: captions[i],
          speciesTags: speciesTags[i] || []
        };
        
        console.log('Uploading photo:', photoData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Clean up previews to avoid memory leaks
      previews.forEach(preview => URL.revokeObjectURL(preview));
      
      // Call completion handler
      onComplete();
    } catch (error) {
      console.error('Error uploading photos:', error);
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {files.length === 0 ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-[#05BFDB] bg-[#E0F7FA]' : 'border-gray-300 hover:border-[#05BFDB]'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-[#088395] mb-3" />
            {isDragActive ? (
              <p className="text-[#0A4D68] font-medium">Drop the files here ...</p>
            ) : (
              <>
                <p className="text-[#0A4D68] font-medium mb-1">Drag & drop photos here, or click to select files</p>
                <p className="text-[#757575] text-sm">Upload your best underwater photos (max 10MB each)</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-3 space-y-3">
                  <div>
                    <Label htmlFor={`caption-${index}`} className="text-sm font-medium">Caption</Label>
                    <Textarea
                      id={`caption-${index}`}
                      value={captions[index]}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      placeholder="Describe what's in this photo..."
                      className="resize-none h-20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`species-${index}`} className="text-sm font-medium">Tag Species</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select species in this photo" />
                      </SelectTrigger>
                      <SelectContent>
                        {species?.map((s: Species) => (
                          <SelectItem 
                            key={s.id} 
                            value={s.id.toString()}
                            onClick={() => handleSpeciesTagChange(index, s.id)}
                          >
                            {s.commonName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {speciesTags[index] && speciesTags[index].length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {speciesTags[index].map(tagId => {
                          const taggedSpecies = species?.find((s: Species) => s.id === tagId);
                          return taggedSpecies ? (
                            <span 
                              key={tagId}
                              className="bg-[#E0F7FA] text-[#0A4D68] text-xs px-2 py-1 rounded-full flex items-center"
                            >
                              {taggedSpecies.commonName}
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-4 w-4 ml-1 p-0" 
                                onClick={() => handleSpeciesTagChange(index, tagId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add more photos button */}
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg flex items-center justify-center h-40 cursor-pointer transition-colors hover:border-[#05BFDB] hover:bg-[#E0F7FA]/30"
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <Camera className="h-8 w-8 text-[#088395] mb-2" />
                <p className="text-[#088395] font-medium">Add more photos</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                previews.forEach(preview => URL.revokeObjectURL(preview));
                setFiles([]);
                setPreviews([]);
                setCaptions([]);
                setSpeciesTags({});
              }}
            >
              Clear All
            </Button>
            
            <Button 
              className="bg-[#EB6440] hover:bg-[#FFAB91] text-white"
              disabled={uploading}
              onClick={handleSubmit}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload {files.length} Photo{files.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoUploader;
