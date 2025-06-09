import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Map, 
  Brain, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Waves,
  Thermometer
} from "lucide-react";

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
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const currentStepData = lesson.steps[currentStep];
  const progress = ((currentStep + 1) / lesson.steps.length) * 100;

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'intro':
        return <BookOpen className="h-5 w-5" />;
      case 'map':
        return <Map className="h-5 w-5" />;
      case 'quiz':
        return <Brain className="h-5 w-5" />;
      case 'funFact':
        return <Info className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const nextStep = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex });
    setShowResults({ ...showResults, [questionIndex]: true });
  };

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case "intro":
        return (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p>{currentStepData.content.text}</p>
            </div>
          </div>
        );

      case "map":
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Waves className="w-6 h-6" />
                Leeuwin Current Temperature Map
              </h3>
              
              <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/attached_assets/fmars-04-00173-g001_1749453619615.webp"
                  alt="Leeuwin Current oceanographic map showing temperature gradients and current flow patterns along Western Australia coast"
                  className="w-full h-auto"
                />
                
                {/* Interactive hotspots overlaid on the image */}
                <div className="absolute inset-0">
                  <div 
                    className="absolute w-6 h-6 bg-blue-500/70 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600/80 transition-all duration-300"
                    style={{ top: '25%', left: '15%' }}
                    onMouseEnter={() => setHoveredElement('hotspot1')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  
                  <div 
                    className="absolute w-6 h-6 bg-green-500/70 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600/80 transition-all duration-300"
                    style={{ top: '45%', left: '20%' }}
                    onMouseEnter={() => setHoveredElement('hotspot2')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  
                  <div 
                    className="absolute w-6 h-6 bg-red-500/70 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600/80 transition-all duration-300"
                    style={{ top: '75%', left: '25%' }}
                    onMouseEnter={() => setHoveredElement('hotspot3')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                </div>
              </div>
              
              {/* Information panels that appear on hover */}
              {hoveredElement && (
                <div className="mt-4 bg-white rounded-lg p-4 shadow-lg border-2 border-blue-200">
                  {hoveredElement === 'hotspot1' && (
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Northern Waters (Broome Region)</h4>
                      <p className="text-sm text-gray-700">The Leeuwin Current originates from warm tropical waters, with temperatures reaching 26-28°C. This region shows the characteristic red/orange coloring indicating maximum warmth.</p>
                    </div>
                  )}
                  {hoveredElement === 'hotspot2' && (
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Central Flow (Perth Region)</h4>
                      <p className="text-sm text-gray-700">As the current flows southward past Perth, temperatures gradually decrease to 22-24°C. The current maintains its strength while interacting with coastal features.</p>
                    </div>
                  )}
                  {hoveredElement === 'hotspot3' && (
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Southern Terminus (Cape Leeuwin)</h4>
                      <p className="text-sm text-gray-700">At Cape Leeuwin, the current reaches its southernmost extent with temperatures of 18-20°C, shown in the yellow-green gradient as it mixes with cooler Southern Ocean waters.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Knowledge Check</h3>
              <p className="text-gray-600">Test your understanding of what you've learned!</p>
            </div>
            
            <div className="space-y-4">
              {currentStepData.content.questions.map((question: any, qIndex: number) => (
                <Card key={qIndex} className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">{question.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {question.options.map((option: string, oIndex: number) => (
                        <Button
                          key={oIndex}
                          variant={
                            showResults[qIndex]
                              ? oIndex === question.correctAnswer
                                ? "default"
                                : quizAnswers[qIndex] === oIndex
                                ? "destructive"
                                : "outline"
                              : quizAnswers[qIndex] === oIndex
                              ? "default"
                              : "outline"
                          }
                          className="w-full justify-start text-left h-auto p-4"
                          onClick={() => handleQuizAnswer(qIndex, oIndex)}
                          disabled={showResults[qIndex]}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    
                    {showResults[qIndex] && (
                      <div className={`mt-4 p-3 rounded-lg text-sm ${
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
        return <div>Unknown step type</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-2 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg text-white">
                {getStepIcon(currentStepData.type)}
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-900">{lesson.title}</CardTitle>
                <p className="text-blue-600 mt-1">{currentStepData.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Step {currentStep + 1} of {lesson.steps.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-blue-600"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-blue-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-blue-100" />
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {renderStepContent()}
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex space-x-2">
              {lesson.steps.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : index < currentStep
                      ? 'bg-blue-300'
                      : 'bg-gray-200'
                  }`}
                  onClick={() => setCurrentStep(index)}
                />
              ))}
            </div>
            
            <Button
              onClick={nextStep}
              disabled={currentStep === lesson.steps.length - 1}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}