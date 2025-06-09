import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X, CheckCircle, Lightbulb, Award } from 'lucide-react';

interface LessonContent {
  type: 'text' | 'image' | 'funFact' | 'quiz';
  title?: string;
  content: string;
  image?: string;
  caption?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
}

interface LessonData {
  id: string;
  title: string;
  category: string;
  duration: number;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  steps: LessonContent[];
}

interface LessonViewerProps {
  lesson: LessonData;
  onClose: () => void;
  onComplete: (lessonId: string) => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Debug logging
  console.log('LessonViewer - lesson:', lesson);
  console.log('LessonViewer - lesson.steps:', lesson.steps);
  console.log('LessonViewer - currentStep:', currentStep);

  const currentContent = lesson.steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === lesson.steps.length - 1;
  const progress = ((currentStep + 1) / lesson.steps.length) * 100;

  console.log('LessonViewer - currentContent:', currentContent);
  console.log('LessonViewer - isFirstStep:', isFirstStep);
  console.log('LessonViewer - isLastStep:', isLastStep);

  const handleNext = () => {
    if (!isLastStep) {
      setCompletedSteps(prev => new Set(Array.from(prev).concat([currentStep])));
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Lesson completed
      setCompletedSteps(prev => new Set(Array.from(prev).concat([currentStep])));
      onComplete(lesson.id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const renderContent = () => {
    switch (currentContent.type) {
      case 'text':
        return (
          <div className="space-y-4">
            {currentContent.title && (
              <h3 className="text-xl font-bold text-[#0A4D68] mb-4">
                {currentContent.title}
              </h3>
            )}
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {currentContent.content}
              </p>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            {currentContent.title && (
              <h3 className="text-xl font-bold text-[#0A4D68] mb-4">
                {currentContent.title}
              </h3>
            )}
            <div className="rounded-lg overflow-hidden">
              <img 
                src={currentContent.image} 
                alt={currentContent.caption || currentContent.title}
                className="w-full h-64 object-cover"
              />
              {currentContent.caption && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  {currentContent.caption}
                </p>
              )}
            </div>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {currentContent.content}
              </p>
            </div>
          </div>
        );

      case 'funFact':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-l-4 border-[#05BFDB]">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-[#05BFDB] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-[#0A4D68] mb-2 flex items-center gap-2">
                  {currentContent.title || 'Fun Fact!'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentContent.content}
                </p>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#0A4D68]">
              {currentContent.title || 'Quick Quiz'}
            </h3>
            <p className="text-gray-700 text-lg">
              {currentContent.content}
            </p>
            
            <div className="space-y-3">
              {currentContent.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? index === currentContent.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-red-500 bg-red-50 text-red-800'
                      : showExplanation && index === currentContent.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 bg-white hover:border-[#05BFDB] hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {showExplanation && index === currentContent.correctAnswer && (
                      <CheckCircle className="h-5 w-5 ml-auto text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showExplanation && currentContent.explanation && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-blue-800">
                  <strong>Explanation:</strong> {currentContent.explanation}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="w-full h-full bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Badge className="bg-[#05BFDB] text-white text-xs">
                {lesson.category}
              </Badge>
              <h2 className="text-lg md:text-xl font-bold text-[#0A4D68] truncate">
                {lesson.title}
              </h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {lesson.steps.length}
            </span>
            <Progress value={progress} className="w-32 md:w-64 h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderContent()}
        </div>

        {/* Navigation Footer - Fixed at bottom */}
        <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 h-10"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>

            <div className="flex items-center gap-1 md:gap-2">
              {lesson.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep
                      ? 'bg-[#05BFDB]'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentContent.type === 'quiz' && !showExplanation}
              className="bg-gradient-to-r from-[#05BFDB] to-[#088395] hover:from-[#088395] hover:to-[#0A4D68] text-white flex items-center gap-1 md:gap-2 px-3 md:px-4 h-10"
              size="sm"
            >
              {isLastStep ? (
                <>
                  <span className="hidden sm:inline">Complete</span>
                  <span className="sm:hidden">Done</span>
                  <Award className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;