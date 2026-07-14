import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, BookOpen, Clock, Heart, Award, Sparkles, Scale, Info, CheckCircle
} from 'lucide-react';

interface MilestoneDetailProps {
  stageId: string;
  onBack: () => void;
}

export default function MilestoneDetail({
  stageId,
  onBack
}: MilestoneDetailProps) {
  // Baker's Percentages Calculator State
  const [flourWeight, setFlourWeight] = useState(1000); // grams
  const [hydrationPct, setHydrationPct] = useState(65); // %
  const [saltPct, setSaltPct] = useState(2.5); // %
  const [yeastPct, setYeastPct] = useState(0.3); // %

  const getStageInfo = () => {
    switch (stageId) {
      case 'stage1':
        return {
          title: 'The Flour Mills of Campania',
          subtitle: 'Milestone 1: Sourcing True Tipo 00 Wheat',
          date: 'Est. July 2024',
          img: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=800',
          content: [
            'Our culinary journey began with a single obsession: finding wheat flour capable of absorbing water at high ratios while retaining a strong gluten structure during 36 hours of cold fermentation.',
            'We traveled to the historical region of Campania, Italy, partnering with artisanal family mills that stone-grind soft wheat to the ultimate "Tipo 00" fine specification. This flour is low in ash and rich in stable gluten proteins, creating elastic dough sheets that can be hand-stretched to paper-thinness without tearing.',
            'By shipping our wheat directly from Naples to Lagos, Nigeria in temperature-regulated containers, we protect the fragile enzymes that give our wood-fired sourdough crust its iconic crispness, lightness, and beautiful charred air pockets.'
          ]
        };
      case 'stage2':
        return {
          title: 'The 40-Year-Old Biga Starter',
          subtitle: 'Milestone 2: Cultivating Our Signature Mother Starter',
          date: 'Est. Oct 2024',
          img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
          content: [
            'Dough is a living system. At Panarottis, we refuse to use industrial dry powder yeasts that force dough to rise unnaturally in 60 minutes, leading to heavy, indigestible bread.',
            'Instead, we propagate and feed our natural mother yeast starter (the "Biga"), which is cultivated using wild cultures dating back over 40 years. This starter undergoes an intricate daily feeding routine, maintaining pH acidity levels between 4.1 and 4.4.',
            'During our 36-hour slow cold proofing, the wild yeasts and lactobacilli pre-digest complex starches and wheat gluten, converting them into simple digestible sugars and lactic acids. This is why our diners never experience bloated fullness after sharing our massive pizzas.'
          ]
        };
      default:
        return {
          title: 'Nigeria Hearth Construction Logs',
          subtitle: 'Milestone 3: Bringing True High-Heat Stone Decks to Lagos & Abuja',
          date: 'Est. April 2025',
          img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
          content: [
            'A true Neapolitan pizza requires more than sourdough—it needs high heat. Standard steel conveyor ovens bake at 250°C, producing tough, cardboard-like crusts.',
            'To achieve authentic results, we imported volcanic stone brick materials directly from Naples, hand-assembling brick-dome ovens on-site in Lagos (Lekki Phase 1) and Abuja (Wuse II).',
            'These ovens operate at temperatures exceeding 420°C, fueled by dry oak wood embers. High thermal mass radiates heat evenly from the floor, flash-baking the dough in exactly 90 seconds. This traps natural moisture inside the crust while instantly melting and caramelizing our toppings and mozzarella.'
          ]
        };
    }
  };

  const info = getStageInfo();

  // Baker's Formulas Math
  const calculatedWater = (flourWeight * hydrationPct) / 100;
  const calculatedSalt = (flourWeight * saltPct) / 100;
  const calculatedYeast = (flourWeight * yeastPct) / 100;
  const calculatedTotal = flourWeight + calculatedWater + calculatedSalt + calculatedYeast;

  return (
    <div className="space-y-12">
      {/* Back navigation */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-red-600 text-xs font-mono font-bold uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Our Story
      </button>

      {/* Hero Header editorial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-red-600 font-mono text-[10px] uppercase tracking-widest font-black block">{info.subtitle}</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-neutral-900 tracking-tight leading-tight">{info.title}</h1>
          <span className="text-xs font-mono text-neutral-400 block font-bold">HISTORICAL LOG: {info.date}</span>
          <div className="w-12 h-1 bg-amber-500 mt-2" />
        </div>

        <div className="lg:col-span-5 h-64 rounded-3xl overflow-hidden border border-neutral-200 shadow-sm">
          <img src={info.img} alt={info.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
        </div>
      </div>

      {/* Main text content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6 border-t border-neutral-100">
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xl font-serif font-bold text-neutral-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-500" /> Executive Chef's Journal Entry
          </h3>
          <div className="space-y-6 text-neutral-600 text-sm leading-relaxed sm:text-base">
            {info.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Core Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-white border border-neutral-200/60 rounded-2xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-neutral-900 text-xs">Uncompromising Quality</h4>
                <p className="text-neutral-500 text-[10px]">Imported whole grains and pure extra virgin olive oils.</p>
              </div>
            </div>
            <div className="p-4 bg-white border border-neutral-200/60 rounded-2xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-neutral-900 text-xs">Patience is Flavor</h4>
                <p className="text-neutral-500 text-[10px]">Zero fast yeast. Sourdough requires time to build digestability.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Baker's Interactive hydration calculator */}
        <div className="lg:col-span-4 bg-neutral-50 border border-neutral-200 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-black block">Interactive Lab Tool</span>
            <h4 className="text-sm font-bold text-neutral-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-red-500" /> Baker's Hydration Calculator
            </h4>
            <p className="text-neutral-500 text-[11px] leading-normal">
              Input your target flour weight to see our classic 65% sourdough hydration formula calculated instantly.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-neutral-600 uppercase mb-1">Flour Weight (grams)</label>
              <input 
                type="number" min={100} max={50000} value={flourWeight} onChange={e => setFlourWeight(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-red-500 font-mono shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-500">Hydration Ratio:</span>
                <strong className="text-neutral-800">{hydrationPct}%</strong>
              </div>
              <input 
                type="range" min={50} max={80} value={hydrationPct} onChange={e => setHydrationPct(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <div className="space-y-1 text-xs font-mono bg-white p-4 border border-neutral-200 rounded-xl">
              <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-wider mb-2">Required Baking Weights</span>
              <div className="flex justify-between border-b border-neutral-100 pb-1.5 mb-1.5 text-neutral-700">
                <span>Flour (100%):</span>
                <strong className="text-neutral-900">{flourWeight.toLocaleString()}g</strong>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1.5 mb-1.5 text-neutral-700">
                <span>Water ({hydrationPct}%):</span>
                <strong className="text-neutral-900">{calculatedWater.toLocaleString()}g</strong>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1.5 mb-1.5 text-neutral-700">
                <span>Sea Salt ({saltPct}%):</span>
                <strong className="text-neutral-900">{calculatedSalt.toFixed(1)}g</strong>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1.5 mb-1.5 text-neutral-700">
                <span>Biga Starter ({yeastPct}%):</span>
                <strong className="text-neutral-900">{calculatedYeast.toFixed(1)}g</strong>
              </div>
              <div className="flex justify-between pt-1 text-red-600 font-bold">
                <span>Total Dough:</span>
                <span>{calculatedTotal.toLocaleString()}g</span>
              </div>
            </div>

            <div className="p-3 bg-red-600/5 rounded-xl border border-red-600/10 text-[10px] text-red-600 leading-normal flex gap-1.5">
              <Info className="w-4 h-4 shrink-0" />
              <span>Yields approximately <strong>{(calculatedTotal / 250).toFixed(1)} individual pizza dough balls</strong> (250g Neapolitan scale).</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
