import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, ArrowLeft, Check, Layers, Settings, Terminal, Lock, 
  FileText, LayoutDashboard, Database, HelpCircle, HardDrive, Cpu, ShieldCheck
} from 'lucide-react';
import { MenuItem, Store, Order, BlogPost, Promo, Feedback, UserRole, User } from '../types';

interface AdminBackendProps {
  currentUser: User;
  onSetUserRole: (role: UserRole) => void;
  menuItems: MenuItem[];
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  promos: Promo[];
  onAddPromo: (promo: Promo) => void;
  onDeletePromo: (id: string) => void;
  onTogglePromoBanner: (id: string) => void;
  blogs: BlogPost[];
  onAddBlog: (post: BlogPost) => void;
  onToggleBlogPublish: (id: string) => void;
  onToggleBlogFeatured: (id: string) => void;
  onDeleteBlog: (id: string) => void;
  feedback: Feedback[];
  onResolveFeedback: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  stores: Store[];
  onNavigate: (view: 'portal' | 'spur' | 'panarottis' | 'admin' | 'cart') => void;
}

export default function AdminBackend({
  currentUser,
  onNavigate
}: AdminBackendProps) {
  return (
    <div id="admin-portal" className="bg-[#050505] text-neutral-100 min-h-screen font-sans">
      
      {/* Top Banner Navigation */}
      <nav className="bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-40 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => onNavigate('portal')}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Brand Portal
          </button>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              Environment: Staging-v1.0.0
            </span>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        
        {/* Prominent Construction Message */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 border border-amber-500/30 rounded-full mb-2">
            <Shield className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-white uppercase">
            Administration portal will commence development later.
          </h1>
          <p className="text-sm font-mono text-neutral-400 max-w-xl mx-auto uppercase tracking-wider">
            Below is the comprehensive roadmap detailing all technical functionalities and administrative controls slated for integration.
          </p>
        </motion.div>

        {/* Categories Nested Lists Section (Just lists, no writeups) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: User Identity & RBAC Engine */}
          <div className="p-8 rounded-3xl border border-neutral-800 bg-neutral-950/50 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
              <Lock className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-white">
                1. User Identity & Role Access Control
              </h2>
            </div>
            <ul className="space-y-4 text-xs font-mono text-neutral-400">
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Super Administrator full override dashboard</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Hierarchical Brand-specific Editorial roles</span>
                <ul className="pl-6 pt-2 space-y-2 list-disc list-inside border-l border-neutral-800 ml-2">
                  <li>Spur Steakhouse Editor role</li>
                  <li>Panarottis Pizzeria Editor role</li>
                  <li>Cross-brand Marketing Campaign Designer</li>
                </ul>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>System Audits and Security Log Tracking</span>
                <ul className="pl-6 pt-2 space-y-2 list-disc list-inside border-l border-neutral-800 ml-2">
                  <li>Timestamped record of all menu edits</li>
                  <li>User login IP address telemetry</li>
                  <li>Active security session expiration triggers</li>
                </ul>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Multi-factor authentication (MFA) parameters</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Interactive Menu CMS */}
          <div className="p-8 rounded-3xl border border-neutral-800 bg-neutral-950/50 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
              <Layers className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-white">
                2. Interactive Menu CMS Engine
              </h2>
            </div>
            <ul className="space-y-4 text-xs font-mono text-neutral-400">
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Real-time menu item ingestion & deletion</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Price matrices, VAT & surcharge modifiers</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Dynamic Preparation Time controller per dish</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Asset and media repository control</span>
                <ul className="pl-6 pt-2 space-y-2 list-disc list-inside border-l border-neutral-800 ml-2">
                  <li>Compressor optimization for high-res images</li>
                  <li>CDN asset cache-busting automated flow</li>
                  <li>Alt-text accessibility metadata tags</li>
                </ul>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Seasonal menu scheduled automatic releases</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Live Orders Desk */}
          <div className="p-8 rounded-3xl border border-neutral-800 bg-neutral-950/50 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
              <Terminal className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-white">
                3. Live Order Dispatch Control Desk
              </h2>
            </div>
            <ul className="space-y-4 text-xs font-mono text-neutral-400">
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Active WebSocket incoming order feed pipeline</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>State transition overrides for kitchen pipeline</span>
                <ul className="pl-6 pt-2 space-y-2 list-disc list-inside border-l border-neutral-800 ml-2">
                  <li>Pending review validation gates</li>
                  <li>Kitchen preparation active timers</li>
                  <li>Ready-to-serve courier pickup triggers</li>
                  <li>Dispatched real-time status updates</li>
                </ul>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Courier rider tracking maps & geofences</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Post-purchase ticket logging, voids & refunds</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Campaigns Studio */}
          <div className="p-8 rounded-3xl border border-neutral-800 bg-neutral-950/50 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
              <FileText className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-white">
                4. Promotions & Campaigns Studio
              </h2>
            </div>
            <ul className="space-y-4 text-xs font-mono text-neutral-400">
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Promo code generators and percentage math rules</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Interactive main advertisement slider CMS</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Sizzle Newsletter broadcasting interface</span>
                <ul className="pl-6 pt-2 space-y-2 list-disc list-inside border-l border-neutral-800 ml-2">
                  <li>Subscriber segmentation mechanics</li>
                  <li>Draft saving and calendar post schedulers</li>
                  <li>Email click-through tracking reports</li>
                </ul>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>User cohort targeting rules & coupon limits</span>
              </li>
            </ul>
          </div>

          {/* Card 5: Outlet Locator Settings */}
          <div className="p-8 rounded-3xl border border-neutral-800 bg-neutral-950/50 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
              <LayoutDashboard className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-white">
                5. Outlet Locator & Store Setup
              </h2>
            </div>
            <ul className="space-y-4 text-xs font-mono text-neutral-400">
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Add, update, and close physical branch markers</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Dynamic Opening & Closing hour schedules</span>
                <ul className="pl-6 pt-2 space-y-2 list-disc list-inside border-l border-neutral-800 ml-2">
                  <li>Holiday override calendars</li>
                  <li>Delivery zone polygon boundaries on live maps</li>
                </ul>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Store density busy-states (Express kitchen toggler)</span>
              </li>
            </ul>
          </div>

          {/* Card 6: Chronicles & Feedback Monitor */}
          <div className="p-8 rounded-3xl border border-neutral-800 bg-neutral-950/50 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
              <Settings className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-white">
                6. Chronicles Blog & Feedback Monitor
              </h2>
            </div>
            <ul className="space-y-4 text-xs font-mono text-neutral-400">
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Rich Text Article Composer for Editorial Chronicles</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Aggregate customer feedback dashboard queue</span>
                <ul className="pl-6 pt-2 space-y-2 list-disc list-inside border-l border-neutral-800 ml-2">
                  <li>Complaint ticket routing engine</li>
                  <li>Support staff task assignment</li>
                  <li>Historical resolution metrics logs</li>
                </ul>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Profanity filter parameters and moderator desk</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-neutral-800" />

        {/* Bottom Conceptual Writeups Section */}
        <div className="space-y-12 max-w-4xl mx-auto">
          
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-black">
              Section 01 // Structural Paradigm
            </span>
            <h3 className="text-2xl font-sans font-extrabold text-white uppercase">
              Ecosystem Philosophy & Scalable Management Architecture
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              The administrative ecosystem of Olive Family Restaurants Nigeria is engineered around a unified, dual-brand architectural core. While Spur Steakhouse and Panarottis Pizzeria retain highly optimized and distinctive customer-facing visual identities, their transactional data, content updates, store parameters, and campaign metrics are piped through a singular database model. This strategy ensures seamless, lag-free coordination between kitchen operations, inventory records, and public-facing price tickers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-mono text-xs uppercase font-black">
                <Database className="w-4 h-4 text-amber-500" /> Relational Cores
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Centralized database indices mapping user feedback, active orders, and promotional vouchers are securely structured to enable rapid, cross-referenced queries.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-mono text-xs uppercase font-black">
                <Cpu className="w-4 h-4 text-amber-500" /> Live Webhooks
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Kitchen display networks will utilize responsive events to trigger delivery estimations and instant notifications for waiting diners and courier riders.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-mono text-xs uppercase font-black">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> Strictest Security
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                All future administrative mutations require secure, multi-layered role privileges matching Super Admins, Spur editors, and Panarottis publishers.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/60 text-xs text-neutral-500 font-mono leading-relaxed">
            Note: This staging document is a blueprint layout. Once the core digital experiences for Spur Steakhouse and Panarottis Pizzeria are fully finalized and vetted by the client management teams, database synchronization models and live CMS actions will transition to production.
          </div>

        </div>

      </div>
    </div>
  );
}
