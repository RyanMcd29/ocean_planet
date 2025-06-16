import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface MicroLessonProps {
  title: string;
  emoji: string;
  sections: {
    title: string;
    emoji: string;
    content: React.ReactNode;
  }[];
  quiz: QuizQuestion[];
}

const MicroLesson: React.FC<MicroLessonProps> = ({ title, emoji, sections, quiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    if (showResults) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setQuizCompleted(true);
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
  };

  const getScore = () => {
    let correct = 0;
    quiz.forEach(question => {
      const selectedOption = selectedAnswers[question.id];
      if (selectedOption) {
        const option = question.options.find(opt => opt.id === selectedOption);
        if (option?.isCorrect) correct++;
      }
    });
    return { correct, total: quiz.length };
  };

  const isQuizReady = Object.keys(selectedAnswers).length === quiz.length;
  const score = showResults ? getScore() : { correct: 0, total: quiz.length };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-[#0A4D68] mb-2">
          {emoji} {title}
        </h1>
      </div>

      {/* Lesson Content */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-[#088395] flex items-center gap-2">
                <span>{section.emoji}</span>
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 leading-relaxed text-base md:text-lg">
                {section.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiz Section */}
      <Card className="shadow-lg border-l-4 border-[#05BFDB]">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-[#0A4D68] flex items-center gap-2">
            <span>🧠</span>
            <span>Mini Quiz</span>
          </CardTitle>
          {showResults && (
            <div className="mt-2">
              <div className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                score.correct === score.total
                  ? "bg-green-100 text-green-800"
                  : score.correct >= score.total * 0.7
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              )}>
                Score: {score.correct}/{score.total}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {quiz.map((question) => (
              <div key={question.id} className="space-y-3">
                <p className="font-semibold text-[#0A4D68] text-base md:text-lg">
                  {question.id}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option) => {
                    const isSelected = selectedAnswers[question.id] === option.id;
                    const isCorrect = option.isCorrect;
                    const isIncorrect = showResults && isSelected && !isCorrect;
                    const shouldShowCorrect = showResults && isCorrect;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(question.id, option.id)}
                        disabled={showResults}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3",
                          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#05BFDB]",
                          isSelected && !showResults && "border-[#05BFDB] bg-blue-50",
                          !isSelected && !showResults && "border-gray-200",
                          shouldShowCorrect && "border-green-500 bg-green-50",
                          isIncorrect && "border-red-500 bg-red-50",
                          showResults && "cursor-default"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0",
                          isSelected && !showResults && "border-[#05BFDB] bg-[#05BFDB] text-white",
                          !isSelected && !showResults && "border-gray-300",
                          shouldShowCorrect && "border-green-500 bg-green-500 text-white",
                          isIncorrect && "border-red-500 bg-red-500 text-white"
                        )}>
                          {String.fromCharCode(65 + question.options.indexOf(option))}
                        </div>
                        <span className="flex-1">{option.text}</span>
                        {showResults && (
                          <div className="flex-shrink-0">
                            {shouldShowCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {isIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-center">
            {!quizCompleted ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={!isQuizReady}
                className="bg-[#088395] hover:bg-[#0A4D68] text-white px-6 py-2"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={handleRetryQuiz}
                variant="outline"
                className="border-[#088395] text-[#088395] hover:bg-[#088395] hover:text-white px-6 py-2"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      {showResults && (
        <Card className="border-l-4 border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl mb-2">
                {score.correct === score.total ? "🎉" : score.correct >= score.total * 0.7 ? "👍" : "📚"}
              </div>
              <p className="text-green-800 font-medium">
                {score.correct === score.total
                  ? "Perfect! You've mastered this lesson!"
                  : score.correct >= score.total * 0.7
                  ? "Great job! You're getting the hang of it!"
                  : "Keep learning! Every step counts toward ocean conservation."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MicroLesson;