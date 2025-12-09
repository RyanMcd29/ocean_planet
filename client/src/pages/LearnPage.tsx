import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EnhancedLessonViewer from "@/components/lessons/EnhancedLessonViewer";
import { CircularProgress } from "@/components/lessons/CircularProgress";
import { BadgeShowcase, type Badge as BadgeData } from "@/components/lessons/BadgeShowcase";
import { type EnhancedLesson } from "@/data/enhancedLessons";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/lib/api";

import { BookOpen, Fish, Award, Waves, Thermometer, Check } from "lucide-react";

const categories = [
  { id: "ocean-literacy", name: "Ocean Literacy", icon: "🌊", emoji: true },
  { id: "reef-ecology", name: "Reef Ecology", icon: <BookOpen className="h-5 w-5" /> },
  { id: "species-identification", name: "Species ID", icon: <Fish className="h-5 w-5" /> },
  { id: "conservation", name: "Conservation", icon: <Waves className="h-5 w-5" /> },
  { id: "marine-research", name: "Marine Research", icon: <Thermometer className="h-5 w-5" /> },
  { id: "maritime-history", name: "Maritime History", icon: "📜", emoji: true },
  { id: "marine-mammals", name: "Marine Mammals", icon: "🐋", emoji: true },
  { id: "human-ocean-interaction", name: "Human–Ocean Interaction", icon: "🧭", emoji: true },
  { id: "oceanic-physics", name: "Oceanic Physics", icon: "⚛️", emoji: true },
  { id: "diving-ethics", name: "Diving Ethics", icon: "🤿", emoji: true },
  { id: "biology-knowledge", name: "Biology Knowledge", icon: "🧬", emoji: true },
  { id: "deep-sea", name: "Deep Sea", icon: "🌌", emoji: true },
  { id: "estuarine-environments", name: "Estuarine Environments", icon: "🌾", emoji: true },
  { id: "cephalopods", name: "Cephalopods", icon: "🦑", emoji: true },
  { id: "marine-ecology", name: "Marine Ecology", icon: "🐠", emoji: true },
  { id: "marine-geology", name: "Marine Geology", icon: "🪨", emoji: true },
  { id: "ocean-energy", name: "Ocean Energy", icon: "⚡", emoji: true },
  { id: "fisheries", name: "Fisheries", icon: <Fish className="h-5 w-5" /> },
];

const lessonThumbnailFallback = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

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
  const [currentEnhancedLesson, setCurrentEnhancedLesson] = useState<EnhancedLesson | null>(null);

  // Fetch lesson progress and badges from backend
  const { data: progressData, isLoading: progressLoading } = useQuery<{ lessonId: string; completedAt: string }[]>({
    queryKey: ['/api/progress'],
    retry: false,
    staleTime: 1000 * 60 * 5,
    select: (data: any) => data.progress || [],
  });

  const { data: badgesData, isLoading: badgesLoading } = useQuery<{
    category: string;
    badgeName: string;
    badgeIcon: string;
    unlockedAt: string;
  }[]>({
    queryKey: ['/api/badges'],
    retry: false,
    staleTime: 1000 * 60 * 5,
    select: (data: any) => data.badges || [],
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    staleTime: 1000 * 60 * 5,
    queryFn: fetchCourses,
  });

  const allLessons = useMemo(() => {
    if (!coursesData) return [];

    const lessons: Array<any> = [];

    coursesData.forEach((course: any) => {
      (course.lessons || []).forEach((lesson: any) => {
        lessons.push({
          ...lesson,
          thumbnail: lesson.thumbnail || lessonThumbnailFallback,
          duration: lesson.duration ?? 5,
          difficulty: lesson.difficulty || "Beginner",
          isEnhanced: true,
          enhancedLessonData: lesson as EnhancedLesson,
          courseId: course.id,
          courseSlug: course.slug,
          courseTitle: course.title,
        });
      });
    });

    return lessons;
  }, [coursesData]);

  // Map of category to badge info
  const categoryBadgeMap: Record<string, { badgeName: string; badgeIcon: string }> = {
    'ocean-literacy': { badgeName: 'Ocean Scholar', badgeIcon: '🌊' },
    'reef-ecology': { badgeName: 'Reef Master', badgeIcon: '📘' },
    'species-identification': { badgeName: 'Species Expert', badgeIcon: '🧬' },
    'conservation': { badgeName: 'Ocean Guardian', badgeIcon: '🌱' },
    'marine-research': { badgeName: 'Marine Researcher', badgeIcon: '🧪' },
    'maritime-history': { badgeName: 'History Keeper', badgeIcon: '📜' },
    'marine-mammals': { badgeName: 'Whale Expert', badgeIcon: '🐋' },
    'human-ocean-interaction': { badgeName: 'Ocean Advocate', badgeIcon: '🤝' },
    'oceanic-physics': { badgeName: 'Physics Master', badgeIcon: '⚛️' },
    'diving-ethics': { badgeName: 'Ethical Diver', badgeIcon: '🤿' },
    'biology-knowledge': { badgeName: 'Biology Expert', badgeIcon: '🧫' },
    'deep-sea': { badgeName: 'Deep Explorer', badgeIcon: '🌌' },
    'estuarine-environments': { badgeName: 'Estuary Expert', badgeIcon: '🌾' },
    'cephalopods': { badgeName: 'Cephalopod Master', badgeIcon: '🐙' },
    'marine-ecology': { badgeName: 'Ecology Expert', badgeIcon: '🪸' },
    'marine-geology': { badgeName: 'Geology Master', badgeIcon: '🪨' },
    'ocean-energy': { badgeName: 'Energy Expert', badgeIcon: '⚡' },
    'fisheries': { badgeName: 'Fisheries Expert', badgeIcon: '🎣' },
  };

  // Calculate completion stats from backend data
  const completedLessonIds = useMemo(() => new Set(progressData?.map(p => p.lessonId) || []), [progressData]);

  // Category-specific progress calculation
  const categoryProgress = useMemo(() => {
    if (selectedCategory === "all") {
      // Show overall progress
      const totalLessons = allLessons.length;
      const completedLessons = completedLessonIds.size;
      const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      return { totalLessons, completedLessons, completionPercentage };
    } else {
      // Show category-specific progress
      const categoryLessons = allLessons.filter(lesson => lesson.category === selectedCategory);
      const categoryLessonIds = categoryLessons
        .filter(lesson => lesson.enhancedLessonData?.id)
        .map(lesson => lesson.enhancedLessonData!.id);
      const completedInCategory = categoryLessonIds.filter(id => completedLessonIds.has(id)).length;
      const totalInCategory = categoryLessonIds.length;
      const completionPercentage = totalInCategory > 0 ? Math.round((completedInCategory / totalInCategory) * 100) : 0;
      return { totalLessons: totalInCategory, completedLessons: completedInCategory, completionPercentage };
    }
  }, [selectedCategory, completedLessonIds, allLessons]);

  // Calculate badge status for each category
  const badges = useMemo(() => {
    const categoryLessonsMap: Record<string, string[]> = {};

    // Group lessons by category
    allLessons.forEach(lesson => {
      if (lesson.enhancedLessonData?.id && lesson.category) {
        if (!categoryLessonsMap[lesson.category]) {
          categoryLessonsMap[lesson.category] = [];
        }
        categoryLessonsMap[lesson.category].push(lesson.enhancedLessonData.id);
      }
    });

    // Create badge objects
    const unlockedBadges = new Set(badgesData?.map(b => b.category) || []);
    const badgesList: BadgeData[] = [];

    Object.keys(categoryBadgeMap).forEach(category => {
      const categoryLessons = categoryLessonsMap[category] || [];
      const completedCount = categoryLessons.filter(id => completedLessonIds.has(id)).length;
      const totalCount = categoryLessons.length;
      const isUnlocked = unlockedBadges.has(category);

      const badgeInfo = categoryBadgeMap[category];
      const unlockedBadge = badgesData?.find(b => b.category === category);

      badgesList.push({
        category,
        badgeName: badgeInfo.badgeName,
        badgeIcon: badgeInfo.badgeIcon,
        isLocked: !isUnlocked,
        completedCount,
        totalCount,
        unlockedAt: unlockedBadge ? new Date(unlockedBadge.unlockedAt) : undefined,
      });
    });

    return badgesList;
  }, [allLessons, badgesData, completedLessonIds]);

  // Filter lessons by category
  const filteredLessons = allLessons.filter(lesson => 
    selectedCategory === "all" ? true : lesson.category === selectedCategory
  );

  // Auto-open lesson from query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lesson');

    if (lessonId && allLessons.length > 0) {
      const lesson = allLessons.find(
        (l) => l.enhancedLessonData?.id === lessonId || l.id === lessonId,
      );
      if (lesson) {
        handleLessonClick(lesson);
      }
    }
  }, [allLessons]);

  const handleLessonClick = (lesson: any) => {
    const content = lesson.enhancedLessonData || lesson;
    setCurrentEnhancedLesson(content);
  };

  const handleCloseLesson = () => {
    setCurrentEnhancedLesson(null);
  };

  return (
    <div className="container py-8 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              {progressLoading || coursesLoading ? (
                <div className="text-center text-muted-foreground">Loading...</div>
              ) : (
                <CircularProgress
                  progress={categoryProgress.completionPercentage}
                  completedCount={categoryProgress.completedLessons}
                  totalCount={categoryProgress.totalLessons}
                />
              )}
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
              {coursesLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading lessons...</div>
              ) : filteredLessons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLessons.map((lesson) => {
                    const isCompleted = lesson.enhancedLessonData?.id 
                      ? completedLessonIds.has(lesson.enhancedLessonData.id) 
                      : lesson.completed;

                    return (
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
                        {isCompleted && (
                          <div className="absolute top-2 left-2 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full p-1.5 shadow-lg">
                            <Check className="h-4 w-4" data-testid={`completed-${lesson.id}`} />
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
                          {isCompleted ? "Review" : "Start Lesson"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                  })}
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
            <>
              {badgesLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading badges...</div>
              ) : (
                <BadgeShowcase badges={badges} className="mb-8" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Enhanced Lesson Viewer */}
      {currentEnhancedLesson && (
        <EnhancedLessonViewer
          lesson={currentEnhancedLesson}
          onClose={handleCloseLesson}
        />
      )}

    </div>
  );
}
