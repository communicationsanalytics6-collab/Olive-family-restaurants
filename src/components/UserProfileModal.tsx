import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, Mail, Phone, MapPin, Key, LogOut, X, 
  ShoppingBag, Shield, Check, Plus, AlertCircle, Trash2 
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { User, Order } from '../types';
import { PANAROTTIS_LOGO } from '../data/base64Images';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onNavigate: (view: any) => void;
  onUpdateProfile: (updated: User) => void;
}

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onNavigate,
  onUpdateProfile
}: UserProfileModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');

  // States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch order history for current logged in user
  useEffect(() => {
    if (currentUser && currentUser.uid !== 'guest') {
      const fetchUserOrders = async () => {
        try {
          const q = query(
            collection(db, 'orders'),
            where('customerEmail', '==', currentUser.email)
          );
          const snap = await getDocs(q);
          const list: Order[] = [];
          snap.forEach(doc => {
            list.push(doc.data() as Order);
          });
          // Sort by creation date
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrderHistory(list);
        } catch (err) {
          console.error('Error fetching user orders:', err);
        }
      };
      fetchUserOrders();
    } else {
      setOrderHistory([]);
    }
  }, [currentUser]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const firebaseUser = userCredential.user;
      
      // Update firebase profile display name
      await updateProfile(firebaseUser, { displayName: regName });
      
      // Save profile doc to Firestore
      const isSuperAdmin = regEmail === 'communicationsanalytics6@gmail.com';
      const newProfile: User = {
        uid: firebaseUser.uid,
        email: regEmail,
        displayName: regName,
        role: isSuperAdmin ? 'super_admin' : 'customer',
        savedAddresses: regAddress ? [regAddress] : [],
        favourites: []
      };

      onUpdateProfile(newProfile);
      setSuccessMsg('Profile created successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Add saved address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const updatedAddresses = [...(currentUser.savedAddresses || []), newAddress.trim()];
    
    // Update local and firestore profile
    const updatedProfile = { ...currentUser, savedAddresses: updatedAddresses };
    onUpdateProfile(updatedProfile);
    
    // Save to Firestore
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { savedAddresses: updatedAddresses });
      setNewAddress('');
      setSuccessMsg('Address added!');
      setTimeout(() => setSuccessMsg(''), 1500);
    } catch (err) {
      console.error('Error saving address:', err);
    }
  };

  // Remove saved address
  const handleRemoveAddress = async (indexToRemove: number) => {
    const updatedAddresses = (currentUser.savedAddresses || []).filter((_, idx) => idx !== indexToRemove);
    const updatedProfile = { ...currentUser, savedAddresses: updatedAddresses };
    onUpdateProfile(updatedProfile);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { savedAddresses: updatedAddresses });
    } catch (err) {
      console.error('Error removing address:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          {/* Backdrop Click to Close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-full max-w-md bg-white border border-neutral-200/60 rounded-3xl overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Elegant Close Button Over the Banner */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-red-200 hover:scale-110 active:scale-95 transition-all z-30 cursor-pointer bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Graphical Banner Header */}
            <div className="relative h-32 flex items-center justify-center text-white p-6 overflow-hidden shrink-0">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/20 z-10" />
              
              <div className="relative z-20 flex flex-col items-center text-center space-y-1 mt-2">
                <div className="bg-white p-2 px-4 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src={PANAROTTIS_LOGO} 
                    alt="Panarottis Logo" 
                    className="h-7 w-auto object-contain select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://logo.clearbit.com/panarottis.co.za';
                    }}
                  />
                </div>
                <span className="text-[9px] text-amber-400 font-mono uppercase tracking-widest font-black">Woodfired Pizza & Pasta</span>
              </div>
            </div>

            {/* Main content body */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-neutral-50/50">
              
              {/* IF GUEST: Show Authentication Screen */}
              {currentUser.uid === 'guest' ? (
                <div className="space-y-6">
                  {/* Modern Tab Selector */}
                  <div className="grid grid-cols-2 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/50">
                    <button 
                      onClick={() => { setAuthMode('login'); setError(''); }}
                      className={`py-2 text-xs font-bold uppercase font-mono tracking-wider rounded-xl transition-all ${authMode === 'login' ? 'bg-white text-red-600 shadow-sm font-black' : 'text-neutral-500 hover:text-neutral-800'}`}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => { setAuthMode('register'); setError(''); }}
                      className={`py-2 text-xs font-bold uppercase font-mono tracking-wider rounded-xl transition-all ${authMode === 'register' ? 'bg-white text-red-600 shadow-sm font-black' : 'text-neutral-500 hover:text-neutral-800'}`}
                    >
                      Join Club
                    </button>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200/80 rounded-2xl text-xs text-red-600 flex items-start gap-2.5 font-sans font-medium"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {successMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-50 border border-green-200/80 rounded-2xl text-xs text-green-700 flex items-start gap-2.5 font-sans font-medium"
                    >
                      <Check className="w-4 h-4 shrink-0 mt-0.5 animate-bounce" />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}

                  {authMode === 'login' ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input 
                            type="email" 
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="your.email@gmail.com"
                            className="w-full bg-white border border-neutral-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-neutral-900 transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black">Password</label>
                        <div className="relative">
                          <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input 
                            type="password" 
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white border border-neutral-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-neutral-900 transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-red-600 hover:bg-red-500 active:scale-98 disabled:bg-neutral-200 disabled:text-neutral-400 text-xs font-mono font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-red-600/10 cursor-pointer text-white flex items-center justify-center gap-2"
                      >
                        {loading ? 'Verifying Sourdough Account...' : 'Log In & Order'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-3.5 pr-0.5">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="E.g., Chidi Okafor"
                          className="w-full bg-white border border-neutral-200 rounded-2xl py-2.5 px-3.5 text-xs font-mono focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-neutral-900 transition-all shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="chidi@example.com"
                          className="w-full bg-white border border-neutral-200 rounded-2xl py-2.5 px-3.5 text-xs font-mono focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-neutral-900 transition-all shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black">Password</label>
                        <input 
                          type="password" 
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min. 6 alphanumeric"
                          className="w-full bg-white border border-neutral-200 rounded-2xl py-2.5 px-3.5 text-xs font-mono focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-neutral-900 transition-all shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+234 (80) 1234 5678"
                          className="w-full bg-white border border-neutral-200 rounded-2xl py-2.5 px-3.5 text-xs font-mono focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-neutral-900 transition-all shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black">Default Delivery Address</label>
                        <input 
                          type="text" 
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="E.g., 22 Anifowoshe St, Victoria Island, Lagos"
                          className="w-full bg-white border border-neutral-200 rounded-2xl py-2.5 px-3.5 text-xs font-mono focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-neutral-900 transition-all shadow-sm"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:bg-neutral-200 disabled:text-neutral-400 text-xs font-mono font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer block mt-4 text-white hover:shadow-lg hover:shadow-red-600/10 active:scale-98"
                      >
                        {loading ? 'Baking Your Profile...' : 'Complete Registration'}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* IF LOGGED IN: Show Profile Dashboard */
                <div className="space-y-6 flex flex-col justify-between text-neutral-800 h-full">
                  <div className="space-y-5">
                    {/* Header profile info card */}
                    <div className="flex items-center gap-4 p-4 bg-white border border-neutral-200/60 rounded-2xl shadow-sm">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-serif font-black text-xl shadow-inner shrink-0">
                        {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-black text-base text-neutral-900 truncate">{currentUser.displayName}</h4>
                          <span className="text-[8px] font-mono font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full uppercase border border-red-100/50 shrink-0">
                            {currentUser.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono truncate">{currentUser.email}</p>
                      </div>
                    </div>

                    {/* Section: Manage Saved Addresses */}
                    <div className="space-y-2.5">
                      <h5 className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Saved Delivery Locations</h5>
                      
                      {currentUser.savedAddresses?.length === 0 ? (
                        <p className="text-[11px] font-mono text-neutral-400 italic bg-white p-3 rounded-2xl border border-neutral-200/50 text-center">No delivery addresses saved yet</p>
                      ) : (
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                          {currentUser.savedAddresses?.map((addr, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-amber-50/30 border border-amber-100/50 p-2.5 rounded-xl text-xs font-mono text-neutral-700 hover:border-red-200/60 transition-colors">
                              <span className="truncate pr-4 flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" /> {addr}
                              </span>
                              <button 
                                onClick={() => handleRemoveAddress(idx)}
                                className="text-neutral-400 hover:text-red-600 shrink-0 cursor-pointer p-1 rounded-lg hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <form onSubmit={handleAddAddress} className="flex gap-2">
                        <input 
                          type="text" 
                          required
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          placeholder="E.g., Home, Office address..."
                          className="flex-grow bg-white border border-neutral-200 rounded-2xl py-2 px-3.5 text-xs font-mono focus:outline-none focus:border-red-500 text-neutral-900 shadow-sm"
                        />
                        <button 
                          type="submit"
                          className="bg-red-600 hover:bg-red-500 text-white p-2.5 rounded-2xl flex items-center justify-center cursor-pointer shrink-0 shadow-md shadow-red-600/10 hover:scale-105 active:scale-95 transition-all"
                        >
                          <Plus className="w-4 h-4 font-black" />
                        </button>
                      </form>
                    </div>

                    {/* Section: Historical Orders */}
                    <div className="space-y-2.5 pt-4 border-t border-neutral-200/60">
                      <h5 className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest flex justify-between">
                        <span>Past Orders</span>
                        <span className="bg-neutral-200/70 text-neutral-600 px-2 py-0.5 rounded-full text-[9px]">{orderHistory.length} Total</span>
                      </h5>

                      {orderHistory.length === 0 ? (
                        <p className="text-[11px] font-mono text-neutral-400 italic bg-white p-3 rounded-2xl border border-neutral-200/50 text-center">Your past pizza logs will appear here.</p>
                      ) : (
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {orderHistory.map((ord) => (
                            <div key={ord.id} className="bg-white border border-neutral-150 p-3 rounded-2xl flex justify-between items-center shadow-sm hover:border-neutral-300 transition-colors">
                              <div className="text-left">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-mono font-black text-neutral-900">{ord.id}</span>
                                  <span className="text-[8px] font-mono uppercase bg-red-50 px-1.5 py-0.5 rounded-md text-red-600 font-bold border border-red-100/50">{ord.brand}</span>
                                </div>
                                <span className="text-[9px] font-mono text-neutral-400 block mt-1">
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="text-right flex items-center gap-3">
                                <div>
                                  <span className="text-[11px] font-mono font-black text-red-600 block">₦{ord.totalAmount.toLocaleString()}</span>
                                  <span className="text-[9px] font-mono text-neutral-400 block">
                                    {ord.items?.reduce((sum, i) => sum + i.quantity, 0)} items
                                  </span>
                                </div>
                                <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded-full uppercase border ${
                                  ord.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 animate-pulse border-amber-200'
                                }`}>
                                  {ord.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-neutral-200/60 flex justify-between items-center">
                    {currentUser.role === 'super_admin' && (
                      <button 
                        onClick={() => {
                          onNavigate('admin');
                          onClose();
                        }}
                        className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-neutral-950/20"
                      >
                        <Shield className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Admin Desk
                      </button>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200/80 text-red-600 font-mono text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
