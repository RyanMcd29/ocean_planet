import { db } from './server/db';
import { species } from './shared/schema';
import { eq } from 'drizzle-orm';

const speciesFunFacts = {
  'Australian Sea Lion': [
    '🌏 Only pinniped species endemic to Australia, found exclusively along southern and western coastlines',
    '📉 Endangered with only around 12,000 individuals remaining worldwide',
    '🍼 Longest breeding cycle among marine mammals - 17.6 months gestation plus 18 months nursing',
    '🏠 Females show strong site fidelity, returning to birthplace to breed',
    '🐾 Males are 3x larger than females and have distinctive yellowish manes',
    '🍽️ Dive up to 150 meters hunting fish, squid, octopus, and even small sharks',
    '🗣️ Use unique vocal cues for mother-pup recognition in crowded colonies',
    '🦴 Their nutrient-rich feces support marine ecosystems by promoting phytoplankton growth'
  ],
  'Bearded Seal': [
    '🧔 Distinctive whiskers can grow up to 12 inches long for finding food on the ocean floor',
    '🏊 Can dive up to 500 meters deep and hold their breath for 20 minutes',
    '🦐 Use sensitive whiskers to locate clams and crabs in murky Arctic waters',
    '🧊 Essential Arctic species adapted to life on sea ice',
    '📏 Can grow up to 2.5 meters long and weigh up to 450kg',
    '🎣 Important subsistence hunting species for Indigenous communities'
  ],
  'Harbor Seal': [
    '🐕 Dog-like faces make them easily recognizable and endearing to humans',
    '😴 Can sleep underwater by floating vertically and coming up to breathe unconsciously',
    '🏊 Excellent swimmers capable of diving up to 500 meters deep',
    '⏰ Can hold their breath for up to 30 minutes while hunting',
    '👶 Pups can swim within hours of being born',
    '🏖️ Most common seal species in many coastal areas worldwide'
  ],
  'Leopard Seal': [
    '🦎 Distinctive spotted pattern and massive head make them apex Antarctic predators',
    '🐧 Only seal species that regularly hunts warm-blooded prey like penguins',
    '🎯 Have been observed "playing" with penguins before eating them',
    '📏 Can grow up to 3.5 meters long and weigh up to 600kg',
    '🦈 Powerful jaws with sharp teeth designed for hunting marine mammals',
    '🧊 Solitary hunters that patrol Antarctic ice edges'
  ],
  'Harp Seal': [
    '👶 Famous for adorable white fluffy pups with big black eyes',
    '🌈 Baby seals are born yellow, turn white within days, then develop adult coloration',
    '🎭 Adults have distinctive harp-shaped dark markings on their backs',
    '🗺️ Undertake one of the longest migrations of any seal - up to 8,000 km annually',
    '🧊 Expert ice navigators that follow the Arctic ice edge seasonally',
    '🏊 Strong swimmers that can dive up to 300 meters deep'
  ],
  'Ringed Seal': [
    '💍 Distinctive ring patterns on their fur make each individual unique',
    '🏠 Only seal species that can maintain breathing holes in solid ice using their claws',
    '🐻 Primary prey species for polar bears - crucial Arctic food chain link',
    '🏔️ Create snow caves above breathing holes to protect their pups',
    '⏳ Can live up to 45 years in the harsh Arctic environment',
    '🦭 Smallest Arctic seal species, perfectly adapted to sea ice life'
  ],
  'Walrus': [
    '🦴 Tusks can grow up to 1 meter long and are used for hauling out of water',
    '🏋️ Can weigh up to 1,700kg - among the largest pinnipeds',
    '😴 Can sleep while floating vertically in water',
    '❄️ Can slow their heart rate to survive in frigid Arctic waters',
    '🧊 Use tusks to break through ice and establish social dominance',
    '👥 Highly social animals that gather in large herds on ice floes'
  ],
  'Weddell Seal': [
    '🌍 Southernmost dwelling mammal on Earth',
    '🏊 Can dive deeper than 700 meters - deeper than most seals',
    '⏰ Hold their breath for over 80 minutes - longer than any other seal',
    '🦷 Use their teeth to keep breathing holes open in Antarctic ice',
    '🧊 Can live their entire lives under ice in Antarctica',
    '🔍 Have excellent underwater vision adapted for dark depths'
  ],
  'Northern Elephant Seal': [
    '👃 Males have distinctive inflatable proboscis that amplifies their calls',
    '🗺️ Undertake epic migrations up to 20,000 km annually',
    '🏊 Can dive to depths over 1,500 meters hunting for squid',
    '🐍 Molt their entire skin and fur in one piece annually',
    '📏 Males can be 6 times heavier than females',
    '🌊 Spend 90% of their lives in the open ocean'
  ],
  'Southern Elephant Seal': [
    '🏆 Largest seal species in the world',
    '🏋️ Males can weigh up to 4,000kg - as much as a small car',
    '🏊 Phenomenal divers reaching depths over 2,000 meters',
    '⏰ Can hold their breath for up to 2 hours while hunting',
    '🌊 Spend 90% of their lives underwater in the open ocean',
    '👃 Males have inflatable trunk-like noses for territorial displays'
  ],
  'California Sea Lion': [
    '🎪 Most trainable pinnipeds - commonly seen in marine shows',
    '🏊 Can reach swimming speeds of 40 km/h underwater',
    '🤸 Famous for acrobatic abilities and playful behavior',
    '🏊 Can dive to depths of 300 meters hunting for fish',
    '🧠 Highly intelligent with excellent problem-solving abilities',
    '🎬 Most commonly featured sea lions in movies and TV shows'
  ],
  'Galápagos Sea Lion': [
    '🌎 Only sea lion species that lives at the equator',
    '🏝️ Endemic to the Galápagos Islands volcanic shores',
    '🏊 Can dive to depths of 180 meters in tropical waters',
    '👥 Very social and curious around humans',
    '🌡️ Adapted to tropical climate unlike other sea lion species',
    '⚠️ Endangered species facing threats from climate change'
  ],
  'Steller Sea Lion': [
    '🏆 Largest sea lion species with males weighing up to 1,000kg',
    '🗣️ Incredibly vocal - can be heard roaring from over 1km away',
    '🏊 Can dive to depths of 400 meters hunting for fish',
    '🦶 Can rotate rear flippers forward to "walk" on land',
    '👂 Have external ear flaps unlike true seals',
    '🌊 Found throughout the North Pacific Ocean'
  ],
  'Northern Fur Seal': [
    '🧥 Densest fur of any mammal - up to 300,000 hairs per square inch',
    '🗺️ Highly migratory, traveling thousands of kilometers annually',
    '🏊 Can dive to depths of 200 meters hunting for fish and squid',
    '🌊 Spend most of their lives in the open ocean',
    '❄️ Incredibly thick fur provides insulation in cold waters',
    '📊 Population has declined significantly due to commercial hunting'
  ],
  'Antarctic Fur Seal': [
    '🧥 Incredibly dense fur with up to 300,000 hairs per square inch',
    '🏔️ Can rotate hind flippers forward to climb steep rocky shores',
    '🔄 Made amazing recovery from near extinction due to hunting',
    '🏊 Can dive to depths of 200 meters hunting for krill and fish',
    '🧊 Highly successful in sub-Antarctic island environments',
    '👥 Form massive breeding colonies during summer months'
  ],
  'New Zealand Fur Seal': [
    '🌳 Only fur seal that regularly climbs trees to rest',
    '🏔️ Excellent climbing abilities on steep rocky cliffs',
    '🏊 Can dive to depths of 238 meters hunting for fish',
    '🌿 Sometimes found resting in coastal forests',
    '👥 Very social animals forming large coastal colonies',
    '🎯 Agile hunters with excellent underwater maneuverability'
  ],
  'Guadalupe Fur Seal': [
    '🔄 Amazing comeback from just 14 individuals to over 40,000 today',
    '💀 Was thought extinct until rediscovered in 1954',
    '🏊 Can dive to depths of 200 meters hunting for fish',
    '🦭 Very dense fur and distinctive pointed snouts',
    '🏝️ Endemic to Guadalupe Island off California',
    '🌟 One of the greatest conservation success stories'
  ],
  'Galápagos Fur Seal': [
    '🌡️ Only fur seal living in tropical waters year-round',
    '🦭 Smallest fur seal species, adapted to equatorial climate',
    '🌙 Active during cooler nighttime hours to avoid heat',
    '🏊 Can dive to depths of 100 meters in tropical waters',
    '🏝️ Endemic to the Galápagos Islands lava shores',
    '⚠️ Endangered due to climate change and El Niño events'
  ],
  'Crabeater Seal': [
    '🦐 Despite their name, they actually eat krill, not crabs',
    '🌍 Most numerous large mammal on Earth after humans',
    '🦷 Have specialized teeth for filter-feeding on krill',
    '🏊 Incredibly agile swimmers in Antarctic waters',
    '⏳ Can live up to 40 years in the harsh Antarctic environment',
    '🧊 Perfectly adapted to life on Antarctic pack ice'
  ],
  'Ross Seal': [
    '👁️ Have the largest eyes of any seal species',
    '🎵 Only seal that can make trilling sounds like a bird',
    '🧥 Have the thickest fur of any seal for Antarctic survival',
    '🏊 Excellent divers in heavy Antarctic pack ice',
    '🔍 Rarest and least known Antarctic seal species',
    '🎭 Distinctive large eyes and short snout make them unique'
  ],
  'Mediterranean Monk Seal': [
    '🌊 Only seal species native to the Mediterranean Sea',
    '💀 One of the most endangered marine mammals with fewer than 700 individuals',
    '🏊 Can dive to depths of 250 meters hunting for fish',
    '🏖️ Prefer secluded sea caves and hidden beaches',
    '🏛️ Have coexisted with humans for thousands of years',
    '🚨 Critically endangered due to human activities'
  ],
  'Hawaiian Monk Seal': [
    '🏝️ Only native land mammal to Hawaii',
    '🚨 Critically endangered with only about 1,400 individuals remaining',
    '⏰ Can stay underwater for up to 20 minutes while hunting',
    '🏖️ Prefer sandy beaches and coral reef environments',
    '🌺 Endemic to Hawaiian waters and found nowhere else',
    '👥 Very important cultural species to Native Hawaiians'
  ]
};

async function updateSpeciesFunFacts() {
  console.log('Starting fun facts update...');
  
  for (const [commonName, funFactsList] of Object.entries(speciesFunFacts)) {
    try {
      const result = await db.update(species)
        .set({ funFacts: funFactsList })
        .where(eq(species.commonName, commonName));
      
      console.log(`Updated fun facts for ${commonName}`);
    } catch (error) {
      console.error(`Failed to update ${commonName}:`, error);
    }
  }
  
  console.log('Fun facts update completed!');
}

updateSpeciesFunFacts();