import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import LessonCard from "@/components/lessons/LessonCard";
import LessonViewer from "@/components/lessons/LessonViewer";
import InteractiveLessonViewer from "@/components/lessons/InteractiveLessonViewer";
import { lessons, getLessonById, type Lesson } from "@/data/lessons";
import { westernRockLobsterLesson } from "@/data/lessonContent";

import { Compass, BookOpen, Fish, Award, ChevronLeft, ChevronRight, Waves, Thermometer, MapPin } from "lucide-react";

const categories = [
  { id: "ocean-literacy", name: "Ocean Literacy", icon: <Compass className="h-5 w-5" /> },
  { id: "reef-ecology", name: "Reef Ecology", icon: <BookOpen className="h-5 w-5" /> },
  { id: "species-identification", name: "Species ID", icon: <Fish className="h-5 w-5" /> },
];

// Sample lessons data with integrated interactive lessons
const allLessons = [
  {
    id: 1,
    title: "Introduction to Coral Reefs",
    category: "reef-ecology",
    duration: 5,
    thumbnail: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Learn about the formation and importance of coral reefs in marine ecosystems.",
    completed: false,
    difficulty: "Beginner" as const,
    content: [
      {
        type: "text",
        data: "Coral reefs are underwater ecosystems characterized by reef-building corals. Reefs are formed of colonies of coral polyps held together by calcium carbonate. Most coral reefs are built from stony corals, whose polyps cluster in groups."
      },
      {
        type: "image", 
        data: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        caption: "Vibrant coral reef with diverse marine life"
      }
    ]
  },
  {
    id: 2,
    title: "Understanding Ocean Currents",
    category: "ocean-literacy",
    duration: 5,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=entropy&auto=format",
    description: "Discover how ocean currents form, move around our planet, and influence climate, marine life, and human activities.",
    completed: false,
    difficulty: "Beginner" as const,
    isInteractive: true,
    lessonData: lessons.find(l => l.id === 'ocean-currents')
  },
  {
    id: 3,
    title: "The Leeuwin Current",
    category: "ocean-literacy",
    duration: 4,
    thumbnail: "https://images.unsplash.com/photo-1582845512887-58e3c7936d86?w=800&h=600&fit=crop&crop=entropy&auto=format",
    description: "Explore the Leeuwin Current, Western Australia's distinctive warm-water current that flows southward against prevailing winds.",
    completed: false,
    difficulty: "Intermediate" as const,
    isInteractive: true,
    lessonData: lessons.find(l => l.id === 'leeuwin-current')
  },
  {
    id: 4,
    title: "Meet the Western Rock Lobster",
    category: "species-identification",
    duration: 3,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    description: "Panulirus cygnus – A spiny icon of Western Australia's reefs",
    completed: false,
    difficulty: "Beginner" as const,
    isInteractive: true,
    specialBadge: "🦞"
  },
  {
    id: 5,
    title: "Identifying Reef Fish",
    category: "species-identification",
    duration: 4,
    thumbnail: "https://images.unsplash.com/photo-1545759332-b3a0e9a1c59b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Learn to identify common reef fish families and species during your dives.",
    completed: true,
    difficulty: "Intermediate" as const,
    content: [
      {
        type: "text",
        data: "Being able to identify fish enhances your diving experience and contributes to citizen science. Fish identification starts with recognizing key features: body shape, size, coloration patterns, fin shape and placement."
      }
    ]
  }
];

// Sample badges data
const badges = [
  {
    id: 1,
    name: "Coral Expert",
    description: "Complete all reef ecology lessons",
    icon: <Award className="h-6 w-6 text-yellow-500" />,
    earned: false
  },
  {
    id: 2,
    name: "Quiz Master", 
    description: "Score 100% on 5 different quizzes",
    icon: <Award className="h-6 w-6 text-blue-500" />,
    earned: false
  },
  {
    id: 3,
    name: "Species Identifier",
    description: "Complete all species ID lessons",
    icon: <Award className="h-6 w-6 text-green-500" />,
    earned: false
  },
  {
    id: 4,
    name: "Ocean Scholar",
    description: "Complete all ocean literacy lessons",
    icon: <Award className="h-6 w-6 text-purple-500" />,
    earned: false
  },
  {
    id: 5,
    name: "Dive Student",
    description: "Complete your first lesson",
    icon: <Award className="h-6 w-6 text-teal-500" />,
    earned: true
  }
];

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"lessons" | "quizzes" | "badges">("lessons");
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showInteractiveLesson, setShowInteractiveLesson] = useState(false);
  
  // Calculate completion stats
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(lesson => lesson.completed).length;
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);
  
  // Filter lessons by category
  const filteredLessons = allLessons.filter(lesson => 
    selectedCategory === "all" ? true : lesson.category === selectedCategory
  );

  const handleLessonClick = (lesson: any) => {
    if (lesson.isInteractive && lesson.id === 4) {
      // Western Rock Lobster interactive lesson
      setShowInteractiveLesson(true);
    } else if (lesson.isInteractive && lesson.lessonData) {
      setCurrentLesson(lesson.lessonData);
    } else {
      // For non-interactive lessons, create a simple lesson structure
      const simpleLesson = {
        id: lesson.id.toString(),
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        duration: lesson.duration,
        thumbnail: lesson.thumbnail,
        difficulty: lesson.difficulty,
        steps: [
          {
            type: 'text' as const,
            title: lesson.title,
            content: lesson.content?.[0]?.data || lesson.description
          }
        ]
      };
      setCurrentLesson(simpleLesson);
    }
  };

  const handleCloseLesson = () => {
    setCurrentLesson(null);
  };

  const handleCompleteLesson = (lessonId: string) => {
    setCurrentLesson(null);
  };

  return (
    <div className="container py-8 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Progress</CardTitle>
              <CardDescription>
                {completedLessons} of {totalLessons} lessons completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={completionPercentage} className="mb-2" />
              <p className="text-sm text-muted-foreground">{completionPercentage}% complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory("all")}
              >
                <Award className="h-4 w-4 mr-2" />
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={viewMode === "lessons" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setViewMode("lessons")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Lessons
              </Button>
              <Button
                variant={viewMode === "badges" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setViewMode("badges")}
              >
                <Award className="h-4 w-4 mr-2" />
                Badges
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Ocean Learning Center</h1>
            <p className="text-muted-foreground">
              Explore interactive lessons about marine ecosystems, diving techniques, and ocean conservation.
            </p>
          </div>

          {viewMode === "lessons" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={lesson.thumbnail} 
                      alt={lesson.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                      <span>{lesson.duration} min</span>
                    </div>
                    {lesson.completed && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                        <Award className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {lesson.difficulty}
                      </Badge>
                      {lesson.isInteractive && (
                        <Badge className="bg-[#05BFDB] text-white text-xs">
                          Interactive
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{lesson.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {lesson.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#05BFDB] to-[#088395] hover:from-[#088395] hover:to-[#0A4D68]"
                      onClick={() => handleLessonClick(lesson)}
                    >
                      {lesson.completed ? "Review" : "Start Lesson"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {viewMode === "badges" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <Card key={badge.id} className={`${badge.earned ? 'border-yellow-200 bg-yellow-50' : 'opacity-60'}`}>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-2">
                      {badge.icon}
                    </div>
                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="justify-center">
                    {badge.earned ? (
                      <Badge className="bg-yellow-500">Earned!</Badge>
                    ) : (
                      <Badge variant="outline">Locked</Badge>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Lesson Viewer Modal */}
      {currentLesson && (
        <LessonViewer
          lesson={currentLesson}
          onClose={handleCloseLesson}
          onComplete={handleCompleteLesson}
        />
      )}
    </div>
  );
}