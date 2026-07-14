import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Calendar, Clock, Award, Users, BookOpen, Check, Play, Sparkles
} from 'lucide-react';

interface MasterclassDetailProps {
  moduleId: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function MasterclassDetail({
  moduleId,
  onBack,
  onSuccess
}: MasterclassDetailProps) {
  const [studentsCount, setStudentsCount] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 12:00 PM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);

  const getModuleInfo = () => {
    switch (moduleId) {
      case 'fermentation':
        return {
          title: 'Dough Fermentation & Yeast Biology',
          price: 15000,
          difficulty: 'Beginner to Intermediate',
          instructor: 'Chef Giovanni Rossi',
          duration: '3 Hours',
          syllabus: [
            { hour: 'Hour 1', title: 'The Chemistry of Water & Ash', desc: 'Understanding mineral absorption, gluten matrix creation, and salt dehydration formulas.' },
            { hour: 'Hour 2', title: 'Wild Biga Maintenance', desc: 'How to propagate wild yeast starter cultures, balance acidity levels, and sustain starch breakdown.' },
            { hour: 'Hour 3', title: 'Cold-Fermentation Cold Decking', desc: 'Setting up refrigeration chambers at exact 4°C parameters for enzyme pre-digestion.' }
          ],
          inclusions: ['Personal 36hr proofing container', '5kg imported Campania Tipo 00 Flour', 'Glass jar wild biga starter culture']
        };
      case 'stretching':
        return {
          title: 'Artisanal Stretching & Leopard Spotting',
          price: 18000,
          difficulty: 'Intermediate to Advanced',
          instructor: 'Chef Daniel Scott',
          duration: '3.5 Hours',
          syllabus: [
            { hour: 'Hour 1', title: 'The Hand-Pressing Technique', desc: 'Squeezing carbon bubbles gently from the center outwards without tearing gluten strands.' },
            { hour: 'Hour 2', title: 'The Neapolitan Slap Technique', desc: 'Advanced board-to-hand rotation stretches to build high edge structures (Canotto rims).' },
            { hour: 'Hour 3', title: 'Thermodynamics of 420°C Brick', desc: 'Placing, turning, and peeling pizzas inside high-heat wood-fired stone decks.' }
          ],
          inclusions: ['Artisanal perforated aluminum pizza peel', 'Digital infrared laser food thermometer', 'Custom wood-deck turn scraper']
        };
      default:
        return {
          title: 'San Marzano Sauce Crafting & Toppings',
          price: 14000,
          difficulty: 'All Culinary Skill Levels',
          instructor: 'Chef Sophia Taylor',
          duration: '2.5 Hours',
          syllabus: [
            { hour: 'Hour 1', title: 'Soil Acidity & Volcanic Pomodoros', desc: 'Tasting San Marzano varieties, sieving pulp, and adjusting organic sodium levels.' },
            { hour: 'Hour 2', title: 'The Emulsion Balance', desc: 'Combining extra virgin olive oils, macerated sweet basil, and hand-pulled curds.' },
            { hour: 'Hour 3', title: 'Topping Stacking Logic', desc: 'Preventing soggy centers by regulating cheese moisture, fat releases, and heat currents.' }
          ],
          inclusions: ['Premium canned San Marzano whole tomatoes', 'Cold-pressed extra virgin olive oil bottle', 'Pizzeria apron & heavy wooden herb pestle']
        };
    }
  };

  const info = getModuleInfo();

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !bookingDate) return;
    setIsBooked(true);
    onSuccess();
  };

  return (
    <div className="space-y-12">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-red-600 text-xs font-mono font-bold uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Masterclasses
      </button>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Curricula & Inclusions */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-red-600 font-mono text-[10px] uppercase tracking-widest font-black block mb-2">NEAPOLITAN MASTERCLASS</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900 tracking-tight leading-tight">{info.title}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-xs font-mono text-neutral-500 font-bold">
              <span>⏱️ Duration: {info.duration}</span>
              <span>🎓 Skill Level: {info.difficulty}</span>
              <span>👨‍🍳 Lead: {info.instructor}</span>
            </div>
          </div>

          {/* Interactive Video Teaser Simulator */}
          <div className="rounded-3xl overflow-hidden relative aspect-video border border-neutral-200 bg-neutral-950 flex items-center justify-center group shadow-md">
            {isPlayingTeaser ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-neutral-900 text-white space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
                <p className="text-xs font-mono text-neutral-400">Streaming Masterclass Teaser Video from Lagos Kitchen Vault...</p>
                <button onClick={() => setIsPlayingTeaser(false)} className="px-4 py-1.5 bg-neutral-800 rounded-xl hover:bg-neutral-700 text-[10px] font-mono">Close Stream</button>
              </div>
            ) : (
              <>
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800" 
                  alt="Dough prep" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-neutral-950/20" />
                <button 
                  onClick={() => setIsPlayingTeaser(true)}
                  className="absolute w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-red-500 transition-all z-10"
                >
                  <Play className="w-6 h-6 fill-white ml-1" />
                </button>
                <span className="absolute bottom-4 left-6 text-[10px] font-mono text-white/80 bg-neutral-950/60 px-3 py-1 rounded-full backdrop-blur-sm">
                  ▶ Watch 45-Second Teaser with Chef Rossi
                </span>
              </>
            )}
          </div>

          {/* Syllabus Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 font-serif border-b border-neutral-200 pb-2">Hour-by-Hour Masterclass Syllabus</h3>
            <div className="space-y-4">
              {info.syllabus.map((s, index) => (
                <div key={index} className="flex gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-xs font-mono font-black text-red-600 uppercase tracking-widest block shrink-0 pt-0.5">{s.hour}</span>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">{s.title}</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourdough Bakers Kit Inclusions */}
          <div className="p-6 bg-red-50/50 border border-red-100 rounded-3xl space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-red-600 font-black flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-red-500 animate-pulse" /> Included Professional Baker's Kit
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every student is outfitted with full professional baking gear to duplicate our 36-hour cold-fermented sourdough pizza recipe back in their home kitchen.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
              {info.inclusions.map((inc, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Dynamic Price Booking Form */}
        <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div>
            <span className="text-neutral-500 text-[10px] block font-mono uppercase font-black">Interactive Form</span>
            <h3 className="text-lg font-bold text-neutral-900 font-serif">Reserve Your Sourdough Spot</h3>
            <p className="text-neutral-500 text-xs leading-normal mt-1">
              Classes are strictly capped at 10 participants per masterclass program to ensure individual wood-fired attention.
            </p>
          </div>

          {isBooked ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 rounded-2xl text-xs space-y-3 leading-relaxed">
              <h4 className="font-bold text-sm text-emerald-600">✓ Sourdough Spot Locked In!</h4>
              <p>Thank you, <strong>{name}</strong>. A masterclass seat has been locked under your phone number <strong>{phone}</strong>.</p>
              <p>We've dispatched a calendar invite to <strong>{email}</strong> including PDF manuals and flour hydration formulas.</p>
              <button 
                onClick={() => {
                  setIsBooked(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                }} 
                className="mt-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-[9px] rounded-lg uppercase"
              >
                Book Another Seat
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-neutral-600 uppercase mb-1 font-bold">Your Name</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sandra Nwachukwu"
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-red-500 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-600 uppercase mb-1 font-bold">Email Address</label>
                  <input 
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="sandra@mail.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-red-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-600 uppercase mb-1 font-bold">Phone Number</label>
                  <input 
                    type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+234 812..."
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-red-500 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-600 uppercase mb-1 font-bold">Select Date</label>
                  <input 
                    type="date" required value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-red-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-600 uppercase mb-1 font-bold">Preferred Time Slot</label>
                  <select 
                    value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none shadow-sm"
                  >
                    <option>10:00 AM - 12:00 PM</option>
                    <option>01:30 PM - 03:30 PM</option>
                    <option>05:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-600 uppercase mb-1 font-bold">Students (Cap of 10)</label>
                <input 
                  type="number" min={1} max={10} required value={studentsCount} onChange={e => setStudentsCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-red-500 shadow-sm"
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                <div>
                  <span className="text-neutral-500 text-[10px] block font-mono">Dynamic Price</span>
                  <span className="text-xl font-mono font-black text-red-600">₦{(info.price * studentsCount).toLocaleString()}</span>
                </div>
                <button type="submit" className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md">
                  Book Spot ✓
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
