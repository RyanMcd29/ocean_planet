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
            <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-6 min-h-[400px] border-2 border-blue-200">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 shadow-lg">
                  <Thermometer className="h-3 w-3 mr-1" />
                  Warm Poleward Current
                </Badge>
              </div>
              
              {/* More accurate Western Australia map */}
              <svg viewBox="0 0 500 400" className="w-full h-full">
                {/* Ocean background */}
                <rect x="0" y="0" width="500" height="400" fill="#bfdbfe" opacity="0.3" />
                
                {/* Western Australia coastline - more accurate shape */}
                <path 
                  d="M 80 60 
                     L 85 45 
                     L 120 35 
                     L 160 40 
                     L 200 50 
                     L 240 65 
                     L 280 85 
                     L 320 110 
                     L 350 140 
                     L 370 170 
                     L 380 200 
                     L 385 230 
                     L 380 260 
                     L 370 290 
                     L 350 320 
                     L 320 340 
                     L 280 350 
                     L 240 355 
                     L 200 350 
                     L 160 340 
                     L 120 320 
                     L 100 300 
                     L 85 280 
                     L 80 260 
                     L 82 240 
                     L 85 220 
                     L 82 200 
                     L 80 180 
                     L 78 160 
                     L 75 140 
                     L 72 120 
                     L 75 100 
                     L 78 80 
                     Z"
                  fill="#d1fae5"
                  stroke="#059669"
                  strokeWidth="2"
                />
                
                {/* Leeuwin Current main flow - more accurate path */}
                <path 
                  d="M 40 85 
                     Q 35 110 38 140 
                     Q 42 170 45 200 
                     Q 48 230 52 260 
                     Q 55 290 60 320 
                     Q 65 340 75 355 
                     Q 90 365 110 368 
                     Q 130 370 150 365"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="6"
                  strokeDasharray="12 6"
                  opacity="0.8"
                />
                
                {/* Secondary current branches */}
                <path 
                  d="M 52 260 Q 65 270 80 275"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="4"
                  strokeDasharray="8 4"
                  opacity="0.6"
                />
                
                <path 
                  d="M 60 320 Q 75 325 95 330"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="4"
                  strokeDasharray="8 4"
                  opacity="0.6"
                />
                
                {/* Current direction arrows */}
                <polygon points="35,95 30,105 45,100" fill="#dc2626" />
                <polygon points="40,145 35,155 50,150" fill="#dc2626" />
                <polygon points="45,195 40,205 55,200" fill="#dc2626" />
                <polygon points="50,245 45,255 60,250" fill="#dc2626" />
                <polygon points="55,295 50,305 65,300" fill="#dc2626" />
                <polygon points="65,335 60,345 75,340" fill="#dc2626" />
                
                {/* Temperature indicators */}
                <circle cx="30" cy="90" r="8" fill="#fca5a5" opacity="0.7" />
                <text x="26" y="95" fontSize="10" fontWeight="bold" fill="#dc2626">24°</text>
                
                <circle cx="35" cy="150" r="8" fill="#fca5a5" opacity="0.7" />
                <text x="31" y="155" fontSize="10" fontWeight="bold" fill="#dc2626">22°</text>
                
                <circle cx="45" cy="250" r="8" fill="#fca5a5" opacity="0.7" />
                <text x="41" y="255" fontSize="10" fontWeight="bold" fill="#dc2626">20°</text>
                
                {/* Key locations with better positioning */}
                <circle cx="95" cy="85" r="5" fill="#1d4ed8" />
                <text x="105" y="90" fontSize="12" fontWeight="bold" fill="#1d4ed8">Perth</text>
                
                <circle cx="110" cy="95" r="4" fill="#2563eb" />
                <text x="120" y="100" fontSize="10" fill="#2563eb">Rottnest</text>
                
                <circle cx="150" cy="140" r="4" fill="#2563eb" />
                <text x="160" y="145" fontSize="10" fill="#2563eb">Geraldton</text>
                
                <circle cx="200" cy="200" r="4" fill="#2563eb" />
                <text x="210" y="205" fontSize="10" fill="#2563eb">Shark Bay</text>
                
                <circle cx="280" cy="120" r="4" fill="#2563eb" />
                <text x="290" y="125" fontSize="10" fill="#2563eb">Ningaloo</text>
                
                <circle cx="350" cy="160" r="4" fill="#2563eb" />
                <text x="360" y="165" fontSize="10" fill="#2563eb">Exmouth</text>
                
                {/* Cape Leeuwin marker */}
                <circle cx="120" cy="320" r="5" fill="#dc2626" />
                <text x="130" y="325" fontSize="11" fontWeight="bold" fill="#dc2626">Cape Leeuwin</text>
                
                {/* Compass */}
                <g transform="translate(450, 50)">
                  <circle cx="0" cy="0" r="20" fill="white" stroke="#374151" strokeWidth="2" />
                  <polygon points="0,-15 -5,5 0,0 5,5" fill="#dc2626" />
                  <text x="-3" y="-18" fontSize="8" fill="#dc2626">N</text>
                </g>
              </svg>
              
              <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 space-y-2 shadow-lg">
                <div className="flex items-center text-sm font-medium">
                  <div className="w-6 h-2 bg-red-600 mr-2 rounded"></div>
                  <span>Leeuwin Current (warm)</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-6 h-2 bg-orange-500 mr-2 rounded"></div>
                  <span>Secondary flows</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                  <span>Major dive sites</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-4 h-4 bg-red-200 rounded-full mr-2"></div>
                  <span>Water temperature (°C)</span>
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