import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, MapPin, Phone, Mail, Clock, Calendar, 
  Users, Sparkles, Check, HelpCircle, AlertCircle, Eye
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
  // Live dynamic occupancy tracking simulation
  const [occupancy, setOccupancy] = useState(65);

  useEffect(() => {
    // Soft fluctuator to simulate active occupancy changes in real-time
    const interval = setInterval(() => {
      setOccupancy(prev => {
        const change = Math.floor(Math.random() * 9) - 4; // -4 to +4 change
        return Math.max(30, Math.min(95, prev + change));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Events schedule specific to the store branch
  const getBranchEvents = () => {
    return [
      { day: 'Every Tuesday', name: 'Legendary Kids DIY Burger Night', desc: 'Kids build their own grilled burgers. Face painting, clown balloon arts, and free dessert.' },
      { day: 'Every Thursday', name: 'Steak & Sizzle Night', desc: 'Get 20% off all large T-Bone and Ribeye cuts with complimentary craft draft beers.' },
      { day: 'Saturdays', name: 'Spur Steak Academy Masterclass', desc: 'Wet-aging science, infrared searing masterclasses with our Master Pitmasters.' }
    ];
  };

  const events = getBranchEvents();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 py-6 max-w-4xl mx-auto"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-amber-700 hover:text-amber-600 font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store Locator
        </button>
        <span className="text-xs font-mono text-neutral-500 uppercase font-bold">
          Spur Ranch Hub
        </span>
      </div>

      {/* Ranch Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-neutral-200 p-6 sm:p-8 rounded-3xl shadow-sm">
        {/* Branch Info column */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-amber-600 font-mono text-[10px] uppercase tracking-widest font-black block">
            LOCAL STEAKHOUSE Ranch
          </span>
          <h1 className="text-3xl font-serif font-black text-neutral-900 tracking-tight leading-tight">
            Spur {store.name}
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
            {store.address}. Fully equipped with a state-of-the-art play canyon, overhead infrared steak broilers, private banquet booths, and massive secure parking grids.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600 font-mono pt-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{store.openingHours} Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500" />
              <span>{store.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500" />
              <span>{store.email}</span>
            </div>
          </div>
        </div>

        {/* Live Gauges column */}
        <div className="lg:col-span-5 bg-neutral-50 p-6 rounded-2xl border border-neutral-200 text-center space-y-4">
          <div>
            <span className="text-[10px] text-neutral-400 font-mono uppercase block font-bold">Ranch Sizzle Status</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs font-mono font-bold text-neutral-900 uppercase">Live Occupancy Sensor</span>
            </div>
          </div>

          {/* Occupancy Indicator */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-neutral-700">
              <span>Seating Load</span>
              <span className={occupancy > 80 ? 'text-red-500' : occupancy > 60 ? 'text-amber-600' : 'text-emerald-600'}>
                {occupancy}% Full
              </span>
            </div>
            <div className="w-full bg-neutral-200 h-3 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  occupancy > 80 ? 'bg-red-500' : occupancy > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancy}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-500 block font-mono">
              {occupancy > 80 ? '🔥 Peak Sizzle. Booking highly recommended!' : '⚡ Moderate seating available. Instant walk-ins open.'}
            </span>
          </div>

          <button
            onClick={onBookTable}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
          >
            Reserve Table Spot Now
          </button>
        </div>
      </div>

      {/* Events Schedule Grid */}
      <div className="space-y-6">
        <div>
          <span className="text-[10px] text-amber-600 font-mono uppercase tracking-widest font-black block mb-1">THE FESTIVITIES</span>
          <h2 className="text-2xl font-black text-neutral-900 font-serif">Branch Event Calendar</h2>
          <p className="text-neutral-500 text-xs mt-1">Weekly family celebrations, steak discounts, and masterclasses at our ranch.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e, index) => (
            <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between hover:border-neutral-300 transition-colors shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] bg-amber-500/10 text-amber-700 border border-amber-500/20 font-mono uppercase px-2.5 py-1 rounded-full inline-block font-bold">
                  {e.day}
                </span>
                <h4 className="text-sm font-black text-neutral-900 font-sans">{e.name}</h4>
                <p className="text-neutral-500 text-xs leading-relaxed">{e.desc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>Supervised Area Included</span>
                <span className="text-amber-600 font-bold">Free Walk-in ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
