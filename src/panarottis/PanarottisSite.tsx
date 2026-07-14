import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, MapPin, Clock, Phone, Star, Shield, 
  ChevronRight, ShoppingBag, Plus, Minus, Trash2, Heart,
  Flame, CheckCircle, Calendar, Users, User as UserIcon, Eye, Gift, Play, Navigation, Compass, Sparkles, Mail, Pizza,
  Send, HelpCircle, ChevronDown, ChevronUp, Award, Search, Menu
} from 'lucide-react';
import { MenuItem, Store, Order, TableReservation, User } from '../types';
import { PANAROTTIS_LOGO, PANAROTTIS_LOGO_WHITE } from '../data/base64Images';
import ReservationWidget from './ReservationWidget';
import SpecialDishes from './SpecialDishes';
import ChalkboardMenu from './ChalkboardMenu';
import SpecialtyCuisine from './SpecialtyCuisine';
import ChefSection from './ChefSection';

// Subpage Components for Massively Expanded Pages
import MenuItemDetail from './components/MenuItemDetail';
import MasterclassDetail from './components/MasterclassDetail';
import MilestoneDetail from './components/MilestoneDetail';
import StoreHubDetail from './components/StoreHubDetail';
// Removed PageExplorer import

interface PanarottisSiteProps {
  menuItems: MenuItem[];
  stores: Store[];
  cart: { menuItem: MenuItem; quantity: number }[];
  onAddToCart: (item: MenuItem, quantity?: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onUpdateCartQuantity: (itemId: string, qty: number) => void;
  onPlaceOrder: (details: { name: string; email: string; phone: string; address: string; brand: 'spur' | 'panarottis' }) => void;
  onNavigate: (view: 'portal' | 'spur' | 'panarottis' | 'admin' | 'cart') => void;
  onAddReview: (name: string, rating: number, message: string) => void;
  activeOrders: Order[];
  currentUser: User;
  onOpenProfile: () => void;
}

export default function PanarottisSite({
  menuItems,
  stores,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onPlaceOrder,
  onNavigate,
  onAddReview,
  activeOrders,
  currentUser,
  onOpenProfile
}: PanarottisSiteProps) {
  const panMenu = menuItems.filter(item => item.brand === 'panarottis');
  const panStores = stores.filter(store => store.brand === 'panarottis' || store.brand === 'both');
  const corePageIds = ['home', 'menu', 'locator', 'reservations', 'about', 'tracking'];

  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'locator' | 'reservations' | 'about' | 'tracking'>('home');
  const [activePageId, setActivePageId] = useState<string>('home');
  const [showPagesDrawer, setShowPagesDrawer] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [explorerSearch, setExplorerSearch] = useState('');
  
  // Subpage states for deep navigation
  const [activeSubPage, setActiveSubPage] = useState<{
    type: 'menu-item' | 'masterclass-detail' | 'milestone-detail' | 'store-detail' | null;
    id: string | null;
  }>({ type: null, id: null });

  // Deep routing resolver for custom special IDs to standard menu IDs
  const handleViewItemById = (id: string) => {
    let targetId = id;
    if (id === 'special-seafood-deluxe') targetId = 'panarottis-1';
    if (id === 'special-al-capone') targetId = 'panarottis-3';
    if (id === 'special-classic-margherita') targetId = 'panarottis-6';
    if (id === 'special-lasagna') targetId = 'panarottis-5';
    if (id === 'special-italian-caesar') targetId = 'panarottis-7';
    setActiveSubPage({ type: 'menu-item', id: targetId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [checkoutStage, setCheckoutStage] = useState<'cart' | 'payment'>('cart');
  const [isSourdoughDrawerOpen, setIsSourdoughDrawerOpen] = useState(false);
  const [selectedBeverageFlavor, setSelectedBeverageFlavor] = useState<'Coca-Cola' | 'Pepsi' | 'Fanta Orange' | 'Maltina' | 'Chi Exotic' | 'Nigerian Chapman' | 'Zobo Craft'>('Coca-Cola');
  const [cartBounced, setCartBounced] = useState(false);

  // Pizza Quick-Order Menu and Search states
  const [isPizzaMenuOpen, setIsPizzaMenuOpen] = useState(false);
  const [hoveredQuickItem, setHoveredQuickItem] = useState<MenuItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [quickAddSuccess, setQuickAddSuccess] = useState<string | null>(null);

  // Static content for frontend search
  const promos = [
    { title: "Midweek Sizzler BOGO", description: "Buy one Gourmet Pizza, get a classic Margherita for 50% off every Tuesday & Wednesday." },
    { title: "Family Sharing Feast", description: "Get any 2 Large Pizzas, 1 Family Pasta, and 2.5L Coca-Cola for a sweet discounted price." },
    { title: "Sourdough Masterclass Pass", description: "Register for Chef Giovanni's hands-on pizza masterclass. Includes a custom starter kit." }
  ];

  const blogs = [
    { title: "The 36-Hour Sourdough Mastery", summary: "Discover why fermentation time directly impacts your dough digestibility and crust balloon bubbles.", category: "BREAD CRAFT" },
    { title: "Finding True Napoli Pomodoros", summary: "Exploring volcanic soils where our sweet San Marzano tomatoes ripen to create the perfect low-acid pizza sauce base.", category: "INGREDIENTS" },
    { title: "High-Heat Stone-Oven Science", summary: "Why baking at 480°C on volcanic fireclay creates that perfect charred leopard-spot crust.", category: "HEAT SCIENCE" }
  ];

  const searchResults = searchQuery.trim() === '' ? { menu: [], promos: [], blogs: [] } : {
    menu: panMenu.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4),
    promos: promos.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    blogs: blogs.filter(b => 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)
  };

  useEffect(() => {
    const pizzas = menuItems.filter(item => item.brand === 'panarottis' && item.category.includes('Pizzas'));
    if (pizzas.length > 0 && !hoveredQuickItem) {
      setHoveredQuickItem(pizzas[0]);
    }
  }, [menuItems, hoveredQuickItem]);

  const handleAddWithFeedback = (item: MenuItem, qty: number = 1) => {
    onAddToCart(item, qty);
    setCheckoutStage('cart');
    setCheckoutMode(true);
    setCartBounced(true);
    setTimeout(() => setCartBounced(false), 600);
  };

  // Search and Filter Menu State
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<'All' | 'Vegetarian' | 'Spicy' | 'Popular'>('All');

  // Checkout Fields
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // Automated Hero Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      title: "90 Minutes Endless Flavour Trio Deal",
      subtitle: "THE ULTIMATE SHARING FEAST",
      description: "Enjoy 2 Large Pizzas + 1 Cheesy Bread + 7pcs Chicken Wings + 4 PET Bottles for a legendary family price!",
      price: "₦36,520",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1600",
      cta: "Order Trio Deal Now",
      tab: "menu" as const
    },
    {
      title: "Weekend Lite Premium Combo",
      subtitle: "WEEKEND PIZZA PARTY",
      description: "Get 1 Large Pizza + 1 Ice Cold Bottle + 1 Garlic Cheesy Bread to completely fuel your weekend vibes!",
      price: "₦13,999",
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=1600",
      cta: "Order Weekend Lite",
      tab: "menu" as const
    },
    {
      title: "Mega Boss Ultimate Feast",
      subtitle: "RULE THE TABLE LIKE A BOSS",
      description: "2 Large Gourmet Pizzas + Chicken Wings Platter + 1 bottle of Refreshing Pepsi. Crafted for the true flavor boss!",
      price: "₦29,999",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=1600",
      cta: "Order Mega Boss Deal",
      tab: "menu" as const
    }
  ];

  // Auto-rotating slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Full-featured dynamic Customizer Modal States
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [pizzaSize, setPizzaSize] = useState<'Small' | 'Medium' | 'Large' | 'Family'>('Large');
  const [pizzaCrust, setPizzaCrust] = useState<'36hr Sourdough Thin' | 'Double Cheese Stuffed' | 'Gluten-Free Cauliflower' | 'Thick Neapolitan Pan'>('36hr Sourdough Thin');
  const [pizzaCheese, setPizzaCheese] = useState<'Traditional Mozzarella' | 'Four-Cheese Gorgonzola' | 'Vegan Cheese' | 'No Cheese'>('Traditional Mozzarella');
  const [extraToppingsList, setExtraToppingsList] = useState<string[]>([]);
  const [pizzaQuantity, setPizzaQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Non-Pizza customizer states
  const [selectedPastaType, setSelectedPastaType] = useState<'Fettuccine' | 'Spaghetti' | 'Penne'>('Fettuccine');
  const [pastaAddons, setPastaAddons] = useState<string[]>([]);
  const [beverageSize, setBeverageSize] = useState<'Regular' | 'Large'>('Regular');

  // Sourdough Masterclass Booking Form
  const [classType, setClassType] = useState<'fermentation' | 'stretching' | 'sauces'>('fermentation');
  const [classDate, setClassDate] = useState('');
  const [classTimeSlot, setClassTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [classGuests, setClassGuests] = useState(1);
  const [classSuccess, setClassSuccess] = useState(false);

  // Sourdough customizer
  const [crust, setCrust] = useState<'36hr Sourdough Thin' | 'Double Cheese Stuffed' | 'Gluten-Free Cauliflower'>('36hr Sourdough Thin');
  const [cheese, setCheese] = useState<'Traditional Mozzarella' | 'Four-Cheese Italian Gorgonzola' | 'Vegan Dairy-Free'>('Traditional Mozzarella');
  const [toppings, setToppings] = useState<string[]>(['Queen Prawns', 'Sliced Pepperoni']);
  const [pizzaAdded, setPizzaAdded] = useState(false);

  // Review Submissions
  const [reviewName, setReviewName] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState([
    { name: 'Amara N.', rating: 5, date: '2026-07-09', msg: 'The seafood garlic pizza is loaded with flavor. My kids absolute favorite!' },
    { name: 'Kenechukwu U.', rating: 4, date: '2026-07-11', msg: 'Fantastic slow-fermented crust. Crust is crispy, light and airy. 10/10' }
  ]);

  // Delivery Routing Live Simulation State
  const [selectedActiveOrder, setSelectedActiveOrder] = useState<Order | null>(null);
  const [simCoordinates, setSimCoordinates] = useState({ lat: 6.4492, lng: 3.4731 });
  const [simPercent, setSimPercent] = useState(0);

  // Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Reservation Form States
  const [resName, setResName] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resPersons, setResPersons] = useState('1 Person');
  const [resDate, setResDate] = useState('');
  const [resTime, setResTime] = useState('');
  const [resSuccess, setResSuccess] = useState(false);

  // Active Chef Index
  const [activeChefIdx, setActiveChefIdx] = useState(0);
  const chefs = [
    { name: 'Giovanni Rossi', role: 'Classic Dough & Oven-Fresh Specialist', desc: 'Guardian of the 36-hour slow-proofed fluffy dough, direct from Campania.', img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600' },
    { name: 'Marco Bianchi', role: 'Chef de Pasta', desc: 'Craftsman of fresh fettuccine and slow-simmered rich beef bolognese.', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600' },
    { name: 'Francesca Moretti', role: 'Pastry & Dessert Lead', desc: 'Prepares our famous cocoa-dusted tiramisu and sweet cream panna cotta.', img: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=600' }
  ];

  // Chalkboard Category Filter
  const [chalkboardCategory, setChalkboardCategory] = useState<'Pizza' | 'Pasta' | 'Salads' | 'Drinks'>('Pizza');

  const categories = ['All', 'Gourmet Pizzas', 'Classic Pizzas', 'Hearty Pastas', 'Chilled Beverages'];
  
  const filteredMenu = panMenu.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (menuSearchTerm && !item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) && !item.description.toLowerCase().includes(menuSearchTerm.toLowerCase())) return false;
    if (selectedTag === 'Vegetarian' && !item.description.toLowerCase().includes('veg') && !item.description.toLowerCase().includes('margherita')) return false;
    if (selectedTag === 'Spicy' && !item.description.toLowerCase().includes('spic') && !item.description.toLowerCase().includes('chili') && !item.description.toLowerCase().includes('capone')) return false;
    if (selectedTag === 'Popular' && !item.isPopular) return false;
    return true;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  // Available toppings for customizer
  const availableToppings = [
    { name: 'Queen Prawns', price: 1500 },
    { name: 'Spiced Suya Chicken', price: 1200 },
    { name: 'Sliced Pepperoni', price: 1000 },
    { name: 'Peppered Gizzard Slices', price: 1100 },
    { name: 'Calamari Strips', price: 1200 },
    { name: 'Sautéed Plantain (Dodo)', price: 800 },
    { name: 'Oven Roasted Mushrooms', price: 600 },
    { name: 'Hot Ata Rodo (Habanero)', price: 400 },
    { name: 'Fiery Jalapeño Peppers', price: 500 },
    { name: 'Local Basil (Efirin) Leaves', price: 300 },
    { name: 'Fresh Basil Leaves', price: 300 }
  ];

  // Helper for opening customizer modal
  const handleOpenCustomizer = (item: MenuItem) => {
    setCustomizingItem(item);
    setPizzaQuantity(1);
    setSpecialInstructions('');
    if (item.category.toLowerCase().includes('pizza')) {
      setPizzaSize('Large');
      setPizzaCrust('36hr Sourdough Thin');
      setPizzaCheese('Traditional Mozzarella');
      setExtraToppingsList([]);
    } else if (item.category.toLowerCase().includes('pasta')) {
      setSelectedPastaType('Fettuccine');
      setPastaAddons([]);
    } else {
      setBeverageSize('Regular');
      setSelectedBeverageFlavor('Coca-Cola');
    }
  };

  const handleToggleExtraTopping = (toppingName: string) => {
    if (extraToppingsList.includes(toppingName)) {
      setExtraToppingsList(extraToppingsList.filter(t => t !== toppingName));
    } else {
      setExtraToppingsList([...extraToppingsList, toppingName]);
    }
  };

  const handleTogglePastaAddon = (addonName: string) => {
    if (pastaAddons.includes(addonName)) {
      setPastaAddons(pastaAddons.filter(a => a !== addonName));
    } else {
      setPastaAddons([...pastaAddons, addonName]);
    }
  };

  const getCustomizedItemPrice = () => {
    if (!customizingItem) return 0;
    let base = customizingItem.price;

    if (customizingItem.category.toLowerCase().includes('pizza')) {
      // size
      if (pizzaSize === 'Small') base -= 1500;
      if (pizzaSize === 'Large') base += 2500;
      if (pizzaSize === 'Family') base += 4500;
      // crust
      if (pizzaCrust === 'Double Cheese Stuffed') base += 1500;
      if (pizzaCrust === 'Gluten-Free Cauliflower') base += 1000;
      if (pizzaCrust === 'Thick Neapolitan Pan') base += 500;
      // cheese
      if (pizzaCheese === 'Four-Cheese Gorgonzola') base += 1000;
      if (pizzaCheese === 'Vegan Cheese') base += 500;
      // toppings
      extraToppingsList.forEach(tName => {
        const found = availableToppings.find(top => top.name === tName);
        if (found) base += found.price;
      });
    } else if (customizingItem.category.toLowerCase().includes('pasta')) {
      if (pastaAddons.includes('Extra Mozzarella')) base += 800;
      if (pastaAddons.includes('Sautéed Mushrooms')) base += 600;
      if (pastaAddons.includes('Grilled Chicken Breast')) base += 1200;
      if (pastaAddons.includes('Toasted Garlic Bread')) base += 400;
    } else {
      if (beverageSize === 'Large') base += 800;
    }

    return base * pizzaQuantity;
  };

  const handleConfirmCustomization = () => {
    if (!customizingItem) return;

    let basePrice = customizingItem.price;
    let finalId = `${customizingItem.id}-${Date.now()}`;
    let finalName = customizingItem.name;
    let finalDesc = customizingItem.description;

    if (customizingItem.category.toLowerCase().includes('pizza')) {
      // modifiers
      let sizeModifier = 0;
      if (pizzaSize === 'Small') sizeModifier = -1500;
      if (pizzaSize === 'Large') sizeModifier = 2500;
      if (pizzaSize === 'Family') sizeModifier = 4500;

      let crustModifier = 0;
      if (pizzaCrust === 'Double Cheese Stuffed') crustModifier = 1500;
      if (pizzaCrust === 'Gluten-Free Cauliflower') crustModifier = 1000;
      if (pizzaCrust === 'Thick Neapolitan Pan') crustModifier = 500;

      let cheeseModifier = 0;
      if (pizzaCheese === 'Four-Cheese Gorgonzola') cheeseModifier = 1000;
      if (pizzaCheese === 'Vegan Cheese') cheeseModifier = 500;

      let toppingsModifier = 0;
      extraToppingsList.forEach(tName => {
        const found = availableToppings.find(top => top.name === tName);
        if (found) toppingsModifier += found.price;
      });

      basePrice = basePrice + sizeModifier + crustModifier + cheeseModifier + toppingsModifier;
      finalName = `${customizingItem.name} (${pizzaSize})`;
      const topsText = extraToppingsList.length > 0 ? ` + ${extraToppingsList.join(', ')}` : '';
      finalDesc = `Crust: ${pizzaCrust}, Cheese: ${pizzaCheese}${topsText}.${specialInstructions ? ` Notes: "${specialInstructions}"` : ''}`;
    } else if (customizingItem.category.toLowerCase().includes('pasta')) {
      let addonModifier = 0;
      if (pastaAddons.includes('Extra Mozzarella')) addonModifier += 800;
      if (pastaAddons.includes('Sautéed Mushrooms')) addonModifier += 600;
      if (pastaAddons.includes('Grilled Chicken Breast')) addonModifier += 1200;
      if (pastaAddons.includes('Toasted Garlic Bread')) addonModifier += 400;

      basePrice = basePrice + addonModifier;
      finalName = `${customizingItem.name} (${selectedPastaType})`;
      const addonsText = pastaAddons.length > 0 ? ` Addons: ${pastaAddons.join(', ')}` : '';
      finalDesc = `Pasta Type: ${selectedPastaType}.${addonsText}.${specialInstructions ? ` Notes: "${specialInstructions}"` : ''}`;
    } else {
      let sizeModifier = 0;
      if (beverageSize === 'Large') sizeModifier = 800;

      basePrice = basePrice + sizeModifier;
      finalName = `${customizingItem.name} - ${selectedBeverageFlavor} (${beverageSize})`;
      finalDesc = `${selectedBeverageFlavor} beverage, ${beverageSize} size.${specialInstructions ? ` Notes: "${specialInstructions}"` : ''}`;
    }

    const customizedItem: MenuItem = {
      ...customizingItem,
      id: finalId,
      name: finalName,
      description: finalDesc,
      price: basePrice,
    };

    handleAddWithFeedback(customizedItem, pizzaQuantity);
    setCustomizingItem(null);
  };

  // Custom Pizza Calculations
  const getCustomPizzaPrice = () => {
    let base = 7500;
    if (crust === 'Double Cheese Stuffed') base = 9000;
    if (cheese === 'Four-Cheese Italian Gorgonzola') base += 1000;
    
    // Sum selected toppings
    toppings.forEach(tName => {
      const found = availableToppings.find(top => top.name === tName);
      if (found) base += found.price;
    });
    return base;
  };

  const handleToggleTopping = (name: string) => {
    if (toppings.includes(name)) {
      setToppings(toppings.filter(t => t !== name));
    } else {
      setToppings([...toppings, name]);
    }
  };

  const handleAddCustomPizza = () => {
    const customPizzaItem: MenuItem = {
      id: `custom-pizza-${Date.now()}`,
      name: 'Custom Wood-Fired Pizza',
      description: `Custom ${crust} crust, basted in ${cheese}. Toppings: ${toppings.join(', ') || 'Cheese and sauce only'}.`,
      price: getCustomPizzaPrice(),
      category: 'Gourmet Pizzas',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      brand: 'panarottis',
      isPopular: false,
      prepTime: 18
    };
    handleAddWithFeedback(customPizzaItem, 1);
    setPizzaAdded(true);
    setIsSourdoughDrawerOpen(false);
    setTimeout(() => setPizzaAdded(false), 3000);
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
      brand: 'panarottis'
    });
    setCheckoutMode(false);
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustAddress('');
    setActiveTab('tracking');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  // Delivery simulation loop
  useEffect(() => {
    const panOrders = activeOrders.filter(o => o.brand === 'panarottis');
    if (panOrders.length > 0 && !selectedActiveOrder) {
      setSelectedActiveOrder(panOrders[panOrders.length - 1]);
    }
  }, [activeOrders]);

  useEffect(() => {
    let interval: any;
    if (selectedActiveOrder && selectedActiveOrder.status !== 'delivered') {
      setSimPercent(10);
      setSimCoordinates({ lat: 6.4492, lng: 3.4731 });
      
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

  const faqs = [
    {
      q: "What makes Panarottis 36-hour slow-proofed fresh dough so special?",
      a: "Our signature fresh dough is proofed at controlled cold temperatures for exactly 36 hours. This slow proofing process results in a incredibly soft, rich, and delicious crust that is perfectly fluffy on the inside with a golden crispy outer bite."
    },
    {
      q: "Are the wood-fired ovens authentic brick ovens?",
      a: "Absolutely! We bake our pizzas at over 400°C inside imported stone-deck ovens heated with dry wood embers. This yields a crispy-underneath crust while maintaining a perfectly moist, melted cheese top."
    },
    {
      q: "Do you offer vegan and gluten-free pizza alternatives?",
      a: "Yes! Our customizer allows you to select a Gluten-Free Cauliflower crust base and dairy-free vegan cheese. You can then stack it with any of our roasted vegetable or herb toppings."
    }
  ];

  // Dynamic non-homepage header information resolver
  let headerTitle = "Our Pizzeria Desk";
  let headerDesc = "Freshly baked loaded pizzas, baked at over 400°C in our signature stone deck ovens.";
  let headerBgImg = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200";

  if (checkoutMode) {
    headerTitle = "Your Oven-Fresh Pizza Basket";
    headerDesc = "Review your delicious selections and complete your secure online order.";
    headerBgImg = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200";
  } else if (activeSubPage.type === 'menu-item') {
    const item = panMenu.find(m => m.id === activeSubPage.id);
    headerTitle = item ? item.name : "Product Detail";
    headerDesc = item ? item.description : "View item specifications and choose your cheesy custom toppings.";
    headerBgImg = item ? item.imageUrl : "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200";
  } else if (activeSubPage.type === 'store-detail') {
    const store = panStores.find(s => s.id === activeSubPage.id);
    headerTitle = store ? `Store: ${store.name}` : "Store Hub Details";
    headerDesc = store ? `${store.city} outlets, high-heat stone ovens and active delivery services.` : "Find pizzerias near you.";
    headerBgImg = "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200";
  } else if (activeSubPage.type === 'masterclass-detail') {
    headerTitle = "Pizza Masterclass Academy";
    headerDesc = "Learn our 36h slow-proofed dough secret, hand-stretching, and stone oven baking.";
    headerBgImg = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200";
  } else if (activeSubPage.type === 'milestone-detail') {
    headerTitle = "Our Milestone Story";
    headerDesc = "Step-by-step history of our oven-fresh pizza legacy and signature dough recipe.";
    headerBgImg = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200";
  } else if (activePageId === 'menu') {
    headerTitle = "Our Oven-Fresh Menu";
    headerDesc = "Soft hand-tossed 36h slow-proofed pizza bases with loaded premium toppings.";
    headerBgImg = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200";
  } else if (activePageId === 'locator') {
    headerTitle = "Pizzeria Locator";
    headerDesc = "Find your nearest Panarottis hub and experience hot freshly-baked pizza.";
    headerBgImg = "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200";
  } else if (activePageId === 'reservations') {
    headerTitle = "Book Table & Masterclass";
    headerDesc = "Reserve a shared family dining space or secure your spot at Pizza Making Academy.";
    headerBgImg = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200";
  } else if (activePageId === 'about') {
    headerTitle = "Our Dough Story";
    headerDesc = "Chronicles of premium flour, high-heat stone ovens, and our famous 36h slow-proofed recipe.";
    headerBgImg = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200";
  } else if (activePageId === 'tracker' || activePageId === 'tracking') {
    headerTitle = "Live Pizza Delivery Tracker";
    headerDesc = "Follow your piping hot pizza live from our high-heat stone oven straight to your doorstep.";
    headerBgImg = "https://images.unsplash.com/photo-1526367790999-015078648c7e?auto=format&fit=crop&q=80&w=1200";
  }

  return (
    <div className="bg-white text-neutral-900 min-h-screen font-sans">
      
      {/* Brand Header & Switching */}
      <div className="bg-red-50 border-b border-red-100 py-2 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-[10px] gap-2">
        <button 
          onClick={() => onNavigate('portal')}
          className="text-red-600 font-mono font-bold hover:underline flex items-center gap-1.5 animate-pulse"
        >
          ← Back to Olive Brand Portal
        </button>
        <div className="flex gap-4 items-center">
          <span className="text-neutral-600 font-mono">Current Brand: <strong className="text-red-600">Panarottis Pizzeria</strong></span>
          <button 
            onClick={() => onNavigate('spur')}
            className="text-[#019993] font-mono font-bold hover:underline flex items-center gap-1"
          >
            Switch to Spur Steakhouse →
          </button>
        </div>
      </div>

      {/* Page 1: Solid Black Top Contact Info Bar */}
      <div className="hidden md:flex bg-neutral-950 text-neutral-300 py-2.5 px-4 sm:px-8 text-[11px] font-mono flex-col md:flex-row justify-between items-center gap-2.5 border-b border-neutral-900">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#019993]" />
            <span>Book Time - 10am To 11pm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#019993]" />
            <span>Call Us - +234 8127149859</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#019993]" />
            <span>designmodesolutions@gmail.com</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Social icons */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] hover:text-[#019993] cursor-pointer">f</span>
            <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] hover:text-[#019993] cursor-pointer">t</span>
            <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] hover:text-[#019993] cursor-pointer">g+</span>
            <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] hover:text-[#019993] cursor-pointer">o</span>
          </div>
        </div>
      </div>

      {/* Page 1: Elegant White Main Navbar */}
      <nav className="bg-white border-b border-neutral-100 py-3 px-4 sm:px-8 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative h-20 md:h-24">
          
          {/* LEFT SIDE: Side Menu Opener & Brand Logo */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Funky Side Menu Opener - Desktop only on left */}
            <button 
              onClick={() => setIsSideMenuOpen(true)}
              className="hidden md:flex px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl items-center gap-1.5 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 animate-pulse"
              id="side-menu-hamburger-trigger"
            >
              <span>☰</span>
              <span>MENU</span>
            </button>

            {/* Logo */}
            <button 
              onClick={() => { setActiveTab('home'); setActivePageId('home'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); }}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
              id="brand-logo-button"
            >
              <img 
                src={PANAROTTIS_LOGO} 
                alt="Panarottis Logo" 
                className="h-12 md:h-16 w-auto object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://logo.clearbit.com/panarottis.co.za';
                }}
              />
            </button>
          </div>

          {/* CENTER SPACE RESERVED FOR THE INTERACTIVE PIZZA MENU (Flex Spacer) */}
          <div className="flex-1 min-w-[64px]" />

          {/* RIGHT SIDE: Action Icons Panel (Only Icons!) */}
          <div className="flex items-center gap-4">
            {/* Action Icons Panel: Search, Cart, Sign In (Only Icons!) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* 1. Search Icon Button (Desktop Only) */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex p-2.5 rounded-xl border border-neutral-200 hover:border-[#019993]/50 hover:bg-[#019993]/5 text-neutral-600 hover:text-[#019993] transition-all duration-300 cursor-pointer items-center justify-center shadow-sm"
                title="Search Panarottis Website"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* 2. Cart Icon Button with Hover Dropdown */}
              <div className="relative group">
                <button 
                  onClick={() => { setCheckoutStage('cart'); setCheckoutMode(!checkoutMode); }}
                  className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center relative ${
                    cart.length === 0 
                      ? 'border-neutral-200 text-neutral-600 hover:border-red-500/50 hover:bg-red-500/5 shadow-sm' 
                      : 'border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20'
                  }`}
                  title="Your Pizza Basket"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-neutral-950 text-white text-[8px] font-mono font-black rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-bounce">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>

                {/* Dropdown Listings Container on Hover */}
                <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-2xl shadow-2xl hidden group-hover:block z-50 p-4 transition-all duration-300 text-neutral-800">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-100 mb-3">
                    <span className="font-serif font-black text-xs uppercase tracking-wide text-neutral-950">Your Pizza Cart</span>
                    <span className="text-[10px] font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-600">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-8 text-center">
                      <Pizza className="w-10 h-10 text-neutral-300 mx-auto animate-bounce mb-2" />
                      <p className="text-xs font-serif text-neutral-400">Your basket is currently empty</p>
                      <button 
                        onClick={() => { setActiveTab('menu'); setActivePageId('menu'); }}
                        className="text-[10px] text-[#019993] hover:underline font-mono font-bold uppercase mt-2 block mx-auto cursor-pointer"
                      >
                        Browse Woodfire Menu
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                        {cart.map((item) => (
                          <div key={item.menuItem.id} className="flex gap-2 items-center justify-between py-1.5 border-b border-neutral-50 last:border-0">
                            <img 
                              src={item.menuItem.imageUrl} 
                              alt={item.menuItem.name} 
                              className="w-10 h-10 object-cover rounded-lg shrink-0" 
                              referrerPolicy="no-referrer" 
                            />
                            <div className="flex-grow min-w-0 px-2 text-left">
                              <h5 className="font-bold text-xs truncate text-neutral-900">{item.menuItem.name}</h5>
                              <span className="text-[10px] font-mono text-neutral-500">
                                ₦{item.menuItem.price.toLocaleString()} x {item.quantity}
                              </span>
                            </div>
                            
                            {/* Small quantity control inside dropdown */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onUpdateCartQuantity(item.menuItem.id, Math.max(1, item.quantity - 1)); }}
                                className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); onUpdateCartQuantity(item.menuItem.id, item.quantity + 1); }}
                                className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                              >
                                +
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); onRemoveFromCart(item.menuItem.id); }}
                                className="text-red-500 hover:text-red-700 ml-1 text-xs cursor-pointer"
                                title="Remove item"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-xs font-bold">
                        <span className="text-neutral-700">Subtotal:</span>
                        <span className="text-red-600 font-mono text-sm">
                          ₦{cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0).toLocaleString()}
                        </span>
                      </div>

                      <button 
                        onClick={() => { setCheckoutStage('cart'); setCheckoutMode(true); }}
                        className="w-full mt-2 py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-mono font-black uppercase tracking-wider rounded-xl transition-all shadow-md text-center cursor-pointer block"
                      >
                        Checkout Now ➔
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Profile / Sign In Icon Button */}
              <button 
                onClick={onOpenProfile}
                className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center relative ${
                  currentUser.uid === 'guest'
                    ? 'border-neutral-200 text-neutral-600 hover:border-[#019993]/50 hover:bg-[#019993]/5 shadow-sm'
                    : 'border-[#019993] bg-[#019993]/5 text-[#019993] shadow-md shadow-[#019993]/10'
                }`}
                title={currentUser.uid === 'guest' ? 'Sign In / Register' : `${currentUser.displayName || 'User'}'s Profile`}
              >
                <UserIcon className="w-4 h-4" />
                {currentUser.uid !== 'guest' && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
                )}
              </button>

              {/* 4. Mobile Menu Trigger Button (Menu Option on Right) */}
              <button 
                onClick={() => setIsSideMenuOpen(true)}
                className="flex md:hidden p-2.5 rounded-xl border border-neutral-200 hover:border-red-500/50 hover:bg-[#019993]/5 text-neutral-700 hover:text-red-600 transition-all duration-300 cursor-pointer items-center justify-center shadow-sm"
                title="Open Pizza Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* THE MAJESTIC CENTERED GRAPHICAL PIZZA SLICE OVERLAPPING THE SLIDER */}
          {/* ========================================================================= */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 top-0 z-50 hidden md:flex flex-col items-center pointer-events-auto"
            onMouseEnter={() => setIsPizzaMenuOpen(true)}
            onMouseLeave={() => setIsPizzaMenuOpen(false)}
          >
            {/* The Highly Graphical Sourdough Woodfired Pizza Slice */}
            <button 
              onClick={() => setIsPizzaMenuOpen(!isPizzaMenuOpen)}
              className="relative block h-24 w-24 sm:h-28 sm:w-28 focus:outline-none transition-transform duration-300 hover:scale-110 select-none active:scale-95 cursor-pointer"
            >
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.35)] hover:drop-shadow-[0_12px_20px_rgba(239,68,68,0.25)] filter transition-all duration-300">
                {/* Sourdough Crust at the top (curved) with dark wood-fired leopard spots */}
                <path d="M 12 15 Q 60 4, 108 15 L 103 26 Q 60 15, 17 26 Z" fill="url(#crustGrad)" filter="url(#crustShadow)" />
                {/* Cheese/Sauce Base with warm gradients */}
                <path d="M 17 26 Q 60 15, 103 26 L 60 115 Z" fill="url(#cheeseGrad)" />
                
                {/* Roasted wood-fired char spots on cheese */}
                <circle cx="42" cy="38" r="4.5" fill="#78350F" opacity="0.45" />
                <circle cx="78" cy="42" r="3.5" fill="#78350F" opacity="0.4" />
                <circle cx="60" cy="68" r="5" fill="#78350F" opacity="0.5" />
                <circle cx="50" cy="90" r="3" fill="#78350F" opacity="0.45" />
                
                {/* Crispy Pepperoni Slices with 3D shadows & light shine */}
                <circle cx="36" cy="46" r="7" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
                <circle cx="38" cy="45" r="5" fill="#EF4444" />
                <circle cx="35" cy="43" r="1.5" fill="#FECDD3" opacity="0.7" />
                
                <circle cx="84" cy="52" r="8" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
                <circle cx="86" cy="51" r="6" fill="#EF4444" />
                <circle cx="83" cy="49" r="1.5" fill="#FECDD3" opacity="0.7" />
                
                <circle cx="58" cy="78" r="7.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
                <circle cx="60" cy="77" r="5.5" fill="#EF4444" />
                <circle cx="57" cy="75" r="1.5" fill="#FECDD3" opacity="0.7" />

                {/* Mushrooms (Fungi details) */}
                <path d="M 46 62 Q 50 58, 54 62 L 52 66 L 48 66 Z" fill="#E5E5E5" stroke="#A3A3A3" strokeWidth="0.5" />
                <path d="M 70 70 Q 74 66, 78 70 L 76 74 L 72 74 Z" fill="#E5E5E5" stroke="#A3A3A3" strokeWidth="0.5" />
                
                {/* Scattered Fresh Green Basil Leaves */}
                {/* Basil 1 */}
                <path d="M 40 58 Q 46 54, 49 62 Q 43 66, 40 58 Z" fill="#15803D" />
                <path d="M 40 58 L 49 62" stroke="#166534" strokeWidth="0.5" />
                {/* Basil 2 */}
                <path d="M 71 63 Q 69 70, 77 72 Q 79 65, 71 63 Z" fill="#16A34A" />
                {/* Basil 3 */}
                <path d="M 55 36 Q 61 32, 63 40 Q 57 42, 55 36 Z" fill="#15803D" />

                {/* Cheese strings melting downwards at the bottom tip */}
                <path d="M 58 112 Q 60 122, 62 112" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                <path d="M 55 109 Q 56 116, 58 109" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

                {/* Gradients Definition */}
                <defs>
                  <linearGradient id="crustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5C2C06" />
                    <stop offset="35%" stopColor="#B45309" />
                    <stop offset="65%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#5C2C06" />
                  </linearGradient>
                  <linearGradient id="cheeseGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="25%" stopColor="#FACC15" />
                    <stop offset="60%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                  <filter id="crustShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
                  </filter>
                </defs>
              </svg>

              {/* Steam waves animation floating above pizza slice */}
              <div className="absolute inset-0 pointer-events-none flex justify-center">
                <div className="flex gap-1.5 absolute top-1">
                  <span className="w-0.5 h-3 bg-neutral-100/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-4 bg-neutral-100/40 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-0.5 h-3 bg-neutral-100/30 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </button>

            {/* The Animated Circular Quick-Order Wooden Board */}
            <AnimatePresence>
              {isPizzaMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20, rotate: 12 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 180 }}
                  className="absolute top-[90px] md:top-[105px] w-[340px] sm:w-[410px] h-[340px] sm:h-[410px] bg-[#1e130c] border-4 border-[#3a2312] rounded-full shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-40 p-6 flex flex-col items-center justify-between text-white"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #2d1b10 0%, #150903 100%)',
                    boxShadow: 'inset 0 0 45px rgba(0,0,0,0.95), 0 25px 60px rgba(0,0,0,0.7)'
                  }}
                >
                  {/* Outer circular track with rivets to look like a premium medieval pizza paddle */}
                  <div className="absolute inset-2 rounded-full border border-dashed border-amber-600/25 pointer-events-none" />

                  {/* Wood Board Handle (Rustic aesthetics!) */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-8 h-10 bg-gradient-to-b from-[#3a2312] to-[#150903] rounded-b-md shadow-lg pointer-events-none border-x border-b border-amber-800/10" />
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rounded-full pointer-events-none" />

                  {/* Center Hub Display Panel: Hovered Pizza specs and Order CTA */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[#0d0401] border-2 border-dashed border-amber-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center justify-center text-center z-10 shadow-[inset_0_0_25px_rgba(0,0,0,0.98)]">
                    {hoveredQuickItem ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        {/* Selected Pizza Mini Thumb */}
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-500 shadow-md mb-1 bg-neutral-900 shrink-0">
                          <img 
                            src={hoveredQuickItem.imageUrl} 
                            alt={hoveredQuickItem.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h4 className="font-serif font-black text-[11px] sm:text-xs text-amber-100 tracking-tight leading-tight line-clamp-1">
                          {hoveredQuickItem.name}
                        </h4>
                        <p className="text-[8px] sm:text-[9px] text-neutral-300 font-serif leading-tight line-clamp-2 px-1 my-1">
                          {hoveredQuickItem.description}
                        </p>
                        <span className="font-mono text-[10px] sm:text-xs text-red-400 font-black mb-1 shrink-0">
                          ₦{hoveredQuickItem.price.toLocaleString()}
                        </span>
                        
                        {quickAddSuccess === hoveredQuickItem.id ? (
                          <span className="text-[9px] text-green-400 font-mono font-black animate-bounce flex items-center gap-1 bg-green-950/40 px-2 py-0.5 rounded-full border border-green-500/20 shrink-0">
                            ✓ Added!
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddWithFeedback(hoveredQuickItem, 1);
                              setQuickAddSuccess(hoveredQuickItem.id);
                              setTimeout(() => setQuickAddSuccess(null), 1500);
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 active:scale-95 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full text-white transition-all shadow-md hover:shadow-red-600/30 cursor-pointer shrink-0"
                          >
                            Add To Cart
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <Pizza className="w-6 h-6 text-amber-500 animate-spin-slow mb-1" />
                        <span className="text-[9px] text-amber-200/50 font-mono font-bold uppercase tracking-widest">
                          QUICK FEAST
                        </span>
                        <span className="text-[8px] text-neutral-400 font-serif mt-1">
                          Hover outer slices to choose pizza
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Radial Slices: 6 Gourmet Pizzas positioned around the wheel */}
                  {(() => {
                    const filteredPizzas = menuItems
                      .filter(item => item.brand === 'panarottis' && item.category.toLowerCase().includes('pizza'))
                      .slice(0, 6);
                    const totalItems = filteredPizzas.length || 6;

                    return filteredPizzas.map((pizza, idx) => {
                      // Trigonometric layout: spaced symmetrically around 360 degrees
                      const angle = (idx * (360 / totalItems) - 90) * (Math.PI / 180);
                      const radius = 125; // px radius
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;

                      const isHovered = hoveredQuickItem?.id === pizza.id;

                      return (
                        <div
                          key={pizza.id}
                          className="absolute"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <button
                            onMouseEnter={() => setHoveredQuickItem(pizza)}
                            onClick={() => setHoveredQuickItem(pizza)}
                            className={`group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-md cursor-pointer ${
                              isHovered 
                                ? 'border-amber-400 scale-110 shadow-amber-400/30 ring-4 ring-amber-500/15' 
                                : 'border-amber-700/50 hover:border-amber-400 scale-100 hover:scale-105'
                            }`}
                          >
                            <img 
                              src={pizza.imageUrl} 
                              alt={pizza.name} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:rotate-12" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
                            
                            {/* Small price indicator on slice */}
                            <div className="absolute bottom-0 inset-x-0 bg-neutral-950/85 text-[6.5px] font-mono text-center py-0.5 text-amber-200 font-bold uppercase tracking-wider truncate">
                              ₦{(pizza.price / 1000).toFixed(1)}k
                            </div>
                          </button>
                        </div>
                      );
                    });
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </nav>

      {/* Header Condition: Slider for Homepage, compact custom-themed banner for other pages */}
      {(activePageId === 'home' && activeTab === 'home' && !checkoutMode && !activeSubPage.type) ? (
        <header className="relative min-h-[520px] flex items-center justify-center py-20 px-4 text-center overflow-hidden bg-neutral-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-cover bg-center bg-black/40"
              style={{ backgroundImage: `url('${slides[activeSlide].image}')` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/15" />
          
          <div className="max-w-5xl mx-auto relative z-10 text-white px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 text-left">
              <div className="flex-1 space-y-4">
                <motion.div 
                  key={`slide-sub-${activeSlide}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden sm:inline-block bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-mono font-black tracking-widest uppercase shadow-md"
                >
                  {slides[activeSlide].subtitle}
                </motion.div>
                
                <motion.h1 
                  key={`slide-title-${activeSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white leading-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
                >
                  {slides[activeSlide].title}
                </motion.h1>
                
                <motion.p 
                  key={`slide-desc-${activeSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-neutral-100 text-sm sm:text-base max-w-xl leading-relaxed font-sans font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                >
                  {slides[activeSlide].description}
                </motion.p>

                <motion.div 
                  key={`slide-actions-${activeSlide}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-4 text-xs font-mono pt-2"
                >
                  <button 
                    onClick={() => { setActiveTab('menu'); setActivePageId('menu'); setCheckoutMode(false); }}
                    className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black tracking-wider uppercase transition-all shadow-lg shadow-red-600/20 cursor-pointer"
                  >
                    {slides[activeSlide].cta}
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('menu');
                      setActivePageId('menu');
                      setCheckoutMode(false);
                      setTimeout(() => {
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }, 100);
                    }}
                    className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 font-bold transition-all cursor-pointer"
                  >
                    View All Combo Deals
                  </button>
                </motion.div>
              </div>

              {/* Massive Graphical Bright Price Badge / Mobile small tag popup */}
              <motion.div
                key={`slide-badge-${activeSlide}`}
                initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 2 }}
                transition={{ type: 'spring', damping: 15 }}
                className="bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 text-neutral-900 rounded-2xl sm:rounded-3xl transform shadow-2xl flex flex-col items-center justify-center border-2 sm:border-4 border-red-600 transition-transform duration-300 relative select-none z-20 absolute top-4 right-4 sm:static w-24 h-24 sm:w-64 sm:h-64 p-2 sm:py-6 sm:px-8 hover:scale-105 sm:hover:scale-115 scale-100 sm:scale-110"
              >
                {/* Splat Star Burst Decoration */}
                <div className="absolute -top-1.5 -right-1.5 sm:-top-3 sm:-right-3 bg-red-600 text-white font-mono font-black text-[7px] sm:text-[9px] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-widest animate-bounce whitespace-nowrap">
                  HOT OFFER
                </div>
                
                <span className="text-[7px] sm:text-[10px] font-mono font-black uppercase tracking-wider text-red-700">FROM ONLY</span>
                <span className="text-lg sm:text-4xl font-mono font-black tracking-tighter text-neutral-950 leading-none my-0.5 sm:my-1">
                  {slides[activeSlide].price}
                </span>
                <span className="text-[7px] sm:text-[10px] font-serif font-black text-amber-950 mt-0.5 sm:mt-1 uppercase text-center leading-tight truncate max-w-full">
                  Combo Deal
                </span>
                <span className="hidden sm:block text-[8px] font-mono font-bold text-neutral-700 mt-2 border-t border-amber-950/25 pt-2 uppercase tracking-widest">
                  Order Now • T&Cs Apply
                </span>
              </motion.div>
            </div>

            {/* Slider indicators */}
            <div className="flex justify-center gap-2 pt-6">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${activeSlide === idx ? 'bg-red-600 w-8' : 'bg-neutral-500 hover:bg-neutral-400'}`}
                />
              ))}
            </div>
          </div>

          {/* Curved Ribbon */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-[110%] h-12 bg-white rounded-t-[100%] hidden md:block" />
        </header>
      ) : (
        /* Dynamic Compact Header for other pages with unique relevant background image */
        <div className="relative min-h-[260px] flex items-center py-12 px-6 sm:px-12 overflow-hidden border-b border-neutral-200 bg-neutral-900">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-blend-multiply bg-neutral-900/85 transition-all duration-700"
            style={{ backgroundImage: `url('${headerBgImg}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/40 to-transparent" />
          
          {/* Glowing brand teal decorative bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#019993]" />
          
          <div className="max-w-4xl relative z-10 text-white space-y-3">
            {/* Breadcrumb row */}
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              <button 
                onClick={() => { setActiveTab('home'); setActivePageId('home'); setCheckoutMode(false); setActiveSubPage({ type: null, id: null }); }}
                className="hover:text-[#019993] transition-colors"
              >
                Home
              </button>
              <ChevronRight className="w-3 h-3 text-neutral-600 font-bold" />
              <span className="text-[#019993] font-black">
                {headerTitle}
              </span>
            </div>
            
            {/* Main big title */}
            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              {headerTitle}
            </h1>
            
            {/* Subtitle / desc */}
            <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {headerDesc}
            </p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {activeSubPage.type !== null ? (
          <div className="py-2">
            {activeSubPage.type === 'menu-item' && (
              <MenuItemDetail
                item={panMenu.find(item => item.id === activeSubPage.id) || panMenu[0]}
                onBack={() => setActiveSubPage({ type: null, id: null })}
                onAddToCart={(item, qty) => {
                  handleAddWithFeedback(item, qty);
                }}
                onOpenCustomizer={(item) => {
                  setActiveSubPage({ type: null, id: null });
                  handleOpenCustomizer(item);
                }}
              />
            )}
            {activeSubPage.type === 'masterclass-detail' && (
              <MasterclassDetail
                moduleId={activeSubPage.id || 'fermentation'}
                onBack={() => setActiveSubPage({ type: null, id: null })}
                onSuccess={() => {}}
              />
            )}
            {activeSubPage.type === 'milestone-detail' && (
              <MilestoneDetail
                stageId={activeSubPage.id || 'stage1'}
                onBack={() => setActiveSubPage({ type: null, id: null })}
              />
            )}
            {activeSubPage.type === 'store-detail' && (
              <StoreHubDetail
                store={panStores.find(s => s.id === activeSubPage.id) || panStores[0]}
                onBack={() => setActiveSubPage({ type: null, id: null })}
                onBookTable={() => {
                  setActiveTab('reservations');
                  setActiveSubPage({ type: null, id: null });
                  setTimeout(() => {
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }, 100);
                }}
              />
            )}
          </div>
        ) : (
          <>
            {/* VIEW 1: BRAND SHOWCASE (Italian pizza) */}
            {activeTab === 'home' && (
          <div className="space-y-16">
            
            {/* Section: Special Dishes Today */}
            <div id="special-dishes-section" className="pt-6">
              <SpecialDishes 
                onAddSpecial={(item) => handleOpenCustomizer(item)} 
                onViewItem={handleViewItemById}
              />
            </div>

            {/* Page 1 Overlay Reservation Widget & Chef Bio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Reservation Form */}
              <div className="lg:col-span-5">
                <ReservationWidget onSuccess={() => {}} />
              </div>

              {/* Right Column: Giovanni Rossi Bio */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-red-500 font-mono text-[10px] tracking-widest uppercase font-bold block mb-1">
                    Master Pizzaiolo
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                    Chef Giovanni Rossi
                  </h2>
                  <div className="w-12 h-1 bg-[#019993] mt-4 mb-6" />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-neutral-50/75 border border-neutral-100 p-6 rounded-2xl shadow-sm">
                  <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-neutral-200 shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200" 
                      alt="Giovanni Rossi close-up" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-3 text-center sm:text-left">
                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                      "Welcome to our Italian dining experience. Here we try to share our vision about pizza quality, our mission about customer's satisfaction and introducing services that we provide for each one of you."
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-serif italic text-neutral-500 font-bold text-sm tracking-wide">Giovanni Rossi</span>
                      <button 
                        onClick={() => setActiveTab('menu')}
                        className="text-xs font-mono font-bold text-red-600 hover:text-red-700 uppercase tracking-widest"
                      >
                        MORE ABOUT US →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub features row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-white border border-neutral-100 rounded-xl flex items-start gap-3 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs">Authentic Sourdough</h4>
                      <p className="text-neutral-500 text-[10px]">36-hour cold fermented dough base.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-neutral-100 rounded-xl flex items-start gap-3 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs">High-Heat Baking</h4>
                      <p className="text-neutral-500 text-[10px]">Baked at 420°C in wood-fired deck ovens.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Our Delicious Menu Chalkboard */}
            <ChalkboardMenu 
              onAddSpecial={(item) => handleOpenCustomizer(item)} 
              onAddToCartDirectly={(item) => handleAddWithFeedback(item, 1)}
              onViewDetails={(item) => handleViewItemById(item.id)}
            />

            {/* Section: Our Specialty Cuisine */}
            <SpecialtyCuisine onMoreClick={() => setActiveTab('menu')} />

            {/* Section: In the Kitchen Slider */}
            <ChefSection />

            {/* Section: Our Features */}
            <section className="bg-[#121214] text-white p-6 sm:p-10 rounded-3xl border border-neutral-800 my-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(50,50,50,0.1),transparent_70%)] pointer-events-none" />
              
              {/* Floating row of 4 times/icons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-b border-neutral-800 pb-8 mb-10">
                <div className="space-y-1">
                  <span className="text-[#019993] font-mono text-xs uppercase tracking-widest font-black block">07:00 AM</span>
                  <span className="text-neutral-400 text-[10px] uppercase">Breakfast Service</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#019993] font-mono text-xs uppercase tracking-widest font-black block">12:00 PM</span>
                  <span className="text-neutral-400 text-[10px] uppercase">Lunch Specials</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#019993] font-mono text-xs uppercase tracking-widest font-black block">06:00 PM</span>
                  <span className="text-neutral-400 text-[10px] uppercase">Wood-Fired Pizza</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#019993] font-mono text-xs uppercase tracking-widest font-black block">10:30 PM</span>
                  <span className="text-neutral-400 text-[10px] uppercase">Night Caps & Coffee</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#019993]/10 border border-[#019993]/20 flex items-center justify-center text-[#019993] mb-4">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-bold">Daily Services</h4>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Enjoy swift wood-fired dispatch, hot dine-in hospitality, and customized catering programs designed around your events.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#019993]/10 border border-[#019993]/20 flex items-center justify-center text-[#019993] mb-4">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-bold">Ready For Events</h4>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Host private celebrations, pizza-making classes, or corporate parties with customized chalkboard menus and dedicated chefs.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#019993]/10 border border-[#019993]/20 flex items-center justify-center text-[#019993] mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-bold">Trained Staff</h4>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Our team of master pizzaiolos undergo rigorous culinary training programs protecting Neapolitan bread-craft heritage.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Testimonials */}
            <section className="py-12">
              <div className="text-center mb-12">
                <span className="text-red-500 font-mono text-[10px] uppercase tracking-widest font-bold">Testimonials</span>
                <h3 className="font-serif text-3xl sm:text-5xl font-black text-neutral-950 uppercase mt-1">
                  Our Happy Customers
                </h3>
                <div className="w-8 h-1 bg-[#019993] mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Testimonial 1 */}
                <div className="bg-neutral-50 border border-neutral-200/60 p-6 sm:p-8 rounded-3xl relative">
                  <div className="flex gap-1 text-amber-500 mb-4">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed italic mb-6">
                    "The Saucy Seafood Deluxe is unmatched! The crust has those iconic beautiful charred leopard spots, and the prawns are incredibly juicy."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shrink-0">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Zahid Doe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h5 className="font-bold text-neutral-900 text-xs">Zahid Doe</h5>
                      <span className="text-neutral-500 text-[10px] font-mono uppercase">Lagos Foodie</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-neutral-50 border border-neutral-200/60 p-6 sm:p-8 rounded-3xl relative">
                  <div className="flex gap-1 text-amber-500 mb-4">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500 animate-pulse" />
                  </div>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed italic mb-6">
                    "Amazing attention to detail in the chalkboard menu. Authentic taste, super digestible base, and premium, warm hospitality."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shrink-0">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Rakib Smith" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h5 className="font-bold text-neutral-900 text-xs">Rakib Smith</h5>
                      <span className="text-neutral-500 text-[10px] font-mono uppercase">Abuja Gastronome</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Blog & Articles (Page 4) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
              {/* Left Side - 3 Blog cards */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                  <div className="aspect-video overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400" alt="Sourdough article" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[#019993] font-mono text-[9px] uppercase tracking-wider font-bold">BREAD CRAFT</span>
                    <h5 className="font-serif font-bold text-sm text-neutral-950 group-hover:text-red-600 transition-colors">The 36-Hour Sourdough Mastery</h5>
                    <p className="text-neutral-500 text-[10px] leading-relaxed">Discover why fermentation time directly impacts your dough digestability and crust balloon bubbles.</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                  <div className="aspect-video overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400" alt="Tomatoes article" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[#019993] font-mono text-[9px] uppercase tracking-wider font-bold">INGREDIENTS</span>
                    <h5 className="font-serif font-bold text-sm text-neutral-950 group-hover:text-red-600 transition-colors">Finding True Napoli Pomodoros</h5>
                    <p className="text-neutral-500 text-[10px] leading-relaxed">Exploring volcanic soils where our sweet San Marzano tomatoes ripen to create the perfect low-acid pizza sauce base.</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                  <div className="aspect-video overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400" alt="Baking article" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[#019993] font-mono text-[9px] uppercase tracking-wider font-bold">OVEN DECK</span>
                    <h5 className="font-serif font-bold text-sm text-neutral-950 group-hover:text-red-600 transition-colors">High-Heat Wood Fire Science</h5>
                    <p className="text-neutral-500 text-[10px] leading-relaxed">Understanding over 400°C temperatures inside brick dome deck ovens for maximum cheese melt-pull action.</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Article Head */}
              <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
                <span className="text-red-500 font-mono text-[10px] uppercase tracking-widest font-bold">Our Article</span>
                <h3 className="font-serif text-3xl sm:text-4xl font-black text-neutral-950 leading-tight">
                  Read Sourdough Journal
                </h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                  We frequently publish baking logs, chef notes, ingredient origins and special event journals from our Lagos and Abuja kitchens.
                </p>
                <button onClick={() => setActiveTab('menu')} className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white font-mono font-bold text-[10px] rounded-xl uppercase tracking-wider transition-all">
                  MORE ARTICLES →
                </button>
              </div>
            </section>

            {/* Page 4: Pre-footer 24/7 Dark Blackboard Contact Banner */}
            <div className="bg-[#121214] text-white p-8 sm:p-12 rounded-3xl border border-neutral-800 my-12 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(50,50,50,0.1),transparent_70%)] pointer-events-none" />
              <div className="space-y-4 max-w-lg relative z-10">
                <span className="text-[#019993] font-mono text-xs uppercase tracking-widest font-bold block">WE DELIVER HOT PIZZA 24/7</span>
                <h3 className="font-serif text-2xl sm:text-4xl font-black leading-tight">Ready to order wood-fired slices or book a chef event?</h3>
                <p className="text-neutral-400 text-xs sm:text-sm">Speak to our dough desk instantly or explore the physical stone-ovens at our Victoria Island location.</p>
              </div>

              <div className="space-y-4 text-xs font-mono shrink-0 relative z-10 bg-[#18181b] p-6 border border-neutral-800 rounded-2xl w-full md:w-80 shadow-inner">
                <div>
                  <span className="text-neutral-500 uppercase block tracking-wider text-[9px]">Lagos Helpline</span>
                  <strong className="text-white text-sm">+234 8127149859</strong>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase block tracking-wider text-[9px]">Email Desk</span>
                  <strong className="text-[#019993] text-xs block hover:underline cursor-pointer">designmodesolutions@gmail.com</strong>
                </div>
                <div className="flex gap-2 pt-2 border-t border-neutral-900">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-400 hover:text-[#019993] cursor-pointer">f</span>
                  <span className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-400 hover:text-[#019993] cursor-pointer">t</span>
                  <span className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-400 hover:text-[#019993] cursor-pointer">g+</span>
                  <span className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-400 hover:text-[#019993] cursor-pointer">o</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: INTERACTIVE MENU & BUILDER */}
        {activeTab === 'menu' && (
          <div>
            {/* Advanced Search & Filtering bar */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search wood-fired pizzas, hearty pastas..."
                  value={menuSearchTerm}
                  onChange={(e) => setMenuSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-red-500 text-neutral-800"
                />
                <span className="absolute left-3 top-2.5 text-xs text-neutral-400">🔍</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {(['All', 'Vegetarian', 'Spicy', 'Popular'] as const).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      selectedTag === tag 
                        ? 'bg-[#019993] text-white font-bold' 
                        : 'bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all ${
                    selectedCategory === cat 
                      ? 'bg-red-600 text-white border border-red-600 shadow-sm' 
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenu.map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden border border-neutral-200 bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                  <div 
                    onClick={() => {
                      setActiveSubPage({ type: 'menu-item', id: item.id });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="h-56 overflow-hidden relative bg-neutral-100 cursor-pointer"
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/95 text-neutral-900 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-all">
                        <Eye className="w-3.5 h-3.5 text-red-600" /> View Details
                      </span>
                    </div>
                    {item.isPopular && (
                      <span className="absolute top-4 left-4 bg-red-600 text-white font-mono font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 uppercase z-10 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-white" /> Chef's Choice
                      </span>
                    )}
                    <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-neutral-800 text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1 border border-neutral-200/50 z-10">
                      <Clock className="w-3.5 h-3.5 text-red-500" /> {item.prepTime} mins
                    </span>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-red-600 font-mono uppercase tracking-widest block mb-1">{item.category}</span>
                      <h3 
                        onClick={() => {
                          setActiveSubPage({ type: 'menu-item', id: item.id });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-lg font-bold text-neutral-900 mb-2 leading-tight hover:text-red-600 cursor-pointer transition-colors"
                      >
                        {item.name}
                      </h3>
                      <p className="text-neutral-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6">{item.description}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-lg font-mono font-black text-neutral-900">₦{item.price.toLocaleString()}</span>
                      <button
                        onClick={() => handleOpenCustomizer(item)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-all"
                      >
                        Add to Plate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Review Section */}
            <section className="mt-20 border-t border-neutral-200 pt-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div>
                  <span className="text-red-600 font-mono text-xs uppercase tracking-wider block mb-1">Satisfied Diners</span>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Hear from our Pizzerias</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                    We maintain our wood-fired high-heat standards with rigorous customer quality audits.
                  </p>

                  <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <span className="text-3xl font-black text-neutral-900 font-mono block mb-1">4.8 / 5</span>
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-red-500 fill-red-500" />)}
                    </div>
                    <span className="text-xs text-neutral-500">Based on 980+ local audits in Lekki and Wuse</span>
                  </div>
                </div>

                {/* List Reviews */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2 font-mono uppercase tracking-wider text-xs font-bold">Recent Pizza Audits</h4>
                  {localReviews.map((rev, index) => (
                    <div key={index} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-neutral-900">{rev.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{rev.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">{rev.msg}</p>
                    </div>
                  ))}
                </div>

                {/* Form to leave review */}
                <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50">
                  <h4 className="font-bold text-neutral-900 text-sm mb-4">Leave a Pizzeria Audit</h4>
                  <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="text" required value={reviewName} onChange={e => setReviewName(e.target.value)}
                        placeholder="Your Name" 
                        className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <select 
                        value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-red-500"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (Superb Dough)</option>
                        <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
                        <option value={3}>⭐⭐⭐ (Average)</option>
                      </select>
                    </div>
                    <div>
                      <textarea 
                        required rows={3} value={reviewMsg} onChange={e => setReviewMsg(e.target.value)}
                        placeholder="Was the toppings generous? Did it arrive piping hot?" 
                        className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-all">
                      Publish Dough Audit
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 3: PIZZERIAS LOCATOR */}
        {activeTab === 'locator' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {panStores.map(store => (
                <div key={store.id} className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-[10px] bg-red-600/10 text-red-600 border border-red-600/20 font-mono uppercase px-2.5 py-1 rounded-full inline-block mb-3 font-bold">
                      Panarottis Pizza
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{store.name}</h3>
                    <p className="text-neutral-600 text-xs leading-relaxed mb-6">{store.address}</p>

                    <div className="space-y-2 text-xs text-neutral-600 font-mono mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span>{store.openingHours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-red-500" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-red-500" />
                        <span>{store.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          setActiveSubPage({ type: 'store-detail', id: store.id });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-[10px] rounded-lg transition-colors"
                      >
                        Enter Hub 🎪
                      </button>
                      <button 
                        onClick={() => setActiveTab('menu')}
                        className="py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono font-bold text-[10px] rounded-lg transition-colors"
                      >
                        Pizza Menu 🍕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: RESERVATIONS AND MASTERCLASS */}
        {activeTab === 'reservations' && (
          <div className="space-y-12 max-w-4xl mx-auto">
             {/* Sub header banner */}
             <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-neutral-800">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800')] bg-cover opacity-20 bg-center" />
               <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
               <div className="relative z-10 max-w-lg space-y-3">
                 <span className="text-[#019993] font-mono text-xs uppercase tracking-widest font-black block">HEARTH EXPERIENCES</span>
                 <h2 className="text-3xl font-extrabold font-serif">Masterclass & Table Reservations</h2>
                 <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                   Book a high-heat Neapolitan sourdough masterclass with Chef Giovanni or reserve a premium sharing table for your family feast.
                 </p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Sourdough Masterclass Card/Form */}
               <div className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-3xl shadow-sm space-y-6">
                 <div>
                   <span className="text-red-600 font-mono text-[10px] uppercase tracking-widest font-black block mb-1">LEARN THE BREAD SCIENCE</span>
                   <h3 className="text-xl font-bold text-neutral-900 font-serif">Sourdough Pizza Masterclass</h3>
                   <p className="text-neutral-500 text-xs leading-relaxed mt-2">
                     Every Saturday morning. Hand-stretching 36h cold-fermented dough, brick dome ovens, custom toppings. Includes wine & a personal pizza.
                   </p>
                 </div>

                 {classSuccess ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-3">
                     <p className="font-bold">✓ Masterclass Spot Reserved!</p>
                     <p className="leading-relaxed">A booking confirmation email has been dispatched with prep guidelines and recipe PDFs.</p>
                     <button onClick={() => setClassSuccess(false)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono uppercase text-[9px] rounded transition-colors">Book Another</button>
                   </motion.div>
                 ) : (
                   <form onSubmit={(e) => { e.preventDefault(); setClassSuccess(true); }} className="space-y-4">
                     <div>
                       <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Select Masterclass module</label>
                       <select value={classType} onChange={e => { setClassType(e.target.value as any); setActiveSubPage({ type: 'masterclass-detail', id: e.target.value }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-red-500">
                         <option value="fermentation">Dough Fermentation & Yeast Biology (₦15,000)</option>
                         <option value="stretching">Artisanal Stretching & Leopard Spotting (₦18,000)</option>
                         <option value="sauces">San Marzano Sauce Crafting & Toppings (₦14,000)</option>
                       </select>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Preferred Date</label>
                         <input type="date" required value={classDate} onChange={e => setClassDate(e.target.value)} className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-red-500" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Time Slot</label>
                         <select value={classTimeSlot} onChange={e => setClassTimeSlot(e.target.value)} className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-red-500">
                           <option>10:00 AM - 12:00 PM</option>
                           <option>01:30 PM - 03:30 PM</option>
                           <option>05:00 PM - 07:00 PM</option>
                         </select>
                       </div>
                     </div>
                     <div>
                       <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Number of Students</label>
                       <input type="number" min={1} max={10} required value={classGuests} onChange={e => setClassGuests(Number(e.target.value))} className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-red-500" />
                     </div>
                     <button type="submit" className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow">
                       Book Masterclass Spot
                     </button>
                   </form>
                 )}
               </div>

               {/* Table Reservation Widget */}
               <div className="p-6 sm:p-8 bg-neutral-50 border border-neutral-200 rounded-3xl shadow-sm space-y-6">
                 <div>
                   <span className="text-[#019993] font-mono text-[10px] uppercase tracking-widest font-black block mb-1">SHARING HOSPITALITY</span>
                   <h3 className="text-xl font-bold text-neutral-900 font-serif">Table Reservation</h3>
                   <p className="text-neutral-500 text-xs leading-relaxed mt-2">
                     Gather around wood-fired brick deck ovens. Reserve private spaces for anniversaries or casual Italian pizza nights.
                   </p>
                 </div>

                 <ReservationWidget />
               </div>
             </div>
          </div>
        )}

        {/* VIEW 6: OUR STORY & ABOUT */}
        {activeTab === 'about' && (
          <div className="space-y-16 max-w-4xl mx-auto">
             {/* Main Hero Header */}
             <div className="text-center space-y-3">
               <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">ITALIAN HERITAGE</span>
               <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-neutral-900 leading-tight">Hand-Stretched, Wood-Fired, Loaded with Love</h2>
               <div className="w-12 h-1 bg-[#019993] mx-auto mt-2" />
               <p className="text-neutral-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed pt-2">
                 Panarottis has been sharing authentic family Italian flavors since we first heated our brick-dome deck ovens.
               </p>
             </div>

             {/* Visual banner */}
             <div className="h-96 rounded-3xl overflow-hidden relative border border-neutral-200">
               <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200" alt="Pizza prep" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-neutral-950/20" />
               <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-neutral-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                   <h4 className="font-bold text-neutral-900 text-sm">Giovanni's Dough Manifesto</h4>
                   <p className="text-neutral-500 text-xs">"Water, flour, sea salt, wild starter. Absolutely no shortcuts."</p>
                 </div>
                 <span className="text-[10px] bg-red-600 text-white font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 self-start sm:self-center">36H Cold Ferment</span>
               </div>
             </div>

             {/* Heritage Timeline */}
             <div className="space-y-8">
               <div className="text-center">
                 <h3 className="text-xl font-bold font-serif text-neutral-900">Milestones of Bread-Craft</h3>
                 <p className="text-neutral-500 text-xs">Our timeline of Neapolitan dedication and sharing culture.</p>
               </div>

               <div className="relative pl-6 border-l-2 border-neutral-200 space-y-8 max-w-2xl mx-auto">
                 <div className="relative">
                   <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border border-white bg-red-600" />
                   <span className="text-xs font-mono font-black text-red-600">STAGE 1: THE WATER & FLOUR</span>
                   <h4 className="text-sm font-bold text-[#b4221c] cursor-pointer hover:underline" onClick={() => { setActiveSubPage({ type: 'milestone-detail', id: 'stage1' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Italian Tipo 00 Flour Importation 📖</h4>
                   <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                     Secured master relationships with grain mills in Campania, importing high-absorption wheat flour to achieve those crispy, gaseous dough pockets.
                   </p>
                 </div>

                 <div className="relative">
                   <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border border-white bg-red-600" />
                   <span className="text-xs font-mono font-black text-red-600">STAGE 2: THE STARTER sourdough</span>
                   <h4 className="text-sm font-bold text-[#b4221c] cursor-pointer hover:underline" onClick={() => { setActiveSubPage({ type: 'milestone-detail', id: 'stage2' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>The 40-Year-Old Biga Starter Cultivation 📖</h4>
                   <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                     Nurtured and propagated our signature wild sourdough culture, maintaining pH balance every single morning to yield maximum flavor digestibility.
                   </p>
                 </div>

                 <div className="relative">
                   <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border border-white bg-red-600" />
                   <span className="text-xs font-mono font-black text-red-600">STAGE 3: EXPANSION IN NIGERIA</span>
                   <h4 className="text-sm font-bold text-[#b4221c] cursor-pointer hover:underline" onClick={() => { setActiveSubPage({ type: 'milestone-detail', id: 'stage3' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Lagos Lekki & Abuja Pizzeria Launch 📖</h4>
                   <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                     Brought wood-fired stone decks to Nigeria. Serving hand-layered lasagnas, wood-fired chicken, and loaded signature pizzas to local gastromones.
                   </p>
                 </div>
               </div>
             </div>

             {/* Chef Grid */}
             <div className="space-y-8">
               <div className="text-center">
                 <h3 className="text-xl font-bold font-serif text-neutral-900">Guardian of the Ovens</h3>
                 <p className="text-neutral-500 text-xs">Our culinary leads ensuring wood-fired consistency daily.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {chefs.map((chef, idx) => (
                   <div key={idx} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                     <div className="h-48 overflow-hidden bg-neutral-100">
                       <img src={chef.img} alt={chef.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="p-4 space-y-1">
                       <span className="text-[9px] font-mono text-red-600 uppercase font-black">{chef.role}</span>
                       <h4 className="font-bold text-neutral-900 text-sm">{chef.name}</h4>
                       <p className="text-neutral-500 text-[10px] leading-relaxed">{chef.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* VIEW 4: LIVE TRACKING */}
        {activeTab === 'tracking' && selectedActiveOrder && (
          <div className="max-w-4xl mx-auto bg-neutral-50 rounded-3xl border border-neutral-200 p-6 sm:p-10 relative overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/2 to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-200 pb-6 mb-6 gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase font-bold animate-pulse">
                    Active Pizza Routing
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">ID: {selectedActiveOrder.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">Panarottis Wood-Fired Express</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 block font-mono">Estimated Arrival</span>
                <span className="text-lg font-mono font-black text-red-600">
                  {selectedActiveOrder.status === 'delivered' ? 'DELIVERED ✓' : `${selectedActiveOrder.deliveryMinutes} Mins`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {/* Left Details */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm">
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono mb-1">Rider Partner</span>
                  <strong className="text-neutral-900 text-sm block">{selectedActiveOrder.courierName}</strong>
                  <span className="text-xs text-red-600 font-mono flex items-center gap-1.5 mt-1">
                    <Phone className="w-3.5 h-3.5" /> Call Rider (+234 815 RIDER)
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Journey Status</h4>
                  
                  <div className="relative pl-6 border-l-2 border-neutral-200 space-y-4">
                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-white ${
                        simPercent >= 10 ? 'bg-red-500' : 'bg-neutral-200'
                      }`} />
                      <h5 className="text-xs font-bold text-neutral-900">Order Authenticated</h5>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">Routed securely to wood-fired ovens.</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-white ${
                        simPercent >= 40 ? 'bg-red-500' : 'bg-neutral-200'
                      }`} />
                      <h5 className="text-xs font-bold text-neutral-900">Dough Baking</h5>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">Puffed up in 420°C high-heat oven chambers.</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-white ${
                        simPercent >= 70 ? 'bg-red-500' : 'bg-neutral-200'
                      }`} />
                      <h5 className="text-xs font-bold text-neutral-900">Hot-Pack Transit</h5>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">Loaded in insulated boxes. Transit via motorcycle.</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-white ${
                        simPercent >= 100 ? 'bg-emerald-500' : 'bg-neutral-200'
                      }`} />
                      <h5 className="text-xs font-bold text-neutral-900">Delivered & Hot</h5>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">Savor the authentic Italian stretch!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Simulator */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-neutral-200 rounded-2xl h-80 relative overflow-hidden flex flex-col justify-between p-6 shadow-sm">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20%" y1="10%" x2="80%" y2="90%" stroke="#d4d4d4" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="90%" y1="30%" x2="10%" y2="70%" stroke="#d4d4d4" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>

                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-xs font-mono text-neutral-500">Nigeria GPS Tracking (Simulated)</span>
                    <span className="text-xs font-mono text-red-600 font-bold">
                      Rider Lat: {simCoordinates.lat.toFixed(4)}, Lng: {simCoordinates.lng.toFixed(4)}
                    </span>
                  </div>

                  {/* Rider Marker */}
                  <motion.div 
                    animate={{ 
                      x: (simPercent / 100) * 200 + 40,
                      y: Math.sin(simPercent / 15) * 15 + 120
                    }}
                    className="absolute z-20 flex flex-col items-center gap-1"
                  >
                    <div className="bg-red-500 text-white p-2 rounded-full border-2 border-white shadow-xl animate-bounce">
                      <Navigation className="w-5 h-5 rotate-45" />
                    </div>
                    <span className="text-[9px] bg-white border border-neutral-200 text-neutral-800 font-mono font-bold px-1.5 rounded shadow-sm">Rider</span>
                  </motion.div>

                  <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-ping absolute" />
                    <div className="w-3 h-3 rounded-full bg-red-500 relative" />
                    <span className="text-[8px] text-neutral-500 font-mono mt-1">Pizzeria</span>
                  </div>

                  <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
                    <span className="text-[8px] text-neutral-500 font-mono mt-1">Home</span>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div className="w-full mr-4 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${simPercent}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-800 shrink-0">{simPercent}% Complete</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-600 bg-red-50/50 border border-red-100 p-4 rounded-xl leading-relaxed shadow-sm">
                  <strong>Piping Hot Guarantee:</strong> Our pizzas are loaded in insulated thermal bags. If your cheese is stiff on arrival, we will dispatch an instant replacement free of charge.
                </div>
              </div>
            </div>
          </div>
        )}
          </>
        )}

      </main>

      {/* Redesigned Footer (Clean, high-end, elegant editorial Italian theme with newsletter subscription) */}
      <footer className="relative overflow-hidden border-t border-[#01524e]/50 bg-gradient-to-br from-neutral-950 via-[#013331] to-[#001716] text-white py-16 px-4">
        {/* Animated Mizza Flakes (Basil, pepper, cheese, tomatoes floating in infinite loops) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          {[
            { emoji: '🌿', size: 'text-xl', left: '8%', duration: 12, delay: 0 },
            { emoji: '🌶️', size: 'text-xs', left: '18%', duration: 8, delay: 2 },
            { emoji: '🍅', size: 'text-lg', left: '28%', duration: 16, delay: 1 },
            { emoji: '🧀', size: 'text-sm', left: '38%', duration: 10, delay: 4 },
            { emoji: '🌿', size: 'text-2xl', left: '48%', duration: 14, delay: 3 },
            { emoji: '🍕', size: 'text-lg', left: '58%', duration: 9, delay: 5 },
            { emoji: '🌶️', size: 'text-sm', left: '68%', duration: 11, delay: 2 },
            { emoji: '🧀', size: 'text-xs', left: '78%', duration: 13, delay: 0 },
            { emoji: '🌿', size: 'text-lg', left: '88%', duration: 10, delay: 1 },
            { emoji: '🍅', size: 'text-xs', left: '94%', duration: 15, delay: 3 },
          ].map((flake, idx) => (
            <motion.div
              key={idx}
              initial={{ top: '100%', x: 0, rotate: 0, opacity: 0 }}
              animate={{
                top: '-20%',
                x: [0, 30, -30, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.9, 0.9, 0],
              }}
              transition={{
                duration: flake.duration,
                repeat: Infinity,
                delay: flake.delay,
                ease: 'linear',
              }}
              style={{ left: flake.left }}
              className={`absolute select-none ${flake.size} filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]`}
            >
              {flake.emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 relative z-10">
          
          {/* Logo & Info column */}
          <div className="md:col-span-4 space-y-6 flex flex-col justify-start">
            <div className="flex items-center gap-2 pb-2">
              <img 
                src={PANAROTTIS_LOGO_WHITE} 
                alt="Panarottis Logo White" 
                className="h-24 sm:h-28 md:h-32 w-auto object-contain filter drop-shadow-[0_10px_25px_rgba(239,68,68,0.3)] transition-all duration-300 hover:scale-105 select-none"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://logo.clearbit.com/panarottis.co.za';
                }}
              />
            </div>
            <p className="text-neutral-200 text-sm leading-relaxed font-sans font-medium">
              Vibrant, contemporary, wood-fired stone-baked Italian pizza and hearty pasta. Loaded with love and built for sharing across Nigeria.
            </p>
            <div className="pt-2 border-t border-neutral-800/60">
              <span className="text-[10px] text-red-500 block uppercase font-mono tracking-widest font-bold mb-1">Nigeria Head Office</span>
              <span className="text-neutral-400 text-xs font-mono">Plot 1437, Sanusi Fafunwa St, Victoria Island, Lagos</span>
            </div>
          </div>

          {/* Quick links columns */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-red-500 text-xs font-mono uppercase tracking-wider font-bold">Popular Food</h4>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              <li><button onClick={() => { setActiveTab('menu'); setActivePageId('menu'); setSelectedCategory('Gourmet Pizzas'); }} className="hover:text-red-500 text-left transition-colors">Gourmet Pizzas</button></li>
              <li><button onClick={() => { setActiveTab('menu'); setActivePageId('menu'); setSelectedCategory('Classic Pizzas'); }} className="hover:text-red-500 text-left transition-colors">Classic Slices</button></li>
              <li><button onClick={() => { setActiveTab('menu'); setActivePageId('menu'); setSelectedCategory('Hearty Pastas'); }} className="hover:text-red-500 text-left transition-colors">Hearty Pastas</button></li>
              <li><button onClick={() => { setActivePageId('sauce-lab'); }} className="hover:text-red-500 text-left transition-colors">Marinara Lab 🌶️</button></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-red-500 text-xs font-mono uppercase tracking-wider font-bold">Useful Links</h4>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              <li><button onClick={() => { setActivePageId('nutrition'); }} className="hover:text-red-500 text-left transition-colors">Nutrition Facts</button></li>
              <li><button onClick={() => { setActivePageId('fermentation-science'); }} className="hover:text-red-500 text-left transition-colors">Dough Science</button></li>
              <li><button onClick={() => { setActivePageId('dough-calc'); }} className="hover:text-red-500 text-left transition-colors">Dough Calculator</button></li>
              <li><button onClick={() => { setActivePageId('sustainability'); }} className="hover:text-red-500 text-left transition-colors">Sustainability</button></li>
              <li><button onClick={() => { setActivePageId('terms'); }} className="hover:text-red-500 text-left transition-colors">Terms of Service</button></li>
            </ul>
          </div>

          {/* Newsletter Subscribe Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-red-500 text-xs font-mono uppercase tracking-wider font-bold">Pizzeria Newsletters</h4>
            <p className="text-neutral-300 text-xs leading-relaxed">
              Subscribe to unlock free garlic focaccia on your next home delivery.
            </p>
            {newsletterSubscribed ? (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Thank you for subscribing! Check your mail.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input 
                  type="email" required value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Your Email"
                  className="px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs rounded-xl focus:outline-none focus:border-red-500 flex-grow shadow-sm"
                />
                <button type="submit" className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all shadow-md">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-neutral-800/80 pt-8 text-center text-neutral-500 text-[10px] space-y-1 relative z-10">
          <p>© 2026 Panarottis Pizza Nigeria Ltd. Operated under master franchise by OFRNL.</p>
          <p>Locations in Lekki Phase 1, Ikeja City Mall, and Abuja Wuse II.</p>
        </div>
      </footer>

      {/* Premium Food Customizer & Ordering Modal */}
      <AnimatePresence>
        {customizingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl border border-neutral-100 shadow-2xl overflow-hidden my-8"
            >
              {/* Header Image banner */}
              <div className="h-48 relative bg-neutral-100">
                <img
                  src={customizingItem.imageUrl}
                  alt={customizingItem.name}
                  className="w-full h-full object-cover animate-fade-in"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent" />
                <button
                  onClick={() => setCustomizingItem(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-sm font-bold transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] bg-red-600 text-white font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                    {customizingItem.category}
                  </span>
                  <h3 className="text-xl font-bold font-serif leading-tight">{customizingItem.name}</h3>
                </div>
              </div>

              {/* Main Contents */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">{customizingItem.description}</p>
                  <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-neutral-500 font-mono">
                    <span>⏱️ Prep: {customizingItem.prepTime} Mins</span>
                    <span>🔥 Oven: Wood-Fired Brick (420°C)</span>
                    {customizingItem.isPopular && <span className="text-red-600 font-bold">⭐ Chef's Premium Selection</span>}
                  </div>
                </div>

                {/* DYNAMIC FORMS BY CATEGORY */}
                {customizingItem.category.toLowerCase().includes('pizza') ? (
                  <div className="space-y-4 pt-4 border-t border-neutral-100">
                    {/* Size Select */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-700 uppercase font-black tracking-wider">
                        Select Pizza Size
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: 'Small', label: 'Medium 10"', desc: 'Standard Medium 10"', priceMod: '-₦1,500' },
                          { name: 'Large', label: 'Large 12"', desc: 'Classic Sharing 12"', priceMod: '+₦2,500' },
                          { name: 'Family', label: 'Giant 14"', desc: 'Colossal Giant 14"', priceMod: '+₦4,500' }
                        ].map((sz) => (
                          <button
                            type="button"
                            key={sz.name}
                            onClick={() => setPizzaSize(sz.name as any)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              pizzaSize === sz.name
                                ? 'border-red-500 bg-red-50 text-red-600 font-bold ring-1 ring-red-500'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            <span className="block font-bold text-xs">{sz.label}</span>
                            <span className="block text-[10px] text-neutral-500">{sz.desc}</span>
                            <span className="block text-[10px] font-mono text-neutral-400 mt-1">{sz.priceMod}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Crust Select */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-700 uppercase font-black tracking-wider">
                        Choose Pizza Crust Base
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: '36hr Sourdough Thin', label: 'Classic Hand-Tossed Thin', desc: 'Light, thin, & crispy', priceMod: '+₦0' },
                          { name: 'Double Cheese Stuffed', label: 'Double Cheese Stuffed', desc: 'Crust packed with Mozzarella', priceMod: '+₦1,500' },
                          { name: 'Gluten-Free Cauliflower', label: 'Gluten-Free Alternative', desc: 'Perfect wheat-free choice', priceMod: '+₦1,000' },
                          { name: 'Thick Neapolitan Pan', label: 'Oven-Fresh Thick Pan', desc: 'Soft interior, fluffy golden rim', priceMod: '+₦500' }
                        ].map((cr) => (
                          <button
                            type="button"
                            key={cr.name}
                            onClick={() => setPizzaCrust(cr.name as any)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              pizzaCrust === cr.name
                                ? 'border-red-500 bg-red-50 text-red-600 font-bold ring-1 ring-red-500'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            <span className="block font-bold text-xs">{cr.label}</span>
                            <span className="block text-[10px] text-neutral-500">{cr.desc}</span>
                            <span className="block text-[10px] font-mono text-neutral-400 mt-1">{cr.priceMod}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cheese Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-700 uppercase font-black tracking-wider">
                        Cheese Profile
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: 'Traditional Mozzarella', priceMod: 'Included' },
                          { name: 'Four-Cheese Gorgonzola', priceMod: '+₦1,000' },
                          { name: 'Vegan Cheese', priceMod: '+₦500' }
                        ].map((ch) => (
                          <button
                            type="button"
                            key={ch.name}
                            onClick={() => setPizzaCheese(ch.name as any)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              pizzaCheese === ch.name
                                ? 'border-red-500 bg-red-50 text-red-600 font-bold ring-1 ring-red-500'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            <span className="block font-bold">{ch.name}</span>
                            <span className="block text-[10px] text-neutral-400 mt-0.5">{ch.priceMod}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Extra Toppings */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-700 uppercase font-black tracking-wider">
                        Extra Toppings (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableToppings.map((top) => (
                          <button
                            type="button"
                            key={top.name}
                            onClick={() => handleToggleExtraTopping(top.name)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                              extraToppingsList.includes(top.name)
                                ? 'border-red-500 bg-red-50 text-red-600 font-bold'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            <span>{top.name}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">+₦{top.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : customizingItem.category.toLowerCase().includes('pasta') ? (
                  <div className="space-y-4 pt-4 border-t border-neutral-100">
                    {/* Pasta Type Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-700 uppercase font-black tracking-wider">
                        Choose Pasta Variant
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Fettuccine', 'Spaghetti', 'Penne'].map((pt) => (
                          <button
                            type="button"
                            key={pt}
                            onClick={() => setSelectedPastaType(pt)}
                            className={`p-3 rounded-xl border text-center text-xs transition-all ${
                              selectedPastaType === pt
                                ? 'border-red-500 bg-red-50 text-red-600 font-bold ring-1 ring-red-500'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            {pt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Addons Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-700 uppercase font-black tracking-wider">
                        Oven-Baked Addons (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Extra Mozzarella', price: 800 },
                          { name: 'Sautéed Mushrooms', price: 600 },
                          { name: 'Grilled Chicken Breast', price: 1200 },
                          { name: 'Toasted Garlic Bread', price: 400 }
                        ].map((ad) => (
                          <button
                            type="button"
                            key={ad.name}
                            onClick={() => handleTogglePastaAddon(ad.name)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                              pastaAddons.includes(ad.name)
                                ? 'border-red-500 bg-red-50 text-red-600 font-bold'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            <span>{ad.name}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">+₦{ad.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4 border-t border-neutral-100">
                    {/* Beverage Brand/Flavor Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-neutral-700 uppercase font-black tracking-wider">
                        Select Soda / Local Drink
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { name: 'Pepsi', label: 'Pepsi Soda' },
                          { name: 'Coca-Cola', label: 'Coca-Cola' },
                          { name: 'Fanta Orange', label: 'Fanta Orange' },
                          { name: 'Maltina', label: 'Premium Maltina' },
                          { name: 'Chi Exotic', label: 'Chi Exotic Nectar' },
                          { name: 'Nigerian Chapman', label: 'Classic Chapman' },
                          { name: 'Zobo Craft', label: 'Zobo Hibiscus Blend' }
                        ].map((fl) => (
                          <button
                            type="button"
                            key={fl.name}
                            onClick={() => setSelectedBeverageFlavor(fl.name as any)}
                            className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                              selectedBeverageFlavor === fl.name
                                ? 'border-[#019993] bg-[#019993]/5 text-[#019993] font-bold ring-1 ring-[#019993]'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            <span className="block font-bold">{fl.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Beverage Size Selection */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-mono text-neutral-700 uppercase font-black tracking-wider">
                        Beverage Size
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Regular', priceMod: 'Standard' },
                          { name: 'Large', priceMod: '+₦800' }
                        ].map((sz) => (
                          <button
                            type="button"
                            key={sz.name}
                            onClick={() => setBeverageSize(sz.name as any)}
                            className={`p-3 rounded-xl border text-center text-xs transition-all ${
                              beverageSize === sz.name
                                ? 'border-red-500 bg-red-50 text-red-600 font-bold ring-1 ring-red-500'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            <span className="block font-bold">{sz.name}</span>
                            <span className="block text-[10px] text-neutral-400">{sz.priceMod}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Common Section: Special Requests and Notes */}
                <div className="space-y-2 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-mono text-neutral-700 uppercase font-black tracking-wider">
                    Special Kitchen Requests
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="E.g. No onions, sauce on the side, well done crust bubbles..."
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-red-500 text-neutral-800 placeholder-neutral-400"
                  />
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Quantity select */}
                <div className="flex items-center gap-3 border border-neutral-200 rounded-xl bg-white p-1.5 shrink-0 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setPizzaQuantity(Math.max(1, pizzaQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold text-sm animate-pulse-slow"
                  >
                    －
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-black text-neutral-800">{pizzaQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setPizzaQuantity(pizzaQuantity + 1)}
                    className="w-8 h-8 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold text-sm animate-pulse-slow"
                  >
                    ＋
                  </button>
                </div>

                {/* Right totals & button */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-neutral-500 text-[10px] block uppercase font-mono tracking-wider font-bold">Total Price</span>
                    <span className="text-xl font-mono font-black text-red-600">
                      ₦{getCustomizedItemPrice().toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleConfirmCustomization}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-black text-xs rounded-xl uppercase tracking-widest transition-all shadow-md hover:shadow-lg"
                  >
                    Add to plate ✓
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Sourdough Pizza Builder Button */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden sm:block">
        <button
          onClick={() => {
            setCrust('36hr Sourdough Thin');
            setCheese('Traditional Mozzarella');
            setToppings([]);
            setIsSourdoughDrawerOpen(true);
          }}
          className="flex flex-col items-center gap-2 bg-[#E11D48] hover:bg-[#C0153E] text-white px-3 py-5 rounded-l-2xl shadow-2xl transition-all duration-300 hover:-translate-x-1 group ring-2 ring-white/20"
          id="sticky-sourdough-button"
        >
          <div className="relative">
            <Pizza className="w-5 h-5 text-amber-200 animate-[spin_8s_linear_infinite]" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
          <span className="font-serif italic text-[11px] font-extrabold block [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase py-1">
            Build Pizza
          </span>
        </button>
      </div>

      {/* Floating Action Button for Mobile Devices - Round cube sticked at the edge of the right middle side */}
      <div className="fixed right-0 top-[58%] -translate-y-1/2 z-40 block sm:hidden">
        <button
          onClick={() => {
            setCrust('36hr Sourdough Thin');
            setCheese('Traditional Mozzarella');
            setToppings([]);
            setIsSourdoughDrawerOpen(true);
          }}
          className="flex items-center justify-center w-12 h-12 bg-[#E11D48] hover:bg-[#C0153E] text-white rounded-l-xl shadow-2xl transition-all border-l border-y border-white/20 hover:-translate-x-1 active:scale-95 duration-300 cursor-pointer"
          title="Build Pizza"
        >
          <Pizza className="w-6 h-6 text-amber-200 animate-[spin_8s_linear_infinite]" />
        </button>
      </div>

      {/* Additional Drawers inside AnimatePresence */}
      <AnimatePresence>
        {isSourdoughDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setIsSourdoughDrawerOpen(false)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between border-l border-neutral-200 relative z-50"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-[#019993]/5">
                <div>
                  <span className="text-[10px] text-[#019993] font-mono font-black uppercase tracking-widest">Interactive Sourdough Lab</span>
                  <h3 className="text-lg font-serif font-black text-neutral-900 uppercase">Wood-Fired Customizer</h3>
                </div>
                <button
                  onClick={() => setIsSourdoughDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-700 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div>
                  <span className="text-red-600 font-mono text-[10px] uppercase tracking-wider block mb-1 font-bold">Build Your Sourdough</span>
                  <p className="text-neutral-500 text-xs leading-relaxed">
                    Our 36-hour cold-fermented sourdough provides the perfect crispy bubble structure. Choose your custom options below.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Crust Select */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-neutral-600 uppercase tracking-widest font-bold">1. Sourdough Base</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['36hr Sourdough Thin', 'Double Cheese Stuffed', 'Gluten-Free Cauliflower'].map(c => (
                        <button
                          key={c}
                          onClick={() => setCrust(c as any)}
                          className={`p-3 rounded-xl border text-left text-xs font-mono transition-all ${
                            crust === c ? 'border-[#019993] bg-[#019993]/5 text-[#019993] font-bold shadow-sm' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cheese Select */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-neutral-600 uppercase tracking-widest font-bold">2. Cheese Selection</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Traditional Mozzarella', 'Four-Cheese Italian Gorgonzola', 'Vegan Dairy-Free'].map(ch => (
                        <button
                          key={ch}
                          onClick={() => setCheese(ch as any)}
                          className={`p-3 rounded-xl border text-left text-xs font-mono transition-all ${
                            cheese === ch ? 'border-[#019993] bg-[#019993]/5 text-[#019993] font-bold shadow-sm' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toppings Multi-Select */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-neutral-600 uppercase tracking-widest font-bold">3. Choose Premium Toppings (Select Many)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableToppings.map(top => (
                        <button
                          type="button"
                          key={top.name}
                          onClick={() => handleToggleTopping(top.name)}
                          className={`px-3 py-2.5 rounded-lg border text-left text-[11px] font-mono transition-all flex justify-between items-center ${
                            toppings.includes(top.name) ? 'border-[#019993] bg-[#019993]/5 text-[#019993] font-bold' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          <span className="truncate">{top.name}</span>
                          <span className="text-[9px] text-neutral-400 shrink-0">+₦{top.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dashboard Visualization inside sidebar */}
                <div className="border border-dashed border-neutral-200 bg-neutral-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-4 h-4 text-[#019993] animate-spin-slow" />
                    <span className="font-bold text-neutral-900 text-xs font-sans">Visual Hearth Spec</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Crust: <strong className="text-red-600">{crust}</strong>, Cheese: <strong className="text-red-600">{cheese}</strong>. Toppings: <strong className="text-[#019993]">{toppings.join(', ') || 'Sauce & Cheese Only'}</strong>.
                  </p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
                <div>
                  <span className="text-neutral-500 text-[10px] block font-mono">Custom Price</span>
                  <span className="text-xl font-mono font-black text-[#019993]">₦{getCustomPizzaPrice().toLocaleString()}</span>
                </div>

                <button
                  onClick={handleAddCustomPizza}
                  className="px-5 py-3 bg-[#019993] hover:bg-[#00827d] text-white font-black text-xs rounded-xl uppercase tracking-wider transition-all shadow-md"
                >
                  {pizzaAdded ? 'Added ✓' : 'Add custom pizza'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {checkoutMode && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setCheckoutMode(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between border-l border-neutral-200 relative z-50"
            >
              {/* Header */}
              <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-[#019993]/5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#019993]" />
                  <div>
                    <span className="text-[10px] text-[#019993] font-mono font-black uppercase tracking-widest">Panarottis Pizza Plate</span>
                    <h3 className="text-lg font-serif font-black text-neutral-900 uppercase">
                      {checkoutStage === 'cart' ? 'Your Pizza Basket' : 'Secure Delivery'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutMode(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-700 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <div className="text-center py-24 text-neutral-400 space-y-4">
                    <div className="text-4xl">🍕</div>
                    <p className="text-sm font-mono">Your pizza basket is empty!</p>
                    <p className="text-xs text-neutral-500">Add authentic, handcrafted Italian pizzas, pastas, or chilled local beverages below.</p>
                  </div>
                ) : checkoutStage === 'cart' ? (
                  /* Stage 1: Cart list */
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-wider border-b border-neutral-100 pb-1.5 font-bold">Selected Items</h4>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.menuItem.id} className="flex gap-3 p-3 bg-neutral-50 border border-neutral-200/60 rounded-2xl relative overflow-hidden">
                          <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="w-14 h-14 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                          <div className="flex-grow min-w-0">
                            <h5 className="font-bold text-neutral-900 text-xs sm:text-sm truncate leading-tight">{item.menuItem.name}</h5>
                            <p className="text-[10px] text-neutral-500 font-mono truncate leading-normal mt-0.5">{item.menuItem.description}</p>
                            <span className="text-[11px] text-[#019993] font-mono font-bold block mt-1">₦{item.menuItem.price.toLocaleString()} each</span>

                            <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-1.5 py-0.5">
                                <button 
                                  onClick={() => onUpdateCartQuantity(item.menuItem.id, Math.max(1, item.quantity - 1))}
                                  className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono font-bold text-neutral-900 w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateCartQuantity(item.menuItem.id, item.quantity + 1)}
                                  className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button 
                                onClick={() => onRemoveFromCart(item.menuItem.id)}
                                className="text-red-600 hover:text-red-700 text-[10px] flex items-center gap-1 font-mono"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Stage 2: Payment & Delivery Contact Details */
                  <div className="space-y-4">
                    <button 
                      onClick={() => setCheckoutStage('cart')}
                      className="text-xs text-[#019993] hover:underline font-mono flex items-center gap-1"
                    >
                      ← Return to basket list
                    </button>

                    <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-wider border-b border-neutral-100 pb-1.5 font-bold">Delivery Details</h4>
                    
                    <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-600 uppercase font-black">Your Name</label>
                        <input 
                          type="text" required value={custName} onChange={e => setCustName(e.target.value)}
                          placeholder="e.g. Sandra Nwachukwu"
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#019993] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-600 uppercase font-black">Email Address</label>
                        <input 
                          type="email" required value={custEmail} onChange={e => setCustEmail(e.target.value)}
                          placeholder="sandra@mail.com"
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#019993] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-600 uppercase font-black">Phone Number</label>
                        <input 
                          type="tel" required value={custPhone} onChange={e => setCustPhone(e.target.value)}
                          placeholder="+234 812..."
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#019993] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-600 uppercase font-black">Delivery Address (Nigeria)</label>
                        <textarea 
                          required rows={3} value={custAddress} onChange={e => setCustAddress(e.target.value)}
                          placeholder="Apartment/Street details, City (Lagos or Abuja)"
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#019993] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="block text-[10px] font-mono text-neutral-600 uppercase font-black">Payment Method</label>
                        <div className="p-3.5 border border-[#019993] bg-[#019993]/5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-[#019993]">Secure Online Card Payment</span>
                            <span className="block text-[9.5px] text-neutral-500 mt-0.5">Pay via Paystack (Cards, Bank Transfer, USSD)</span>
                          </div>
                          <span className="bg-[#019993] text-white text-[8px] font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider shadow-md mt-4 cursor-pointer"
                      >
                        <Flame className="w-4 h-4" /> Place Pizza Order
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Footer Total */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <span className="text-neutral-500 text-[10px] block font-mono">Basket Total</span>
                    <span className="text-xl font-mono font-black text-red-600">₦{cartTotal.toLocaleString()}</span>
                  </div>

                  {checkoutStage === 'cart' && (
                    <button
                      onClick={() => setCheckoutStage('payment')}
                      className="px-5 py-3 bg-[#019993] hover:bg-[#00827d] text-white font-black text-xs rounded-xl uppercase tracking-wider transition-all shadow-md flex items-center gap-1"
                    >
                      <span>Checkout</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Funky Pizzeria Side Menu Drawer */}
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
              className="w-full max-w-xs sm:max-w-sm bg-white h-screen shadow-2xl flex flex-col justify-between border-l border-neutral-100 relative z-10 text-neutral-800"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm border border-neutral-100">
                    <img 
                      src={PANAROTTIS_LOGO} 
                      alt="Panarottis Logo" 
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://logo.clearbit.com/panarottis.co.za';
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-red-600 font-mono font-black uppercase tracking-widest block">WOODFIRED PIZZERIA</span>
                    <span className="text-xs font-serif font-black text-neutral-800 uppercase block">Navigation</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-700 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Content - Interactive Navigation links with Funky icons */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {/* Search Bar inside Drawer */}
                <div className="px-1 py-1">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search woodfired pizzas & dishes..."
                      value={drawerSearchQuery}
                      onChange={(e) => setDrawerSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-neutral-50 hover:bg-neutral-100/55 focus:bg-white text-xs font-semibold border border-neutral-200 focus:border-red-500 rounded-xl outline-none transition-all placeholder:text-neutral-400 text-neutral-800"
                    />
                    {drawerSearchQuery && (
                      <button
                        onClick={() => setDrawerSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* All Menu Items & Slices Section */}
                <div className="pt-1 border-t border-neutral-100">
                  <span className="text-[10px] text-neutral-400 font-mono uppercase font-black tracking-wider block px-1 mb-2">
                    {drawerSearchQuery ? 'Found Dishes' : 'Sourdough Specialties'}
                  </span>
                  
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {panMenu
                      .filter(item => 
                        !drawerSearchQuery || 
                        item.name.toLowerCase().includes(drawerSearchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(drawerSearchQuery.toLowerCase()) ||
                        item.category.toLowerCase().includes(drawerSearchQuery.toLowerCase())
                      )
                      .slice(0, drawerSearchQuery ? 15 : 6)
                      .map(item => (
                        <div 
                          key={item.id}
                          className="p-1.5 border border-neutral-100 rounded-xl bg-neutral-50/50 hover:bg-neutral-50 flex items-center gap-2 transition-colors group/item"
                        >
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-8 h-8 object-cover rounded-lg shrink-0 cursor-pointer"
                            referrerPolicy="no-referrer"
                            onClick={() => {
                              setActiveSubPage({ type: 'menu-item', id: item.id });
                              setIsSideMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          />
                          <div className="flex-grow min-w-0 text-left">
                            <h5 
                              onClick={() => {
                                setActiveSubPage({ type: 'menu-item', id: item.id });
                                setIsSideMenuOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-[11px] font-bold truncate text-neutral-800 hover:text-red-600 cursor-pointer leading-tight"
                            >
                              {item.name}
                            </h5>
                            <span className="text-[9.5px] font-mono text-red-600 font-bold">₦{item.price.toLocaleString()}</span>
                          </div>
                          
                          <button
                            onClick={() => {
                              onAddToCart(item, 1);
                              setCartBounced(true);
                              setTimeout(() => setCartBounced(false), 1000);
                            }}
                            className="px-2 py-1 bg-white hover:bg-red-600 hover:text-white border border-neutral-200 hover:border-red-600 rounded-lg text-[9px] text-neutral-600 font-black transition-all cursor-pointer shrink-0"
                            title="Quick Add"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    {panMenu.filter(item => 
                        !drawerSearchQuery || 
                        item.name.toLowerCase().includes(drawerSearchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(drawerSearchQuery.toLowerCase())
                      ).length === 0 && (
                      <div className="text-center py-4 text-[10px] text-neutral-400 font-serif">
                        No dishes match your search
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[10px] text-neutral-400 font-mono uppercase font-black tracking-wider block px-1 mb-2">Main Stations</span>
                </div>
                
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setActivePageId('home');
                    setCheckoutMode(false);
                    setActiveSubPage({ type: null, id: null });
                    setIsSideMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    activePageId === 'home' && !activeSubPage.type
                      ? 'bg-red-50/70 border-red-200 text-red-600 font-black shadow-sm'
                      : 'bg-white hover:bg-neutral-50 border-neutral-100 text-neutral-700'
                  }`}
                >
                  <span className="text-lg">🏠</span>
                  <div className="flex flex-col text-left">
                    <span className="uppercase tracking-wide">Pizzeria Home</span>
                    <span className="text-[9.5px] font-normal text-neutral-400">Back to the woodfire hearth</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('menu');
                    setActivePageId('menu');
                    setCheckoutMode(false);
                    setActiveSubPage({ type: null, id: null });
                    setIsSideMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    activePageId === 'menu'
                      ? 'bg-red-50/70 border-red-200 text-red-600 font-black shadow-sm'
                      : 'bg-white hover:bg-neutral-50 border-neutral-100 text-neutral-700'
                  }`}
                >
                  <span className="text-lg">🍕</span>
                  <div className="flex flex-col text-left">
                    <span className="uppercase tracking-wide">Our Sourdough Menu</span>
                    <span className="text-[9.5px] font-normal text-neutral-400">Pizzas, pastas & sweet treats</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('reservations');
                    setActivePageId('reservations');
                    setCheckoutMode(false);
                    setActiveSubPage({ type: null, id: null });
                    setIsSideMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    activePageId === 'reservations'
                      ? 'bg-red-50/70 border-red-200 text-red-600 font-black shadow-sm'
                      : 'bg-white hover:bg-neutral-50 border-neutral-100 text-neutral-700'
                  }`}
                >
                  <span className="text-lg">📅</span>
                  <div className="flex flex-col text-left">
                    <span className="uppercase tracking-wide">Book a Table</span>
                    <span className="text-[9.5px] font-normal text-neutral-400">Reserve spot & sourdough masterclass</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('about');
                    setActivePageId('about');
                    setCheckoutMode(false);
                    setActiveSubPage({ type: null, id: null });
                    setIsSideMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    activePageId === 'about'
                      ? 'bg-red-50/70 border-red-200 text-red-600 font-black shadow-sm'
                      : 'bg-white hover:bg-neutral-50 border-neutral-100 text-neutral-700'
                  }`}
                >
                  <span className="text-lg">📖</span>
                  <div className="flex flex-col text-left">
                    <span className="uppercase tracking-wide">Our Story & Craft</span>
                    <span className="text-[9.5px] font-normal text-neutral-400">Discover 36-hour dough science</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('locator');
                    setActivePageId('locator');
                    setCheckoutMode(false);
                    setActiveSubPage({ type: null, id: null });
                    setIsSideMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    activePageId === 'locator'
                      ? 'bg-red-50/70 border-red-200 text-red-600 font-black shadow-sm'
                      : 'bg-white hover:bg-neutral-50 border-neutral-100 text-neutral-700'
                  }`}
                >
                  <span className="text-lg">📍</span>
                  <div className="flex flex-col text-left">
                    <span className="uppercase tracking-wide">Pizzeria Locator</span>
                    <span className="text-[9.5px] font-normal text-neutral-400">Find woodfired stores near you</span>
                  </div>
                </button>

                {activeOrders.filter(o => o.brand === 'panarottis').length > 0 && (
                  <button
                    onClick={() => {
                      setActiveTab('tracking');
                      setActivePageId('tracking');
                      setCheckoutMode(false);
                      setActiveSubPage({ type: null, id: null });
                      setIsSideMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                      activePageId === 'tracking'
                        ? 'bg-red-50/70 border-red-200 text-red-600 font-black shadow-sm'
                        : 'bg-white hover:bg-neutral-50 border-neutral-100 text-neutral-700'
                    }`}
                  >
                    <span className="text-lg animate-bounce">🛵</span>
                    <div className="flex flex-col text-left">
                      <span className="uppercase tracking-wide flex items-center gap-1.5 text-red-600">Track Dispatch</span>
                      <span className="text-[9.5px] font-normal text-neutral-400">Real-time pizza delivery tracker</span>
                    </div>
                  </button>
                )}

                <div className="pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      onNavigate('portal');
                      setIsSideMenuOpen(false);
                    }}
                    className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>🚪</span>
                    <span className="uppercase tracking-wide text-left">Partner Portal</span>
                  </button>
                </div>
              </div>

              {/* Drawer Footer Funky Quote & Contact Info (Show on mobile) */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-center space-y-3.5">
                <p className="text-[10.5px] font-serif italic text-amber-800">
                  "Life is short, double the sourdough cheese!"
                </p>
                
                {/* Mobile contact info block */}
                <div className="border-t border-neutral-200/60 pt-3 flex flex-col items-center gap-2 text-[10px] font-mono text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#019993]" />
                    <span>Book Time - 10am To 11pm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#019993]" />
                    <a href="tel:+2348127149859" className="hover:underline">Call Us - +234 8127149859</a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#019993]" />
                    <a href="mailto:designmodesolutions@gmail.com" className="hover:underline">designmodesolutions@gmail.com</a>
                  </div>
                </div>

                {/* Social icons on mobile popup */}
                <div className="flex justify-center items-center gap-2.5 pt-1">
                  <span className="w-5 h-5 rounded-full bg-neutral-200/60 border border-neutral-300/40 flex items-center justify-center text-[9px] text-neutral-600 hover:text-[#019993] cursor-pointer">f</span>
                  <span className="w-5 h-5 rounded-full bg-neutral-200/60 border border-neutral-300/40 flex items-center justify-center text-[9px] text-neutral-600 hover:text-[#019993] cursor-pointer">t</span>
                  <span className="w-5 h-5 rounded-full bg-neutral-200/60 border border-neutral-300/40 flex items-center justify-center text-[9px] text-neutral-600 hover:text-[#019993] cursor-pointer">g+</span>
                  <span className="w-5 h-5 rounded-full bg-neutral-200/60 border border-neutral-300/40 flex items-center justify-center text-[9px] text-neutral-600 hover:text-[#019993] cursor-pointer">o</span>
                </div>

                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
                  Panarottis Nigeria
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        {/* 4. Beautiful Interactive Frontend Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-neutral-950/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 40, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white rounded-3xl w-full max-w-2xl border border-neutral-100 shadow-2xl overflow-hidden"
            >
              {/* Search Header */}
              <div className="p-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
                <Search className="w-5 h-5 text-[#019993] shrink-0" />
                <input
                  type="text"
                  placeholder="Search pizzas, midweek deals, sourdough tips, articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-transparent border-0 outline-none focus:ring-0 text-sm text-neutral-800 placeholder-neutral-400 font-sans"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-xl text-neutral-700 text-[10px] font-mono font-bold uppercase cursor-pointer"
                >
                  Close [esc]
                </button>
              </div>

              {/* Search Results Display Area */}
              <div className="p-6 max-h-[480px] overflow-y-auto space-y-6">
                {searchQuery.trim() === '' ? (
                  <div className="py-12 text-center text-neutral-400 space-y-3">
                    <Pizza className="w-12 h-12 text-neutral-300 mx-auto animate-bounce mb-2" />
                    <h4 className="font-serif font-black text-sm text-neutral-800">What are you craving today?</h4>
                    <p className="text-xs max-w-md mx-auto">Type to instantly find woodfired pizza varieties, current discount promo packages, or Chef Giovanni's authentic sourdough articles.</p>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      {['Margherita', 'Sizzler', 'BOGO', 'Sourdough', 'Pomodoros'].map(kw => (
                        <button
                          key={kw}
                          onClick={() => setSearchQuery(kw)}
                          className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-[#019993]/10 hover:text-[#019993] text-[10px] font-mono font-bold uppercase transition-all border border-neutral-200/50 cursor-pointer"
                        >
                          "{kw}"
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 1. Woodfired Slices Results */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-black uppercase text-amber-600 tracking-widest block border-b border-neutral-100 pb-1">
                        🍕 Woodfire Menu Matches ({searchResults.menu.length})
                      </span>
                      {searchResults.menu.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">No menu items match your search term.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {searchResults.menu.map(item => (
                            <div key={item.id} className="p-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 flex gap-3 items-center hover:shadow-md transition-all">
                              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                              <div className="flex-grow min-w-0">
                                <h5 className="font-bold text-xs truncate text-neutral-900">{item.name}</h5>
                                <p className="text-[10px] text-neutral-500 line-clamp-1">{item.description}</p>
                                <span className="text-xs font-mono font-black text-[#019993]">₦{item.price.toLocaleString()}</span>
                              </div>
                              <button
                                onClick={() => {
                                  handleAddWithFeedback(item, 1);
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                }}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold shrink-0 cursor-pointer transition-colors"
                              >
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 2. Special Promo Offers Results */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-black uppercase text-red-600 tracking-widest block border-b border-neutral-100 pb-1">
                        🏷️ Active Promotion Sizzlers ({searchResults.promos.length})
                      </span>
                      {searchResults.promos.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">No promotions match your search term.</p>
                      ) : (
                        <div className="space-y-2">
                          {searchResults.promos.map(p => (
                            <div key={p.title} className="p-3.5 rounded-2xl border border-dashed border-red-200 bg-red-50/30 flex justify-between items-center">
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-xs text-neutral-950 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                  {p.title}
                                </h5>
                                <p className="text-[10px] text-neutral-600 leading-normal">{p.description}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setActiveTab('home');
                                  setActivePageId('home');
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                  setTimeout(() => {
                                    const element = document.getElementById('special-dishes-section');
                                    if (element) {
                                      element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                  }, 150);
                                }}
                                className="px-3 py-1.5 bg-neutral-950 text-white hover:bg-red-600 transition-colors rounded-xl text-[9px] font-mono font-black uppercase tracking-wider shrink-0 cursor-pointer"
                              >
                                View Deal
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3. Flour Craft & Bread Blogs Results */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-black uppercase text-[#019993] tracking-widest block border-b border-neutral-100 pb-1">
                        📖 Sourdough & Academy Chronicles ({searchResults.blogs.length})
                      </span>
                      {searchResults.blogs.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">No craft articles match your search term.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {searchResults.blogs.map(b => (
                            <div key={b.title} className="p-3 rounded-2xl border border-neutral-100 hover:bg-neutral-50 flex justify-between items-center gap-4">
                              <div className="space-y-0.5">
                                <span className="text-[8px] font-mono font-black text-[#019993] bg-[#019993]/5 px-2 py-0.5 rounded-full border border-[#019993]/10 uppercase">
                                  {b.category}
                                </span>
                                <h5 className="font-serif font-bold text-xs text-neutral-950 mt-1">{b.title}</h5>
                                <p className="text-[10px] text-neutral-500 line-clamp-1 leading-normal">{b.summary}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setActiveTab('about');
                                  setActivePageId('about');
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                  window.scrollTo({ top: 1200, behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 border border-neutral-200 hover:border-neutral-900 transition-colors rounded-xl text-[9px] font-mono font-black uppercase tracking-wider shrink-0 cursor-pointer"
                              >
                                Read Article ➔
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
