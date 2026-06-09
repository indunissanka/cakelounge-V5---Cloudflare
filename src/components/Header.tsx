import { useState } from 'react';
import { ShoppingBag, User, Menu, X, Landmark } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  currentTab: 'home' | 'product-detail' | 'checkout' | 'admin';
  setCurrentTab: (tab: 'home' | 'product-detail' | 'checkout' | 'admin') => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  isAdminUnlocked?: boolean;
}

export default function Header({ currentTab, setCurrentTab, cart, setIsCartOpen, isAdminUnlocked = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems: { label: string; id: string; tab: 'home' | 'product-detail' | 'checkout' | 'admin' }[] = [
    { label: 'Cakes', id: 'cakes', tab: 'home' },
    { label: 'Collections', id: 'collections', tab: 'home' },
    { label: 'Gifting & Boxes', id: 'gifting', tab: 'home' },
  ];

  if (isAdminUnlocked) {
    navItems.push({ label: 'Admin Terminal', id: 'admin', tab: 'admin' });
  }

  const handleNavClick = (item: typeof navItems[0]) => {
    setCurrentTab(item.tab);
    setIsMobileMenuOpen(false);
    
    // Smooth scroll helper if home & specific element requested
    if (item.tab === 'home') {
      setTimeout(() => {
        let elementId = '';
        if (item.label === 'Cakes') elementId = 'bakers-choice-section';
        else if (item.label === 'Collections') elementId = 'collections-section';
        else if (item.label === 'Gifting & Boxes') elementId = 'collections-section';
        
        if (elementId) {
          const el = document.getElementById(elementId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className="w-full top-0 sticky z-50 bg-white/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(107,45,92,0.06)] border-b border-brand-outline-variant/20">
      <nav className="flex justify-between items-center px-5 md:px-[64px] h-20 w-full max-w-[1280px] mx-auto">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="font-serif text-2xl md:text-3xl text-brand-primary tracking-tight cursor-pointer active:scale-95 transition-transform select-none font-semibold hover:opacity-90"
        >
          The Cake Lounge
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = 
              (item.tab === 'admin' && currentTab === 'admin') ||
              (item.tab === 'home' && currentTab !== 'admin');
            
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`text-sm tracking-wide font-medium font-sans cursor-pointer transition-all pb-1 border-b-2 ${
                  isActive && currentTab === item.tab
                    ? 'text-brand-primary border-brand-primary font-semibold'
                    : 'text-brand-on-surface-variant/80 border-transparent hover:text-brand-primary'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* User Interaction Icons */}
        <div className="flex items-center gap-4">
          
          {/* Quick Toggle to Admin Dashboard Indicator - Only visible to unlocked staff */}
          {isAdminUnlocked && (
            <button
              onClick={() => setCurrentTab(currentTab === 'admin' ? 'home' : 'admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all shadow-sm ${
                currentTab === 'admin'
                  ? 'bg-brand-primary text-white hover:brightness-110'
                  : 'bg-brand-primary-fixed/40 text-brand-on-primary-fixed hover:bg-brand-primary-fixed/65'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentTab === 'admin' ? 'Cafe Storefront' : 'Admin Area'}
              </span>
            </button>
          )}

          {/* Shopping Bag Icon with Count badge */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 relative rounded-full hover:bg-brand-primary-fixed/20 text-brand-primary hover:text-brand-primary transition-all active:scale-95"
            aria-label="Open Shopping Bag"
            id="shopping-bag-icon"
          >
            <ShoppingBag className="w-5.5 h-5.5" />
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-brand-primary-container text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* Profile Switch Button */}
          <button 
            onClick={() => setCurrentTab('admin')}
            className="p-2 rounded-full hover:bg-brand-primary-fixed/20 text-brand-primary transition-all active:scale-95"
            aria-label="Admin Profile Dashboard"
          >
            <User className="w-5.5 h-5.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-brand-primary-fixed/20 text-brand-primary"
            aria-label="Mobile Navigation Toggle"
          >
            {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-brand-outline-variant/20 px-5 py-4 space-y-3 animate-fadeIn flex flex-col">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="text-left font-sans font-medium text-brand-on-surface-variant hover:text-brand-primary py-2.5 px-3 rounded-lg hover:bg-brand-surface-low transition-all"
            >
              {item.label}
            </button>
          ))}
          {isAdminUnlocked ? (
            <button
              onClick={() => {
                setCurrentTab(currentTab === 'admin' ? 'home' : 'admin');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 font-sans font-semibold text-brand-primary py-2.5 px-3 rounded-lg bg-brand-primary-fixed/30 hover:bg-brand-primary-fixed/50 transition-all text-left"
            >
              <Landmark className="w-4 h-4" />
              {currentTab === 'admin' ? 'Switch to Cafe Storefront' : 'Launch Baker Admin Dashboard'}
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 font-sans font-semibold text-brand-on-surface-variant/70 py-2.5 px-3 rounded-lg bg-brand-surface-low hover:bg-brand-primary-fixed/20 transition-all text-left"
            >
              <User className="w-4 h-4 text-brand-primary" />
              Staff Login Portal
            </button>
          )}
        </div>
      )}
    </header>
  );
}
