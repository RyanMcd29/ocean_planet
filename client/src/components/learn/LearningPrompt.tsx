import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LearningPromptProps {
  title: string;
  description: string;
  imageUrl: string;
  lessonId: number;
  onClose: () => void;
}

export const LearningPrompt: React.FC<LearningPromptProps> = ({
  title,
  description,
  imageUrl,
  lessonId,
  onClose
}) => {
  return (
    <Card className="shadow-lg bg-[#E0F7FA] border-t-4 border-t-[#05BFDB] max-w-md w-full mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
      <CardContent className="p-0">
        <div className="flex">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-1/3 h-auto object-cover"
          />
          <div className="p-3 w-2/3 relative">
            <button 
              onClick={onClose}
              className="absolute right-2 top-2 h-6 w-6 rounded-full bg-white/80 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-semibold text-[#0A4D68] mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <div className="flex justify-end">
              <Button 
                size="sm" 
                className="bg-[#05BFDB] hover:bg-[#088395]"
                asChild
              >
                <a href={`/learn/lesson/${lessonId}`}>
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Context component to manage and show learning prompts
export const LearningPromptProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activePrompt, setActivePrompt] = React.useState<{
    title: string;
    description: string;
    imageUrl: string;
    lessonId: number;
  } | null>(null);

  // This function will be called when a species is logged or a dive site is selected
  const suggestLesson = (species?: string, diveSite?: string) => {
    // Logic to determine if we should show a prompt
    if (species === "manta ray") {
      setActivePrompt({
        title: "Learn about Manta Rays",
        description: "Discover the fascinating world of these gentle giants and their importance in marine ecosystems.",
        imageUrl: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        lessonId: 6 // This would be the ID of a manta ray lesson
      });
    } else if (diveSite === "Great Barrier Reef") {
      setActivePrompt({
        title: "Great Barrier Reef Ecology",
        description: "Learn about one of the world's most diverse marine ecosystems before your dive.",
        imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        lessonId: 1
      });
    }
  };

  // Close the prompt
  const closePrompt = () => {
    setActivePrompt(null);
  };

  // Create context value
  const contextValue = {
    suggestLesson,
    closePrompt
  };

  return (
    <div>
      {children}
      
      {/* Prompt display */}
      {activePrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <LearningPrompt 
            title={activePrompt.title}
            description={activePrompt.description}
            imageUrl={activePrompt.imageUrl}
            lessonId={activePrompt.lessonId}
            onClose={closePrompt}
          />
        </div>
      )}
    </div>
  );
};

// Hook for components to access the learning prompt functionality
export const useLearningPrompt = () => {
  // In a real implementation, this would use React context
  // For simplicity in this demo, we're just returning mock functions
  
  const suggestLesson = (species?: string, diveSite?: string) => {
    // This would trigger the prompt via context in a real implementation
    console.log("Suggesting lesson for:", species || diveSite);
    
    // For demonstration, let's just create a prompt directly
    if (species || diveSite) {
      const prompt = document.createElement('div');
      prompt.className = 'fixed bottom-4 right-4 z-50 max-w-md';
      document.body.appendChild(prompt);
      
      // In a real app, we would render a React component here
      // For now, show a simple message to demonstrate the concept
      const content = document.createElement('div');
      content.className = 'bg-[#E0F7FA] p-4 rounded-lg border-t-4 border-t-[#05BFDB] shadow-lg';
      content.innerHTML = `
        <h3 class="font-semibold text-[#0A4D68] mb-1">Learn about ${species || diveSite}</h3>
        <p class="text-sm text-gray-600 mb-3">Discover more about ${species || diveSite} in our learning center.</p>
        <div class="flex justify-end">
          <a href="/learn" class="px-3 py-1 bg-[#05BFDB] text-white rounded-md text-sm hover:bg-[#088395]">
            Learn More
          </a>
        </div>
      `;
      
      prompt.appendChild(content);
      
      // Remove after 5 seconds
      setTimeout(() => {
        document.body.removeChild(prompt);
      }, 5000);
    }
  };
  
  return { suggestLesson };
};