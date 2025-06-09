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
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

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
            <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 rounded-lg p-6 min-h-[600px] border border-blue-300 shadow-2xl overflow-hidden">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge variant="secondary" className="bg-amber-50 text-amber-900 border border-amber-300 shadow-lg backdrop-blur-sm">
                  <Thermometer className="h-4 w-4 mr-1" />
                  Leeuwin Current System - Western Australia
                </Badge>
              </div>
              
              {/* Enhanced oceanographic map */}
              <svg viewBox="0 0 700 600" className="w-full h-full">
                <defs>
                  {/* Ocean depth gradient */}
                  <radialGradient id="oceanDepth" cx="0%" cy="0%" r="100%">
                    <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#0e7490" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#0891b2" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                  </radialGradient>
                  
                  {/* Warm current gradient */}
                  <linearGradient id="warmCurrent" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="1" />
                    <stop offset="25%" stopColor="#ea580c" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="75%" stopColor="#eab308" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#facc15" stopOpacity="0.8" />
                  </linearGradient>
                  
                  {/* Eddy gradient */}
                  <radialGradient id="eddyGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#ea580c" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
                  </radialGradient>
                  
                  {/* Bathymetry patterns */}
                  <pattern id="bathymetry" patternUnits="userSpaceOnUse" width="20" height="20">
                    <circle cx="10" cy="10" r="1" fill="#0891b2" opacity="0.3" />
                  </pattern>
                </defs>
                
                {/* Ocean background with bathymetry */}
                <rect x="0" y="0" width="700" height="600" fill="url(#oceanDepth)" />
                <rect x="0" y="0" width="700" height="600" fill="url(#bathymetry)" />
                
                {/* Continental shelf zones */}
                <path 
                  d="M 60 100 Q 55 140 60 180 Q 65 220 70 260 Q 75 300 80 340 Q 85 380 95 420 Q 110 450 130 470 Q 160 485 190 490 Q 230 495 270 490 Q 310 485 350 475"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  opacity="0.7"
                />
                
                {/* 200m depth contour */}
                <path 
                  d="M 40 110 Q 35 150 40 190 Q 45 230 50 270 Q 55 310 65 350 Q 75 390 90 425 Q 110 455 140 475 Q 175 490 215 495 Q 255 500 295 495"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  opacity="0.5"
                />
                
                {/* Western Australia coastline - highly detailed */}
                <path 
                  d="M 130 80 
                     L 135 60 
                     L 155 50 
                     L 180 52 
                     L 205 58 
                     L 230 68 
                     L 255 82 
                     L 280 100 
                     L 305 122 
                     L 330 148 
                     L 355 178 
                     L 375 210 
                     L 390 245 
                     L 395 280 
                     L 390 315 
                     L 380 350 
                     L 365 385 
                     L 345 415 
                     L 320 440 
                     L 290 455 
                     L 255 465 
                     L 220 470 
                     L 185 468 
                     L 150 460 
                     L 120 445 
                     L 100 425 
                     L 85 400 
                     L 80 370 
                     L 82 340 
                     L 85 310 
                     L 82 280 
                     L 80 250 
                     L 78 220 
                     L 75 190 
                     L 78 160 
                     L 82 130 
                     L 88 100 
                     Z"
                  fill="#065f46"
                  stroke="#059669"
                  strokeWidth="2"
                  opacity="0.9"
                />
                
                {/* Major cape features */}
                <text x="140" y="75" fontSize="12" fontWeight="bold" fill="#ffffff" className="drop-shadow-lg">North West Cape</text>
                <text x="175" y="455" fontSize="12" fontWeight="bold" fill="#fbbf24" className="drop-shadow-lg">Cape Leeuwin</text>
                <text x="420" y="480" fontSize="11" fill="#ffffff" opacity="0.8">Great Australian Bight</text>
                
                {/* Main Leeuwin Current - enhanced visualization */}
                <path 
                  d="M 70 115 
                     Q 65 145 68 175 
                     Q 72 205 76 235 
                     Q 80 265 84 295 
                     Q 88 325 92 355 
                     Q 96 385 102 410 
                     Q 110 435 125 455 
                     Q 145 470 170 480 
                     Q 200 488 235 490 
                     Q 275 492 315 488 
                     Q 355 484 395 475 
                     Q 435 465 475 450"
                  fill="none"
                  stroke="url(#warmCurrent)"
                  strokeWidth="12"
                  opacity="0.95"
                  className="drop-shadow-lg"
                />
                
                {/* Secondary current branches */}
                <path 
                  d="M 84 295 Q 100 305 120 310"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="8"
                  opacity="0.8"
                />
                
                <path 
                  d="M 102 410 Q 120 420 145 425"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="8"
                  opacity="0.8"
                />
                
                {/* Cape Leeuwin intensification */}
                <path 
                  d="M 125 455 Q 155 465 190 470"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="14"
                  opacity="0.9"
                  className="drop-shadow-lg"
                />
                
                {/* Enhanced directional arrows */}
                <g className="drop-shadow-md">
                  {/* Main flow arrows */}
                  <polygon points="65,125 55,140 75,132" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="70,180 60,195 80,187" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="78,240 68,255 88,247" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="86,300 76,315 96,307" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="94,360 84,375 104,367" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="105,415 95,430 115,422" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="130,460 120,475 140,467" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="175,475 165,490 185,482" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="240,485 230,500 250,492" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="320,483 310,498 330,490" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                  <polygon points="400,470 390,485 410,477" fill="#dc2626" stroke="#ffffff" strokeWidth="0.5" />
                </g>
                
                {/* Coastal eddies with hover interaction */}
                <g 
                  onMouseEnter={() => setHoveredElement('eddy1')}
                  onMouseLeave={() => setHoveredElement(null)}
                  className="cursor-pointer"
                >
                  <circle cx="110" cy="320" r="15" fill="url(#eddyGradient)" opacity="0.7" />
                  <path d="M 105 310 Q 120 315 115 330 Q 100 335 105 320" fill="none" stroke="#dc2626" strokeWidth="2" />
                  <polygon points="118,318 115,325 122,322" fill="#dc2626" />
                </g>
                
                <g 
                  onMouseEnter={() => setHoveredElement('eddy2')}
                  onMouseLeave={() => setHoveredElement(null)}
                  className="cursor-pointer"
                >
                  <circle cx="140" cy="420" r="12" fill="url(#eddyGradient)" opacity="0.6" />
                  <path d="M 135 412 Q 148 417 143 428 Q 132 432 135 422" fill="none" stroke="#dc2626" strokeWidth="2" />
                  <polygon points="146,420 143,427 150,424" fill="#dc2626" />
                </g>
                
                {/* Temperature isotherms with enhanced styling */}
                <g opacity="0.8">
                  <path d="M 50 120 Q 45 160 50 200 Q 55 240 60 280" fill="none" stroke="#dc2626" strokeWidth="3" strokeDasharray="8 4" />
                  <text x="35" y="125" fontSize="11" fontWeight="bold" fill="#dc2626" className="drop-shadow-sm">24°C</text>
                  
                  <path d="M 55 190 Q 50 230 55 270 Q 60 310 65 350" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="8 4" />
                  <text x="40" y="195" fontSize="11" fontWeight="bold" fill="#ea580c" className="drop-shadow-sm">22°C</text>
                  
                  <path d="M 65 300 Q 60 340 65 380 Q 70 420 80 450" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 4" />
                  <text x="50" y="305" fontSize="11" fontWeight="bold" fill="#f59e0b" className="drop-shadow-sm">20°C</text>
                  
                  <path d="M 95 425 Q 110 450 130 465 Q 155 475 185 480" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="8 4" />
                  <text x="80" y="430" fontSize="11" fontWeight="bold" fill="#facc15" className="drop-shadow-sm">18°C</text>
                </g>
                
                {/* Key marine locations with enhanced markers */}
                <g>
                  <circle cx="145" cy="125" r="8" fill="#1e40af" stroke="#ffffff" strokeWidth="3" className="drop-shadow-lg" />
                  <text x="157" y="130" fontSize="13" fontWeight="bold" fill="#ffffff" className="drop-shadow-lg">Perth</text>
                  
                  <circle cx="160" cy="135" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <text x="170" y="140" fontSize="10" fill="#ffffff" className="drop-shadow-sm">Rottnest Island</text>
                  
                  <circle cx="185" cy="170" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <text x="195" y="175" fontSize="10" fill="#ffffff" className="drop-shadow-sm">Geraldton</text>
                  
                  <circle cx="230" cy="240" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <text x="240" y="245" fontSize="10" fill="#ffffff" className="drop-shadow-sm">Shark Bay</text>
                  
                  <circle cx="300" cy="160" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <text x="310" y="165" fontSize="11" fontWeight="bold" fill="#ffffff" className="drop-shadow-sm">Ningaloo Reef</text>
                  
                  <circle cx="370" cy="200" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <text x="380" y="205" fontSize="10" fill="#ffffff" className="drop-shadow-sm">Exmouth</text>
                  
                  <circle cx="380" cy="230" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <text x="390" y="235" fontSize="10" fill="#ffffff" className="drop-shadow-sm">Coral Bay</text>
                </g>
                
                {/* Ocean labels */}
                <text x="30" y="250" fontSize="14" fontWeight="bold" fill="#ffffff" transform="rotate(-90 30 250)" className="drop-shadow-lg">INDIAN OCEAN</text>
                <text x="500" y="350" fontSize="12" fill="#22d3ee" className="drop-shadow-sm">Continental Shelf</text>
                <text x="450" y="370" fontSize="10" fill="#0891b2">200m depth</text>
                
                {/* Enhanced scale bar */}
                <g transform="translate(520, 480)">
                  <rect x="-5" y="-15" width="110" height="30" fill="rgba(0,0,0,0.7)" rx="5" />
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#ffffff" strokeWidth="3" />
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#ffffff" strokeWidth="3" />
                  <line x1="50" y1="-3" x2="50" y2="3" stroke="#ffffff" strokeWidth="2" />
                  <line x1="100" y1="-5" x2="100" y2="5" stroke="#ffffff" strokeWidth="3" />
                  <text x="50" y="20" fontSize="10" textAnchor="middle" fill="#ffffff" fontWeight="bold">500 km</text>
                  <text x="25" y="-8" fontSize="8" textAnchor="middle" fill="#ffffff">250</text>
                </g>
                
                {/* Professional compass rose */}
                <g transform="translate(580, 90)">
                  <circle cx="0" cy="0" r="35" fill="rgba(255,255,255,0.95)" stroke="#374151" strokeWidth="3" className="drop-shadow-xl" />
                  <polygon points="0,-28 -8,12 0,5 8,12" fill="#dc2626" stroke="#ffffff" strokeWidth="1" />
                  <polygon points="0,28 -8,-12 0,-5 8,-12" fill="#6b7280" stroke="#ffffff" strokeWidth="1" />
                  <line x1="0" y1="-35" x2="0" y2="35" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="-35" y1="0" x2="35" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                  <text x="-5" y="-40" fontSize="12" fontWeight="bold" fill="#dc2626">N</text>
                  <text x="25" y="5" fontSize="10" fill="#6b7280">E</text>
                  <text x="-5" y="50" fontSize="10" fill="#6b7280">S</text>
                  <text x="-35" y="5" fontSize="10" fill="#6b7280">W</text>
                </g>
              </svg>
              
              {/* Enhanced legend with hover tooltips */}
              <div className="absolute bottom-4 left-4 bg-white/95 rounded-xl p-5 space-y-4 shadow-2xl border border-slate-300 backdrop-blur-sm max-w-xs">
                <h4 className="font-bold text-sm text-slate-800 border-b-2 border-blue-200 pb-2">Oceanographic Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-xs">
                    <div className="w-10 h-3 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 mr-3 rounded-full shadow-sm"></div>
                    <span className="font-medium">Leeuwin Current (warm poleward flow)</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-10 h-3 bg-orange-500 mr-3 rounded-full shadow-sm"></div>
                    <span>Coastal branch currents</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-4 h-4 rounded-full border-3 border-red-600 mr-3" style={{background: 'conic-gradient(from 0deg, #dc2626, #ea580c, #dc2626)'}}></div>
                    <span>Mesoscale eddies</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-6 h-0.5 border-2 border-dashed border-yellow-500 mr-3"></div>
                    <span>Temperature isotherms (°C)</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <MapPin className="h-4 w-4 text-blue-600 mr-3" />
                    <span>Marine protected areas</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-6 h-0.5 border border-dashed border-cyan-400 mr-3"></div>
                    <span>Continental shelf (200m)</span>
                  </div>
                </div>
              </div>
              
              {/* Hover tooltip */}
              {hoveredElement && (
                <div className="absolute top-20 right-4 bg-slate-900 text-white p-3 rounded-lg shadow-xl max-w-xs z-20">
                  {hoveredElement === 'eddy1' && (
                    <div>
                      <h5 className="font-bold text-sm mb-1">Mesoscale Eddy</h5>
                      <p className="text-xs">Circular water currents that form due to current shear and topographic features, enhancing nutrient mixing.</p>
                    </div>
                  )}
                  {hoveredElement === 'eddy2' && (
                    <div>
                      <h5 className="font-bold text-sm mb-1">Coastal Eddy</h5>
                      <p className="text-xs">Smaller-scale rotating water masses that create local upwelling and support marine biodiversity hotspots.</p>
                    </div>
                  )}
                </div>
              )}
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