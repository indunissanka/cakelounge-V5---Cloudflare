import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Phone, MapPin, 
  History, UserPlus, LogIn, LogOut, CheckCircle, 
  Clock, Package, ShoppingBag, Eye, EyeOff, Save, KeyRound
} from 'lucide-react';
import { motion } from 'motion/react';
import { Customer, Order } from '../types';

interface UserProfileScreenProps {
  orders: Order[];
  onBackToStore: () => void;
  onSetTab: (tab: 'home' | 'product-detail' | 'checkout' | 'admin' | 'profile') => void;
  currentUser: Customer | null;
  onSetCurrentUser: (user: Customer | null) => void;
  resetToken?: string | null;
}

function orderStatusColor(s: string): string {
  const map: Record<string, string> = {
    PENDING: '#d97706', CONFIRMED: '#2563eb', BAKING: '#7c3aed', READY: '#0d9488',
    'OUT FOR DELIVERY': '#ea580c', DELIVERED: '#16a34a', CANCELLED: '#6b7280',
  };
  return map[s] ?? '#888';
}

export default function UserProfileScreen({
  orders,
  onBackToStore,
  onSetTab,
  currentUser,
  onSetCurrentUser,
  resetToken = null
}: UserProfileScreenProps) {
  // Navigation inside profile screen
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Editing profile fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editPostalCode, setEditPostalCode] = useState('');

  // Notifications
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [authLoading, setAuthLoading] = useState(false);

  // Forgot / reset password flow
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetMode] = useState(!!resetToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    }).catch(() => {});
    setForgotLoading(false);
    setForgotSent(true);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 6) { setErrorMsg('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setErrorMsg('Passwords do not match.'); return; }
    setResetLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json() as { email?: string; user?: Customer; error?: string };
      if (!res.ok || !data.email) {
        setErrorMsg(data.error || 'Reset link has expired or is invalid.');
        setResetLoading(false);
        return;
      }
      if (data.user) onSetCurrentUser(data.user);
      setSuccessMsg('Password updated! You are now logged in.');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    }
    setResetLoading(false);
  };

  // Keep getRegisteredUsers for legacy localStorage fallback (existing users)
  const getRegisteredUsers = (): Customer[] => {
    if (typeof window !== 'undefined') {
      const users = localStorage.getItem('boutique_customers');
      if (users) { try { return JSON.parse(users); } catch (_) {} }
    }
    return [];
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    if (!email || !password) { setErrorMsg('Please supply all credentials.'); return; }
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { user?: Customer; error?: string };
      if (!res.ok || !data.user) {
        // Fallback: try legacy localStorage accounts
        const users = getRegisteredUsers();
        const match = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
        if (match && match.password === password) {
          onSetCurrentUser(match);
          setSuccessMsg(`Welcome back, ${match.name}!`);
          setPassword('');
        } else {
          setErrorMsg(data.error || 'Invalid email or password.');
        }
      } else {
        onSetCurrentUser(data.user);
        setSuccessMsg(`Welcome back, ${data.user.name}! Session established.`);
        setPassword('');
      }
    } catch {
      setErrorMsg('Could not connect. Please try again.');
    }
    setAuthLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    if (!name || !email || !password) { setErrorMsg('Full Name, Email and Password are required.'); return; }
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address, city, postalCode }),
      });
      const data = await res.json() as { user?: Customer; error?: string };
      if (!res.ok || !data.user) {
        setErrorMsg(data.error || 'Registration failed. Please try again.');
      } else {
        onSetCurrentUser(data.user);
        setSuccessMsg(`Account created! Welcome, ${data.user.name}.`);
        setName(''); setEmail(''); setPassword(''); setPhone(''); setAddress(''); setCity(''); setPostalCode('');
      }
    } catch {
      setErrorMsg('Could not connect. Please try again.');
    }
    setAuthLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg(''); setSuccessMsg('');
    if (!editName.trim()) { setErrorMsg('Full Name is required.'); return; }
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: currentUser.id, name: editName, phone: editPhone, address: editAddress, city: editCity, postalCode: editPostalCode }),
      });
      const data = await res.json() as { user?: Customer; error?: string };
      if (data.user) {
        onSetCurrentUser(data.user);
        setIsEditingProfile(false);
        setSuccessMsg('Profile updated successfully!');
      } else {
        setErrorMsg(data.error || 'Update failed.');
      }
    } catch {
      setErrorMsg('Could not connect. Please try again.');
    }
  };

  const handleLogout = () => {
    onSetCurrentUser(null);
    setSuccessMsg('Successfully logged out.');
    setIsEditingProfile(false);
  };

  // Live orders from D1 — fetched on login and polled every 20s for status updates
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!currentUser?.email) return;
    const fetchOrders = () => {
      fetch(`/api/orders/customer?email=${encodeURIComponent(currentUser.email)}`)
        .then(r => r.json())
        .then((d: Order[]) => setLiveOrders(d))
        .catch(() => {});
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Merge live D1 orders with in-session orders (avoid duplicates)
  const customerOrders = currentUser
    ? [
        ...liveOrders,
        ...orders.filter(
          o => o.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim() &&
               !liveOrders.some(lo => lo.id === o.id)
        ),
      ]
    : [];

  // Seed default editing data if user state loads mid-render
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone || '');
      setEditAddress(currentUser.address || '');
      setEditCity(currentUser.city || '');
      setEditPostalCode(currentUser.postalCode || '');
    }
  }, [currentUser]);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 md:px-[64px] py-10 min-h-[70vh]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-outline-variant/20 pb-6 mb-8 gap-4">
        <div>
          <span className="text-brand-primary text-xs font-bold tracking-widest uppercase">The Cake Lounge Customer Portal</span>
          <h1 className="font-serif text-3xl font-semibold text-brand-on-surface mt-1">
            {currentUser ? 'My Lounge Account' : 'Guest Portal / Member Registration'}
          </h1>
        </div>
        <button 
          onClick={onBackToStore}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/5 transition-all active:scale-95"
        >
          &larr; Back to Pastry Showcase
        </button>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-center gap-3 animate-fadeIn">
          <Clock className="w-5 h-5 text-red-600 flex-shrink-0 rotate-180" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* ================= RESET PASSWORD VIEW ================= */}
      {resetMode && !currentUser && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-brand-outline-variant/15 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-brand-on-surface">Set New Password</h2>
            <p className="text-xs text-brand-on-surface-variant">Enter and confirm your new password below.</p>
          </div>
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-12 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                  required
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3.5 top-3.5 text-brand-on-surface-variant/60 hover:text-brand-primary transition-all">
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-3.5 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
            >
              {resetLoading ? 'Updating…' : 'Set New Password'}
            </button>
          </form>
        </div>
      )}

      {!resetMode && !currentUser ? (
        /* ================= AUTHENTICATION SPLIT SCREEN ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Perks Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-brand-primary/5 to-transparent p-6 sm:p-8 rounded-3xl border border-brand-outline-variant/15 space-y-6">
            <h3 className="font-serif text-lg font-semibold text-brand-primary">Lounge Membership Benefits</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-brand-primary flex-shrink-0 h-10 w-10 flex items-center justify-center border border-brand-outline-variant/10">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-on-surface tracking-wide uppercase">Express Checkout</h4>
                  <p className="text-xs text-brand-on-surface-variant leading-relaxed mt-1">
                    Prelink delivery coordinates, contact info, and preferred sizes to reserve elements in 2 clicks.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-brand-primary flex-shrink-0 h-10 w-10 flex items-center justify-center border border-brand-outline-variant/10">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-on-surface tracking-wide uppercase">Interactive Baking Log</h4>
                  <p className="text-xs text-brand-on-surface-variant leading-relaxed mt-1">
                    Track continuous statuses from master mixing bowl baking to Colombo home carriage dispatch.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-brand-primary flex-shrink-0 h-10 w-10 flex items-center justify-center border border-brand-outline-variant/10">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-on-surface tracking-wide uppercase">Local Data Protection</h4>
                  <p className="text-xs text-brand-on-surface-variant leading-relaxed mt-1">
                    Your sandbox credentials remain preserved in your secure environment for responsive testing.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-outline-variant/15 text-xs text-brand-on-surface-variant italic">
              * Active Sandbox Account initialized! Use <code className="bg-white px-1.5 py-0.5 rounded border border-brand-outline-variant/15 font-bold text-brand-primary">mark@sirilankan.com</code> and passcode <code className="bg-white px-1.5 py-0.5 rounded border border-brand-outline-variant/15 font-bold text-brand-primary">SecretPastries2026</code> to verify credentials instantaneously.
            </div>
          </div>

          {/* Form Entry Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-outline-variant/15 shadow-sm">
            
            {/* Entry Selector Tabs */}
            <div className="flex border-b border-brand-outline-variant/15 pb-4 mb-6 gap-6">
              <button 
                onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`text-sm tracking-wide font-semibold border-b-2 pb-2 transition-all ${
                  authMode === 'login' 
                    ? 'text-brand-primary border-brand-primary font-bold' 
                    : 'text-brand-on-surface-variant/70 border-transparent hover:text-brand-primary'
                }`}
              >
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In to Account
                </span>
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`text-sm tracking-wide font-semibold border-b-2 pb-2 transition-all ${
                  authMode === 'signup' 
                    ? 'text-brand-primary border-brand-primary font-bold' 
                    : 'text-brand-on-surface-variant/70 border-transparent hover:text-brand-primary'
                }`}
              >
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register New Account
                </span>
              </button>
            </div>

            {authMode === 'login' && forgotMode ? (
              /* FORGOT PASSWORD FORM */
              <div className="space-y-5">
                {forgotSent ? (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-semibold text-brand-on-surface">Check your inbox</p>
                    <p className="text-xs text-brand-on-surface-variant leading-relaxed">If an account exists for <strong>{forgotEmail}</strong>, a reset link has been sent. Check your spam folder too.</p>
                    <button type="button" onClick={() => setForgotMode(false)} className="text-brand-primary text-xs font-bold hover:underline">
                      &larr; Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Your Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={forgotLoading} className="w-full py-3.5 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60">
                      {forgotLoading ? 'Sending…' : 'Send Reset Link'}
                    </button>
                    <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center text-xs text-brand-on-surface-variant hover:text-brand-primary font-semibold">
                      &larr; Back to Sign In
                    </button>
                  </form>
                )}
              </div>
            ) : authMode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. mark@sirilankan.com"
                      className="w-full pl-10 pr-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all animate-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-brand-on-surface-variant/60 hover:text-brand-primary transition-all"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-brand-on-surface-variant">
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setForgotSent(false); setForgotEmail(email); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('mark@sirilankan.com');
                      setPassword('SecretPastries2026');
                    }}
                    className="text-brand-on-surface-variant hover:text-brand-primary hover:underline"
                  >
                    Load Demo
                  </button>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer mt-4"
                >
                  {authLoading ? 'Signing In…' : 'Verify and Sign In'}
                </button>
              </form>
            ) : (
              /* SIGNUP / REGISTRATION FORM */
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mark Sirilankan"
                        className="w-full pl-10 pr-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. mark@sirilankan.com"
                        className="w-full pl-10 pr-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Secure Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-12 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all animate-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-brand-on-surface-variant/60 hover:text-brand-primary transition-all"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +94 77 722 5335"
                        className="w-full pl-10 pr-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-brand-outline-variant/10 pt-4 mt-2">
                  <p className="text-xs font-bold text-brand-primary mb-3 uppercase tracking-wider">Default Delivery Particulars (Saves Checkout Time)</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Shipping Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-on-surface-variant/50" />
                        <input 
                          type="text" 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street Address, Appt / Suit #"
                          className="w-full pl-10 pr-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">City</label>
                        <input 
                          type="text" 
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Nawala"
                          className="w-full px-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Postal Code</label>
                        <input 
                          type="text" 
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="e.g. 10120"
                          className="w-full px-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer mt-6"
                >
                  {authLoading ? 'Creating Account…' : 'Create Secure Member Profile'}
                </button>
              </form>
            )}

          </div>

        </div>
      ) : (!resetMode && currentUser) ? (
        /* ================= MEMBER ACTIVE STATE PROFILE LOG ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Member Card Profile Info Summary Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-brand-outline-variant/15 shadow-sm space-y-6">
              
              {/* Member Crest Details */}
              <div className="text-center pb-4 border-b border-brand-outline-variant/15">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary mb-3 font-serif text-2xl font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-on-surface leading-tight">{currentUser.name}</h3>
                <p className="text-brand-primary text-xs font-mono tracking-wider mt-1">{currentUser.email}</p>
                <p className="text-[10px] text-brand-on-surface-variant uppercase tracking-widest font-bold mt-2">Lounge Member Since 2026</p>
              </div>

              {/* Data Rows */}
              {!isEditingProfile ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="block text-brand-on-surface-variant/70 font-semibold uppercase tracking-wider text-[10px] mb-1">Secure Contact</span>
                    <p className="text-brand-on-surface font-semibold flex items-center gap-1.5 bg-brand-surface/50 p-2.5 rounded-lg border border-brand-outline-variant/10">
                      <Phone className="w-3.5 h-3.5 text-brand-primary/80" />
                      {currentUser.phone || 'No phone registered'}
                    </p>
                  </div>

                  <div>
                    <span className="block text-brand-on-surface-variant/70 font-semibold uppercase tracking-wider text-[10px] mb-1">Pre-linked Carriage Carriage Destination</span>
                    <div className="text-brand-on-surface font-semibold space-y-1 bg-brand-surface/50 p-2.5 rounded-lg border border-brand-outline-variant/10 leading-relaxed">
                      <div className="flex gap-1.5 items-start">
                        <MapPin className="w-3.5 h-3.5 text-brand-primary/80 flex-shrink-0 mt-0.5" />
                        <div>
                          <p>{currentUser.address || 'No address registered'}</p>
                          {(currentUser.city || currentUser.postalCode) && (
                            <p className="text-brand-on-surface-variant/90">{currentUser.city} {currentUser.postalCode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full py-2.5 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary/15 transition-all text-center uppercase tracking-wider cursor-pointer"
                  >
                    Edit Shipping Details
                  </button>
                </div>
              ) : (
                /* Edit Profile Form */
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-surface rounded-lg border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider mb-1">Phone</label>
                    <input 
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-surface rounded-lg border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider mb-1">Delivery Address</label>
                    <input 
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-surface rounded-lg border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider mb-1">City</label>
                      <input 
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-surface rounded-lg border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider mb-1">Postal Code</label>
                      <input 
                        type="text"
                        value={editPostalCode}
                        onChange={(e) => setEditPostalCode(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-surface rounded-lg border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-2 bg-brand-surface rounded-lg border border-brand-outline-variant/15 text-[11px] font-bold uppercase tracking-wider text-brand-on-surface-variant cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-2 bg-brand-primary text-white rounded-lg text-[11px] font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </form>
              )}

              {/* Operations Footer */}
              <div className="pt-4 border-t border-brand-outline-variant/15 flex flex-col gap-3">
                <button 
                  onClick={handleLogout}
                  className="w-full py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Close Member Session
                </button>
              </div>

            </div>

            {/* Subtle gateway credentials note or switch back office */}
          </div>

          {/* Core Member Order Logging & Carriage History tracker panel */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-brand-outline-variant/15 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-brand-outline-variant/15">
              <History className="w-5 h-5 text-brand-primary" />
              <h3 className="font-serif text-lg font-semibold text-brand-on-surface">Member Order History Logs</h3>
            </div>

            {customerOrders.length === 0 ? (
              <div className="py-12 text-center text-brand-on-surface-variant flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary/60">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold">No orders parsed on this email account yet.</p>
                <p className="text-xs max-w-sm mx-auto leading-relaxed opacity-80">
                  When you add cakes to your shopping cart and complete checkout using <code className="bg-brand-surface px-1.5 py-0.5 rounded font-mono font-bold">{currentUser.email}</code>, they will automatically log into this interactive panel.
                </p>
                <button 
                  onClick={() => onSetTab('home')}
                  className="mt-2 text-xs font-bold text-white bg-brand-primary px-4 py-2 rounded-full hover:brightness-105 active:scale-95 transition-all"
                >
                  Configure My First Cake
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((order, oIdx) => (
                  <div 
                    key={order.id} 
                    className="p-5 rounded-2xl bg-brand-surface-low border border-brand-outline-variant/15 space-y-3.5 relative overflow-hidden"
                  >
                    
                    {/* Visual Status Indicator Belt */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col">
                      <span className="h-full w-full" style={{ backgroundColor: orderStatusColor(order.status) }} />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <p className="text-[10px] text-brand-on-surface-variant font-mono font-bold">RESERVATION ID</p>
                        <p className="text-xs font-bold text-brand-on-surface font-mono truncate max-w-[200px] sm:max-w-none">{order.id}</p>
                      </div>

                      {/* Status Pills */}
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] font-mono text-brand-on-surface-variant">{order.date}</span>
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ring-1"
                          style={{ color: orderStatusColor(order.status), borderColor: orderStatusColor(order.status) + '55', backgroundColor: orderStatusColor(order.status) + '11' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: orderStatusColor(order.status) }} />
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="py-2.5 border-t border-b border-brand-outline-variant/10 text-xs text-brand-on-surface space-y-1.5">
                      {order.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex justify-between font-semibold">
                          <p className="text-brand-on-surface leading-loose">
                            {item.productName} <span className="text-brand-primary text-[11px] font-bold">({item.size})</span>
                            <span className="text-brand-on-surface-variant font-medium ml-1.5">&times; {item.quantity}</span>
                          </p>
                          <p className="text-brand-on-surface-variant font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Status Timeline */}
                    {order.status !== 'CANCELLED' ? (() => {
                      const STEPS = ['PENDING','CONFIRMED','BAKING','READY','OUT FOR DELIVERY','DELIVERED'] as const;
                      const stepIdx = STEPS.indexOf(order.status as typeof STEPS[number]);
                      return (
                        <div className="flex items-start gap-0.5 mt-1 overflow-x-auto pb-1">
                          {STEPS.map((step, i) => {
                            const done = stepIdx >= i;
                            const active = stepIdx === i;
                            return (
                              <React.Fragment key={step}>
                                <div className="flex flex-col items-center flex-shrink-0">
                                  <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                                    done ? 'bg-brand-primary border-brand-primary' : 'bg-white border-brand-outline-variant/40'
                                  } ${active ? 'ring-2 ring-brand-primary/30 scale-125' : ''}`} />
                                  <span className={`text-[8px] mt-0.5 font-semibold text-center leading-tight w-[44px] ${
                                    done ? 'text-brand-primary' : 'text-brand-on-surface-variant/40'
                                  }`}>{step}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                  <div className={`h-px flex-1 min-w-[6px] mt-[5px] mx-0.5 ${i < stepIdx ? 'bg-brand-primary' : 'bg-brand-outline-variant/20'}`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      );
                    })() : (
                      <div className="mt-1">
                        <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[9px] font-bold rounded-full border border-red-200 uppercase tracking-wider">Order Cancelled</span>
                      </div>
                    )}

                    {/* Carriage Summary footer inside row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs pt-1">
                      <div className="space-y-0.5 text-[11px] leading-relaxed text-brand-on-surface-variant font-semibold">
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                          To: <span className="text-brand-on-surface">{order.address}, {order.city}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-primary" />
                          Arrival Date: <span className="text-brand-on-surface">{order.deliveryDate}</span>
                        </p>
                      </div>

                      <div className="text-right self-end sm:self-auto bg-white/70 px-3.5 py-1.5 rounded-xl border border-brand-outline-variant/10">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-brand-on-surface-variant block">Total Price (GST incl.)</span>
                        <p className="text-brand-primary font-bold font-serif text-sm">Rs. {order.total.toLocaleString()}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      ) : null}

    </div>
  );
}
