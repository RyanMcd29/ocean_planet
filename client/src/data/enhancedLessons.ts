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
      content: "Congratulations! You've just completed Ocean Literacy Principle 1 of 7. You now understand that Earth truly has one big, interconnected ocean with incredible features.\n\nUnderstanding these connections helps us protect our planet's most important feature.\n\n**What You Can Do**\n\n**Reduce plastic waste** – Avoid single-use plastics that travel across ocean basins\n\n**Support ocean-friendly businesses** – Choose companies that protect ocean health\n\n**Share your knowledge** – Tell friends and family about ocean connections\n\n**Stay curious** – Keep exploring the amazing world beneath the waves 🌊\n\n---\n\n🌊 Ready to explore more ocean literacy principles? The adventure continues!"
    }
  ]
};

export const oceanLiteracyPrinciple2Lesson: EnhancedLesson = {
  id: "ocean-literacy-principle-2",
  title: "Ocean Literacy Principle 2: The ocean and life in the ocean shape the features of the Earth",
  description: "Discover how ocean waves, currents, and marine life have sculpted our planet's landscape over millions of years",
  category: "ocean-literacy",
  duration: 6,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "Welcome to Earth's Greatest Sculptor!",
      content: "Did you know the ocean isn't just shaped by Earth - it actually shapes Earth too? You're about to discover how waves, currents, and marine life have been Earth's master sculptors for millions of years, carving coastlines, building islands, and creating the landscapes we see today."
    },
    {
      type: "text",
      title: "The Ocean as Earth's Architect",
      content: "Think of the ocean as a tireless artist that never stops working. Every wave that crashes on a beach, every current that flows around the globe, and every tiny marine creature contributes to reshaping our planet.\n\nThe ocean's power to shape Earth works in fascinating ways:\n\n**Wave Power**: Ocean waves are incredibly powerful sculptors. They can carve through solid rock over time, creating dramatic cliffs, sea caves, and arches. The constant pounding of waves breaks down rocks into sand, which then travels to form new beaches elsewhere.\n\n**Coastal Transformation**: What we see as 'permanent' coastlines are actually constantly changing. The ocean adds material in some places and takes it away in others, creating an ever-evolving shoreline.",
      highlight: "A single large wave can exert a force of over 30 tons per square meter on a cliff face!"
    },
    {
      type: "quiz",
      title: "Ocean Shaping Quiz",
      content: "Which natural feature is directly shaped by ocean activity?",
      options: [
        "Mountain ranges",
        "Desert sand dunes", 
        "Ocean beaches",
        "Polar glaciers"
      ],
      correctAnswer: 2,
      explanation: "Ocean beaches are directly shaped by wave action. Waves constantly move sand and sediment, building up beaches in some areas while eroding them in others. This process creates the dynamic coastlines we see today."
    },
    {
      type: "text",
      title: "Marine Life: The Living Builders",
      content: "Some of the most impressive landscape features on Earth are actually built by living creatures in the ocean:\n\n**Coral Reef Islands**: Tiny coral animals create massive limestone structures over thousands of years. These reefs can grow so large they become entire islands! The Maldives, for example, are built entirely on ancient coral reefs.\n\n**Biological Sediments**: When marine creatures die, their shells and skeletons don't just disappear. They settle to the ocean floor, layer upon layer, eventually forming thick sediment deposits. Over millions of years, these can become new land or even mountain ranges when tectonic forces push them above sea level.\n\n**Living Ecosystem Engineers**: Marine organisms don't just build with their bodies - they actively shape their environment. Oysters create reef structures, seagrass beds trap sediment to build up the seafloor, and even tiny microscopic organisms help control ocean chemistry.",
      highlight: "The White Cliffs of Dover in England are made from the compressed shells of ancient marine plankton!"
    },
    {
      type: "image",
      title: "Coral Reef Formation",
      content: "Coral reefs are among the most impressive structures built by living organisms on Earth.",
      image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "Coral reefs like this one can grow over thousands of years to form entire islands and shape coastlines"
    },
    {
      type: "quiz",
      title: "Marine Life Impact Quiz",
      content: "What do coral reefs contribute to over time?",
      options: [
        "Destruction of existing coastlines",
        "Formation of new land and islands",
        "Erosion of nearby mountains",
        "Cooling of ocean temperatures"
      ],
      correctAnswer: 1,
      explanation: "Coral reefs contribute to the formation of new land and islands over time. As coral animals build their limestone skeletons, these structures can grow large enough to reach the surface and become islands, like many Pacific atolls."
    },
    {
      type: "text",
      title: "Ocean's Global Impact on Earth",
      content: "The ocean's influence on Earth goes far beyond just coastal areas:\n\n**Atmospheric Control**: Marine plants, especially tiny phytoplankton, produce over 50% of the oxygen we breathe. They also absorb massive amounts of carbon dioxide, helping regulate Earth's climate.\n\n**Weather Patterns**: Ocean currents distribute heat around the planet, creating different climate zones. Without ocean currents, Earth's weather would be completely different.\n\n**Continental Drift**: Over geological time, ocean currents and plate tectonics work together to literally move continents around the globe.\n\n**Volcanic Island Chains**: Underwater volcanic activity creates new land masses. The Hawaiian Islands are a perfect example - they were built from the ocean floor up by volcanic activity, and new islands are still forming today.",
      highlight: "Every second breath you take comes from oxygen produced by marine plants in the ocean!"
    },
    {
      type: "funFact",
      title: "The Ocean's Oxygen Factory",
      content: "Here's something amazing: the ocean produces more oxygen than all the world's forests combined! Tiny floating plants called phytoplankton are invisible to the naked eye, but they're working 24/7 to keep our atmosphere breathable. A single drop of seawater can contain thousands of these microscopic oxygen producers."
    },
    {
      type: "quiz",
      title: "Global Impact Quiz",
      content: "Roughly how much of the world's oxygen is produced by the ocean?",
      options: [
        "About 10%",
        "About 25%",
        "About 50%",
        "About 90%"
      ],
      correctAnswer: 2,
      explanation: "The ocean produces approximately 50% of the world's oxygen, primarily through phytoplankton photosynthesis. These microscopic marine plants are essential for maintaining the oxygen levels that make life on Earth possible."
    },
    {
      type: "text",
      title: "Volcanic Islands: Ocean-Built Land",
      content: "Some of the most dramatic examples of the ocean shaping Earth are volcanic island chains:\n\n**Hawaii**: The entire Hawaiian island chain was built from the ocean floor by underwater volcanoes. Each island started as an underwater mountain that grew tall enough to break the surface.\n\n**Iceland**: This island nation sits on the Mid-Atlantic Ridge, where new ocean floor is constantly being created by volcanic activity.\n\n**Galápagos Islands**: These famous islands were all born from underwater volcanoes and continue to be shaped by ocean processes today.\n\nThese aren't just ancient processes - new land is being created right now! The newest Hawaiian island, Lōʻihi, is currently growing underwater and will eventually emerge as a new island."
    },
    {
      type: "conclusion",
      title: "You're Now an Earth-Shaping Expert!",
      content: "Congratulations! You've just completed Ocean Literacy Principle 2 of 7. You now understand how the ocean and marine life are constantly reshaping our planet.\n\nFrom tiny coral animals building massive reefs to powerful waves carving coastlines, the ocean is Earth's most active landscape architect. Understanding these processes helps us appreciate both the power of nature and our responsibility to protect marine ecosystems.\n\n**What You Can Do**\n\n**Visit coastal areas responsibly** – Respect beaches, cliffs, and coral reefs as the dynamic systems they are\n\n**Learn about coral conservation** – Support efforts to protect reef-building organisms\n\n**Support marine research** – Back scientific studies that help us understand ocean-Earth interactions\n\n**Protect marine habitats** – Help preserve the ecosystems that literally build our planet 🌊\n\n---\n\n🌊 Ready to explore more ocean literacy principles? The adventure continues!"
    }
  ]
};

export const highSeasTreatyLesson: EnhancedLesson = {
  id: "high-seas-treaty-enhanced",
  title: "The Historic High Seas Treaty",
  description: "Discover how the world finally agreed to protect the lawless waters beyond any country's borders",
  category: "conservation",
  duration: 7,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "Welcome to the High Seas Adventure!",
      content: "You're about to explore one of the most important ocean conservation breakthroughs in history. Did you know that more than 60% of our ocean has been like the Wild West - with almost no rules for protection? In 2023, after nearly 20 years of negotiations, the world finally came together to change that. Let's dive into this historic achievement!"
    },
    {
      type: "text",
      title: "What Are the High Seas?",
      content: "The high seas are the vast ocean areas that lie beyond any country's borders - that's more than 60% of our entire planet! These international waters have been like a legal no-man's land when it comes to conservation.\n\nImagine if more than half of all land on Earth had no environmental protection laws - that's what we've had in our ocean until now. These waters are home to incredible wildlife like whales, tuna, sharks, and countless species of plankton that are vital to Earth's climate and ecosystems.",
      highlight: "The high seas cover about half the planet with very few conservation rules!"
    },
    {
      type: "image",
      title: "The Lawless Ocean",
      content: "Vast areas of international waters have existed without comprehensive protection.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      caption: "The high seas - international waters beyond any country's jurisdiction"
    },
    {
      type: "funFact",
      title: "A Marine Wild West",
      content: "Until 2023, there was no legal framework to create marine protected areas in international waters. Activities like deep-sea mining, industrial fishing, and shipping could happen with minimal oversight in these vast ocean spaces."
    },
    {
      type: "text",
      title: "The Game-Changing Treaty",
      content: "In 2023, something historic happened: the world agreed on a High Seas Treaty to protect ocean biodiversity for the first time ever! This groundbreaking agreement will allow countries to:\n\n**Create Marine Protected Areas**: Establish no-take zones in international waters where marine life can thrive undisturbed.\n\n**Share Resources Fairly**: Ensure that benefits from marine genetic resources are distributed equitably among nations.\n\n**Assess Environmental Impact**: Require thorough environmental assessments for activities like deep-sea mining or major shipping operations.\n\n**Coordinate Global Action**: Work together on ocean conservation instead of operating in isolation."
    },
    {
      type: "quiz",
      title: "Treaty Knowledge Check",
      content: "Which of the following is true about the High Seas Treaty?",
      options: [
        "It only applies to coastal reefs",
        "It allows the creation of protected zones in international waters",
        "It bans all fishing in the ocean",
        "It only affects countries in the Pacific"
      ],
      correctAnswer: 1,
      explanation: "The High Seas Treaty's main achievement is allowing the creation of marine protected areas in international waters - something that was impossible before this agreement."
    },
    {
      type: "text",
      title: "A Global Collaboration Success",
      content: "Over 190 countries agreed to this treaty after nearly 20 years of complex negotiations. This represents one of the most significant international environmental agreements in decades!\n\nThe treaty is a crucial step toward achieving the ambitious 30x30 goal - protecting 30% of the world's land and ocean by 2030. Currently, less than 8% of our ocean is protected, so this treaty opens the door to much greater conservation coverage.\n\nHowever, signing the treaty is just the beginning. Each country must now ratify it through their national governments and implement the rules at home - a process that will take time and commitment."
    },
    {
      type: "quiz",
      title: "Conservation Goals",
      content: "What does the '30x30 goal' aim to protect?",
      options: [
        "30% of national parks",
        "30% of Earth's forests",
        "30% of land and ocean by 2030",
        "30 species each year"
      ],
      correctAnswer: 2,
      explanation: "The 30x30 goal is an ambitious international target to protect 30% of Earth's land and ocean areas by 2030, helping preserve biodiversity and combat climate change."
    },
    {
      type: "text",
      title: "Why This Matters to Everyone",
      content: "You might wonder: 'Why should I care about waters so far from shore?' The truth is, the high seas affect everyone's life:\n\n**Climate Regulation**: These waters help regulate global weather patterns and absorb massive amounts of carbon dioxide.\n\n**Food Security**: Many fish species we eat migrate through or live in international waters.\n\n**Ocean Health**: Healthy high seas support the entire marine ecosystem, including coastal areas where many people live.\n\n**Scientific Discovery**: These waters contain countless undiscovered species that could lead to medical breakthroughs or help us understand life on Earth."
    },
    {
      type: "quiz",
      title: "Global Impact Understanding",
      content: "How do the high seas affect people living far from the ocean?",
      options: [
        "They don't affect inland areas at all",
        "They help regulate global climate and weather patterns",
        "They only matter for shipping companies",
        "They're only important for marine biologists"
      ],
      correctAnswer: 1,
      explanation: "The high seas play a crucial role in regulating Earth's climate and weather systems, affecting everyone regardless of where they live on the planet."
    },
    {
      type: "conclusion",
      title: "You're Now a High Seas Hero!",
      content: "Congratulations! You've learned about one of the most significant ocean conservation achievements in history. The High Seas Treaty shows that global action for ocean protection is not just possible - it's happening!\n\nThis historic agreement proves that when the world works together, we can tackle even the biggest environmental challenges. While you might not live near the high seas, your voice and actions matter in supporting this global effort.\n\n**What You Can Do**\n\n**Stay informed and share** – Tell others about this historic ocean conservation win\n\n**Choose sustainable seafood** – Support fisheries that follow responsible practices\n\n**Support marine policies** – Back leaders and policies that protect ocean biodiversity\n\n**Advocate for ratification** – Encourage your country's leaders to ratify and implement the treaty\n\n**Join conservation efforts** – Follow and support organizations working on high seas protection\n\n**Be an ocean ambassador** – Share your knowledge and inspire others to care about our global ocean 🌊\n\n---\n\n🌊 The future of our high seas depends on global action - and that includes you!"
    }
  ]
};

export const oceanLiteracyPrinciple3Lesson: EnhancedLesson = {
  id: "ocean-literacy-principle-3",
  title: "Ocean Literacy Principle 3: The Ocean is a Major Influence on Weather and Climate",
  description: "Discover how the ocean controls much of our planet's weather patterns and climate systems",
  category: "ocean-literacy",
  duration: 6,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "🌊 Welcome to Ocean-Weather Science!",
      content: "Did you know the ocean controls much of our planet's weather? From sea breezes to massive cyclones, the ocean is Earth's weather engine. You're about to discover how the vast blue waters shape the air above them in ways that affect your daily life!"
    },
    {
      type: "text",
      title: "🌍 The Ocean's Heat Engine",
      content: "Think of the ocean as Earth's giant heating and cooling system. Here's how it works:\n\n• **Heat Storage** - The ocean absorbs most of the sun's heat reaching Earth\n• **Water Cycle** - Warm water evaporates, forming clouds and eventually rain\n• **Heat Transport** - Ocean currents move warm water from the equator to the poles and cold water back again\n• **Weather Creation** - This constant movement creates weather patterns worldwide\n\nWithout the ocean's influence, Earth's weather would be completely different!",
      highlight: "The ocean stores 1,000 times more heat than the atmosphere!"
    },
    {
      type: "quiz",
      title: "What Causes Tropical Cyclones?",
      content: "Tropical cyclones (hurricanes and typhoons) get their power from one main source. What is it?",
      options: [
        "Cold ocean water",
        "Ocean pollution", 
        "Warm ocean water",
        "Ocean tides"
      ],
      correctAnswer: 2,
      explanation: "Tropical cyclones form over warm ocean waters (usually above 26°C) because they draw energy from the heat stored in the water. As warm water evaporates, it rises and creates the spinning motion that becomes a cyclone."
    },
    {
      type: "text",
      title: "🌊 Ocean Currents Shape Climate Zones",
      content: "Ocean currents are like massive rivers flowing through the sea, and they have a huge impact on regional climates:\n\n**The Leeuwin Current** - This warm current keeps Western Australia's coast much warmer than other areas at the same latitude. That's why Perth has such a pleasant Mediterranean climate!\n\n**El Niño and La Niña** - These Pacific Ocean systems affect rainfall, droughts, and storms globally. When ocean temperatures change in the Pacific, it can cause floods in some places and droughts in others.\n\nThese currents act like Earth's climate conveyor belt, moving heat around the planet.",
      highlight: "The Leeuwin Current can make coastal temperatures 2-5°C warmer than inland areas"
    },
    {
      type: "quiz", 
      title: "Ocean-Climate Connection",
      content: "Which of the following statements about ocean currents and climate is TRUE?",
      options: [
        "The ocean stores very little heat",
        "Ocean currents don't impact regional climate",
        "The Leeuwin Current warms Western Australia's coast",
        "All oceans have exactly the same temperature"
      ],
      correctAnswer: 2,
      explanation: "The Leeuwin Current is a warm ocean current that flows southward along Western Australia's coast, bringing tropical waters that significantly warm the coastal regions and influence the local climate."
    },
    {
      type: "text",
      title: "🔥 Climate Change and Extreme Weather",
      content: "As our oceans warm due to climate change, we're seeing more extreme weather events:\n\n**Stronger Storms** - Warmer oceans provide more energy for tropical cyclones, making them more intense\n\n**Sea Level Rise** - As water warms, it expands, and melting ice adds more water to the oceans\n\n**Changed Circulation** - Melting polar ice affects ocean circulation patterns, which can shift weather patterns globally\n\n**Heat Waves** - Warmer oceans can contribute to more frequent and intense heat waves on land\n\nUnderstanding these connections helps scientists predict future weather patterns and prepare for changes.",
      highlight: "Ocean temperatures have risen by about 0.6°C since 1969 - that might not sound like much, but it represents an enormous amount of stored heat!"
    },
    {
      type: "quiz",
      title: "Climate Change Impacts",
      content: "What is one result of warming oceans due to climate change?",
      options: [
        "Less rainfall globally",
        "Stronger storms and rising sea levels",
        "Colder winters everywhere",
        "Slower ocean currents only"
      ],
      correctAnswer: 1,
      explanation: "Warming oceans provide more energy for storms, making them stronger, and the thermal expansion of seawater plus melting ice contributes to rising sea levels. These are two major consequences of ocean warming."
    },
    {
      type: "conclusion",
      title: "🌱 You're Now a Weather-Ocean Expert!",
      content: "Fantastic! You now understand how the ocean drives our planet's weather and climate systems. This knowledge helps us understand everything from daily weather forecasts to long-term climate change.\n\n**What You Can Do:**\n\n**Reduce your carbon footprint** - Use public transport, choose renewable energy, and make climate-conscious choices\n\n**Support climate-resilient communities** - Back initiatives that help coastal areas adapt to sea level rise\n\n**Stay informed** - Follow ocean and climate science to understand how these systems are changing\n\n**Share your knowledge** - Help others understand the ocean-climate connection\n\n**Support climate action** - Advocate for policies that protect our ocean-atmosphere system\n\nRemember: understanding how the ocean drives weather helps us prepare for and adapt to our changing climate! 🌊"
    }
  ]
};

export const oceanLiteracyPrinciple4Lesson: EnhancedLesson = {
  id: "ocean-literacy-principle-4", 
  title: "Ocean Literacy Principle 4: The Ocean Makes Earth Habitable",
  description: "Explore how the ocean serves as Earth's life support system, making our planet livable",
  category: "ocean-literacy",
  duration: 6,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "🌍 Welcome to Earth's Life Support Center!",
      content: "The reason Earth is livable isn't just because of land, plants, or even the atmosphere - it's because of the ocean! You're about to discover how the ocean is literally Earth's life support system, keeping our planet habitable for all living things."
    },
    {
      type: "text",
      title: "☀️ The Ocean's Life Support Functions",
      content: "The ocean performs three critical jobs that make Earth habitable:\n\n**🌡️ Temperature Control** - The ocean absorbs heat from the sun and distributes it around the globe via currents, preventing extreme temperature swings\n\n**💨 Oxygen Production** - Phytoplankton (tiny ocean plants) produce at least 50% of the oxygen we breathe - more than all forests combined!\n\n**🌊 Climate Regulation** - The ocean stores carbon dioxide, helping regulate Earth's climate and preventing even more severe climate change\n\nWithout these ocean services, Earth would be an unrecognizable and likely uninhabitable planet.",
      highlight: "Phytoplankton are so small you need a microscope to see them, but they produce more oxygen than all the trees on land!"
    },
    {
      type: "text", 
      title: "🌊 How the Ocean Keeps Earth Stable",
      content: "Think of the ocean as Earth's giant thermostat and air purifier:\n\n**🌬️ Weather Moderation** - Ocean currents like the Gulf Stream and Leeuwin Current transport heat and influence rainfall patterns worldwide\n\n**🫁 Ocean's Green Lungs** - Phytoplankton absorb sunlight and CO₂, releasing oxygen through photosynthesis, just like land plants but on a massive scale\n\n**🛡️ Climate Buffer** - The ocean acts like a shock absorber, soaking up about 90% of the excess heat from greenhouse gases\n\nFun fact: Without the ocean absorbing all this extra heat and carbon, climate change would already be far more extreme than it is today!",
      highlight: "The ocean has absorbed 93% of the excess heat from climate change - imagine how hot Earth would be without this service!"
    },
    {
      type: "quiz",
      title: "Ocean's Oxygen Factory",
      content: "What produces at least 50% of the world's oxygen that we breathe?",
      options: [
        "Tropical rainforests",
        "Ocean waves and currents", 
        "Phytoplankton in the ocean",
        "Coral reefs"
      ],
      correctAnswer: 2,
      explanation: "Phytoplankton are microscopic marine plants that live near the ocean surface. Through photosynthesis, they produce at least 50% (and possibly up to 70%) of Earth's oxygen - making them more important oxygen producers than all land forests combined!"
    },
    {
      type: "quiz",
      title: "Ocean Currents and Climate",
      content: "What important role do ocean currents play in Earth's systems?",
      options: [
        "They only affect fish migration patterns",
        "They help distribute heat and regulate global climate",
        "They mainly exist to clean up ocean pollution", 
        "They stay in one place and don't move"
      ],
      correctAnswer: 1,
      explanation: "Ocean currents act like a global conveyor belt, moving warm water from tropical regions toward the poles and bringing cold water back toward the equator. This heat distribution system helps regulate Earth's climate and makes many regions more habitable."
    },
    {
      type: "quiz",
      title: "Climate Without the Ocean",
      content: "What would happen to Earth's climate without the ocean's buffering effects?",
      options: [
        "We'd have much more oxygen in the atmosphere",
        "The planet would cool down dramatically",
        "Earth would be much hotter with more severe storms",
        "There would be no change at all"
      ],
      correctAnswer: 2,
      explanation: "Without the ocean absorbing excess heat and CO₂, Earth would be much hotter. The ocean acts as a massive heat sink and carbon reservoir. Without this buffering effect, climate change would be far more severe and rapid."
    },
    {
      type: "conclusion",
      title: "🌍 You're Now an Earth Systems Expert!",
      content: "Amazing! You now understand that protecting the ocean means protecting Earth's habitability for all life, including humans. The ocean isn't just a beautiful place to visit - it's our planet's life support system.\n\n**What You Can Do:**\n\n**Support climate solutions** - Back renewable energy and policies that protect ocean health\n\n**Reduce your carbon footprint** - Use public transport, energy efficiency, and sustainable choices\n\n**Protect ocean ecosystems** - Support marine protected areas and sustainable fishing\n\n**Share this knowledge** - Help others understand the ocean's invisible but vital role in sustaining life\n\n**Stay informed** - Follow ocean science to understand how these systems are changing\n\n**Be an ocean advocate** - Support organizations working to protect our planet's life support system\n\nRemember: everything is connected, and a healthy ocean means a habitable Earth! 🌊"
    }
  ]
};

export const oceanLiteracyPrinciple5Lesson: EnhancedLesson = {
  id: "ocean-literacy-principle-5",
  title: "Ocean Literacy Principle 5: The Ocean Supports a Great Diversity of Life and Ecosystems", 
  description: "Discover the incredible biodiversity of marine life and the interconnected ecosystems of the ocean",
  category: "ocean-literacy",
  duration: 7,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "🐚 Welcome to the Most Biodiverse Place on Earth!",
      content: "The ocean is home to most of the life on Earth! From coral reefs teeming with colorful fish to mysterious deep-sea creatures that glow in the dark, you're about to explore the most diverse and amazing ecosystems on our planet."
    },
    {
      type: "text",
      title: "🧬 Mind-Blowing Ocean Biodiversity",
      content: "The numbers are staggering:\n\n**🔬 Known Species** - Over 230,000 marine species have been discovered and described by scientists\n\n**🌊 Estimated Total** - Scientists believe there could be 1-2 MILLION marine species yet to be discovered!\n\n**🏝️ Ecosystem Variety** - From sunny tidepools and kelp forests to polar seas and pitch-black abyssal plains\n\n**🪸 Coral Reef Magic** - These underwater cities cover less than 1% of the ocean floor but support 25% of all marine life\n\nEvery time scientists explore new areas of the ocean, they discover new species. The ocean is like a vast library of life that we're still learning to read!",
      highlight: "New marine species are discovered every week - we know more about the surface of Mars than we do about deep ocean life!"
    },
    {
      type: "text",
      title: "🧬 How Ocean Life Works Together", 
      content: "Ocean life is beautifully interconnected in complex food webs:\n\n**🦐 Food Webs** - Tiny plankton feed small fish, which feed bigger fish, which feed sharks, marine mammals, and humans\n\n**🏠 Habitat Builders** - Coral reefs, mangroves, seagrass beds, and kelp forests provide food, shelter, and nursery areas for countless species\n\n**🦑 Amazing Adaptations** - Deep-sea creatures use bioluminescence (living light), while others migrate thousands of kilometers across ocean basins\n\n**♻️ Ecosystem Services** - Marine organisms filter water, cycle nutrients, and maintain the balance that keeps ocean ecosystems healthy\n\nThis diversity isn't just beautiful to observe - it's essential for healthy oceans and human wellbeing.",
      highlight: "A single coral reef can be home to over 4,000 species of fish plus thousands of other marine creatures!"
    },
    {
      type: "quiz",
      title: "Coral Reef Biodiversity",
      content: "What percentage of all marine life is supported by coral reefs?",
      options: [
        "About 1%",
        "Around 10%", 
        "Approximately 25%",
        "Nearly 50%"
      ],
      correctAnswer: 2,
      explanation: "Despite covering less than 1% of the ocean floor, coral reefs support about 25% of all marine species. This makes them one of the most biodiverse ecosystems on Earth - they're often called the 'rainforests of the sea'!"
    },
    {
      type: "quiz",
      title: "Marine Species Discovery",
      content: "What's true about marine biodiversity and species discovery?",
      options: [
        "We've already discovered most marine species",
        "Biodiversity is limited to warm tropical areas",
        "There are likely millions of undiscovered marine species", 
        "All marine species live near the ocean surface"
      ],
      correctAnswer: 2,
      explanation: "Scientists estimate that we've only discovered about 5-20% of marine species. With vast unexplored areas like the deep ocean, there could be 1-2 million more species waiting to be discovered!"
    },
    {
      type: "text",
      title: "🌊 From Surface to Seafloor: Ocean Habitats",
      content: "The ocean contains Earth's most diverse range of habitats:\n\n**🌅 Sunlight Zone (0-200m)** - Coral reefs, kelp forests, and open ocean where most familiar marine life lives\n\n**🌙 Twilight Zone (200-1000m)** - Home to bioluminescent creatures and daily vertical migrations\n\n**🌚 Midnight Zone (1000-4000m)** - Pitch black waters with bizarre adaptations like giant squid\n\n**🏔️ Abyssal Zone (4000-6000m)** - Vast seafloor plains with specialized bottom-dwellers\n\n**🔥 Deep Ocean Trenches** - The deepest parts where life thrives in extreme conditions\n\n**🌋 Hydrothermal Vents** - Underwater geysers supporting unique life forms that don't need sunlight\n\nEach zone has its own unique communities of life!",
      highlight: "More people have been to space than to the deepest ocean trenches - yet these areas teem with life!"
    },
    {
      type: "quiz",
      title: "Why Biodiversity Matters",
      content: "Why is ocean biodiversity important for ecosystem health?",
      options: [
        "It mainly creates more colorful and pretty fish",
        "It keeps ecosystems healthy, resilient, and functional",
        "It only makes the ocean more interesting to look at",
        "Biodiversity doesn't really matter to ocean health"
      ],
      correctAnswer: 1,
      explanation: "Biodiversity is crucial for ecosystem resilience and stability. Different species perform different roles - some filter water, others cycle nutrients, and many serve as food sources. This diversity helps ecosystems recover from disturbances and continue functioning."
    },
    {
      type: "conclusion",
      title: "🌍 You're Now a Marine Biodiversity Champion!",
      content: "Incredible! You now understand that ocean biodiversity isn't just about pretty fish - it's about the complex, interconnected web of life that keeps our oceans healthy and our planet functioning.\n\n**What You Can Do:**\n\n**Support Marine Protected Areas** - These ocean parks allow ecosystems to recover and thrive\n\n**Be a responsible ocean visitor** - When snorkeling or diving, look but don't touch or damage marine life\n\n**Choose sustainable seafood** - Support fishing practices that protect biodiversity\n\n**Reduce pollution** - Less plastic and chemical pollution means healthier marine ecosystems\n\n**Learn about local species** - Discover what lives in your nearest ocean or waterway\n\n**Share your knowledge** - Help others appreciate the incredible diversity of ocean life\n\n**Support conservation** - Back organizations working to protect marine biodiversity\n\nRemember: protecting ocean biodiversity means protecting the foundation of life on Earth! 🌊"
    }
  ]
};

export const oceanLiteracyPrinciple6Lesson: EnhancedLesson = {
  id: "ocean-literacy-principle-6",
  title: "Ocean Literacy Principle 6: The Ocean and Humans Are Inextricably Interconnected",
  description: "Explore the deep connections between human society and ocean health, and our shared future",
  category: "ocean-literacy", 
  duration: 7,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "🔁 Welcome to Understanding Our Ocean Connection!",
      content: "You might not see the ocean every day, but it affects your life more than you might think - and your actions affect it in return. You're about to discover the invisible threads that connect every human to the ocean, no matter where you live!"
    },
    {
      type: "text",
      title: "🔁 How the Ocean Supports Human Life",
      content: "Even if you live far inland, the ocean is working for you every day:\n\n**💨 Oxygen Supply** - Over 50% of the oxygen you breathe comes from ocean phytoplankton\n\n**🌡️ Climate Regulation** - The ocean absorbs heat and carbon, stabilizing Earth's climate\n\n**🍤 Food Security** - Ocean fisheries directly support the livelihoods of over 3 billion people globally\n\n**🚢 Global Trade** - Around 90% of all international trade moves by sea - including the device you're reading this on!\n\n**🏖️ Cultural Identity** - Many coastal and Indigenous communities have spiritual and historical connections to the ocean spanning thousands of years\n\nThe ocean isn't separate from human society - it IS human society.",
      highlight: "Every second breath you take comes from the ocean - phytoplankton are working right now to keep you alive!"
    },
    {
      type: "text",
      title: "🚨 How Human Actions Impact the Ocean",
      content: "Our relationship with the ocean goes both ways. Human activities are changing ocean systems:\n\n**🗑️ Pollution** - Plastic waste, chemicals, agricultural runoff, and sewage harm marine life and ecosystems\n\n**🌡️ Climate Change** - Our carbon emissions cause ocean warming, acidification, and sea level rise\n\n**🎣 Overfishing** - Taking too many fish reduces populations and damages marine food webs\n\n**🔊 Noise Pollution** - Ships, sonar, and offshore industry disrupt marine animals' communication and navigation\n\n**🏗️ Coastal Development** - Building on coastlines destroys important marine habitats like mangroves and coral reefs\n\nThis is why ocean stewardship is a shared human responsibility - we all have a stake in ocean health.",
      highlight: "Plastic pollution is so widespread that microplastics have been found in the deepest ocean trenches and even in human blood!"
    },
    {
      type: "quiz",
      title: "Human-Ocean Connections",
      content: "Which statement about human-ocean connections is TRUE?",
      options: [
        "Humans rely on the ocean for trade, food, oxygen, and climate stability",
        "The ocean has little effect on human health and society",
        "Only people living near the coast are connected to the ocean",
        "Climate change doesn't really affect ocean systems"
      ],
      correctAnswer: 0,
      explanation: "Humans depend on the ocean for many essential services including oxygen production, climate regulation, food, transportation, and economic opportunities. These connections exist regardless of where people live on Earth."
    },
    {
      type: "quiz", 
      title: "Human Impacts on Ocean Health",
      content: "Which of the following is an example of how humans negatively impact the ocean?",
      options: [
        "Sustainable ecotourism that educates visitors",
        "Traditional fishing methods passed down through generations",
        "Research programs that study marine ecosystems",
        "Overfishing and plastic pollution"
      ],
      correctAnswer: 3,
      explanation: "Overfishing depletes fish populations and damages marine ecosystems, while plastic pollution harms marine life through entanglement, ingestion, and chemical contamination. Both represent unsustainable human impacts on ocean health."
    },
    {
      type: "text",
      title: "🌍 Coastal Communities and Ocean Culture",
      content: "For billions of people, the ocean isn't just an economic resource - it's home, heritage, and identity:\n\n**🏘️ Coastal Cities** - Over 40% of the world's population lives within 100km of the coast\n\n**🎣 Traditional Knowledge** - Indigenous and coastal communities have sustainable ocean management practices developed over thousands of years\n\n**🍱 Food Culture** - Ocean foods are central to the cuisine and culture of many societies\n\n**⛵ Maritime Heritage** - Seafaring, fishing, and ocean exploration shape the history and identity of many cultures\n\n**🏄 Recreation** - Surfing, diving, swimming, and boating connect millions of people to ocean experiences\n\nThese deep cultural connections mean that ocean health directly impacts human wellbeing and cultural continuity.",
      highlight: "Small island nations like the Maldives and Tuvalu could become uninhabitable due to sea level rise - their entire cultures are at risk!"
    },
    {
      type: "quiz",
      title: "Understanding Our Shared Future", 
      content: "Why is it important to understand our connection with the ocean?",
      options: [
        "So we can learn to swim and surf better",
        "So we can extract more resources from ocean systems",
        "Because ocean health affects our climate, food security, and future",
        "Because only marine scientists need to understand ocean systems"
      ],
      correctAnswer: 2,
      explanation: "Understanding our connection to the ocean helps us make informed decisions about climate action, sustainable consumption, and policies that affect both ocean health and human wellbeing. Our futures are interconnected."
    },
    {
      type: "conclusion",
      title: "🌱 You're Now an Ocean-Human Connection Expert!",
      content: "Excellent! You now understand that humans and the ocean share a common destiny. What affects the ocean affects us, and our choices shape ocean health for future generations.\n\n**What You Can Do:**\n\n**Choose sustainable seafood** - Look for certifications and ask about fishing methods\n\n**Reduce single-use plastics** - Bring reusable bags, bottles, and containers\n\n**Support coastal conservation** - Protect beaches, mangroves, and coral reefs\n\n**Learn from traditional knowledge** - Respect Indigenous and local ocean management practices\n\n**Make climate-conscious choices** - Reduce your carbon footprint to help prevent ocean acidification\n\n**Support ocean-friendly policies** - Vote for leaders who prioritize ocean protection\n\n**Share your knowledge** - Help others understand our shared connection to the ocean\n\n**Practice ocean citizenship** - Remember that every action, no matter how small, ripples through our interconnected world\n\nRemember: we are all ocean people, and the health of the ocean is our health! 🌊"
    }
  ]
};

export const oceanLiteracyPrinciple7Lesson: EnhancedLesson = {
  id: "ocean-literacy-principle-7",
  title: "Ocean Literacy Principle 7: The Ocean is Largely Unexplored",
  description: "Discover why most of our ocean remains a mystery and what new discoveries await",
  category: "ocean-literacy",
  duration: 6,
  difficulty: "Beginner", 
  steps: [
    {
      type: "intro",
      title: "🌊 Welcome to the Greatest Mystery on Earth!",
      content: "Despite covering over 70% of our planet, most of the ocean remains a complete mystery. In fact, more than 80% of the ocean is unmapped, unobserved, and unexplored. You're about to discover why we know more about the surface of Mars than we do about our own ocean depths!"
    },
    {
      type: "text",
      title: "🧠 Why Is Ocean Exploration So Difficult?",
      content: "Exploring the ocean presents unique challenges that make it one of the most difficult environments to study:\n\n**💪 Crushing Pressure** - The deeper you go, the more pressure builds up. At the deepest point, the pressure is like having 50 jumbo jets stacked on top of you!\n\n**🌑 Absolute Darkness** - Sunlight can't penetrate below about 1,000 meters, so most of the ocean is in permanent darkness\n\n**🤖 Technology Limits** - We need specialized submersibles, remotely operated vehicles (ROVs), and advanced sensors that can survive extreme conditions\n\n**💰 High Costs** - Ocean exploration requires expensive equipment and ships, making it difficult to fund comprehensive studies\n\nYet despite these challenges, every expedition reveals new discoveries!",
      highlight: "It costs more to explore one cubic kilometer of deep ocean than it does to send a mission to the Moon!"
    },
    {
      type: "text",
      title: "🌐 What We're Missing - and Finding!",
      content: "The unexplored ocean holds incredible secrets:\n\n**🦑 Unknown Species** - Scientists believe millions of species remain undiscovered, especially in the deep sea\n\n**🌋 Underwater Landscapes** - Vast mountain ranges, underwater volcanoes, and deep-sea canyons that dwarf anything on land\n\n**🏛️ Hidden History** - Shipwrecks and archaeological sites that tell stories of human exploration and trade\n\n**💎 New Resources** - Potential medicines from marine organisms and sustainable energy sources\n\n**🌡️ Climate Clues** - Coral reefs and deep-sea sediments that record Earth's climate history\n\nEvery dive reveals something new - from bioluminescent creatures to entirely new ecosystems!",
      highlight: "Scientists discover an average of 1,500 new marine species every year - and we've barely started exploring!"
    },
    {
      type: "quiz",
      title: "Ocean Exploration Facts",
      content: "How much of the ocean remains unexplored?",
      options: [
        "About 10% is still unexplored",
        "Around 50% remains mysterious",
        "Over 80% is unexplored",
        "Nearly all of it has been mapped and studied"
      ],
      correctAnswer: 2,
      explanation: "More than 80% of the ocean is unmapped, unobserved, and unexplored. We have better maps of Mars and the Moon than we do of our own ocean floor!"
    },
    {
      type: "quiz",
      title: "Challenges of Ocean Exploration",
      content: "Which is NOT a major challenge for ocean exploration?",
      options: [
        "Intense pressure at great depths",
        "Dense underwater forests blocking access",
        "Complete darkness in deep zones",
        "Expensive specialized technology requirements"
      ],
      correctAnswer: 1,
      explanation: "While kelp forests exist in some shallow areas, they don't block deep ocean exploration. The main challenges are pressure, darkness, and the need for expensive specialized equipment that can survive extreme deep-sea conditions."
    },
    {
      type: "text",
      title: "🔬 Why Ocean Exploration Matters",
      content: "Understanding our ocean has practical benefits for everyone:\n\n**💊 Medical Discoveries** - Marine organisms have already provided treatments for cancer, pain relief, and infections\n\n**🌡️ Climate Understanding** - Ocean exploration helps us understand and predict climate change impacts\n\n**🛡️ Natural Disaster Preparation** - Better ocean knowledge improves tsunami warnings and weather forecasting\n\n**🐠 Conservation** - We can't protect what we don't know exists - exploration identifies areas that need protection\n\n**♻️ Sustainable Resources** - Understanding ocean systems helps us use marine resources responsibly\n\n**🌱 Ecosystem Protection** - Discovering how ocean ecosystems work helps us maintain their health\n\nExploration equals protection - we need to understand the ocean to preserve it for future generations.",
      highlight: "Deep-sea creatures have already contributed to treatments for HIV, cancer, and Alzheimer's disease!"
    },
    {
      type: "quiz",
      title: "Why Explore the Ocean?",
      content: "Why is ocean exploration important for humanity?",
      options: [
        "Only so we can build more offshore oil platforms",
        "To better understand and protect marine ecosystems and climate",
        "Just to find treasure and precious metals",
        "So people can live underwater like in movies"
      ],
      correctAnswer: 1,
      explanation: "Ocean exploration helps us understand climate change, discover new medicines, improve weather prediction, protect vulnerable ecosystems, and use ocean resources sustainably. It's essential for environmental protection and human wellbeing."
    },
    {
      type: "conclusion",
      title: "🌱 You're Now an Ocean Exploration Advocate!",
      content: "Amazing! You now understand that the ocean is our planet's greatest frontier. While we've explored space and mapped distant planets, the vast majority of our own ocean remains mysterious and full of discoveries waiting to be made.\n\n**What You Can Do:**\n\n**Support marine research** - Follow and donate to organizations conducting ocean exploration\n\n**Join citizen science** - Participate in projects that log species sightings or ocean conditions\n\n**Stay curious and informed** - Read about new ocean discoveries and share them with others\n\n**Advocate for ocean science funding** - Support politicians and policies that fund ocean research\n\n**Visit aquariums and marine centers** - Learn about ocean exploration technologies and discoveries\n\n**Encourage young explorers** - Inspire others to pursue careers in marine science and exploration\n\n**Protect what we know** - Support conservation of the ocean areas we have explored and understand\n\n**Think like an explorer** - Maintain wonder and curiosity about the 80% of our planet that remains mysterious\n\n🎉 Congratulations! You've now completed all 7 Ocean Literacy Principles and become a true ocean champion! 🌊"
    }
  ]
};

export const jettyBiodiversityLesson: EnhancedLesson = {
  id: "jetty-biodiversity-lesson",
  title: "Biodiversity of Jetty Macro Ecosystems",
  description: "Why do jetty pylons attract so much marine life?",
  category: "reef-ecology",
  duration: 5,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "🌊 Welcome to Jetty Ecosystems!",
      content: "Have you ever dived under a jetty and seen it buzzing with life? Jetty pylons are underwater pillars of biodiversity. They may be man-made, but they mimic natural reef structures — creating the perfect environment for creatures like anemones, nudibranchs, flatworms, and small reef fish. These vertical habitats offer shelter, food, and breeding grounds."
    },
    {
      type: "text",
      title: "🏗️ What Makes Jetties Special?",
      content: "Jetty pylons create unique underwater habitats that attract diverse marine life:\n\n**🪨 Hard surface** - Pylons give animals something solid to cling to — like rocks on a reef\n\n**🌓 Shade and protection** - The overhead jetty blocks light, creating cool, safe spaces for shy species\n\n**📏 Vertical structure** - Offers microhabitats at different depths and light levels\n\n**🌊 Water movement** - Waves and tides help bring in nutrients and oxygen — perfect for filter feeders like sponges and sea squirts\n\nThese artificial structures become thriving underwater communities!",
      highlight: "Jetty pylons act like underwater apartment buildings, providing homes for hundreds of species!"
    },
    {
      type: "quiz",
      title: "Filter Feeders and Jetties",
      content: "Why do filter feeders love jetty pylons?",
      options: [
        "They grow better in the sand",
        "They need light to photosynthesise",
        "The moving water brings food particles",
        "They only live in freshwater"
      ],
      correctAnswer: 2,
      explanation: "Filter feeders like sponges and sea squirts depend on water movement to bring them tiny food particles. The tidal flow and wave action around jetty pylons creates the perfect feeding conditions for these creatures."
    },
    {
      type: "text",
      title: "🐠 Who Lives There?",
      content: "Jetty ecosystems are hotspots for macro life — small but spectacular species that thrive on and around pylons:\n\n**🌺 Anemones** - Use their tentacles to catch tiny food particles drifting by\n\n**🌈 Nudibranchs** - Colourful sea slugs that feed on sponges and sea squirts\n\n**🎭 Flatworms** - Graceful bottom dwellers with vivid patterns\n\n**🐟 Blennies & gobies** - Small fish that hide in cracks and crevices\n\n**🦄 Occasional visitors** - Seahorses, octopuses, and even cuttlefish\n\nThese creatures rely on the stability, structure, and nutrient flow that jetties provide.",
      highlight: "Nudibranchs are some of the most colorful and diverse creatures you'll find on jetty pylons!"
    },
    {
      type: "quiz",
      title: "Jetty Marine Life",
      content: "Which creature is a colourful sea slug found on jetty pylons?",
      options: [
        "Blenny",
        "Nudibranch",
        "Flatworm",
        "Sea urchin"
      ],
      correctAnswer: 1,
      explanation: "Nudibranchs are colorful sea slugs that are commonly found on jetty pylons. They feed on sponges, sea squirts, and other small organisms that grow on the hard surfaces of the pylons."
    },
    {
      type: "text",
      title: "🌊 The Bigger Picture",
      content: "Though artificial, jetties act like **urban reefs**, enhancing local biodiversity in areas where natural reefs might be scarce.\n\nBut they're not without risk:\n\n**🎣 Fishing lines and litter** - Can trap or injure marine life\n\n**⛈️ Storm damage** - Can break fragile growth\n\n**☠️ Pollution** - Affects water quality and animal health\n\nCommunity cleanups and responsible diving help protect these rich ecosystems.",
      highlight: "Jetties can increase local marine biodiversity by 200-300% compared to sandy or muddy bottoms!"
    },
    {
      type: "quiz",
      title: "Threats to Jetty Ecosystems",
      content: "What is one threat to jetty ecosystems?",
      options: [
        "Coral bleaching",
        "Marine heatwaves only",
        "Discarded fishing line and plastic",
        "Too much biodiversity"
      ],
      correctAnswer: 2,
      explanation: "Discarded fishing line and plastic waste are major threats to jetty ecosystems. They can entangle marine life, be ingested by animals, and degrade water quality in these important habitats."
    },
    {
      type: "conclusion",
      title: "🌱 You're Now a Jetty Ecosystem Expert!",
      content: "Excellent! You now understand how human-made structures like jetties can become thriving marine ecosystems. Every diver can help protect jetty biodiversity.\n\n**What You Can Do:**\n\n**Dive gently** - Don't kick up sediment or touch marine life\n\n**Remove debris** - Safely collect fishing line or trash if you find it\n\n**Share your sightings** - Log species observations with marine researchers or citizen science platforms\n\n**Support protection** - Encourage marine park protections for these unique spots\n\n**Spread awareness** - Help others understand the value of these urban reef systems\n\nRemember: every small action helps protect these incredible underwater communities! 🌊"
    }
  ]
};

export const southernRightWhaleMigrationLesson: EnhancedLesson = {
  id: "southern-right-whale-migration",
  title: "Southern Right Whales: Migration Mysteries",
  description: "Inspired by real-world research from the Southern Ocean",
  category: "species-identification",
  duration: 6,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "🐋 Welcome to Whale Migration Science!",
      content: "Southern right whales were once hunted nearly to extinction. While their numbers are now slowly recovering, there's still a big mystery: **Where do they go to feed during the summer?** Scientists know they come to the southern coast of Australia and New Zealand in winter to give birth, but their summer foraging grounds in the Southern Ocean are largely unknown. Tracking their migration could help protect them more effectively."
    },
    {
      type: "text",
      title: "🧭 How Scientists Are Solving the Mystery",
      content: "To understand these elusive journeys, scientists launched the **Tohorā Voyages** research project. Here's how they're gathering clues:\n\n**🛰️ Satellite tagging** - Tracks whale movements across thousands of kilometres\n\n**🧬 Skin sampling** - Reveals DNA, diet, and connections between populations\n\n**📸 Photo-ID** - Uses unique callosity patterns (like fingerprints!) to ID individuals\n\nOne whale, *Whitu*, travelled over **10,000 km** from the Auckland Islands to Esperance, WA — a surprising discovery that revealed unexpected connections between whale populations!",
      highlight: "Individual whales can be identified by unique callosity patterns on their heads - like fingerprints!"
    },
    {
      type: "text",
      title: "🌐 Why This Research Matters",
      content: "Understanding migration patterns helps with:\n\n**🛡️ Protecting key feeding grounds** - Conservation efforts can focus on critical areas\n\n**🌏 Connecting populations** - Links whale communities across Australia and NZ\n\n**🩺 Monitoring whale health** - Tracks diet quality and population recovery\n\n**📋 Supporting conservation plans** - Provides data for national protection strategies\n\nIt also helps us update photo databases and understand how human activity affects these endangered whales.",
      highlight: "Some rare 'white' whale calves appear along WA's coast - they're not albino, just naturally pale!"
    },
    {
      type: "quiz",
      title: "Whale Migration Mystery",
      content: "What is the main mystery about southern right whales?",
      options: [
        "Where they mate",
        "Where they feed",
        "How long they live",
        "What they sound like"
      ],
      correctAnswer: 1,
      explanation: "Scientists know southern right whales come to Australian and New Zealand coasts in winter to give birth, but their summer feeding grounds in the Southern Ocean remain largely unknown. This makes it difficult to protect their full habitat range."
    },
    {
      type: "quiz",
      title: "Whale Identification",
      content: "What is used to identify individual whales?",
      options: [
        "Their tail size",
        "Their callosity patterns",
        "Their songs",
        "Their weight"
      ],
      correctAnswer: 1,
      explanation: "Scientists use callosity patterns - the unique arrangements of rough skin patches on whales' heads - to identify individuals. These patterns are like fingerprints and remain consistent throughout a whale's life."
    },
    {
      type: "quiz",
      title: "Wildlife Protection",
      content: "Why should you stay 500m away from white whale calves?",
      options: [
        "They're dangerous",
        "They attract sharks",
        "They're very shy",
        "They're easily disturbed"
      ],
      correctAnswer: 3,
      explanation: "White whale calves and their mothers are easily disturbed by human presence. Staying 500m away prevents stress and allows them to feed, rest, and bond naturally without interruption."
    },
    {
      type: "conclusion",
      title: "🌱 You're Now a Whale Migration Expert!",
      content: "Fantastic! You now understand the importance of tracking whale migrations for conservation. You don't need a research vessel to make a difference!\n\n**What You Can Do:**\n\n**🐋 Learn responsible whale watching** - Maintain safe distances and follow guidelines\n\n**📸 Log sightings** - Report whale observations to citizen science databases\n\n**📢 Share the story** - Help others understand southern right whale conservation\n\n**🧠 Support research** - Back marine conservation efforts and research funding\n\n**🌊 Protect marine habitats** - Support marine protected areas where whales feed and breed\n\nRemember: every whale sighting helps scientists piece together the migration puzzle! 🌊"
    }
  ]
};

export const southernRightWhaleClimateLesson: EnhancedLesson = {
  id: "southern-right-whale-climate",
  title: "Southern Right Whales: Tracking Climate Change",
  description: "How warming oceans affect whale migration patterns",
  category: "conservation",
  duration: 8,
  difficulty: "Beginner",
  steps: [
    {
      type: "intro",
      title: "🌡️ Welcome to Climate Change Marine Research!",
      content: "Southern right whales were almost wiped out by hunting in the 1800s. Protected since 1935, they're slowly coming back—but they now face a new threat: **climate change.** Scientists are racing to answer big questions: Where exactly do they feed? How might warmer oceans affect their food supply? Could this impact their ability to reproduce? These answers are hidden in their migration paths—many of which stretch over **6,500 km** into the Southern Ocean."
    },
    {
      type: "text",
      title: "🔬 How the Research Works",
      content: "To understand where whales go and why, scientists use a combination of cutting-edge techniques:\n\n**🛰️ Satellite tags** - Track whales as they travel to feeding grounds in Antarctica, the **Kerguelen Islands**, and **Crozet Islands**\n\n**🧬 Genetic samples** - Reveal connections between whales in Australia, New Zealand, and even **South Africa**\n\n**⚗️ Stable isotope analysis** - Tells scientists what the whales are eating and where they've been feeding\n\nThe projects have meaningful names: **Tohorā Voyages** (New Zealand – 'whale journeys') and **Mirnong Maat** (Australia – 'whale travel path' in Noongar language).",
      highlight: "Whale tracking technology can follow individual whales across entire ocean basins!"
    },
    {
      type: "text",
      title: "🌍 What We're Learning",
      content: "Southern right whales are revealing surprising new migration patterns:\n\n**🗺️ Diverse destinations** - Some travel to completely different places, not just Antarctica but also to the **Kerguelen Islands** and **Crozet Islands**\n\n**🌏 International connections** - Significant overlap in feeding zones used by whales from **Australia, New Zealand, and South Africa**\n\n**🔗 Unexpected links** - One whale from New Zealand (*Whitu*) even reached shallow coastal waters off WA\n\nBut there's a challenge: as **climate change warms the ocean**, prey like **copepods and krill** may shift or decline. If whales can't find enough high-quality food, it affects their ability to reproduce.",
      highlight: "Climate change could force whales to travel even further to find food, using more energy and affecting reproduction!"
    },
    {
      type: "quiz",
      title: "Climate Change Threats",
      content: "What major environmental threat are southern right whales now facing?",
      options: [
        "Plastic pollution",
        "Boat strikes",
        "Climate change and warming oceans",
        "Noise pollution"
      ],
      correctAnswer: 2,
      explanation: "While whales face multiple threats, climate change and warming oceans are now the major concern. Warmer waters affect the distribution and abundance of their food sources, potentially impacting their ability to feed and reproduce successfully."
    },
    {
      type: "quiz",
      title: "Research Methods",
      content: "What do scientists study to understand whale diets and movement?",
      options: [
        "Their breathing",
        "Satellite photos",
        "Whale songs",
        "Skin and tissue samples"
      ],
      correctAnswer: 3,
      explanation: "Scientists analyze skin and tissue samples to extract genetic information, conduct stable isotope analysis to understand diet, and track population connections. These biological samples provide detailed information about whale behavior and ecology."
    },
    {
      type: "text",
      title: "🏖️ Protecting Critical Coastal Areas",
      content: "The **coastal areas** whales pass through before heading into the Southern Ocean are essential for resting and feeding. Key locations include:\n\n**🌊 Esperance** - Important stopover for migrating whales\n\n**🏝️ Augusta** - Coastal feeding and resting area\n\n**🐋 Cheynes Beach** - Proposed marine protected zone\n\n**🌊 Bremer Bay** - Critical whale habitat\n\n**🌅 Twilight Cove** - Part of proposed protection areas\n\nThese areas may soon become **marine protected zones** to help safeguard whale journeys and support the **Large Whale Disentanglement Team** in rescue operations.",
      highlight: "Coastal protection zones are vital stepping stones for whales on their epic ocean journeys!"
    },
    {
      type: "quiz",
      title: "Coastal Importance",
      content: "Why are coastal zones important for southern right whales?",
      options: [
        "They mate there",
        "They store food there",
        "They use them before long migrations",
        "They avoid predators there"
      ],
      correctAnswer: 2,
      explanation: "Coastal zones serve as important stopover points where whales rest and feed before undertaking their long migrations to feeding grounds in the Southern Ocean. These areas provide crucial energy reserves for the journey ahead."
    },
    {
      type: "conclusion",
      title: "🌱 You're Now a Climate-Ocean Expert!",
      content: "Amazing! You now understand how climate change affects whale migration and the importance of protecting their journey routes. Even from shore, you can make a difference for whales adapting to a changing planet.\n\n**What You Can Do:**\n\n**🌡️ Support climate action** - Reduce your carbon footprint to protect ocean ecosystems\n\n**📍 Advocate for marine protection** - Support marine protected areas in southern Australia\n\n**📸 Join citizen science** - Log whale sightings to help research databases\n\n**🎓 Share knowledge** - Help others understand the link between climate and marine life\n\n**🐋 Practice responsible whale watching** - Follow guidelines to avoid disturbing whales\n\nRemember: protecting whales means protecting our changing oceans! 🌊"
    }
  ]
};

export const enhancedLessons = [
  bottomTrawlingLesson,
  leeuwincurrentLesson,
  westernRockLobsterLesson,
  oceanLiteracyPrinciple1Lesson,
  oceanLiteracyPrinciple2Lesson,
  oceanLiteracyPrinciple3Lesson,
  oceanLiteracyPrinciple4Lesson,
  oceanLiteracyPrinciple5Lesson,
  oceanLiteracyPrinciple6Lesson,
  oceanLiteracyPrinciple7Lesson,
  jettyBiodiversityLesson,
  southernRightWhaleMigrationLesson,
  southernRightWhaleClimateLesson,
  highSeasTreatyLesson
];