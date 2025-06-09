import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, MapPin, Thermometer, Fish, Info } from "lucide-react";

interface LessonStep {
  id: number;
  type: "intro" | "map" | "quiz" | "funFact";
  title: string;
  content: any;
}

interface InteractiveLessonProps {
  lesson: {
    id: number;
    title: string;
    description: string;
    duration: number;
    category: string;
    steps: LessonStep[];
  };
}

export function InteractiveLessonCard({ lesson }: InteractiveLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showFunFact, setShowFunFact] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStepData = lesson.steps[currentStep];
  const progress = ((currentStep + 1) / lesson.steps.length) * 100;

  const handleNext = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex });
  };

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case "intro":
        return (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={currentStepData.content.image} 
                alt={currentStepData.content.imageCaption}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{currentStepData.content.imageCaption}</h3>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p>{currentStepData.content.text}</p>
            </div>
          </div>
        );

      case "map":
        return (
          <div className="space-y-4">
            <div className="relative bg-blue-50 rounded-lg p-6 min-h-[300px]">
              {/* Simple ASCII-style map of Western Australia */}
              <div className="relative h-full">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <Thermometer className="h-3 w-3 mr-1" />
                    Warm Current
                  </Badge>
                </div>
                
                {/* Western Australia outline */}
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  {/* Simplified WA coastline */}
                  <path 
                    d="M 50 50 L 50 250 L 150 250 L 200 200 L 250 180 L 300 160 L 350 140 L 350 50 Z"
                    fill="#e5e7eb"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />
                  
                  {/* Leeuwin Current flow */}
                  <path 
                    d="M 30 80 Q 20 120 25 160 Q 30 200 40 240"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                  />
                  
                  {/* Current arrows */}
                  <polygon points="25,90 20,95 30,95" fill="#dc2626" />
                  <polygon points="22,130 17,135 27,135" fill="#dc2626" />
                  <polygon points="28,170 23,175 33,175" fill="#dc2626" />
                  <polygon points="35,210 30,215 40,215" fill="#dc2626" />
                  
                  {/* Location markers */}
                  <circle cx="60" cy="80" r="4" fill="#2563eb" />
                  <circle cx="80" cy="150" r="4" fill="#2563eb" />
                  <circle cx="120" cy="220" r="4" fill="#2563eb" />
                  
                  <text x="65" y="78" fontSize="10" fill="#2563eb">Perth</text>
                  <text x="85" y="148" fontSize="10" fill="#2563eb">Rottnest</text>
                  <text x="125" y="218" fontSize="10" fill="#2563eb">Ningaloo</text>
                </svg>
                
                <div className="absolute bottom-4 left-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-4 h-1 bg-red-600 mr-2"></div>
                    <span>Leeuwin Current Flow</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                    <span>Key Dive Sites</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentStepData.content.facts.map((fact: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      {fact.icon}
                      <h4 className="font-semibold ml-2">{fact.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{fact.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Test Your Knowledge</h3>
              <p className="text-gray-600">Answer these questions about the Leeuwin Current</p>
            </div>
            
            <div className="space-y-6">
              {currentStepData.content.questions.map((question: any, qIndex: number) => (
                <Card key={qIndex} className="border-2">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">{question.question}</h4>
                    <div className="space-y-2">
                      {question.options.map((option: string, oIndex: number) => (
                        <Button
                          key={oIndex}
                          variant={quizAnswers[qIndex] === oIndex ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => handleQuizAnswer(qIndex, oIndex)}
                        >
                          {String.fromCharCode(65 + oIndex)}. {option}
                        </Button>
                      ))}
                    </div>
                    {quizAnswers[qIndex] !== undefined && (
                      <div className={`mt-4 p-3 rounded-lg ${
                        quizAnswers[qIndex] === question.correctAnswer 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {quizAnswers[qIndex] === question.correctAnswer 
                          ? "✓ Correct! " + question.explanation
                          : "✗ Incorrect. " + question.explanation
                        }
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "funFact":
        return (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Info className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Did You Know?</h3>
                    <p className="text-blue-800 text-lg leading-relaxed">
                      {currentStepData.content.fact}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button
                onClick={() => setShowFunFact(!showFunFact)}
                variant="outline"
                className="mb-4"
              >
                {showFunFact ? "Hide" : "Show"} More Fun Facts
              </Button>
              
              {showFunFact && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentStepData.content.moreFacts.map((fact: string, index: number) => (
                    <Card key={index} className="bg-gray-50">
                      <CardContent className="p-4">
                        <p className="text-sm">{fact}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Fish className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">Lesson Complete!</h3>
          <p className="text-green-700 mb-4">
            You've learned about the Leeuwin Current and its impact on Western Australia's marine life.
          </p>
          <Button onClick={() => window.location.reload()}>Explore More Lessons</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
            <CardDescription className="mt-2">{lesson.description}</CardDescription>
          </div>
          <Badge variant="secondary">{lesson.duration} min</Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Step {currentStep + 1} of {lesson.steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{currentStepData.title}</h2>
          {renderStepContent()}
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === lesson.steps.length - 1 ? "Complete Lesson" : "Next"}
            {currentStep < lesson.steps.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}