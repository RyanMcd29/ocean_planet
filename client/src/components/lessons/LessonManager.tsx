import React, { useState } from "react";
import LessonCard from "./LessonCard";
import InteractiveLessonViewer from "./InteractiveLessonViewer";
import { westernRockLobsterLesson } from "@/data/lessonContent";

const LessonManager: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const lessons = [westernRockLobsterLesson];
  const activeLesson = lessons.find(lesson => lesson.id === activeLessonId);

  const handleStartLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };

  const handleCloseLesson = () => {
    setActiveLessonId(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            title={lesson.title}
            subtitle={lesson.subtitle}
            duration={lesson.duration}
            imageUrl={lesson.imageUrl}
            onStart={() => handleStartLesson(lesson.id)}
          />
        ))}
      </div>

      {activeLesson && (
        <InteractiveLessonViewer
          lesson={activeLesson}
          onClose={handleCloseLesson}
        />
      )}
    </>
  );
};

export default LessonManager;