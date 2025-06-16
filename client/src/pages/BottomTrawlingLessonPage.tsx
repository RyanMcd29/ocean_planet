import React from "react";
import MicroLesson from "@/components/lessons/MicroLesson";

const BottomTrawlingLessonPage: React.FC = () => {
  const lessonData = {
    title: "The Hidden Cost of Bottom Trawling",
    emoji: "🌊",
    sections: [
      {
        title: "What is Bottom Trawling?",
        emoji: "🐟",
        content: (
          <p>
            Bottom trawling is a fishing method where heavy nets are dragged along the seafloor to scoop up fish like cod, prawns, and flounder. It's highly efficient — but devastating to the ocean floor.
          </p>
        )
      },
      {
        title: "Why Is It a Problem?",
        emoji: "⚠️",
        content: (
          <p>
            These nets don't just catch fish — they tear up delicate habitats like cold-water corals, seagrass meadows, and sponge forests. These ecosystems can take decades or even centuries to recover.
          </p>
        )
      },
      {
        title: "Climate Impact: CO₂ from the Seafloor",
        emoji: "🌍",
        content: (
          <p>
            Bottom trawling releases around <strong>1 billion tonnes of CO₂ every year</strong> — more than the entire global aviation industry. This carbon, once stored in seabed sediments, may re-enter the ocean and atmosphere, contributing to <strong>climate change</strong> and <strong>ocean acidification</strong>.
          </p>
        )
      },
      {
        title: "Bycatch: The Unseen Victims",
        emoji: "💔",
        content: (
          <p>
            Trawling nets often kill non-target species like turtles, dolphins, sharks, and juvenile fish. This "bycatch" is usually discarded, harming biodiversity.
          </p>
        )
      },
      {
        title: "What Can Be Done?",
        emoji: "🌱",
        content: (
          <ul className="space-y-2 list-disc list-inside">
            <li>Use sustainable fishing methods (like traps or pole-and-line)</li>
            <li>Support Marine Protected Areas that ban trawling</li>
            <li>Buy seafood from sustainable sources</li>
          </ul>
        )
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Why is bottom trawling harmful?",
        options: [
          { id: "a", text: "It only targets large fish", isCorrect: false },
          { id: "b", text: "It releases CO₂ and destroys seabed habitats", isCorrect: true },
          { id: "c", text: "It improves biodiversity", isCorrect: false },
          { id: "d", text: "It increases fish reproduction", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "What does bottom trawling often result in?",
        options: [
          { id: "a", text: "Cleaner oceans", isCorrect: false },
          { id: "b", text: "Faster coral growth", isCorrect: false },
          { id: "c", text: "High levels of bycatch and habitat loss", isCorrect: true },
          { id: "d", text: "Selective, eco-friendly fishing", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Bottom trawling releases more CO₂ each year than:",
        options: [
          { id: "a", text: "All cars on Earth", isCorrect: false },
          { id: "b", text: "The global aviation industry", isCorrect: true },
          { id: "c", text: "Forest fires", isCorrect: false },
          { id: "d", text: "The fishing fleet combined", isCorrect: false }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <MicroLesson
        title={lessonData.title}
        emoji={lessonData.emoji}
        sections={lessonData.sections}
        quiz={lessonData.quiz}
      />
    </div>
  );
};

export default BottomTrawlingLessonPage;