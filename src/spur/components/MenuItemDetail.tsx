import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Flame, Info, Heart, Shield, Star, Clock, 
  Utensils, Check, Eye, HelpCircle, AlertCircle, Minus, Plus
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
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'Standard' | 'Hungry Hombre' | 'Ranch Legend'>('Standard');
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'reviews'>('details');

  // Multiplier for pricing based on steak size
  const getSizeMultiplier = () => {
    if (selectedSize === 'Hungry Hombre') return 1.35;
    if (selectedSize === 'Ranch Legend') return 1.6;
    return 1.0;
  };

  const currentPrice = Math.round(item.price * getSizeMultiplier());

  const handleAddToBasket = () => {
    const adjustedItem: MenuItem = {
      ...item,
      name: `${item.name} (${selectedSize})`,
      price: currentPrice
    };
    onAddToCart(adjustedItem, qty);
  };

  // Mock nutritional data based on item category
  const getNutrition = () => {
    if (item.category === 'Steaks & Grills') {
      return { calories: 840, protein: '68g', fats: '42g', carbs: '8g', fiber: '2g', sodium: '720mg' };
    }
    if (item.category === 'Burgers') {
      return { calories: 720, protein: '44g', fats: '34g', carbs: '56g', fiber: '4g', sodium: '1100mg' };
    }
    if (item.category === 'Ribs & Wings') {
      return { calories: 1100, protein: '58g', fats: '62g', carbs: '45g', fiber: '3g', sodium: '1420mg' };
    }
    return { calories: 350, protein: '12g', fats: '18g', carbs: '32g', fiber: '5g', sodium: '480mg' };
  };

  const nutrition = getNutrition();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="space-y-8 py-6"
    >
      {/* Navigation and Back Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-amber-700 hover:text-amber-600 font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Spur Menu
        </button>
        <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full uppercase font-bold">
          Spur Legend Series
        </span>
      </div>

      {/* Main Grid: Image & Core details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Canvas */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-video sm:aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-lg">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {item.isPopular && (
              <span className="absolute top-4 left-4 bg-amber-500 text-neutral-950 font-mono font-black text-xs px-3.5 py-1.5 rounded-xl uppercase flex items-center gap-1.5 shadow-md">
                <Flame className="w-4 h-4 fill-neutral-950" /> Ranch Choice
              </span>
            )}
          </div>
          <p className="text-[10px] text-neutral-400 font-mono text-center">
            *Visual representation of flame-grilled perfection. Actual side sizing varies based on options selected.
          </p>
        </div>

        {/* Right: Core Information & Configurator */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] text-amber-600 font-mono uppercase tracking-widest font-black block">
              {item.category}
            </span>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight font-serif leading-tight">
              {item.name}
            </h1>
            
            <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-500" /> {item.prepTime} Mins Grill Time</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9 (184 Reviews)</span>
            </div>
          </div>

          <p className="text-neutral-600 text-sm leading-relaxed font-sans">
            {item.description} Our premium beef cuts are aged for 21 days, hand-trimmed, then flame-grilled with our legendary basting. No shortcuts, just pure Ranch heritage on your plate.
          </p>

          {/* Size Selector */}
          <div className="space-y-3 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
            <label className="block text-xs font-mono text-neutral-700 uppercase font-black">
              Select Ranch Portion Size:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Standard', desc: 'Grill Classic' },
                { name: 'Hungry Hombre', desc: '+35% Portion' },
                { name: 'Ranch Legend', desc: '+60% Loaded' }
              ].map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setSelectedSize(opt.name as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedSize === opt.name 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-950 shadow-sm' 
                      : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-600'
                  }`}
                >
                  <span className="block text-xs font-bold font-mono uppercase leading-tight">{opt.name}</span>
                  <span className="text-[9px] text-neutral-400 font-mono">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Add block */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-neutral-400 block font-mono">Portion Total</span>
              <span className="text-3xl font-mono font-black text-amber-600">
                ₦{(currentPrice * qty).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white">
                <button 
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  className="p-3 text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-mono font-black text-neutral-900 w-8 text-center">{qty}</span>
                <button 
                  onClick={() => setQty(prev => prev + 1)}
                  className="p-3 text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToBasket}
                className="flex-grow sm:flex-none px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-xl uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Add To Ranch Basket 🧺
              </button>
            </div>
          </div>

          {/* Customizer trigger */}
          <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl flex items-center justify-between text-xs text-neutral-700">
            <span className="flex items-center gap-1.5"><Utensils className="w-4 h-4 text-amber-500" /> Want custom doneness, extra cheese, or baked sides?</span>
            <button 
              onClick={() => onOpenCustomizer(item)}
              className="text-amber-700 font-bold hover:underline font-mono uppercase text-[10px] shrink-0"
            >
              Configure Plate →
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section: Nutritional, Science, Reviews */}
      <div className="space-y-6 pt-6 border-t border-neutral-200">
        <div className="flex border-b border-neutral-200">
          {(['details', 'nutrition', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 font-mono text-xs uppercase font-black border-b-2 -mb-[2px] transition-all ${
                activeTab === tab 
                  ? 'border-amber-500 text-neutral-950' 
                  : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Detailed description / allergen disclosures */}
        {activeTab === 'details' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-bold font-serif text-neutral-900 text-base">The Spur Aging Manifesto</h3>
              <p>
                Our signature steaks are sourced exclusively from pasture-fed, grain-finished cattle across premium agricultural belts. We wet-age all primal cuts for precisely 21 days at 1.5°C to achieve unmatched myofibrillar tenderness before portioning.
              </p>
              <p>
                Each cut is seared at 280°C on our proprietary overhead infrared burners, sealing the natural meat juices while caramelizing our basting glaze.
              </p>
            </div>
            <div className="space-y-4 bg-amber-50/30 p-5 rounded-2xl border border-amber-100">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2"><Shield className="w-4 h-4 text-amber-600" /> Allergen & Sourcing Disclosures</h3>
              <ul className="space-y-2 font-mono text-xs text-neutral-600">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Basting sauce contains soy lecithin & natural vinegar.</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Onion rings are coated in gluten batter.</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> MSG-free steak spice and natural sea salt.</li>
                <li className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Prepared in a facility handling dairy, wheat, and eggs.</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Nutritional metrics */}
        {activeTab === 'nutrition' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {[
                { label: 'CALORIES', value: nutrition.calories, unit: 'kcal' },
                { label: 'PROTEIN', value: nutrition.protein, unit: '' },
                { label: 'TOTAL FATS', value: nutrition.fats, unit: '' },
                { label: 'CARBS', value: nutrition.carbs, unit: '' },
                { label: 'DIETARY FIBER', value: nutrition.fiber, unit: '' },
                { label: 'SODIUM', value: nutrition.sodium, unit: '' }
              ].map((metric) => (
                <div key={metric.label} className="p-4 bg-white border border-neutral-200 rounded-xl text-center shadow-sm">
                  <span className="text-[9px] text-neutral-400 block font-mono font-bold">{metric.label}</span>
                  <span className="text-lg font-mono font-black text-neutral-900 block mt-1">{metric.value}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{metric.unit}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl font-mono">
              *Daily Reference Intake (DRI) values are based on a 2,000-calorie lifestyle diet. Individual metrics may vary based on grill basting and cooking doneness choices.
            </p>
          </motion.div>
        )}

        {/* Tab 3: Customer reviews */}
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-neutral-900 text-sm">4.9 out of 5 based on recent Nigerian Diner Surveys</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Olatunde J., Lagos', rating: 5, msg: 'Legendary ribs are tender, fall-off-the-bone goodness. The sweet BBQ sauce is unmatched!' },
                { name: 'Zainab B., Abuja', rating: 5, msg: 'Steak seared perfectly. Very consistent family spot in Wuse, my kids absolutely love the burgers.' }
              ].map((rev, index) => (
                <div key={index} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-900">{rev.name}</span>
                    <span className="text-neutral-400">Verified Diner</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">"{rev.msg}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
