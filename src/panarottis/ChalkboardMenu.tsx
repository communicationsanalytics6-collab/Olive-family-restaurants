import React, { useState } from 'react';
import { Pizza, Utensils, Star, ShoppingCart, Info, Flame } from 'lucide-react';

interface ChalkboardMenuProps {
  onAddSpecial?: (item: any) => void;
  onAddToCartDirectly?: (item: any) => void;
  onViewDetails?: (item: any) => void;
}

export default function ChalkboardMenu({ onAddSpecial, onAddToCartDirectly, onViewDetails }: ChalkboardMenuProps) {
  const [activeCat, setActiveCat] = useState<'Pizza' | 'Pasta' | 'Burgers' | 'Beverages'>('Pizza');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories = [
    { label: 'Pizza & Slices', value: 'Pizza' as const },
    { label: 'Hearty Pasta', value: 'Pasta' as const },
    { label: 'Gourmet Burgers', value: 'Burgers' as const },
    { label: 'Chilled Beverages', value: 'Beverages' as const }
  ];

  const items = {
    Pizza: [
      { id: 'c-1', name: 'Stewed Asparagus Pizza', price: 8500, priceStr: '₦8,500', ingredients: 'Fermented sourdough, roasted asparagus, queen prawns, garlic', rawPrice: 8500 },
      { id: 'c-2', name: 'Melon and Lime Pizza', price: 7900, priceStr: '₦7,900', ingredients: 'Mozzarella, fresh lime zest, prosciutto, balsamic drizzle, melon stars', rawPrice: 7900 },
      { id: 'c-3', name: 'Shallow-Fried Slices', price: 6800, priceStr: '₦6,800', ingredients: 'Crumbled sausage, sweet peppers, red onion, smoked provolone', rawPrice: 6800 },
      { id: 'c-4', name: 'Barbecued Sour Crust', price: 9200, priceStr: '₦9,200', ingredients: 'Slow-smoked chicken, tangy barbecue base, red onion, fresh cilantro', rawPrice: 9200 },
      { id: 'c-5', name: 'Pan-Fried Ginger', price: 7500, priceStr: '₦7,500', ingredients: 'Spiced ginger pork, pickled jalapeño, sweet soy reduction, basil', rawPrice: 7500 },
      { id: 'c-6', name: 'Sautéed Onions Classic', price: 6900, priceStr: '₦6,900', ingredients: 'Caramelized sweet onions, roasted garlic paste, thyme, virgin olive oil', rawPrice: 6900 },
      { id: 'c-7', name: 'Fire-Grilled Herbs', price: 7200, priceStr: '₦7,200', ingredients: 'Loaded fresh oregano, rosemary sprigs, sea salt, rich pomodoro sauce', rawPrice: 7200 },
      { id: 'c-8', name: 'Blueberry Tart Salad Pizza', price: 8100, priceStr: '₦8,100', ingredients: 'Sweet cream, goat cheese crumbled, fresh blueberries, baby arugula', rawPrice: 8100 }
    ],
    Pasta: [
      { id: 'cp-1', name: 'Classic Beef Bolognese', price: 9400, priceStr: '₦9,400', ingredients: 'Tagliatelle tossed in slow-simmered beef, pork ragu, and grana padano', rawPrice: 9400 },
      { id: 'cp-2', name: 'Penne Creamy Basil Pesto', price: 8200, priceStr: '₦8,200', ingredients: 'Fresh basil pesto cream, sun-dried tomatoes, toasted pine nuts', rawPrice: 8200 },
      { id: 'cp-3', name: 'Seafood Marinara Spaghetti', price: 11500, priceStr: '₦11,500', ingredients: 'Prawns, calamari, mussels simmered in rich garlic white wine pomodoro', rawPrice: 11500 },
      { id: 'cp-4', name: 'Gorgonzola Gnocchi', price: 8900, priceStr: '₦8,900', ingredients: 'Handmade potato gnocchi in rich gorgonzola cream, walnut crunch', rawPrice: 8900 }
    ],
    Burgers: [
      { id: 'cb-1', name: 'Spur Double Cheeseburger', price: 7800, priceStr: '₦7,800', ingredients: 'Two flame-grilled beef patties, double cheddar cheese, spur basted sauce', rawPrice: 7800 },
      { id: 'cb-2', name: 'Crispy Italian Chicken Burger', price: 6900, priceStr: '₦6,900', ingredients: 'Panko fried chicken breast, mozzarella, basil pesto, rocket', rawPrice: 6900 }
    ],
    Beverages: [
      { id: 'cd-1', name: 'Chilled Pepsi Bottle', price: 600, priceStr: '₦600', ingredients: 'Ice-cold classic Nigerian Pepsi-Cola beverage to refresh you', rawPrice: 600 },
      { id: 'cd-2', name: 'Chilled Coca-Cola Bottle', price: 600, priceStr: '₦600', ingredients: 'Ice-cold refreshing Coca-Cola soda bottle with fresh lime', rawPrice: 600 },
      { id: 'cd-3', name: 'Creamy Maltina Can', price: 800, priceStr: '₦800', ingredients: 'Classic Nigerian premium non-alcoholic rich malt drink', rawPrice: 800 },
      { id: 'cd-4', name: 'Chi Exotic Fruit Juice', price: 1200, priceStr: '₦1,200', ingredients: 'Creamy pineapple and coconut nectar fruit juice blend', rawPrice: 1200 },
      { id: 'cd-5', name: 'Signature Nigerian Chapman', price: 1800, priceStr: '₦1,800', ingredients: 'Classic Chapman mocktail with Angostura, bitters, Fanta, Sprite and blackcurrant', rawPrice: 1800 },
      { id: 'cd-6', name: 'Zobo House Craft Blend', price: 1200, priceStr: '₦1,200', ingredients: 'Sweet hibiscus flower tea brewed with ginger, pineapple skins and honey', rawPrice: 1200 }
    ]
  };

  const getItemImage = (id: string, cat: string) => {
    if (cat === 'Pizza') {
      if (id === 'c-1') return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300';
      if (id === 'c-2') return 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=300';
      if (id === 'c-3') return 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=300';
      if (id === 'c-4') return 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=300';
      return 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=300';
    } else if (cat === 'Pasta') {
      if (id === 'cp-1') return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300';
      if (id === 'cp-2') return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300';
      return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300';
    } else if (cat === 'Burgers') {
      return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300';
    } else {
      if (id === 'cd-5') return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300';
      if (id === 'cd-6') return 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=300';
      return 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=300';
    }
  };

  const getMenuItemObj = (item: any) => {
    return {
      id: item.id,
      name: item.name,
      price: item.rawPrice,
      category: activeCat === 'Pizza' ? 'Gourmet Pizzas' : activeCat === 'Pasta' ? 'Hearty Pastas' : activeCat === 'Burgers' ? 'Burgers' : 'Beverages',
      imageUrl: getItemImage(item.id, activeCat),
      description: item.ingredients,
      brand: 'panarottis' as const,
      isPopular: true,
      prepTime: 15
    };
  };

  const handleQuickAdd = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (onAddToCartDirectly) {
      onAddToCartDirectly(getMenuItemObj(item));
      setJustAddedId(item.id);
      setTimeout(() => setJustAddedId(null), 1500);
    }
  };

  const handleItemClick = (item: any) => {
    if (onViewDetails) {
      onViewDetails(getMenuItemObj(item));
    } else if (onAddSpecial) {
      onAddSpecial(getMenuItemObj(item));
    }
  };

  return (
    <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl my-12 border border-red-950/50 shadow-2xl">
      {/* Autoplay & Muted Ambient YouTube Video Background - Increased opacity and visibility */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-60 select-none">
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] min-w-full min-h-full aspect-video object-cover"
          src="https://www.youtube.com/embed/wX8foM1z7S0?autoplay=1&mute=1&controls=0&loop=1&playlist=wX8foM1z7S0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1"
          title="Our Delicious Menu Ambient Video"
          allow="autoplay; encrypted-media"
          style={{ border: 'none' }}
        />
      </div>
      
      {/* Full black with transparency of multiply, and lower gradient opacity for video visibility */}
      <div className="absolute inset-0 bg-black/60 mix-blend-multiply z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/30 to-red-950/50 z-0" />

      {/* Sparks rising animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping opacity-30" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-12 left-2/3 w-1 h-1 bg-amber-500 rounded-full animate-pulse opacity-40" style={{ animationDuration: '2s' }} />
        <div className="absolute bottom-24 left-1/3 w-2 h-2 bg-orange-600 rounded-full animate-ping opacity-25" style={{ animationDuration: '4.5s' }} />
        <div className="absolute bottom-36 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-50" style={{ animationDuration: '2.5s' }} />
      </div>

      {/* Decorative Brand Top Slogan */}
      <div className="absolute top-6 left-6 opacity-20 pointer-events-none text-neutral-300 hidden lg:block font-mono text-[9px] uppercase tracking-widest z-10">
        <span>Authentic Italian Craft • Brand Red Selection</span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-red-500 font-serif italic text-lg sm:text-xl block mb-1">
            Savour the Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-wide uppercase flex items-center justify-center gap-3">
            <Pizza className="w-8 h-8 text-red-500 animate-[spin_8s_linear_infinite]" /> Our Delicious Menu <Pizza className="w-8 h-8 text-red-500 animate-[spin_8s_linear_infinite]" />
          </h2>
          <p className="text-xs font-mono text-amber-200 mt-2 uppercase tracking-wider">
            Wood-fired perfection & premium ingredients
          </p>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories filters tabs - Scrollable on mobile, Centered on desktop */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-10 scrollbar-none justify-start lg:justify-center -mx-4 px-4 lg:mx-0 lg:px-0 scroll-smooth flex-nowrap lg:flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCat(cat.value)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeCat === cat.value
                  ? 'bg-red-600 text-white font-black shadow-lg shadow-red-600/30 ring-2 ring-red-400/20'
                  : 'bg-neutral-900/85 border border-red-950 text-neutral-300 hover:text-white hover:border-red-800'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  activeCat === cat.value ? 'bg-white animate-pulse' : 'bg-red-800'
                }`}
              />
              {cat.label}
            </button>
          ))}
        </div>

        {/* 1. MOBILE-FIRST MENU LAYOUT (Appetizing visual list cards) */}
        <div className="block lg:hidden space-y-4">
          {items[activeCat]?.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-red-900/60 active:bg-neutral-900/60 transition-all duration-300 cursor-pointer flex gap-4 items-center"
            >
              {/* Left thumbnail image for immense appetite appeal on mobile */}
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-neutral-800 shadow-inner relative">
                <img
                  src={getItemImage(item.id, activeCat)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1 left-1 bg-red-600 text-white text-[7px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Fresh
                </div>
              </div>

              {/* Right content details */}
              <div className="flex-grow min-w-0 flex flex-col justify-between h-20 py-0.5">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="font-serif font-black text-sm text-white truncate pr-1">
                    {item.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-red-400 shrink-0 bg-red-950/40 px-2 py-0.5 rounded-full border border-red-900/30">
                    {item.priceStr}
                  </span>
                </div>
                
                <p className="text-[10.5px] text-neutral-400 line-clamp-2 leading-snug">
                  {item.ingredients}
                </p>

                {/* Mobile action bar inside item card */}
                <div className="flex justify-between items-center pt-1 mt-0.5">
                  <span className="text-[8.5px] text-neutral-500 font-mono flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-red-500 animate-pulse" /> wood-fired
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="px-2.5 py-1 rounded bg-neutral-900 border border-red-950/50 text-[9px] font-mono font-bold text-neutral-300 uppercase hover:bg-neutral-800"
                    >
                      Customize
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, item)}
                      className={`px-2.5 py-1 rounded text-[9px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-0.5 ${
                        justAddedId === item.id 
                          ? 'bg-green-600 text-white' 
                          : 'bg-red-600 hover:bg-red-500 text-white'
                      }`}
                    >
                      <span>{justAddedId === item.id ? '✓' : '+ Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DESKTOP CHALKBOARD MENU LAYOUT */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          {items[activeCat]?.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="group p-4 rounded-2xl bg-neutral-950/40 border border-transparent hover:border-red-900/40 hover:bg-red-950/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-end gap-2">
                  <span className="font-serif font-black text-base sm:text-lg text-white group-hover:text-red-400 transition-colors">
                    {item.name}
                  </span>

                  {/* Connecting dotted line */}
                  <div className="flex-grow border-b border-dashed border-red-950/60 mx-2 mb-1.5 group-hover:border-red-800/60 transition-colors" />

                  {/* Dashed price circle */}
                  <div className="border border-dashed border-red-900 rounded-full px-3 py-1 text-xs sm:text-sm font-mono text-red-400 font-bold shrink-0 group-hover:bg-red-950/20 transition-all">
                    {item.priceStr}
                  </div>
                </div>

                <p className="text-xs text-neutral-400 font-mono italic leading-relaxed mt-2 group-hover:text-neutral-300 transition-colors">
                  {item.ingredients}
                </p>
              </div>

              {/* Action row shown on hover & easily clickable */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-red-950/20">
                <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-500" /> wood-fired
                </span>
                
                <div className="flex items-center gap-2">
                  {/* Option 1: View details / Customize */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center gap-1 uppercase tracking-wider transition-colors border border-red-950"
                  >
                    <Info className="w-3 h-3" /> Customize
                  </button>

                  {/* Option 2: Add directly to cart */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, item)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                      justAddedId === item.id 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-md'
                    }`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>{justAddedId === item.id ? 'Added ✓' : 'Add Direct'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Chalk Sketch at bottom */}
        <div className="flex justify-center items-center gap-4 mt-12 text-red-950 border-t border-red-950/30 pt-8">
          <Utensils className="w-5 h-5 text-red-900" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
            Stone-baked at over 400°C • Baked with authentic Italian Amore
          </span>
          <Star className="w-4 h-4 fill-current text-red-900" />
        </div>
      </div>
    </section>
  );
}
