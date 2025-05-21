import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: number;
  title: string;
  category: string;
  questions: Question[];
}

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2 bg-[#05BFDB] text-white">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-white text-[#0A4D68] border-transparent">
            {quiz.category === "ocean-literacy" && "Ocean Literacy"}
            {quiz.category === "reef-ecology" && "Reef Ecology"}
            {quiz.category === "species-identification" && "Species ID"}
          </Badge>
          <div className="flex items-center text-sm">
            <HelpCircle className="mr-1 h-4 w-4" />
            {quiz.questions.length} questions
          </div>
        </div>
        <CardTitle className="mt-2 text-lg">{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-600">
          Test your knowledge about {quiz.title.toLowerCase()} with this quick quiz!
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-[#0A4D68] hover:bg-[#088395]">
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}

export function QuizRunner({ quiz }: QuizCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectAnswer = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setIsAnswerSubmitted(true);
    
    if (selectedAnswer === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <div className="text-5xl font-bold text-[#05BFDB] mb-6">
          {score} / {quiz.questions.length}
        </div>
        <p className="mb-6 text-gray-600">
          {score === quiz.questions.length ? (
            "Perfect score! You're an ocean expert!"
          ) : score >= quiz.questions.length / 2 ? (
            "Good job! You know quite a bit about marine life."
          ) : (
            "Keep learning! Check out our lessons to improve your knowledge."
          )}
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline"
            onClick={handleRestartQuiz}
          >
            Restart Quiz
          </Button>
          <Button 
            className="bg-[#05BFDB] hover:bg-[#088395]"
          >
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <Badge variant="outline" className="bg-[#E0F7FA] text-[#0A4D68]">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Badge>
          <div className="text-sm text-gray-500">
            Score: {score}
          </div>
        </div>
        <h3 className="text-xl font-semibold">{question.question}</h3>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedAnswer === index 
                ? isAnswerSubmitted 
                  ? index === question.correctAnswer 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-[#05BFDB] bg-[#E0F7FA]'
                : 'border-gray-200 hover:border-[#05BFDB]'
            }`}
            onClick={() => handleSelectAnswer(index)}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {isAnswerSubmitted && index === question.correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isAnswerSubmitted && selectedAnswer === index && index !== question.correctAnswer && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        {!isAnswerSubmitted ? (
          <Button 
            className="bg-[#05BFDB] hover:bg-[#088395]"
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        ) : (
          <Button 
            className="bg-[#0A4D68] hover:bg-[#088395]"
            onClick={handleNextQuestion}
          >
            {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
          </Button>
        )}
      </div>
    </div>
  );
}