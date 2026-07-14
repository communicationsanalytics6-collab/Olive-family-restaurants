import { MenuItem, Store, BlogPost, Promo, Feedback, Order, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    uid: 'admin-1',
    email: 'communicationsanalytics6@gmail.com', // User email from runtime as admin
    displayName: 'Super Administrator',
    role: 'super_admin',
    savedAddresses: ['Plot 1437, Sanusi Fafunwa St, Victoria Island, Lagos'],
    favourites: ['spur-1', 'panarottis-1']
  },
  {
    uid: 'spur-ed-1',
    email: 'spur_editor@olive.com',
    displayName: 'Spur Brand Manager',
    role: 'spur_editor',
    savedAddresses: ['Ikeja City Mall, Ikeja, Lagos'],
    favourites: ['spur-2']
  },
  {
    uid: 'pan-ed-1',
    email: 'pizza_editor@panarottis.com',
    displayName: 'Panarottis Pizza Chef',
    role: 'panarottis_editor',
    savedAddresses: ['Wuse II, Abuja'],
    favourites: ['panarottis-2']
  },
  {
    uid: 'cust-1',
    email: 'customer@guest.com',
    displayName: 'Tunde Bakare',
    role: 'customer',
    savedAddresses: ['Block 5, Lekki Phase 1, Lagos'],
    favourites: ['spur-1', 'panarottis-3']
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // SPUR STEAK RANCHES MENU
  {
    id: 'spur-1',
    name: 'Spur Lazy Hunter\'s T-Bone Steak',
    description: 'A massive 500g prime-cut T-Bone, flame-grilled with Spur\'s legendary basting sauce, served with crispy onion rings and hot chips.',
    price: 18500,
    category: 'Steaks & Grills',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    brand: 'spur',
    isPopular: true,
    prepTime: 25
  },
  {
    id: 'spur-2',
    name: 'Cheddar Melt Beef Burger',
    description: 'A 200g juicy flame-grilled pure beef patty topped with melted cheddar cheese and our creamy mushroom sauce.',
    price: 8500,
    category: 'Burgers',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    brand: 'spur',
    isPopular: true,
    prepTime: 15
  },
  {
    id: 'spur-3',
    name: 'Full Rack Famous Pork Ribs',
    description: '600g of sweet, sticky, fork-tender pork ribs basted in our signature Spur BBQ sauce, grilled to perfection.',
    price: 21000,
    category: 'Ribs & Wings',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    brand: 'spur',
    isPopular: true,
    prepTime: 20
  },
  {
    id: 'spur-4',
    name: 'Spicy Buffalo Wings Platter',
    description: 'Tender chicken wings basted in hot & spicy durky sauce, served with creamy blue cheese dipping dressing.',
    price: 7500,
    category: 'Ribs & Wings',
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800',
    brand: 'spur',
    isPopular: false,
    prepTime: 12
  },
  {
    id: 'spur-5',
    name: 'Warrior Combo Feast',
    description: 'A grand feast combining 200g of our famous pork ribs, 100g of tender calamari strips, and a single beef burger.',
    price: 16500,
    category: 'Steaks & Grills',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    brand: 'spur',
    isPopular: true,
    prepTime: 30
  },
  {
    id: 'spur-6',
    name: 'Crispy Onion Rings & Chips Side',
    description: 'Spur\'s famous light crispy-battered giant onion rings served alongside golden steakhouse chips.',
    price: 3200,
    category: 'Sides & Salads',
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&q=80&w=800',
    brand: 'spur',
    isPopular: false,
    prepTime: 8
  },

  // PANAROTTIS PIZZA MENU
  {
    id: 'panarottis-1',
    name: 'Seafood Supreme Pizza',
    description: 'Freshly baked pan pizza with bubbling mozzarella, seasoned queen prawns, calamari rings, crab sticks, drizzled with sweet garlic butter and fresh parsley.',
    price: 12500,
    category: 'Gourmet Pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: true,
    prepTime: 18
  },
  {
    id: 'panarottis-2',
    name: 'Meaty Overload Pizza',
    description: 'The ultimate Nigerian favorite: loaded with spicy beef suya, premium pepperoni, ground beef, chicken strips, and caramelized onions in honey BBQ sauce.',
    price: 11000,
    category: 'Classic Pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: true,
    prepTime: 15
  },
  {
    id: 'panarottis-3',
    name: 'Fiery Chicken Suya Pizza',
    description: 'Loaded with spicy shredded chicken suya basted in local suya pepper spice, red onions, sliced green bell peppers, and fresh green chillies.',
    price: 9500,
    category: 'Classic Pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: true,
    prepTime: 15
  },
  {
    id: 'panarottis-4',
    name: 'Creamy Alfredo Chicken Pasta',
    description: 'Tender chicken breast strips, brown mushrooms, and thick fettuccine pasta tossed in a luxurious rich cream and parmesan sauce.',
    price: 8500,
    category: 'Hearty Pastas',
    imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: true,
    prepTime: 14
  },
  {
    id: 'panarottis-5',
    name: 'Baked Supreme Chicken Lasagna',
    description: 'Layers of premium pasta, shredded chicken breast, cream cheese sauce, topped with mozzarella cheese and baked in a wood-fired oven.',
    price: 9800,
    category: 'Hearty Pastas',
    imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: false,
    prepTime: 20
  },
  {
    id: 'panarottis-6',
    name: 'Double Cheese Margherita Pizza',
    description: 'Freshly baked golden crust loaded with extra mozzarella, rich Italian pizza sauce, and a touch of cheddar cheese for that classic cheesy pull.',
    price: 7000,
    category: 'Classic Pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: false,
    prepTime: 12
  },
  {
    id: 'panarottis-7',
    name: 'Chicken Tikka & Sweet Chilli Pizza',
    description: 'Grilled chicken strips marinated in mild tikka sauce, sweet bell peppers, red onions, sweet chilli drizzle, and double mozzarella.',
    price: 9900,
    category: 'Gourmet Pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: true,
    prepTime: 14
  },
  {
    id: 'panarottis-8',
    name: 'Smoked Bacon & BBQ Chicken Pizza',
    description: 'Tender BBQ-basted chicken breast slices, crispy smoked bacon, sweet corn, and double melted mozzarella cheese on an oven-fresh base.',
    price: 11500,
    category: 'Gourmet Pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: true,
    prepTime: 16
  },
  {
    id: 'panarottis-9',
    name: 'Four-Cheese Garlic Burst Pizza',
    description: 'A rich, cheesy blend of mozzarella, cheddar, creamy gouda, and grated parmesan cheese on a garlic-brushed oven-fresh base.',
    price: 8900,
    category: 'Classic Pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: false,
    prepTime: 12
  },
  {
    id: 'panarottis-10',
    name: 'BBQ Beef & Pepperoni Feast Pizza',
    description: 'Savory seasoned ground beef, classic pepperoni slices, sweet onions, and green bell peppers on a rich BBQ sauce base.',
    price: 8500,
    category: 'Classic Pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: false,
    prepTime: 13
  },
  {
    id: 'panarottis-11',
    name: 'Sweet Chilli Chicken & Pineapple Pizza',
    description: 'Sweet and savoury blend of tender chicken breast chunks basted in sweet chilli, sweet pineapples, sweet piquante peppers, and double mozzarella.',
    price: 9200,
    category: 'Classic Pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isPopular: true,
    prepTime: 14
  },
  {
    id: 'panarottis-drink-1',
    name: 'Chilled Pepsi Bottle',
    description: 'Refreshing ice-cold 50cl classic Pepsi Cola bottle to pair with hot pizza slices.',
    price: 600,
    category: 'Chilled Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&q=80&w=600',
    brand: 'panarottis',
    isPopular: false,
    prepTime: 3
  },
  {
    id: 'panarottis-drink-2',
    name: 'Chilled Coca-Cola Bottle',
    description: 'Crisp and effervescent original taste Coca-Cola served ice-cold with fresh lime slices.',
    price: 600,
    category: 'Chilled Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
    brand: 'panarottis',
    isPopular: false,
    prepTime: 3
  },
  {
    id: 'panarottis-drink-3',
    name: 'Creamy Maltina Can',
    description: 'Premium Nigerian non-alcoholic malt drink. Rich, nourishing, and packed with B-vitamins.',
    price: 800,
    category: 'Chilled Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    brand: 'panarottis',
    isPopular: false,
    prepTime: 3
  },
  {
    id: 'panarottis-drink-4',
    name: 'Chi Exotic Fruit Juice',
    description: 'Premium tropical fruit nectar blend. Indulge in the rich taste of creamy Pineapple & Coconut.',
    price: 1200,
    category: 'Chilled Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=600',
    brand: 'panarottis',
    isPopular: false,
    prepTime: 3
  },
  {
    id: 'panarottis-drink-5',
    name: 'Signature Nigerian Chapman',
    description: 'Panarottis house specialty Chapman mocktail. A blend of Angostura bitters, Fanta, Sprite, a splash of blackcurrant, garnished with fresh cucumber and orange.',
    price: 1800,
    category: 'Chilled Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    brand: 'panarottis',
    isPopular: true,
    prepTime: 5
  },
  {
    id: 'panarottis-drink-6',
    name: 'Zobo House Craft Blend',
    description: 'Authentic sweetened hibiscus tea brewed with hand-selected local ginger, sweet pineapple skins, cloves, and a drizzle of natural wild honey.',
    price: 1200,
    category: 'Chilled Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    brand: 'panarottis',
    isPopular: true,
    prepTime: 4
  }
];

export const INITIAL_STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Spur Steak Ranches - Victoria Island',
    city: 'Lagos',
    address: 'Plot 1437, Sanusi Fafunwa Street, Victoria Island, Lagos',
    phone: '+234 1 291 5689',
    email: 'vi@spur.com.ng',
    latitude: 6.4281,
    longitude: 3.4219,
    openingHours: 'Mon - Sun: 9:00 AM - 10:00 PM',
    brand: 'spur'
  },
  {
    id: 'store-2',
    name: 'Spur & Panarottis - Ikeja City Mall',
    city: 'Lagos',
    address: 'Ground Floor, Ikeja City Mall, Obafemi Awolowo Way, Ikeja, Lagos',
    phone: '+234 1 454 3902',
    email: 'ikeja@olivefoods.com',
    latitude: 6.6119,
    longitude: 3.3582,
    openingHours: 'Mon - Sun: 9:00 AM - 11:00 PM',
    brand: 'both'
  },
  {
    id: 'store-3',
    name: 'Panarottis Pizza - Lekki Phase 1',
    city: 'Lagos',
    address: 'Block 22, Admiralty Way, Lekki Phase 1, Lagos',
    phone: '+234 815 677 8899',
    email: 'lekki@panarottis.com.ng',
    latitude: 6.4492,
    longitude: 3.4731,
    openingHours: 'Mon - Sun: 10:00 AM - 11:00 PM',
    brand: 'panarottis'
  },
  {
    id: 'store-4',
    name: 'Spur Steak Ranches - Wuse II',
    city: 'Abuja',
    address: '45 Aminu Kano Crescent, Wuse II, Abuja',
    phone: '+234 9 291 0033',
    email: 'abuja@spur.com.ng',
    latitude: 9.0772,
    longitude: 7.4764,
    openingHours: 'Mon - Sun: 9:00 AM - 10:00 PM',
    brand: 'spur'
  },
  {
    id: 'store-5',
    name: 'Panarottis Pizza - Wuse II',
    city: 'Abuja',
    address: 'Plot 112, Adetokunbo Ademola Crescent, Wuse II, Abuja',
    phone: '+234 9 460 1122',
    email: 'wuse@panarottis.com.ng',
    latitude: 9.0811,
    longitude: 7.4819,
    openingHours: 'Mon - Sun: 10:00 AM - 11:00 PM',
    brand: 'panarottis'
  }
];

export const INITIAL_PROMOS: Promo[] = [
  {
    id: 'promo-1',
    title: 'Ribs & Wings Family Deal',
    description: 'Get 15% off our famous Spur Pork Ribs & Buffalo Wings Combo platter. Feast with the whole family today!',
    code: 'SPURCOMBO',
    discountPercent: 15,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    brand: 'spur',
    isBannerActive: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'promo-2',
    title: 'Two-sday Double Pizza Special',
    description: 'Every Tuesday, buy two large Gourmet Pizzas from Panarottis for only ₦18,000! Share the love and the cheese.',
    code: 'PIZZATUES',
    discountPercent: 25,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    isBannerActive: true,
    expiresAt: '2026-11-30'
  },
  {
    id: 'promo-3',
    title: 'Olive Foods Grand Launch Voucher',
    description: 'Celebrate our premium unified brand portal! Use code OLIVEWELCOME on any purchase from either Spur or Panarottis for ₦2,000 discount.',
    code: 'OLIVEWELCOME',
    discountPercent: 10,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    brand: 'both',
    isBannerActive: true,
    expiresAt: '2026-08-31'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Secret Behind Spur\'s 50-Year Legendary Basting Sauce',
    content: 'For generations, Spur Steak Ranches has been synonymous with that sweet, rich, smoky caramel flavor basted onto every prime cut. Today, we reveal how our executive chefs cook and simmer this secret blend for up to 6 hours using select aromatic spices, African wild honey, and vine-ripened tomatoes. This basting caramelizes during open flame-grilling, locking in all natural meat juices and providing that signature tenderness loved by millions of Nigerian food lovers across our Lagos and Abuja steak ranches.',
    category: 'Recipes & Secrets',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    brand: 'spur',
    author: 'Chef Sophia Taylor',
    date: '2026-06-20',
    readingTime: '4 min read',
    isFeatured: true,
    isPublished: true
  },
  {
    id: 'blog-2',
    title: 'Why Slow-Fermented Sourdough makes the Perfect Panarottis Crust',
    content: 'Great pizza begins with great dough. At Panarottis Pizza Nigeria, we hand-stretch dough that has been cold-fermented for exactly 36 hours. This slow-rising scientific process breaks down starches, creating tiny, flavor-packed carbon pockets. When baked at 420 degrees Celsius in our authentic wood-fired ovens, the crust puffs up into light, airy, crisp bubbles while remaining perfectly tender on the inside. Read on to learn about how our Italian flour pairings maintain the ideal elasticity.',
    category: 'Kitchen Crafts',
    imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=800',
    brand: 'panarottis',
    author: 'Chef Daniel Scott',
    date: '2026-07-02',
    readingTime: '5 min read',
    isFeatured: false,
    isPublished: true
  },
  {
    id: 'blog-3',
    title: 'Olive Family Restaurants Launches "Nourish Nigeria" Community Initiative',
    content: 'We are incredibly proud to announce the launch of our unified community social impact program. In collaboration with local agricultural partners in Oyo and Kaduna, Olive Family Restaurants is funding three vocational training kitchens and sourcing 100% of our fresh vegetables, tomatoes, and herbs locally. This direct farm-to-table supply chain guarantees absolute quality on your steak and pizza plates while supporting the livelihood of over 250 Nigerian smallholder farming families.',
    category: 'Community News',
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800',
    brand: 'general',
    author: 'Tosin Alabi (Director of CSR)',
    date: '2026-07-09',
    readingTime: '3 min read',
    isFeatured: true,
    isPublished: true
  }
];

export const INITIAL_FEEDBACK: Feedback[] = [
  {
    id: 'feed-1',
    name: 'Chinedu Okafor',
    email: 'chinedu@mail.com',
    brand: 'spur',
    type: 'praise',
    subject: 'Best Steak in Victoria Island!',
    message: 'The Lazy Hunter T-Bone was absolutely phenomenal. Flame-grilled exactly to medium rare as requested, and the steakhouse chips were hot and golden. Service was fast, and the waiters were incredibly polite.',
    rating: 5,
    status: 'resolved',
    createdAt: '2026-07-10T12:30:00Z'
  },
  {
    id: 'feed-2',
    name: 'Aisha Bello',
    email: 'aisha.b@gmail.com',
    brand: 'panarottis',
    type: 'complaint',
    subject: 'Delayed Delivery in Lekki Phase 1',
    message: 'Ordered a Carnivore Feast Pizza last night. It arrived nearly 50 minutes after dispatch, and the cheese was slightly lukewarm. I love the flavor but delivery routing could be much better optimized.',
    rating: 3,
    status: 'open',
    createdAt: '2026-07-11T01:15:00Z'
  },
  {
    id: 'feed-3',
    name: 'Funmi Adeleke',
    email: 'funmi@example.com',
    brand: 'general',
    type: 'suggestion',
    subject: 'Loyalty Reward System request',
    message: 'With both Spur and Panarottis under the Olive Foods ecosystem, you should introduce a unified loyalty point card! I visit Spur for steaks on Fridays and order Panarottis for my kids on Sundays. It would be amazing to collect unified points.',
    rating: 4,
    status: 'resolved',
    createdAt: '2026-07-10T16:45:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9842',
    customerName: 'Tunde Bakare',
    customerEmail: 'customer@guest.com',
    phone: '+234 812 345 6789',
    address: 'Block 5, Lekki Phase 1, Lagos',
    items: [
      { menuItem: INITIAL_MENU_ITEMS[0], quantity: 1 }, // T-bone
      { menuItem: INITIAL_MENU_ITEMS[5], quantity: 1 }  // Onion rings
    ],
    totalAmount: 21700,
    status: 'delivered',
    brand: 'spur',
    createdAt: '2026-07-10T19:30:00Z',
    deliveryMinutes: 35,
    courierName: 'Kola Ojo',
    trackingCoordinates: { lat: 6.4350, lng: 3.4420 }
  },
  {
    id: 'ORD-4421',
    customerName: 'Sandra Nwachukwu',
    customerEmail: 'sandra@yahoo.com',
    phone: '+234 905 112 2334',
    address: 'Wuse II Residential Area, Abuja',
    items: [
      { menuItem: INITIAL_MENU_ITEMS[6], quantity: 2 }, // Seafood Pizza
      { menuItem: INITIAL_MENU_ITEMS[9], quantity: 1 }  // Alfredo Pasta
    ],
    totalAmount: 33500,
    status: 'preparing',
    brand: 'panarottis',
    createdAt: '2026-07-11T05:10:00Z',
    deliveryMinutes: 22,
    courierName: 'John Ibrahim',
    trackingCoordinates: { lat: 9.0790, lng: 7.4780 }
  },
  {
    id: 'ORD-7521',
    customerName: 'Emeka Nwosu',
    customerEmail: 'emeka@gmail.com',
    phone: '+234 803 999 8888',
    address: 'Adetokunbo Ademola St, Victoria Island, Lagos',
    items: [
      { menuItem: INITIAL_MENU_ITEMS[1], quantity: 1 }  // Cheddar Burger
    ],
    totalAmount: 8500,
    status: 'dispatched',
    brand: 'spur',
    createdAt: '2026-07-11T05:35:00Z',
    deliveryMinutes: 10,
    courierName: 'Sodiq Yusuf',
    trackingCoordinates: { lat: 6.4290, lng: 3.4240 }
  }
];
