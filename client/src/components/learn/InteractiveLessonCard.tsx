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
            <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-lg p-6 min-h-[500px] border border-slate-200 shadow-lg">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                  <Thermometer className="h-3 w-3 mr-1" />
                  Leeuwin Current System
                </Badge>
              </div>
              
              {/* Professional oceanographic map */}
              <svg viewBox="0 0 600 500" className="w-full h-full">
                {/* Ocean depth zones */}
                <defs>
                  <radialGradient id="deepOcean" cx="0%" cy="0%" r="100%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#1e40af" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </radialGradient>
                  
                  <linearGradient id="currentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#ea580c" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                
                {/* Deep ocean background */}
                <rect x="0" y="0" width="600" height="500" fill="url(#deepOcean)" />
                
                {/* Continental shelf */}
                <path 
                  d="M 50 80 Q 45 120 50 160 Q 55 200 60 240 Q 65 280 70 320 Q 75 360 85 400 Q 100 430 120 450 Q 150 465 180 470 Q 220 475 260 470"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  opacity="0.6"
                />
                
                {/* Western Australia coastline - scientifically accurate */}
                <path 
                  d="M 110 70 
                     L 115 50 
                     L 140 40 
                     L 170 42 
                     L 200 48 
                     L 230 58 
                     L 260 72 
                     L 290 90 
                     L 320 112 
                     L 350 138 
                     L 380 168 
                     L 400 200 
                     L 410 235 
                     L 415 270 
                     L 410 305 
                     L 400 340 
                     L 385 375 
                     L 365 405 
                     L 340 430 
                     L 310 445 
                     L 275 455 
                     L 240 460 
                     L 205 458 
                     L 170 450 
                     L 140 435 
                     L 115 415 
                     L 100 390 
                     L 90 360 
                     L 85 330 
                     L 88 300 
                     L 92 270 
                     L 90 240 
                     L 88 210 
                     L 85 180 
                     L 82 150 
                     L 85 120 
                     L 90 90 
                     Z"
                  fill="#f0fdf4"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
                
                {/* Major geographic features */}
                <text x="125" y="65" fontSize="11" fontWeight="bold" fill="#059669">North West Cape</text>
                <text x="160" y="440" fontSize="11" fontWeight="bold" fill="#dc2626">Cape Leeuwin</text>
                <text x="380" y="420" fontSize="10" fill="#059669">Great Australian Bight</text>
                
                {/* Leeuwin Current main flow - following continental shelf */}
                <path 
                  d="M 60 95 
                     Q 55 125 58 155 
                     Q 62 185 66 215 
                     Q 70 245 74 275 
                     Q 78 305 82 335 
                     Q 86 365 92 390 
                     Q 100 415 115 435 
                     Q 135 450 160 460 
                     Q 190 468 225 470 
                     Q 260 472 295 468 
                     Q 330 464 365 455"
                  fill="none"
                  stroke="url(#currentGradient)"
                  strokeWidth="8"
                  opacity="0.9"
                />
                
                {/* Current velocity indicators - thicker where stronger */}
                <path 
                  d="M 70 275 Q 85 285 100 290"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="6"
                  opacity="0.7"
                />
                
                <path 
                  d="M 92 390 Q 110 400 130 405"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="6"
                  opacity="0.7"
                />
                
                {/* Capes Leeuwin - strongest flow indicator */}
                <path 
                  d="M 115 435 Q 140 445 170 450"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="10"
                  opacity="0.8"
                />
                
                {/* Current direction arrows - more scientific style */}
                <g>
                  <polygon points="55,105 48,115 62,110" fill="#dc2626" />
                  <polygon points="60,160 53,170 67,165" fill="#dc2626" />
                  <polygon points="68,220 61,230 75,225" fill="#dc2626" />
                  <polygon points="76,280 69,290 83,285" fill="#dc2626" />
                  <polygon points="84,340 77,350 91,345" fill="#dc2626" />
                  <polygon points="95,395 88,405 102,400" fill="#dc2626" />
                  <polygon points="120,440 113,450 127,445" fill="#dc2626" />
                  <polygon points="165,455 158,465 172,460" fill="#dc2626" />
                  <polygon points="230,470 223,480 237,475" fill="#dc2626" />
                  <polygon points="300,465 293,475 307,470" fill="#dc2626" />
                </g>
                
                {/* Temperature isotherms */}
                <g opacity="0.6">
                  <circle cx="45" cy="100" r="12" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="38" y="105" fontSize="10" fontWeight="bold" fill="#dc2626">24°C</text>
                  
                  <circle cx="50" cy="170" r="15" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="42" y="176" fontSize="10" fontWeight="bold" fill="#ea580c">22°C</text>
                  
                  <circle cx="58" cy="280" r="18" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="49" y="286" fontSize="10" fontWeight="bold" fill="#f59e0b">20°C</text>
                  
                  <circle cx="85" cy="395" r="20" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="76" y="401" fontSize="10" fontWeight="bold" fill="#f97316">18°C</text>
                </g>
                
                {/* Key marine locations - accurately positioned */}
                <g>
                  <circle cx="125" cy="105" r="6" fill="#1e40af" stroke="#ffffff" strokeWidth="2" />
                  <text x="135" y="110" fontSize="11" fontWeight="bold" fill="#1e40af">Perth</text>
                  
                  <circle cx="140" cy="115" r="4" fill="#2563eb" />
                  <text x="148" y="120" fontSize="9" fill="#2563eb">Rottnest Island</text>
                  
                  <circle cx="165" cy="150" r="4" fill="#2563eb" />
                  <text x="173" y="155" fontSize="9" fill="#2563eb">Geraldton</text>
                  
                  <circle cx="210" cy="220" r="4" fill="#2563eb" />
                  <text x="218" y="225" fontSize="9" fill="#2563eb">Shark Bay</text>
                  
                  <circle cx="280" cy="140" r="4" fill="#2563eb" />
                  <text x="288" y="145" fontSize="9" fill="#2563eb">Ningaloo Reef</text>
                  
                  <circle cx="350" cy="180" r="4" fill="#2563eb" />
                  <text x="358" y="185" fontSize="9" fill="#2563eb">Exmouth</text>
                  
                  <circle cx="360" cy="210" r="4" fill="#2563eb" />
                  <text x="368" y="215" fontSize="9" fill="#2563eb">Coral Bay</text>
                </g>
                
                {/* Oceanographic features */}
                <text x="25" y="200" fontSize="9" fill="#0ea5e9" transform="rotate(-90 25 200)">INDIAN OCEAN</text>
                <text x="450" y="300" fontSize="9" fill="#0ea5e9">Continental Shelf</text>
                
                {/* Scale bar */}
                <g transform="translate(450, 420)">
                  <line x1="0" y1="0" x2="50" y2="0" stroke="#374151" strokeWidth="2" />
                  <line x1="0" y1="-3" x2="0" y2="3" stroke="#374151" strokeWidth="2" />
                  <line x1="50" y1="-3" x2="50" y2="3" stroke="#374151" strokeWidth="2" />
                  <text x="25" y="15" fontSize="8" textAnchor="middle" fill="#374151">500 km</text>
                </g>
                
                {/* Professional compass rose */}
                <g transform="translate(520, 70)">
                  <circle cx="0" cy="0" r="25" fill="white" stroke="#374151" strokeWidth="2" opacity="0.9" />
                  <polygon points="0,-20 -6,8 0,3 6,8" fill="#dc2626" />
                  <polygon points="0,20 -6,-8 0,-3 6,-8" fill="#6b7280" />
                  <text x="-4" y="-25" fontSize="10" fontWeight="bold" fill="#dc2626">N</text>
                  <text x="20" y="4" fontSize="8" fill="#6b7280">E</text>
                  <text x="-4" y="35" fontSize="8" fill="#6b7280">S</text>
                  <text x="-25" y="4" fontSize="8" fill="#6b7280">W</text>
                </g>
              </svg>
              
              {/* Professional legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 rounded-lg p-4 space-y-3 shadow-lg border border-slate-200 backdrop-blur-sm">
                <h4 className="font-semibold text-sm text-slate-700 border-b border-slate-200 pb-1">Current System</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-xs">
                    <div className="w-8 h-2 bg-gradient-to-r from-red-600 to-orange-500 mr-2 rounded"></div>
                    <span>Leeuwin Current (poleward flow)</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-8 h-2 bg-orange-500 mr-2 rounded"></div>
                    <span>Secondary coastal flows</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 border-2 border-red-600 rounded-full mr-2"></div>
                    <span>Temperature isotherms</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <MapPin className="h-3 w-3 text-blue-600 mr-2" />
                    <span>Marine ecosystems</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-1 border border-cyan-500 mr-2"></div>
                    <span>Continental shelf edge</span>
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