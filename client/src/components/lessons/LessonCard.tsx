import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    category: string;
    duration: number; // in minutes
    thumbnail: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  };
  onStartLesson: (lessonId: string) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onStartLesson }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white border border-gray-200">
      <div className="relative">
        <img 
          src={lesson.thumbnail} 
          alt={lesson.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-[#05BFDB] text-white px-3 py-1 text-xs font-medium">
            {lesson.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Clock className="h-3 w-3 text-[#088395]" />
          <span className="text-xs font-medium text-[#0A4D68]">{lesson.duration} min</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs border-[#088395] text-[#088395]">
            {lesson.difficulty}
          </Badge>
        </div>
        
        <h3 className="font-bold text-lg text-[#0A4D68] mb-2 line-clamp-2">
          {lesson.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {lesson.description}
        </p>
        
        <Button 
          onClick={() => onStartLesson(lesson.id)}
          className="w-full bg-gradient-to-r from-[#05BFDB] to-[#088395] hover:from-[#088395] hover:to-[#0A4D68] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          Start Lesson
        </Button>
      </CardContent>
    </Card>
  );
};

export default LessonCard;