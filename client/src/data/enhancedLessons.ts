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
  steps: EnhancedLessonStep[];
}

export const bottomTrawlingLesson: EnhancedLesson = {
  id: "bottom-trawling-enhanced",
  title: "The Hidden Cost of Bottom Trawling",
  description: "Discover how this common fishing method is reshaping our ocean floors and climate",
  category: "conservation",
  duration: 6,
  difficulty: "Beginner",
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

export const oceanCurrentsLesson: EnhancedLesson = {
  id: "ocean-currents-enhanced",
  title: "Understanding Ocean Currents",
  description: "Explore how massive rivers of water shape our climate and marine life",
  category: "ocean-literacy",
  duration: 7,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "Welcome to the Ocean's Highway System!",
      content: "Imagine invisible rivers flowing through our oceans, carrying heat around the planet and influencing weather patterns worldwide. You're about to discover how these powerful ocean currents work like a global conveyor belt, affecting everything from the fish you see while diving to the weather outside your window."
    },
    {
      type: "text",
      title: "What Are Ocean Currents?",
      content: "Ocean currents are like massive rivers within the sea, constantly moving water around our planet. Some flow at the surface, driven by winds, while others flow deep underwater, driven by differences in water temperature and saltiness.\n\nThese currents can be incredibly powerful - the Gulf Stream alone carries more water than all the world's rivers combined! They transport warm water from the tropics toward the poles and bring cold water back toward the equator.",
      highlight: "The Gulf Stream moves 30 times more water than the Amazon River!"
    },
    {
      type: "funFact",
      title: "Nature's Climate Control",
      content: "Ocean currents act like Earth's heating and cooling system. Without them, tropical regions would be unbearably hot and polar regions would be even colder than they are now. The Gulf Stream, for example, keeps Western Europe's climate much warmer than it would otherwise be."
    },
    {
      type: "image",
      title: "Global Ocean Circulation",
      content: "This map shows the major ocean currents that circle our planet like a vast underwater highway system.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "Global ocean currents form interconnected loops that transport heat and nutrients worldwide"
    },
    {
      type: "text",
      title: "How Do Currents Form?",
      content: "Ocean currents are created by several forces working together:\n\n**Wind Power**: Surface winds push water, creating surface currents. Trade winds near the equator are especially important.\n\n**Temperature Differences**: Warm water is lighter and rises, while cold water is heavier and sinks, creating circulation.\n\n**Salt Content**: Saltier water is denser and sinks, while fresher water floats, driving deep ocean currents.\n\n**Earth's Rotation**: The Coriolis effect causes currents to curve as Earth spins."
    },
    {
      type: "quiz",
      title: "Current Knowledge Check",
      content: "What is the primary driver of surface ocean currents?",
      options: [
        "Underwater earthquakes",
        "Wind patterns",
        "Moon's gravity",
        "Fish migrations"
      ],
      correctAnswer: 1,
      explanation: "Wind patterns are the primary driver of surface ocean currents. Consistent wind patterns like trade winds push surface water, creating the major current systems we see today."
    },
    {
      type: "text",
      title: "Impact on Marine Life",
      content: "Ocean currents are highways for marine life, carrying nutrients, food, and even the animals themselves:\n\n**Nutrient Transport**: Currents bring nutrients from deep waters to the surface, feeding microscopic plants that form the base of the food chain.\n\n**Migration Routes**: Many marine animals, from sea turtles to whales, use currents to travel efficiently across vast distances.\n\n**Spawning Areas**: Fish and other marine life often time their reproduction with current patterns to help their offspring reach suitable habitats."
    },
    {
      type: "quiz",
      title: "Marine Life Connection",
      content: "How do ocean currents benefit marine ecosystems?",
      options: [
        "They create underwater storms",
        "They transport nutrients and support migration",
        "They make water warmer everywhere",
        "They prevent fish from moving around"
      ],
      correctAnswer: 1,
      explanation: "Ocean currents transport nutrients from deep waters to the surface and provide migration highways for marine life, making them essential for healthy ocean ecosystems."
    },
    {
      type: "conclusion",
      title: "The Ocean's Global Impact",
      content: "You've discovered how ocean currents connect every part of our planet's ocean system. These powerful flows influence weather patterns, climate, and marine life worldwide. Understanding currents helps us appreciate how interconnected our ocean system really is - what happens in one part of the ocean affects the entire planet."
    }
  ]
};

export const leeuwincurrentLesson: EnhancedLesson = {
  id: "leeuwin-current-enhanced",
  title: "The Leeuwin Current",
  description: "Discover Western Australia's unique warm-water current and its impact on marine life",
  category: "ocean-literacy",
  duration: 6,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "Meet Australia's Unique Current!",
      content: "Western Australia has something special - a warm current flowing in the 'wrong' direction! Most currents on the west side of continents flow toward the equator, but the Leeuwin Current flows away from it. You're about to discover why this makes Western Australia's marine life so extraordinary."
    },
    {
      type: "text",
      title: "What Makes the Leeuwin Current Special?",
      content: "The Leeuwin Current is Western Australia's warm, southward-flowing ocean current. Unlike most west-coast currents around the world, which are cold and flow toward the equator, the Leeuwin Current carries warm, tropical water southward along the coast.\n\nThis 'backwards' flow creates a unique marine environment, bringing tropical species much further south than they could normally survive.",
      highlight: "The Leeuwin Current is one of only a few warm, poleward-flowing currents on Earth's western coasts!"
    },
    {
      type: "image",
      title: "The Current's Path",
      content: "The Leeuwin Current flows over 5,000 kilometers along Western Australia's coast.",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "Satellite imagery showing the warm Leeuwin Current flowing southward along Western Australia"
    },
    {
      type: "funFact",
      title: "A Marine Superhighway",
      content: "The Leeuwin Current acts like a marine conveyor belt, transporting fish larvae, nutrients, and heat southward. During strong Leeuwin Current years, tropical fish species can be found as far south as Albany - over 1,000 kilometers from their normal range!"
    },
    {
      type: "text",
      title: "Impact on Western Australian Marine Life",
      content: "The Leeuwin Current creates Western Australia's incredible marine biodiversity:\n\n**Tropical Visitors**: Warm water brings tropical fish species south, creating unique mixed communities.\n\n**Rock Lobster Recruitment**: The current carries baby rock lobsters from breeding areas to coastal nurseries.\n\n**Coral Communities**: Enables coral growth much further south than usual, creating unique temperate coral reefs.\n\n**Seasonal Changes**: Current strength varies, creating different marine conditions each year."
    },
    {
      type: "quiz",
      title: "Current Knowledge",
      content: "What makes the Leeuwin Current unusual compared to most west-coast ocean currents?",
      options: [
        "It flows very slowly",
        "It flows southward carrying warm water",
        "It only flows in winter",
        "It's very shallow"
      ],
      correctAnswer: 1,
      explanation: "The Leeuwin Current is unusual because it flows southward (poleward) carrying warm tropical water, while most west-coast currents flow toward the equator and are cold."
    },
    {
      type: "text",
      title: "Climate and Weather Effects",
      content: "The Leeuwin Current doesn't just affect marine life - it influences Western Australia's weather too:\n\n**Rainfall Patterns**: Stronger current years often bring more rainfall to southwestern Australia.\n\n**Temperature Moderation**: The warm water keeps coastal temperatures milder than they would otherwise be.\n\n**Storm Systems**: The current can influence the development and path of weather systems."
    },
    {
      type: "conclusion",
      title: "Western Australia's Marine Marvel",
      content: "You've explored how the Leeuwin Current makes Western Australia's marine environment truly unique. This warm, southward-flowing current creates one of the world's most biodiverse marine regions, mixing tropical and temperate species in ways found nowhere else on Earth. Next time you're diving or snorkeling in WA, remember you're experiencing the gifts of this remarkable current!"
    }
  ]
};

export const westernRockLobsterLesson: EnhancedLesson = {
  id: "western-rock-lobster-enhanced",
  title: "Meet the Western Rock Lobster",
  description: "Discover Western Australia's iconic marine species and their incredible life journey",
  category: "species",
  duration: 8,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "Meet WA's Marine Icon!",
      content: "You're about to meet one of Western Australia's most famous underwater residents. The Western Rock Lobster has an incredible life story - from tiny floating larvae to armored adults. Their journey across the ocean and back is one of nature's most remarkable adventures."
    },
    {
      type: "text",
      title: "Getting to Know Western Rock Lobsters",
      content: "The Western Rock Lobster (Panulirus cygnus) is found only in the waters off Western Australia. These amazing creatures don't have claws like their eastern cousins - instead, they have powerful spiny antennae and strong legs for walking across the reef.\n\nThey're easily recognized by their reddish-brown color with white and yellow spots, and those impressive long antennae that can be longer than their body!",
      highlight: "Western Rock Lobsters can live up to 20 years and grow to over 5 kilograms!"
    },
    {
      type: "image",
      title: "Adult Western Rock Lobster",
      content: "Adult Western Rock Lobsters are impressive creatures with distinctive spiny shells and long antennae.",
      image: "https://images.unsplash.com/photo-1559616573-7755a48a70f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "An adult Western Rock Lobster showing its characteristic spiny shell and long antennae"
    },
    {
      type: "funFact",
      title: "The Great Ocean Journey",
      content: "Western Rock Lobster babies (called phyllosoma) spend up to 11 months floating in the open ocean! They drift with currents for hundreds of kilometers before returning to the coast as juveniles. This epic journey can take them as far as Indonesia before they find their way home to Western Australian reefs."
    },
    {
      type: "text",
      title: "Life Cycle Adventure",
      content: "Western Rock Lobsters have one of the most complex life cycles in the ocean:\n\n**Stage 1 - Eggs**: Females carry bright orange eggs under their tails for about 3 months.\n\n**Stage 2 - Phyllosoma**: Tiny, transparent larvae float in the open ocean for 9-11 months, growing through 11 different stages.\n\n**Stage 3 - Puerulus**: Juveniles return to the coast and settle in shallow reefs and seagrass beds.\n\n**Stage 4 - Adults**: After several years, they move to deeper reefs where they can grow very large."
    },
    {
      type: "quiz",
      title: "Life Cycle Knowledge",
      content: "How long do Western Rock Lobster larvae spend floating in the open ocean?",
      options: [
        "About 1 month",
        "3-4 months",
        "9-11 months",
        "2 years"
      ],
      correctAnswer: 2,
      explanation: "Western Rock Lobster larvae (phyllosoma) spend an incredible 9-11 months floating in the open ocean before returning to coastal reefs as juveniles."
    },
    {
      type: "text",
      title: "Habitat and Behavior",
      content: "Western Rock Lobsters are creatures of habit:\n\n**Reef Dwellers**: Adults live in caves and crevices in limestone reefs, coming out mainly at night to feed.\n\n**Group Living**: Young lobsters often shelter together in groups for protection.\n\n**Seasonal Migration**: During winter, they migrate to deeper waters to breed.\n\n**Territory Holders**: Larger adults establish territories and will defend their favorite caves."
    },
    {
      type: "image",
      title: "Juvenile Habitat",
      content: "Young Western Rock Lobsters seek shelter in shallow seagrass beds and reef crevices.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "Seagrass beds provide important nursery habitat for juvenile Western Rock Lobsters"
    },
    {
      type: "funFact",
      title: "Sustainable Success Story",
      content: "Western Australia's rock lobster fishery is one of the world's most sustainable lobster fisheries. Strict size limits, seasonal closures, and quotas help ensure these amazing creatures will be around for future generations to enjoy both underwater and on the dinner table!"
    },
    {
      type: "quiz",
      title: "Conservation Understanding",
      content: "What makes Western Australia's rock lobster fishery sustainable?",
      options: [
        "There are no fishing rules",
        "Only tourists can catch them",
        "Strict size limits, seasons, and quotas",
        "They reproduce very quickly"
      ],
      correctAnswer: 2,
      explanation: "Western Australia's rock lobster fishery uses strict size limits, seasonal closures, and quotas to ensure the population remains healthy and sustainable for the future."
    },
    {
      type: "conclusion",
      title: "WA's Marine Treasure",
      content: "You've discovered the remarkable story of Western Australia's most iconic marine species. From their epic ocean journey as larvae to their role as reef guardians, Western Rock Lobsters are truly special. Next time you're diving in WA waters, look for their distinctive antennae poking out from reef crevices - you're seeing millions of years of evolution in action!"
    }
  ]
};

export const reefFishLesson: EnhancedLesson = {
  id: "reef-fish-enhanced",
  title: "Identifying Reef Fish",
  description: "Learn to recognize common reef fish and understand their important roles in marine ecosystems",
  category: "species",
  duration: 7,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "Welcome to the Reef Fish World!",
      content: "Imagine swimming through an underwater city where every resident has a different job, color, and personality. Coral reefs are home to an incredible diversity of fish species, each playing a unique role. You're about to become a reef fish detective, learning to spot the key features that make each species special."
    },
    {
      type: "text",
      title: "Why Learn About Reef Fish?",
      content: "Reef fish are like the heartbeat of coral reef ecosystems. They perform essential jobs that keep reefs healthy:\n\n**Cleaners**: Some fish specialize in removing parasites from other fish, like underwater doctors.\n\n**Gardeners**: Herbivorous fish graze on algae, preventing it from smothering corals.\n\n**Builders**: Some fish help create and maintain reef structures.\n\n**Recyclers**: Fish waste provides important nutrients for coral growth.",
      highlight: "A single coral reef can be home to over 4,000 different fish species!"
    },
    {
      type: "image",
      title: "Reef Fish Diversity",
      content: "Coral reefs showcase an incredible variety of fish shapes, sizes, and colors.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "A diverse community of reef fish species in their natural coral habitat"
    },
    {
      type: "text",
      title: "Key Identification Features",
      content: "When identifying reef fish, look for these important characteristics:\n\n**Body Shape**: Is it flat, round, elongated, or disc-shaped? Shape tells you about lifestyle.\n\n**Color Patterns**: Stripes, spots, solid colors, or color-changing abilities.\n\n**Fin Shape**: Pointed, rounded, or specialized fins indicate different swimming styles and behaviors.\n\n**Size**: From tiny gobies smaller than your thumb to large groupers bigger than you.\n\n**Behavior**: How they swim, where they live, and what they eat."
    },
    {
      type: "funFact",
      title: "Master of Disguise",
      content: "Many reef fish can change their colors instantly! Parrotfish can shift from bright daytime colors to dull nighttime patterns in seconds. Some wrasses even change sex and completely transform their colors as they mature from female to male."
    },
    {
      type: "quiz",
      title: "Fish Feature Quiz",
      content: "What does a fish's body shape primarily tell you about?",
      options: [
        "How old it is",
        "Its lifestyle and habitat preferences",
        "What color it will become",
        "How many eggs it lays"
      ],
      correctAnswer: 1,
      explanation: "A fish's body shape reveals a lot about its lifestyle - flat fish often live on the bottom, streamlined fish are fast swimmers, and deep-bodied fish are often maneuverable reef dwellers."
    },
    {
      type: "text",
      title: "Common Reef Fish Families",
      content: "Here are some key reef fish families you're likely to encounter:\n\n**Angelfish**: Disc-shaped with beautiful patterns, often seen in pairs.\n\n**Butterflyfish**: Colorful with delicate fins, many have eyespots to confuse predators.\n\n**Parrotfish**: Large lips and beak-like mouths for scraping algae from coral.\n\n**Wrasses**: Diverse family with many shapes and colors, excellent cleaners.\n\n**Damselfish**: Small, territorial fish that often tend algae gardens.\n\n**Groupers**: Large predators with huge mouths that can swallow prey whole."
    },
    {
      type: "image",
      title: "Parrotfish in Action",
      content: "Parrotfish use their beak-like mouths to scrape algae from coral surfaces.",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "A colorful parrotfish grazing on coral - these fish help keep reefs healthy by controlling algae"
    },
    {
      type: "quiz",
      title: "Fish Family Knowledge",
      content: "Which reef fish family is known for having beak-like mouths used to scrape algae?",
      options: [
        "Angelfish",
        "Butterflyfish",
        "Parrotfish",
        "Damselfish"
      ],
      correctAnswer: 2,
      explanation: "Parrotfish have distinctive beak-like mouths that they use to scrape algae from coral surfaces, playing a crucial role in keeping reefs healthy."
    },
    {
      type: "text",
      title: "Observing Fish Behavior",
      content: "Understanding fish behavior helps with identification and appreciation:\n\n**Feeding Behavior**: Watch what and how fish eat - some graze, others hunt, some clean.\n\n**Social Structure**: Some fish live alone, others in pairs, schools, or complex communities.\n\n**Territory Defense**: Many reef fish defend specific areas and will chase away intruders.\n\n**Cleaning Stations**: Look for areas where cleaner fish provide services to other species."
    },
    {
      type: "conclusion",
      title: "Your Reef Fish Journey Begins",
      content: "You now have the foundation to start identifying and appreciating reef fish. Remember, each fish you encounter has a specific role in the reef community. The more you observe and learn, the more you'll appreciate the complex relationships that make coral reefs such incredible ecosystems. Happy fish watching on your next underwater adventure!"
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

export const oceanLiteracyPrinciple1Lesson: EnhancedLesson = {
  id: "ocean-literacy-principle-1",
  title: "Ocean Literacy Principle 1: Earth has one big ocean with many features",
  description: "Discover why Earth really has just one interconnected ocean and explore its amazing underwater landscapes",
  category: "ocean-literacy",
  duration: 5,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "Welcome to the One Ocean World!",
      content: "Did you know there's really just one ocean on Earth? Even though we often talk about the Pacific, Atlantic, Indian, Arctic, and Southern Oceans, they're all part of one massive, connected global ocean. You're about to discover why this connection matters and explore the incredible underwater landscapes that make up our planet's most important feature."
    },
    {
      type: "text",
      title: "The Truth About Earth's Ocean",
      content: "Here's something that might surprise you: scientists consider Earth to have just one ocean, not five separate ones. The water moves constantly between what we call different oceans, carrying heat, nutrients, and life with it.\n\nThink of it like a giant swimming pool with no walls between the deep end and shallow end - the water is all connected. A drop of water from the Pacific can travel through currents and eventually reach the Atlantic, Indian, Arctic, and Southern regions.",
      highlight: "The ocean covers 71% of Earth's surface - that's more than twice the land area!"
    },
    {
      type: "quiz",
      title: "Ocean Connection Quiz",
      content: "How many separate oceans are there, scientifically speaking?",
      options: [
        "Just 1 connected ocean",
        "3 distinct oceans",
        "5 separate oceans", 
        "7 different oceans"
      ],
      correctAnswer: 0,
      explanation: "Scientifically, Earth has one big interconnected ocean. While we use names like Pacific and Atlantic for different regions, the water is all connected and constantly moving between these areas."
    },
    {
      type: "text",
      title: "The Global Ocean Connection",
      content: "The ocean's connection goes far beyond just being one body of water. Here's how it all works together:\n\n**The Global Conveyor Belt**: Ocean currents act like a massive conveyor belt, moving warm and cold water around the entire planet. This system takes about 1,000 years to complete one full cycle!\n\n**Shared Wildlife**: Marine animals don't recognize our ocean boundaries. Whales migrate between 'different' oceans, and sea turtles cross entire ocean basins.\n\n**Global Impact**: What happens in one part of the ocean affects everywhere else. A plastic bottle dropped in California could drift across the Pacific and wash up in Indonesia.",
      highlight: "Ocean currents transport 100 times more water than all the world's rivers combined!"
    },
    {
      type: "image",
      title: "Ocean Currents in Action",
      content: "The Global Conveyor Belt shows how ocean water circulates around the entire planet.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "Ocean currents create a global circulation system that connects all parts of the world's ocean"
    },
    {
      type: "quiz",
      title: "Current Knowledge",
      content: "What is one major way oceans are interconnected?",
      options: [
        "Deep-sea volcanoes only",
        "Ocean currents that move water globally",
        "Separate salt levels in each region",
        "Local tides that stay in one area"
      ],
      correctAnswer: 1,
      explanation: "Ocean currents are a major way the global ocean is interconnected. These currents move water, heat, nutrients, and marine life around the entire planet, connecting all ocean regions."
    },
    {
      type: "text",
      title: "Amazing Ocean Floor Features",
      content: "The ocean floor isn't flat and boring - it's full of incredible landscapes that would put any mountain range to shame:\n\n**Mid-Ocean Ridges**: Underwater mountain chains that stretch for 65,000 kilometers around the globe. These are where new ocean floor is born from volcanic activity.\n\n**Abyssal Plains**: Vast, flat areas of the deep ocean floor covered in fine sediment. They're some of the flattest places on Earth.\n\n**Seamounts**: Underwater mountains that rise from the ocean floor. Some are taller than Mount Everest but never reach the surface.\n\n**Ocean Trenches**: The deepest parts of the ocean, some reaching depths of over 11 kilometers - deeper than Mount Everest is tall!",
      highlight: "The Mariana Trench is so deep that if Mount Everest were placed inside it, the peak would still be over 2 kilometers underwater!"
    },
    {
      type: "funFact",
      title: "Underwater Geography Records",
      content: "The ocean floor holds some incredible records: The Mid-Atlantic Ridge is the longest mountain range on Earth at 65,000 km. The Pacific Ring of Fire contains 75% of the world's active volcanoes. And we've explored less than 5% of the ocean floor - meaning there are countless amazing features still waiting to be discovered!"
    },
    {
      type: "quiz",
      title: "Ocean Features Quiz",
      content: "Which of these is a real feature of the ocean floor?",
      options: [
        "Ice fields that never melt",
        "Sand deserts like the Sahara",
        "Abyssal plains - vast flat areas",
        "Floating coral islands"
      ],
      correctAnswer: 2,
      explanation: "Abyssal plains are real features of the ocean floor. These are vast, flat areas in the deep ocean covered with fine sediment, making them some of the flattest places on our planet."
    },
    {
      type: "text",
      title: "Why Ocean Features Matter",
      content: "These underwater landscapes aren't just amazing to learn about - they shape life on Earth:\n\n**Biodiversity Hotspots**: Seamounts and ridges create unique habitats for marine life that exists nowhere else.\n\n**Climate Regulation**: Ocean floor features influence how currents flow, which affects global weather patterns.\n\n**Resource Formation**: Many of our ocean resources, from fish populations to mineral deposits, are connected to these underwater features.\n\n**Geological Activity**: Mid-ocean ridges and trenches are where Earth's tectonic plates meet, creating new ocean floor and recycling old materials."
    },
    {
      type: "conclusion",
      title: "You're Now an Ocean Literacy Champion!",
      content: "Congratulations! You've just completed Ocean Literacy Principle 1 of 7. You now understand that Earth truly has one big, interconnected ocean with incredible features.\n\nRemember: every action that affects the ocean - whether it's in your local area or halfway around the world - impacts this one global system. By understanding these connections, you're better equipped to make choices that help protect our planet's most important feature.\n\n## What You Can Do\n\n• **Reduce plastic waste** - Avoid single-use plastics that can travel across ocean basins\n\n• **Support ocean-friendly businesses** - Choose companies that protect ocean health\n\n• **Share your knowledge** - Tell friends and family about ocean connections\n\n• **Stay curious** - Keep exploring the amazing world beneath the waves\n\nReady to explore more ocean literacy principles? The ocean adventure continues!"
    }
  ]
};