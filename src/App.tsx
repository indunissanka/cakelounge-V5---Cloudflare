import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './components/HomeScreen';
import ProductDetailScreen from './components/ProductDetailScreen';
import CheckoutScreen from './components/CheckoutScreen';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import AdminPasscodeModal from './components/AdminPasscodeModal';
import UserProfileScreen from './components/UserProfileScreen';
import { CartItem, Order, ScheduleItem, CakeProduct, Customer } from './types';
import { INITIAL_ORDERS, INITIAL_SCHEDULE, PRODUCTS } from './data';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'product-detail' | 'checkout' | 'admin' | 'profile'>('home');
  const [selectedCakeId, setSelectedCakeId] = useState<string>('midnight-chocolate-truffle');

  // Detect ?reset= token in URL for password reset flow
  const [resetToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('reset');
    }
    return null;
  });

  useEffect(() => {
    if (resetToken) {
      setCurrentTab('profile');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [resetToken]);

  // Detect ?admin in URL to open admin login directly
  const [openAdminModal, setOpenAdminModal] = useState(() =>
    typeof window !== 'undefined' && window.location.search.includes('admin')
  );
  useEffect(() => {
    if (openAdminModal) window.history.replaceState({}, '', window.location.pathname);
  }, []);

  // Customer Account Session active memory hook
  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boutique_current_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (_) {}
      }
    }
    return null;
  });

  // Synchronize current user state changes locally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('boutique_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('boutique_current_user');
      }
    }
  }, [currentUser]);

  
  // Shopping Cart & Drawer States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Administrative State Matrices (Linked Reactively!)
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);

  // Dynamic Catalog State list
  const [products, setProducts] = useState<CakeProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boutique_products');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Error loading stored products:', e);
        }
      }
    }
    return PRODUCTS;
  });

  // Synchronize products changes locally 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('boutique_products', JSON.stringify(products));
    }
  }, [products]);

  // Staff Authorization Gating States
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('isStaffUnlocked') === 'true';
    }
    return false;
  });
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(false);

  // Wrapper: intercepts requests targeting Admin Terminal
  const handleSetCurrentTab = (tab: 'home' | 'product-detail' | 'checkout' | 'admin' | 'profile') => {
    if (tab === 'admin') {
      if (isAdminUnlocked) {
        setCurrentTab('admin');
      } else {
        setIsPasscodeModalOpen(true);
      }
    } else {
      setCurrentTab(tab);
    }
  };

  // Handler: Add customized items to the shopping Bag
  const handleAddToBag = (newItem: CartItem) => {
    setCart((prev) => {
      // Check if item of same product & select size & identical customized notes exists
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === newItem.product.id &&
          item.selectedSize === newItem.selectedSize &&
          item.enhancements.handwrittenNote === newItem.enhancements.handwrittenNote &&
          item.enhancements.noteText === newItem.enhancements.noteText
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    // Auto trigger shopping bag slide-out preview to maximize gratification visual
    setTimeout(() => {
      setIsCartOpen(true);
    }, 400);
  };

  // Handler: Modify cart item quantities inside the slide-out drawer
  const handleUpdateQuantity = (idx: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[idx].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== idx);
      }
      updated[idx].quantity = newQty;
      return updated;
    });
  };

  // Handler: Purge item selection from cart
  const handleRemoveItem = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handler: Dispatch newly submitted checkout order into master schedule logs
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear the bag upon checkout completion
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-surface text-brand-on-surface font-sans selection:bg-brand-primary/20">
      
      {/* Top Navigation Frame */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={handleSetCurrentTab} 
        cart={cart} 
        setIsCartOpen={setIsCartOpen}
        isAdminUnlocked={isAdminUnlocked}
      />

      {/* Main Content Stage container with elegant visual margin limits */}
      <main className="flex-grow w-full">
        {currentTab === 'home' && (
          <HomeScreen 
            products={products}
            onSelectCake={setSelectedCakeId} 
            setCurrentTab={handleSetCurrentTab} 
          />
        )}

        {currentTab === 'product-detail' && (
          <ProductDetailScreen 
            products={products}
            productId={selectedCakeId} 
            onBackToStore={() => handleSetCurrentTab('home')} 
            onAddToBag={handleAddToBag} 
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutScreen 
            cart={cart} 
            onPlaceOrder={handlePlaceOrder} 
            onBackToStore={() => handleSetCurrentTab('home')} 
            currentUser={currentUser}
          />
        )}

        {currentTab === 'admin' && isAdminUnlocked && (
          <AdminDashboard 
            orders={orders} 
            setOrders={setOrders} 
            schedule={schedule} 
            setSchedule={setSchedule} 
            products={products}
            setProducts={setProducts}
            onLogout={() => {
              setIsAdminUnlocked(false);
              sessionStorage.removeItem('isStaffUnlocked');
              setCurrentTab('home');
            }}
          />
        )}

        {currentTab === 'profile' && (
          <UserProfileScreen
            orders={orders}
            onBackToStore={() => handleSetCurrentTab('home')}
            onSetTab={handleSetCurrentTab}
            currentUser={currentUser}
            onSetCurrentUser={setCurrentUser}
            resetToken={resetToken}
          />
        )}
      </main>

      {/* Hidden layout helpers to facilitate cross-screen integrations */}
      <div className="hidden">
        <button id="admin-link-fallback" onClick={() => handleSetCurrentTab('admin')}>Switch to Admin</button>
      </div>

      {/* Dynamic Slide-out Shopping Bag panel */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onUpdateQuantity={handleUpdateQuantity} 
        onRemoveItem={handleRemoveItem} 
        onProceedToCheckout={() => handleSetCurrentTab('checkout')} 
      />

      {/* Footer Branding Area */}
      <Footer setCurrentTab={handleSetCurrentTab} />

      {/* Admin Passcode Gate overlay */}
      <AdminPasscodeModal
        isOpen={isPasscodeModalOpen || openAdminModal}
        onClose={() => {
          setIsPasscodeModalOpen(false);
          setOpenAdminModal(false);
          if (currentTab === 'admin') setCurrentTab('home');
        }}
        onSuccess={() => {
          setIsAdminUnlocked(true);
          setOpenAdminModal(false);
          sessionStorage.setItem('isStaffUnlocked', 'true');
          setCurrentTab('admin');
        }}
      />
      
    </div>
  );
}
