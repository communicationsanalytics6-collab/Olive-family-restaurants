import React from 'react';
import { Eye } from 'lucide-react';

interface SpecialtyCuisineProps {
  onMoreClick?: () => void;
}

export default function SpecialtyCuisine({ onMoreClick }: SpecialtyCuisineProps) {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
      title: 'Wood-Fired Pizza Slices'
    },
    {
      src: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400',
      title: 'Gourmet Red Sauce Pasta'
    },
    {
      src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
      title: 'Fresh Italian Green Salad'
    },
    {
      src: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=400',
      title: 'Crispy Sourdough Garlic Focaccia'
    },
    {
      src: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400',
      title: 'Rich Cocoa-Dusted Tiramisu'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-red-500 font-mono text-[11px] font-bold uppercase tracking-widest block">
              Our Specialty
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-950 leading-tight">
              Cuisine
            </h2>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest font-bold">
              Best of our Event Portfolio Photos videos
            </p>
          </div>

          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Amorim ipsum dolor sit at, consectetur adipiscing elit. Cras vitae nibh nisl. Cras etitikis mauris eget lorem ultricies ferme ntum a inti diam. Morbi mollis pellen tesque offs aiug ueia nec rhoncus. Nam ute ultricies.
          </p>

          <button
            onClick={onMoreClick}
            className="px-6 py-3 bg-[#019993] hover:bg-[#00827d] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
          >
            MORE GALLERY
          </button>
        </div>

        {/* Right Column - Bento Gallery */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-4 h-full">
            {/* Item 1 - Big Vertical (md:col-span-6) */}
            <div className="md:col-span-6 row-span-2 relative group overflow-hidden rounded-2xl border border-neutral-100 shadow-sm aspect-[4/5] md:aspect-auto md:h-[450px]">
              <img
                src={images[0].src}
                alt={images[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <Eye className="w-6 h-6 text-white mb-2" />
                  <span className="text-white font-serif font-bold text-sm sm:text-base">{images[0].title}</span>
                </div>
              </div>
            </div>

            {/* Right stack of 4 items */}
            <div className="md:col-span-6 grid grid-cols-1 gap-4 md:h-[450px]">
              {/* Item 2 - Top Wide */}
              <div className="relative group overflow-hidden rounded-2xl border border-neutral-100 shadow-sm h-[135px]">
                <img
                  src={images[1].src}
                  alt={images[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-serif font-bold text-xs sm:text-sm">{images[1].title}</span>
                </div>
              </div>

              {/* Item 3 & 4 - Middle Two side by side */}
              <div className="grid grid-cols-2 gap-4 h-[135px]">
                <div className="relative group overflow-hidden rounded-2xl border border-neutral-100 shadow-sm h-full">
                  <img
                    src={images[2].src}
                    alt={images[2].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                    <span className="text-white font-serif font-bold text-[10px] sm:text-xs leading-tight">{images[2].title}</span>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-2xl border border-neutral-100 shadow-sm h-full">
                  <img
                    src={images[3].src}
                    alt={images[3].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                    <span className="text-white font-serif font-bold text-[10px] sm:text-xs leading-tight">{images[3].title}</span>
                  </div>
                </div>
              </div>

              {/* Item 5 - Bottom Wide */}
              <div className="relative group overflow-hidden rounded-2xl border border-neutral-100 shadow-sm h-[132px]">
                <img
                  src={images[4].src}
                  alt={images[4].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-serif font-bold text-xs sm:text-sm">{images[4].title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
