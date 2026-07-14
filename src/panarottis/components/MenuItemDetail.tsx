import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Star, Heart, Flame, Shield, Award, Sparkles, 
  Clock, Check, Eye, HelpCircle, Utensils, MessageSquare, Plus, ShoppingBag
} from 'lucide-react';
import { MenuItem } from '../../types';

interface MenuItemDetailProps {
  item: MenuItem;
  onBack: () => void;
  onAddToCart: (item: MenuItem, qty: number) => void;
  onOpenCustomizer: (item: MenuItem) => void;
}

export default function MenuItemDetail({
  item,
  onBack,
  onAddToCart,
  onOpenCustomizer
}: MenuItemDetailProps) {
  const [activeSize, setActiveSize] = useState<'Small' | 'Large' | 'Family'>('Large');
  const [activeTab, setActiveTab] = useState<'science' | 'nutrition' | 'reviews'>('science');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Local reviews for this specific item
  const [reviews, setReviews] = useState([
    { name: 'Olamide J.', rating: 5, date: '2026-07-09', comment: 'Hands down the best crust in Lagos. It has those perfect crispy bubbles!' },
    { name: 'Chidi E.', rating: 5, date: '2026-07-05', comment: 'Incredible texture and extremely rich toppings. Arrived steaming hot!' }
  ]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const getPrice = () => {
    let base = item.price;
    if (activeSize === 'Small') base -= 1500;
    if (activeSize === 'Family') base += 4500;
    return base;
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewText) return;
    setReviews([
      {
        name: newReviewName,
        rating: newReviewRating,
        date: new Date().toISOString().split('T')[0],
        comment: newReviewText
      },
      ...reviews
    ]);
    setNewReviewName('');
    setNewReviewText('');
  };

  const pairingSuggestions = [
    { name: 'Frizzante Italian Soda', type: 'Drink', desc: 'Tangy lemon & rosemary bubble lift.', price: '₦1,800' },
    { name: 'Caprese Garlic Focaccia', type: 'Side', desc: 'Fresh basil oil with warm mozzarella.', price: '₦3,200' },
    { name: 'Creamy Mushroom Dip', type: 'Dip', desc: 'Rich gorgonzola & garlic whip.', price: '₦1,200' }
  ];

  const flourScience = {
    hydration: '65% High Absorption Hydration',
    fermentation: '36 Hours Cold Proofing (4°C)',
    yeast: 'Natural Mother Yeast Starter',
    ovenTemp: '420°C Intense Oakwood Flame'
  };

  return (
    <div className="space-y-12">
      {/* Back navigation */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-red-600 text-xs font-mono font-bold uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Pizzeria Menu
      </button>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Beautiful Product Canvas */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden relative border border-neutral-100 bg-neutral-50 shadow-md">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
            />
            {item.isPopular && (
              <span className="absolute top-6 left-6 bg-red-600 text-white font-mono font-bold text-[10px] px-3.5 py-1.5 rounded-full flex items-center gap-1 uppercase shadow-md tracking-wider">
                <Award className="w-4 h-4 fill-white animate-pulse" /> Chef's Masterpiece
              </span>
            )}
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-600 hover:text-red-600 transition-all hover:scale-110"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-neutral-50 border border-neutral-200/60 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-neutral-400 block font-mono uppercase font-bold">Preparation</span>
              <strong className="text-xs text-neutral-800 block">{item.prepTime} Mins Prep</strong>
            </div>
            <div className="bg-neutral-50 border border-neutral-200/60 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-neutral-400 block font-mono uppercase font-bold">Hearth Temp</span>
              <strong className="text-xs text-neutral-800 block">420°C Deck Oven</strong>
            </div>
            <div className="bg-neutral-50 border border-neutral-200/60 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-neutral-400 block font-mono uppercase font-bold">Base Profile</span>
              <strong className="text-xs text-neutral-800 block">Sourdough Biga</strong>
            </div>
          </div>
        </div>

        {/* Right: Detailed Purchasing & Config Engine */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <span className="text-red-600 font-mono text-[11px] uppercase tracking-widest font-black block mb-2">{item.category}</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900 tracking-tight leading-tight">{item.name}</h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex gap-0.5 text-amber-500">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <span className="text-xs font-mono text-neutral-500 font-bold">4.9 ({reviews.length} Gourmet Audits)</span>
            </div>
          </div>

          <p className="text-neutral-600 text-sm leading-relaxed border-l-2 border-red-500 pl-4 italic">
            "{item.description}"
          </p>

          {/* Sizing Toggle Page Element */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider">Select Sharing Size</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Small', 'Large', 'Family'] as const).map((sz) => {
                let label = sz === 'Small' ? '20cm Sourdough' : sz === 'Large' ? '30cm Sharing' : '38cm Colossal';
                let priceMod = sz === 'Small' ? '-₦1,500' : sz === 'Large' ? 'Standard' : '+₦4,500';
                return (
                  <button
                    key={sz}
                    onClick={() => setActiveSize(sz)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      activeSize === sz 
                        ? 'border-red-600 bg-red-50/50 text-red-600 ring-1 ring-red-500 font-bold' 
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <span className="block text-xs font-black">{sz}</span>
                    <span className="block text-[10px] text-neutral-500 leading-tight mt-0.5">{label}</span>
                    <span className="block text-[10px] font-mono text-neutral-400 mt-1">{priceMod}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Hydration Ingredient Popover */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-widest block">Interactive Dough Map</span>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Stone-Ground Wheat Flour', '36hr Ferment', 'Cold Water Hydration', 'Sicily Sea Salt'].map((ing) => (
                <button
                  key={ing}
                  onMouseEnter={() => setShowTooltip(ing)}
                  onMouseLeave={() => setShowTooltip(null)}
                  onClick={() => setShowTooltip(showTooltip === ing ? null : ing)}
                  className="px-3 py-1 bg-white border border-amber-500/20 rounded-full hover:bg-amber-500 hover:text-white transition-all text-[11px] text-neutral-700 relative font-mono"
                >
                  {ing}
                  {showTooltip === ing && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-neutral-900 text-white text-[10px] rounded-xl p-2.5 shadow-xl leading-normal text-center z-30 font-sans">
                      {ing === 'Stone-Ground Wheat Flour' && 'Imported Tipo 00 Italian flour for high-heat elasticity.'}
                      {ing === '36hr Ferment' && 'Unlocks rich carbon dioxide gas pockets, creating airy crispy rims.'}
                      {ing === 'Cold Water Hydration' && '65% pure mountain hydration for maximum dough tenderness.'}
                      {ing === 'Sicily Sea Salt' && 'Unrefined coarse salt to slow down yeast action for full flavor.'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Purchasing Bar */}
          <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 border border-neutral-200 rounded-xl bg-white p-1.5 shadow-inner">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold text-sm"
              >
                －
              </button>
              <span className="w-8 text-center text-xs font-mono font-black text-neutral-800">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold text-sm"
              >
                ＋
              </button>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <span className="text-neutral-500 text-[10px] block uppercase font-mono tracking-wider font-bold">Dynamic Total</span>
                <span className="text-2xl font-mono font-black text-red-600">
                  ₦{(getPrice() * quantity).toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onOpenCustomizer(item)}
                  className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-[10px] rounded-xl uppercase tracking-wider transition-all shadow"
                >
                  Customize
                </button>
                <button
                  onClick={() => {
                    onAddToCart({
                      ...item,
                      id: `${item.id}-${activeSize}`,
                      name: `${item.name} (${activeSize})`,
                      price: getPrice()
                    }, quantity);
                  }}
                  className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-black text-[10px] rounded-xl uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" /> Add Plate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subpage tabs: Science, Nutrition, and Reviews */}
      <div className="border-t border-neutral-200 pt-10">
        <div className="flex border-b border-neutral-100 font-mono text-xs uppercase tracking-wider font-bold mb-6 gap-6">
          {(['science', 'nutrition', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition-all ${
                activeTab === tab 
                  ? 'border-b-2 border-red-600 text-red-600 font-black' 
                  : 'text-neutral-400 hover:text-neutral-800'
              }`}
            >
              {tab === 'science' && 'Sourdough Craft Science'}
              {tab === 'nutrition' && 'Nutritional Metrics'}
              {tab === 'reviews' && `Auditor Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {/* Tab 1: Sourdough Craft Science */}
        {activeTab === 'science' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 font-serif">A Heritage Built on Slow Fermentation</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                We believe in the heritage of slow Neapolitan bread-craft. Unlike fast-food pizzas loaded with industrial yeasts and artificial raising agents, our master bakers cultivate our mother yeast starter and proof the dough at 4°C for exactly 36 hours. 
              </p>
              <p className="text-neutral-600 text-sm leading-relaxed">
                This slow fermentation allows enzymes to pre-digest starches, yielding a light, bubble-rich rim with beautiful "leopard spotting" and unmatched stomach digestability.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200/60 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Fermentation Lab Metrics</h4>
              <div className="space-y-3 font-mono text-xs text-neutral-700">
                <div className="flex justify-between border-b border-neutral-200/50 pb-2">
                  <span>Water Absorption</span>
                  <strong className="text-red-600">{flourScience.hydration}</strong>
                </div>
                <div className="flex justify-between border-b border-neutral-200/50 pb-2">
                  <span>Proofing Program</span>
                  <strong className="text-red-600">{flourScience.fermentation}</strong>
                </div>
                <div className="flex justify-between border-b border-neutral-200/50 pb-2">
                  <span>Dough Starter Culture</span>
                  <strong className="text-red-600">{flourScience.yeast}</strong>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Oven Thermal Deck</span>
                  <strong className="text-red-600">{flourScience.ovenTemp}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Nutritional Metrics */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Calories', val: '840 kcal', pct: '42%' },
                { label: 'Proteins', val: '42g', pct: '84%' },
                { label: 'Carbohydrates', val: '105g', pct: '35%' },
                { label: 'Fats & Lipids', val: '28g', pct: '36%' },
                { label: 'Dietary Fiber', val: '6.5g', pct: '26%' }
              ].map((nut) => (
                <div key={nut.label} className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block mb-1">{nut.label}</span>
                  <strong className="text-lg text-neutral-900 block font-mono">{nut.val}</strong>
                  <div className="h-1 bg-neutral-200 rounded-full mt-2 overflow-hidden w-2/3 mx-auto">
                    <div className="bg-red-500 h-full" style={{ width: nut.pct }} />
                  </div>
                  <span className="text-[9px] text-neutral-400 block mt-1">{nut.pct} Daily Value</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-neutral-500 leading-normal max-w-xl font-mono">
              *Daily values are calculated based on an average 2000 calorie diet. Our sourdough base contains zero artificial trans-fats or added simple sugars. Allergens: Wheat, Gluten, Dairy (Mozzarella). Gluten-free options are baked in the same stone deck.
            </p>
          </div>
        )}

        {/* Tab 3: Detailed Auditor Reviews */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Reviews list */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.map((rev, index) => (
                <div key={index} className="p-5 bg-white border border-neutral-200/60 rounded-2xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-800">{rev.name}</span>
                    <span className="font-mono text-[10px] text-neutral-400">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Leave audit form */}
            <div className="lg:col-span-5 p-6 bg-neutral-50 border border-neutral-200 rounded-2xl">
              <h4 className="font-bold font-serif text-neutral-900 text-sm mb-4">Leave a Dish Audit</h4>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Your Name</label>
                  <input 
                    type="text" required value={newReviewName} onChange={e => setNewReviewName(e.target.value)}
                    placeholder="e.g. Sandra Nwachukwu"
                    className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Audit Rating</label>
                  <select 
                    value={newReviewRating} onChange={e => setNewReviewRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Italian Mastery)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Tasty)</option>
                    <option value={3}>⭐⭐⭐ 3 Stars (Satisfactory)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Review Message</label>
                  <textarea 
                    required rows={3} value={newReviewText} onChange={e => setNewReviewText(e.target.value)}
                    placeholder="Describe your pizza experience (stretch, flavor, heat, toppings)..."
                    className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow">
                  Publish Dish Audit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Wine & Beverage Pairing Carousel */}
      <div className="border-t border-neutral-200 pt-10">
        <div className="mb-6">
          <span className="text-red-600 font-mono text-[9px] uppercase tracking-widest font-black block mb-1">CRAFT PAIRINGS</span>
          <h3 className="font-serif text-xl sm:text-2xl font-black text-neutral-900">Recommended Italian Side Pairing</h3>
          <p className="text-neutral-500 text-xs">Unlock authentic flavor synergies recommended by Chef Giovanni.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pairingSuggestions.map((p) => (
            <div key={p.name} className="p-4 bg-white border border-neutral-100 rounded-2xl flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <span className="text-[9px] font-mono bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-bold inline-block">
                  {p.type}
                </span>
                <h4 className="font-bold text-neutral-900 text-xs">{p.name}</h4>
                <p className="text-neutral-500 text-[10px] leading-relaxed">{p.desc}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-xs font-mono font-bold text-neutral-900 block">{p.price}</span>
                <button 
                  onClick={() => {
                    const pairingItem: MenuItem = {
                      id: `pairing-${p.name.toLowerCase().replace(/\s+/g, '-')}`,
                      name: p.name,
                      description: p.desc,
                      price: parseInt(p.price.replace(/[^\d]/g, '')),
                      category: 'Classic Pizzas',
                      imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=200',
                      brand: 'panarottis',
                      isPopular: false,
                      prepTime: 5
                    };
                    onAddToCart(pairingItem, 1);
                  }}
                  className="mt-1 text-[9px] font-mono font-bold text-red-600 hover:underline uppercase"
                >
                  Add +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
