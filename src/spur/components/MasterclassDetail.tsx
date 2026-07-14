import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Flame, Info, Users, Clock, Calendar, Check, 
  MapPin, HelpCircle, Award, ShieldAlert, Sparkles, BookOpen
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
  const [resName, setResName] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resGuests, setResGuests] = useState(1);
  const [resDate, setResDate] = useState('');
  const [resSuccess, setResSuccess] = useState(false);

  // Curriculum data based on active module selected
  const getModuleContent = () => {
    switch(moduleId) {
      case 'aging':
        return {
          title: 'Grill Academy: aging Science & Steak Cut Selection',
          price: 18000,
          duration: '3 Hours (Saturday Morning)',
          instructor: 'Senior Pitmaster Tunde Johnson',
          description: 'A deep-dive into beef muscle biology, the biochemistry of dry vs. wet aging, and how to select prime cuts based on intramuscular fat marbling.',
          syllabus: [
            { hour: '09:00 AM', topic: 'Pasture to Plate: Nigerian Sourcing & Feed Quality', desc: 'Understanding forage vs. grain finishes and how it impacts fat rendering profiles.' },
            { hour: '10:00 AM', topic: 'tenderness Biochemistry: Muscle to Meat aging', desc: 'Practical breakdown of myofibrillar degradation at precise temperatures to optimize chew resistance.' },
            { hour: '11:00 AM', topic: 'Anatomical Slicing: Ribeye vs Sirloin vs T-Bone', desc: 'Hand-carving primal beef ribs into clean steak cuts with appropriate fat caps.' }
          ]
        };
      case 'basting':
        return {
          title: 'Grill Academy: Basting Chemistry & Sauce Emulsification',
          price: 15000,
          duration: '2.5 Hours (Saturday Morning)',
          instructor: 'Flavor Pitmaster Sandra Alabi',
          description: 'Learn the secret culinary chemistry of Spur’s signature sweet BBQ basting, spice rubs, and how to create emulsified dipping gravies.',
          syllabus: [
            { hour: '09:00 AM', topic: 'The Sweet & Acid Balance: Sugar Caramelization', desc: 'Understanding fructose temperatures and natural vinegar balance to prevent burning on direct coals.' },
            { hour: '10:00 AM', topic: 'Spice Rub Penetration & Maillard Activation', desc: 'The science of dry curing with sea salt, brown sugars, garlic, and hot smoke extracts.' },
            { hour: '11:00 AM', topic: 'Emulsifying Warm Pepper Gravies', desc: 'Whipping hot beef drippings, heavy double creams, and Madagascar green peppercorns.' }
          ]
        };
      default:
        return {
          title: 'Grill Academy: Overhead High-Heat Infrared Searing',
          price: 20000,
          duration: '3.5 Hours (Saturday Morning)',
          instructor: 'Master Grill-General Chef Emeka Okafor',
          description: 'Master heat thermodynamics! Learn to operate direct hearth wood-fires and overhead gas infrared broilers at temperatures exceeding 300°C.',
          syllabus: [
            { hour: '09:00 AM', topic: 'Thermodynamics of Radiant Heat vs Convection', desc: 'Why hot air dries meat out, but high-intensity radiant waves sear instantly while locking in water.' },
            { hour: '10:15 AM', topic: 'Flipping Intervals & Intramuscular Temperature Curves', desc: 'Using digital thermocouple probes. Monitoring center cores for Rare, Medium Rare, and Medium.' },
            { hour: '11:30 AM', topic: 'The resting Phase & Pressure Equalization', desc: 'Why resting steak on wire racks is mandatory for fluid distribution and visual pinkness.' }
          ]
        };
    }
  };

  const module = getModuleContent();

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResSuccess(true);
    onSuccess();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-12 py-6 max-w-4xl mx-auto"
    >
      {/* Editorial Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-amber-700 hover:text-amber-600 font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Reservations
        </button>
        <span className="text-xs font-mono text-neutral-500 uppercase font-bold flex items-center gap-1">
          <Award className="w-4 h-4 text-amber-500" /> Grill-Master Academy Certificate Included
        </span>
      </div>

      {/* Hero Banner Section */}
      <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-neutral-800 shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-25 bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="relative z-10 space-y-4 max-w-xl">
          <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-black block">FLAME & BREADTH</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            {module.title}
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            {module.description} Hand-carve premium cuts, formulate spice marinades, and control extreme heat. Includes gourmet tasting lunch & vintage wine pairings.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-amber-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {module.duration}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Limited to 12 Seats</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Ikeja & Abuja Ranches</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Syllabus Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-[10px] text-amber-600 font-mono uppercase tracking-widest font-black block mb-1">THE SYLLABUS</span>
            <h2 className="text-2xl font-black text-neutral-900 font-serif">Hour-By-Hour Curriculum</h2>
            <p className="text-neutral-500 text-xs mt-1">Comprehensive hands-on training under veteran Nigerian pitmasters.</p>
          </div>

          <div className="relative pl-6 border-l border-neutral-200 space-y-6">
            {module.syllabus.map((s, index) => (
              <div key={index} className="relative bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm hover:border-neutral-300 transition-colors">
                <div className="absolute -left-[31px] top-5 w-3.5 h-3.5 rounded-full border border-white bg-amber-500 shadow-sm" />
                <div className="flex justify-between items-center text-xs mb-1 font-mono font-bold text-amber-600">
                  <span>{s.hour}</span>
                  <span className="text-neutral-400 font-normal">MODULE {index + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900">{s.topic}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed mt-2">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/50 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-neutral-950 text-xs">Pitmaster Academy Credentials</h5>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Attendees receive a personalized **Spur Grill Academy Certificate**, dry-aging chart handouts, a private-blend meat thermometer, and a master bottle of our signature basting.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Reservation Form */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-amber-600 font-mono text-[10px] uppercase tracking-widest font-black block mb-1">SECURE RESERVATION</span>
            <h3 className="text-xl font-bold text-neutral-950 font-serif">Book Academy Spot</h3>
            <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
              Spots are reserved in sequence. All kit materials, recipes, protective apron, and high-heat gloves are included in the price.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
            <span className="text-xs text-neutral-500 font-mono">Admission Fee</span>
            <span className="text-xl font-mono font-black text-amber-600">₦{module.price.toLocaleString()} <span className="text-xs text-neutral-400 font-normal font-sans">/ Student</span></span>
          </div>

          {resSuccess ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-3"
            >
              <h4 className="font-bold">✓ Spot Secured inside the Academy!</h4>
              <p className="leading-relaxed">
                A reservation confirmation email has been dispatched with pitmaster guidelines, safety waivers, and driving directions to the Ikeja/Abuja ranch grilldeck.
              </p>
              <button 
                onClick={() => setResSuccess(false)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold uppercase text-[9px] rounded-lg transition-colors"
              >
                Book Another Seat
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleLocalSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Your Full Name</label>
                <input 
                  type="text" required value={resName} onChange={e => setResName(e.target.value)}
                  placeholder="e.g. Sandra Nwachukwu"
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Email Address</label>
                <input 
                  type="email" required value={resEmail} onChange={e => setResEmail(e.target.value)}
                  placeholder="sandra@mail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Preferred Saturday</label>
                  <input 
                    type="date" required value={resDate} onChange={e => setResDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-bold">Attendees</label>
                  <input 
                    type="number" min={1} max={5} required value={resGuests} onChange={e => setResGuests(Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-xs uppercase tracking-wider font-black rounded-xl transition-all shadow-md"
              >
                Dispatch Pitmaster Booking
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
