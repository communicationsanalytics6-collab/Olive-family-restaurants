export interface AlmanacPage {
  id: number;
  title: string;
  category: 'Heritage' | 'Quality' | 'Family' | 'Expansion' | 'Guest Rewards';
  icon: string;
  readTime: string;
  summary: string;
  fullContent: string;
  imageUrl: string;
  interactiveType?: 'quiz' | 'calculator' | 'form' | 'feedback' | 'pairing' | 'franchise' | 'allergen';
}

export const ALMANAC_PAGES: AlmanacPage[] = [
  {
    id: 1,
    title: "The Legend of the Golden Shield",
    category: "Heritage",
    icon: "Shield",
    readTime: "3 Mins",
    summary: "How Spur's premium beef standards since 1967 became the global benchmark for steakhouse excellence.",
    fullContent: "For over five decades, the Spur Golden Shield has symbolized our unyielding commitment to premium beef. Established in 1967, our founders believed that a great steak isn't just about cooking; it's about selected cuts, natural maturation, and precise flame temperatures. Every steak served with our shield has passed rigorous quality tests, ensuring a tender, juicy bite every single time.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    interactiveType: "quiz"
  },
  {
    id: 2,
    title: "The 21-Day Wet-Aging Masterclass",
    category: "Heritage",
    icon: "Award",
    readTime: "4 Mins",
    summary: "Discover the biochemistry and careful temperature controls behind our legendary 21-day aging process.",
    fullContent: "At Spur, we never freeze our premium beef. Instead, our steaks undergo a specialized wet-aging process for exactly 21 days in vacuum-sealed chambers kept between 0°C and 2°C. During this time, natural enzymes slowly break down complex muscle fibers, dramatically increasing tenderness and concentrating the natural, robust beef flavors.",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800",
    interactiveType: "calculator"
  },
  {
    id: 3,
    title: "The Coal-Ember Flame-Grilling Science",
    category: "Heritage",
    icon: "Flame",
    readTime: "3 Mins",
    summary: "Why searing our prime steaks at 450°C locks in natural juices better than pan-frying.",
    fullContent: "Pan frying cooks a steak in its own rendered fat, but flame grilling over white-hot embers sears the exterior instantly. This rapid searing creates the 'Maillard Reaction'—a chemical reaction between amino acids and reducing sugars that gives the steak its distinctive brown crust and rich flavor profile, while trapping moisture inside.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Our Secret BBQ Basting Formula",
    category: "Heritage",
    icon: "Utensils",
    readTime: "2 Mins",
    summary: "The secret blend of tomatoes, sweet spices, and vinegar that defines the signature Spur glaze.",
    fullContent: "It's the flavor that launched a thousand cravings. Our signature sweet-and-tangy BBQ basting sauce is a proprietary recipe containing premium vine-ripened tomatoes, brown sugar, select cider vinegars, and a secret blend of herbs. Each steak is basted repeatedly while on the grill, caramelizing the glaze into the sear.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "The Durky Sauce Heritage",
    category: "Heritage",
    icon: "Flame",
    readTime: "3 Mins",
    summary: "Tracing the origins of our signature hot & spicy buffalo wing coating with its tangy kick.",
    fullContent: "Durky Sauce is a culinary icon. Born out of a desire to pair spicy heat with a smooth, vinegar-rich tang, this glaze is slow-simmered with cayenne peppers, garlic, and vinegar. It coats our legendary Buffalo wings, creating a crispy-saucy balance that is best enjoyed alongside our creamy blue cheese dressing.",
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Hickory Wood Selection & Smoking",
    category: "Heritage",
    icon: "Award",
    readTime: "4 Mins",
    summary: "How woodfired curing gives our famous ribs their authentic sweet hickory smoked undertone.",
    fullContent: "Our famous pork and beef ribs are slow-cooked in specialized smoking chambers fueled by natural hickory hardwood. Hickory wood produces a sweet, intense smoke that permeates the meat, creating a beautiful pink 'smoke ring' beneath the crust and establishing the perfect flavor canvas for our BBQ glaze.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 7,
    title: "The Legendary Toasted Onion Rings",
    category: "Heritage",
    icon: "Utensils",
    readTime: "2 Mins",
    summary: "The culinary craftsmanship required to achieve our feather-light, ultra-crispy battered onion rings.",
    fullContent: "Spur onion rings are world-famous. We slice fresh colossal white onions daily, soak them in an ice-water bath to reduce sharpness, dip them in a proprietary milk batter, and dust them in seasoned flour before frying. This multi-step process gives them their signature airy, crispy crunch.",
    imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 8,
    title: "The Nigerian Spice Blend Infusion",
    category: "Heritage",
    icon: "CheckCircle",
    readTime: "3 Mins",
    summary: "How our culinary experts blend authentic Nigerian peppers and spices into the steakhouse experience.",
    fullContent: "While preserving Spur's global South African heritage, our master chefs in Lagos and Abuja have infused subtle Nigerian spices. Selected menu items include local aromatic blends, bird's eye chilies, and hand-ground ginger, offering an authentic regional kick that matches local preferences perfectly.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    interactiveType: "pairing"
  },
  {
    id: 9,
    title: "Obudu Cattle Ranch Partnership",
    category: "Quality",
    icon: "MapPin",
    readTime: "4 Mins",
    summary: "Our deep alliance with local high-altitude meadows in Cross River State for pasture-raised beef.",
    fullContent: "We are extremely proud to partner with local Nigerian cattle farms, including sustainable grazing projects on the scenic Obudu Plateau. The cool, high-altitude climate and mineral-rich pastures provide the perfect healthy grazing environment, yielding premium, lean local beef that meets Spur's international standards.",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 10,
    title: "Traceability: From Meadow to Sizzle",
    category: "Quality",
    icon: "Shield",
    readTime: "3 Mins",
    summary: "Learn about our end-to-end cattle tracing system that ensures absolute safety and quality.",
    fullContent: "Traceability is the cornerstone of trust. Every batch of beef received at our Nigeria outlets can be traced back to its specific farm, processing date, and wet-aging batch. This transparent system ensures that every plate served complies with the highest international safety standards.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 11,
    title: "Premium Cold-Chain Logistics",
    category: "Quality",
    icon: "Compass",
    readTime: "3 Mins",
    summary: "Keeping our aging steaks consistently cold under 2°C with state-of-the-art cold carrier systems.",
    fullContent: "The secret to fresh meat is an unbroken cold chain. From processing to our kitchens, our beef is transported in specialized refrigerated containers with live digital temperature monitoring. If the temperature deviates even slightly from the optimal 1°C, our safety alarms trigger an automatic inspection.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 12,
    title: "The Halal Sourcing Certification",
    category: "Quality",
    icon: "CheckCircle",
    readTime: "2 Mins",
    summary: "Ensuring 100% certified Halal meat prep across our entire Nigerian restaurant network.",
    fullContent: "At Spur Steak Ranches Nigeria, inclusivity is vital. All our beef, lamb, and chicken products are sourced exclusively from fully certified Halal suppliers, ensuring clean processing and preparation standards that respect and support our diverse local communities.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 13,
    title: "Vanguard Vegetable Farms",
    category: "Quality",
    icon: "MapPin",
    readTime: "3 Mins",
    summary: "How fresh lettuce, crunchy cucumbers, and juicy tomatoes are delivered daily from Jos Farms.",
    fullContent: "Our salads and burger garnishes are sourced from family farms in Jos, Plateau State, where the rich volcanic soil produces crisp, flavorful vegetables. Dispatched at dawn, these vegetables arrive at our kitchens daily, keeping their crisp textures and high nutrient values intact.",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 14,
    title: "Artisanal Bakery & Bun Sourcing",
    category: "Quality",
    icon: "Utensils",
    readTime: "2 Mins",
    summary: "Baking our signature golden sesame brioche buns with organic yeast and premium wheat.",
    fullContent: "A burger is only as good as its bun. Our brioche sesame buns are baked fresh daily by local bakeries using a traditional slow-fermentation dough. This produces a soft, pillowy texture that stands up beautifully to our juicy patties without becoming soggy.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 15,
    title: "Water Purification & Food Safety",
    category: "Quality",
    icon: "Shield",
    readTime: "3 Mins",
    summary: "Our 5-stage reverse osmosis system protecting our diners from waterborne impurities.",
    fullContent: "Food safety extends to every drop of water used. Each Spur outlet in Nigeria features a top-tier 5-stage reverse osmosis filtration system. This guarantees that all ice, soda mixes, and washing water are completely pure and free from pollutants.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 16,
    title: "Eco-Friendly Packaging Initiative",
    category: "Quality",
    icon: "Gift",
    readTime: "3 Mins",
    summary: "Moving to compostable sugarcane pulp containers for our takeaway steak platters.",
    fullContent: "As part of our commitment to Nigeria's environment, we are phasing out single-use plastics. Our new takeaway containers are crafted from organic sugarcane pulp, which is completely biodegradable and provides superior heat retention for takeaway orders.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 17,
    title: "Play Canyon Safety Standards",
    category: "Family",
    icon: "Users",
    readTime: "4 Mins",
    summary: "Inside our child supervision protocols, biometric wristbands, and soft padding safety guides.",
    fullContent: "The Play Canyon is a wonderland for kids and a haven of peace for parents. We employ full-time, trained child-minders to supervise play. Every child is registered with a biometric wristband that matches their parents, ensuring a secure, worry-free environment.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 18,
    title: "The Kids Club Loyalty Portal",
    category: "Family",
    icon: "Gift",
    readTime: "2 Mins",
    summary: "Registering your children for free birthday meals, ice cream, and exclusive play passes.",
    fullContent: "Join the Spur Kids Club! Registered children receive a free meal, a premium soda, and a custom ice cream cup on their birthday, plus double points on any kids menu item throughout the year. It's our way of saying thank you to our littlest fans.",
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 19,
    title: "Interactive Tablet & Arcade Games",
    category: "Family",
    icon: "Users",
    readTime: "3 Mins",
    summary: "A tour of our safe educational digital play stations inside the kid zone.",
    fullContent: "Our Play Canyon blends classic physical climbing gyms with safe, modern digital fun. We feature educational multi-touch tablets, fun interactive virtual screens, and classic arcade cabinets, all curated for positive and educational young entertainment.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 20,
    title: "Spur Kids Birthday Packages",
    category: "Family",
    icon: "Gift",
    readTime: "3 Mins",
    summary: "Check out our custom party themes, party boxes, balloons, and delicious cake selections.",
    fullContent: "Host the ultimate birthday bash at Spur! We offer all-inclusive packages featuring customized invites, helium balloon setups, specialized kid party boxes with toys, and our signature sparkler ice cream cake, all managed by your dedicated party host.",
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800",
    interactiveType: "form"
  },
  {
    id: 21,
    title: "The Secret Story of Chief Spur",
    category: "Family",
    icon: "Award",
    readTime: "3 Mins",
    summary: "The heartwarming tale of our beloved mascot, his tribal values, and his message of unity.",
    fullContent: "Chief Spur is more than a mascot; he represents unity, family, and warmth. His story teaches kids the values of sharing, respecting nature, and gathering around a warm meal. Look out for Chief Spur during our special weekend brand parades!",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 22,
    title: "Art & Craft Coloring Manuals",
    category: "Family",
    icon: "Utensils",
    readTime: "2 Mins",
    summary: "Get free downloadable coloring cards and brain teasers to keep children engaged.",
    fullContent: "Keep the young minds sharp! We provide complimentary coloring mats and crayons at every table, featuring educational crosswords, maze puzzles, and local history trivia, designed by child development experts.",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 23,
    title: "Diaphragmatic Focus for Parents",
    category: "Family",
    icon: "Shield",
    readTime: "3 Mins",
    summary: "How Spur's unique acoustics and layouts create a peaceful dining space for busy parents.",
    fullContent: "We understand that parents need relaxation. Our seating layouts are strategically designed with high-back booths that damp sound, providing a peaceful, private dining pocket where you can unwind while your kids play safely under expert supervision.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 24,
    title: "Toddler-Safe Soft Play Area",
    category: "Family",
    icon: "Users",
    readTime: "2 Mins",
    summary: "Our toddler-only soft zone featuring antimicrobial padded crawling blocks.",
    fullContent: "For infants and toddlers under 3, we feature a fully separated soft-play area. This zone has extra thick impact-absorbing floor pads, chemical-free wooden activity cubes, and zero small items, ensuring complete safety.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 25,
    title: "The Abuja Flagship Ranch Tour",
    category: "Expansion",
    icon: "MapPin",
    readTime: "4 Mins",
    summary: "A virtual tour of our sprawling architectural masterpiece in the heart of Wuse II.",
    fullContent: "Our Abuja flagship ranch is a celebration of modern design and warm wood aesthetics. Spanning over two floors, it features state-of-the-art exhibition kitchens, a colossal climbing canyon, and luxury private booths, establishing itself as the premier family dining venue in FCT.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1600"
  },
  {
    id: 26,
    title: "Lagos Victoria Island Oceanside Ranch",
    category: "Expansion",
    icon: "MapPin",
    readTime: "3 Mins",
    summary: "Enjoying the sea breeze alongside premium steaks at our stunning coastal steakhouse.",
    fullContent: "Located on Sanusi Fafunwa St, our Victoria Island ranch brings the best of flame-grilled dining to the Atlantic coast. It is the perfect spot for corporate lunches, Sunday family get-togethers, and evening romantic dinners under the stars.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 27,
    title: "Ikeja Mall Family Hub",
    category: "Expansion",
    icon: "MapPin",
    readTime: "3 Mins",
    summary: "The heartbeat of family weekend entertainment on the busy Lagos Mainland.",
    fullContent: "Our Ikeja City Mall branch is a mainland legend. Serving thousands of happy families every weekend, it features high-capacity seating and our largest Play Canyon, making it a staple of Mainland family culture.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 28,
    title: "Port Harcourt Oil City Ranch",
    category: "Expansion",
    icon: "MapPin",
    readTime: "3 Mins",
    summary: "Bringing our warm hospitality and legendary ribs to the heart of Rivers State.",
    fullContent: "Our Port Harcourt outlet delivers our famous ribs and wings to the south-south region. Known for its lively atmosphere and premium steak cuts, it has quickly become the city's favorite gathering spot.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 29,
    title: "Upcoming Ranches (Kano & Enugu)",
    category: "Expansion",
    icon: "Compass",
    readTime: "3 Mins",
    summary: "Sneak peek into our architectural plans and construction timelines for 2026.",
    fullContent: "We are expanding! Construction is underway for our new state-of-the-art ranches in Kano and Enugu. These branches will feature regional menu items and our signature play canyons, opening by late 2026.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 30,
    title: "Nigeria Franchise Partnership Opportunities",
    category: "Expansion",
    icon: "Award",
    readTime: "5 Mins",
    summary: "How to apply, financial requirements, and brand support systems to open a Spur outlet.",
    fullContent: "Spur Steak Ranches is one of Africa's most successful franchises. We offer comprehensive support, including site selection, staff training, marketing campaigns, and supply chain management, ensuring your outlet operates to elite international standards.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800",
    interactiveType: "franchise"
  },
  {
    id: 31,
    title: "The Spur Chef Training Academy",
    category: "Expansion",
    icon: "Utensils",
    readTime: "4 Mins",
    summary: "Nurturing top-tier culinary and hospitality talents in Lagos & Abuja.",
    fullContent: "Our in-house academy trains local talents in international kitchen management, steak-aging science, food safety, and premium customer service, creating thousands of career paths across Nigeria.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 32,
    title: "CSR: The Golden Plates Foundation",
    category: "Expansion",
    icon: "Shield",
    readTime: "3 Mins",
    summary: "Feeding underprivileged children and supporting sustainable farming communities.",
    fullContent: "We believe in giving back. The Golden Plates Foundation sponsors nutritional programs for schools and supports local family farms in Nigeria, dedicating a portion of our revenue to community development.",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 33,
    title: "Spur Family Club Rewards",
    category: "Guest Rewards",
    icon: "Gift",
    readTime: "3 Mins",
    summary: "How to earn 5% cashback on every sizzling platter and access member-only promotions.",
    fullContent: "Earn points while you feast! The Spur Family Club card gives you 5% of your bill back as vouchers, plus access to exclusive events, free kids drinks, and priority reservation services across all outlets.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 34,
    title: "The VIP Captain's Table",
    category: "Guest Rewards",
    icon: "Award",
    readTime: "2 Mins",
    summary: "Reserving the exclusive velvet private booths for business and high-profile dinners.",
    fullContent: "For business negotiations or special dinners, our VIP Captain's Tables offer luxury velvet seating, private acoustics, custom charging ports, and a dedicated butler to ensure a flawless experience.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 35,
    title: "Corporate Catering & Boxed Lunches",
    category: "Guest Rewards",
    icon: "Utensils",
    readTime: "3 Mins",
    summary: "Elevating office lunch breaks with premium insulated gourmet ranch boxes.",
    fullContent: "Tired of boring office food? Our corporate catering service delivers sizzling burger sliders, hot riblets, and fresh salads in thermal, eco-friendly boxes straight to your office boardroom.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 36,
    title: "Private Event Venues",
    category: "Guest Rewards",
    icon: "Users",
    readTime: "3 Mins",
    summary: "Hosting your weddings, large anniversaries, or corporate retreats in Spur Ranches.",
    fullContent: "Host your next major celebration with us! We offer custom menus, high-end sound systems, private child-minding play canyons, and custom decorations to make your private event unforgettable.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 37,
    title: "Spur Dietary & Veggie Alternatives",
    category: "Guest Rewards",
    icon: "Utensils",
    readTime: "3 Mins",
    summary: "Our plant-based gourmet burgers and high-protein alternative diet menus.",
    fullContent: "We cater to all dietary needs! Try our gourmet plant-based patties, low-carb lettuce-wrapped burgers, and nutrient-dense grain salads, ensuring everyone can enjoy the legendary Spur dining experience.",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 38,
    title: "Allergen Sensitivity Matrix",
    category: "Guest Rewards",
    icon: "Shield",
    readTime: "2 Mins",
    summary: "Complete transparency and absolute ingredient safety guidelines for our guests.",
    fullContent: "Your safety is our top priority. We maintain a detailed allergen matrix covering gluten, nuts, soy, and dairy. Please notify your waiter of any allergies, and our kitchen team will prepare your meal in a dedicated, sanitized station.",
    imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800",
    interactiveType: "allergen"
  },
  {
    id: 39,
    title: "Our Delivery Freshness SLA",
    category: "Guest Rewards",
    icon: "Compass",
    readTime: "3 Mins",
    summary: "How our thermal container guarantees secure, sizzling heat from grill to doorstep.",
    fullContent: "We guarantee that your delivered meal will arrive hot and delicious. Every delivery order is packed in custom, multi-layered insulated bags with active heat pads, maintaining optimal temperature from our grills to your table.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 40,
    title: "Interactive Steak Pairing Advisor",
    category: "Guest Rewards",
    icon: "Award",
    readTime: "3 Mins",
    summary: "Match your favorite premium cut with the perfect side dish and ice-cold beverage.",
    fullContent: "Unlock the ultimate flavor synergy! Use our interactive steak pairing tool to match the richness of our prime cuts with light, refreshing sides and artisanal beverages, raising your meal to culinary perfection.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    interactiveType: "feedback"
  }
];
