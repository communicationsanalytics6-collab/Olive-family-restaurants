import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Award, Compass, Flame, ShieldCheck, Heart } from 'lucide-react';

interface MilestoneDetailProps {
  stageId: string;
  onBack: () => void;
}

export default function MilestoneDetail({
  stageId,
  onBack
}: MilestoneDetailProps) {

  const getMilestoneContent = () => {
    switch (stageId) {
      case 'stage1':
        return {
          title: 'Golden Spur Foundation (1967)',
          tagline: 'Crafting the Original Sizzle in Newlands',
          year: '1967',
          imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
          paragraphs: [
            'In 1967, founder Sandra Head opened the doors to the very first Golden Spur in Newlands, Cape Town, South Africa. The vision was simple: provide the public with a cozy, family-friendly steakhouse offering generous, tender portions of wood-aged meat and pristine customer service at unbeatable value.',
            'It was here that the legendary Spur basting sauce was formulated. Combining delicate fruit purees, cane molasses, refined vinegar, and proprietary spices, this basting has remained an immutable global standard for grilling beef.',
            'Sandra established the primary cooking protocol: overhead high-heat broilers, standard wet-aging thresholds, and the iconic "Plate of Chips & Crispy Onion Rings" layout that defines every single plate seared by our pitmasters.'
          ],
          achievements: [
            'Formulation of the secret sweet BBQ basting formula.',
            'Pioneered the family-oriented casual steakhouse concept.',
            'Established the 21-day wet aging standard for cuts.'
          ]
        };
      case 'stage2':
        return {
          title: 'The Family Play Canyon Evolution (1990s)',
          tagline: 'Pioneering Child-Safe Active Play Spaces',
          year: '1990s',
          imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&q=80&w=800',
          paragraphs: [
            'As Spur expanded globally during the 1980s and 1990s, the brand recognized a critical dining gap: parents wanted to enjoy high-quality grilled sirloins in peace, while children needed physical stimulation.',
            'This led to the introduction of the legendary **Spur Kids Play Canyon**—a state-of-the-art, fully supervised, indoor active physical play yard featuring climbing mazes, video games, facial painting hubs, and digital playgrounds.',
            'This architectural innovation permanently revolutionized casual dining, making Spur the ultimate destination for multi-generational birthday celebrations, family weekend rituals, and relaxed parent meetups.'
          ],
          achievements: [
            'Introduced fully-supervised indoor children play canyons.',
            'Created specialized, nutrition-balanced Kids Menu options.',
            'Won numerous global family-friendliness hospitality awards.'
          ]
        };
      default:
        return {
          title: 'Nigeria Hearth Expansion (2010s)',
          tagline: 'Bringing Premium Grills to Lagos & Abuja',
          year: '2010s',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
          paragraphs: [
            'Recognizing the sophisticated and growing culinary tastes of Nigerian diners, Spur launched full steakhouse decks in Lagos (Lekki Phase 1, Ikeja Mall) and Abuja (Wuse II).',
            'We adapted our legendary menu, combining our world-renowned sweet flame-grilled basting with local premium agricultural sourcing, high-heat overhead infrared broiling decks, and loaded platters built for sharing.',
            'Today, Spur Nigeria stands as a proud cornerstone of local celebration. We serve thousands of loaded burgers, fall-off-the-bone rib racks, and crispy hand-battered onion rings daily, preserving our high-heat heritage with unwavering consistency.'
          ],
          achievements: [
            'Imported premium heavy overhead gas infrared broilers to Lagos.',
            'Established clean local supply chains with top-tier ranches.',
            'Became Nigeria’s favorite destination for milestone family celebrations.'
          ]
        };
    }
  };

  const content = getMilestoneContent();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 py-6 max-w-3xl mx-auto"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-amber-700 hover:text-amber-600 font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Spur Story
        </button>
        <span className="text-xs font-mono text-neutral-500 uppercase font-bold">
          EST. {content.year}
        </span>
      </div>

      {/* Hero Visual Card */}
      <div className="space-y-6">
        <div className="h-64 sm:h-80 rounded-3xl overflow-hidden relative shadow-lg border border-neutral-200">
          <img 
            src={content.imageUrl} 
            alt={content.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <span className="text-amber-400 font-mono text-[10px] uppercase font-bold tracking-widest block">{content.year} BRAND MILESTONE</span>
            <h1 className="text-2xl sm:text-3xl font-black font-serif leading-tight">{content.title}</h1>
            <p className="text-neutral-300 text-xs sm:text-sm font-sans">{content.tagline}</p>
          </div>
        </div>

        {/* Narrative Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          {/* Main paragraphs */}
          <div className="md:col-span-8 space-y-5 text-sm text-neutral-600 leading-relaxed font-sans">
            {content.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Key Achievements sidebar */}
          <div className="md:col-span-4 bg-amber-50/40 border border-amber-200/50 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="font-bold text-neutral-900 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-200 pb-2">
              <Award className="w-4 h-4 text-amber-600" /> Milestone Wins
            </h3>
            <ul className="space-y-3">
              {content.achievements.map((ach, idx) => (
                <li key={idx} className="flex gap-2 text-xs leading-relaxed text-neutral-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
