import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Volume2, VolumeX, ArrowRight, Clipboard, Check, 
  Clock, AlertTriangle, AlertCircle, Play, Pause, RotateCcw, Sparkles, SkipForward,
  CheckCircle, ChevronRight, BookOpen, Layers, Milestone, Lock, MapPin, ExternalLink,
  Scale, FileText, X
} from 'lucide-react';
import { saveVisitorAgreement } from '../lib/db';

interface ScaffoldPresenterProps {
  onAccessGranted: (timeRemainingSeconds: number) => void;
}

export default function ScaffoldPresenter({ onAccessGranted }: ScaffoldPresenterProps) {
  // Check if session has expired to direct user to the authorization step
  const [sessionExpired, setSessionExpired] = useState<boolean>(() => {
    return sessionStorage.getItem('scaffoldSessionExpired') === 'true';
  });

  const [step, setStep] = useState<'welcome' | 'overview' | 'agreement' | 'access'>(() => {
    return sessionStorage.getItem('scaffoldSessionExpired') === 'true' ? 'access' : 'welcome';
  });
  const [overviewSubStep, setOverviewSubStep] = useState<number>(0);
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [audioPlayed, setAudioPlayed] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [copiedName, setCopiedName] = useState<boolean>(false);
  const [copiedPass, setCopiedPass] = useState<boolean>(false);

  // Visitor Agreement Fields
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorEmail, setVisitorEmail] = useState<string>('');
  const [visitorCompany, setVisitorCompany] = useState<string>('Olive Family Restaurants');
  const [isSavingAgreement, setIsSavingAgreement] = useState<boolean>(false);
  const [agreementError, setAgreementError] = useState<string | null>(null);
  
  // Login Form States
  const [accessName, setAccessName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(15); // Fallback to 15s if audio is empty draft
  const [audioFinished, setAudioFinished] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize simulated timer tick when playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= duration) {
            setIsPlaying(false);
            setAudioFinished(true);
            return duration;
          }
          return next;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  // Load and control HTML5 Audio safely
  useEffect(() => {
    const audio = new Audio('/scaffold/audio.mp3');
    audio.volume = 1.0;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioFinished(true);
      setCurrentTime(audio.duration || 15);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setAudioPlayed(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Try auto-play on initial load
    const timer = setTimeout(() => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setAudioPlayed(true);
          setAudioError(null);
        })
        .catch((err) => {
          console.warn('Autoplay restricted by browser, user can play manually:', err);
        });
    }, 1500);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTime >= duration) {
        setCurrentTime(0);
        audioRef.current.currentTime = 0;
        setAudioFinished(false);
      }
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.warn("Real audio play failed, starting playback simulation:", err);
          setIsPlaying(true);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (value < duration) {
      setAudioFinished(false);
    } else {
      setAudioFinished(true);
      setIsPlaying(false);
    }
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = value;
      } catch (err) {
        console.warn("Seek error:", err);
      }
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopy = (text: string, type: 'name' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'name') {
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessName.trim() === 'Olive Family' && password === 'olivefamilyecosystem') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Clear session expired status
      sessionStorage.removeItem('scaffoldSessionExpired');
      onAccessGranted(1800); // 30 minutes access
    } else {
      setFormError('Invalid access name or password. Please use the credentials provided below.');
    }
  };

  const handleProceedToCredentials = async () => {
    if (!hasAgreed) return;
    if (!visitorName.trim()) {
      setAgreementError('Please enter your full name to proceed.');
      return;
    }

    setIsSavingAgreement(true);
    setAgreementError(null);

    try {
      const agreementData = {
        id: 'agree_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        visitorName: visitorName.trim(),
        visitorEmail: '',
        visitorCompany: visitorCompany.trim() || 'Olive Family Restaurants',
        userAgent: navigator.userAgent || 'Unknown Browser',
        agreed: true,
        agreedAt: new Date().toISOString(),
        legalVersion: 'v1.2-collaborative'
      };

      await saveVisitorAgreement(agreementData);
      setStep('access');
    } catch (err) {
      console.error('Failed to document agreement in database:', err);
      setAgreementError('Unable to document agreement due to a temporary network issue. Please try again.');
    } finally {
      setIsSavingAgreement(false);
    }
  };

  const overviewSubSteps = [
    {
      title: "Executive Summary & Mission Overview",
      icon: <BookOpen className="w-8 h-8 text-[#FF4625]" />,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-mono tracking-widest text-[#10B981] uppercase font-bold">Scope Context</span>
            <h4 className="text-neutral-900 font-bold text-lg mt-1 mb-2">Proposed High-Fidelity Solution Concept</h4>
            <p className="text-neutral-600 text-xs leading-relaxed">
              This interactive digital platform is a proposed concept designed for <strong className="text-neutral-900 font-bold">Olive Family Restaurants Nigeria</strong>. It serves as a proof-of-concept demonstrating a proposed integrated, multi-brand digital ecosystem to demonstrate how operations could consolidate while honoring the distinctive identities of <strong className="text-neutral-900 font-bold">Spur Steakhouse</strong> and <strong className="text-neutral-900 font-bold">Panarottis Pizzeria</strong>. All designs are drafts subject to technical feasibility and final scope signoff.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-mono tracking-widest text-[#FF4625] uppercase font-bold">Strategic Partnership</span>
            <h4 className="text-neutral-900 font-bold text-lg mt-1 mb-2">Design Mode Proposed Solutions</h4>
            <p className="text-neutral-600 text-xs leading-relaxed">
              We appreciate the scale of Olive's operations, regional logistics, and localized consumer trends. This prototype demonstrates conceptual workflows for a highly polished digital solution matching your strategic goals. Features shown here represent proposed designs and interactive draft templates for evaluation and discussion.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Ecosystem Architecture Capabilities",
      icon: <Layers className="w-8 h-8 text-[#10B981]" />,
      content: (
        <div className="space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-[#FF4625] uppercase font-bold">Feature Lists (Interactive Ecosystem Overview)</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:border-[#10B981]/50 transition-all">
              <span className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider block mb-3 border-b border-neutral-100 pb-1">1. Unified Brand Portal Hub</span>
              <ul className="space-y-2 text-[11px] font-mono text-neutral-600 list-none pl-0">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Automated Promotion Sliders</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Chronicles Editorial System</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Live Feedback Tickets</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Store Locator Maps</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:border-[#FF4625]/50 transition-all">
              <span className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider block mb-3 border-b border-neutral-100 pb-1">2. Spur Steakhouse Site</span>
              <ul className="space-y-2 text-[11px] font-mono text-neutral-600 list-none pl-0">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4625]" /> Sizzling Grill Slider</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4625]" /> Menu Item Quick-Carts</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4625]" /> Table Reservations</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4625]" /> Review Feeds</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:border-[#FF4625]/50 transition-all">
              <span className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider block mb-3 border-b border-neutral-100 pb-1">3. Panarottis Pizzeria Site</span>
              <ul className="space-y-2 text-[11px] font-mono text-neutral-600 list-none pl-0">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4625]" /> Right-Stacked Pizza Selector</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4625]" /> Gourmet Pizza Slider</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4625]" /> Interactive Checkout</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4625]" /> Order Status Tracking</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:border-[#10B981]/50 transition-all">
              <span className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider block mb-3 border-b border-neutral-100 pb-1">4. Staging Administration CMS</span>
              <ul className="space-y-2 text-[11px] font-mono text-neutral-600 list-none pl-0">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Unified Menu Manager</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Live Kitchen Queue</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Promo Generator Tool</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Audit Logs</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-500 leading-relaxed italic">
            * All database-driven modules shown in the prototype communicate in real-time with our Google Firestore database cloud cluster. Back-office CMS modifications immediately broadcast update pulses across the brand sites.
          </div>
        </div>
      )
    },
    {
      title: "16-Week (4 Months) Implementation Milestones",
      icon: <Milestone className="w-8 h-8 text-[#FF4625]" />,
      content: (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FF4625] uppercase font-bold">Project Timeline Delivery</span>
            <span className="text-[10px] font-mono bg-[#10B981]/10 text-[#10B981] font-bold px-2.5 py-0.5 rounded-full">
              16-Week (4 Months) Development & QA Period
            </span>
          </div>
          
          <div className="relative pl-6 border-l-2 border-[#FF4625]/20 space-y-4 font-mono text-[11px]">
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#FF4625] border-4 border-white flex items-center justify-center" />
              <span className="text-[#FF4625] font-bold block">MONTH 1 // WEEKS 1 - 4</span>
              <span className="text-neutral-900 block font-sans font-bold text-xs mt-0.5">Database Engineering & Core API Integrations</span>
              <ul className="text-neutral-500 list-disc pl-4 mt-1 space-y-1">
                <li>Firebase blueprint schema provisioning</li>
                <li>Relational database scaling configs</li>
                <li>Unified brand portal routing engines</li>
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#FF4625]/70 border-4 border-white flex items-center justify-center" />
              <span className="text-[#FF4625]/80 font-bold block">MONTH 2 // WEEKS 5 - 8</span>
              <span className="text-neutral-900 block font-sans font-bold text-xs mt-0.5">Customized Brand Experience Portals & Menu CMS</span>
              <ul className="text-neutral-500 list-disc pl-4 mt-1 space-y-1">
                <li>Distinct visual templates (Spur Slate / Panarottis Modern)</li>
                <li>Dynamic preparation time modifier rules</li>
                <li>Media CDN compression engines</li>
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#FF4625]/40 border-4 border-white flex items-center justify-center" />
              <span className="text-[#FF4625]/60 font-bold block">MONTH 3 // WEEKS 9 - 12</span>
              <span className="text-neutral-900 block font-sans font-bold text-xs mt-0.5">Live Dispatcher Terminal, Auditing Log & Notification Engines</span>
              <ul className="text-neutral-500 list-disc pl-4 mt-1 space-y-1">
                <li>Active WebSocket order feeds</li>
                <li>Stage-by-stage kitchen status transitions</li>
                <li>Security audit log tracking and automated alerts</li>
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#10B981] border-4 border-white flex items-center justify-center" />
              <span className="text-[#10B981] font-bold block">MONTH 4 // WEEKS 13 - 16 (QUALITY ASSURANCE)</span>
              <span className="text-neutral-900 block font-sans font-bold text-xs mt-0.5">Rigorous System Simulation & Geofenced Trials</span>
              <ul className="text-neutral-500 list-disc pl-4 mt-1 space-y-1">
                <li>Geofenced delivery maps stress testing</li>
                <li>Multi-level role training guides</li>
                <li>Deployment onto Google Cloud Run staging containers</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-500 leading-relaxed italic">
            * Draft Milestone Roadmap: This 16-week outline serves as a proposed roadmap for planning and illustration. Actual delivery timelines, phase dependencies, technical constraints, and scope are subject to formal Statement of Work (SOW) agreements and final contract terms. This schedule is non-binding and does not establish operational liability for Design Mode.
          </div>
        </div>
      )
    }
  ];

  return (
    <div 
      className="bg-[#FAF9F6] text-neutral-800 min-h-screen relative overflow-hidden flex flex-col justify-between"
      style={{ fontFamily: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif" }}
    >
      
      {/* Session Expired Banner */}
      {sessionExpired && (
        <div className="bg-red-50 border-b border-red-200 p-3.5 text-center text-sm font-sans text-red-600 flex items-center justify-center gap-2 z-50 relative">
          <AlertCircle className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
          <span><strong>SESSION EXPIRED:</strong> Your 30-minute prototype staging session has expired. Please enter the credentials below to experience the prototype again.</span>
          <button 
            onClick={() => {
              sessionStorage.removeItem('scaffoldSessionExpired');
              setSessionExpired(false);
            }}
            className="underline hover:text-red-800 ml-2 font-bold uppercase tracking-wider text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dynamic Ambient Background Sparkles / Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,70,37,0.04),transparent_60%)] pointer-events-none" />
      <div className="absolute -left-1/4 top-1/4 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -right-1/4 bottom-1/4 w-[500px] h-[500px] bg-[#FF4625]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar with Centered Bold Logo */}
      <header className="p-6 lg:px-8 max-w-7xl w-full mx-auto flex justify-center items-center z-10 relative">
        <div className="flex flex-col items-center gap-1.5">
          <img 
            src="/scaffold/dm_logo.png" 
            alt="Design Mode Logo" 
            className="h-16 sm:h-20 w-auto object-contain hover:scale-105 transition-transform duration-300 filter drop-shadow-md"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] font-mono tracking-widest text-[#FF4625] uppercase font-bold animate-pulse">
            HIGH-FIDELITY ACTIVE STAGING
          </span>
        </div>
      </header>

      {/* Main Scaffold Interactive Slides */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10 relative">
        <div className="max-w-4xl w-full">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WELCOME INTRO */}
            {step === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#FF4625] inline-block">
                    DIGITAL STRATEGY PRESENTATION
                  </span>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans font-black tracking-tight text-neutral-900 uppercase max-w-full mx-auto leading-none whitespace-nowrap overflow-hidden text-ellipsis px-4">
                    OLIVE FAMILY ECOSYSTEM
                  </h1>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans font-black tracking-tight uppercase max-w-full mx-auto leading-none mt-2">
                    <span className="bg-gradient-to-r from-[#FF4625] via-amber-500 to-[#10B981] bg-clip-text text-transparent">
                      DIGITAL EXPERIENCE
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm font-sans text-neutral-600 max-w-xl mx-auto font-light leading-relaxed px-4">
                    Designed for Nigeria's premier family dining brands. A tailored high-fidelity system prototype demonstrating how we address and exceed your operational needs.
                  </p>
                </div>

                {/* Custom Seekable Audio Player with Waveform Effect (Moved ABOVE disclaimer & made smaller/shorter) */}
                <div className="max-w-md mx-auto p-4 rounded-xl border border-neutral-200 bg-white shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      AUDIO PRESENTATION DRAFT
                    </span>
                    <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-[#FF4625] animate-ping' : 'bg-neutral-300'}`} />
                  </div>

                  {/* Shorter Wave style effects */}
                  <div className="flex items-end justify-between gap-1 h-8 px-2">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const baseHeight = 4 + Math.sin(i * 0.35) * 8 + (i % 3 === 0 ? 4 : 0);
                      const randomBounce = isPlaying ? Math.random() * 6 : 0;
                      const isActive = (currentTime / duration) * 28 >= i;
                      
                      return (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-150 ${
                            isActive 
                              ? 'bg-[#FF4625]' 
                              : 'bg-neutral-200'
                          }`}
                          style={{
                            height: `${Math.min(20, baseHeight + randomBounce)}px`,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Audio Timeline Scrub Bar */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[#FF4625] bg-neutral-200"
                      style={{
                        background: `linear-gradient(to right, #FF4625 0%, #FF4625 ${(currentTime / duration) * 100}%, #E5E7EB ${(currentTime / duration) * 100}%, #E5E7EB 100%)`
                      }}
                    />
                    <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Playback Controls & Presenter Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTogglePlay}
                        className="h-8 w-8 rounded-full bg-[#FF4625] text-white flex items-center justify-center hover:bg-[#E03A1B] hover:scale-105 active:scale-95 transition-all shadow-md shrink-0"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current text-white" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-white" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setCurrentTime(0);
                          if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                          }
                          setAudioFinished(false);
                        }}
                        className="h-7 w-7 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 flex items-center justify-center transition-all"
                        title="Restart"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                        PRESENTER
                      </span>
                      <span className="text-[11px] font-sans font-bold text-neutral-800 block">
                        Victor Okwong
                      </span>
                    </div>
                  </div>
                </div>

                {/* Draft Content & General Web Source Disclaimer (Centered) */}
                <div className="max-w-2xl mx-auto p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-center space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-amber-800 font-bold text-xs uppercase font-sans">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Evaluation Draft & Prototype Disclaimer</span>
                  </div>
                  <p className="text-neutral-600 text-xs leading-relaxed font-sans text-center">
                    Please note that all content, menu items, prices, operational logistics, and system information within this prototype are initial drafts created for testing purposes. Some brand materials and details were sourced from the general web for illustrative clarity. This system does not represent final production-ready binding data.
                  </p>
                </div>

                <div className="pt-2 flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      if (audioFinished) {
                        setStep('overview');
                      }
                    }}
                    disabled={!audioFinished}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold transition-all shadow-sm group ${
                      audioFinished 
                        ? 'bg-[#FF4625] text-white hover:bg-[#E03A1B] cursor-pointer' 
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300 opacity-60'
                    }`}
                  >
                    {audioFinished ? 'Proceed to Overview' : 'Listening to Audio...'} <ArrowRight className={`w-4 h-4 ${audioFinished ? 'text-white group-hover:translate-x-1 transition-transform' : 'text-neutral-400'}`} />
                  </button>
                  {!audioFinished && (
                    <span className="text-[10px] text-[#FF4625] font-mono animate-pulse uppercase tracking-wider font-bold">
                      * Waiting for audio presentation to complete
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: PROJECT OVERVIEW (PROGRESSIVE SLIDES) */}
            {step === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#FF4625]/5 border border-[#FF4625]/10 rounded-xl">
                      {overviewSubSteps[overviewSubStep].icon}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-sans font-black tracking-tight text-neutral-900 uppercase">
                        {overviewSubSteps[overviewSubStep].title}
                      </h3>
                      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                        Project Overview // Stage {overviewSubStep + 1} of {overviewSubSteps.length}
                      </p>
                    </div>
                  </div>

                  {/* Progressive Dots */}
                  <div className="flex items-center gap-2">
                    {overviewSubSteps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setOverviewSubStep(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${overviewSubStep === idx ? 'w-8 bg-[#FF4625]' : 'w-2 bg-neutral-200 hover:bg-neutral-300'}`}
                        title={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Slide Body */}
                <div className="min-h-[350px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={overviewSubStep}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3 }}
                    >
                      {overviewSubSteps[overviewSubStep].content}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Slide Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                  <button
                    onClick={() => {
                      if (overviewSubStep > 0) {
                        setOverviewSubStep(prev => prev - 1);
                      } else {
                        setStep('welcome');
                      }
                    }}
                    className="px-5 py-2 rounded-full border border-neutral-200 bg-white text-xs font-mono font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => {
                      if (overviewSubStep < overviewSubSteps.length - 1) {
                        setOverviewSubStep(prev => prev + 1);
                      } else {
                        setStep('agreement');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF4625] text-white text-xs font-mono font-bold hover:bg-[#E03A1B] transition-all duration-200 group"
                  >
                    {overviewSubStep < overviewSubSteps.length - 1 ? 'Next Stage' : 'Review Agreement'}
                    <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PROPRIETARY SYSTEM ACCESS AGREEMENT STEP */}
            {step === 'agreement' && (
              <motion.div
                key="agreement"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-[#FF4625]/5 border border-[#FF4625]/10 rounded-2xl mb-1">
                    <Scale className="w-6 h-6 text-[#FF4625]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-sans font-black tracking-tight text-neutral-900 uppercase">
                    Proprietary Design Agreement
                  </h3>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">
                    CONFIDENTIALITY & CONCEPTUAL INTELLECTUAL PROPERTY PROTECTION
                  </p>
                </div>

                {agreementError && (
                  <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-2 items-start text-xs text-red-600 font-mono">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                    <span>{agreementError}</span>
                  </div>
                )}

                <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm space-y-4">
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    To evaluate this high-fidelity multi-brand interactive model, Olive Family Restaurants Nigeria and Design Mode establish a framework of professional trust.
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    All original concept flows, administrative unified control workflows, specific visual mechanics, and staging setups created for this presentation represent proprietary designs. Access requires acknowledging our mutual agreement to protect this innovative conceptual architecture.
                  </p>

                  <div className="pt-1">
                    <button
                      onClick={() => setShowTermsModal(true)}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF4625] hover:text-[#E03A1B] transition-colors group animate-pulse"
                      type="button"
                    >
                      <FileText className="w-4 h-4 text-[#FF4625]" />
                      <span className="underline group-hover:no-underline">Read Detailed Terms & Legal Protections</span>
                    </button>
                  </div>
                </div>

                {/* Evaluator Credentials Form */}
                <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm space-y-4">
                  <h4 className="text-xs font-mono font-black text-neutral-800 uppercase tracking-widest border-b border-neutral-100 pb-2">
                    Authorized Evaluator Information
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                        Full Name <span className="text-[#FF4625]">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={visitorName}
                        onChange={(e) => {
                          setVisitorName(e.target.value);
                          setAgreementError(null);
                        }}
                        placeholder="e.g. Kola Ibrahim"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#FF4625] focus:bg-white transition-all"
                        required
                        disabled={isSavingAgreement}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                        Company / Organization
                      </label>
                      <input 
                        type="text" 
                        value={visitorCompany}
                        onChange={(e) => {
                          setVisitorCompany(e.target.value);
                          setAgreementError(null);
                        }}
                        placeholder="e.g. Olive Family Restaurants"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#FF4625] focus:bg-white transition-all"
                        disabled={isSavingAgreement}
                      />
                    </div>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="p-5 rounded-2xl border border-neutral-200 bg-[#FF4625]/5 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="accept-terms-checkbox"
                      checked={hasAgreed}
                      onChange={(e) => setHasAgreed(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#FF4625] focus:ring-[#FF4625] cursor-pointer accent-[#FF4625]"
                      disabled={isSavingAgreement}
                    />
                    <span className="text-xs text-neutral-700 leading-normal font-sans">
                      I have read, understood, and agree to the <strong className="text-neutral-900">Proprietary Evaluation & Collaborative Trust Framework</strong>. I acknowledge that the dynamic layouts, cross-brand architectures, and bespoke operational workflows demonstrated in this prototype represent the creative craftsmanship of Design Mode, and we agree to honor Design Mode's ownership of these pre-project concepts.
                    </span>
                  </label>
                </div>

                {/* Navigation Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => setStep('overview')}
                    className="px-5 py-2 rounded-full border border-neutral-200 bg-white text-xs font-mono font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
                    disabled={isSavingAgreement}
                  >
                    Back
                  </button>

                  <button
                    onClick={handleProceedToCredentials}
                    disabled={!hasAgreed || isSavingAgreement}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-bold transition-all duration-200 group ${
                      hasAgreed && !isSavingAgreement
                        ? 'bg-[#FF4625] text-white hover:bg-[#E03A1B] cursor-pointer'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300 opacity-60'
                    }`}
                  >
                    {isSavingAgreement ? 'Securing Session...' : 'Proceed to Access Credentials'}
                    {!isSavingAgreement && (
                      <ChevronRight className={`w-4 h-4 ${hasAgreed ? 'text-white group-hover:translate-x-1 transition-transform' : 'text-neutral-400'}`} />
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SYSTEM ACCESS */}
            {step === 'access' && (
              <motion.div
                key="access"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="max-w-md mx-auto space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-[#10B981]/5 border border-[#10B981]/10 rounded-2xl mb-1">
                    <Lock className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-sans font-black tracking-tight text-neutral-900 uppercase">
                    Enter Prototype Session
                  </h3>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">
                    Use Staging visitor credentials below to gain instant entry
                  </p>
                </div>

                {/* Interactive Click-to-Copy Credentials Box (Moved to Top) */}
                <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm text-center space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#FF4625] font-bold">
                    Staging Visitor Credentials (Click to copy)
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleCopy('Olive Family', 'name')}
                      className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/50 text-left transition-all relative overflow-hidden group"
                      type="button"
                    >
                      <span className="text-[8px] font-mono uppercase text-neutral-400 block">Access Name</span>
                      <span className="text-[11px] font-mono text-neutral-900 font-bold block truncate mt-0.5">Olive Family</span>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedName ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Clipboard className="w-3.5 h-3.5 text-neutral-400" />}
                      </div>
                    </button>

                    <button
                      onClick={() => handleCopy('olivefamilyecosystem', 'pass')}
                      className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/50 text-left transition-all relative overflow-hidden group"
                      type="button"
                    >
                      <span className="text-[8px] font-mono uppercase text-neutral-400 block">Password</span>
                      <span className="text-[11px] font-mono text-neutral-900 font-bold block truncate mt-0.5 text-ellipsis">olivefamilyecosystem</span>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedPass ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Clipboard className="w-3.5 h-3.5 text-neutral-400" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Staging Access Form */}
                <form onSubmit={handleLoginSubmit} className="p-8 rounded-3xl border border-neutral-200 bg-white shadow-xl space-y-6">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-2 items-start text-xs text-red-600 font-mono">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                        Access Name
                      </label>
                      <input 
                        type="text" 
                        value={accessName}
                        onChange={(e) => {
                          setAccessName(e.target.value);
                          setFormError(null);
                        }}
                        placeholder="e.g. Olive Family"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#FF4625] focus:bg-white transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                        Password Key
                      </label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setFormError(null);
                        }}
                        placeholder="•••••••••••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#FF4625] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#FF4625] text-white text-xs font-mono font-bold hover:bg-[#E03A1B] transition-colors shadow-lg shadow-[#FF4625]/10 active:scale-95 uppercase tracking-wider"
                  >
                    Experience Prototype
                  </button>
                </form>

                {/* Back Link */}
                <div className="text-center">
                  <button
                    onClick={() => setStep('agreement')}
                    className="text-xs font-mono font-bold text-neutral-500 hover:text-neutral-900 hover:underline uppercase tracking-wider"
                  >
                    ← Back to Agreement
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* Footer Branding Section */}
      <footer className="p-6 max-w-7xl w-full mx-auto border-t border-neutral-200/60 text-center z-10 relative">
        <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
          Olive Family Restaurants Nigeria • Unified Digital Ecosystem Prototype v1.0.0
        </p>
      </footer>

      {/* LEGAL TERMS MODAL DIALOG */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FF4625]/10 rounded-lg">
                    <Scale className="w-5 h-5 text-[#FF4625]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-black text-neutral-900 uppercase tracking-tight">
                      Proprietary Information Agreement
                    </h4>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                      STAGING EVALUATION TERMS & CONDITIONS
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="p-2 rounded-full hover:bg-neutral-200/80 text-neutral-400 hover:text-neutral-700 transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-600 leading-relaxed font-sans max-h-[calc(85vh-160px)]">
                <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-xl space-y-2">
                  <p className="font-bold text-neutral-800">
                    COLLABORATIVE DESIGN TRUST NOTICE:
                  </p>
                  <p>
                    Welcome to the Olive Family Restaurants interactive presentation. This prototype represents a shared vision of digital innovation. To maintain a secure, professional, and collaborative environment, access is provided under the following standard mutual design-use protections.
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] border-b border-neutral-100 pb-1 flex items-center gap-2">
                    <span className="text-[#FF4625]">1.</span> Stewardship of Bespoke Design and Architecture
                  </h5>
                  <p>
                    The complete design language, visual layouts, multi-brand synchronization mechanics (including the interactive pizza customizer, automated promotional broad-casters, and admin control dashboards), underlying code structure, data schemas, and strategic UX copy shown in this prototype are custom creative works developed by <strong className="text-neutral-800">Design Mode</strong>. They represent creative craftsmanship and proprietary strategic designs of Design Mode.
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] border-b border-neutral-100 pb-1 flex items-center gap-2">
                    <span className="text-[#FF4625]">2.</span> Confidential Evaluation License
                  </h5>
                  <p>
                    This staging environment is provided for the sole, confidential purpose of evaluating a potential strategic partnership with <strong className="text-neutral-800">Design Mode</strong>. Visitors are granted a welcoming, personal, non-transferable, revocable license to interact with this prototype. To safeguard this innovative project stage, we ask that you avoid copying, distributing, taking unauthorized screen recordings, or sharing credentials outside of the designated Olive Family evaluation committee.
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] border-b border-neutral-100 pb-1 flex items-center gap-2">
                    <span className="text-[#FF4625]">3.</span> Commitment to Professional Collaboration
                  </h5>
                  <p>
                    These design drafts represent a blueprint of digital capability. In the event that the client chooses to implement or launch a public system featuring the custom visual interfaces, multi-brand architectures, layout structures, or specific cross-brand sync mechanics demonstrated in this prototype, both parties agree to partner professionally with <strong className="text-neutral-800">Design Mode</strong> to develop the project, or secure a mutual design-use license. This ensures correct architectural standards and recognizes Design Mode's ownership of these pre-project concepts.
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] border-b border-neutral-100 pb-1 flex items-center gap-2">
                    <span className="text-[#FF4625]">4.</span> Legal Harmony & Standards
                  </h5>
                  <p>
                    By establishing this common understanding, both parties support ethical innovation and creative rights. These terms align with the <strong className="text-neutral-800">Nigerian Copyright Act 2023</strong>, civil trade secret doctrines, and international intellectual property treaties including the <strong className="text-neutral-800">WIPO Copyright Treaty</strong> and the <strong className="text-neutral-800">Berne Convention</strong>. Design Mode retains proprietary claim to pre-project concepts and is entitled to standard legal, civil, and equitable remedies to address unauthorized replication.
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] border-b border-neutral-100 pb-1 flex items-center gap-2">
                    <span className="text-[#FF4625]">5.</span> Strategic Alignment
                  </h5>
                  <p>
                    We believe that the most successful projects are built on a foundation of professional respect. These guidelines are standard practices that protect your interests as a premium food brand and ours as design technologists, facilitating an open, high-confidence staging assessment.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => {
                    setHasAgreed(true);
                    setShowTermsModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#FF4625] text-white text-xs font-mono font-bold hover:bg-[#E03A1B] transition-colors uppercase tracking-wider"
                  type="button"
                >
                  Agree & Close
                </button>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-600 text-xs font-mono font-bold hover:bg-neutral-50 transition-colors uppercase tracking-wider"
                  type="button"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
