export interface LessonStep {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'content' | 'quiz';
  quizData?: {
    question: string;
    options: { id: string; text: string; correct: boolean; feedback: string }[];
  };
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  imageUrl: string;
  steps: LessonStep[];
}

export const westernRockLobsterLesson: Lesson = {
  id: "western-rock-lobster",
  title: "Meet the Western Rock Lobster",
  subtitle: "Panulirus cygnus – A spiny icon of Western Australia's reefs",
  duration: "3 min",
  imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
  steps: [
    {
      id: "introduction",
      title: "Introduction",
      type: "content",
      content: `The Western Rock Lobster (Panulirus cygnus) is one of Australia's most iconic marine species. Found exclusively along the coast of Western Australia, this remarkable crustacean is instantly recognizable by its spiny shell and long antennae.

These lobsters inhabit the warm waters from Shark Bay in the north to Cape Leeuwin in the south, making their homes in the limestone reefs that characterize much of WA's coastline.

Unlike their clawed cousins found in colder waters, rock lobsters rely on their powerful spiny carapace for protection and their keen senses for hunting.`,
      imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop"
    },
    {
      id: "biology-habitat",
      title: "Biology & Habitat",
      type: "content",
      content: `Western Rock Lobsters are perfectly adapted to their reef environment. Their spiny exoskeleton provides excellent protection from predators, while their powerful tail allows for rapid escape when threatened.

**Key Features:**
• Spiny carapace with no front claws
• Long, sensitive antennae for navigation
• Five pairs of walking legs
• Powerful muscular tail (abdomen)

**Habitat Preferences:**
These nocturnal hunters prefer limestone reefs with plenty of crevices and caves. During the day, they hide in rocky shelters, emerging at night to forage for mollusks, crustaceans, and dead fish on sandy bottoms adjacent to reefs.`,
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"
    },
    {
      id: "lifecycle",
      title: "Lifecycle Journey",
      type: "content",
      content: `The Western Rock Lobster has one of the most extraordinary lifecycles in the marine world, involving an epic oceanic journey that can last nearly two years.

**Spawning (October-December):**
Female lobsters carry bright orange eggs under their tails for 4-5 months before releasing millions of tiny larvae into the water.

**Phyllosoma Stage (11-24 months):**
The transparent, leaf-like larvae drift thousands of kilometers in ocean currents, traveling as far as New Zealand before returning to WA waters.

**Settlement & Growth:**
Juveniles settle in shallow coastal waters and seagrass beds, gradually moving to deeper reefs as they mature. They reach legal fishing size (76mm carapace) at 5-7 years old.`,
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
    },
    {
      id: "ecological-economic",
      title: "Ecological & Economic Importance",
      type: "content",
      content: `Western Rock Lobsters play a crucial role in maintaining healthy reef ecosystems while supporting one of Australia's most valuable fisheries.

**Ecological Role:**
• Key predators controlling populations of sea urchins and mollusks
• Help maintain balance in reef communities
• Important prey for larger fish, rays, and octopuses

**Economic Significance:**
The Western Rock Lobster fishery is worth approximately $500 million annually, making it one of Australia's most valuable single-species fisheries. Almost 95% of the catch is exported, primarily to China and other Asian markets.

The industry supports thousands of jobs in fishing, processing, and transport across regional Western Australia.`,
      imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop"
    },
    {
      id: "conservation",
      title: "Conservation Success Story",
      type: "content",
      content: `The Western Rock Lobster fishery is internationally recognized as one of the world's best-managed fisheries, demonstrating how science-based management can ensure sustainability.

**Management Measures:**
• Strict quotas based on stock assessments
• Size limits (minimum 76mm carapace length)
• Seasonal closures during breeding
• Limited licensing system

**Conservation Highlights:**
• Marine Stewardship Council certified since 2000
• Stock levels maintained at sustainable levels
• Innovative tagging programs track population health

**Amazing Facts:**
🦞 Can live over 20 years and grow up to 5kg
🦞 Walk backwards when threatened
🦞 Molt their entire shell to grow larger
🦞 Navigate using magnetic fields and water chemistry`,
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"
    },
    {
      id: "quiz",
      title: "Test Your Knowledge",
      type: "quiz",
      content: "Let's see what you've learned about Western Rock Lobsters!",
      quizData: {
        question: "What makes the Western Rock Lobster's lifecycle unique?",
        options: [
          {
            id: "a",
            text: "They live in freshwater as juveniles",
            correct: false,
            feedback: "Not correct. Western Rock Lobsters spend their entire life in marine environments."
          },
          {
            id: "b",
            text: "Their larvae drift in ocean currents for up to 2 years",
            correct: true,
            feedback: "Correct! The phyllosoma larvae stage can last 11-24 months, drifting thousands of kilometers in ocean currents."
          },
          {
            id: "c",
            text: "They change gender as they grow",
            correct: false,
            feedback: "Incorrect. Western Rock Lobsters maintain the same gender throughout their lives."
          },
          {
            id: "d",
            text: "They only breed once in their lifetime",
            correct: false,
            feedback: "Wrong. Mature females breed annually during the spawning season from October to December."
          }
        ]
      }
    }
  ]
};