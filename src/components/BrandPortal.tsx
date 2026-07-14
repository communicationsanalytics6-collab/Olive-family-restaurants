import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, ArrowRight, Clock, Star, Gift, 
  Utensils, MessageSquare, AlertCircle, Sparkles, Newspaper, Phone, Mail, CheckCircle,
  Bike, Shield
} from 'lucide-react';
import { Store, Promo, BlogPost, Feedback, MenuItem } from '../types';
import { SPUR_LOGO, PANAROTTIS_LOGO, OLIVE_FAMILY_LOGO } from '../data/base64Images';

interface BrandPortalProps {
  promos: Promo[];
  blogs: BlogPost[];
  stores: Store[];
  onNavigate: (view: 'portal' | 'spur' | 'panarottis' | 'admin' | 'cart') => void;
  onSubmitFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
}

export default function BrandPortal({
  promos,
  blogs,
  stores,
  onNavigate,
  onSubmitFeedback
}: BrandPortalProps) {
  // Store Locator Filter
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  // Bikers Portal Modal State
  const [showBikersNotice, setShowBikersNotice] = useState(false);

  // Feedback Form State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState<'praise' | 'suggestion' | 'complaint'>('praise');
  const [feedbackBrand, setFeedbackBrand] = useState<'spur' | 'panarottis' | 'general'>('general');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filtered Stores
  const filteredStores = stores.filter(store => {
    const cityMatch = selectedCity === 'All' || store.city === selectedCity;
    const brandMatch = selectedBrand === 'All' || 
                       store.brand === selectedBrand.toLowerCase() || 
                       store.brand === 'both';
    return cityMatch && brandMatch;
  });

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackEmail || !feedbackSubject || !feedbackMsg) return;
    onSubmitFeedback({
      name: feedbackName,
      email: feedbackEmail,
      type: feedbackType,
      brand: feedbackBrand,
      subject: feedbackSubject,
      message: feedbackMsg,
      rating: feedbackRating,
      status: 'open'
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackSubject('');
      setFeedbackMsg('');
      setFeedbackRating(5);
    }, 4000);
  };

  return (
    <div id="brand-portal" className="relative bg-[#050505] text-neutral-100 min-h-screen font-sans overflow-hidden">
      
      {/* Background YouTube Video */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none mix-blend-multiply opacity-25">
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] min-w-full min-h-full object-cover pointer-events-none"
          src="https://www.youtube.com/embed/jC9eb-b-s7U?autoplay=1&mute=1&loop=1&playlist=jC9eb-b-s7U&controls=0&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1"
          title="Background Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>

      {/* Navigation Header */}
      <nav className="bg-white sticky top-0 z-40 border-b border-neutral-200 shadow-md h-24 sm:h-28 md:h-32 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full mx-auto relative flex items-center justify-between h-full">
          
          {/* Left Side: Spur Logo & Locators/Chronicles Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => onNavigate('spur')}
              className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105 duration-200 focus:outline-none"
              title="Enter Spur Steakhouse"
            >
              <img 
                src={SPUR_LOGO} 
                alt="Spur Logo" 
                className="h-8 sm:h-10 md:h-12 lg:h-13 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    const fallback = document.createElement('span');
                    fallback.className = 'font-sans text-xs sm:text-sm font-black text-[#3f4106] tracking-wider uppercase border border-neutral-200 px-2.5 py-1.5 rounded-xl';
                    fallback.innerText = 'SPUR';
                    parent.appendChild(fallback);
                  }
                }}
                referrerPolicy="no-referrer"
              />
            </button>
            
            {/* Desktop Quick Nav Anchors */}
            <div className="hidden lg:flex items-center gap-5 border-l border-neutral-200 pl-5 h-8">
              <a href="#stores" className="text-xs font-mono font-black text-[#3f4106] hover:text-[#eaa522] transition-colors uppercase tracking-widest">
                Locators
              </a>
              <a href="#blogs" className="text-xs font-mono font-black text-[#3f4106] hover:text-[#eaa522] transition-colors uppercase tracking-widest">
                Chronicles
              </a>
            </div>
          </div>

          {/* Center: Centered Overlapping Olive Family Logo Box */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 z-50">
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white border-x border-b border-neutral-200 rounded-b-[2rem] shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-8 md:px-10 flex flex-col items-center justify-center cursor-pointer group w-28 xs:w-32 sm:w-40 md:w-44 lg:w-52 h-28 sm:h-36 md:h-40 lg:h-44"
              title="Back to Top"
            >
              <img 
                src={OLIVE_FAMILY_LOGO} 
                alt="Olive Family Logo" 
                className="h-22 xs:h-25 sm:h-30 md:h-34 lg:h-38 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    const fallback = document.createElement('span');
                    fallback.className = 'font-sans text-[10px] sm:text-xs font-black text-[#3f4106] text-center tracking-wider uppercase';
                    fallback.innerText = 'OLIVE FAMILY';
                    parent.appendChild(fallback);
                  }
                }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Side: Navigation actions & Panarottis Logo */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Desktop/Tablet Utility Actions */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Bike Icon (Bikers Portal) */}
              <button 
                onClick={() => setShowBikersNotice(true)}
                className="relative p-2 text-neutral-600 hover:text-[#eaa522] hover:bg-neutral-100 rounded-full transition-all group flex items-center justify-center cursor-pointer"
                title="Bikers Dispatch Portal"
              >
                <Bike className="w-5 h-5 text-[#3f4106] hover:scale-110 duration-200" />
                <span className="absolute -bottom-10 scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 whitespace-nowrap font-mono z-50 shadow-lg">
                  Bikers Portal
                </span>
              </button>

              {/* Shield Icon (Admin Login) */}
              <button 
                onClick={() => onNavigate('admin')}
                className="relative p-2 text-neutral-600 hover:text-[#3f4106] hover:bg-neutral-100 rounded-full transition-all group flex items-center justify-center cursor-pointer"
                title="Admin Control Center"
              >
                <Shield className="w-5 h-5 text-[#eaa522] hover:scale-110 duration-200" />
                <span className="absolute -bottom-10 scale-0 transition-all rounded bg-neutral-900 px-2 py-1 text-[10px] text-white group-hover:scale-100 whitespace-nowrap font-mono z-50 shadow-lg">
                  Admin Login
                </span>
              </button>
            </div>

            {/* Panarottis Logo */}
            <div className="border-l border-neutral-200 pl-4 sm:pl-6 h-8 flex items-center">
              <button 
                onClick={() => onNavigate('panarottis')}
                className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105 duration-200 focus:outline-none"
                title="Enter Panarottis Pizza"
              >
                <img 
                  src={PANAROTTIS_LOGO} 
                  alt="Panarottis Logo" 
                  className="h-8 sm:h-10 md:h-12 lg:h-13 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'font-sans text-xs sm:text-sm font-black text-red-600 tracking-wider uppercase border border-neutral-200 px-2.5 py-1.5 rounded-xl';
                      fallback.innerText = 'PANAROTTIS';
                      parent.appendChild(fallback);
                    }
                  }}
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>

          </div>

        </div>
      </nav>
      
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-[#3f4106]/40 bg-gradient-to-b from-[#3f4106]/15 via-[#050505] to-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,165,34,0.12),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl font-sans font-black tracking-tight text-white mb-6 leading-tight uppercase"
          >
            One Rich Heritage. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eaa522] via-yellow-400 to-[#eaa522]">
              Two Exceptional Flavors.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-neutral-300 text-base sm:text-lg mb-12 leading-relaxed"
          >
            Welcome to the official portal of Spur Steak Ranches & Panarottis Pizza in Nigeria. 
            From sizzling rustic coal-fired steaks to vibrant wood-fired contemporary Italian pizzas, 
            experience premium culinary craft under one master ecosystem.
          </motion.p>
        </div>
      </section>

      {/* Brand Selector Cards (Side-by-Side Journey) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          
          {/* SPUR CARD */}
          <motion.div 
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="relative group rounded-3xl overflow-hidden border border-neutral-850 bg-gradient-to-b from-neutral-900 to-neutral-950 flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
            
            {/* Background image on hover */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="p-8 sm:p-12 relative z-20 flex-grow">
              <div className="w-16 h-16 rounded-2xl bg-[#3f4106]/20 border border-[#3f4106]/40 flex items-center justify-center mb-6">
                <Utensils className="w-8 h-8 text-[#eaa522]" />
              </div>
              <span className="text-[#eaa522] font-mono tracking-widest text-xs uppercase font-bold">Warm • Rustic • Family-Oriented</span>
              <h2 className="text-3xl font-bold text-white mt-3 mb-4 font-sans tracking-tight">Spur Steak Ranches</h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                Savor our legendary flame-grilled steaks, sticky pork ribs, giant delicious cheddar melt burgers, 
                and crispy onion rings. Crafted with heart and creativity to unite the family around the grill.
              </p>
              
              <ul className="space-y-2 mb-8 text-neutral-400 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#eaa522]" /> Prime South African Cut Steaks (500g+)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#eaa522]" /> Legend 1967 BBQ Basting Secret
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#eaa522]" /> Interactive Play Area and Booking
                </li>
              </ul>
            </div>

            <div className="p-8 sm:p-12 pt-0 relative z-20">
              <button 
                onClick={() => onNavigate('spur')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#eaa522] hover:bg-[#eaa522]/90 text-neutral-950 font-bold transition-all transform group-hover:scale-[1.02] cursor-pointer"
              >
                Enter Spur Steakhouse <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* PANAROTTIS CARD */}
          <motion.div 
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="relative group rounded-3xl overflow-hidden border border-neutral-850 bg-gradient-to-b from-neutral-900 to-neutral-950 flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
            
            {/* Background image on hover */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="p-8 sm:p-12 relative z-20 flex-grow">
              <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-6">
                <Utensils className="w-8 h-8 text-red-500" />
              </div>
              <span className="text-red-500 font-mono tracking-widest text-xs uppercase font-semibold">Vibrant • Contemporary • Energetic</span>
              <h2 className="text-3xl font-bold text-white mt-3 mb-4 font-sans tracking-tight">Panarottis Pizza & Pasta</h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                Authentic 36-hour slow-fermented sourdough crusts, bubbling gourmet sea-to-board toppings, 
                and rich creamy fettuccine bowls basted in Italian parmesan. Energetic, Italian, and loaded with love.
              </p>
              
              <ul className="space-y-2 mb-8 text-neutral-400 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500" /> 36-Hour Sourdough Fermentation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500" /> Wood-Fired Traditional Italian Ovens
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500" /> Extravagant Bottomless Pasta Bowls
                </li>
              </ul>
            </div>

            <div className="p-8 sm:p-12 pt-0 relative z-20">
              <button 
                onClick={() => onNavigate('panarottis')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all transform group-hover:scale-[1.02] cursor-pointer"
              >
                Enter Panarottis Italian <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Dynamic Adverts & Promotional CMS Banners */}
      <section className="bg-[#0a0b06] border-t border-b border-[#3f4106]/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#eaa522] font-mono text-xs uppercase tracking-wider font-bold">CMS Managed Ads</span>
              <h2 className="text-3xl font-black text-white mt-1 uppercase tracking-tight">Deals & Limited-Time Offers</h2>
            </div>
            <p className="text-neutral-400 max-w-md mt-2 md:mt-0 text-sm">
              Use these exclusive promo codes at checkout on the respective brand pages to redeem premium discounts!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {promos.filter(p => p.isBannerActive).map((promo, idx) => (
              <motion.div 
                key={promo.id}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl overflow-hidden border border-[#3f4106]/40 bg-[#050505] flex flex-col justify-between"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover object-center" />
                  <div className="absolute top-4 right-4 bg-[#eaa522] text-neutral-950 font-mono font-black text-xs px-3 py-1 rounded-full">
                    {promo.discountPercent}% OFF
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-mono uppercase font-bold ${
                      promo.brand === 'spur' ? 'bg-[#eaa522] text-neutral-950' : 
                      promo.brand === 'panarottis' ? 'bg-red-650 text-white' : 'bg-[#3f4106] text-[#eaa522]'
                    }`}>
                      {promo.brand === 'both' ? 'Unified Deal' : `${promo.brand}`}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{promo.title}</h3>
                    <p className="text-neutral-300 text-xs sm:text-sm line-clamp-3 mb-4">{promo.description}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-[#3f4106]/35 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 text-[10px] block uppercase font-mono font-bold">Use Promo Code</span>
                      <span className="text-[#eaa522] font-mono font-black text-sm tracking-wider select-all cursor-pointer">{promo.code}</span>
                    </div>
                    <button 
                      onClick={() => onNavigate(promo.brand === 'panarottis' ? 'panarottis' : 'spur')}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-[#3f4106] hover:bg-[#3f4106]/80 text-[#eaa522] flex items-center gap-1.5 transition-colors cursor-pointer border border-[#eaa522]/20"
                    >
                      Claim Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Store Locator Section */}
      <section id="stores" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[#eaa522] font-mono text-xs uppercase tracking-wider font-bold">Nigeria Network Map</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 uppercase tracking-tight">Smart Store Locator</h2>
          <p className="text-neutral-300 max-w-xl mx-auto text-sm sm:text-base mt-2">
            Find details, operating hours, and location routing for our premium steak ranches and pizzerias in Lagos and Abuja.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <div className="flex items-center gap-2 bg-[#0a0b06] px-3.5 py-2 rounded-xl border border-[#3f4106]/60">
              <span className="text-xs text-neutral-400 font-mono font-bold">City:</span>
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-sm text-[#eaa522] font-bold border-none focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#050505]">All Cities</option>
                <option value="Lagos" className="bg-[#050505]">Lagos</option>
                <option value="Abuja" className="bg-[#050505]">Abuja</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#0a0b06] px-3.5 py-2 rounded-xl border border-[#3f4106]/60">
              <span className="text-xs text-neutral-400 font-mono font-bold">Brand:</span>
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-transparent text-sm text-[#eaa522] font-bold border-none focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#050505]">All Brands</option>
                <option value="Spur" className="bg-[#050505]">Spur Steakhouse</option>
                <option value="Panarottis" className="bg-[#050505]">Panarottis Pizza</option>
              </select>
            </div>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => (
            <div 
              key={store.id} 
              className="rounded-2xl border border-[#3f4106]/40 bg-[#050505] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono uppercase font-bold ${
                    store.brand === 'spur' ? 'bg-[#eaa522]/10 text-[#eaa522] border border-[#eaa522]/30' : 
                    store.brand === 'panarottis' ? 'bg-red-650/10 text-red-500 border border-red-650/30' : 
                    'bg-[#eaa522]/10 text-[#eaa522] border border-[#eaa522]/30'
                  }`}>
                    {store.brand === 'both' ? 'Spur & Panarottis Combo' : store.brand}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#eaa522]" /> {store.city}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{store.name}</h3>
                <p className="text-neutral-300 text-xs leading-relaxed mb-4">{store.address}</p>

                <div className="space-y-2 text-xs text-neutral-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#eaa522]" />
                    <span>{store.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#eaa522]" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#eaa522]" />
                    <span>{store.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#3f4106]/30 flex gap-2">
                <button 
                  onClick={() => onNavigate(store.brand === 'panarottis' ? 'panarottis' : 'spur')}
                  className="w-full py-2 px-3 text-center rounded-lg bg-[#3f4106] hover:bg-[#3f4106]/80 text-[#eaa522] border border-[#eaa522]/10 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  Go to Menu <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {filteredStores.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-[#3f4106]/40 rounded-2xl bg-[#0a0b06]/20 text-neutral-500">
              No store locations matching the selected filters were found.
            </div>
          )}
        </div>
      </section>

      {/* Unified News & Blog Feed */}
      <section id="blogs" className="bg-[#0a0b06] border-t border-b border-[#3f4106]/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#eaa522] font-mono text-xs uppercase tracking-wider font-bold">CMS Articles & Kitchen Secrets</span>
              <h2 className="text-3xl font-black text-white mt-1 uppercase tracking-tight">Our Latest News & Blogs</h2>
            </div>
            <p className="text-neutral-300 max-w-sm mt-2 md:mt-0 text-sm">
              Discover culinary recipes, community CSR reports, launch insights, and chef tips straight from our Nigerian teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.filter(b => b.isPublished).slice(0, 3).map(post => (
              <article key={post.id} className="rounded-2xl overflow-hidden border border-[#3f4106]/40 bg-[#050505] flex flex-col justify-between shadow-md hover:shadow-xl duration-200">
                <div className="h-48 overflow-hidden relative">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover object-center" />
                  {post.isFeatured && (
                    <span className="absolute top-4 left-4 bg-[#eaa522] text-neutral-950 font-black font-mono text-[9px] px-2.5 py-1 rounded uppercase">
                      Featured
                    </span>
                  )}
                  <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    {post.readingTime}
                  </span>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs text-neutral-500 mb-3 font-mono font-semibold">
                      <span className="text-[#eaa522]">{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white mb-3 line-clamp-2 uppercase tracking-tight">{post.title}</h3>
                    <p className="text-neutral-300 text-xs sm:text-sm line-clamp-4 leading-relaxed mb-6">{post.content}</p>
                  </div>

                  <div className="pt-4 border-t border-[#3f4106]/35 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">By <strong className="text-neutral-200">{post.author}</strong></span>
                    <span className={`px-2 py-0.5 rounded uppercase font-mono font-bold text-[10px] ${
                      post.brand === 'spur' ? 'text-[#eaa522]' : 
                      post.brand === 'panarottis' ? 'text-red-500' : 'text-neutral-400'
                    }`}>
                      {post.brand}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Feedback & Complaint Center (Secure Audit Trail) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-[#3f4106]/30 border border-[#eaa522]/35 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#eaa522]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <span className="text-[#eaa522] font-mono text-xs uppercase tracking-wider font-bold">Customer Experience Gateway</span>
          <h2 className="text-3xl font-black text-white mt-1 uppercase tracking-tight">Feedback & Complaint Lodging</h2>
          <p className="text-neutral-300 text-sm mt-2">
            Your reviews are routed directly to our brand directors. We commit to a 24-hour SLA response for resolved actions.
          </p>
        </div>

        <div className="rounded-3xl border border-[#3f4106]/40 bg-gradient-to-b from-[#0a0b06] to-[#050505] p-6 sm:p-10">
          {isSubmitted ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Feedback Securely Logged</h3>
              <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
                Thank you! Your feedback has been safely logged in our central database, with audit ID <strong className="text-amber-400 font-mono">FEED-{Math.floor(1000 + Math.random() * 9000)}</strong>. 
                Our compliance team has been notified.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={feedbackName} 
                    onChange={e => setFeedbackName(e.target.value)}
                    placeholder="Enter your name" 
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={feedbackEmail} 
                    onChange={e => setFeedbackEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Feedback Category</label>
                  <select 
                    value={feedbackType} 
                    onChange={e => setFeedbackType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="praise">Praise & Recommendation</option>
                    <option value="suggestion">Improvement Suggestion</option>
                    <option value="complaint">Service Complaint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Relates To</label>
                  <select 
                    value={feedbackBrand} 
                    onChange={e => setFeedbackBrand(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="general">Olive Foods Group (General)</option>
                    <option value="spur">Spur Steak Ranches</option>
                    <option value="panarottis">Panarottis Pizza</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Subject</label>
                <input 
                  type="text" 
                  required
                  value={feedbackSubject} 
                  onChange={e => setFeedbackSubject(e.target.value)}
                  placeholder="Summary of your experience" 
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Your Message</label>
                <textarea 
                  required
                  rows={4}
                  value={feedbackMsg} 
                  onChange={e => setFeedbackMsg(e.target.value)}
                  placeholder="Provide details of your visit, staff, order ID, or branch name..." 
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-[#3f4106]/40 text-white placeholder-neutral-600 focus:outline-none focus:border-[#eaa522] focus:ring-1 focus:ring-[#eaa522] text-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-400 font-mono">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        type="button"
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className="p-0.5 focus:outline-none"
                      >
                        <Star className={`w-5 h-5 ${star <= feedbackRating ? 'text-[#eaa522] fill-[#eaa522]' : 'text-neutral-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="px-6 py-3 bg-[#eaa522] hover:bg-[#eaa522]/90 text-neutral-950 font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer Details */}
      <footer className="border-t border-[#3f4106]/40 bg-[#050505] py-12 px-4 text-center text-neutral-500 text-xs">
        <p className="mb-2">© 2026 Olive Family Restaurants Nigeria Ltd. All Rights Reserved.</p>
        <p className="max-w-md mx-auto leading-relaxed mb-4">
          Spur Steak Ranches Nigeria and Panarottis Pizza Nigeria are operated under master franchise licenses by OFRNL. 
          Locations in Lagos (Victoria Island, Lekki, Ikeja) and Abuja (Wuse II).
        </p>
        <div className="flex justify-center gap-4 text-neutral-600">
          <button 
            onClick={() => onNavigate('admin')} 
            className="hover:text-[#eaa522] transition-colors flex items-center gap-1 font-mono uppercase tracking-wider text-[10px]"
          >
            🔑 Employee Secure Portal / Admin Hub
          </button>
        </div>
      </footer>

      {/* Bikers Portal Request Modal */}
      <AnimatePresence>
        {showBikersNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#050505] border border-[#3f4106]/50 rounded-3xl p-8 text-center text-white shadow-2xl"
            >
              <div className="w-20 h-20 bg-[#3f4106]/35 border border-[#eaa522]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🏍️</span>
              </div>
              
              <h3 className="text-2xl font-black mb-2 text-white font-sans uppercase tracking-tight">Bikers Dispatch Portal</h3>
              <span className="text-xs font-mono text-[#eaa522] uppercase tracking-widest font-bold block mb-4">PREMIUM ADD-ON MODULE</span>
              
              <p className="text-neutral-300 text-sm leading-relaxed mb-6 bg-black/60 p-4 rounded-2xl border border-[#3f4106]/45">
                This feature is <strong className="text-white font-extrabold">available on request</strong> at <strong className="text-[#eaa522] font-black font-mono">15%</strong> cost of the project total.
              </p>
              
              <p className="text-neutral-400 text-xs leading-relaxed mb-8">
                Please contact the technical operations director or system architect to activate the fleet tracking and delivery dispatch routing services for your franchise.
              </p>
              
              <div className="flex gap-3">
                <a 
                  href="mailto:designmodesolutions@gmail.com?subject=Activate%20Bikers%20Portal%20Add-On"
                  className="flex-1 py-3.5 bg-[#ca1c32] hover:bg-[#ca1c32]/95 text-white font-bold rounded-xl transition-all font-mono text-xs text-center uppercase tracking-wider block"
                >
                  Request Activation
                </a>
                <button 
                  onClick={() => setShowBikersNotice(false)}
                  className="flex-1 py-3.5 bg-[#3f4106] hover:bg-[#3f4106]/85 text-[#eaa522] font-bold rounded-xl transition-all font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
