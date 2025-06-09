import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import LessonCard from "@/components/lessons/LessonCard";
import LessonViewer from "@/components/lessons/LessonViewer";
import { lessons, getLessonById, type Lesson } from "@/data/lessons";

import { Compass, BookOpen, Fish, Award, Waves, GraduationCap } from "lucide-react";

const categories = [
  { id: "ocean-literacy", name: "Ocean Literacy", icon: <Compass className="h-5 w-5" /> },
  { id: "regional-oceanography", name: "Regional Oceanography", icon: <Waves className="h-5 w-5" /> },
  { id: "reef-ecology", name: "Reef Ecology", icon: <BookOpen className="h-5 w-5" /> },
  { id: "species-identification", name: "Species ID", icon: <Fish className="h-5 w-5" /> },
];

const LearnPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const filteredLessons = selectedCategory === "all" 
    ? lessons 
    : lessons.filter(lesson => lesson.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory);

  const handleStartLesson = (lessonId: string) => {
    const lesson = getLessonById(lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
    }
  };

  const handleCloseLesson = () => {
    setCurrentLesson(null);
  };

  const handleCompleteLesson = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    setCurrentLesson(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-[#05BFDB]" />
            <h1 className="text-4xl font-bold text-[#0A4D68]">Ocean Learning Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dive into interactive lessons about ocean currents, marine ecosystems, and underwater exploration. 
            Learn through engaging content designed for ocean enthusiasts of all levels.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 max-w-4xl mx-auto bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              All Lessons
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onStartLesson={handleStartLesson}
                />
              ))}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onStartLesson={handleStartLesson}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Progress Overview */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#0A4D68]">Your Learning Progress</h3>
            <Badge className="bg-[#05BFDB] text-white">
              {completedLessons.size} / {lessons.length} Completed
            </Badge>
          </div>
          <Progress 
            value={(completedLessons.size / lessons.length) * 100} 
            className="h-3"
          />
          <p className="text-sm text-gray-600 mt-2">
            Complete lessons to earn badges and unlock advanced content!
          </p>
        </div>

        {/* Featured Learning Paths */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-[#0A4D68] mb-6 text-center">Featured Learning Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100 border-none">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Compass className="h-6 w-6 text-[#05BFDB]" />
                  <CardTitle className="text-[#0A4D68]">Ocean Fundamentals</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Master the basics of ocean science, currents, and marine ecosystems.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-none">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Fish className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-[#0A4D68]">Marine Life Explorer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Learn to identify species and understand marine biodiversity.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-none">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-[#0A4D68]">Citizen Scientist</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Contribute to real ocean research and conservation efforts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Lesson Viewer Modal */}
      {currentLesson && (
        <LessonViewer
          lesson={currentLesson}
          onClose={handleCloseLesson}
          onComplete={handleCompleteLesson}
        />
      )}
    </div>
  );
};

export default LearnPage;