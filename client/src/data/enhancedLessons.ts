export interface EnhancedLessonStep {
  type: 'intro' | 'text' | 'image' | 'funFact' | 'quiz' | 'conclusion';
  title: string;
  content: string;
  image?: string;
  caption?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  highlight?: string;
  icon?: string;
}

export interface EnhancedLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  steps: EnhancedLessonStep[];
}

export const bottomTrawlingLesson: EnhancedLesson = {
  id: "bottom-trawling-enhanced",
  title: "The Hidden Cost of Bottom Trawling",
  description: "Discover how this common fishing method is reshaping our ocean floors and climate",
  category: "conservation",
  duration: 6,
  difficulty: "Beginner",
  thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  steps: [
    {
      type: "intro",
      title: "Welcome, Ocean Explorer!",
      content: "You're about to uncover one of the ocean's biggest secrets. Did you know that there's a fishing method releasing more CO₂ than all the planes in the sky? Let's dive deep into the hidden world of bottom trawling and discover why it matters to you and our planet."
    },
    {
      type: "text",
      title: "What Exactly is Bottom Trawling?",
      content: "Picture this: imagine dragging a massive net across your local park, scooping up everything in its path. That's essentially what bottom trawling does to the ocean floor.\n\nFishing boats pull enormous nets weighted with heavy metal doors and chains across the seabed. These nets can be as wide as a football field! They're incredibly effective at catching fish like cod, prawns, and flounder, but here's the catch (pun intended) - they don't just take the fish.",
      highlight: "Bottom trawling nets can stretch up to 100 meters wide - that's longer than a soccer field!"
    },
    {
      type: "image",
      title: "See the Impact in Action",
      content: "Before and after photos reveal the stark transformation of seafloor communities.",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "The seafloor before and after bottom trawling - notice the flattened, barren landscape"
    },
    {
      type: "text",
      title: "What Gets Destroyed in the Process?",
      content: "Think of the ocean floor as an underwater rainforest. When trawling nets scrape across it, they're bulldozing through:\n\n🪸 **Ancient cold-water corals** - Some are over 1,000 years old! These aren't the colorful tropical corals you might know, but deep-sea architects that build massive reef structures.\n\n🌱 **Seagrass meadows** - The ocean's nurseries where baby fish grow up safely\n\n🧽 **Sponge gardens** - These aren't kitchen sponges! They're complex animals that filter water and provide homes for countless creatures\n\n🌊 **Kelp forests** - Underwater jungles that sway with the currents\n\nHere's what's heartbreaking: many of these habitats take **decades or even centuries** to recover. It's like clear-cutting a forest that won't regrow in your lifetime.",
      highlight: "A single trawling pass can destroy coral reefs that took 100+ years to grow"
    },
    {
      type: "funFact",
      title: "The Climate Bomb You Never Knew Existed",
      content: "Here's a shocking fact that might change how you think about climate change: bottom trawling releases approximately **1 billion tonnes of CO₂ every year**. To put that in perspective, that's MORE than the entire global aviation industry!\n\nFor centuries, the ocean floor has been storing carbon in its sediments - like a massive underground bank vault. When trawling nets disturb these sediments, they're essentially breaking open the vault and releasing stored carbon back into the water and atmosphere. This contributes to both climate change and ocean acidification."
    },
    {
      type: "quiz",
      title: "Test Your Climate Knowledge",
      content: "Bottom trawling releases more CO₂ each year than which major industry?",
      options: [
        "All cars on Earth combined",
        "The global aviation industry",
        "All forest fires worldwide", 
        "The entire shipping industry"
      ],
      correctAnswer: 1,
      explanation: "Surprisingly, bottom trawling releases about 1 billion tonnes of CO₂ annually, which exceeds the emissions from all commercial flights worldwide. This makes it a significant but often overlooked contributor to climate change."
    },
    {
      type: "text",
      title: "The Bycatch Crisis: Unintended Victims",
      content: "Imagine you're trying to catch specific fish, but your method also accidentally captures and kills:\n\n🐢 **Sea turtles** - Coming up for air but getting trapped in nets\n🐬 **Dolphins and whales** - Unable to escape once caught\n🦈 **Sharks** - Including endangered species already struggling to survive\n🐟 **Baby fish** - The next generation that won't get to reproduce\n\nThis unintended catch is called 'bycatch,' and it's often thrown back into the ocean - but it's usually too late. These animals are already dead or dying.\n\nYou might wonder: 'Can't fishers be more careful?' The truth is, trawling nets are designed to catch everything in their path. They can't distinguish between a valuable fish and an endangered turtle.",
      highlight: "Up to 40% of global catch is bycatch - that's millions of tons of wasted marine life annually"
    },
    {
      type: "quiz",
      title: "Understanding the Problem",
      content: "What does bottom trawling often result in?",
      options: [
        "Cleaner, healthier oceans",
        "Faster coral reef growth",
        "High levels of bycatch and habitat destruction",
        "More selective, sustainable fishing"
      ],
      correctAnswer: 2,
      explanation: "Bottom trawling is inherently non-selective, meaning it catches everything in its path. This results in massive bycatch (unintended catch) and destroys the three-dimensional habitat structure of the seafloor that many species depend on."
    },
    {
      type: "text",
      title: "Hope on the Horizon: Solutions That Work",
      content: "Here's the good news - we're not powerless! There are proven alternatives and actions making a real difference:\n\n🎣 **Smarter fishing methods**: Pots, traps, and pole-and-line fishing target specific species without destroying habitats\n\n🏝️ **Marine Protected Areas (MPAs)**: Ocean sanctuaries where trawling is banned, allowing ecosystems to recover\n\n🐟 **Sustainable seafood choices**: When you shop, look for certifications like MSC (Marine Stewardship Council) or ask your fishmonger about fishing methods\n\n📢 **Your voice matters**: Supporting policies that protect ocean habitats\n\nSome countries have already banned bottom trawling in sensitive areas, and fish populations are bouncing back faster than scientists expected!",
      highlight: "When New Zealand banned trawling in some areas, fish populations increased by 40% within just 5 years"
    },
    {
      type: "quiz",
      title: "Your Ocean Action Plan",
      content: "Why is bottom trawling considered harmful to ocean ecosystems?",
      options: [
        "It only catches large, valuable fish",
        "It releases stored CO₂ and destroys ancient seafloor habitats",
        "It helps marine biodiversity flourish",
        "It increases fish reproduction rates"
      ],
      correctAnswer: 1,
      explanation: "Bottom trawling is harmful because it disturbs carbon-rich sediments (releasing CO₂) and destroys complex seafloor habitats that took decades or centuries to develop. These habitats are crucial nursery areas and feeding grounds for marine life."
    },
    {
      type: "conclusion",
      title: "You're Now an Ocean Advocate!",
      content: "Congratulations! You've just learned about one of the ocean's most pressing but hidden challenges. You now understand how bottom trawling affects climate change, destroys ancient habitats, and impacts marine life.\n\nBut knowledge is just the beginning. Every time you choose sustainable seafood, support marine protected areas, or share what you've learned, you're part of the solution. The ocean needs advocates like you!\n\nRemember: small actions by millions of people create waves of change. What will your first ocean-friendly action be?"
    }
  ]
};

export const coralReefsLesson: EnhancedLesson = {
  id: "coral-reefs-enhanced",
  title: "Coral Reefs: The Ocean's Rainforests",
  description: "Explore the incredible biodiversity and importance of coral reef ecosystems",
  category: "reef-ecology",
  duration: 8,
  difficulty: "Beginner",
  thumbnail: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  steps: [
    {
      type: "intro",
      title: "Welcome to the Ocean's Most Colorful Cities!",
      content: "Did you know that coral reefs support 25% of all marine life while covering less than 1% of the ocean? You're about to discover why these underwater cities are among Earth's most important and beautiful ecosystems."
    },
    {
      type: "text",
      title: "What Makes Coral Reefs So Special?",
      content: "Imagine a bustling city where every building is alive, growing, and constantly changing. That's a coral reef! But here's what might surprise you:\n\n**Corals are animals, not plants!** Each reef is built by millions of tiny animals called polyps, no bigger than a pinhead. These little architects secrete limestone to build their homes, creating the massive structures we see.\n\nBut they don't work alone...",
      highlight: "A single coral colony can contain millions of individual polyps working together!"
    },
    {
      type: "image",
      title: "Meet the Reef Builders",
      content: "Take a closer look at the tiny engineers behind these massive structures.",
      image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "Coral polyps extended for feeding - each tiny circle is an individual animal"
    },
    {
      type: "funFact",
      title: "The Ultimate Partnership",
      content: "Here's one of nature's most amazing partnerships: coral polyps have made a deal with microscopic algae called zooxanthellae. The algae live inside the coral tissue like tiny solar panels, converting sunlight into food. In return, the coral provides them with a safe home and nutrients.\n\nThis partnership is so successful that the algae provide up to **90% of the coral's energy**! It's like having a built-in restaurant that never closes."
    },
    {
      type: "text",
      title: "Three Types of Reef Cities",
      content: "Just like human cities come in different forms, coral reefs have three main types:\n\n🏖️ **Fringing Reefs**: These grow directly along coastlines, like waterfront neighborhoods. They're perfect for snorkeling!\n\n🌊 **Barrier Reefs**: These run parallel to coasts but are separated by deeper lagoons. The Great Barrier Reef is the most famous example.\n\n🏝️ **Atolls**: These form rings around where volcanic islands used to be. Picture a coral doughnut in the middle of the ocean!\n\nEach type creates different habitats and supports different communities of marine life.",
      highlight: "The Great Barrier Reef stretches 2,300 kilometers - that's like driving from New York to Miami!"
    },
    {
      type: "quiz",
      title: "Reef Knowledge Check",
      content: "What percentage of marine species do coral reefs support despite covering less than 1% of the ocean floor?",
      options: ["About 10%", "About 25%", "About 40%", "About 50%"],
      correctAnswer: 1,
      explanation: "Coral reefs support approximately 25% of all marine species despite covering less than 1% of the ocean floor. This incredible biodiversity density makes them one of the most productive ecosystems on Earth!"
    },
    {
      type: "text",
      title: "Why Reefs Matter to You",
      content: "You might think, 'I don't live near a reef, so why should I care?' Here's why reefs affect everyone:\n\n**For the Ocean:**\n🐠 Nursery grounds where baby fish grow up safely\n🍽️ Feeding stations for countless marine species\n🏠 Three-dimensional habitat creating millions of hiding spots\n\n**For Humans:**\n🌊 Natural barriers protecting coastlines from storms and erosion\n💰 Tourism supporting millions of jobs worldwide\n🎣 Fisheries feeding hundreds of millions of people\n💊 Medicine - many reef creatures produce compounds used in drugs\n\nReefs are worth an estimated $375 billion annually to the global economy!",
      highlight: "One square kilometer of coral reef can support up to 100,000 people through fishing and tourism"
    },
    {
      type: "quiz",
      title: "Partnership Power",
      content: "What is the primary relationship between coral polyps and zooxanthellae algae?",
      options: [
        "The algae eat the coral polyps",
        "They compete for the same food sources",
        "They have a mutually beneficial partnership",
        "The coral hunts the algae for food"
      ],
      correctAnswer: 2,
      explanation: "Coral polyps and zooxanthellae have a mutually beneficial symbiotic relationship. The algae photosynthesize and provide up to 90% of the coral's energy, while the coral provides protection, nutrients, and a stable environment for the algae."
    },
    {
      type: "conclusion",
      title: "You're Now a Reef Guardian!",
      content: "Amazing! You've just explored one of Earth's most incredible ecosystems. You now understand how tiny animals and microscopic algae work together to build massive structures that support a quarter of all ocean life.\n\nCoral reefs face many challenges, but they're also incredibly resilient when given a chance. By understanding their importance and supporting reef conservation, you're helping protect these underwater rainforests for future generations.\n\nNext time you see a coral reef - whether in person, in photos, or in documentaries - you'll see it with new eyes, appreciating the incredible partnerships and biodiversity that make these ecosystems so special!"
    }
  ]
};