import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, ShoppingBag, MapPin, Sparkles, LogIn, ChevronRight, 
  Menu, Info, LayoutDashboard, Globe, Flame, ChefHat, LogOut, Check 
} from 'lucide-react';
import { 
  MenuItem, Store, BlogPost, Promo, Feedback, Order, User, UserRole, TableReservation 
} from './types';
import { 
  INITIAL_USERS, INITIAL_MENU_ITEMS, INITIAL_STORES, INITIAL_PROMOS, INITIAL_BLOGS, INITIAL_FEEDBACK, INITIAL_ORDERS 
} from './data/initialData';
import BrandPortal from './components/BrandPortal';
import SpurSite from './spur/SpurSite';
import PanarottisSite from './panarottis/PanarottisSite';
import AdminBackend from './components/AdminBackend';

import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  seedDatabase, 
  getUserProfile, 
  createUserProfile, 
  getMenuItems, 
  saveMenuItem, 
  removeMenuItem, 
  getPromos, 
  savePromo, 
  removePromo, 
  getBlogs, 
  saveBlog, 
  removeBlog, 
  getFeedback, 
  saveFeedback, 
  getOrders, 
  saveOrder, 
  updateOrderStatus, 
  getReservations, 
  saveReservation 
} from './lib/db';
import UserProfileModal from './components/UserProfileModal';
import ScaffoldPresenter from './components/ScaffoldPresenter';
import { Clock, AlertTriangle } from 'lucide-react';

export default function App() {
  // Scaffold Presentation and Countdown Session States
  const [isScaffoldAuthenticated, setIsScaffoldAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('isScaffoldAuthenticated') === 'true';
  });
  const [scaffoldTimeRemaining, setScaffoldTimeRemaining] = useState<number>(() => {
    const savedTime = sessionStorage.getItem('scaffoldTimeRemaining');
    return savedTime ? parseInt(savedTime, 10) : 1800; // default 30 mins
  });
  const [showTenMinPopup, setShowTenMinPopup] = useState<boolean>(false);
  const [hasShownTenMinPopup, setHasShownTenMinPopup] = useState<boolean>(() => {
    return sessionStorage.getItem('hasShownTenMinPopup') === 'true';
  });

  // Ticking effect for 30-minute prototype session
  useEffect(() => {
    if (!isScaffoldAuthenticated) return;

    const timer = setInterval(() => {
      setScaffoldTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsScaffoldAuthenticated(false);
          sessionStorage.removeItem('isScaffoldAuthenticated');
          sessionStorage.removeItem('scaffoldTimeRemaining');
          sessionStorage.removeItem('hasShownTenMinPopup');
          sessionStorage.setItem('scaffoldSessionExpired', 'true');
          return 1800;
        }
        const nextTime = prev - 1;
        sessionStorage.setItem('scaffoldTimeRemaining', nextTime.toString());

        // Trigger warning alert when timer passes 10 minutes left
        if (nextTime <= 600 && !hasShownTenMinPopup) {
          setShowTenMinPopup(true);
          setHasShownTenMinPopup(true);
          sessionStorage.setItem('hasShownTenMinPopup', 'true');
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isScaffoldAuthenticated, hasShownTenMinPopup]);

  const handleAccessGranted = (initialSeconds: number) => {
    setIsScaffoldAuthenticated(true);
    setScaffoldTimeRemaining(initialSeconds);
    setHasShownTenMinPopup(false);
    sessionStorage.setItem('isScaffoldAuthenticated', 'true');
    sessionStorage.setItem('scaffoldTimeRemaining', initialSeconds.toString());
    sessionStorage.removeItem('hasShownTenMinPopup');
  };

  const handleExtendSession = () => {
    setScaffoldTimeRemaining(1800);
    setHasShownTenMinPopup(false);
    setShowTenMinPopup(false);
    sessionStorage.setItem('scaffoldTimeRemaining', '1800');
    sessionStorage.removeItem('hasShownTenMinPopup');
  };

  // Global App States
  const [activeView, setActiveView] = useState<'portal' | 'spur' | 'panarottis' | 'admin'>('portal');
  const [currentUser, setCurrentUser] = useState<User>({
    uid: 'guest',
    email: '',
    displayName: 'Guest',
    role: 'customer',
    savedAddresses: [],
    favourites: []
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [stores] = useState<Store[]>(INITIAL_STORES);
  const [promos, setPromos] = useState<Promo[]>(INITIAL_PROMOS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [feedback, setFeedback] = useState<Feedback[]>(INITIAL_FEEDBACK);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [tableReservations, setTableReservations] = useState<TableReservation[]>([]);

  // Shopping Cart State (Item-ID to Quantity/Item map)
  const [cart, setCart] = useState<{ menuItem: MenuItem; quantity: number }[]>([]);
  
  // Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Firestore initial sync
  useEffect(() => {
    const initializeAppDatabase = async () => {
      try {
        // Seed standard items to Firestore if empty
        await seedDatabase({
          menuItems: INITIAL_MENU_ITEMS,
          promos: INITIAL_PROMOS,
          blogs: INITIAL_BLOGS,
          feedback: INITIAL_FEEDBACK,
          orders: INITIAL_ORDERS
        });

        // Load fresh datasets from Firestore
        const [loadedMenuItems, loadedPromos, loadedBlogs, loadedFeedback, loadedOrders, loadedReservations] = await Promise.all([
          getMenuItems(),
          getPromos(),
          getBlogs(),
          getFeedback(),
          getOrders(),
          getReservations()
        ]);

        if (loadedMenuItems.length > 0) setMenuItems(loadedMenuItems);
        if (loadedPromos.length > 0) setPromos(loadedPromos);
        if (loadedBlogs.length > 0) setBlogs(loadedBlogs);
        if (loadedFeedback.length > 0) setFeedback(loadedFeedback);
        if (loadedOrders.length > 0) {
          loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(loadedOrders);
        }
        if (loadedReservations.length > 0) setTableReservations(loadedReservations);
      } catch (err) {
        console.error('Error during database initialization:', err);
      }
    };
    initializeAppDatabase();
  }, []);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setCurrentUser(profile);
          } else {
            const isSuperAdmin = firebaseUser.email === 'communicationsanalytics6@gmail.com';
            const defaultProfile: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Guest Diner',
              role: isSuperAdmin ? 'super_admin' : 'customer',
              savedAddresses: [],
              favourites: []
            };
            await createUserProfile(firebaseUser.uid, defaultProfile);
            setCurrentUser(defaultProfile);
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
        }
      } else {
        setCurrentUser({
          uid: 'guest',
          email: '',
          displayName: 'Guest',
          role: 'customer',
          savedAddresses: [],
          favourites: []
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Cart Handlers
  const handleAddToCart = (item: MenuItem, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(cartItem => cartItem.menuItem.id === item.id);
      if (existing) {
        return prevCart.map(cartItem => 
          cartItem.menuItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, { menuItem: item, quantity }];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.menuItem.id !== itemId));
  };

  const handleUpdateCartQuantity = (itemId: string, qty: number) => {
    setCart(prevCart => prevCart.map(item => 
      item.menuItem.id === itemId ? { ...item, quantity: qty } : item
    ));
  };

  // Place Order Handler with Firestore sync
  const handlePlaceOrder = async (details: { name: string; email: string; phone: string; address: string; brand: 'spur' | 'panarottis' }) => {
    const brandCart = cart.filter(item => item.menuItem.brand === details.brand);
    if (brandCart.length === 0) return;

    const total = brandCart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    const couriers = ['Kola Ojo', 'John Ibrahim', 'Sodiq Yusuf', 'Yusuf Bala', 'Femi Adesina'];
    const chosenCourier = couriers[Math.floor(Math.random() * couriers.length)];

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: details.name,
      customerEmail: details.email,
      phone: details.phone,
      address: details.address,
      items: brandCart,
      totalAmount: total,
      status: 'pending',
      brand: details.brand,
      createdAt: new Date().toISOString(),
      deliveryMinutes: 30 + Math.floor(Math.random() * 15),
      courierName: chosenCourier,
      trackingCoordinates: {
        lat: details.brand === 'spur' ? 6.4281 : 6.4492,
        lng: details.brand === 'spur' ? 3.4219 : 3.4731
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    // Save to database
    await saveOrder(newOrder);

    // Clear brand items from cart
    setCart(prev => prev.filter(item => item.menuItem.brand !== details.brand));
  };

  // Feedback Submission Handler with Firestore sync
  const handleAddFeedback = async (newFeed: Omit<Feedback, 'id' | 'createdAt'>) => {
    const feedbackObj: Feedback = {
      ...newFeed,
      id: `FEED-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    setFeedback(prev => [feedbackObj, ...prev]);
    await saveFeedback(feedbackObj);
  };

  const handleResolveFeedback = async (id: string) => {
    const feedItem = feedback.find(f => f.id === id);
    if (feedItem) {
      const updated = { ...feedItem, status: 'resolved' as const };
      setFeedback(prev => prev.map(f => f.id === id ? updated : f));
      await saveFeedback(updated);
    }
  };

  // Table Bookings Handler with Firestore sync
  const handleBookTable = async (newRes: Omit<TableReservation, 'id' | 'createdAt' | 'status'>) => {
    const resObj: TableReservation = {
      ...newRes,
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    setTableReservations(prev => [resObj, ...prev]);
    await saveReservation(resObj);
  };

  // RBAC Setter
  const handleSetUserRole = (role: UserRole) => {
    const matchedUser = INITIAL_USERS.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
    } else {
      // Default fallback
      setCurrentUser({
        uid: 'user-guest',
        email: 'guest@olive.com',
        displayName: 'Guest Diner',
        role: role,
        savedAddresses: [],
        favourites: []
      });
    }
  };

  // Menu Management CMS Handlers with Firestore sync
  const handleAddMenuItem = async (item: MenuItem) => {
    setMenuItems(prev => [item, ...prev]);
    await saveMenuItem(item);
  };

  const handleUpdateMenuItem = async (updated: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    await saveMenuItem(updated);
  };

  const handleDeleteMenuItem = async (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
    await removeMenuItem(id);
  };

  // Promos CMS Handlers with Firestore sync
  const handleAddPromo = async (promo: Promo) => {
    setPromos(prev => [promo, ...prev]);
    await savePromo(promo);
  };

  const handleDeletePromo = async (id: string) => {
    setPromos(prev => prev.filter(p => p.id !== id));
    await removePromo(id);
  };

  const handleTogglePromoBanner = async (id: string) => {
    const pItem = promos.find(p => p.id === id);
    if (pItem) {
      const updated = { ...pItem, isBannerActive: !pItem.isBannerActive };
      setPromos(prev => prev.map(p => p.id === id ? updated : p));
      await savePromo(updated);
    }
  };

  // Blog CMS Handlers with Firestore sync
  const handleAddBlog = async (post: BlogPost) => {
    setBlogs(prev => [post, ...prev]);
    await saveBlog(post);
  };

  const handleToggleBlogPublish = async (id: string) => {
    const bItem = blogs.find(b => b.id === id);
    if (bItem) {
      const updated = { ...bItem, isPublished: !bItem.isPublished };
      setBlogs(prev => prev.map(b => b.id === id ? updated : b));
      await saveBlog(updated);
    }
  };

  const handleToggleBlogFeatured = async (id: string) => {
    const bItem = blogs.find(b => b.id === id);
    if (bItem) {
      const updated = { ...bItem, isFeatured: !bItem.isFeatured };
      setBlogs(prev => prev.map(b => b.id === id ? updated : b));
      await saveBlog(updated);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    await removeBlog(id);
  };

  // Order Status Handler with Firestore sync
  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status } : o
    ));
    await updateOrderStatus(id, status);
  };

  if (!isScaffoldAuthenticated) {
    return <ScaffoldPresenter onAccessGranted={handleAccessGranted} />;
  }

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen font-sans relative">
      
      {/* RENDER ACTIVE VIEW WITH FRAMER MOTION TRANSITIONS */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'portal' && (
              <BrandPortal 
                promos={promos}
                blogs={blogs}
                stores={stores}
                onNavigate={(view) => {
                  if (view === 'cart') {
                    // Quick jump to brand specifically to see shopping cart
                    setActiveView('spur');
                  } else {
                    setActiveView(view as any);
                  }
                }}
                onSubmitFeedback={handleAddFeedback}
              />
            )}

            {activeView === 'spur' && (
              <SpurSite 
                menuItems={menuItems}
                stores={stores}
                cart={cart.filter(item => item.menuItem.brand === 'spur')}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateCartQuantity={handleUpdateCartQuantity}
                onPlaceOrder={handlePlaceOrder}
                onNavigate={(view) => setActiveView(view as any)}
                onAddReview={(name, rating, message) => {
                  handleAddFeedback({
                    name,
                    email: 'guest@diner.com',
                    brand: 'spur',
                    type: 'praise',
                    subject: 'Diner Review Submission',
                    message,
                    rating,
                    status: 'resolved'
                  });
                }}
                onBookTable={handleBookTable}
                activeOrders={orders}
              />
            )}

            {activeView === 'panarottis' && (
              <PanarottisSite 
                menuItems={menuItems}
                stores={stores}
                cart={cart.filter(item => item.menuItem.brand === 'panarottis')}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateCartQuantity={handleUpdateCartQuantity}
                onPlaceOrder={handlePlaceOrder}
                onNavigate={(view) => setActiveView(view as any)}
                onAddReview={(name, rating, message) => {
                  handleAddFeedback({
                    name,
                    email: 'guest@diner.com',
                    brand: 'panarottis',
                    type: 'praise',
                    subject: 'Pizzeria Review Submission',
                    message,
                    rating,
                    status: 'resolved'
                  });
                }}
                activeOrders={orders}
                currentUser={currentUser}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            )}

            {activeView === 'admin' && (
              <AdminBackend 
                currentUser={currentUser}
                onSetUserRole={handleSetUserRole}
                menuItems={menuItems}
                onAddMenuItem={handleAddMenuItem}
                onUpdateMenuItem={handleUpdateMenuItem}
                onDeleteMenuItem={handleDeleteMenuItem}
                promos={promos}
                onAddPromo={handleAddPromo}
                onDeletePromo={handleDeletePromo}
                onTogglePromoBanner={handleTogglePromoBanner}
                blogs={blogs}
                onAddBlog={handleAddBlog}
                onToggleBlogPublish={handleToggleBlogPublish}
                onToggleBlogFeatured={handleToggleBlogFeatured}
                onDeleteBlog={handleDeleteBlog}
                feedback={feedback}
                onResolveFeedback={handleResolveFeedback}
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                stores={stores}
                onNavigate={(view) => setActiveView(view as any)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global User Authentication and Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        currentUser={currentUser} 
        onNavigate={(view) => setActiveView(view)} 
        onUpdateProfile={(updated) => setCurrentUser(updated)}
      />

      {/* Floating Session Countdown Indicator */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
        <div className="pointer-events-auto bg-white/95 border border-neutral-200/80 hover:border-[#FF4625]/40 rounded-2xl p-4 shadow-2xl flex flex-col gap-2.5 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center shrink-0 border border-[#10B981]/20">
              <Clock className="w-5 h-5 text-[#10B981] animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block font-bold">Staging Session</span>
              <span className="text-xs font-mono text-neutral-900 font-black tracking-wider block">
                {Math.floor(scaffoldTimeRemaining / 60)}m {scaffoldTimeRemaining % 60}s left
              </span>
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-2 flex justify-start">
            <button
              onClick={() => {
                setIsScaffoldAuthenticated(false);
                sessionStorage.removeItem('isScaffoldAuthenticated');
                sessionStorage.removeItem('scaffoldTimeRemaining');
                sessionStorage.removeItem('hasShownTenMinPopup');
              }}
              className="text-[10px] font-mono font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer transition-colors"
            >
              ← Sign Out of Session
            </button>
          </div>
        </div>
      </div>

      {/* Staging Warning Alert (10 mins left) */}
      <AnimatePresence>
        {showTenMinPopup && (
          <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-md w-full bg-white border border-neutral-200/80 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,70,37,0.04),transparent_70%)] pointer-events-none" />
              
              <div className="inline-flex p-4 bg-[#FF4625]/5 border border-[#FF4625]/10 rounded-full">
                <AlertTriangle className="w-10 h-10 text-[#FF4625] animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-sans font-black tracking-tight text-neutral-900 uppercase">
                  Explore Reminder
                </h3>
                <p className="text-[10px] font-mono text-[#10B981] uppercase tracking-widest font-bold">
                  10 Minutes Remaining
                </p>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                You have less than <strong className="text-neutral-900 font-bold">10 minutes</strong> left in this staging session! We invite you to explore other areas of the system prototype such as the Spur Steakhouse live order status tracker, Panarottis dynamic wheel ordering, and our staged Administrative CMS.
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setShowTenMinPopup(false)}
                  className="w-full py-3 rounded-xl bg-[#FF4625] text-white text-xs font-mono font-bold hover:bg-[#E03A1B] transition-all shadow-lg shadow-[#FF4625]/10 active:scale-95"
                >
                  Continue Exploring
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
