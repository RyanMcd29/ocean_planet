import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, CheckCircle, XCircle } from "lucide-react";
import { Lesson, LessonStep } from "@/data/lessonContent";

interface InteractiveLessonViewerProps {
  lesson: Lesson;
  onClose: () => void;
}

const InteractiveLessonViewer: React.FC<InteractiveLessonViewerProps> = ({
  lesson,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentStepData = lesson.steps[currentStep];
  const isLastStep = currentStep === lesson.steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowFeedback(true);
  };

  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
      <div 
        className="bg-[#05BFDB] h-2 rounded-full transition-all duration-300"
        style={{ width: `${((currentStep + 1) / lesson.steps.length) * 100}%` }}
      />
    </div>
  );

  const renderContentStep = (step: LessonStep) => (
    <div className="space-y-6">
      {step.imageUrl && (
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img 
            src={step.imageUrl} 
            alt={step.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="prose prose-sm max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h2>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {step.content}
        </div>
      </div>
    </div>
  );

  const renderQuizStep = (step: LessonStep) => {
    const { quizData } = step;
    if (!quizData) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h2>
          <p className="text-gray-600 mb-8">{step.content}</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {quizData.question}
          </h3>
          
          <div className="space-y-3">
            {quizData.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.correct;
              
              let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
              
              if (!showFeedback) {
                buttonClass += isSelected 
                  ? "border-[#05BFDB] bg-[#05BFDB]/10" 
                  : "border-gray-200 hover:border-gray-300 bg-white";
              } else {
                if (isCorrect) {
                  buttonClass += "border-green-500 bg-green-50";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "border-red-500 bg-red-50";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50";
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => !showFeedback && handleAnswerSelect(option.id)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{option.text}</span>
                    {showFeedback && (
                      <div className="flex items-center">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && selectedAnswer && (
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <p className="text-gray-700">
                {quizData.options.find(opt => opt.id === selectedAnswer)?.feedback}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {renderProgressBar()}
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {lesson.steps.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStepData.type === 'content' 
            ? renderContentStep(currentStepData)
            : renderQuizStep(currentStepData)
          }
        </div>

        {/* Navigation */}
        <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors min-h-[44px] ${
              isFirstStep 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="flex space-x-2">
            {lesson.steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep ? 'bg-[#05BFDB]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {isLastStep ? (
            <button
              onClick={onClose}
              className="bg-[#05BFDB] hover:bg-[#0A4D68] text-white px-8 py-3 rounded-lg transition-colors min-h-[44px] font-medium"
            >
              Complete
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentStepData.type === 'quiz' && !showFeedback}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors min-h-[44px] font-medium ${
                currentStepData.type === 'quiz' && !showFeedback
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'bg-[#05BFDB] hover:bg-[#0A4D68] text-white'
              }`}
            >
              Next
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveLessonViewer;