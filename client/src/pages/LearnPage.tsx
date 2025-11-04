import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LessonCard from "@/components/lessons/LessonCard";
import LessonViewer from "@/components/lessons/LessonViewer";
import InteractiveLessonViewer from "@/components/lessons/InteractiveLessonViewer";
import EnhancedLessonViewer from "@/components/lessons/EnhancedLessonViewer";
import { lessons, getLessonById, type Lesson } from "@/data/lessons";
import { westernRockLobsterLesson as originalWesternRockLobsterLesson } from "@/data/lessonContent";
import { bottomTrawlingLesson, coralReefsLesson, oceanCurrentsLesson, leeuwincurrentLesson, westernRockLobsterLesson as enhancedWesternRockLobsterLesson, reefFishLesson, oceanLiteracyPrinciple1Lesson, oceanLiteracyPrinciple2Lesson, oceanLiteracyPrinciple3Lesson, oceanLiteracyPrinciple4Lesson, oceanLiteracyPrinciple5Lesson, oceanLiteracyPrinciple6Lesson, oceanLiteracyPrinciple7Lesson, jettyBiodiversityLesson, southernRightWhaleMigrationLesson, southernRightWhaleClimateLesson, highSeasTreatyLesson, whaleScience101Lesson, trackingTechLesson, ecosystemGuardiansLesson, camillaWreckLesson, longJettyLesson, type EnhancedLesson } from "@/data/enhancedLessons";

import { Compass, BookOpen, Fish, Award, ChevronLeft, ChevronRight, Waves, Thermometer, MapPin, FileText, Anchor, Navigation, Atom, Sprout, Droplet, Dna, Moon, TreePine, Sparkles, Mountain, Zap } from "lucide-react";

const categories = [
  { id: "ocean-literacy", name: "Ocean Literacy", icon: "🌊", emoji: true },
  { id: "reef-ecology", name: "Reef Ecology", icon: <BookOpen className="h-5 w-5" /> },
  { id: "species-identification", name: "Species ID", icon: <Fish className="h-5 w-5" /> },
  { id: "conservation", name: "Conservation", icon: <Waves className="h-5 w-5" /> },
  { id: "marine-research", name: "Marine Research", icon: <Thermometer className="h-5 w-5" /> },
  { id: "maritime-history", name: "Maritime History", icon: "📜", emoji: true },
  { id: "marine-mammals", name: "Marine Mammals", icon: "🐋", emoji: true },
  { id: "human-ocean-interaction", name: "Human–Ocean Interaction", icon: "🧭", emoji: true },
  { id: "basic-oceanic-physics", name: "Basic Oceanic Physics", icon: "⚛️", emoji: true },
  { id: "diving-ethics", name: "Diving Ethics", icon: "🤿", emoji: true },
  { id: "biology-knowledge", name: "Biology Knowledge", icon: "🧬", emoji: true },
  { id: "deep-sea", name: "Deep Sea", icon: "🌌", emoji: true },
  { id: "estuarine-environments", name: "Estuarine Environments", icon: "🌾", emoji: true },
  { id: "cephalopods", name: "Cephalopods", icon: "🦑", emoji: true },
  { id: "marine-ecology", name: "Marine Ecology", icon: "🐠", emoji: true },
  { id: "marine-geology", name: "Marine Geology", icon: "🪨", emoji: true },
  { id: "ocean-energy", name: "Ocean Energy", icon: "⚡", emoji: true },
];

// Sample lessons data with integrated interactive lessons
const allLessons = [
  {
    id: 1,
    title: "Coral Reefs: The Ocean's Rainforests",
    category: "reef-ecology",
    duration: 8,
    thumbnail: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Explore the incredible biodiversity and importance of coral reef ecosystems",
    completed: false,
    difficulty: "Beginner" as const,
    isInteractive: true,
    isEnhanced: true,
    specialBadge: "🪸",
    enhancedLessonData: coralReefsLesson
  },
  {
    id: 2,
    title: "Understanding Ocean Currents",
    category: "ocean-literacy",
    duration: 7,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Explore how massive rivers of water shape our climate and marine life",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🌊",
    enhancedLessonData: oceanCurrentsLesson
  },
  {
    id: 3,
    title: "The Leeuwin Current",
    category: "ocean-literacy",
    duration: 6,
    thumbnail: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Discover Western Australia's unique warm-water current and its impact on marine life",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🌊",
    enhancedLessonData: leeuwincurrentLesson
  },
  {
    id: 4,
    title: "Meet the Western Rock Lobster",
    category: "species",
    duration: 8,
    thumbnail: "https://images.unsplash.com/photo-1559616573-7755a48a70f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Discover Western Australia's iconic marine species and their incredible life journey",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🦞",
    enhancedLessonData: enhancedWesternRockLobsterLesson
  },
  {
    id: 5,
    title: "Identifying Reef Fish",
    category: "species",
    duration: 7,
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Learn to recognize common reef fish and understand their important roles in marine ecosystems",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🐠",
    enhancedLessonData: reefFishLesson
  },
  {
    id: 6,
    title: "The Hidden Cost of Bottom Trawling",
    category: "conservation",
    duration: 6,
    thumbnail: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Discover how this common fishing method is reshaping our ocean floors and climate",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🌊",
    enhancedLessonData: bottomTrawlingLesson
  },
  {
    id: 7,
    title: "Ocean Literacy 1: Earth's One Big Ocean",
    category: "ocean-literacy",
    duration: 5,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Discover why Earth really has just one interconnected ocean and explore its amazing underwater landscapes",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🌍",
    enhancedLessonData: oceanLiteracyPrinciple1Lesson
  },
  {
    id: 8,
    title: "Ocean Literacy 2: Ocean Shapes Earth",
    category: "ocean-literacy",
    duration: 6,
    thumbnail: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Discover how ocean waves, currents, and marine life have sculpted our planet's landscape over millions of years",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🪨",
    enhancedLessonData: oceanLiteracyPrinciple2Lesson
  },
  {
    id: 9,
    title: "Ocean Literacy 3: Ocean Controls Weather",
    category: "ocean-literacy",
    duration: 6,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Discover how the ocean controls much of our planet's weather patterns and climate systems",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🌡️",
    enhancedLessonData: oceanLiteracyPrinciple3Lesson
  },
  {
    id: 10,
    title: "Ocean Literacy 4: Ocean Makes Earth Habitable",
    category: "ocean-literacy",
    duration: 6,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Explore how the ocean serves as Earth's life support system, making our planet livable",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🌍",
    enhancedLessonData: oceanLiteracyPrinciple4Lesson
  },
  {
    id: 11,
    title: "Ocean Literacy 5: Ocean Supports Life",
    category: "ocean-literacy",
    duration: 7,
    thumbnail: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Discover the incredible biodiversity of marine life and the interconnected ecosystems of the ocean",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🐚",
    enhancedLessonData: oceanLiteracyPrinciple5Lesson
  },
  {
    id: 12,
    title: "Ocean Literacy 6: Ocean and Humans Connected",
    category: "ocean-literacy",
    duration: 7,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Explore the deep connections between human society and ocean health, and our shared future",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🔁",
    enhancedLessonData: oceanLiteracyPrinciple6Lesson
  },
  {
    id: 13,
    title: "Ocean Literacy 7: Ocean is Largely Unexplored",
    category: "ocean-literacy",
    duration: 6,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Discover why most of our ocean remains a mystery and what new discoveries await",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🔍",
    enhancedLessonData: oceanLiteracyPrinciple7Lesson
  },
  {
    id: 14,
    title: "Biodiversity of Jetty Macro Ecosystems",
    category: "reef-ecology",
    duration: 5,
    thumbnail: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Why do jetty pylons attract so much marine life?",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🏗️",
    enhancedLessonData: jettyBiodiversityLesson
  },
  {
    id: 15,
    title: "Southern Right Whales: Migration Mysteries",
    category: "marine-mammals",
    duration: 6,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Inspired by real-world research from the Southern Ocean",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🐋",
    enhancedLessonData: southernRightWhaleMigrationLesson
  },
  {
    id: 16,
    title: "Southern Right Whales: Tracking Climate Change",
    category: "marine-mammals",
    duration: 8,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "How warming oceans affect whale migration patterns",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🌡️",
    enhancedLessonData: southernRightWhaleClimateLesson
  },
  {
    id: 17,
    title: "The Historic High Seas Treaty",
    category: "conservation",
    duration: 7,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Discover how the world finally agreed to protect the lawless waters beyond any country's borders",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🌍",
    enhancedLessonData: highSeasTreatyLesson
  },
  {
    id: 18,
    title: "Whale Science 101: Tracking Giants",
    category: "marine-mammals",
    duration: 8,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "How do scientists follow whales across oceans?",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "🐋",
    enhancedLessonData: whaleScience101Lesson
  },
  {
    id: 19,
    title: "Tracking Tech: Innovation in Whale Science",
    category: "marine-research",
    duration: 10,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "From satellites to drones – the cutting edge of marine research",
    completed: false,
    difficulty: "Intermediate" as const,
    isEnhanced: true,
    specialBadge: "🛰️",
    enhancedLessonData: trackingTechLesson
  },
  {
    id: 20,
    title: "Ecosystem Guardians: Managing Krill and Whales",
    category: "marine-research",
    duration: 12,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Why saving krill means saving the ocean",
    completed: false,
    difficulty: "Advanced" as const,
    isEnhanced: true,
    specialBadge: "🦐",
    enhancedLessonData: ecosystemGuardiansLesson
  },
  {
    id: 21,
    title: "Maritime History of the Camilla Wreck (WA)",
    category: "maritime-history",
    duration: 8,
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "An iron-hulled relic connecting Western Australia to the age of sail and trade",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "⚓",
    enhancedLessonData: camillaWreckLesson
  },
  {
    id: 22,
    title: "Maritime History of Fremantle's Long Jetty",
    category: "maritime-history",
    duration: 7,
    thumbnail: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Where Western Australia first met the world by sea",
    completed: false,
    difficulty: "Beginner" as const,
    isEnhanced: true,
    specialBadge: "⚓",
    enhancedLessonData: longJettyLesson
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
  const [currentEnhancedLesson, setCurrentEnhancedLesson] = useState<EnhancedLesson | null>(null);
  const [showInteractiveLesson, setShowInteractiveLesson] = useState(false);

  // Calculate completion stats
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(lesson => lesson.completed).length;
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);

  // Filter lessons by category
  const filteredLessons = allLessons.filter(lesson => 
    selectedCategory === "all" ? true : lesson.category === selectedCategory
  );

  // Auto-open lesson from query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lesson');
    
    if (lessonId) {
      const lesson = allLessons.find(l => l.enhancedLessonData?.id === lessonId);
      if (lesson) {
        handleLessonClick(lesson);
      }
    }
  }, []);

  const handleLessonClick = (lesson: any) => {
    if (lesson.isEnhanced && lesson.enhancedLessonData) {
      // Enhanced lessons with new template
      setCurrentEnhancedLesson(lesson.enhancedLessonData);
    } else if (lesson.isInteractive && lesson.id === 4) {
      // Western Rock Lobster interactive lesson
      setShowInteractiveLesson(true);
    } else if (lesson.isInteractive && lesson.lessonData) {
      // Other interactive lessons (coral reefs, reef fish, etc.)
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
    setCurrentEnhancedLesson(null);
    setShowInteractiveLesson(false);
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
            <CardContent>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>All Categories</span>
                    </div>
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.emoji ? (
                          <span className="text-base">{category.icon}</span>
                        ) : (
                          category.icon
                        )}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <>
              {filteredLessons.length > 0 ? (
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
              ) : (
                <Card className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-6xl">🚧</div>
                    <CardTitle className="text-2xl">Coming Soon!</CardTitle>
                    <CardDescription className="text-base max-w-md">
                      Lessons for this category are being developed. Check back soon for exciting new content about {categories.find(c => c.id === selectedCategory)?.name || 'this topic'}!
                    </CardDescription>
                  </div>
                </Card>
              )}
            </>
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

      {/* Enhanced Lesson Viewer */}
      {currentEnhancedLesson && (
        <EnhancedLessonViewer
          lesson={currentEnhancedLesson}
          onClose={handleCloseLesson}
        />
      )}

      {/* Western Rock Lobster Interactive Lesson */}
      {showInteractiveLesson && (
        <InteractiveLessonViewer
          lesson={originalWesternRockLobsterLesson}
          onClose={handleCloseLesson}
        />
      )}

    </div>
  );
}