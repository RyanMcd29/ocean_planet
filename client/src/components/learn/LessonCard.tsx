import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";

type LessonContent = {
  type: "text" | "image" | "funFact";
  data: string;
  caption?: string;
};

export interface Lesson {
  id: number;
  title: string;
  category: string;
  duration: number;
  thumbnail: string;
  description: string;
  completed: boolean;
  content: LessonContent[];
}

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={lesson.thumbnail}
          alt={lesson.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        {lesson.completed && (
          <div className="absolute right-2 top-2 rounded-full bg-green-500 p-1">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-[#E0F7FA] text-[#0A4D68]">
            {lesson.category === "ocean-literacy" && "Ocean Literacy"}
            {lesson.category === "reef-ecology" && "Reef Ecology"}
            {lesson.category === "species-identification" && "Species ID"}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            {lesson.duration} min
          </div>
        </div>
        <CardTitle className="mt-2 text-lg">{lesson.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{lesson.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-[#05BFDB] hover:bg-[#088395]">
          {lesson.completed ? "Review Lesson" : "Start Lesson"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function LessonViewer({ lesson }: LessonCardProps) {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-[#E0F7FA] text-[#0A4D68]">
            {lesson.category === "ocean-literacy" && "Ocean Literacy"}
            {lesson.category === "reef-ecology" && "Reef Ecology"}
            {lesson.category === "species-identification" && "Species ID"}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            {lesson.duration} min
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {lesson.content.map((item, index) => {
          if (item.type === "text") {
            return (
              <p key={index} className="text-gray-700 leading-relaxed">
                {item.data}
              </p>
            );
          } else if (item.type === "image") {
            return (
              <div key={index} className="rounded-lg overflow-hidden">
                <img src={item.data} alt={item.caption || ""} className="w-full h-auto" />
                {item.caption && (
                  <p className="text-sm text-gray-500 italic mt-1 text-center">{item.caption}</p>
                )}
              </div>
            );
          } else if (item.type === "funFact") {
            return (
              <div key={index} className="bg-[#E0F7FA] p-4 rounded-lg border border-[#05BFDB]">
                <h4 className="font-bold text-[#0A4D68] mb-1">Fun Fact</h4>
                <p className="text-[#088395]">{item.data}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}