import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, MapPin, Clock, Phone, Star, Shield, 
  ChevronRight, Plus, Minus, Trash2, Heart,
  Flame, CheckCircle, Calendar, Users, Eye, Gift, Play, Navigation, Compass, Mail,
  BookOpen, HelpCircle, Send, Award, ChevronDown, ChevronUp,
  ChefHat, Search, Menu, X
} from 'lucide-react';
import { MenuItem, Store, Order, TableReservation } from '../types';
import { SPUR_LOGO } from '../data/base64Images';

// Subpage Components for Massively Expanded Pages
import MenuItemDetail from './components/MenuItemDetail';
import MasterclassDetail from './components/MasterclassDetail';
import MilestoneDetail from './components/MilestoneDetail';
import StoreHubDetail from './components/StoreHubDetail';

// 40 Pages Almanac Dataset
import { ALMANAC_PAGES, AlmanacPage } from './data/almanacData';

interface SpurSiteProps {
  menuItems: MenuItem[];
  stores: Store[];
  cart: { menuItem: MenuItem; quantity: number }[];
  onAddToCart: (item: MenuItem, quantity?: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onUpdateCartQuantity: (itemId: string, qty: number) => void;
  onPlaceOrder: (details: { name: string; email: string; phone: string; address: string; brand: 'spur' | 'panarottis' }) => void;
  onNavigate: (view: 'portal' | 'spur' | 'panarottis' | 'admin' | 'cart') => void;
  onAddReview: (name: string, rating: number, message: string) => void;
  onBookTable: (reservation: Omit<TableReservation, 'id' | 'createdAt' | 'status'>) => void;
  activeOrders: Order[];
}

export default function SpurSite({
  menuItems,
  stores,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onPlaceOrder,
  onNavigate,
  onAddReview,
  onBookTable,
  activeOrders
}: SpurSiteProps) {
  const spurMenu = menuItems.filter(item => item.brand === 'spur');
  const spurStores = stores.filter(store => store.brand === 'spur' || store.brand === 'both');

  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'reservations' | 'locator' | 'tracking' | 'almanac'>('home');
  const [activeSubPage, setActiveSubPage] = useState<{ type: 'menu-item' | 'masterclass-detail' | 'milestone-detail' | 'store-detail' | null; id: string | null }>({
    type: null,
    id: null
  });
  
  // Interactive Grill Header States
  const [headerCut, setHeaderCut] = useState<'Cowboy T-Bone' | 'Frontier Ribeye' | 'Kansas Sirloin'>('Cowboy T-Bone');
  const [headerBasting, setHeaderBasting] = useState<'Signature Sweet BBQ' | 'Creamy Pepper Garlic' | 'Spicy Texan Durky'>('Signature Sweet BBQ');
  const [headerHeat, setHeaderHeat] = useState<'Slow Embers' | 'Sizzling Medium' | 'Roaring Flame'>('Sizzling Medium');
  const [headerAdded, setHeaderAdded] = useState(false);
  const [headerBgIndex, setHeaderBgIndex] = useState(0);

  // Quick Order State Variables for Hero Header Slider
  const [quickItemId, setQuickItemId] = useState<string>('spur-1');
  const [quickQty, setQuickQty] = useState<number>(1);
  const [quickBasting, setQuickBasting] = useState<string>('Signature Sweet BBQ');
  const [quickDoneness, setQuickDoneness] = useState<string>('Medium Rare');

  // Submit Handler for Hero Header Quick Order Form
  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedItem = spurMenu.find(item => item.id === (quickItemId || 'spur-1'));
    if (!selectedItem) return;

    // Create customized item name
    let customizedName = selectedItem.name;
    const isSteakOrGrill = selectedItem.category.toLowerCase().includes('steak') || selectedItem.category.toLowerCase().includes('grill') || selectedItem.category.toLowerCase().includes('rib');
    
    if (isSteakOrGrill) {
      customizedName = `${selectedItem.name} (${quickDoneness}, ${quickBasting})`;
    } else if (selectedItem.category.toLowerCase().includes('burger')) {
      customizedName = `${selectedItem.name} (with ${quickBasting})`;
    }

    const customizedItem: MenuItem = {
      ...selectedItem,
      id: `${selectedItem.id}-quick-${Date.now()}`,
      name: customizedName,
      description: `${selectedItem.description} [Quick Customization: Basting: ${quickBasting}, Cook Temp: ${quickDoneness}]`
    };

    onAddToCart(customizedItem, quickQty);
    triggerSuccessToast(`Added ${quickQty}x ${selectedItem.name} to your sizzling plate! 🔥`);
    setQuickQty(1);
  };

  // Classic Recipes Slider State
  const [classicActiveIndex, setClassicActiveIndex] = useState(0);

  // Almanac Search & Filter State
  const [selectedAlmanacPage, setSelectedAlmanacPage] = useState<number | null>(null);
  const [almanacSearch, setAlmanacSearch] = useState('');
  const [almanacCategory, setAlmanacCategory] = useState<string>('All');

  // Success Toast Notification State
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [isCartHovered, setIsCartHovered] = useState(false);

  const handleViewItemById = (itemId: string) => {
    setActiveSubPage({ type: 'menu-item', id: itemId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [checkoutMode, setCheckoutMode] = useState(false);

  // Spur Customizer State Variables
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [spurDoneness, setSpurDoneness] = useState<'Rare' | 'Medium Rare' | 'Medium' | 'Well Done'>('Medium Rare');
  const [spurBasting, setSpurBasting] = useState<'Signature Sweet BBQ' | 'Creamy Pepper Garlic' | 'Spicy Texan Durky'>('Signature Sweet BBQ');
  const [spurSide, setSpurSide] = useState<'Hot Chips & Onion Rings' | 'Baked Butter Potato' | 'Fresh Greek Salad' | 'Spicy Rice'>('Hot Chips & Onion Rings');
  const [spurBurgerTopping, setSpurBurgerTopping] = useState<string[]>([]);
  const [spurDrinkSize, setSpurDrinkSize] = useState<'Regular' | 'Large'>('Regular');
  const [spurQuantity, setSpurQuantity] = useState<number>(1);
  const [spurInstructions, setSpurInstructions] = useState<string>('');

  // Checkout Fields
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // Steak customizer state
  const [steakCut, setSteakCut] = useState<'T-Bone' | 'Ribeye' | 'Sirloin'>('T-Bone');
  const [doneness, setDoneness] = useState<'Rare' | 'Medium Rare' | 'Medium' | 'Well Done'>('Medium Rare');
  const [basting, setBasting] = useState<'Signature Sweet BBQ' | 'Creamy Pepper Garlic' | 'Spicy Texan Durky'>('Signature Sweet BBQ');
  const [customSide, setCustomSide] = useState<'Hot Chips & Onion Rings' | 'Baked Butter Potato' | 'Fresh Greek Salad'>('Hot Chips & Onion Rings');
  const [steakAdded, setSteakAdded] = useState(false);

  // Reservation Fields
  const [resName, setResName] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resGuests, setResGuests] = useState(2);
  const [resDate, setResDate] = useState('');
  const [resTime, setResTime] = useState('18:00');
  const [resSuccess, setResSuccess] = useState(false);

  // Review Submissions
  const [reviewName, setReviewName] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState([
    { name: 'Oluwaseun A.', rating: 5, date: '2026-07-08', msg: 'The legendary ribs and onion rings are consistently exceptional. Feels like home.' },
    { name: 'Emeka O.', rating: 5, date: '2026-07-10', msg: 'Best medium-rare T-Bone in Abuja. Service is top-tier and family friendly!' }
  ]);

  // Delivery Routing Live Simulation State
  const [selectedActiveOrder, setSelectedActiveOrder] = useState<Order | null>(null);
  const [simCoordinates, setSimCoordinates] = useState({ lat: 6.4281, lng: 3.4219 });
  const [simPercent, setSimPercent] = useState(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Categories
  const categories = ['All', 'Steaks & Grills', 'Burgers', 'Ribs & Wings', 'Sides & Salads'];
  
  const filteredMenu = selectedCategory === 'All' 
    ? spurMenu 
    : spurMenu.filter(item => item.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  const getSteakPrice = () => {
    let base = 15500;
    if (steakCut === 'Ribeye') base = 17500;
    if (steakCut === 'Sirloin') base = 14000;
    if (customSide === 'Fresh Greek Salad') base += 500;
    return base;
  };

  const handleAddCustomSteak = () => {
    const customSteakItem: MenuItem = {
      id: `custom-steak-${Date.now()}`,
      name: `Custom Flame-Grilled ${steakCut}`,
      description: `Premium Cut, grilled to [${doneness}] with [${basting}] basting. Side: ${customSide}.`,
      price: getSteakPrice(),
      category: 'Steaks & Grills',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
      brand: 'spur',
      isPopular: false,
      prepTime: 22
    };
    onAddToCart(customSteakItem, 1);
    setSteakAdded(true);
    setTimeout(() => setSteakAdded(false), 3000);
  };

  const handleOpenSpurCustomizer = (item: MenuItem) => {
    setCustomizingItem(item);
    setSpurDoneness('Medium Rare');
    setSpurBasting('Signature Sweet BBQ');
    setSpurSide('Hot Chips & Onion Rings');
    setSpurBurgerTopping([]);
    setSpurDrinkSize('Regular');
    setSpurQuantity(1);
    setSpurInstructions('');
  };

  const getSpurCustomizedPrice = (): number => {
    if (!customizingItem) return 0;
    let base = customizingItem.price;
    
    // Steak addon pricing
    if (customizingItem.category === 'Steaks & Grills') {
      if (spurSide === 'Fresh Greek Salad') base += 500;
    }
    
    // Burger toppings pricing
    if (customizingItem.category === 'Burgers') {
      base += spurBurgerTopping.length * 800; // 800 per extra premium topping
    }

    if (customizingItem.category === 'Sides & Salads' && spurDrinkSize === 'Large') {
      base += 600;
    }
    
    return base * spurQuantity;
  };

  const handleConfirmSpurCustomization = () => {
    if (!customizingItem) return;
    
    let label = customizingItem.name;
    let desc = customizingItem.description;
    
    if (customizingItem.category === 'Steaks & Grills') {
      label = `${customizingItem.name} (${spurDoneness})`;
      desc = `Flame-grilled ${spurDoneness} with ${spurBasting} basting. Accompanied by ${spurSide}.`;
    } else if (customizingItem.category === 'Burgers') {
      if (spurBurgerTopping.length > 0) {
        label = `${customizingItem.name} + Toppings`;
        desc = `${customizingItem.description} with added ${spurBurgerTopping.join(', ')}.`;
      }
    } else if (customizingItem.category === 'Sides & Salads') {
      label = `${customizingItem.name} (${spurDrinkSize})`;
    }

    if (spurInstructions.trim()) {
      desc += ` Special instructions: ${spurInstructions}`;
    }

    const customItem: MenuItem = {
      ...customizingItem,
      id: `${customizingItem.id}-custom-${Date.now()}`,
      name: label,
      description: desc,
      price: getSpurCustomizedPrice() / spurQuantity
    };

    onAddToCart(customItem, spurQuantity);
    setCustomizingItem(null);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName || !resEmail || !resPhone || !resDate || !resTime) return;
    onBookTable({
      customerName: resName,
      email: resEmail,
      phone: resPhone,
      guestsCount: resGuests,
      date: resDate,
      time: resTime,
      brand: 'spur'
    });
    setResSuccess(true);
    setTimeout(() => {
      setResSuccess(false);
      setResName('');
      setResEmail('');
      setResPhone('');
      setResGuests(2);
      setResDate('');
    }, 4000);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewMsg) return;
    const newRev = {
      name: reviewName,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      msg: reviewMsg
    };
    setLocalReviews([newRev, ...localReviews]);
    onAddReview(reviewName, reviewRating, reviewMsg);
    setReviewName('');
    setReviewMsg('');
    setReviewRating(5);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone || !custAddress) return;
    onPlaceOrder({
      name: custName,
      email: custEmail,
      phone: custPhone,
      address: custAddress,
      brand: 'spur'
    });
    setCheckoutMode(false);
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustAddress('');
    setActiveTab('tracking');
  };

  // Bright, clear high-res background images for the Sizzling Grill Header Station
  const brightSpurBgs = [
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600", // Sizzling prime steak on hot wood coals
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1600", // Vibrant colorful grilled skewers and BBQ
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1600"  // Crispy bright gourmet melted cheddar burger
  ];

  useEffect(() => {
    const bgTimer = setInterval(() => {
      setHeaderBgIndex(prev => (prev + 1) % brightSpurBgs.length);
    }, 8500);
    return () => clearInterval(bgTimer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Custom Success Toast Notification Trigger
  const triggerSuccessToast = (message: string) => {
    setAddedToast(message);
    setTimeout(() => {
      setAddedToast(null);
    }, 3000);
  };

  // Custom Header Grill Master Order Dispatch
  const handleAddHeaderCustomGrill = () => {
    let price = 15000;
    if (headerCut === 'Cowboy T-Bone') price = 18500;
    if (headerCut === 'Frontier Ribeye') price = 19500;
    
    const customGrillItem: MenuItem = {
      id: `header-grill-${Date.now()}`,
      name: `Gourmet Seared ${headerCut}`,
      description: `Flame-grilled on ${headerHeat} heat level with ${headerBasting} glaze. Crafted live from the Grill Station.`,
      price: price,
      category: 'Steaks & Grills',
      imageUrl: brightSpurBgs[headerCut === 'Cowboy T-Bone' ? 0 : headerCut === 'Frontier Ribeye' ? 1 : 2],
      brand: 'spur',
      isPopular: true,
      prepTime: 20
    };
    onAddToCart(customGrillItem, 1);
    setHeaderAdded(true);
    triggerSuccessToast(`Custom ${headerCut} sent to the Kitchen!`);
    setTimeout(() => setHeaderAdded(false), 3000);
  };

  // Custom Classic Recipes Order Dispatch
  const handleOrderClassicRecipe = (recipe: typeof classicRecipes[0]) => {
    const menuItem: MenuItem = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      price: recipe.price,
      category: recipe.category,
      imageUrl: recipe.imageUrl,
      brand: 'spur',
      isPopular: true,
      prepTime: 18
    };
    onAddToCart(menuItem, 1);
    triggerSuccessToast(`${recipe.name} added to your Kitchen Plate!`);
  };

  // Delivery simulation loop
  useEffect(() => {
    const spurOrders = activeOrders.filter(o => o.brand === 'spur');
    if (spurOrders.length > 0 && !selectedActiveOrder) {
      setSelectedActiveOrder(spurOrders[spurOrders.length - 1]);
    }
  }, [activeOrders]);

  useEffect(() => {
    let interval: any;
    if (selectedActiveOrder && selectedActiveOrder.status !== 'delivered') {
      setSimPercent(10);
      setSimCoordinates({ lat: 6.4281, lng: 3.4219 });
      
      interval = setInterval(() => {
        setSimPercent(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + 15;
          setSimCoordinates(c => ({
            lat: c.lat + (Math.random() - 0.4) * 0.001,
            lng: c.lng + (Math.random() - 0.4) * 0.001
          }));
          return next > 100 ? 100 : next;
        });
      }, 5000);
    } else if (selectedActiveOrder?.status === 'delivered') {
      setSimPercent(100);
    }
    return () => clearInterval(interval);
  }, [selectedActiveOrder]);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  const classicRecipes = [
    {
      id: 'spur-1',
      name: "Spur Lazy Hunter's T-Bone",
      description: "A massive 500g bone-in wet-aged prime cut flame-grilled on coal embers, served with crispy onion rings and hot steakhouse chips.",
      price: 18500,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
      category: "Steaks & Grills"
    },
    {
      id: 'spur-2',
      name: "Spur Cheddar Melt Burger",
      description: "A succulent 200g juicy beef patty drenched in a double blanket of melted cheddar cheese and our creamy mushroom pepper sauce.",
      price: 8500,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
      category: "Burgers"
    },
    {
      id: 'spur-3',
      name: "Famous Sticky Pork Ribs",
      description: "600g of hickory wood slow-smoked ribs repeatedly glazed in our caramelized tangy-sweet signature Spur BBQ sauce.",
      price: 21000,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
      category: "Ribs & Wings"
    },
    {
      id: 'spur-4',
      name: "Spicy Buffalo Wings Platter",
      description: "Lightly battered, crisped buffalo wings tossed in spicy Durky sauce, paired with our signature creamy blue cheese dipping dressing.",
      price: 7500,
      imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=600",
      category: "Ribs & Wings"
    },
    {
      id: 'spur-spec-1',
      name: "Texas Jackalope Rump Steak",
      description: "300g choice rump steak basted in wild pepper marinade and topped with pan-fried mushroom slices and crisp onions.",
      price: 16200,
      imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=600",
      category: "Steaks & Grills"
    },
    {
      id: 'spur-spec-2',
      name: "Canyon Crispy Chicken Schnitzel",
      description: "Crumbed chicken breast fillet fried golden-crisp, topped with your choice of warm cheese or mushroom pepper sauce.",
      price: 9500,
      imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600",
      category: "Sides & Salads"
    },
    {
      id: 'spur-spec-3',
      name: "Pioneer Bacon & Cheddar Burger",
      description: "Toasted brioche, 200g prime patty, wood-smoked honey bacon, melted double cheddar slices, and sweet crisp gherkins.",
      price: 9800,
      imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=600",
      category: "Burgers"
    },
    {
      id: 'spur-spec-4',
      name: "Abuja Ranch Mixed Grill Platter",
      description: "A colossal feast of 150g pork ribs, 100g sirloin steak, a pork chop, lamb chop, and a grilled farm sausage.",
      price: 24500,
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600",
      category: "Steaks & Grills"
    }
  ];

  const faqs = [
    {
      q: "What makes Spur Steak Ranches basting secret so unique?",
      a: "Our signature sweet BBQ basting has been prepared using a closely guarded recipe since 1967. It caramelizes perfectly on our open-flame grills to seal in the meat's natural juices, creating that unmistakable smoky, sweet taste."
    },
    {
      q: "Are the steaks freshly cut and sourced in Nigeria?",
      a: "Yes! All our premium beef cuts (such as our T-Bone, Ribeye, and Sirloin) are hand-selected by our master butcher, naturally wet-aged for 21 days, and delivered fresh to our Lagos and Abuja kitchens daily."
    },
    {
      q: "Can I host children's parties or big family gatherings at Spur?",
      a: "Absolutely! Spur is legendary for family dining. We feature fully-supervised interactive Play Canyons with games, climbing structures, and professional kids' caregivers so parents can dine with absolute peace of mind."
    },
    {
      q: "What is your Freshness SLA and Delivery Guarantee?",
      a: "We guarantee your grilled order leaves our kitchen sizzling and arrives inside premium insulated thermal containers. If your meal arrives cold, our SLA provides an immediate replacement dispatched with absolute priority."
    }
  ];

  const leftHeroSlides = [
    {
      tag: "COWBOY STEAKHOUSE SPECIAL",
      title: "Where Fire, Smoke & Prime Beef Create Magic",
      description: "Uncompromising wet-aged South African prime cuts, naturally aged for 21 days and flame-grilled on coal embers basted in our legendary sweet BBQ glaze. Experience the elite standard of Nigeria's favorite steakhouse family.",
      buttonText: "Explore Sizzling Menu",
      action: () => { setActiveTab('menu'); setCheckoutMode(false); }
    },
    {
      tag: "LEGENDARY GRILL & RIBS OFFER",
      title: "Sticky Ribs & Sizzling Coal-Fired Skewers",
      description: "Mouth-watering racks of ribs basted in Spur's famous durky sauce or savory garlic glaze, seared on open timber-wood embers to perfection.",
      buttonText: "Order Flame-Grilled Feast",
      action: () => { setActiveTab('menu'); setCheckoutMode(false); }
    },
    {
      tag: "CHEDDAR MELT BURGER ROYALE",
      title: "Gourmet Melted Cheddar Burger Masterpieces",
      description: "Premium ground beef patties, layered with sizzling jalapeño cheddar sauce, caramelized onions, and crisp greens, served with crunchy golden-house onion rings.",
      buttonText: "Claim Burger Deal",
      action: () => { setActiveTab('menu'); setCheckoutMode(false); }
    }
  ];

  return (
    <div className="bg-[#0c0a09] text-stone-100 min-h-screen font-sans selection:bg-[#ca1c32] selection:text-white">
      
      {/* Brand Header & Switching */}
      <div className="bg-neutral-900 border-b border-neutral-800 py-2.5 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-xs gap-2 text-neutral-300">
        <button 
          onClick={() => onNavigate('portal')}
          className="text-amber-500 font-mono font-bold hover:underline flex items-center gap-1.5"
        >
          ← Back to Olive Brand Portal
        </button>
        <div className="flex gap-4 items-center">
          <span className="text-neutral-400 font-mono">Current Brand: <strong className="text-[#fcc800]">Spur Steakhouse</strong></span>
          <button 
            onClick={() => onNavigate('panarottis')}
            className="text-red-500 font-mono font-bold hover:underline flex items-center gap-1"
          >
            Switch to Panarottis Pizza →
          </button>
        </div>
      </div>

      {/* Solid Black Top Contact Info Bar - Hidden on Mobile */}
      <div className="hidden md:flex bg-black text-neutral-300 py-2.5 px-4 sm:px-8 text-[11px] font-mono justify-between items-center gap-2.5 border-b border-neutral-900">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#fcc800]" />
            <span>Book Time - 10am To 11pm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#fcc800]" />
            <span>Call Us - +234 8127149859</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#fcc800]" />
            <span>designmodesolutions@gmail.com</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] hover:text-amber-500 cursor-pointer text-white">f</span>
            <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] hover:text-amber-500 cursor-pointer text-white">t</span>
            <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] hover:text-amber-500 cursor-pointer text-white">g+</span>
            <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] hover:text-amber-500 cursor-pointer text-white">o</span>
          </div>
        </div>
      </div>

      {/* Header Navigation Menu (White Background Logo, Brand Red Rest) */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-neutral-200/20">
        <div className="max-w-7xl mx-auto flex items-stretch min-h-[72px]">
          
          {/* Logo Section - Full-fledged White Background */}
          <div className="bg-white px-6 py-2 flex items-center shrink-0 border-r border-neutral-100">
            <img 
              src={SPUR_LOGO} 
              alt="Spur Steakhouse" 
              className="h-14 w-auto object-contain"
              onError={(e) => {
                // Fail-safe text fallback if image is missing
                (e.target as HTMLElement).style.display = 'none';
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.className = 'font-mono text-base font-black text-[#ca1c32] bg-white px-3 py-1.5 rounded tracking-widest';
                  fallback.innerText = 'SPUR';
                  parent.appendChild(fallback);
                }
              }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Nav Items & Actions Section - Brand Red Background */}
          <div className="bg-[#ca1c32] flex-grow px-6 flex items-center justify-between gap-4 text-white">
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex flex-wrap items-center gap-8 h-full">
              <button 
                onClick={() => { setActiveTab('home'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); }}
                className={`text-xs font-bold transition-all relative py-5 h-full flex items-center ${
                  activeTab === 'home' && activeSubPage.type === null 
                    ? 'text-[#fcc800] font-extrabold' 
                    : 'text-white hover:text-[#fcc800]'
                }`}
              >
                Home
                {activeTab === 'home' && activeSubPage.type === null && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#fcc800] rounded-full" />
                )}
              </button>
              <button 
                onClick={() => { setActiveTab('menu'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); }}
                className={`text-xs font-bold transition-all relative py-5 h-full flex items-center ${
                  activeTab === 'menu' && activeSubPage.type === null 
                    ? 'text-[#fcc800] font-extrabold' 
                    : 'text-white hover:text-[#fcc800]'
                }`}
              >
                Menu
                {activeTab === 'menu' && activeSubPage.type === null && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#fcc800] rounded-full" />
                )}
              </button>
              <button 
                onClick={() => { setActiveTab('almanac'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); setSelectedAlmanacPage(null); }}
                className={`text-xs font-bold transition-all relative py-5 h-full flex items-center ${
                  activeTab === 'almanac' && activeSubPage.type === null 
                    ? 'text-[#fcc800] font-extrabold' 
                    : 'text-white hover:text-[#fcc800]'
                }`}
              >
                Grills
                {activeTab === 'almanac' && activeSubPage.type === null && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#fcc800] rounded-full" />
                )}
              </button>
              <button 
                onClick={() => { setActiveTab('reservations'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); }}
                className={`text-xs font-bold transition-all relative py-5 h-full flex items-center ${
                  activeTab === 'reservations' && activeSubPage.type === null 
                    ? 'text-[#fcc800] font-extrabold' 
                    : 'text-white hover:text-[#fcc800]'
                }`}
              >
                Book Table Spot
                {activeTab === 'reservations' && activeSubPage.type === null && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#fcc800] rounded-full" />
                )}
              </button>
              <button 
                onClick={() => { setActiveTab('locator'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); }}
                className={`text-xs font-bold transition-all relative py-5 h-full flex items-center ${
                  activeTab === 'locator' && activeSubPage.type === null 
                    ? 'text-[#fcc800] font-extrabold' 
                    : 'text-white hover:text-[#fcc800]'
                }`}
              >
                Steakhouse Locator
                {activeTab === 'locator' && activeSubPage.type === null && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#fcc800] rounded-full" />
                )}
              </button>
              {activeOrders.filter(o => o.brand === 'spur').length > 0 && (
                <button 
                  onClick={() => { setActiveTab('tracking'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); }}
                  className={`text-xs font-bold transition-all relative py-5 h-full flex items-center gap-1.5 ${
                    activeTab === 'tracking' && activeSubPage.type === null 
                      ? 'text-[#fcc800] font-extrabold animate-pulse' 
                      : 'text-white hover:text-[#fcc800]'
                  }`}
                >
                  <Compass className="w-4 h-4 animate-spin-slow" /> Live Tracking
                  {activeTab === 'tracking' && activeSubPage.type === null && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#fcc800] rounded-full" />
                  )}
                </button>
              )}
            </div>

            {/* Right Area: Kitchen Icon & Hamburger Drawer Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white font-extrabold hidden sm:inline font-mono bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                ₦{cartTotal.toLocaleString()}
              </span>
              
              {/* Kitchen Hat Cart Icon with Hover Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <button 
                  onClick={() => setCheckoutMode(!checkoutMode)}
                  className="relative p-3 bg-[#fcc800] hover:bg-amber-400 text-neutral-950 font-black rounded-xl transition-all hover:scale-105 active:scale-95 duration-200 shadow-md cursor-pointer flex items-center justify-center"
                  aria-label="View kitchen cart"
                >
                  <ChefHat className="w-5 h-5 font-bold text-neutral-950" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-[#ca1c32] text-[10px] font-mono font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#ca1c32] animate-bounce">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* Hover Dropdown */}
                <AnimatePresence>
                  {isCartHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl z-50 p-4 text-white text-left"
                    >
                      <h4 className="font-bold text-sm text-[#fcc800] border-b border-neutral-800 pb-2 mb-2 flex items-center gap-1.5">
                        <ChefHat className="w-4 h-4 text-amber-500" /> Sizzling Cart Preview
                      </h4>
                      {cart.length === 0 ? (
                        <p className="text-xs text-neutral-500 py-4 text-center">Your kitchen plate is empty.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {cart.map((item) => (
                            <div key={item.menuItem.id} className="flex justify-between items-center text-xs gap-3">
                              <span className="font-bold text-white line-clamp-1 flex-1">{item.menuItem.name}</span>
                              <span className="text-neutral-400 font-mono shrink-0">{item.quantity}x</span>
                              <span className="font-mono font-semibold text-neutral-300 shrink-0">₦{(item.menuItem.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {cart.length > 0 && (
                        <div className="border-t border-neutral-800 pt-2 mt-2 flex justify-between items-center text-xs">
                          <span className="font-bold text-neutral-400">Total:</span>
                          <strong className="text-base text-[#fcc800] font-mono">₦{cartTotal.toLocaleString()}</strong>
                        </div>
                      )}
                      <p className="text-[10px] text-amber-500 font-mono font-bold mt-2 text-center">
                        Click icon to checkout or modify items
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile/Tablet Drawer Toggle */}
              <button
                onClick={() => setIsSideMenuOpen(true)}
                className="lg:hidden p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-all cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Hero Header Slider (Smooth sliding animation and custom transitions) */}
      {/* Hero Header Slider (Redesigned: High-End Sizzling Live Grill Master Station) */}
      {activeTab === 'home' ? (
        <header className="relative py-16 lg:py-24 px-4 overflow-hidden border-b border-neutral-200 min-h-[650px] flex items-center justify-center">
          {/* Background Slide Images with AnimatePresence - Highly Visible! */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={headerBgIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.85, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{ backgroundImage: `url(${brightSpurBgs[headerBgIndex]})` }}
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
              />
            </AnimatePresence>
            {/* Subtle overlay gradients for perfect typography legibility while keeping the image bright */}
            <div className="absolute inset-0 bg-black/55 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-transparent to-black/45 pointer-events-none" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 w-full px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              
              {/* Left side: Hero Text Editorial Presentation (7 columns) - No background, up to 3 slides */}
              <div className="lg:col-span-7 text-left flex flex-col justify-center h-full min-h-[460px] lg:min-h-[520px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={headerBgIndex}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#fcc800]/30 bg-[#fcc800]/10 text-[#fcc800] text-[9px] sm:text-[10px] tracking-widest uppercase font-mono font-bold shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-[#fcc800] animate-ping" />
                      {leftHeroSlides[headerBgIndex].tag}
                    </div>
                    
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black tracking-tight text-white leading-tight drop-shadow-lg">
                      {leftHeroSlides[headerBgIndex].title}
                    </h1>
                    
                    <p className="text-neutral-200 text-xs sm:text-sm sm:text-base leading-relaxed drop-shadow-md max-w-xl">
                      {leftHeroSlides[headerBgIndex].description}
                    </p>

                    <div className="pt-4">
                      <button 
                        onClick={leftHeroSlides[headerBgIndex].action}
                        className="px-8 py-4 rounded-xl bg-[#ca1c32] hover:bg-[#ca1c32]/90 border border-transparent text-white font-black tracking-wider uppercase transition-all shadow-xl hover:scale-105 active:scale-95 duration-200 cursor-pointer text-xs font-mono"
                      >
                        {leftHeroSlides[headerBgIndex].buttonText}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right side: High Graphics Quick Form Ordering Feature (5 columns) - Increased height */}
              <div className="lg:col-span-5 bg-[#171412]/95 border border-stone-800 shadow-2xl rounded-3xl overflow-hidden text-neutral-100 flex flex-col justify-between h-full min-h-[460px] lg:min-h-[520px]">
                {/* Card Header with deep color banner and pulsing flame */}
                <div className="bg-[#ca1c32] px-6 py-5 text-white flex justify-between items-center relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-60" />
                  <div className="relative z-10 flex items-center gap-2.5">
                    <Flame className="w-5 h-5 text-[#fcc800] animate-bounce" />
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-200 block">LIVE GRILL DISPATCH</span>
                      <h3 className="text-sm font-black uppercase tracking-wider">Quick Order Ticket</h3>
                    </div>
                  </div>
                  <div className="relative z-10 bg-black/30 text-[9px] font-mono px-2.5 py-1 rounded-full text-white font-bold tracking-wider uppercase border border-white/10">
                    Est: 15m
                  </div>
                </div>

                {/* Form container - flex-grow & justify-between for matching height */}
                <form onSubmit={handleQuickOrderSubmit} className="p-8 space-y-6 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    {/* 1. Select your Grill */}
                    <div>
                      <label className="block text-[10px] font-mono text-stone-450 uppercase tracking-wider mb-2 font-extrabold">1. Choose Sizzling Grill</label>
                      <select 
                        value={quickItemId}
                        onChange={(e) => setQuickItemId(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-stone-950 border border-stone-850 rounded-xl text-white font-medium focus:outline-none focus:border-[#ca1c32] focus:ring-1 focus:ring-[#ca1c32] cursor-pointer"
                      >
                        {spurMenu.map(item => (
                          <option key={item.id} value={item.id} className="bg-stone-900 text-white">
                            {item.name} — ₦{item.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Grid for parameters */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Basting Selection */}
                      <div>
                        <label className="block text-[10px] font-mono text-stone-450 uppercase tracking-wider mb-2 font-extrabold">2. Basting Glaze</label>
                        <select
                          value={quickBasting}
                          onChange={(e) => setQuickBasting(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-stone-950 border border-stone-850 rounded-xl text-white font-medium focus:outline-none focus:border-[#ca1c32] focus:ring-1 focus:ring-[#ca1c32] cursor-pointer"
                        >
                          <option value="Signature Sweet BBQ" className="bg-stone-900 text-white">Sweet BBQ</option>
                          <option value="Creamy Pepper Garlic" className="bg-stone-900 text-white">Creamy Pepper</option>
                          <option value="Spicy Texan Durky" className="bg-stone-900 text-white">Spicy Durky</option>
                          <option value="None" className="bg-stone-900 text-white">Natural Grill</option>
                        </select>
                      </div>

                      {/* Doneness Selection */}
                      <div>
                        <label className="block text-[10px] font-mono text-[#fcc800] uppercase tracking-wider mb-2 font-extrabold">3. Cooking Heat</label>
                        <select
                          value={quickDoneness}
                          onChange={(e) => setQuickDoneness(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-stone-950 border border-stone-850 rounded-xl text-white font-medium focus:outline-none focus:border-[#ca1c32] focus:ring-1 focus:ring-[#ca1c32] cursor-pointer"
                        >
                          <option value="Rare" className="bg-stone-900 text-white">Rare (Cool Red)</option>
                          <option value="Medium Rare" className="bg-stone-900 text-white">Medium Rare</option>
                          <option value="Medium" className="bg-stone-900 text-white">Medium (Pink)</option>
                          <option value="Well Done" className="bg-[#ca1c32] text-white">Well Done</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Quantity and Interactive price estimation */}
                    <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="block text-[10px] font-mono text-stone-400 uppercase font-bold">QTY</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setQuickQty(prev => Math.max(1, prev - 1))}
                            className="w-8 h-8 bg-stone-850 border border-stone-800 rounded-lg flex items-center justify-center text-xs text-white hover:bg-stone-800 transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold text-white">{quickQty}</span>
                          <button
                            type="button"
                            onClick={() => setQuickQty(prev => prev + 1)}
                            className="w-8 h-8 bg-stone-850 border border-stone-800 rounded-lg flex items-center justify-center text-xs text-white hover:bg-stone-800 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] font-mono text-stone-400 uppercase font-bold">Total Bill</span>
                        <span className="text-xl font-mono font-black text-[#fcc800]">
                          ₦{((spurMenu.find(item => item.id === quickItemId)?.price || 15000) * quickQty).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#ca1c32] hover:bg-[#ca1c32]/90 text-white font-black rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 duration-150 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer font-mono"
                    >
                      <Flame className="w-4 h-4 text-white animate-pulse" /> Fire Up & Add to Plate
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>

          {/* Circular overlapping floating elements */}
          <div className="absolute right-10 bottom-6 w-32 h-32 rounded-full border border-white/10 hidden lg:flex items-center justify-center p-1.5 overflow-hidden animate-spin-slow pointer-events-none">
            <div className="text-[8px] font-mono uppercase text-[#fcc800]/30 text-center tracking-widest leading-normal">
              Sizzling Steaks • Flame Grills • Wet Aged • Secret Sauce • 1967 •
            </div>
          </div>
        </header>
      ) : (
        /* Bespoke Page Title Header with Highly Relevant Background Image & Description */
        <header className="relative py-14 lg:py-16 px-4 overflow-hidden border-b border-neutral-800 bg-[#171412] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <div 
              style={{ 
                backgroundImage: `url(${
                  activeTab === 'menu' 
                    ? 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600'
                    : activeTab === 'almanac'
                    ? 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1600'
                    : activeTab === 'reservations'
                    ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600'
                    : activeTab === 'locator'
                    ? 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1600'
                    : 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1600'
                })` 
              }}
              className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-30"
            />
            {/* Dark overlay for rich contrast */}
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171412] via-transparent to-black/50 pointer-events-none" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 w-full text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#fcc800]/30 bg-[#fcc800]/10 text-[#fcc800] text-[9px] sm:text-[10px] tracking-widest uppercase font-mono font-bold shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {activeTab === 'menu' 
                ? 'Legendary Sizzling Selection' 
                : activeTab === 'almanac' 
                ? 'Grillmaster Knowledge Hub' 
                : activeTab === 'reservations' 
                ? 'Premium Table Bookings' 
                : activeTab === 'locator' 
                ? 'Find Your Nearest Spur Ranch' 
                : 'Sizzling Delivery Tracker'
              }
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-white uppercase drop-shadow-xl">
              {activeTab === 'menu' 
                ? 'Spur Menu' 
                : activeTab === 'almanac' 
                ? 'Grills' 
                : activeTab === 'reservations' 
                ? 'Book Table Spot' 
                : activeTab === 'locator' 
                ? 'Steakhouse Locator' 
                : 'Live Tracking'
              }
            </h1>
            
            <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              {activeTab === 'menu' 
                ? 'Savor our selection of premium wet-aged South African prime cuts, sizzling cheddar melt burgers, and flame-grilled sticky ribs.' 
                : activeTab === 'almanac' 
                ? 'Discover the secrets of the perfect grill, from the science of wet-aging to the heritage of our iconic sweet-and-tangy BBQ glaze.' 
                : activeTab === 'reservations' 
                ? 'Reserve your family table or corporate feast spot in advance. Experience the warm, welcoming standard of Nigeria\'s premier steakhouse.' 
                : activeTab === 'locator' 
                ? 'Locate our flagship ranches across Lagos and Abuja, featuring massive Play Canyons, premium private booths, and stellar coastal views.' 
                : 'Follow your coal-fired feast in real-time from our kitchen embers directly to your doorstep with our dedicated dispatch trackers.'
              }
            </p>
          </div>
        </header>
      )}


      {/* Old Sub-Navigation tabs removed - Moved to Top of Page */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* SUBPAGE INTERCEPTOR ROUTER */}
        {activeSubPage.type !== null && (
          <div className="mb-10 animate-fade-in bg-neutral-950/40 p-1 rounded-3xl">
            {activeSubPage.type === 'menu-item' && (
              <MenuItemDetail 
                item={spurMenu.find(item => item.id === activeSubPage.id) || spurMenu[0]}
                onBack={() => setActiveSubPage({ type: null, id: null })}
                onAddToCart={(item, qty) => { onAddToCart(item, qty); }}
                onOpenCustomizer={(item) => handleOpenSpurCustomizer(item)}
              />
            )}
            {activeSubPage.type === 'masterclass-detail' && (
              <MasterclassDetail 
                moduleId={activeSubPage.id || 'aging'}
                onBack={() => { setActiveSubPage({ type: null, id: null }); setActiveTab('reservations'); }}
                onSuccess={() => {}}
              />
            )}
            {activeSubPage.type === 'milestone-detail' && (
              <MilestoneDetail 
                stageId={activeSubPage.id || 'stage1'}
                onBack={() => { setActiveSubPage({ type: null, id: null }); setActiveTab('home'); }}
              />
            )}
            {activeSubPage.type === 'store-detail' && (
              <StoreHubDetail 
                store={spurStores.find(s => s.id === activeSubPage.id) || spurStores[0]}
                onBack={() => { setActiveSubPage({ type: null, id: null }); setActiveTab('locator'); }}
                onBookTable={() => { setActiveSubPage({ type: null, id: null }); setActiveTab('reservations'); }}
              />
            )}
          </div>
        )}
        
        {/* CHECKOUT SIDEBAR OVERLAY / SCREEN (Changed to Right-Side Slide-Over Popup Drawer!) */}
        <AnimatePresence>
          {checkoutMode && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setCheckoutMode(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />

              {/* Drawer panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl z-50 flex flex-col h-full text-white"
              >
                {/* Header */}
                <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-amber-500 animate-pulse" /> Sizzling Spur Kitchen Plate
                  </h2>
                  <button 
                    onClick={() => setCheckoutMode(false)} 
                    className="w-8 h-8 rounded-full bg-neutral-850 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-neutral-500">
                      Your basket is empty. Browse the menu to add mouth-watering Spur grills!
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Cart items */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider border-b border-neutral-800 pb-2">Selected Grills</h3>
                        <div className="space-y-3">
                          {cart.map((item) => (
                            <div key={item.menuItem.id} className="flex gap-4 p-3 bg-neutral-950 border border-neutral-900 rounded-xl">
                              <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="w-14 h-14 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                              <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-white text-xs truncate">{item.menuItem.name}</h4>
                                <span className="text-xs text-neutral-400 font-mono">₦{item.menuItem.price.toLocaleString()} each</span>
                                
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-1.5">
                                    <button 
                                      onClick={() => onUpdateCartQuantity(item.menuItem.id, Math.max(1, item.quantity - 1))}
                                      className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs font-mono font-bold text-white w-4 text-center">{item.quantity}</span>
                                    <button 
                                      onClick={() => onUpdateCartQuantity(item.menuItem.id, item.quantity + 1)}
                                      className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                  
                                  <button 
                                    onClick={() => onRemoveFromCart(item.menuItem.id)}
                                    className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1 font-mono"
                                  >
                                    <Trash2 className="w-3 h-3" /> Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-3 border-t border-neutral-800 flex justify-between items-center">
                          <span className="text-xs text-neutral-400 font-bold">Total Bill</span>
                          <span className="text-lg font-mono font-black text-[#fcc800]">₦{cartTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Delivery form */}
                      <div className="space-y-4 pt-4 border-t border-neutral-800">
                        <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">Secure Delivery Details</h3>
                        <form onSubmit={handleCheckoutSubmit} className="space-y-3 text-left">
                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1 font-bold">Your Name</label>
                            <input 
                              type="text" required value={custName} onChange={e => setCustName(e.target.value)}
                              placeholder="e.g. Tunde Alao"
                              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-[#ca1c32]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1 font-bold">Email Address</label>
                            <input 
                              type="email" required value={custEmail} onChange={e => setCustEmail(e.target.value)}
                              placeholder="tunde@example.com"
                              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-[#ca1c32]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1 font-bold">Phone Number</label>
                            <input 
                              type="tel" required value={custPhone} onChange={e => setCustPhone(e.target.value)}
                              placeholder="+234 803 123 4567"
                              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-[#ca1c32]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1 font-bold">Delivery Address in Nigeria</label>
                            <textarea 
                              required rows={3} value={custAddress} onChange={e => setCustAddress(e.target.value)}
                              placeholder="Apartment/Street, City (Lagos or Abuja)"
                              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-[#ca1c32]"
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 bg-[#ca1c32] hover:bg-[#ca1c32]/90 text-white font-black rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer"
                          >
                            <Flame className="w-4 h-4" /> Secure & Dispatch Instant Order
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* VIEW 1: BRAND SHOWCASE */}
        {activeTab === 'home' && activeSubPage.type === null && (
          <div className="space-y-24">
            
            {/* Section: Classic Recipes & Special Dishes (Interactive Slider) */}
            <section className="bg-neutral-900/40 rounded-3xl p-8 sm:p-12 border border-neutral-900 relative">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="text-center md:text-left">
                  <span className="text-[#fcc800] font-mono text-xs uppercase tracking-widest font-bold">Culinary Masterpieces</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                    Classic Recipes & Special Dishes
                  </h2>
                  <p className="text-neutral-400 text-xs mt-1">
                    Swipe or navigate our legendary wet-aged steaks, smoked riblet plates, and golden chicken schnitzels.
                  </p>
                </div>

                {/* Left/Right Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setClassicActiveIndex(prev => Math.max(0, prev - 1))}
                    disabled={classicActiveIndex === 0}
                    className="p-3 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 rounded-xl text-white transition-all cursor-pointer"
                    aria-label="Previous dishes"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => setClassicActiveIndex(prev => Math.min(classicRecipes.length - 3, prev + 1))}
                    disabled={classicActiveIndex >= classicRecipes.length - 3}
                    className="p-3 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 rounded-xl text-white transition-all cursor-pointer"
                    aria-label="Next dishes"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Slider View Window */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-out gap-6"
                  style={{ transform: `translateX(-${classicActiveIndex * (100 / 3.1)}%)` }}
                >
                  {classicRecipes.map((recipe) => (
                    <div 
                      key={recipe.id} 
                      className="min-w-[100%] md:min-w-[31%] bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between items-center text-center group hover:border-[#ca1c32]/40 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center">
                        {/* Circle Image */}
                        <div className="w-36 h-36 rounded-full overflow-hidden mb-5 border-4 border-neutral-800 group-hover:border-[#ca1c32] transition-all duration-300 relative">
                          <img 
                            src={recipe.imageUrl} 
                            alt={recipe.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <span className="text-[9px] font-mono text-[#eb721e] uppercase tracking-widest font-bold mb-1.5">{recipe.category}</span>
                        <h4 className="font-bold text-white text-base mb-2 group-hover:text-[#fcc800] transition-colors">{recipe.name}</h4>
                        <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 mb-4">
                          {recipe.description}
                        </p>
                      </div>

                      <div className="w-full space-y-3">
                        <div className="text-lg font-mono font-black text-[#fcc800]">
                          ₦{recipe.price.toLocaleString()}
                        </div>
                        
                        <button
                          onClick={() => handleOrderClassicRecipe(recipe)}
                          className="w-full py-2 bg-[#ca1c32] hover:bg-[#ca1c32]/90 text-white text-xs font-bold rounded-xl transition-all hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ChefHat className="w-4 h-4" /> Add to Kitchen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: Dedicated to Unforgettable Flavors (White background card mixed into the theme) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-neutral-100 rounded-3xl p-8 sm:p-12 shadow-sm text-neutral-800">
              <div className="lg:col-span-5 relative">
                {/* Visual circles similar to the first page of screenshot */}
                <div className="relative w-full aspect-square max-w-[400px] mx-auto">
                  <div className="absolute inset-0 rounded-full border border-[#ca1c32]/20 animate-spin-slow pointer-events-none" />
                  <div className="absolute top-4 left-4 right-4 bottom-4 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" 
                      alt="Signature ribeye cut" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Overlay small circular food image */}
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-neutral-100 shadow-xl hidden sm:block">
                    <img 
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400" 
                      alt="Steak Burger close-up" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <span className="text-[#ca1c32] font-mono text-xs uppercase tracking-widest block mb-2 font-black">About Restaurant</span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-[#212d53] mb-6 leading-tight">
                  Dedicated to Bringing You Unforgettable Flavors
                </h2>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8">
                  For nearly six decades, Spur Steak Ranches has stood as the hallmark of quality meat, vibrant customer experiences, and warmth. We pair South African tradition with premium Nigerian ingredients to prepare recipes with love and masterfully controlled heat.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#ca1c32] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neutral-800 text-sm">Authentic Local Sourcing</h4>
                      <p className="text-neutral-500 text-xs">Aged, fresh Nigerian beef handpicked daily.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#ca1c32] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neutral-800 text-sm">Master Chef Craft</h4>
                      <p className="text-neutral-500 text-xs">Sizzled on open flames at over 400°C.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#ca1c32] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neutral-800 text-sm">Secret Basting Recipes</h4>
                      <p className="text-neutral-500 text-xs">Basted in legendary sweet, smoky glaze.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#ca1c32] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neutral-800 text-sm">Family Play Canyons</h4>
                      <p className="text-neutral-500 text-xs">Supervised play structures for premium comfort.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <div className="w-12 h-12 bg-[#ca1c32]/10 rounded-xl border border-[#ca1c32]/20 flex items-center justify-center text-[#ca1c32]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block uppercase font-mono">Dine-In Hotline</span>
                      <strong className="text-[#212d53] text-sm font-mono">+234 8127149859</strong>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('reservations')}
                    className="w-full sm:w-auto px-6 py-3 bg-[#ca1c32] hover:bg-[#ca1c32]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Read More / Book Table Spot
                  </button>
                </div>
              </div>
            </section>

            {/* Section: Three Editorial Core Offerings cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl border border-neutral-900 bg-neutral-900/30 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-500 mb-6">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Authentic Local Cuisine</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    Meticulously paired local seasonings and handpicked wet-aged beef basted carefully to satisfy the traditional Nigerian palate.
                  </p>
                </div>
                <button onClick={() => setActiveTab('menu')} className="text-xs font-mono text-amber-500 hover:underline flex items-center gap-1.5 self-start font-bold">
                  Explore Flavors <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 rounded-3xl border border-neutral-900 bg-neutral-900/30 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-500 mb-6">
                    <Flame className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Flavors in Every Bite</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    Whether it’s our loaded Cheddar Melt burgers or sizzling prime Ribeye, experience premium taste profiles of legendary depth.
                  </p>
                </div>
                <button onClick={() => setActiveTab('menu')} className="text-xs font-mono text-amber-500 hover:underline flex items-center gap-1.5 self-start font-bold">
                  Browse Menu <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 rounded-3xl border border-neutral-900 bg-neutral-900/30 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-500 mb-6">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Premium Family Dining</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    A welcoming setting designed for celebrations, business dinners, and happy, memorable children's birthday milestones.
                  </p>
                </div>
                <button onClick={() => setActiveTab('reservations')} className="text-xs font-mono text-amber-500 hover:underline flex items-center gap-1.5 self-start font-bold">
                  Secure Booth <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* Banner: Delicious Meals, Cool Drinks, Happy Moments */}
            <section className="relative rounded-3xl overflow-hidden p-8 sm:p-16 border border-neutral-800 bg-[linear-gradient(to_right,rgba(28,21,12,0.9),rgba(10,10,10,0.95))]">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-10 pointer-events-none lg:block hidden" />
              
              <div className="relative z-10 max-w-xl">
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">Exclusive Deal</span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-snug">
                  Delicious Meals, Cool Drinks, Happy Moments
                </h3>
                <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                  Join us on mid-week Wednesdays! Treat the family to any two legendary main steaks and receive a bottomless pitcher of signature cold beverages entirely on the house.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-neutral-950 font-black font-mono text-sm shrink-0 shadow-lg shadow-amber-500/20">
                    -30%
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 block font-mono">Wednesday Promo Code</span>
                    <strong className="text-white text-sm font-mono tracking-wider">MIDWEEK30</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: We deliver your favorite meals with care */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">Hot Delivery Service</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                  We Deliver Your Favorite Meals with Care
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                  Can’t make it to the ranch? No problem. Savor the fire-grilled taste in the comfort of your own living room or executive office. Our express fleet guarantees speed, safety, and taste insulation.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center text-amber-500 shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Ultra-Fast 30-Min Delivery</h4>
                      <p className="text-neutral-500 text-xs leading-relaxed mt-0.5">Dispatched from your nearest Abuja or Lagos kitchen immediately.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center text-amber-500 shrink-0">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Freshness Guaranteed SLA</h4>
                      <p className="text-neutral-500 text-xs leading-relaxed mt-0.5">Delivered at over 60°C inside specialized thermal foil bags.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center text-amber-500 shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Professional Delivery Team</h4>
                      <p className="text-neutral-500 text-xs leading-relaxed mt-0.5">Caring, fully-vetted couriers handling your food with premium hygiene.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl overflow-hidden border border-neutral-800 aspect-video lg:aspect-square bg-neutral-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000" 
                    alt="Spur food delivery prep" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-amber-500 font-mono text-[9px] uppercase tracking-wider block font-bold mb-1">Ranch to Doorstep</span>
                    <h4 className="text-white font-bold text-lg">Fresh. Sizzling. Secure.</h4>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Kitchen Craft Gallery */}
            <section>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-bold">A Glimpse Into Our Kitchen</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">Our Kitchen Craft</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl overflow-hidden aspect-square border border-neutral-800 bg-neutral-900 group">
                  <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600" alt="Kitchen cut aging" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square border border-neutral-800 bg-neutral-900 group">
                  <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600" alt="Kitchen seasoning process" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square border border-neutral-800 bg-neutral-900 group">
                  <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600" alt="Kitchen flame grilling" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square border border-neutral-800 bg-neutral-900 group">
                  <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600" alt="Plated T-Bone steak" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              </div>
            </section>

            {/* Section: Distinguished & Creative Culinary Experts */}
            <section className="bg-neutral-900/20 rounded-3xl p-8 sm:p-12 border border-neutral-900">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-bold font-semibold">Our Kitchen Directors</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
                  Distinguished and Creative Culinary Experts
                </h2>
                <p className="text-neutral-400 text-sm">
                  Led by award-winning head chefs who coordinate our aging processes and custom spice rubs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Chef 1 (Tall Arch container similar to screenshot page 4) */}
                <div className="text-center">
                  <div className="w-56 h-80 rounded-t-full rounded-b-2xl overflow-hidden mx-auto mb-6 border-2 border-neutral-800 bg-neutral-900 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600" 
                      alt="Sophia Taylor" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-bold text-white text-lg">Sophia Taylor</h4>
                  <span className="text-amber-500 font-mono text-xs uppercase tracking-wider block mt-1">Executive Head Chef</span>
                  <p className="text-neutral-500 text-xs max-w-xs mx-auto leading-relaxed mt-2">
                    Master of meat-aging and coal temperatures, direct from Johannesburg.
                  </p>
                </div>

                {/* Chef 2 */}
                <div className="text-center">
                  <div className="w-56 h-80 rounded-t-full rounded-b-2xl overflow-hidden mx-auto mb-6 border-2 border-neutral-800 bg-neutral-900 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600" 
                      alt="Daniel Scott" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-bold text-white text-lg">Daniel Scott</h4>
                  <span className="text-amber-500 font-mono text-xs uppercase tracking-wider block mt-1">Chef de Cuisine</span>
                  <p className="text-neutral-500 text-xs max-w-xs mx-auto leading-relaxed mt-2">
                    Architect of Spur Cheddar patties and sweet hickory basting sauces.
                  </p>
                </div>

                {/* Chef 3 */}
                <div className="text-center">
                  <div className="w-56 h-80 rounded-t-full rounded-b-2xl overflow-hidden mx-auto mb-6 border-2 border-neutral-800 bg-neutral-900 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=600" 
                      alt="Olivia Johnson" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-bold text-white text-lg">Olivia Johnson</h4>
                  <span className="text-amber-500 font-mono text-xs uppercase tracking-wider block mt-1">Pastry & Wings Master</span>
                  <p className="text-neutral-500 text-xs max-w-xs mx-auto leading-relaxed mt-2">
                    Coordinates our caramelized onion toppings and dessert sizzles.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Our Heritage & Milestones (Pioneering Sizzle Since 1967) */}
            <section className="bg-neutral-900/40 rounded-3xl p-8 sm:p-12 border border-neutral-900">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-black">OUR HERITAGE</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                  Pioneering Sizzle Since 1967
                </h2>
                <p className="text-neutral-400 text-sm mt-1">
                  Trace our legendary history from Cape Town origins, global kids playground innovations, to premium wood-aged steak spots in Nigeria.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Horizontal line for desktop timelines */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 hidden md:block z-0" />

                {[
                  {
                    id: 'stage1',
                    year: '1967',
                    title: 'The Golden Spur Cape Town',
                    desc: 'Founder Sandra Head formulated our secret sweet BBQ basting glaze and wet-aged standard in Newlands.',
                    badge: 'The Genesis'
                  },
                  {
                    id: 'stage2',
                    year: '1990s',
                    title: 'The Play Canyon Revolution',
                    desc: 'Introduced fully supervised indoor children physical play structures and climbing canyons.',
                    badge: 'Global Growth'
                  },
                  {
                    id: 'stage3',
                    year: '2010s',
                    title: 'Nigeria Expansion Era',
                    desc: 'Launched first-class flame-grill steak decks across high-density markets in Lagos and Abuja.',
                    badge: 'Nigerian Sizzle'
                  }
                ].map((milestone) => (
                  <div 
                    key={milestone.id}
                    onClick={() => setActiveSubPage({ type: 'milestone-detail', id: milestone.id })}
                    className="bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 p-6 rounded-2xl relative z-10 transition-colors cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-amber-500 font-mono text-lg font-black">{milestone.year}</span>
                        <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">
                          {milestone.badge}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">{milestone.title}</h4>
                      <p className="text-neutral-400 text-xs leading-relaxed">{milestone.desc}</p>
                    </div>
                    <span className="text-amber-500 font-mono text-[10px] uppercase font-bold block mt-6 group-hover:underline">
                      Explore History →
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: FAQ Accordion (Your Dining Questions Answered Here) */}
            <section className="max-w-4xl mx-auto bg-neutral-900/10 rounded-3xl p-8 border border-neutral-900">
              <div className="text-center mb-10">
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-bold">Diner FAQ Portal</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-2">
                  Your Dining Questions Answered Here Efficiently
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm">
                  Transparent details on our franchise standards, dietary guidelines, and party bookings.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden transition-all">
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center px-6 py-4.5 text-left text-white hover:bg-neutral-900 transition-colors"
                    >
                      <span className="font-bold text-sm sm:text-base pr-4">{faq.q}</span>
                      {openFaq === idx ? <ChevronUp className="w-5 h-5 text-amber-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-neutral-500 shrink-0" />}
                    </button>
                    {openFaq === idx && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-400 border-t border-neutral-900 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Reserve Your Spot Today Form */}
            <section className="max-w-3xl mx-auto bg-neutral-900 rounded-3xl border border-neutral-800 p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              <div className="text-center mb-8 relative z-10">
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-bold">Secure Spot Spot</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Reserve Your Spot Today with a Simple Call</h2>
                <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
                  Fill in your details below. Our reservation director will lock down your booth and send a secure confirmation SMS.
                </p>
              </div>

              {resSuccess ? (
                <div className="text-center py-8 relative z-10">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Spot Confirmed!</h3>
                  <p className="text-neutral-400 text-sm">
                    Thank you! Your table reservation is confirmed. Your code is <strong className="text-amber-400 font-mono font-bold">SPUR-{Math.floor(100 + Math.random() * 900)}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Your Name</label>
                      <input 
                        type="text" required value={resName} onChange={e => setResName(e.target.value)}
                        placeholder="e.g. Sandra Nwachukwu"
                        className="w-full px-4 py-3 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Email Address</label>
                      <input 
                        type="email" required value={resEmail} onChange={e => setResEmail(e.target.value)}
                        placeholder="sandra@mail.com"
                        className="w-full px-4 py-3 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Phone Number</label>
                      <input 
                        type="tel" required value={resPhone} onChange={e => setResPhone(e.target.value)}
                        placeholder="+234 803..."
                        className="w-full px-4 py-3 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Guests Count</label>
                      <select 
                        value={resGuests} onChange={e => setResGuests(Number(e.target.value))}
                        className="w-full px-4 py-3 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value={1}>1 Diner</option>
                        <option value={2}>2 Diners (Booth)</option>
                        <option value={4}>4 Diners (Family)</option>
                        <option value={6}>6+ Diners (Play Canyon)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Lunch/Dinner Time</label>
                      <select 
                        value={resTime} onChange={e => setResTime(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Date</label>
                    <input 
                      type="date" required value={resDate} onChange={e => setResDate(e.target.value)}
                      className="w-full px-4 py-3 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
                  >
                    Lock Spot Reservation
                  </button>
                </form>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE MENU & BUILDER */}
        {activeTab === 'menu' && activeSubPage.type === null && (
          <div>
            {/* Menu Filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 text-neutral-950 border border-amber-500' 
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenu.map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/50 flex flex-col justify-between">
                  <div 
                    onClick={() => handleViewItemById(item.id)}
                    className="h-56 overflow-hidden relative cursor-pointer group/img"
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="bg-amber-500 text-neutral-950 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 shadow-md">
                        <Eye className="w-3.5 h-3.5" /> View Plate Specs
                      </span>
                    </div>
                    {item.isPopular && (
                      <span className="absolute top-4 left-4 bg-amber-500 text-neutral-950 font-mono font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 uppercase z-10">
                        <Star className="w-3.5 h-3.5 fill-neutral-950" /> Spur Legend
                      </span>
                    )}
                    <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1 z-10">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> {item.prepTime} mins
                    </span>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest block mb-1">{item.category}</span>
                      <h3 
                        onClick={() => handleViewItemById(item.id)}
                        className="text-lg font-bold text-white mb-2 leading-tight hover:text-amber-500 cursor-pointer transition-colors"
                      >
                        {item.name}
                      </h3>
                      <p className="text-neutral-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6">{item.description}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                      <span className="text-lg font-mono font-black text-white">₦{item.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleViewItemById(item.id)}
                          className="px-2.5 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-500" /> Specs
                        </button>
                        <button
                          onClick={() => handleOpenSpurCustomizer(item)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-lg transition-all"
                        >
                          Add to Plate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Review Section */}
            <section className="mt-20 border-t border-neutral-800 pt-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div>
                  <span className="text-amber-500 font-mono text-xs uppercase tracking-wider block mb-1">Satisfied Diners</span>
                  <h3 className="text-2xl font-bold text-white mb-4">Hear from our Ranches</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    Our flame-grilled standards are maintained with daily customer auditing. Tell us about your steakhouse experience.
                  </p>

                  <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <span className="text-3xl font-black text-white font-mono block mb-1">4.9 / 5</span>
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                    </div>
                    <span className="text-xs text-neutral-500">Based on 1,200+ local audits in Nigeria</span>
                  </div>
                </div>

                {/* List Reviews */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-white border-b border-neutral-800 pb-2 font-mono uppercase tracking-wider text-xs font-bold">Recent Audits</h4>
                  {localReviews.map((rev, index) => (
                    <div key={index} className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-white">{rev.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{rev.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">{rev.msg}</p>
                    </div>
                  ))}
                </div>

                {/* Form to leave review */}
                <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60">
                  <h4 className="font-bold text-white text-sm mb-4">Leave a Diner Audit</h4>
                  <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="text" required value={reviewName} onChange={e => setReviewName(e.target.value)}
                        placeholder="Your Name" 
                        className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <select 
                        value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                        <option value={4}>⭐⭐⭐⭐ (Good)</option>
                        <option value={3}>⭐⭐⭐ (Average)</option>
                      </select>
                    </div>
                    <div>
                      <textarea 
                        required rows={3} value={reviewMsg} onChange={e => setReviewMsg(e.target.value)}
                        placeholder="How was the sizzle and the speed of our service?" 
                        className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all">
                      Publish Sizzle Audit
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 3: TABLE RESERVATION FORM */}
        {activeTab === 'reservations' && activeSubPage.type === null && (
          <div className="space-y-16">
            {/* Spur Grill Masterclass Academy Section */}
            <section className="bg-neutral-900/40 rounded-3xl p-8 sm:p-12 border border-neutral-900">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-black">SPUR GRILL ACADEMY</span>
                <h2 className="text-3xl font-extrabold text-white mt-2">Become a Certified Grill Master</h2>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Learn the molecular chemistry of wet aging, direct-hearth thermodynamic searing, and signature sweet basting emulsion alongside master pitmasters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: 'aging',
                    title: 'Aging Science & Cut Selection',
                    desc: 'Analyze intramuscular fat marbling, wet-aging thresholds, and learn anatomical carving.',
                    price: '₦18,000',
                    duration: '3 Hours'
                  },
                  {
                    id: 'basting',
                    title: 'Basting Chemistry & Sauce Blend',
                    desc: 'Unravel the sugar caramelization rates and flavor profiles of our sweet basting sauce.',
                    price: '₦15,000',
                    duration: '2.5 Hours'
                  },
                  {
                    id: 'searing',
                    title: 'Overhead High-Heat Searing',
                    desc: 'Master gas infrared grates exceeding 300°C and thermocoupled probe core curves.',
                    price: '₦20,000',
                    duration: '3.5 Hours'
                  }
                ].map((mod) => (
                  <div key={mod.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition-colors group">
                    <div className="space-y-3">
                      <span className="text-[10px] text-amber-500 font-mono uppercase font-bold">Grill Module</span>
                      <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">{mod.title}</h4>
                      <p className="text-neutral-400 text-xs leading-relaxed">{mod.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-neutral-500 font-mono block">TUITION FEE</span>
                        <span className="text-sm font-mono font-black text-white">{mod.price}</span>
                      </div>
                      <button
                        onClick={() => setActiveSubPage({ type: 'masterclass-detail', id: mod.id })}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-black rounded-lg uppercase transition-all"
                      >
                        Explore Syllabus →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="max-w-2xl mx-auto">
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                <div className="text-center mb-8 relative z-10">
                  <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-bold">Interactive Sizzle Table</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Book your Sizzle Spot</h2>
                  <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
                    Avoid the queues! Secure your cozy booth or giant play-area family table in advance.
                  </p>
                </div>

              {resSuccess ? (
                <div className="text-center py-8 relative z-10">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Spot Confirmed!</h3>
                  <p className="text-neutral-400 text-sm">
                    Thank you! Your table reservation is confirmed at Spur. A booking token has been sent to your phone. 
                    Your code is <strong className="text-amber-400 font-mono font-bold">SPUR-{Math.floor(100 + Math.random() * 900)}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Your Name</label>
                      <input 
                        type="text" required value={resName} onChange={e => setResName(e.target.value)}
                        placeholder="Tunde Alao"
                        className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Email Address</label>
                      <input 
                        type="email" required value={resEmail} onChange={e => setResEmail(e.target.value)}
                        placeholder="tunde@mail.com"
                        className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Phone Number</label>
                      <input 
                        type="tel" required value={resPhone} onChange={e => setResPhone(e.target.value)}
                        placeholder="+234..."
                        className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Guests Count</label>
                      <select 
                        value={resGuests} onChange={e => setResGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests (Cozy Booth)</option>
                        <option value={4}>4 Guests (Family Table)</option>
                        <option value={6}>6+ Guests (Playground Side)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Preferred Date</label>
                      <input 
                        type="date" required value={resDate} onChange={e => setResDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">Dinner / Lunch Time</label>
                      <select 
                        value={resTime} onChange={e => setResTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition-all"
                  >
                    Confirm Sizzle Spot Reservation
                  </button>
                </form>
              )}
            </div>
          </div>
          </div>
        )}

        {/* VIEW 4: STEAKHOUSE LOCATOR */}
        {activeTab === 'locator' && activeSubPage.type === null && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {spurStores.map(store => (
                <div key={store.id} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 font-mono uppercase px-2.5 py-1 rounded-full inline-block mb-3">
                      Spur Ranches
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{store.name}</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed mb-6">{store.address}</p>

                    <div className="space-y-2 text-xs text-neutral-400 font-mono mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>{store.openingHours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-amber-500" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-amber-500" />
                        <span>{store.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setActiveSubPage({ type: 'store-detail', id: store.id })}
                      className="py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono font-black text-xs rounded-lg transition-all"
                    >
                      Enter Ranch Hub ⛺
                    </button>
                    <button 
                      onClick={() => { setActiveTab('menu'); }}
                      className="py-2.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white font-mono font-bold text-xs rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all"
                    >
                      Menu Specs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: LIVE DELIVERY TRACKING SIMULATION */}
        {activeTab === 'tracking' && selectedActiveOrder && activeSubPage.type === null && (
          <div className="max-w-4xl mx-auto bg-neutral-900 rounded-3xl border border-neutral-800 p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-6 mb-6 gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase font-bold animate-pulse">
                    Active Delivery Tracking
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">ID: {selectedActiveOrder.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Sizzle-Express Courier Routing</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 block font-mono">Estimated Arrival</span>
                <span className="text-lg font-mono font-black text-amber-500">
                  {selectedActiveOrder.status === 'delivered' ? 'ARRIVED ✓' : `${selectedActiveOrder.deliveryMinutes} Mins`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono mb-1">Courier Partner</span>
                  <strong className="text-white text-sm block">{selectedActiveOrder.courierName}</strong>
                  <span className="text-xs text-amber-500 font-mono flex items-center gap-1.5 mt-1">
                    <Phone className="w-3.5 h-3.5" /> Call Rider (+234 803 RIDER)
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Journey Status</h4>
                  
                  <div className="relative pl-6 border-l-2 border-neutral-800 space-y-4">
                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-neutral-950 ${
                        simPercent >= 10 ? 'bg-amber-500' : 'bg-neutral-800'
                      }`} />
                      <h5 className="text-xs font-bold text-white">Sizzle Order Received</h5>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">System validated and routed to local kitchen.</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-neutral-950 ${
                        simPercent >= 40 ? 'bg-amber-500' : 'bg-neutral-800'
                      }`} />
                      <h5 className="text-xs font-bold text-white">Flame-Grilling Cut</h5>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">Spur Steak master chefs searing grills on fire.</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-neutral-950 ${
                        simPercent >= 70 ? 'bg-amber-500' : 'bg-neutral-800'
                      }`} />
                      <h5 className="text-xs font-bold text-white">Rider Dispatched</h5>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">Rider departed on motorcycle with insulated sizzle packs.</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-neutral-950 ${
                        simPercent >= 100 ? 'bg-emerald-500' : 'bg-neutral-800'
                      }`} />
                      <h5 className="text-xs font-bold text-white">Delivered & Sizzling</h5>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">Enjoy your family Spur feast!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Simulator */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl h-80 relative overflow-hidden flex flex-col justify-between p-6">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="80%" y1="10%" x2="20%" y2="90%" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>

                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-xs font-mono text-neutral-500">Nigeria GPS Tracking (Simulated)</span>
                    <span className="text-xs font-mono text-amber-500">
                      Rider Lat: {simCoordinates.lat.toFixed(4)}, Lng: {simCoordinates.lng.toFixed(4)}
                    </span>
                  </div>

                  {/* Rider Marker */}
                  <motion.div 
                    animate={{ 
                      x: (simPercent / 100) * 200 + 40,
                      y: Math.sin(simPercent / 10) * 15 + 100
                    }}
                    className="absolute z-20 flex flex-col items-center gap-1"
                  >
                    <div className="bg-amber-500 text-neutral-950 p-2 rounded-full border-2 border-white shadow-xl">
                      <Navigation className="w-5 h-5 rotate-45" />
                    </div>
                    <span className="text-[9px] bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono font-bold px-1.5 rounded">Rider</span>
                  </motion.div>

                  <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-600 animate-ping absolute" />
                    <div className="w-3 h-3 rounded-full bg-amber-500 relative" />
                    <span className="text-[8px] text-neutral-500 font-mono mt-1">Spur Grill</span>
                  </div>

                  <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 relative" />
                    <span className="text-[8px] text-neutral-500 font-mono mt-1">Home</span>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-neutral-900 flex items-center justify-between">
                    <div className="w-full mr-4 bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${simPercent}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-white shrink-0">{simPercent}% Complete</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl leading-relaxed">
                  <strong>Freshness SLA Guarantee:</strong> Our meals are loaded in insulated thermal bags. If your steak temperature is below 60°C on arrival, we will dispatch an instant replacement free of charge.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: GRILLMASTER'S ALMANAC */}
        {activeTab === 'almanac' && activeSubPage.type === null && (
          <div className="space-y-10">
            {selectedAlmanacPage === null ? (
              // Directory Mode
              <div className="bg-neutral-900/60 rounded-3xl p-6 sm:p-10 border border-neutral-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-neutral-800 pb-6">
                  <div>
                    <span className="text-[10px] text-[#fcc800] bg-[#ca1c32]/20 border border-[#ca1c32]/30 px-3 py-1 rounded-full uppercase font-mono font-bold tracking-widest inline-block mb-2">
                      Premium Brand Directory
                    </span>
                    <h2 className="text-3xl font-extrabold text-white">Grills</h2>
                    <p className="text-neutral-400 text-xs mt-1">
                      Our official interactive directory, grilling quality standards, and regional chronicles in Nigeria.
                    </p>
                  </div>
                  
                  {/* Search bar inside Almanac */}
                  <div className="w-full md:w-80 relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Almanac articles..."
                      value={almanacSearch}
                      onChange={(e) => setAlmanacSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-[#ca1c32] rounded-xl text-xs outline-none text-white font-mono placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                {/* Category Pill Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['All', 'Heritage', 'Quality', 'Family', 'Expansion', 'Guest Rewards'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setAlmanacCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all border ${
                        almanacCategory === cat 
                          ? 'bg-[#ca1c32] text-white border-[#ca1c32] shadow-lg shadow-[#ca1c32]/10' 
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid of Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ALMANAC_PAGES.filter(page => {
                    const matchesCategory = almanacCategory === 'All' || page.category === almanacCategory;
                    const matchesSearch = page.title.toLowerCase().includes(almanacSearch.toLowerCase()) || 
                                          page.summary.toLowerCase().includes(almanacSearch.toLowerCase()) ||
                                          page.fullContent.toLowerCase().includes(almanacSearch.toLowerCase());
                    return matchesCategory && matchesSearch;
                  }).map((page) => {
                    // Match icons
                    let PageIcon = Shield;
                    if (page.icon === 'Award') PageIcon = Award;
                    if (page.icon === 'Flame') PageIcon = Flame;
                    if (page.icon === 'Utensils') PageIcon = Utensils;
                    if (page.icon === 'CheckCircle') PageIcon = CheckCircle;
                    if (page.icon === 'MapPin') PageIcon = MapPin;
                    if (page.icon === 'Users') PageIcon = Users;
                    if (page.icon === 'Gift') PageIcon = Gift;
                    if (page.icon === 'Compass') PageIcon = Compass;

                    return (
                      <div 
                        key={page.id} 
                        className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-[#ca1c32]/50 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group cursor-pointer text-left"
                        onClick={() => { setSelectedAlmanacPage(page.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      >
                        <div>
                          {/* Image Thumbnail */}
                          <div className="h-40 w-full relative overflow-hidden bg-neutral-900 border-b border-neutral-900">
                            <img src={page.imageUrl} alt={page.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                            <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-mono font-bold text-neutral-300 flex items-center gap-1">
                              <PageIcon className="w-3 h-3 text-[#fcc800]" />
                              {page.category}
                            </div>
                            <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-neutral-400">
                              {page.readTime}
                            </div>
                          </div>
                          
                          {/* Card Content */}
                          <div className="p-5 space-y-2">
                            <span className="text-[10px] text-neutral-500 font-mono">PORTAL #{page.id}</span>
                            <h3 className="text-white font-bold text-sm leading-snug group-hover:text-[#fcc800] transition-colors">{page.title}</h3>
                            <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">{page.summary}</p>
                          </div>
                        </div>

                        {/* Card Footer Action */}
                        <div className="p-5 pt-0 border-t border-neutral-900/30 flex items-center justify-between text-[#eb721e] group-hover:text-[#ca1c32] text-xs font-bold transition-colors">
                          <span>Enter Brand Portal</span>
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Detailed Article Mode
              (() => {
                const page = ALMANAC_PAGES.find(p => p.id === selectedAlmanacPage);
                if (!page) return null;

                let PageIcon = Shield;
                if (page.icon === 'Award') PageIcon = Award;
                if (page.icon === 'Flame') PageIcon = Flame;
                if (page.icon === 'Utensils') PageIcon = Utensils;
                if (page.icon === 'CheckCircle') PageIcon = CheckCircle;
                if (page.icon === 'MapPin') PageIcon = MapPin;
                if (page.icon === 'Users') PageIcon = Users;
                if (page.icon === 'Gift') PageIcon = Gift;
                if (page.icon === 'Compass') PageIcon = Compass;

                return (
                  <div className="max-w-4xl mx-auto bg-neutral-900/90 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
                    {/* Header Banner */}
                    <div className="h-64 w-full relative bg-neutral-900 border-b border-neutral-800">
                      <img src={page.imageUrl} alt={page.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-left">
                        <span className="px-3 py-1 rounded-full bg-[#ca1c32]/80 text-white text-[10px] font-mono tracking-widest uppercase font-black inline-flex items-center gap-1.5 mb-3 border border-white/10">
                          <PageIcon className="w-3.5 h-3.5 text-[#fcc800]" /> {page.category}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{page.title}</h1>
                        <p className="text-neutral-300 text-xs sm:text-sm mt-1 max-w-2xl">{page.summary}</p>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 sm:p-10 space-y-8 text-left">
                      <div className="flex justify-between items-center text-xs font-mono border-b border-neutral-800 pb-4 text-neutral-400">
                        <span>SPUR ALMANAC PORTAL • ENTRY #{page.id}</span>
                        <span>READ TIME: {page.readTime}</span>
                      </div>

                      <p className="text-neutral-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                        {page.fullContent}
                      </p>

                      {/* RENDERING THE INTERACTIVE TOOL ACCORDING TO WIDGET TYPE */}
                      {page.interactiveType && (
                        <div className="bg-neutral-950 border border-[#ca1c32]/30 p-5 sm:p-8 rounded-2xl relative overflow-hidden shadow-xl text-left">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ca1c32]/5 to-transparent pointer-events-none" />
                          
                          <span className="text-[9px] text-[#fcc800] font-mono tracking-widest block uppercase font-bold mb-3">
                            ✦ Interactive Brand Console ✦
                          </span>

                          {page.interactiveType === 'quiz' && (
                            <div className="space-y-4">
                              <h4 className="text-white font-bold text-sm">Spur Heritage Trivia: In which year did the first Spur Steak Ranch open?</h4>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                {['1961', '1967', '1974', '1982'].map(year => (
                                  <button
                                    key={year}
                                    onClick={() => {
                                      // Toggle Correct / Incorrect Feedback Alert
                                      triggerSuccessToast(year === '1967' ? '✓ Correct! Spur opened in 1967.' : '✗ Incorrect. Try 1967!');
                                    }}
                                    className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left font-mono text-neutral-400 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
                                  >
                                    {year}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {page.interactiveType === 'calculator' && (
                            <div className="space-y-4">
                              <h4 className="text-white font-bold text-sm">Steak aging maturation Curve calculator</h4>
                              <p className="text-neutral-400 text-xs">Observe wet-aging tenderizing maturation levels.</p>
                              <div className="grid grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center">
                                <div>
                                  <span className="text-[10px] font-mono text-neutral-500 block uppercase">AGING SPEC</span>
                                  <span className="text-xl font-mono font-black text-white">21 Days Maturation</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-neutral-500 block uppercase">TENDERNESS LEVEL</span>
                                  <span className="text-xl font-mono font-black text-[#fcc800]">100% Guaranteed</span>
                                </div>
                              </div>
                              <div className="text-xs bg-[#212d53]/40 border border-white/5 p-3 rounded-xl">
                                <span className="text-neutral-400 block font-mono text-[9px] uppercase">Calculated Taste Profile</span>
                                <strong className="text-white">Peak Gourmet Excellence (Nigeria Steakhouse Standard)</strong>
                              </div>
                            </div>
                          )}

                          {page.interactiveType === 'pairing' && (
                            <div className="space-y-4">
                              <h4 className="text-white font-bold text-sm">Steakhouse Spice & Cut Synergy Matcher</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {['Mild Herb Basting', 'Nigerian Suya Dust'].map(h => (
                                  <button
                                    key={h}
                                    onClick={() => triggerSuccessToast(`Recommended steak cut: Frontier Ribeye for ${h}!`)}
                                    className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left font-mono text-neutral-300 hover:border-neutral-700 transition-colors cursor-pointer"
                                  >
                                    {h}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {page.interactiveType === 'form' && (
                            <div className="space-y-4">
                              <h4 className="text-white font-bold text-sm">Spur Play Canyon Kids Party Reservation</h4>
                              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 text-xs">
                                <p className="text-neutral-300">Submit birthday enquiry for fully-supervised interactive parties.</p>
                                <button 
                                  onClick={() => {
                                    triggerSuccessToast("Booking Enquiry Sent! An event planner will contact you.");
                                  }}
                                  className="w-full py-2 bg-[#ca1c32] hover:bg-[#ca1c32]/90 text-white font-bold rounded-xl transition-all cursor-pointer"
                                >
                                  Submit Free Inquiry Form
                                </button>
                              </div>
                            </div>
                          )}

                          {page.interactiveType === 'franchise' && (
                            <div className="space-y-4">
                              <h4 className="text-white font-bold text-sm">Franchise Partnership Pre-Screening</h4>
                              <p className="text-neutral-400 text-xs">Explore expansion opportunities across Nigeria.</p>
                              <button 
                                onClick={() => {
                                  triggerSuccessToast("Franchising prospectus dispatched to your profile email!");
                                }}
                                className="w-full py-2 bg-[#212d53] border border-white/10 hover:bg-[#212d53]/90 text-white font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Request Franchising Prospectus
                              </button>
                            </div>
                          )}

                          {page.interactiveType === 'allergen' && (
                            <div className="space-y-4">
                              <h4 className="text-white font-bold text-sm">Dietary restriction sensitivities guide</h4>
                              <div className="flex flex-wrap gap-2">
                                {['Gluten Sensitivity', 'Dairy Restrictions', 'Nut Allergies'].map(allergen => (
                                  <button
                                    key={allergen}
                                    onClick={() => triggerSuccessToast(`${allergen} filtered. Enjoy our standard dry-rubbed ribs & grills!`)}
                                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-mono transition-colors cursor-pointer"
                                  >
                                    + {allergen}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {page.interactiveType === 'feedback' && (
                            <div className="space-y-4">
                              <h4 className="text-white font-bold text-sm">Ranch Experience Flavor Advisor</h4>
                              <p className="text-neutral-400 text-xs">Build your preferred flavor pairing score.</p>
                              <button 
                                onClick={() => {
                                  triggerSuccessToast("Flavor advisor score: 100/100! Legendary Pairing.");
                                }}
                                className="w-full py-2 bg-[#eb721e] hover:bg-[#eb721e]/90 text-neutral-950 font-black rounded-xl transition-all cursor-pointer"
                              >
                                Match Flavor Profile
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Call-to-Action to Order related products */}
                      <div className="bg-[#212d53]/50 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
                        <div>
                          <h4 className="text-white font-bold text-sm">Feeling Sizzling Hungry?</h4>
                          <p className="text-neutral-300 text-xs mt-1">Add our world-class signature flame-grilled steaks or basted ribs to your table plate now.</p>
                        </div>
                        <button 
                          onClick={() => {
                            const relatedItem = spurMenu[page.id % spurMenu.length] || spurMenu[0];
                            onAddToCart(relatedItem, 1);
                            triggerSuccessToast(`${relatedItem.name} added from Almanac!`);
                          }}
                          className="px-5 py-2.5 bg-[#ca1c32] hover:bg-[#ca1c32]/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <ChefHat className="w-4 h-4" /> Order Related Platter
                        </button>
                      </div>

                      {/* Back button */}
                      <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                        <button 
                          onClick={() => setSelectedAlmanacPage(null)}
                          className="px-5 py-2.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          ← Back to Almanac Directory
                        </button>
                        
                        <span className="text-[10px] font-mono text-neutral-500">Nigeria Quality System • Verified</span>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}

      </main>

      {/* Redesigned Footer (Clean, high-end, elegant editorial with newsletter subscription) */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Logo & Info column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-lg font-extrabold font-serif">
                S
              </div>
              <span className="text-white font-extrabold text-base tracking-widest uppercase">SPUR RANCHES</span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Serving our world-famous flame-grilled cuts, giant burgers, and sticky basted riblets with family warmth. The official franchise network of Nigeria.
            </p>
            <div className="pt-2">
              <span className="text-[9px] text-neutral-600 block uppercase font-mono tracking-widest font-bold">Nigeria Head Office</span>
              <span className="text-neutral-400 text-xs">Plot 1437, Sanusi Fafunwa St, Victoria Island, Lagos</span>
            </div>
          </div>

          {/* Quick links columns */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-mono uppercase tracking-wider font-bold">Popular Food</h4>
            <ul className="space-y-1.5 text-xs text-neutral-500">
              <li><button onClick={() => { setActiveTab('menu'); setSelectedCategory('Steaks & Grills'); }} className="hover:text-amber-500 text-left transition-colors">Wet Aged Steaks</button></li>
              <li><button onClick={() => { setActiveTab('menu'); setSelectedCategory('Burgers'); }} className="hover:text-amber-500 text-left transition-colors">Cheddar Burgers</button></li>
              <li><button onClick={() => { setActiveTab('menu'); setSelectedCategory('Ribs & Wings'); }} className="hover:text-amber-500 text-left transition-colors">Sticky Wings & Ribs</button></li>
              <li><button onClick={() => { setActiveTab('menu'); setSelectedCategory('Sides & Salads'); }} className="hover:text-amber-500 text-left transition-colors">Accompanying Sides</button></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-mono uppercase tracking-wider font-bold">Useful Links</h4>
            <ul className="space-y-1.5 text-xs text-neutral-500">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-500 text-left transition-colors">Our Story</button></li>
              <li><button onClick={() => setActiveTab('reservations')} className="hover:text-amber-500 text-left transition-colors">Book a Table</button></li>
              <li><button onClick={() => setActiveTab('locator')} className="hover:text-amber-500 text-left transition-colors">Store Locator</button></li>
              <li><button onClick={() => onNavigate('portal')} className="hover:text-amber-500 text-left transition-colors">Olive Food Portal</button></li>
            </ul>
          </div>

          {/* Newsletter Subscribe Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white text-xs font-mono uppercase tracking-wider font-bold">Sizzle Newsletters</h4>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Subscribe to unlock 15% off your next delivery order and get direct chef recipes.
            </p>
            {newsletterSubscribed ? (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Thank you for subscribing! Check your mail.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input 
                  type="email" required value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Your Email"
                  className="px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-xs rounded-xl focus:outline-none focus:border-amber-500 flex-grow"
                />
                <button type="submit" className="p-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-neutral-900 pt-8 text-center text-neutral-600 text-[10px] space-y-1">
          <p>© 2026 Spur Steak Ranches Nigeria Ltd. Operated under master franchise by OFRNL.</p>
          <p>Locations in Lagos (Victoria Island, Lekki, Ikeja) and Abuja (Wuse II).</p>
        </div>
      </footer>

      {/* Premium Food Customizer & Ordering Modal for Spur */}
      <AnimatePresence>
        {customizingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 text-neutral-100"
            >
              {/* Header Image banner */}
              <div className="h-48 relative bg-neutral-900">
                <img
                  src={customizingItem.imageUrl}
                  alt={customizingItem.name}
                  className="w-full h-full object-cover animate-fade-in"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                <button
                  onClick={() => setCustomizingItem(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-sm font-bold transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] bg-amber-500 text-neutral-950 font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                    {customizingItem.category}
                  </span>
                  <h3 className="text-xl font-bold font-sans leading-tight text-white">{customizingItem.name}</h3>
                </div>
              </div>

              {/* Main Contents */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">{customizingItem.description}</p>
                  <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-neutral-500 font-mono">
                    <span>⏱️ Kitchen prep: {customizingItem.prepTime} Mins</span>
                    <span>🔥 Grills: Flame-charred on hot coal (400°C)</span>
                    {customizingItem.isPopular && <span className="text-amber-500 font-bold">⭐ Legendary Spur Choice</span>}
                  </div>
                </div>

                {/* DYNAMIC FORMS BY CATEGORY */}
                {customizingItem.category === 'Steaks & Grills' ? (
                  <div className="space-y-4 pt-4 border-t border-neutral-800">
                    {/* Cooking Doneness */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-400 uppercase font-black tracking-wider">
                        Cooking Doneness
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['Rare', 'Medium Rare', 'Medium', 'Well Done'] as const).map((dn) => (
                          <button
                            type="button"
                            key={dn}
                            onClick={() => setSpurDoneness(dn)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              spurDoneness === dn
                                ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                                : 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700'
                            }`}
                          >
                            <span className="block text-xs font-bold">{dn}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Basting Sauce */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-400 uppercase font-black tracking-wider">
                        Choose Grilling Basting Sauce
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Signature Sweet BBQ', 'Creamy Pepper Garlic', 'Spicy Texan Durky'] as const).map((bst) => (
                          <button
                            type="button"
                            key={bst}
                            onClick={() => setSpurBasting(bst)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              spurBasting === bst
                                ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold shadow-lg'
                                : 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700'
                            }`}
                          >
                            <span className="block text-xs font-bold leading-tight">{bst}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Choice of Side */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-400 uppercase font-black tracking-wider">
                        Accompanying Premium Side
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Hot Chips & Onion Rings', desc: 'Sizzling hand-cut fries', mod: 'Included' },
                          { name: 'Baked Butter Potato', desc: 'With salted butter dollop', mod: 'Included' },
                          { name: 'Fresh Greek Salad', desc: 'Crumbled feta & olives', mod: '+₦500' },
                          { name: 'Spicy Rice', desc: 'Flavor-infused side rice', mod: 'Included' }
                        ].map((sd) => (
                          <button
                            type="button"
                            key={sd.name}
                            onClick={() => setSpurSide(sd.name as any)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              spurSide === sd.name
                                ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                                : 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700'
                            }`}
                          >
                            <span className="block text-xs font-bold">{sd.name}</span>
                            <span className="block text-[10px] text-neutral-400 mt-0.5">{sd.desc}</span>
                            <span className="block text-[10px] font-mono text-neutral-500 mt-1">{sd.mod}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : customizingItem.category === 'Burgers' ? (
                  <div className="space-y-4 pt-4 border-t border-neutral-800">
                    {/* Extra Burger Toppings */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-400 uppercase font-black tracking-wider">
                        Add Premium Burger Toppings
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Double Cheddar Cheese Slice', price: 800 },
                          { name: 'Crispy Honey Bacon Strips', price: 1200 },
                          { name: 'Sautéed Garlic Mushrooms', price: 600 },
                          { name: 'Sizzling Avocado Slices', price: 800 }
                        ].map((top) => {
                          const isSelected = spurBurgerTopping.includes(top.name);
                          return (
                            <button
                              type="button"
                              key={top.name}
                              onClick={() => {
                                if (isSelected) {
                                  setSpurBurgerTopping(spurBurgerTopping.filter(t => t !== top.name));
                                } else {
                                  setSpurBurgerTopping([...spurBurgerTopping, top.name]);
                                }
                              }}
                              className={`p-3 rounded-xl border text-left transition-all flex justify-between items-center ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                                  : 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700'
                              }`}
                            >
                              <div className="text-left">
                                <span className="block text-xs font-bold">{top.name}</span>
                              </div>
                              <span className="text-[10px] font-mono text-neutral-400">+₦{top.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4 border-t border-neutral-800">
                    {/* Beverage Size Option */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-400 uppercase font-black tracking-wider">
                        Serving Size
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Regular', desc: 'Standard Portion Size', mod: 'Standard' },
                          { name: 'Large', desc: 'Saturating Double Portion', mod: '+₦600' }
                        ].map((sz) => (
                          <button
                            type="button"
                            key={sz.name}
                            onClick={() => setSpurDrinkSize(sz.name as any)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              spurDrinkSize === sz.name
                                ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                                : 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700'
                            }`}
                          >
                            <span className="block text-xs font-bold">{sz.name}</span>
                            <span className="block text-[10px] text-neutral-400 mt-0.5">{sz.desc}</span>
                            <span className="block text-[10px] font-mono text-neutral-500 mt-1">{sz.mod}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Kitchen Special Instructions */}
                <div className="space-y-2 pt-4 border-t border-neutral-800">
                  <label className="block text-xs font-mono text-neutral-400 uppercase font-black tracking-wider">
                    Special Kitchen Notes / Requests
                  </label>
                  <input
                    type="text"
                    value={spurInstructions}
                    onChange={(e) => setSpurInstructions(e.target.value)}
                    placeholder="E.g. Sauce on the side, well done, extra wet basting, hot chips crisp..."
                    className="w-full px-4 py-3 text-xs bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-amber-500 text-white placeholder-neutral-600"
                  />
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-6 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Quantity modifier */}
                <div className="flex items-center gap-3 border border-neutral-800 rounded-xl bg-neutral-900 p-1.5 shrink-0 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setSpurQuantity(Math.max(1, spurQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-400 flex items-center justify-center font-bold text-sm"
                  >
                    －
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-black text-white">{spurQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setSpurQuantity(spurQuantity + 1)}
                    className="w-8 h-8 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-400 flex items-center justify-center font-bold text-sm"
                  >
                    ＋
                  </button>
                </div>

                {/* Pricing & Add to Plate button */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-neutral-500 text-[10px] block uppercase font-mono tracking-wider font-bold">Custom Total</span>
                    <span className="text-xl font-mono font-black text-amber-500">
                      ₦{getSpurCustomizedPrice().toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleConfirmSpurCustomization}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono font-black text-xs rounded-xl uppercase tracking-widest transition-all shadow-md hover:shadow-lg"
                  >
                    Add to plate ✓
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSideMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/60 backdrop-blur-sm">
            {/* Backdrop click closes drawer */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsSideMenuOpen(false)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-xs sm:max-w-sm bg-white h-screen shadow-2xl flex flex-col justify-between border-l border-neutral-200 relative z-10 text-neutral-800 animate-none"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                <div className="flex items-center gap-2">
                  <div className="bg-[#ca1c32] p-2 rounded-xl">
                    <ChefHat className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#ca1c32] font-mono font-black uppercase tracking-widest block">SPUR RANCH</span>
                    <span className="text-xs font-sans font-black text-[#212d53] uppercase block">Navigation</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer border border-neutral-200"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Search in Drawer */}
                <div className="py-1">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search sizzling steaks & grills..."
                      value={drawerSearchQuery}
                      onChange={(e) => setDrawerSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 bg-neutral-50 hover:bg-neutral-100 focus:bg-white text-xs font-semibold border border-neutral-200 focus:border-[#ca1c32] rounded-xl outline-none transition-all placeholder:text-neutral-400 text-neutral-800"
                    />
                    {drawerSearchQuery && (
                      <button
                        onClick={() => setDrawerSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Menu Links */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-400 font-mono uppercase font-black tracking-wider block mb-2">Sections</span>
                  <button 
                    onClick={() => { setActiveTab('home'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); setIsSideMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                      activeTab === 'home' ? 'bg-[#ca1c32] text-white border-[#ca1c32]' : 'bg-neutral-50 text-neutral-600 hover:text-[#ca1c32] hover:bg-neutral-100 border-neutral-100'
                    }`}
                  >
                    <span>Home</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { setActiveTab('menu'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); setIsSideMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                      activeTab === 'menu' ? 'bg-[#ca1c32] text-white border-[#ca1c32]' : 'bg-neutral-50 text-neutral-600 hover:text-[#ca1c32] hover:bg-neutral-100 border-neutral-100'
                    }`}
                  >
                    <span>Menu</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { setActiveTab('almanac'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); setSelectedAlmanacPage(null); setIsSideMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                      activeTab === 'almanac' ? 'bg-[#ca1c32] text-white border-[#ca1c32]' : 'bg-neutral-50 text-neutral-600 hover:text-[#ca1c32] hover:bg-neutral-100 border-neutral-100'
                    }`}
                  >
                    <span>Grills</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { setActiveTab('reservations'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); setIsSideMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                      activeTab === 'reservations' ? 'bg-[#ca1c32] text-white border-[#ca1c32]' : 'bg-neutral-50 text-neutral-600 hover:text-[#ca1c32] hover:bg-neutral-100 border-neutral-100'
                    }`}
                  >
                    <span>Book Table Spot</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { setActiveTab('locator'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); setIsSideMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                      activeTab === 'locator' ? 'bg-[#ca1c32] text-white border-[#ca1c32]' : 'bg-neutral-50 text-neutral-600 hover:text-[#ca1c32] hover:bg-neutral-100 border-neutral-100'
                    }`}
                  >
                    <span>Steakhouse Locator</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Search Results in Drawer */}
                {drawerSearchQuery && (
                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase font-black tracking-wider block">Found Grills</span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {spurMenu
                        .filter(item => 
                          item.name.toLowerCase().includes(drawerSearchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(drawerSearchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(drawerSearchQuery.toLowerCase())
                        )
                        .slice(0, 5)
                        .map(item => (
                          <div 
                            key={item.id}
                            onClick={() => { handleViewItemById(item.id); setIsSideMenuOpen(false); }}
                            className="p-2 border border-neutral-100 rounded-xl bg-neutral-50 hover:bg-neutral-100 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                            <div className="min-w-0 flex-grow">
                              <h5 className="text-[11px] font-bold text-neutral-800 truncate">{item.name}</h5>
                              <span className="text-[9px] text-[#ca1c32] font-mono font-bold">₦{item.price.toLocaleString()}</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer - Contact info & Social links */}
              <div className="p-5 border-t border-neutral-100 bg-neutral-50 font-mono text-[10px] space-y-4 text-neutral-500">
                <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider block">CONTACT & BOOKINGS</span>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#ca1c32]" />
                    <span>Open: 10am To 11pm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#ca1c32]" />
                    <span>+234 8127149859</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ca1c32]" />
                    <span className="truncate">designmodesolutions@gmail.com</span>
                  </div>
                </div>

                {/* Social icons */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                  <span className="w-5 h-5 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[9px] text-neutral-600 hover:text-[#ca1c32] hover:bg-neutral-50 cursor-pointer">f</span>
                  <span className="w-5 h-5 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[9px] text-neutral-600 hover:text-[#ca1c32] hover:bg-neutral-50 cursor-pointer">t</span>
                  <span className="w-5 h-5 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[9px] text-neutral-600 hover:text-[#ca1c32] hover:bg-neutral-50 cursor-pointer">g+</span>
                  <span className="w-5 h-5 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[9px] text-neutral-600 hover:text-[#ca1c32] hover:bg-neutral-50 cursor-pointer">o</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Success Toast Notification Banner */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#212d53] border-2 border-[#fcc800] text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <div className="w-9 h-9 rounded-full bg-[#fcc800] text-neutral-950 flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5 text-neutral-950 font-bold" />
            </div>
            <div>
              <span className="text-[10px] text-[#fcc800] font-mono uppercase font-bold block text-left">Kitchen Notice</span>
              <p className="text-xs font-semibold leading-tight text-left">{addedToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
