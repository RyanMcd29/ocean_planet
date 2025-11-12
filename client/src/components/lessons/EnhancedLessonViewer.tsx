import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, CheckCircle, XCircle, Lightbulb, Fish, Waves, Heart, Zap, Star, BookOpen, ExternalLink, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface SourceItem {
  title: string;
  url: string;
}

interface FinalQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LessonStep {
  type: 'intro' | 'text' | 'image' | 'funFact' | 'quiz' | 'finalQuiz' | 'conclusion' | 'sources';
  title: string;
  content: string;
  image?: string;
  caption?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  highlight?: string;
  icon?: string;
  sources?: SourceItem[];
  questions?: FinalQuizQuestion[];
}

interface EnhancedLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: LessonStep[];
}

interface EnhancedLessonViewerProps {
  lesson: EnhancedLesson;
  onClose: () => void;
}

const EnhancedLessonViewer: React.FC<EnhancedLessonViewerProps> = ({
  lesson,
  onClose
}) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showAnimation, setShowAnimation] = useState(false);
  const [finalQuizAnswers, setFinalQuizAnswers] = useState<Map<number, number>>(new Map());
  const [finalQuizFeedback, setFinalQuizFeedback] = useState<Set<number>>(new Set());
  const [scoredFinalQuizQuestions, setScoredFinalQuizQuestions] = useState<Set<number>>(new Set());

  // Mutation to mark lesson as complete
  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/progress/${lesson.id}`, {
        method: 'POST',
      });
      return await response.json() as {
        progress: any;
        badge?: {
          badgeName: string;
          badgeIcon: string;
        };
      };
    },
    onSuccess: (data) => {
      // Invalidate progress and badges queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/badges'] });
      
      // Show success message
      if (data?.badge) {
        toast({
          title: "🎉 Badge Unlocked!",
          description: `You've earned the ${data.badge.badgeName} ${data.badge.badgeIcon} badge!`,
        });
      } else {
        toast({
          title: "✅ Lesson Complete!",
          description: "Great work! Keep exploring to unlock badges.",
        });
      }
      
      // Close the lesson viewer
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCompleteLesson = () => {
    completeLessonMutation.mutate();
  };

  // Mutation to share lesson to community
  const shareLessonMutation = useMutation({
    mutationFn: async () => {
      const postContent = `Just completed "${lesson.title}"! 🎓 #OceanLearning`;
      return await apiRequest('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: postContent,
          tags: ['Ocean fact'],
          linkedLessonId: lesson.id
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Shared!",
        description: "Your lesson has been shared to the Community.",
      });
      // Navigate to community page
      setLocation('/community');
    },
  });

  const handleShareLesson = () => {
    shareLessonMutation.mutate();
  };

  const currentStepData = lesson.steps[currentStep];
  const isLastStep = currentStep === lesson.steps.length - 1;
  const isFirstStep = currentStep === 0;
  const progressPercentage = ((currentStep + 1) / lesson.steps.length) * 100;

  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (!isLastStep) {
      // For quiz steps, record the score
      if (currentStepData.type === 'quiz' && selectedAnswer !== null && showFeedback) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps(prev => [...prev, currentStep]);
          const isCorrect = selectedAnswer === currentStepData.correctAnswer;
          setScore(prev => ({ 
            correct: prev.correct + (isCorrect ? 1 : 0), 
            total: prev.total + 1 
          }));
        }
      }
      
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      
      // Scroll to top of content
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      
      // Scroll to top of content
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
  };

  const handleFinalQuizAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = new Map(finalQuizAnswers);
    newAnswers.set(questionIndex, answerIndex);
    setFinalQuizAnswers(newAnswers);
    
    const newFeedback = new Set(finalQuizFeedback);
    newFeedback.add(questionIndex);
    setFinalQuizFeedback(newFeedback);
    
    // Track score for this final quiz question (only once)
    if (!scoredFinalQuizQuestions.has(questionIndex) && currentStepData.questions) {
      const question = currentStepData.questions[questionIndex];
      const isCorrect = answerIndex === question.correctAnswer;
      setScore(prev => ({ 
        correct: prev.correct + (isCorrect ? 1 : 0), 
        total: prev.total + 1 
      }));
      setScoredFinalQuizQuestions(prev => new Set(prev).add(questionIndex));
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    
    const parts = text.split(/(\*\*.*?\*\*|\n)/g);
    
    return parts.map((part, index) => {
      if (part === '\n') {
        return <br key={index} />;
      }
      
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-semibold">{boldText}</strong>;
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  const getStepIcon = (type: string, index: number) => {
    const icons = {
      intro: <Star className="w-5 h-5" />,
      text: <Fish className="w-5 h-5" />,
      image: <Waves className="w-5 h-5" />,
      funFact: <Lightbulb className="w-5 h-5" />,
      quiz: <Zap className="w-5 h-5" />,
      finalQuiz: <Zap className="w-5 h-5" />,
      conclusion: <Heart className="w-5 h-5" />,
      sources: <BookOpen className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons] || <Fish className="w-5 h-5" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case 'intro':
        return (
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-[#088395] to-[#05BFDB] rounded-full flex items-center justify-center text-white text-xl sm:text-2xl">
              🌊
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A4D68] mb-3 sm:mb-4 px-2">
                {currentStepData.title}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
                {renderMarkdown(currentStepData.content)}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
              <Badge className={getDifficultyColor(lesson.difficulty)}>
                {lesson.difficulty}
              </Badge>
              <Badge variant="outline" className="border-[#088395] text-[#088395]">
                {lesson.duration} min read
              </Badge>
              <Badge variant="outline" className="border-[#05BFDB] text-[#05BFDB]">
                {lesson.category}
              </Badge>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0A4D68] text-center px-2">
              {currentStepData.title}
            </h2>
            <div className="rounded-xl overflow-hidden shadow-lg w-full">
              <img 
                src={currentStepData.image} 
                alt={currentStepData.title}
                className="w-full h-48 sm:h-64 md:h-80 object-cover"
              />
              {currentStepData.caption && (
                <div className="bg-gray-50 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-600 text-center italic">
                    {currentStepData.caption}
                  </p>
                </div>
              )}
            </div>
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {renderMarkdown(currentStepData.content)}
              </p>
            </div>
          </div>
        );

      case 'funFact':
        return (
          <Card className="border-l-4 border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2 flex items-center gap-2">
                    💡 {currentStepData.title}
                  </h3>
                  <p className="text-orange-700 leading-relaxed">
                    {renderMarkdown(currentStepData.content)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'quiz':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0A4D68] mb-2 px-2">
                {currentStepData.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">Test your knowledge!</p>
            </div>

            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-4 sm:p-6">
                <p className="text-base sm:text-lg font-medium text-purple-900 mb-4 sm:mb-6 text-center">
                  {currentStepData.content}
                </p>
                
                <div className="space-y-3">
                  {currentStepData.options?.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentStepData.correctAnswer;
                    const isIncorrect = showFeedback && isSelected && !isCorrect;
                    const shouldShowCorrect = showFeedback && isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showFeedback}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3",
                          "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300",
                          !showFeedback && "hover:border-purple-300 hover:bg-purple-50",
                          isSelected && !showFeedback && "border-purple-400 bg-purple-100",
                          !isSelected && !showFeedback && "border-gray-200 bg-white",
                          shouldShowCorrect && "border-green-400 bg-green-50",
                          isIncorrect && "border-red-400 bg-red-50",
                          showFeedback && "cursor-default"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0",
                          !showFeedback && isSelected && "border-purple-400 bg-purple-400 text-white",
                          !showFeedback && !isSelected && "border-gray-300 text-gray-500",
                          shouldShowCorrect && "border-green-500 bg-green-500 text-white",
                          isIncorrect && "border-red-500 bg-red-500 text-white"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showFeedback && (
                          <div className="flex-shrink-0">
                            {shouldShowCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {isIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {showFeedback && currentStepData.explanation && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-blue-800 font-medium mb-2">Explanation:</p>
                    <p className="text-blue-700">{renderMarkdown(currentStepData.explanation)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'conclusion':
        return (
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl">
              🎉
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A4D68] mb-4 sm:mb-6 px-2">
                {currentStepData.title}
              </h2>
              
              {score.total > 0 && (
                <Card className="max-w-md mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Your Quiz Score</h3>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {score.correct}/{score.total}
                    </div>
                    <p className="text-green-700 text-sm">
                      {score.correct === score.total 
                        ? "Perfect! You're an ocean expert!" 
                        : score.correct >= score.total * 0.7
                        ? "Great job! You really know your stuff!"
                        : "Good effort! Keep learning about our oceans!"}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              <div className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto text-left">
                {/* Parse and format the content */}
                {currentStepData.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return null;
                  
                  // Handle "What You Can Do" header
                  if (paragraph.includes('What You Can Do')) {
                    return (
                      <h3 key={index} className="text-xl font-bold text-[#0A4D68] mt-6 mb-4">
                        What You Can Do
                      </h3>
                    );
                  }
                  
                  // Handle bullet points with bold formatting
                  if (paragraph.includes('•') || paragraph.includes('**')) {
                    const bulletPoints = paragraph.split('•').filter(point => point.trim());
                    return (
                      <div key={index} className="space-y-3 mt-4">
                        {bulletPoints.map((point, bulletIndex) => {
                          const parts = point.split('**');
                          return (
                            <div key={bulletIndex} className="flex items-start gap-2">
                              <span className="text-[#05BFDB] mt-1">•</span>
                              <div>
                                {parts.map((part, partIndex) => 
                                  partIndex % 2 === 1 ? (
                                    <strong key={partIndex} className="font-bold text-[#0A4D68]">
                                      {part}
                                    </strong>
                                  ) : (
                                    <span key={partIndex}>{part}</span>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  
                  // Handle regular paragraphs
                  const parts = paragraph.split('**');
                  return (
                    <p key={index} className="mb-4">
                      {parts.map((part, partIndex) => 
                        partIndex % 2 === 1 ? (
                          <strong key={partIndex} className="font-bold text-[#0A4D68]">
                            {part}
                          </strong>
                        ) : (
                          <span key={partIndex}>{part}</span>
                        )
                      )}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'finalQuiz':
        const questionEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A4D68] mb-2">
                🧭 {currentStepData.title}
              </h2>
              {currentStepData.content && (
                <p className="text-gray-600 max-w-2xl mx-auto mb-2">
                  {renderMarkdown(currentStepData.content)}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {currentStepData.questions?.map((question, qIndex) => {
                const selectedAnswer = finalQuizAnswers.get(qIndex);
                const showQuestionFeedback = finalQuizFeedback.has(qIndex);
                
                return (
                  <Card key={qIndex} className="border-2 border-purple-200 bg-purple-50">
                    <CardContent className="p-6">
                      <p className="text-lg font-medium text-purple-900 mb-4">
                        {questionEmojis[qIndex]} {renderMarkdown(question.question)}
                      </p>
                      
                      <div className="space-y-3">
                        {question.options.map((option, oIndex) => {
                          const isSelected = selectedAnswer === oIndex;
                          const isCorrect = oIndex === question.correctAnswer;
                          const isIncorrect = showQuestionFeedback && isSelected && !isCorrect;
                          const shouldShowCorrect = showQuestionFeedback && isCorrect;

                          return (
                            <button
                              key={oIndex}
                              onClick={() => handleFinalQuizAnswerSelect(qIndex, oIndex)}
                              disabled={showQuestionFeedback}
                              className={cn(
                                "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3",
                                "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300",
                                !showQuestionFeedback && "hover:border-purple-300 hover:bg-purple-50",
                                isSelected && !showQuestionFeedback && "border-purple-400 bg-purple-100",
                                !isSelected && !showQuestionFeedback && "border-gray-200 bg-white",
                                shouldShowCorrect && "border-green-400 bg-green-50",
                                isIncorrect && "border-red-400 bg-red-50",
                                showQuestionFeedback && "cursor-default"
                              )}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0",
                                !showQuestionFeedback && isSelected && "border-purple-400 bg-purple-400 text-white",
                                !showQuestionFeedback && !isSelected && "border-gray-300 text-gray-500",
                                shouldShowCorrect && "border-green-500 bg-green-500 text-white",
                                isIncorrect && "border-red-500 bg-red-500 text-white"
                              )}>
                                {String.fromCharCode(65 + oIndex)}
                              </div>
                              <span className="flex-1">{option}</span>
                              {showQuestionFeedback && (
                                <div className="flex-shrink-0">
                                  {shouldShowCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                                  {isIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'sources':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl mb-4">
                📚
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A4D68] mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {currentStepData.content}
              </p>
            </div>

            <Card className="border-2 border-indigo-200 bg-indigo-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {currentStepData.sources?.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`link-source-${index}`}
                      className="flex items-start gap-3 p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#0A4D68] group-hover:text-indigo-600 transition-colors">
                          {source.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate mt-1">
                          {source.url}
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-indigo-400 flex-shrink-0 group-hover:text-indigo-600 transition-colors" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#05BFDB] rounded-full flex items-center justify-center text-white flex-shrink-0">
                {getStepIcon(currentStepData.type, currentStep)}
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0A4D68]">
                {currentStepData.title}
              </h2>
            </div>
            
            <div className="prose prose-sm sm:prose-base max-w-none">
              <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {renderMarkdown(currentStepData.content)}
              </div>
            </div>

            {currentStepData.highlight && (
              <Card className="border-l-4 border-[#05BFDB] bg-blue-50">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-sm sm:text-base text-[#088395] font-medium">
                    💡 {renderMarkdown(currentStepData.highlight)}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#088395] to-[#05BFDB] text-white p-3 sm:p-4 md:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="flex-1 pr-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{lesson.title}</h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base hidden sm:block">{lesson.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
              data-testid="button-close-lesson"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-blue-100">
              <span>Step {currentStep + 1} of {lesson.steps.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="bg-white/20" />
          </div>
        </div>

        {/* Content */}
        <div 
          ref={containerRef}
          className={cn(
            "p-4 sm:p-6 md:p-8 overflow-y-auto transition-all duration-300 flex-1",
            showAnimation && "opacity-0 translate-y-4",
            !showAnimation && "opacity-100 translate-y-0"
          )}
        >
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 p-3 sm:p-4 md:p-6 bg-gray-50 flex-shrink-0">
          <div className="flex justify-between items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
              data-testid="button-previous-step"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>

            <div className="flex items-center gap-1 sm:gap-2">
              {lesson.steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors",
                    index <= currentStep ? "bg-[#05BFDB]" : "bg-gray-300"
                  )}
                />
              ))}
            </div>

            {isLastStep ? (
              <div className="flex gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={handleShareLesson}
                  disabled={shareLessonMutation.isPending}
                  className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-4"
                  data-testid="button-share-lesson"
                >
                  <span className="hidden sm:inline">{shareLessonMutation.isPending ? "Sharing..." : "Share"}</span>
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  onClick={handleCompleteLesson}
                  disabled={completeLessonMutation.isPending}
                  className="bg-gradient-to-r from-[#05BFDB] to-[#088395] hover:from-[#088395] hover:to-[#0A4D68] text-white flex items-center gap-1 sm:gap-2 disabled:opacity-50 text-sm sm:text-base px-3 sm:px-4"
                  data-testid="button-complete-lesson"
                >
                  {completeLessonMutation.isPending ? "Saving..." : "Complete"}
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentStepData.type === 'quiz' && selectedAnswer === null}
                className="bg-gradient-to-r from-[#05BFDB] to-[#088395] hover:from-[#088395] hover:to-[#0A4D68] text-white flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-3 sm:px-4"
                data-testid="button-next-step"
              >
                Next
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLessonViewer;