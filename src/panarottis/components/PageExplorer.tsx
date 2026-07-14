import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Clock, Star, Users, Utensils, Sparkles, Scale, Info, CheckCircle, 
  MapPin, Phone, Mail, HelpCircle, Heart, Award, ArrowRight, ShieldCheck, 
  ChevronRight, Calendar, Gift, Play, Navigation, AlertTriangle, BookOpen, Send, Check
} from 'lucide-react';
import { MenuItem, Store } from '../../types';

interface PageExplorerProps {
  activePageId: string;
  onNavigatePage: (pageId: string) => void;
  panMenu: MenuItem[];
  panStores: Store[];
  onAddToCart: (item: MenuItem, qty?: number) => void;
  onOpenCustomizer: (item: MenuItem) => void;
}

// Full List of 42 Pages for easy mapping & site index explorer
export const PIZZERIA_PAGES = [
  { id: 'home', title: 'Pizzeria Hearth (Home)', category: 'Core Pages', desc: 'Our standard home screen with live bookings and master chef bios' },
  { id: 'menu', title: 'Pizza & Pasta Menu', category: 'Core Pages', desc: 'Explore handcrafted gourmet slices, hearty pastas, and beverages' },
  { id: 'custom-builder', title: 'DIY Pizza Builder', category: 'Core Pages', desc: 'The real-time ingredient customizer deck' },
  { id: 'reservations', title: 'Table Booking Desk', category: 'Core Pages', desc: 'Book sharing spaces next to stone ovens' },
  { id: 'about', title: 'Dough Story & Heritage', category: 'Core Pages', desc: 'Chronicles of premium soft wheat and our signature dough recipe' },
  { id: 'tracker', title: 'Order Live GPS Tracker', category: 'Core Pages', desc: 'Active dispatch courier mapping (Nigeria)' },
  { id: 'audits', title: 'Dough Audits Registry', category: 'Community', desc: 'Live customer feedback and dough rating boards' },
  { id: 'faq', title: 'Pizzeria FAQ Directory', category: 'Academy & Science', desc: 'Detailed answers on yeast proofing and baking thermodynamics' },
  { id: 'masterclasses', title: 'Pizza Making Academy', category: 'Academy & Science', desc: 'Saturday hand-stretching and oven courses' },
  { id: 'science-lab', title: 'Pizza Dough Hydration Lab', category: 'Academy & Science', desc: 'Interactive baker percentage weight calculator' },
  { id: 'pizza-quiz', title: 'Pizza Soulmatch Quiz', category: 'Interactives', desc: 'Answer 4 questions to find your personalized oven-fresh match' },
  { id: 'contact', title: 'Support & Helpdesk', category: 'Core Pages', desc: 'Reach our dough desk or open a help ticket' },
  { id: 'catering', title: 'Catering Feast Planner', category: 'Services', desc: 'Interactive pizza portion estimator for large family events' },
  { id: 'franchise', title: 'Franchise Application', category: 'Services', desc: 'Target city analytics and investment application forms' },
  { id: 'nutrition', title: 'Portion & Nutrition Database', category: 'Health & Safety', desc: 'Detailed calorie, carbohydrate, and protein counts' },
  { id: 'allergens', title: 'Allergen Safety Matrix', category: 'Health & Safety', desc: 'Gluten, wheat, dairy, and shellfish cross-matching' },
  { id: 'careers', title: 'Careers & Internships', category: 'Community', desc: 'Dough apprenticeship openings and kitchen leads' },
  { id: 'loyalty', title: 'La Famiglia Loyalty Club', category: 'Community', desc: 'Punch card simulator, rewards points, and catalogs' },
  { id: 'csr', title: 'Dough for Good CSR', category: 'Community', desc: 'Tracking our 1,000,000 flour loaves donation drive' },
  { id: 'press', title: 'Media Press Archives', category: 'Community', desc: 'News highlights, Campania mill contracts, and branding' },
  { id: 'webcam', title: 'Hearth Live Webcam Feed', category: 'Interactives', desc: 'Visual simulation of high-heat active stone deck ovens' },
  { id: 'recipe-biga', title: 'Recipe: 36h Biga Starter', category: 'Dough Recipes', desc: 'How to propagate wild yeast cultures' },
  { id: 'recipe-sauce', title: 'Recipe: San Marzano Sauce', category: 'Dough Recipes', desc: 'Slow-simmered low-acid sweet Italian pomodoros' },
  { id: 'recipe-hearth', title: 'Recipe: Hearth Thermodynamics', category: 'Dough Recipes', desc: 'Mastering over-deck wood combustion and charcoal' },
  { id: 'recipe-spotting', title: 'Recipe: Golden Baking', category: 'Dough Recipes', desc: 'Achieving the perfect golden-crisp baked rim bubbles' },
  { id: 'milestone-1', title: 'Milestone: Premium Flour Sourcing', category: 'Chronicles', desc: ' Campania mill relations and wheat importation logs' },
  { id: 'milestone-2', title: 'Milestone: Signature Dough Recipe', category: 'Chronicles', desc: 'The secret 36-hour slow-proofing dough records' },
  { id: 'milestone-3', title: 'Milestone: Stone Hearth Build', category: 'Chronicles', desc: 'Constructing volcanic deck dome ovens on-site in Nigeria' },
  { id: 'store-lekki', title: 'Store: Lekki Phase 1', category: 'Pizzerias', desc: 'Admiralty Way gourmet hub and dispatch zone' },
  { id: 'store-ikeja', title: 'Store: Ikeja City Mall', category: 'Pizzerias', desc: 'Our high-traffic family diner in Lagos mainland' },
  { id: 'store-wuse', title: 'Store: Wuse II, Abuja', category: 'Pizzerias', desc: 'Capital stone-deck bakery and masterclass space' },
  { id: 'store-vi', title: 'Store: Victoria Island HQ', category: 'Pizzerias', desc: 'Sanusi Fafunwa head bakery and kitchen webcams' },
  { id: 'store-ph', title: 'Store: Port Harcourt Mall', category: 'Pizzerias', desc: 'Our expansion outlet serving southern Nigeria' },
  { id: 'menu-item-1', title: 'Product: Seafood Deluxe', category: 'Menu Slices', desc: 'Queen prawns, calamari, lemon zest, garlic sauce' },
  { id: 'menu-item-2', title: 'Product: Fiery Chicken Suya', category: 'Menu Slices', desc: 'Chicken suya, sweet bell peppers, red onions' },
  { id: 'menu-item-3', title: 'Product: Double Cheese Margherita', category: 'Menu Slices', desc: 'San Marzano pulp, mozzarella fior di latte, basil leaves' },
  { id: 'menu-item-4', title: 'Product: Romagna Lasagna', category: 'Menu Slices', desc: 'Layers of fresh pasta, slow-simmered beef ragu' },
  { id: 'menu-item-5', title: 'Product: Caesar Garden Salad', category: 'Menu Slices', desc: 'Crisp romaine, sourdough croutons, creamy yolk garlic' },
  { id: 'menu-item-6', title: 'Product: Espresso Tiramisu', category: 'Menu Slices', desc: 'Ladyfingers soaked in espresso, mascarpone cheese' },
  { id: 'menu-item-7', title: 'Product: Rosemary Soda', category: 'Menu Slices', desc: 'Tangy lemons and rosemary herbal bubble lift' },
  { id: 'privacy', title: 'Privacy & Cookie Policy', category: 'Compliance', desc: 'Data handling, cookies, and delivery secure checkout' },
  { id: 'terms', title: 'Terms of Service SLAs', category: 'Compliance', desc: 'Delivery parameters, refunds, masterclass cancellations' }
];

export default function PageExplorer({
  activePageId,
  onNavigatePage,
  panMenu,
  panStores,
  onAddToCart,
  onOpenCustomizer
}: PageExplorerProps) {

  // Sourdough Hydration Lab State
  const [flourWeight, setFlourWeight] = useState(1000);
  const [hydrationPct, setHydrationPct] = useState(65);
  const [saltPct, setSaltPct] = useState(2.5);
  const [yeastPct, setYeastPct] = useState(15);

  const waterWeight = (flourWeight * hydrationPct) / 100;
  const saltWeight = (flourWeight * saltPct) / 100;
  const starterWeight = (flourWeight * yeastPct) / 100;
  const totalWeight = flourWeight + waterWeight + saltWeight + starterWeight;
  const doughBallsCount = Math.floor(totalWeight / 250);

  // Pizza Matchmaker Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<MenuItem | null>(null);

  const quizQuestions = [
    {
      q: "Select your dream culinary weekend escape:",
      options: [
        { key: 'A', text: 'Hiking warm trails next to volcanic hills', value: 'spicy' },
        { key: 'B', text: 'Nurturing sourdough biga starters at home', value: 'margherita' },
        { key: 'C', text: 'Sailing off the coast of Victoria Island', value: 'seafood' },
        { key: 'D', text: 'Lounging inside cozy, shared family spaces', value: 'pasta' }
      ]
    },
    {
      q: "How does your palate handle fiery heat?",
      options: [
        { key: 'A', text: 'Bring on scorching scotch bonnets and jalapeños!', value: 'spicy' },
        { key: 'B', text: 'Moderate herbal tang with some garlic bite', value: 'seafood' },
        { key: 'C', text: 'Pure mild sweetness of fresh ripened tomatoes', value: 'margherita' },
        { key: 'D', text: 'Creamy, rich and absolutely zero pepper heat', value: 'pasta' }
      ]
    },
    {
      q: "Your perfect cheese melt profile:",
      options: [
        { key: 'A', text: 'Rich gorgonzola combined with mild mozzarella', value: 'spicy' },
        { key: 'B', text: 'Bubbling, high-stretch golden mozzarella strings', value: 'seafood' },
        { key: 'C', text: 'Soft mozzarella fior di latte discs', value: 'margherita' },
        { key: 'D', text: 'Heavy, layered Parmigiano-Reggiano creams', value: 'pasta' }
      ]
    },
    {
      q: "Which flour base matches your soul?",
      options: [
        { key: 'A', text: 'Thick Neapolitan pan with crispy bottom char', value: 'spicy' },
        { key: 'B', text: '36h cold-fermented classic thin crispy bubbles', value: 'seafood' },
        { key: 'C', text: 'Gluten-Free cauliflower base', value: 'margherita' },
        { key: 'D', text: 'Hearty sheets of egg-kneaded lasagna pasta', value: 'pasta' }
      ]
    }
  ];

  const handleQuizAnswer = (value: string) => {
    const nextAnswers = [...quizAnswers, value];
    setQuizAnswers(nextAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate matching product
      const counts = { spicy: 0, margherita: 0, seafood: 0, pasta: 0 };
      nextAnswers.forEach(ans => {
        counts[ans as keyof typeof counts] = (counts[ans as keyof typeof counts] || 0) + 1;
      });

      let winner = 'margherita';
      let maxVal = 0;
      Object.entries(counts).forEach(([k, v]) => {
        if (v > maxVal) {
          maxVal = v;
          winner = k;
        }
      });

      let targetItem: MenuItem | undefined;
      if (winner === 'seafood') targetItem = panMenu.find(m => m.id === 'panarottis-1');
      if (winner === 'spicy') targetItem = panMenu.find(m => m.id === 'panarottis-3');
      if (winner === 'margherita') targetItem = panMenu.find(m => m.id === 'panarottis-6');
      if (winner === 'pasta') targetItem = panMenu.find(m => m.id === 'panarottis-5');

      if (!targetItem) targetItem = panMenu[0];
      setQuizResult(targetItem);
      setQuizStep(5);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  // Catering Estimator State
  const [guestsCount, setGuestsCount] = useState(15);
  const estimatedPizzas = Math.ceil(guestsCount * 0.4);
  const estimatedPastas = Math.ceil(guestsCount * 0.2);
  const estimatedDrinks = Math.ceil(guestsCount * 0.5);
  const estimatedTiramisus = Math.ceil(guestsCount * 0.3);
  const totalCateringBudget = (estimatedPizzas * 8500) + (estimatedPastas * 6500) + (estimatedDrinks * 2200) + (estimatedTiramisus * 4500);

  // Franchise Application State
  const [franchiseSuccess, setFranchiseSuccess] = useState(false);
  const targetCities = [
    { city: 'Lagos Island / VI', density: 'Ultra High', metric: '₦185k avg order ticket', fee: '₦12,500,000' },
    { city: 'Abuja Wuse / Garki', density: 'High', metric: '₦210k avg order ticket', fee: '₦10,000,000' },
    { city: 'Port Harcourt Mall', density: 'Moderate High', metric: '₦155k avg order ticket', fee: '₦8,500,000' },
    { city: 'Lekki Phase 1', density: 'Extreme', metric: '₦290k avg order ticket', fee: '₦15,000,000' }
  ];

  // Loyalty Points Simulator
  const [loyaltyPoints, setLoyaltyPoints] = useState(4800);
  const [loyaltySuccessMsg, setLoyaltySuccessMsg] = useState('');

  // Support Helpdesk States
  const [helpTicketId, setHelpTicketId] = useState('');
  const [helpStatus, setHelpStatus] = useState('');
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHelpTicketId(`PAN-7${Math.floor(100 + Math.random() * 900)}-DOUGH`);
    setHelpStatus('Allocated to Lead Pizzaiolo. Response ETA: 4 Mins.');
  };

  // Careers Internship Application States
  const [careerSuccess, setCareerSuccess] = useState(false);

  // Live Webcam logs simulation
  const [webcamLogs, setWebcamLogs] = useState([
    "Deck 1: 423°C - Sourdough rising smoothly",
    "Deck 2: 418°C - Margherita cheese caramelizing",
    "Prep Deck: Hand-stretching 65% water Biga balls",
    "Hot-Bag Transit: 2 orders dispatched via express couriers"
  ]);

  useEffect(() => {
    if (activePageId === 'webcam') {
      const interval = setInterval(() => {
        const temps = [420, 421, 422, 423, 424, 425];
        const t1 = temps[Math.floor(Math.random() * temps.length)];
        const t2 = temps[Math.floor(Math.random() * temps.length)];
        setWebcamLogs(prev => [
          `Deck 1: ${t1}°C - Thermal stability verified`,
          `Deck 2: ${t2}°C - Wood ember oxygen level stabilized`,
          `Prep Deck: Dynamic stretching complete on batch #${Math.floor(10 + Math.random() * 80)}`,
          prev[3]
        ]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activePageId]);

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-sm min-h-[500px]">
      
      {/* 1. DOUGH AUDITS REGISTRY */}
      {activePageId === 'audits' && (
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Live Diner Transparency</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Dough Audits Registry</h2>
            <p className="text-neutral-500 text-xs">We run full-disclosure quality checks on our flour water ratios and baking crust heights.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
              <span className="text-sm font-mono uppercase tracking-wider font-bold block text-neutral-800">Audit Summary</span>
              <div className="text-center py-6 bg-white border border-neutral-200/50 rounded-xl shadow-inner">
                <span className="text-5xl font-black text-neutral-900 font-mono">4.92 / 5</span>
                <span className="text-xs text-neutral-500 block mt-1">Based on 1,480+ local audits</span>
              </div>
              <div className="space-y-2 text-xs font-mono text-neutral-600">
                <div className="flex justify-between">
                  <span>Dough Crust Elasticity</span>
                  <span className="text-emerald-600 font-bold">98.2% Perfect</span>
                </div>
                <div className="flex justify-between">
                  <span>Leopard Char Consistency</span>
                  <span className="text-emerald-600 font-bold">96.8% Spotting</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch bag thermal temp</span>
                  <span className="text-emerald-600 font-bold">68.4°C Arrival</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <h3 className="text-base font-bold font-serif text-neutral-900 border-b border-neutral-100 pb-2">Recent Public Quality Logs</h3>
              {[
                { name: 'Kelechi O.', date: '2026-07-12', rating: 5, msg: 'Excellent hydration on the Seafood Deluxe. Crust bubbles were beautifully charred.' },
                { name: 'Fatima A.', date: '2026-07-10', rating: 5, msg: 'Arrived at our office in Wuse II piping hot. Real San Marzano pulp makes a huge difference!' },
                { name: 'Ibrahim K.', date: '2026-07-09', rating: 4, msg: 'The Al Capone pizza is very spicy and delicious. Perfectly wood-fired.' }
              ].map((aud, index) => (
                <div key={index} className="p-4 bg-neutral-50/50 border border-neutral-200/50 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-neutral-900">{aud.name}</strong>
                    <span className="text-neutral-400 font-mono text-[10px]">{aud.date}</span>
                  </div>
                  <div className="flex text-amber-500 gap-0.5">
                    {Array.from({ length: aud.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />)}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{aud.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. FAQ DIRECTORY */}
      {activePageId === 'faq' && (
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Pizza-Science Queries</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Frequently Asked Questions</h2>
            <p className="text-neutral-500 text-xs">Everything you need to know about fresh pizza dough proofing, ingredients, and ovens.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "What makes your 36-hour signature dough so special?", a: "We proof our signature fresh dough for exactly 36 hours at a controlled cold temperature of 4°C. This long fermenting process breaks down gluten naturally, making the crust extremely light, incredibly flavorful, and perfectly easy to digest." },
              { q: "Why do you bake pizzas at 420°C?", a: "Standard home ovens only reach 250°C, leading to slow baking which dries out pizza dough, resulting in a tough, cardboard crust. Our state-of-the-art stone deck ovens cook at 420°C using intense wood embers. This flash-bakes the pizza in exactly 90 seconds, locking moisture inside while melting cheese and caramelizing toppings instantly to perfection." },
              { q: "Do you source premium high-protein flour?", a: "Yes. We maintain direct partnerships with premium wheat mills to secure high-absorption flour. This allows us to build a rich, elastic dough matrix that bakes into a soft, fluffy crust without tearing during hand-stretching." },
              { q: "What is your delivery coverage and refund SLA?", a: "We operate our own fleet of express motorcycles. We deliver hot within a 12km radius of our Lekki, Ikeja, and Wuse II hub pizzerias. If your pizza cheese is stiff or cold on arrival, we will dispatch an instant fresh replacement free of charge." },
              { q: "Can I host a corporate masterclass event?", a: "Absolutely. Our Saturday morning pizza-making classes can accommodate groups up to 10 students. We offer customized packages including custom branded aprons, recipe kits, and premium beverage pairings." }
            ].map((fq, i) => (
              <div key={i} className="border border-neutral-200/80 rounded-2xl overflow-hidden p-5 bg-neutral-50/50">
                <h4 className="font-bold text-neutral-900 text-sm flex gap-2 items-center">
                  <span className="text-red-600 font-mono">Q:</span> {fq.q}
                </h4>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mt-2.5 border-l-2 border-red-200 pl-3.5 italic bg-white p-3 rounded-lg">
                  {fq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PIZZA DOUGH HYDRATION LAB */}
      {activePageId === 'science-lab' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Bakers' Formula Calculator</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Pizza Dough Hydration Lab</h2>
            <p className="text-neutral-500 text-xs">Compute exact weight specs for your premium flour, mineral water, and sea salt balance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-neutral-700 uppercase mb-2 font-bold">Flour Base Weight (grams)</label>
                <input 
                  type="range" min={250} max={5000} step={50} value={flourWeight} onChange={e => setFlourWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs font-mono text-neutral-500 mt-1">
                  <span>250g</span>
                  <span className="text-red-600 font-bold text-sm">{flourWeight}g (Campania Tipo 00)</span>
                  <span>5,000g</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-700 uppercase mb-2 font-bold">Hydration Percentage (%)</label>
                <input 
                  type="range" min={55} max={80} step={1} value={hydrationPct} onChange={e => setHydrationPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs font-mono text-neutral-500 mt-1">
                  <span>55% (Low)</span>
                  <span className="text-red-600 font-bold text-sm">{hydrationPct}% Water Ratio</span>
                  <span>80% (High Canotto)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Sea Salt (%)</label>
                  <select value={saltPct} onChange={e => setSaltPct(Number(e.target.value))} className="w-full p-2 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none">
                    <option value={2.0}>2.0% (Milder)</option>
                    <option value={2.5}>2.5% (Naples Standard)</option>
                    <option value={3.0}>3.0% (Crisp Crust)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Biga Starter (%)</label>
                  <select value={yeastPct} onChange={e => setYeastPct(Number(e.target.value))} className="w-full p-2 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none">
                    <option value={10}>10% (Slow proof)</option>
                    <option value={15}>15% (36hr Sweet-spot)</option>
                    <option value={20}>20% (Rapid ferment)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calculations Card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <span className="text-[10px] text-red-600 font-mono uppercase tracking-wider font-bold block">Live Dough Yield Output</span>
              <div className="border-b border-neutral-100 pb-3">
                <span className="text-3xl font-black font-mono text-neutral-900">₦{(totalWeight * 3).toLocaleString()} <span className="text-xs font-normal text-neutral-400 font-sans">Batch Value</span></span>
              </div>
              <div className="space-y-2 text-xs font-mono text-neutral-600">
                <div className="flex justify-between">
                  <span>Campania Tipo 00 Flour</span>
                  <span className="font-bold text-neutral-900">{flourWeight.toFixed(0)}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Mineral Spring Water</span>
                  <span className="font-bold text-neutral-900">{waterWeight.toFixed(0)}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Fleur de Sel (Sea Salt)</span>
                  <span className="font-bold text-neutral-900">{saltWeight.toFixed(0)}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Sourdough Biga Starter</span>
                  <span className="font-bold text-neutral-900">{starterWeight.toFixed(0)}g</span>
                </div>
                <div className="h-px bg-neutral-100 my-2" />
                <div className="flex justify-between text-neutral-900 font-bold">
                  <span>Total Yield Weight</span>
                  <span>{totalWeight.toFixed(0)}g</span>
                </div>
              </div>
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-[10px] leading-relaxed flex items-center gap-2">
                <Award className="w-4 h-4 shrink-0 text-red-500" />
                <span>Yields approximately <strong>{doughBallsCount} Sourdough balls</strong> (250g each) suitable for golden shared pizzas.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PIZZA SOULMATCH QUIZ */}
      {activePageId === 'pizza-quiz' && (
        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Interactive Sourdough Matchmaker</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">What Pizza Are You?</h2>
            <p className="text-neutral-500 text-xs">Answer 4 questions regarding fermentation, cheese, and spice parameters to uncover your true wood-fired matching soul.</p>
          </div>

          <div className="p-6 sm:p-10 bg-neutral-50 rounded-3xl border border-neutral-200 shadow-sm relative overflow-hidden min-h-[300px]">
            {quizStep < 4 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                  <span>QUESTION {quizStep + 1} OF 4</span>
                  <span className="font-bold text-red-600">{Math.round(((quizStep) / 4) * 100)}%</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${(quizStep / 4) * 100}%` }} />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 font-serif leading-tight">
                  {quizQuestions[quizStep].q}
                </h3>
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {quizQuestions[quizStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(opt.value)}
                      className="p-4 bg-white hover:bg-red-50/50 border border-neutral-200 hover:border-red-400 text-left rounded-xl text-xs sm:text-sm font-medium text-neutral-700 transition-all flex items-center gap-3 shadow-sm"
                    >
                      <span className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center font-mono font-bold text-neutral-500 text-xs">{opt.key}</span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-6 animate-fade-in">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-red-600/20">
                  🍕
                </div>
                <div className="space-y-2">
                  <span className="text-red-600 font-mono text-[10px] uppercase tracking-widest font-bold">Your dough destiny has spoken</span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-neutral-950">{quizResult?.name}</h3>
                  <p className="text-neutral-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">{quizResult?.description}</p>
                </div>
                <div className="max-w-xs mx-auto p-4 border border-dashed border-red-200 bg-red-50/30 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono">Special Match Price</span>
                    <strong className="text-red-600 text-lg font-mono">₦{quizResult?.price.toLocaleString()}</strong>
                  </div>
                  <button
                    onClick={() => {
                      if (quizResult) {
                        onAddToCart(quizResult, 1);
                        alert(`✓ Added ${quizResult.name} to plate!`);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-mono font-bold uppercase rounded-lg shadow transition-colors"
                  >
                    Add Match to Basket
                  </button>
                </div>
                <button onClick={resetQuiz} className="text-xs text-neutral-500 hover:text-red-600 hover:underline">Retake Soul Match Quiz</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. CONTACT US & HELPDESK */}
      {activePageId === 'contact' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">24/7 Sourdough Desk</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Contact Us & Helpdesk</h2>
            <p className="text-neutral-500 text-xs">Open a live help ticket or speak to our master pizzaiolos directly regarding orders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-800">Victoria Island Hub HQ</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Our core wood-fired brick dome deck ovens operate 24 hours a day on Sanusi Fafunwa Street to provide Lekki and VI with golden slices.
                </p>
                <div className="space-y-2.5 text-xs text-neutral-600 font-mono">
                  <div className="flex gap-2"><MapPin className="w-4 h-4 text-red-500 shrink-0" /> <span>Plot 1437, Sanusi Fafunwa St, Victoria Island, Lagos</span></div>
                  <div className="flex gap-2"><Phone className="w-4 h-4 text-red-500 shrink-0" /> <span>+234 8127149859 (Helpline)</span></div>
                  <div className="flex gap-2"><Mail className="w-4 h-4 text-red-500 shrink-0" /> <span>designmodesolutions@gmail.com</span></div>
                </div>
              </div>

              {helpTicketId && (
                <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-2 animate-fade-in">
                  <p className="font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-600" /> Ticket Successfully Filed!</p>
                  <p className="font-mono"><strong>ID:</strong> {helpTicketId}</p>
                  <p><strong>Status:</strong> {helpStatus}</p>
                </div>
              )}
            </div>

            {/* Submit form */}
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-600 uppercase mb-1">Your Name</label>
                <input required type="text" placeholder="Ifeanyi Okafor" className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-600 uppercase mb-1">Email Address</label>
                <input required type="email" placeholder="ifeanyi@mail.com" className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-600 uppercase mb-1">Topic</label>
                <select className="w-full p-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none">
                  <option>Dough hydration query</option>
                  <option>Masterclass Booking enquiry</option>
                  <option>Active Delivery status delay</option>
                  <option>Corporate Catering custom request</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-600 uppercase mb-1">Message</label>
                <textarea required rows={3} placeholder="Please detail your sourdough parameters..." className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all">
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. CATERING FEAST PLANNER */}
      {activePageId === 'catering' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Corporate Sharing Program</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Catering Feast Planner</h2>
            <p className="text-neutral-500 text-xs">Enter expected guests to instantly generate custom dough, pasta, and drink requirements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200">
            {/* Input range */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-neutral-700 uppercase font-black">Number of Expected Diners</label>
                <input 
                  type="number" min={5} max={300} value={guestsCount} onChange={e => setGuestsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none text-neutral-900"
                />
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Shared family platters and loaded sourdough pizzas are built around a standard portion weight of 450g per adult diner to guarantee maximum satiety.
              </p>
            </div>

            {/* Calculations Output */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <span className="text-[10px] text-red-600 font-mono uppercase tracking-wider font-bold block">Feast Portions Requirement</span>
              <div className="space-y-2.5 text-xs font-mono text-neutral-600">
                <div className="flex justify-between">
                  <span>30cm Sourdough Pizzas</span>
                  <strong className="text-neutral-900">{estimatedPizzas} Pizzas</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hearty Pasta Platter Trays</span>
                  <strong className="text-neutral-900">{estimatedPastas} Trays</strong>
                </div>
                <div className="flex justify-between">
                  <span>Espresso Tiramisu Boxes</span>
                  <strong className="text-neutral-900">{estimatedTiramisus} Boxes</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lemon Rosemary Sodas</span>
                  <strong className="text-neutral-900">{estimatedDrinks} Bottles</strong>
                </div>
                <div className="h-px bg-neutral-100 my-2" />
                <div className="flex justify-between text-neutral-900 font-bold">
                  <span>Estimated Event Budget</span>
                  <span className="text-red-600 text-base font-mono">₦{totalCateringBudget.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => alert(`✓ Event quote request dispatched to OFRNL corporate office for ${guestsCount} diners!`)} className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-bold uppercase rounded-lg shadow transition-colors">
                Book Catering Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. FRANCHISE APPLICATION */}
      {activePageId === 'franchise' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Invest in Hearth Craft</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Franchise Program</h2>
            <p className="text-neutral-500 text-xs">Submit franchise expressions of interest to establish volcanic deck dome ovens in other Nigerian cities.</p>
          </div>

          <div className="space-y-6">
            <div className="overflow-x-auto border border-neutral-200 rounded-2xl shadow-sm">
              <table className="w-full text-left border-collapse bg-white text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 font-mono uppercase text-neutral-600">
                    <th className="p-4 font-bold">Target Nigerian Territory</th>
                    <th className="p-4 font-bold">Pizza Density Index</th>
                    <th className="p-4 font-bold">Averaged Order Ticket</th>
                    <th className="p-4 font-bold">Master franchise entry fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700 font-mono">
                  {targetCities.map((c, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50">
                      <td className="p-4 font-bold">{c.city}</td>
                      <td className="p-4 text-emerald-600 font-bold">{c.density}</td>
                      <td className="p-4">{c.metric}</td>
                      <td className="p-4 text-neutral-900 font-bold">{c.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {franchiseSuccess ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex gap-2 items-center animate-fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Thank you. Your corporate development dossier and city analysis slides have been dispatched to your email address.</span>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setFranchiseSuccess(true); }} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Contact Name</label>
                  <input required type="text" placeholder="Emeka Adeleke" className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Corporate Email</label>
                  <input required type="email" placeholder="emeka@holding.com" className="w-full p-2.5 text-xs bg-white border border-neutral-200 rounded-lg" />
                </div>
                <button type="submit" className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors">
                  Request franchise Dossier
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 8. NUTRITIONAL DATABASE */}
      {activePageId === 'nutrition' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Diner Ingredient Transparency</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Nutritional Database</h2>
            <p className="text-neutral-500 text-xs">Official carbohydrate, calorie, protein, and sodium specifications per portion.</p>
          </div>

          <div className="overflow-x-auto border border-neutral-200 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse bg-white text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-mono uppercase text-neutral-600">
                  <th className="p-4 font-bold">Pizzeria Dish</th>
                  <th className="p-4 font-bold">Energy (kcal)</th>
                  <th className="p-4 font-bold">Protein (g)</th>
                  <th className="p-4 font-bold">Carbs (g)</th>
                  <th className="p-4 font-bold">Dietary Fats (g)</th>
                  <th className="p-4 font-bold">Sodium (mg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-mono">
                {[
                  { name: 'Seafood Deluxe Pizza (30cm)', cal: 890, pro: 42, carb: 104, fat: 28, sod: 1420 },
                  { name: 'Al Capone Pizza (30cm)', cal: 940, pro: 48, carb: 106, fat: 34, sod: 1650 },
                  { name: 'Classic Margherita Slices', cal: 720, pro: 31, carb: 98, fat: 19, sod: 1100 },
                  { name: 'Romagna Lasagna Tray', cal: 680, pro: 38, carb: 54, fat: 29, sod: 1220 },
                  { name: 'Italian Caesar Garden Salad', cal: 240, pro: 12, carb: 14, fat: 16, sod: 540 },
                  { name: 'Cocoa Espresso Tiramisu', cal: 420, pro: 6, carb: 48, fat: 22, sod: 180 },
                  { name: 'Rosemary Frizzante Soda', cal: 95, pro: 0, carb: 24, fat: 0, sod: 15 }
                ].map((nut, i) => (
                  <tr key={i} className="hover:bg-neutral-50/50">
                    <td className="p-4 font-bold text-neutral-900">{nut.name}</td>
                    <td className="p-4">{nut.cal}</td>
                    <td className="p-4">{nut.pro}</td>
                    <td className="p-4">{nut.carb}</td>
                    <td className="p-4">{nut.fat}</td>
                    <td className="p-4">{nut.sod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. ALLERGEN SAFETY MATRIX */}
      {activePageId === 'allergens' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Secure Dining Practices</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Allergen Safety Matrix</h2>
            <p className="text-neutral-500 text-xs">Verify the presence of gluten, dairy, or shellfish before enjoying shared Italian slices.</p>
          </div>

          <div className="overflow-x-auto border border-neutral-200 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse bg-white text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-mono uppercase text-neutral-600">
                  <th className="p-4 font-bold">Pizzeria Dish</th>
                  <th className="p-4 font-bold text-center">Wheat / Gluten</th>
                  <th className="p-4 font-bold text-center">Dairy / Milk</th>
                  <th className="p-4 font-bold text-center">Shellfish</th>
                  <th className="p-4 font-bold text-center">Eggs</th>
                  <th className="p-4 font-bold text-center">Garlic / Onion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-mono">
                {[
                  { name: 'Seafood Deluxe Pizza', wheat: true, dairy: true, shellfish: true, eggs: false, garlic: true },
                  { name: 'Al Capone Spicy Pizza', wheat: true, dairy: true, shellfish: false, eggs: false, garlic: true },
                  { name: 'Classic Sourdough Margherita', wheat: true, dairy: true, shellfish: false, eggs: false, garlic: false },
                  { name: 'Romagna Lasagna Pasta', wheat: true, dairy: true, shellfish: false, eggs: true, garlic: true },
                  { name: 'Italian Caesar Garden Salad', wheat: true, dairy: true, shellfish: false, eggs: true, garlic: true },
                  { name: 'Cocoa Espresso Tiramisu', wheat: true, dairy: true, shellfish: false, eggs: true, garlic: false },
                  { name: 'Rosemary Frizzante Soda', wheat: false, dairy: false, shellfish: false, eggs: false, garlic: false }
                ].map((alg, i) => (
                  <tr key={i} className="hover:bg-neutral-50/50">
                    <td className="p-4 font-bold text-neutral-900">{alg.name}</td>
                    <td className="p-4 text-center">{alg.wheat ? <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">YES</span> : <span className="text-neutral-300">--</span>}</td>
                    <td className="p-4 text-center">{alg.dairy ? <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">YES</span> : <span className="text-neutral-300">--</span>}</td>
                    <td className="p-4 text-center">{alg.shellfish ? <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">YES</span> : <span className="text-neutral-300">--</span>}</td>
                    <td className="p-4 text-center">{alg.eggs ? <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">YES</span> : <span className="text-neutral-300">--</span>}</td>
                    <td className="p-4 text-center">{alg.garlic ? <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">YES</span> : <span className="text-neutral-300">--</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. CAREERS & APPRENTICESHIPS */}
      {activePageId === 'careers' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Dough Apprenticeship Openings</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Pizzeria Careers</h2>
            <p className="text-neutral-500 text-xs">Join our stone-deck kitchen team in Lagos Admiralty Way or Abuja Wuse II.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Hearth Deck Operator', loc: 'Victoria Island HQ', pay: '₦180,000 / month', desc: 'Regulating oak ember oxygen and managing 420°C high-heat baking.' },
              { title: 'Lead Sourdough Baker', loc: 'Lekki Phase 1', pay: '₦220,000 / month', desc: 'Propagating our 40-year-old wild Biga starter culture and proofing.' },
              { title: 'Delivery Dispatch Partner', loc: 'Ikeja City Mall', pay: '₦120k + bonuses', desc: 'Riding express motorcycle thermal bags inside Lagos Mainland.' }
            ].map((car, i) => (
              <div key={i} className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col justify-between shadow-sm">
                <div className="space-y-2">
                  <span className="text-[10px] bg-red-600/10 text-red-600 px-2 py-0.5 rounded-full font-mono font-bold">{car.loc}</span>
                  <h4 className="font-bold text-neutral-900 text-sm">{car.title}</h4>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">{car.desc}</p>
                </div>
                <div className="pt-4 border-t border-neutral-200/60 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">{car.pay}</span>
                  <button onClick={() => setCareerSuccess(true)} className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] uppercase font-bold rounded">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {careerSuccess && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex gap-2 items-center animate-fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Dough application captured! Our kitchen operations director will schedule your hand-stretching trial shortly.</span>
            </div>
          )}
        </div>
      )}

      {/* 11. LA FAMIGLIA LOYALTY CLUB */}
      {activePageId === 'loyalty' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">La Famiglia Rewards</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Loyalty Club</h2>
            <p className="text-neutral-500 text-xs">Accumulate points on wood-fired family orders and unlock free sourdough margheritas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Punch Card */}
            <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-amber-500 font-mono text-[10px] uppercase font-bold">Virtual Pizzeria Punchcard</span>
                  <h3 className="font-serif text-lg font-bold">Buy 10, Get 1 Margherita Free</h3>
                </div>
                <span className="text-2xl">🍕</span>
              </div>

              <div className="grid grid-cols-5 gap-3.5">
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <div key={num} className="aspect-square bg-red-600 rounded-full border border-red-500 flex items-center justify-center font-bold text-xs shadow-md">
                    ✓
                  </div>
                ))}
                {[8, 9, 10].map(num => (
                  <div key={num} className="aspect-square bg-neutral-800 rounded-full border border-neutral-700/60 flex items-center justify-center font-bold text-xs text-neutral-500">
                    {num}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-neutral-400 font-mono pt-2">
                <span>Punches: <strong>7 / 10 Complete</strong></span>
                <span className="text-amber-500">3 more to FREE pizza!</span>
              </div>
            </div>

            {/* Points Catalog */}
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-neutral-500 uppercase font-mono">Your Balance</span>
                  <strong className="text-neutral-900 text-xl font-mono block">{loyaltyPoints} PTS</strong>
                </div>
                <span className="text-xs font-mono bg-amber-500 text-neutral-950 px-2 py-1 rounded font-black">FAMIGLIA GOLD</span>
              </div>

              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500">Unlockable Rewards Catalog</h4>
              {[
                { name: 'Toasted Garlic Herb Bread Focaccia', cost: 1500 },
                { name: 'Rosemary Frizzante Sodas Duo', cost: 2000 },
                { name: '30cm Classic Margherita Sourdough', cost: 4500 }
              ].map((rew, i) => (
                <div key={i} className="p-3 bg-white border border-neutral-200 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-neutral-800 block">{rew.name}</span>
                    <span className="text-neutral-500 font-mono text-[10px]">{rew.cost} Points required</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (loyaltyPoints >= rew.cost) {
                        setLoyaltyPoints(loyaltyPoints - rew.cost);
                        setLoyaltySuccessMsg(`✓ Successfully redeemed: ${rew.name}! Promo code dispatched.`);
                      } else {
                        alert('Insufficient loyalty rewards points.');
                      }
                    }}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] uppercase font-bold rounded"
                  >
                    Redeem
                  </button>
                </div>
              ))}

              {loyaltySuccessMsg && (
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-lg font-mono">
                  {loyaltySuccessMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 12. DOUGH FOR GOOD CSR */}
      {activePageId === 'csr' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Food Sharing Chronicles</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Dough for Good</h2>
            <p className="text-neutral-500 text-xs">Our ongoing community program donating sourdough flour pouches and sharing warm pizzas in Nigeria.</p>
          </div>

          <div className="space-y-6 bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200">
            <div>
              <span className="text-neutral-500 text-[10px] uppercase font-mono">Goal: 1,000,000 Loaves Distributed</span>
              <div className="flex justify-between items-center text-xs font-mono font-bold text-red-600 mb-2">
                <span>845,000 Loaves Shared ✓</span>
                <span>84.5%</span>
              </div>
              <div className="w-full bg-neutral-200 h-3 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full transition-all duration-1000" style={{ width: '84.5%' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200/60">
              <div className="space-y-2 text-xs leading-relaxed text-neutral-600">
                <h4 className="font-bold text-neutral-900 text-sm">Flour Sourcing Support</h4>
                <p>
                  Every time we import soft wheat containers from Naples, we partition 10% of the flour cargo, donating it to local culinary training guilds inside Lagos Mainland and Abuja suburbs to promote baking micro-enterprises.
                </p>
              </div>
              <div className="space-y-2 text-xs leading-relaxed text-neutral-600">
                <h4 className="font-bold text-neutral-900 text-sm">Saturday Sharing Feasts</h4>
                <p>
                  Our hub outlets inside Wuse II and Lekki prepare 50 fresh wood-fired Margherita pizzas every Saturday afternoon specifically for sharing with local orphanage homes and street children.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. MEDIA PRESS ARCHIVES */}
      {activePageId === 'press' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Editorial Brand Archives</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Press & Media Kit</h2>
            <p className="text-neutral-500 text-xs">Official brand publications, mill contractual agreements, and media resource folders.</p>
          </div>

          <div className="space-y-4">
            {[
              { title: "Panarottis Nigeria Signs soft Campania Tipo 00 Wheat Import Deal", date: "June 24, 2026", desc: "Our parent holding company OFRNL completed master relationship negotiations with cooperative grain mills in Naples to guarantee supply lines of low-ash high absorption baking wheat straight into Lagos ports." },
              { title: "Sourdough Masterclass Series Expands to Saturday Morning Bookings", date: "May 12, 2026", desc: "In response to massive diner interest in bread science, Chef Giovanni Rossi introduced weekend fermentation courses inside Victoria Island teaching yeast pH biology andCanotto stretching." },
              { title: "Lagos Admiralty Way Stone Dome Oven Construction Milestone Met", date: "April 02, 2026", desc: "Volcanic materials hand-assembled by Neapolitan engineers completed on-site thermal stress test, sustaining uniform 420°C temperatures without dome draft leakage." }
            ].map((pr, idx) => (
              <div key={idx} className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2">
                <span className="text-[10px] text-neutral-400 font-mono">{pr.date}</span>
                <h4 className="font-bold text-neutral-900 text-base font-serif">{pr.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed italic">{pr.desc}</p>
                <button onClick={() => alert(`✓ Brand PDF copy of press release "${pr.title}" downloaded!`)} className="text-[10px] text-red-600 hover:text-red-700 font-mono font-bold uppercase tracking-wider flex items-center gap-1 pt-1">
                  Download Full Press PDF →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14. HEARTH LIVE WEBCAMS */}
      {activePageId === 'webcam' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Live Stone Deck Monitoring</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Live Oven Webcams</h2>
            <p className="text-neutral-500 text-xs">Simulated live feed from our active wood-fired decks inside Victoria Island and Lekki.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Visual Screen */}
            <div className="md:col-span-8 space-y-3">
              <div className="aspect-video bg-neutral-950 rounded-3xl border border-neutral-900 relative overflow-hidden flex items-center justify-center shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800')] bg-cover opacity-35 bg-center animate-pulse" />
                <div className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[9px] px-2.5 py-1 rounded-full uppercase font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white block" /> LIVE FEED
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-mono text-neutral-300">
                  VI HQ - DECK 1 • {new Date().toLocaleTimeString()}
                </div>
                <div className="text-center space-y-2 relative z-10 text-white p-6 bg-black/60 backdrop-blur-sm rounded-2xl border border-neutral-800">
                  <Flame className="w-8 h-8 text-red-500 animate-bounce mx-auto" />
                  <p className="text-xs font-mono">Baking active sourdough margheritas under thermal stability.</p>
                </div>
              </div>
              <p className="text-[10px] text-neutral-500 text-center italic font-mono">Camera refresh rate: 5s. Staged photo streams simulating baking activities.</p>
            </div>

            {/* Live Logs */}
            <div className="md:col-span-4 bg-neutral-900 text-white p-6 rounded-2xl border border-neutral-800 space-y-4 shadow-inner">
              <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest block font-bold">Heuristic Oven Logs</span>
              <div className="space-y-3 text-[10px] font-mono text-neutral-300 leading-relaxed">
                {webcamLogs.map((log, i) => (
                  <div key={i} className="flex gap-2 items-start border-b border-neutral-800/80 pb-2">
                    <span className="text-emerald-500">⚡</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 15. SOURDOUGH RECIPES (recipe-biga, recipe-sauce, recipe-hearth, recipe-spotting) */}
      {activePageId.startsWith('recipe-') && (
        <div className="space-y-8 max-w-3xl mx-auto">
          {activePageId === 'recipe-biga' && (
            <div className="space-y-6">
              <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Italian Recipes</span>
              <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Mastering Sourdough Biga Starter</h2>
              <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" alt="Dough biga" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div><strong>Flour hydration:</strong> 65% mineral water</div>
                <div><strong>Fermentation proofing:</strong> 36 Hours at 4°C</div>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <h4 className="font-serif font-bold text-neutral-900 text-base">Step 1: Inoculation & Kneading</h4>
                <p>Combine soft Campania Tipo 00 flour with mineral water and 40-year starter culture. Knead until a loose gluten mesh forms. Seal in proofing vaults.</p>
                <h4 className="font-serif font-bold text-neutral-900 text-base">Step 2: Thermal Proofing</h4>
                <p>Store proofing chambers at exactly 4°C refrigeration parameters for 36 hours. This enables the lactobacilli to release sweet lactic acids and pre-digest wheat sugars.</p>
              </div>
            </div>
          )}

          {activePageId === 'recipe-sauce' && (
            <div className="space-y-6">
              <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Italian Recipes</span>
              <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">San Marzano Tomato Sauce Guide</h2>
              <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200">
                <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" alt="Tomatoes" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <h4 className="font-serif font-bold text-neutral-900 text-base">Ingredients Matrix</h4>
                <p>1 can San Marzano whole peeled plum tomatoes, 5g fine sea salt, 4 sweet basil leaves, 10ml extra virgin olive oil. No canned garlic or processed sugars!</p>
                <h4 className="font-serif font-bold text-neutral-900 text-base">Step-by-step Simmer</h4>
                <p>Squeeze pomodoros gently by hand to separate structural fibers. Dissolve salt crystals evenly. Top with hand-torn basil and oils. Adjust organic acidity levels to 4.2 pH.</p>
              </div>
            </div>
          )}

          {activePageId === 'recipe-hearth' && (
            <div className="space-y-6">
              <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Italian Recipes</span>
              <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Oven-Deck Thermodynamics</h2>
              <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800" alt="Baking oven" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <h4 className="font-serif font-bold text-neutral-900 text-base">Wood Combustion Science</h4>
                <p>Achieve heat saturation over 420°C using dry oak logs. Wood embers must occupy the left inner perimeter of volcanic stone brick floors to generate heat convection currents.</p>
                <h4 className="font-serif font-bold text-neutral-900 text-base">The 90-Second Flash Bake</h4>
                <p>Peel raw dough gently onto perforated aluminum boards. Turn 180° after exactly 45 seconds using circular scraper peels. Dom dome heat flash melts mozzarella without toughing proteins.</p>
              </div>
            </div>
          )}

          {activePageId === 'recipe-spotting' && (
            <div className="space-y-6">
              <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Italian Recipes</span>
              <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Mastering Leopard Spotting</h2>
              <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200">
                <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800" alt="Leopard spotting" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <h4 className="font-serif font-bold text-neutral-900 text-base">The Physics of Gaseous Rims (Canotto)</h4>
                <p>Stretching requires hand-pressing carbon pockets from the center outwards to the rims. Do not roll or squeeze edges! Trapped pockets expand under intense 420°C heat, producing thin carbonized charred bubbles (spots).</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 16. CHRONICLE MILESTONES (milestone-1, milestone-2, milestone-3) */}
      {activePageId.startsWith('milestone-') && (
        <div className="space-y-8 max-w-3xl mx-auto">
          {activePageId === 'milestone-1' && (
            <div className="space-y-5">
              <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Pizzeria Chronicles</span>
              <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Campania Flour Sourcing SPEC</h2>
              <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200">
                <img src="https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=800" alt="Wheat field" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                We secured exclusive supply agreements with small-holder family mills operating on Campania volcanic soils. This refined soft wheat is milled down to the precise Tipo 00 specification, protecting elastic gluten properties that allow us to achieve high-hydration dough formulas.
              </p>
            </div>
          )}

          {activePageId === 'milestone-2' && (
            <div className="space-y-5">
              <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Pizzeria Chronicles</span>
              <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">The 40-Year Biga Starter Heritage</h2>
              <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" alt="Biga starter jars" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Nurtured since our original pizzerias, our Biga starter culture has been fed mineral spring water and soft flour daily at strict 4.2 pH parameters. This pre-digests gluten matrix molecules, ensuring that our Nigerian diners enjoy completely bloating-free pizzas.
              </p>
            </div>
          )}

          {activePageId === 'milestone-3' && (
            <div className="space-y-5">
              <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Pizzeria Chronicles</span>
              <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Volcanic Stone Deck Construction logs</h2>
              <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200">
                <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800" alt="Oven building" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                To achieve Neapolitan heat levels inside Lagos VI and Wuse II Abuja, we hand-assembled volcanic sand brick deck dome ovens. High heat absorption capacity radiating from the thick floor is the secret behind our 90-second wood flash-baking cycle.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 17. STORE LOCATION HUBS (store-lekki, store-ikeja, store-wuse, store-vi, store-ph) */}
      {activePageId.startsWith('store-') && (
        <div className="space-y-8 max-w-3xl mx-auto">
          {(() => {
            const locId = activePageId.replace('store-', '');
            const matchingStore = panStores.find(s => s.id === locId) || panStores[0];
            return (
              <div className="space-y-6">
                <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Active Store Hub Location</span>
                <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">{matchingStore.name}</h2>
                <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200">
                  <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" alt="Store view" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed border-l-2 border-red-500 pl-4 italic">
                  Address: {matchingStore.address}
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div><strong>Opening Hours:</strong> {matchingStore.openingHours}</div>
                  <div><strong>Direct Phone:</strong> {matchingStore.phone}</div>
                </div>
                <button onClick={() => alert(`✓ Direct GPS route coordinates for ${matchingStore.name} pinned to clipboard!`)} className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors">
                  Get Live Route Coordinates GPS
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* 18. MASTERCLASSES OVERVIEW PAGE */}
      {activePageId === 'masterclasses' && (
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black">Saturday Sourdough Academy</span>
            <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Masterclass Academy</h2>
            <p className="text-neutral-500 text-xs">Learn yeast biology, Canotto stretching, and volcanic deck baking from our head pizzaiolos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'fermentation', title: 'Yeast Biology & proofing', price: '₦15,000', desc: 'Acidity variables, mineral properties of water, starch breakdown.' },
              { id: 'stretching', title: 'Canotto Hand Stretching', price: '₦18,000', desc: 'Squeezing carbon pockets, Neapolitan slap rotations, rim shapes.' },
              { id: 'sauces', title: 'San Marzano Sauces', price: '₦14,000', desc: 'Hand-sieving plum pomodoros, olive oil emulsion adjustments.' }
            ].map((mc, i) => (
              <div key={i} className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col justify-between shadow-sm">
                <div className="space-y-2">
                  <span className="text-red-600 font-mono text-[10px] uppercase font-bold">{mc.price}</span>
                  <h4 className="font-bold text-neutral-900 text-sm">{mc.title}</h4>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">{mc.desc}</p>
                </div>
                <button 
                  onClick={() => onNavigatePage(`masterclass-${mc.id}`)}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] uppercase font-bold rounded mt-4"
                >
                  Enter Course Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 19. MASTERCLASS MODULES (masterclass-fermentation, masterclass-stretching, masterclass-sauces) */}
      {activePageId.startsWith('masterclass-') && (
        <div className="space-y-8 max-w-3xl mx-auto">
          {(() => {
            const modId = activePageId.replace('masterclass-', '');
            let modTitle = 'Yeast Biology & Proofing';
            let modPrice = '₦15,000';
            let modSyllabus = "Hour 1: Gluten micro-mesh structure. Hour 2: Acidity and pH targets. Hour 3: Cold decking at 4°C parameters.";
            if (modId === 'stretching') {
              modTitle = 'Canotto Hand Stretching';
              modPrice = '₦18,000';
              modSyllabus = "Hour 1: Squeezing carbon pockets gently. Hour 2: The Neapolitan slap technique. Hour 3: Sliding peels onto stone.";
            } else if (modId === 'sauces') {
              modTitle = 'San Marzano Sauces & Topping Logic';
              modPrice = '₦14,000';
              modSyllabus = "Hour 1: Acid profile of Campania volcanic tomatoes. Hour 2: Mozzarella water draining. Hour 3: Stacking weight formulas.";
            }

            return (
              <div className="space-y-6">
                <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Academy Module Detail</span>
                <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">{modTitle}</h2>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between font-mono text-xs font-bold text-neutral-700">
                  <span>Price: {modPrice}</span>
                  <span>Instructors: Chef Giovanni Rossi</span>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-neutral-950 font-serif">Curriculum Hours Structure:</h4>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed border-l-2 border-red-200 pl-4 italic">
                    {modSyllabus}
                  </p>
                </div>
                <button onClick={() => alert(`✓ Academy spot booked for module "${modTitle}"!`)} className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors">
                  Reserve Academy Seat
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* 20. PRODUCTS DETAILS (menu-item-1 to menu-item-7) */}
      {activePageId.startsWith('menu-item-') && (
        <div className="space-y-8 max-w-3xl mx-auto">
          {(() => {
            const idx = Number(activePageId.replace('menu-item-', '')) - 1;
            const item = panMenu[idx] || panMenu[0];
            return (
              <div className="space-y-6">
                <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Dynamic Product detail</span>
                <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">{item.name}</h2>
                <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed border-l-2 border-red-500 pl-4 italic">
                  "{item.description}"
                </p>
                <div className="grid grid-cols-3 gap-4 text-xs font-mono bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div><strong>Price:</strong> ₦{item.price.toLocaleString()}</div>
                  <div><strong>Prep Time:</strong> {item.prepTime} Mins</div>
                  <div><strong>Dough Hydration:</strong> 65%</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      onAddToCart(item, 1);
                      alert(`✓ Added 1 x ${item.name} to plate!`);
                    }}
                    className="py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors"
                  >
                    Add standard to plate 🍕
                  </button>
                  <button 
                    onClick={() => onOpenCustomizer(item)}
                    className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors"
                  >
                    Customize Options 🛠️
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 21. LEGAL & COMPLIANCE (privacy, terms) */}
      {activePageId === 'privacy' && (
        <div className="space-y-6 max-w-3xl mx-auto text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
          <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Pizzeria Compliance</span>
          <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Privacy & Cookie Protection Policy</h2>
          <p>
            Your trust regarding credit transactions, address details, and personal names is crucial to us. All checkout information is stored using secure browser keys and routed safely directly to our parent holding company's private database.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm mt-4 uppercase font-mono">Cookie Compliance Statement</h4>
          <p>
            We use localized small storage files specifically to remember items placed in your pizza basket and keep track of your saturday masterclass options. No third-party analytical cookies are ever sold.
          </p>
        </div>
      )}

      {activePageId === 'terms' && (
        <div className="space-y-6 max-w-3xl mx-auto text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
          <span className="text-red-600 font-mono text-xs uppercase tracking-widest font-black block">Pizzeria Compliance</span>
          <h2 className="text-3xl font-serif font-black text-neutral-900 leading-tight">Terms of Service SLAs</h2>
          <p>
            Welcome to Panarottis Pizza Nigeria (operated by OFRNL). By utilizing our reservation widgets or placing orders into your basket, you explicitly accept our standard dough processing guidelines.
          </p>
          <h4 className="font-bold text-neutral-900 text-sm mt-4 uppercase font-mono">Delivery & Hearth Guarantee</h4>
          <p>
            All delivery logs are dispatched within a 12km radius. If dispatch couriers exceed 45 minutes or your pizza cheese drops below 55°C, you are fully entitled to an immediate replacement voucher. Masterclass tickets are fully cancellable up to 48 hours before class start.
          </p>
        </div>
      )}

    </div>
  );
}
