import React from "react";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizRunner, Quiz } from "@/components/learn/QuizCard";
import { ChevronLeft } from "lucide-react";

// This would normally come from an API, but for demo purposes we'll use static data
const quizzes: Quiz[] = [
  {
    id: 1,
    title: "Coral Reef Basics",
    category: "reef-ecology",
    questions: [
      {
        question: "What percentage of the ocean floor do coral reefs cover?",
        options: ["Less than 1%", "About 5%", "About 10%", "More than 20%"],
        correctAnswer: 0
      },
      {
        question: "What are coral polyps?",
        options: [
          "A type of fish that lives in reefs",
          "Tiny soft-bodied organisms related to sea anemones",
          "A type of algae that grows on coral",
          "Rock formations created by ocean currents"
        ],
        correctAnswer: 1
      },
      {
        question: "What is the primary threat to coral reefs globally?",
        options: [
          "Overfishing",
          "Tourism",
          "Climate change",
          "Natural predators"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 2,
    title: "Marine Species Identification",
    category: "species-identification",
    questions: [
      {
        question: "Which of these is NOT a common reef fish family?",
        options: ["Butterflyfish", "Parrotfish", "Salmonidae", "Wrasses"],
        correctAnswer: 2
      },
      {
        question: "What is the primary distinguishing feature of parrotfish?",
        options: [
          "Bright red coloration",
          "Fused teeth that form a beak-like structure",
          "Long, flowing fins",
          "Ability to change color rapidly"
        ],
        correctAnswer: 1
      },
      {
        question: "Which of these species is known for a symbiotic relationship with sea anemones?",
        options: [
          "Clownfish",
          "Manta ray",
          "Moray eel",
          "Triggerfish"
        ],
        correctAnswer: 0
      }
    ]
  }
];

export default function QuizPage() {
  const [match, params] = useRoute<{ id: string }>("/learn/quiz/:id");
  const quizId = parseInt(params?.id || "1");
  
  // Find the current quiz
  const currentQuiz = quizzes.find(quiz => quiz.id === quizId) || quizzes[0];

  return (
    <div className="container py-6 mx-auto max-w-3xl">
      <div className="mb-6 flex items-center">
        <Button variant="outline" className="flex items-center" asChild>
          <a href="/learn">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Learn
          </a>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="bg-[#05BFDB] text-white p-6">
            <h1 className="text-2xl font-bold">{currentQuiz.title} Quiz</h1>
            <p className="mt-2 text-white/80">
              Test your knowledge about {currentQuiz.title.toLowerCase()} with these {currentQuiz.questions.length} questions
            </p>
          </div>
          
          <QuizRunner quiz={currentQuiz} />
        </CardContent>
      </Card>
    </div>
  );
}