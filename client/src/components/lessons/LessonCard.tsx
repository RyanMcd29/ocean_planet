import React from "react";
import { Clock, Play } from "lucide-react";

interface LessonCardProps {
  title: string;
  subtitle: string;
  duration: string;
  imageUrl: string;
  onStart: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  title,
  subtitle,
  duration,
  imageUrl,
  onStart
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Clock size={16} />
            <span>{duration}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{subtitle}</p>
        
        <button
          onClick={onStart}
          className="w-full bg-[#05BFDB] hover:bg-[#0A4D68] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Play size={18} />
          Start Lesson
        </button>
      </div>
    </div>
  );
};

export default LessonCard;