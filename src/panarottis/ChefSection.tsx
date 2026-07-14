import React, { useState } from 'react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

export default function ChefSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const chefs = [
    {
      name: 'Jenifar Smith',
      role: 'Indian food specialist / Sourdough Master',
      desc: 'Expert in slow cold fermentation and fusing fresh bold Nigerian spices with traditional Italian stone deck baking techniques.',
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Giovanni Rossi',
      role: 'Master Pizzaiolo',
      desc: 'Our chief Italian consultant, directly protecting the 36-hour cold ferment sourdough heritage from his family brick pizzerias in Naples.',
      imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Francesca Moretti',
      role: 'Desert & Pasta Artisan',
      desc: 'Bakes high-heat crispy garlic focaccia flatbreads and slow-stews our incredibly rich lasagna bolognese layers from scratch.',
      imageUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 relative overflow-hidden border-y border-neutral-100">
      {/* Large background outline text "I Love To Make Burger And Pizza" */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-[0.025] select-none pointer-events-none whitespace-nowrap overflow-hidden">
        <span className="font-sans font-black text-[6rem] md:text-[10rem] text-neutral-900 tracking-tight leading-none uppercase">
          I Love Burger And Pizza
        </span>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="mb-12">
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 mb-1 leading-tight">
            In The Kitchen
          </h2>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
            Our experts chef
          </span>
          <div className="w-10 h-1 bg-amber-500 mx-auto mt-4" />
        </div>

        {/* Carousel slide container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-3xl mx-auto text-left bg-white border border-neutral-100 p-6 sm:p-10 rounded-3xl shadow-xl relative">
          <div className="md:col-span-5 flex justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-neutral-100 shadow-lg shrink-0">
              <img
                src={chefs[activeIdx].imageUrl}
                alt={chefs[activeIdx].name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-1 text-amber-600">
              <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-black">Expert Baker</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">
              {chefs[activeIdx].name}
            </h3>
            <span className="text-red-500 font-mono text-xs uppercase tracking-wider block font-bold">
              {chefs[activeIdx].role}
            </span>
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
              {chefs[activeIdx].desc}
            </p>
          </div>

          {/* Indicators on the right/bottom */}
          <div className="absolute right-4 md:right-8 bottom-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex md:flex-col gap-2.5">
            {chefs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeIdx === idx
                    ? 'bg-amber-500 scale-125 border border-amber-600'
                    : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
