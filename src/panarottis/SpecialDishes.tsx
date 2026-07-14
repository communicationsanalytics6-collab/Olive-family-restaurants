import React, { useState } from 'react';

interface SpecialDishesProps {
  onAddSpecial?: (item: any) => void;
  onViewItem?: (itemId: string) => void;
}

export default function SpecialDishes({ onAddSpecial, onViewItem }: SpecialDishesProps) {
  const [selectedCat, setSelectedCat] = useState<'Pizza' | 'Pasta' | 'Salads'>('Pizza');

  const dishes = {
    Pizza: [
      {
        id: 'special-seafood-deluxe',
        name: 'Saucy Seafood Deluxe',
        desc: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
        price: '₦12,500',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
        priceRaw: 12500,
        category: 'Gourmet Pizzas',
        prepTime: 18,
        brand: 'panarottis'
      },
      {
        id: 'special-al-capone',
        name: 'The Fiery Al Capone',
        desc: 'Curabitur imperdiet, diam non finibus congue, magna erat luctus sem, non hendrerit.',
        price: '₦8,900',
        imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400',
        priceRaw: 8900,
        category: 'Gourmet Pizzas',
        prepTime: 15,
        brand: 'panarottis'
      },
      {
        id: 'special-classic-margherita',
        name: 'Sourdough Margherita',
        desc: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
        price: '₦6,800',
        imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=400',
        priceRaw: 6800,
        category: 'Classic Pizzas',
        prepTime: 12,
        brand: 'panarottis'
      }
    ],
    Pasta: [
      {
        id: 'special-lasagna',
        name: 'Slow-Simmered Lasagna',
        desc: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
        price: '₦9,400',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400',
        priceRaw: 9400,
        category: 'Hearty Pastas',
        prepTime: 20,
        brand: 'panarottis'
      },
      {
        id: 'special-fettuccine-pesto',
        name: 'Fettuccine Creamy Pesto',
        desc: 'Donec ac ex ultrices, feugiat ligula sed, interdum velit. In hac habitasse platea dictumst.',
        price: '₦8,200',
        imageUrl: 'https://images.unsplash.com/photo-1554978991-33ef7f31d658?auto=format&fit=crop&q=80&w=400',
        priceRaw: 8200,
        category: 'Hearty Pastas',
        prepTime: 15,
        brand: 'panarottis'
      }
    ],
    Salads: [
      {
        id: 'special-italian-caesar',
        name: 'Italian Crisp Caesar',
        desc: 'Aenean ac lectus a mi finibus scelerisque. Ut ultrices, mi vel condimentum aliquet.',
        price: '₦4,800',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
        priceRaw: 4800,
        category: 'Gourmet Pizzas',
        prepTime: 10,
        brand: 'panarottis'
      }
    ]
  };

  return (
    <section className="bg-neutral-50/60 py-20 px-4 sm:px-6 lg:px-8 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Menu items list */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-amber-600 font-mono text-[11px] font-bold uppercase tracking-widest block mb-1">
              For The Menu
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Special Dishes Today
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest font-bold">
                10.00 to 16.00 Service Hour
              </span>
            </div>
          </div>

          {/* Sub category filter circles */}
          <div className="flex gap-4 items-center pt-2">
            {(['Pizza', 'Pasta', 'Salads'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className="flex items-center gap-2 group text-xs font-bold text-neutral-600 hover:text-red-600 transition-colors"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    selectedCat === cat
                      ? 'bg-red-500 border-red-500 scale-110 shadow'
                      : 'border-neutral-300 bg-transparent group-hover:border-red-500'
                  }`}
                />
                <span className={selectedCat === cat ? 'text-red-600' : ''}>{cat} Food</span>
              </button>
            ))}
          </div>

          {/* Dishes list */}
          <div className="space-y-6 pt-4">
            {dishes[selectedCat]?.map((dish) => (
              <div
                key={dish.id}
                onClick={() =>
                  onAddSpecial?.({
                    id: dish.id,
                    name: dish.name,
                    price: dish.priceRaw,
                    category: dish.category,
                    imageUrl: dish.imageUrl,
                    description: dish.desc,
                    brand: 'panarottis',
                    isPopular: true,
                    prepTime: dish.prepTime
                  })
                }
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white border border-neutral-200/80 rounded-2xl shadow-sm hover:shadow-lg hover:border-red-500/80 transition-all duration-300 group cursor-pointer transform hover:scale-[1.01] active:scale-[0.995]"
              >
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-neutral-100 shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-grow text-center sm:text-left">
                  <span className="text-[9px] font-mono font-bold bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full uppercase border border-red-100">
                    {selectedCat} SPECIAL
                  </span>
                  <h4 
                    className="font-serif text-lg sm:text-xl font-bold text-[#b4221c] group-hover:text-red-600 transition-colors mt-2"
                  >
                    {dish.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mt-1 line-clamp-2">
                    {dish.desc}
                  </p>
                  <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-1.5 text-[10px] font-mono font-bold text-amber-600 group-hover:text-amber-700 uppercase tracking-widest">
                    <span>+ Quick Customize & Order</span>
                  </div>
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-red-100 flex flex-col items-center justify-center text-center p-1.5 shrink-0 bg-red-50/50 group-hover:bg-red-50 transition-colors">
                  <span className="font-mono text-xs sm:text-sm font-black text-red-600 tracking-tight">
                    {dish.price}
                  </span>
                  <span className="text-[8px] font-mono text-red-400 font-bold uppercase mt-0.5">ORDER</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: "We love To Make Food" and 4-grid */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="text-center lg:text-left relative py-4">
            <h3 className="font-serif text-4xl sm:text-5xl font-black text-[#019993] leading-tight mb-2">
              We love
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
              To Make
            </span>
            <h3 className="font-serif text-5xl sm:text-6xl font-black text-neutral-800 uppercase tracking-tight">
              Food
            </h3>
          </div>

          {/* Bento Images grid */}
          <div className="grid grid-cols-2 gap-4 max-w-[420px] mx-auto lg:mx-0">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300"
                alt="Latte Art"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=300"
                alt="Hand-stretching Sourdough"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=300"
                alt="Cookies"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300"
                alt="Fries & Burgers"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
