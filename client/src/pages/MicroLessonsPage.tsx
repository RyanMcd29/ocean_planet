import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Target } from "lucide-react";
import { Link } from "wouter";

interface LessonCard {
  id: string;
  title: string;
  emoji: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  topics: string[];
  url: string;
}

const MicroLessonsPage: React.FC = () => {
  const lessons: LessonCard[] = [
    {
      id: "bottom-trawling",
      title: "The Hidden Cost of Bottom Trawling",
      emoji: "🌊",
      description: "Learn about the environmental impact of bottom trawling, including CO₂ emissions, habitat destruction, and bycatch issues.",
      duration: "5 min",
      difficulty: "Beginner",
      topics: ["Fishing", "Climate Change", "Marine Habitats"],
      url: "/lessons/bottom-trawling"
    }
    // Add more lessons here as you create them
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#088395] to-[#05BFDB] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
              📚 Ocean Conservation Micro-Lessons
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Quick, interactive lessons about marine conservation topics. Learn about the challenges facing our oceans and what you can do to help.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="h-full shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{lesson.emoji}</span>
                  <Badge className={getDifficultyColor(lesson.difficulty)}>
                    {lesson.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-[#0A4D68] leading-tight">
                  {lesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-600 mb-4 flex-1">
                  {lesson.description}
                </p>
                
                <div className="space-y-3">
                  {/* Duration */}
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{lesson.duration} read</span>
                  </div>
                  
                  {/* Topics */}
                  <div className="flex flex-wrap gap-1">
                    {lesson.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Link href={lesson.url}>
                  <Button className="w-full mt-4 bg-[#088395] hover:bg-[#0A4D68] text-white">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Lesson
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          
          {/* Coming Soon Card */}
          <Card className="h-full shadow-md border-dashed border-2 border-gray-300">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">🔜</span>
              </div>
              <CardTitle className="text-xl text-gray-500">
                More Lessons Coming Soon!
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center items-center text-center">
              <Target className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-500 mb-4">
                We're working on more interactive lessons about ocean conservation, marine life, and sustainable practices.
              </p>
              <p className="text-sm text-gray-400">
                Have a topic suggestion? Let us know!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How to Use Section */}
        <div className="mt-12">
          <Card className="border-l-4 border-[#05BFDB] bg-blue-50">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-[#0A4D68] mb-3">
                How to Use These Lessons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-lg">📖</span>
                  <div>
                    <p className="font-medium text-[#088395]">Read & Learn</p>
                    <p className="text-gray-600">Each lesson covers key concepts in an easy-to-understand format</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-lg">🧠</span>
                  <div>
                    <p className="font-medium text-[#088395]">Take the Quiz</p>
                    <p className="text-gray-600">Test your knowledge with interactive multiple-choice questions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-lg">🌊</span>
                  <div>
                    <p className="font-medium text-[#088395]">Apply Learning</p>
                    <p className="text-gray-600">Use your new knowledge to make more informed decisions about ocean conservation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MicroLessonsPage;