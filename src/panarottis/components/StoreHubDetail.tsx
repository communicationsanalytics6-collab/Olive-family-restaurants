import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, MapPin, Clock, Phone, Mail, Award, Check, Users, Star, MessageSquare
} from 'lucide-react';
import { Store } from '../../types';

interface StoreHubDetailProps {
  store: Store;
  onBack: () => void;
  onBookTable: () => void;
}

export default function StoreHubDetail({
  store,
  onBack,
  onBookTable
}: StoreHubDetailProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'menu' | 'feedback'>('events');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Branch Specific Mock Info
  const getBranchDetails = () => {
    if (store.address.includes('Lekki')) {
      return {
        manager: 'Chef Giovanni Rossi',
        staffCount: '18 Culinary Artisans',
        ovensCount: '2 Wood-Fired Brick Ovens',
        featuredDish: 'Gourmet Seafood & Garlic Pizza',
        peakHours: [10, 15, 30, 45, 80, 95, 70, 40], // 4pm - 11pm
        events: [
          { day: 'Friday Night', title: 'Acoustic Slices & Jazz', desc: 'Live acoustic sax, complimentary Prosecco toasts with large sharing gourmet pizzas.' },
          { day: 'Saturday Morning', title: 'Junior Pizzaiolo Workshop', desc: 'Interactive pizza making and hand-rolling classes for kids ages 6-12.' },
          { day: 'Sunday Afternoon', title: 'The Sharing Sunday Feast', desc: 'Get 15% off family-sized gourmet platters and wood-fired pasta trays.' }
        ]
      };
    } else if (store.address.includes('Ikeja')) {
      return {
        manager: 'Manager Michael Cole',
        staffCount: '24 Guest Specialists',
        ovensCount: '3 Stone-Deck Pizza Chambers',
        featuredDish: 'Carnivore Feast Pizza',
        peakHours: [20, 30, 45, 60, 90, 85, 50, 30],
        events: [
          { day: 'Tuesday Special', title: 'Two-sday Pizza Double Up', desc: 'Buy any two large classic pizzas and unlock a free garlic butter flatbread.' },
          { day: 'Thursday Evening', title: 'Office Hub Craft Hour', desc: 'Unwind with draught beers, local side boards, and spicy wood-fired meat boxes.' }
        ]
      };
    } else {
      return {
        manager: 'Chef Daniel Scott',
        staffCount: '15 Dough Experts',
        ovensCount: '1 Colossal Dome Brick Deck',
        featuredDish: 'Al Capone Hot & Spicy Pizza',
        peakHours: [15, 25, 35, 50, 85, 90, 60, 30],
        events: [
          { day: 'Wednesday Night', title: 'Abuja Gourmet Pairing', desc: 'A curated chef pizza tray paired with premium sparkling juices or mocktails.' },
          { day: 'Saturday Evening', title: 'Hearth-Side Sourdough Jam', desc: 'Grab hot wood-fired slices while enjoying local violin and live soul acoustics.' }
        ]
      };
    }
  };

  const bDetails = getBranchDetails();

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackMsg) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackName('');
      setFeedbackMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-12">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-red-600 text-xs font-mono font-bold uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Pizzerias
      </button>

      {/* Header and key details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column: Key contact information & Peak Occupancy */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-red-600 font-mono text-[10px] uppercase tracking-widest font-black block mb-2">LOCAL PIZZERIA HUB</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900 tracking-tight leading-tight">{store.name}</h1>
            <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed mt-2">{store.address}</p>
          </div>

          {/* Quick specs banner */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-2xl text-center">
              <span className="text-[10px] text-neutral-400 font-mono uppercase block font-bold mb-1">Dough Master</span>
              <strong className="text-xs text-neutral-900 font-serif">{bDetails.manager}</strong>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-2xl text-center">
              <span className="text-[10px] text-neutral-400 font-mono uppercase block font-bold mb-1">Operating Staff</span>
              <strong className="text-xs text-neutral-900 font-serif">{bDetails.staffCount}</strong>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-2xl text-center">
              <span className="text-[10px] text-neutral-400 font-mono uppercase block font-bold mb-1">Brick Hearth</span>
              <strong className="text-xs text-neutral-900 font-serif">{bDetails.ovensCount}</strong>
            </div>
          </div>

          {/* Interactive Occupancy / Peak Hours Chart */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Branch Dine-In Peak Hours</h4>
                <p className="text-neutral-500 text-[11px] font-sans">Visual hourly crowdedness metrics (4:00 PM - 11:00 PM)</p>
              </div>
              <span className="text-[10px] font-mono bg-red-600/10 text-red-600 border border-red-600/20 px-2.5 py-0.5 rounded-full font-bold uppercase animate-pulse">Live</span>
            </div>

            {/* Interactive Bar graph */}
            <div className="flex items-end justify-between h-36 pt-4 gap-1 sm:gap-2">
              {bDetails.peakHours.map((pct, idx) => {
                const hourLabel = idx + 4 === 12 ? '12 AM' : `${(idx + 4) % 12} PM`;
                let barColor = 'bg-neutral-200 hover:bg-red-500';
                if (pct >= 80) barColor = 'bg-red-600 hover:bg-red-500';
                else if (pct >= 50) barColor = 'bg-amber-500 hover:bg-amber-400';

                return (
                  <div key={idx} className="flex-grow flex flex-col items-center gap-2">
                    <div className="w-full relative group">
                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-700 ${barColor}`} 
                        style={{ height: `${pct}%` }} 
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-neutral-900 text-white font-mono text-[9px] px-1.5 py-1 rounded shadow-xl shrink-0 whitespace-nowrap z-10">
                        {pct}% Full
                      </div>
                    </div>
                    <span className="text-[9px] text-neutral-500 font-mono block shrink-0">{hourLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Interactive Branch Contact & Booking Panel */}
        <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 p-6 sm:p-8 rounded-3xl space-y-6">
          <div>
            <span className="text-neutral-400 text-[9px] font-mono uppercase block font-bold">Store Contacts</span>
            <h3 className="text-lg font-bold text-neutral-900 font-serif">Reach This Pizzeria</h3>
            <p className="text-neutral-500 text-xs mt-1">Direct hotlines to coordinate custom party boxes or sharing tables.</p>
          </div>

          <div className="space-y-3 text-xs text-neutral-700 font-mono bg-white p-5 border border-neutral-200 rounded-2xl shadow-inner">
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
              <span className="hover:underline cursor-pointer">{store.email}</span>
            </div>
          </div>

          <button
            onClick={onBookTable}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Book Table At This Store ✓
          </button>
        </div>
      </div>

      {/* Local Hub tabs: Events, Chalkboard, Feedback */}
      <div className="border-t border-neutral-200 pt-10">
        <div className="flex border-b border-neutral-100 font-mono text-xs uppercase tracking-wider font-bold mb-6 gap-6">
          {(['events', 'menu', 'feedback'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition-all ${
                activeTab === tab 
                  ? 'border-b-2 border-red-600 text-red-600 font-black' 
                  : 'text-neutral-400 hover:text-neutral-800'
              }`}
            >
              {tab === 'events' && 'Local Branch Events'}
              {tab === 'menu' && 'Local Chef Recommendation'}
              {tab === 'feedback' && 'Direct Branch Feedback'}
            </button>
          ))}
        </div>

        {/* Tab 1: Local Branch Events */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bDetails.events.map((ev, index) => (
              <div key={index} className="p-5 bg-white border border-neutral-100 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <span className="text-[9px] font-mono bg-red-500/10 text-red-600 border border-red-500/20 px-2 py-0.5 rounded uppercase font-bold inline-block">
                    {ev.day}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-neutral-900">{ev.title}</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">{ev.desc}</p>
                </div>
                <button onClick={onBookTable} className="mt-4 text-[10px] font-mono font-bold text-red-600 hover:underline uppercase text-left">
                  Reserve Table →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Local Chef Recommendation */}
        {activeTab === 'menu' && (
          <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 text-2xl font-serif font-bold">
              ★
            </div>
            <div className="space-y-1">
              <span className="text-amber-500 font-mono text-[9px] uppercase tracking-widest font-black block">LUNCH & DINNER HERO</span>
              <h4 className="font-serif font-black text-neutral-900 text-base">Signature Item: {bDetails.featuredDish}</h4>
              <p className="text-neutral-600 text-xs leading-relaxed max-w-xl">
                Chef {bDetails.manager.split(' ').slice(-1)} hand-selects every batch of fresh seafood, pepperoni, and fresh basil loaded onto this local specialty. 
                Savor the crispy, gaseous crust edge only available at {store.name}.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Direct Branch Feedback */}
        {activeTab === 'feedback' && (
          <div className="max-w-xl bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
            <h4 className="font-bold text-neutral-900 text-sm mb-4">Direct Message to {bDetails.manager}</h4>
            <p className="text-neutral-500 text-xs mb-4">Your audit goes straight to the local kitchen management desk to protect wood-fire deck consistency.</p>

            {feedbackSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
                <strong>✓ Feedback Dispatched!</strong> Chef {bDetails.manager.split(' ').slice(-1)} will address your comments during tomorrow morning's dough audit. Thank you!
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1">Your Name</label>
                    <input 
                      type="text" required value={feedbackName} onChange={e => setFeedbackName(e.target.value)}
                      placeholder="Sandra N."
                      className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-red-500 shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1">Store Visited</label>
                    <input 
                      type="text" disabled value={store.name.split('-')[1] || store.name}
                      className="w-full px-3.5 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1">Message Detail</label>
                  <textarea 
                    required rows={3} value={feedbackMsg} onChange={e => setFeedbackMsg(e.target.value)}
                    placeholder="Tell us about your table hospitality or dough toppings..."
                    className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-red-500 shadow-inner"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                  Dispatch Message
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
