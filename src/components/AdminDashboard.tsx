import React, { useState, useEffect } from 'react';
import {
  Landmark, Clock, TrendingUp, Users, Calendar,
  Trash2, Plus, CheckCircle, Flame, ShieldAlert, Award, ChevronRight, ShieldCheck, KeyRound, Eye, EyeOff, Pencil
} from 'lucide-react';
import { Order, ScheduleItem, OrderStatus, CakeProduct } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  products: CakeProduct[];
  setProducts: React.Dispatch<React.SetStateAction<CakeProduct[]>>;
  onLogout?: () => void;
}

function statusColor(s: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    PENDING: '#d97706', CONFIRMED: '#2563eb', BAKING: '#7c3aed', READY: '#0d9488',
    'OUT FOR DELIVERY': '#ea580c', DELIVERED: '#16a34a', CANCELLED: '#6b7280',
  };
  return map[s] ?? '#888';
}

function TaxRateSetting({ triggerNotification }: { triggerNotification: (msg: string, type: 'success' | 'info' | 'error') => void }) {
  const [rate, setRate] = useState(() => localStorage.getItem('cake_tax_rate') || '9');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(rate);
    if (isNaN(val) || val < 0 || val > 100) {
      triggerNotification('Enter a valid rate between 0 and 100.', 'error');
      return;
    }
    localStorage.setItem('cake_tax_rate', String(val));
    triggerNotification(`Tax rate updated to ${val}%.`, 'success');
  };

  return (
    <form onSubmit={handleSave} className="flex items-end gap-3">
      <div className="flex-1 space-y-1.5">
        <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider">Rate (%)</label>
        <div className="relative">
          <input
            type="number" min="0" max="100" step="0.1"
            value={rate}
            onChange={e => setRate(e.target.value)}
            className="w-full px-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm font-mono"
          />
          <span className="absolute right-4 top-3 text-brand-on-surface-variant text-sm font-bold">%</span>
        </div>
        <p className="text-[10px] text-brand-on-surface-variant">Applied to all customer checkouts. Current: {parseFloat(localStorage.getItem('cake_tax_rate') || '9')}%</p>
      </div>
      <button type="submit" className="px-5 py-3 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all mb-5 cursor-pointer">
        Save
      </button>
    </form>
  );
}

export default function AdminDashboard({ 
  orders, 
  setOrders, 
  schedule, 
  setSchedule, 
  products,
  setProducts,
  onLogout 
}: AdminDashboardProps) {
  const [activeMenu, setActiveMenu] = useState<'schedule' | 'orders' | 'products' | 'analytics' | 'settings'>('schedule');

  // Change password state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdError, setPwdError] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(''); setPwdError('');
    if (newPwd.length < 6) { setPwdError('New password must be at least 6 characters.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: 'admin@cakelounge.lk', currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        setPwdMsg('Password updated successfully.');
        setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      } else {
        setPwdError(data.error || 'Failed to update password.');
      }
    } catch {
      setPwdError('Could not connect. Please try again.');
    }
  };

  // New product inputs state list
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Cakes');

  const [prodDesc, setProdDesc] = useState('');
  const [prodLongDesc, setProdLongDesc] = useState('');
  const [prodImage, setProdImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuD9xg23JS1m4efL9471QbGoCMXQ8bREBf4rmiEUsiiZ1DtA43Izo8whF4OBWlboGEe0Aa3nnYVteJ1aCUP2zV93ExluaKODbXHiKA8BhHAmdoUj2vY0_5o0KZ8wbdna2iNNELxvWFBr-TtUjk6Ukonssn9vTtAXuDLIn4nkCgVdSc1eDXVO1DgztvyqYOmBpw3u37mCTHGXsIPPaDEXOedqHrdX9SRPk5gmo21sPXS7YJukfAPHw1Wp_-UpKUB8jY99nr8F4-dV4bU');
  const [prodTag, setProdTag] = useState('');
  const [prodWeight, setProdWeight] = useState('');
  const [sizeTiers, setSizeTiers] = useState([{ kg: '1.0', servings: '6-8', price: '' }]);
  const [prodAllergens, setProdAllergens] = useState<string[]>([]);

  // Notification banner state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  const triggerNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Load orders from D1 on mount — double-fetch handles D1 eventual consistency on refresh
  useEffect(() => {
    const loadOrders = () =>
      fetch(`/api/orders?_=${Date.now()}`)
        .then(r => r.json())
        .then((d: Order[]) => setOrders(d))
        .catch(() => {});
    loadOrders();
    const t = setTimeout(loadOrders, 1500);
    return () => clearTimeout(t);
  }, []);

  // Add Product to State
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const baseTier = sizeTiers[0];
    const parsedPrice = parseFloat(baseTier?.price);
    if (!parsedPrice || parsedPrice <= 0) {
      triggerNotification('Please enter a base price for the first size tier.', 'error');
      return;
    }
    const generatedId = prodName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-str0-9-]/g, '');

    const newProduct: CakeProduct = {
      id: `${generatedId}-${Date.now()}`,
      name: prodName.trim(),
      description: prodDesc.trim() || 'A classic, gourmet patisserie recipe handcrafted daily.',
      price: parsedPrice,
      image: prodImage.trim(),
      alt: prodName.trim(),
      category: prodCategory,
      tag: prodTag || undefined,
      tagType: prodTag === 'Top Seller' ? 'top-seller' : prodTag === "Baker's Pick" ? 'bakers-pick' : prodTag === "Gluten-Free" ? 'gluten-free' : undefined,
      weight: prodWeight.trim() || undefined,
      sizeTiers: sizeTiers.map(t => ({ kg: t.kg, servings: t.servings, price: parseFloat(t.price) || parsedPrice })),
      allergens: prodAllergens.length > 0 ? prodAllergens : undefined,
      longDescription: prodLongDesc.trim() || undefined,
    };

    if (editingProductId) {
      setProducts(prev => prev.map(p => p.id === editingProductId ? { ...newProduct, id: editingProductId } : p));
      setEditingProductId(null);
      triggerNotification(`"${newProduct.name}" updated successfully.`, 'success');
    } else {
      setProducts(prev => [newProduct, ...prev]);
      triggerNotification(`Successfully launched "${newProduct.name}" into your storefront catalog!`, 'success');
    }

    // Reset inputs
    setProdName('');
    setProdDesc('');
    setProdLongDesc('');
    setProdTag('');
    setProdWeight('');
    setSizeTiers([{ kg: '1.0', servings: '6-8', price: '' }]);
    setProdAllergens([]);
  };

  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleStartEdit = (product: CakeProduct) => {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdDesc(product.description);
    setProdLongDesc(product.longDescription || '');
    setProdImage(product.image);
    setProdTag(product.tag || '');
    setProdWeight(product.weight || '');
    setSizeTiers(
      product.sizeTiers && product.sizeTiers.length > 0
        ? product.sizeTiers.map(t => ({ kg: t.kg, servings: t.servings, price: String(t.price) }))
        : [{ kg: '1.0', servings: '6-8', price: String(product.price) }]
    );
    setProdAllergens(product.allergens || []);
    // Scroll to form
    document.getElementById('create-product-btn')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Remove Product action
  const handleDeleteProduct = (id: string, name: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    triggerNotification(`Removed "${name}" from storefront catalog.`, 'info');
  };

  // New task scheduler states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState('09:30');
  const [newPeriod, setNewPeriod] = useState<'AM' | 'PM'>('AM');
  const [newBorder, setNewBorder] = useState<'primary' | 'tertiary' | 'dim' | 'outline'>('primary');

  // Delete Order handle
  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  // Change Status handle - persists to D1 + updates KPIs reactively!
  const handleUpdateStatus = async (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        triggerNotification('Status update failed — please try again.', 'error');
        fetch(`/api/orders?_=${Date.now()}`)
          .then(r => r.json())
          .then((d: Order[]) => setOrders(d))
          .catch(() => {});
      }
    } catch {
      triggerNotification('Connection error — status may not have saved.', 'error');
    }
  };

  // Add Custom shift to baking schedule list
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ScheduleItem = {
      id: `sc-custom-${Date.now()}`,
      time: newTime,
      period: newPeriod,
      title: newTitle,
      description: newDesc || 'General preparation task',
      borderType: newBorder
    };

    setSchedule(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    
    // Reset fields
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  // Dynamic KPI Recalculation
  const totalSales = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.total, 0);

  const activeBakingCount = orders.filter(o => ['BAKING', 'READY', 'OUT FOR DELIVERY'].includes(o.status)).length;
  const pendingQueueCount = orders.filter(o => ['PENDING', 'CONFIRMED'].includes(o.status)).length;
  
  // Calculate best-selling cake name dynamically from logged orders
  const itemCounts: { [key: string]: number } = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      itemCounts[item.productName] = (itemCounts[item.productName] || 0) + item.quantity;
    });
  });
  let bestSeller = 'Lemon Elderflower';
  let maxCount = 0;
  Object.keys(itemCounts).forEach(item => {
    if (itemCounts[item] > maxCount) {
      maxCount = itemCounts[item];
      bestSeller = item;
    }
  });

  return (
    <div className="w-full px-5 md:px-[64px] max-w-[1280px] mx-auto py-8 animate-fadeIn space-y-8 text-left relative">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 animate-fadeIn ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          notification.type === 'info' ? 'bg-sky-50 border-sky-200 text-sky-800' :
          'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            notification.type === 'success' ? 'bg-emerald-500' :
            notification.type === 'info' ? 'bg-sky-500' : 'bg-amber-500'
          }`} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* 1. Header portal title with live toggle option */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-brand-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 text-brand-primary">
            <Landmark className="w-5 h-5" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest">Nawala Backoffice Gate</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-on-surface font-semibold mt-1">
            The Baker's Dashboard
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Navigation tabs inside header */}
          <div className="flex bg-brand-surface-low border border-brand-outline-variant/10 p-1 rounded-xl">
            <button
              onClick={() => setActiveMenu('schedule')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'schedule'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-on-surface-variant hover:text-brand-primary'
              }`}
            >
              Baking Schedule
            </button>
            
            <button
              onClick={() => setActiveMenu('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                activeMenu === 'orders'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-on-surface-variant hover:text-brand-primary'
              }`}
              id="orders-management-tab"
            >
              Orders Tracker
              {pendingQueueCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveMenu('products')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'products'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-on-surface-variant hover:text-brand-primary'
              }`}
              id="manage-products-tab"
            >
              Manage Catalog
            </button>

            <button
              onClick={() => setActiveMenu('analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'analytics'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-on-surface-variant hover:text-brand-primary'
              }`}
            >
              Boutique Performance
            </button>
            <button
              onClick={() => setActiveMenu('settings')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'settings'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-on-surface-variant hover:text-brand-primary'
              }`}
            >
              Settings
            </button>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
            >
              Lock Console
            </button>
          )}
        </div>
      </div>

      {/* 2. LIVE METRICS ROW (KPI CARS) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Realized Income */}
        <div className="bg-white p-5 rounded-2xl border border-brand-outline-variant/10 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider">Total Realized Sales</span>
            <p className="font-serif text-2xl font-bold text-brand-primary" id="kpi-delivered-revenue">
              Rs. {totalSales.toLocaleString()}
            </p>
            <span className="block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-max">
              Delivered Orders Only
            </span>
          </div>
          <div className="p-3 bg-brand-primary-fixed/30 text-brand-primary rounded-xl">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 2: Active baking ovens */}
        <div className="bg-white p-5 rounded-2xl border border-brand-outline-variant/10 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider">Active in Baking Oven</span>
            <p className="font-serif text-2xl font-bold text-brand-primary" id="kpi-baking-count">
              {activeBakingCount}
            </p>
            <span className="block text-[9px] font-bold text-brand-primary bg-brand-primary-fixed/20 px-2 py-0.5 rounded-md w-max">
              Bakers Active
            </span>
          </div>
          <div className="p-3 bg-brand-primary-fixed/30 text-brand-primary rounded-xl">
            <Flame className="w-5.5 h-5.5 text-orange-500 animate-bounce" />
          </div>
        </div>

        {/* KPI 3: Pending verification order queues */}
        <div className="bg-white p-5 rounded-2xl border border-brand-outline-variant/10 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider">Unscheduled Queue</span>
            <p className="font-serif text-2xl font-bold text-brand-primary" id="kpi-pending-count">
              {pendingQueueCount}
            </p>
            <span className="block text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-max">
              Needs Intake Allocations
            </span>
          </div>
          <div className="p-3 bg-brand-primary-fixed/30 text-brand-primary rounded-xl">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 4: Popular product item name */}
        <div className="bg-white p-5 rounded-2xl border border-brand-outline-variant/10 shadow-sm flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <span className="block text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider">Top Cacao Request</span>
            <p className="font-serif text-base font-bold text-brand-primary truncate" title={bestSeller}>
              {bestSeller}
            </p>
            <span className="block text-[9px] font-bold text-brand-secondary bg-brand-secondary-container/50 px-2 py-0.5 rounded-md w-max">
              Best Seller
            </span>
          </div>
          <div className="p-3 bg-brand-primary-fixed/30 text-brand-primary rounded-xl flex-shrink-0">
            <Award className="w-5.5 h-5.5 text-brand-primary" />
          </div>
        </div>

      </section>

      {/* 3. CONDITIONAL MAIN VIEW CHANNELS */}

      {/* VIEW A: BAKING SCHEDULE PANEL */}
      {activeMenu === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          
          {/* Baking hours Timeline (Left - 7 Cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-brand-outline-variant/15 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-brand-surface-low pb-3">
              <h3 className="font-serif text-lg font-semibold text-brand-primary">
                Daily Baking Run Sequence
              </h3>
              <span className="text-[10px] font-bold text-brand-on-surface-variant bg-brand-surface-low px-3 py-1 rounded-full uppercase tracking-wider">
                Shift: Morning & Midday
              </span>
            </div>

            {schedule.length === 0 ? (
              <div className="text-center py-10 text-brand-on-surface-variant text-xs">
                No active baking duties queued. Use the scheduler panel to assign new tasks.
              </div>
            ) : (
              <div className="relative border-l border-brand-outline-variant/30 pl-6 ml-4 space-y-6">
                {schedule.map((item) => (
                  <div key={item.id} className="relative group text-left">
                    {/* Timestamp Node dot */}
                    <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      item.borderType === 'primary' ? 'border-brand-primary scale-110' :
                      item.borderType === 'tertiary' ? 'border-brand-primary-container' :
                      'border-brand-secondary/40'
                    }`} />

                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-primary">
                            {item.time} {item.period}
                          </span>
                          <span className="text-[9px] font-bold text-brand-secondary bg-brand-surface-container px-2 py-0.5 rounded">Scheduled</span>
                        </div>
                        <h4 className="font-serif font-semibold text-sm text-brand-on-surface group-hover:text-brand-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-brand-on-surface-variant text-xs font-medium">
                          {item.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteSchedule(item.id)}
                        className="p-1.5 text-brand-on-surface-variant hover:text-brand-primary hover:bg-brand-primary-fixed/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete scheduling assignment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Scheduler Intake Form (Right - 4 Cols) */}
          <div className="lg:col-span-4 bg-[#fcf9f7] rounded-3xl p-6 border border-brand-outline-variant/15 space-y-4">
            <h3 className="font-serif text-base font-semibold text-brand-primary border-b border-brand-outline-variant/15 pb-2">
              Queue Baking Shift
            </h3>

            <form onSubmit={handleAddSchedule} className="space-y-4 text-xs font-medium">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fold Velvet Sponge Batter"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Explanation Description</label>
                <textarea
                  placeholder="e.g. Batch #45 - Velvet Lavender"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs min-h-[50px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Start Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">AM/PM</label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value as 'AM' | 'PM')}
                    className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none text-xs"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Priority Visual Dot</label>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setNewBorder('primary')}
                    className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer ${newBorder === 'primary' ? 'bg-white border-brand-primary text-brand-primary shadow-sm' : 'border-transparent text-brand-on-surface-variant'}`}
                  >
                    Primary Accent
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewBorder('tertiary')}
                    className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer ${newBorder === 'tertiary' ? 'bg-white border-brand-primary-container text-brand-primary-container shadow-sm' : 'border-transparent text-brand-on-surface-variant'}`}
                  >
                    Container Accent
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-primary hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                id="add-schedule-btn"
              >
                <Plus className="w-4 h-4" />
                Inject Slot
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW B: ORDERS MANAGEMENT TRACKER */}
      {activeMenu === 'orders' && (
        <div className="bg-white p-6 rounded-2xl border border-brand-outline-variant/15 shadow-sm space-y-4 animate-fadeIn text-left">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-brand-surface-low pb-3">
            <h3 className="font-serif text-lg font-semibold text-brand-primary">
              Real-time Customer Commissions Hub
            </h3>
            <span className="text-xs font-semibold text-brand-on-surface-variant">
              Showing {orders.length} unique records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-medium text-brand-on-surface-variant">
              <thead>
                <tr className="border-b border-brand-outline-variant/20 bg-brand-surface-low/30 text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Client Detail</th>
                  <th className="py-3 px-4">Items Requested & customizations</th>
                  <th className="py-3 px-4">Recalculated Cost</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Intake Status</th>
                  <th className="py-3 px-4 text-right">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-surface-low">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-surface-low/20 transition-colors group">
                    {/* Order ID */}
                    <td className="py-4 px-4 font-mono font-bold text-brand-primary">
                      {order.id}
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-4 space-y-1">
                      <p className="font-bold text-brand-on-surface">{order.customerName}</p>
                      <p className="text-[10px] opacity-80 truncate max-w-[150px]">{order.customerEmail}</p>
                      <p className="text-[10px] text-brand-secondary font-semibold font-mono">Date: {order.date}</p>
                    </td>

                    {/* Products Customized */}
                    <td className="py-4 px-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <p className="font-bold text-brand-on-surface">
                            {item.quantity}x {item.productName}
                          </p>
                          <p className="text-[10px] italic">Composition: {item.size}</p>
                        </div>
                      ))}
                    </td>

                    {/* Cost */}
                    <td className="py-4 px-4 font-mono font-bold text-brand-primary">
                      Rs. {order.total.toLocaleString()}
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-4 text-left">
                      {order.paymentTransactionId ? (
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-mono font-bold text-emerald-700 truncate max-w-[140px]" title={order.paymentTransactionId}>
                            {order.paymentTransactionId}
                          </p>
                          <p className="text-[9px] text-brand-on-surface-variant/70">{order.paymentType}</p>
                          {order.paymentEmail && (
                            <p className="text-[9px] text-brand-on-surface-variant/60 truncate max-w-[140px]">{order.paymentEmail}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-brand-on-surface-variant/40 italic">—</span>
                      )}
                    </td>

                    {/* Status select */}
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={e => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className="text-[10px] rounded-lg px-2 py-1.5 border border-brand-outline-variant/20 bg-brand-surface font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:border-brand-primary transition-colors"
                        style={{ color: statusColor(order.status) }}
                        id={`order-status-badge-${order.id}`}
                      >
                        {(['PENDING','CONFIRMED','BAKING','READY','OUT FOR DELIVERY','DELIVERED','CANCELLED'] as OrderStatus[]).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    {/* Management controls */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-brand-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Purge order index"
                          id={`btn-delete-${order.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW C: ANALYTICS MOCK BARS */}
      {activeMenu === 'analytics' && (
        <div className="bg-white p-6 rounded-2xl border border-brand-outline-variant/15 shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-semibold text-brand-primary">Nawala Footfall & Baking Volume</h3>
            <p className="text-brand-on-surface-variant text-xs font-medium">Boutique operational insights compared across active morning bakes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Chart 1: Cakes baked daily */}
            <div className="p-4 bg-brand-surface-low rounded-xl border border-brand-outline-variant/10 space-y-4">
              <h4 className="font-serif font-bold text-xs text-brand-primary uppercase tracking-wider">Cakes Produced Daily</h4>
              <div className="h-48 flex items-end gap-3 pt-6 px-2">
                {[
                  { label: 'Mon', count: 18, pct: '35%' },
                  { label: 'Tue', count: 24, pct: '48%' },
                  { label: 'Wed', count: 35, pct: '70%' },
                  { label: 'Thu', count: 42, pct: '85%' },
                  { label: 'Fri', count: 50, pct: '100%' },
                  { label: 'Sat', count: 48, pct: '96%' },
                  { label: 'Sun', count: 22, pct: '44%' }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[9px] font-mono font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.count}
                    </span>
                    <div 
                      className="w-full bg-brand-primary rounded-t-md hover:bg-brand-primary-container transition-all cursor-pointer shadow-sm"
                      style={{ height: bar.pct }}
                    />
                    <span className="text-[10px] font-bold font-sans text-brand-on-surface-variant">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Category distribution */}
            <div className="p-4 bg-brand-surface-low rounded-xl border border-brand-outline-variant/10 space-y-4 text-left">
              <h4 className="font-serif font-bold text-xs text-brand-primary uppercase tracking-wider">Category Revenue Distribution</h4>
              
              <div className="space-y-4 pt-4">
                {[
                  { name: 'Artisan Cakes Menu', ratio: '54%', cost: 'Rs. 320,000', bg: 'bg-brand-primary' },
                  { name: 'Premium Collections', ratio: '28%', cost: 'Rs. 180,000', bg: 'bg-brand-primary-container' },
                  { name: 'Botanical Gifts & Macarons', ratio: '18%', cost: 'Rs. 100,000', bg: 'bg-brand-secondary' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-brand-on-surface">{item.name}</span>
                      <span className="font-mono text-brand-primary">{item.cost} ({item.ratio})</span>
                    </div>
                    {/* Visual Bar line */}
                    <div className="w-full h-2.5 bg-brand-surface-highest rounded-full overflow-hidden">
                      <div className={`h-full ${item.bg}`} style={{ width: item.ratio }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW D: CATALOG MANAGEMENT */}
      {activeMenu === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          
          {/* Catalog Listing List (Left - 7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-brand-outline-variant/15 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-brand-surface-low pb-3">
              <h3 className="font-serif text-lg font-semibold text-brand-primary">
                Boutique Products ({products.length})
              </h3>
              <span className="text-[10px] font-bold text-brand-on-surface-variant bg-brand-surface-low px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Live Storefront Sync
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-2">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex gap-3 p-3 bg-brand-surface-low/30 rounded-xl border border-brand-outline-variant/10 relative group hover:border-brand-primary/20 transition-all text-left"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-brand-surface-highest">
                    <img 
                      src={product.image} 
                      alt={product.alt} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left space-y-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded">
                        {product.category}
                      </span>
                      {product.tag && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded">
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-xs truncate text-brand-on-surface">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-brand-on-surface-variant truncate font-medium">
                      {product.description}
                    </p>
                    <p className="text-xs font-mono font-bold text-brand-primary">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(product)}
                      className="p-1.5 text-brand-on-surface-variant hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all cursor-pointer"
                      title="Edit product"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="p-1.5 text-brand-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Remove product from catalog"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog Intake Form (Right - 5 Cols) */}
          <div className="lg:col-span-5 bg-[#fcf9f7] rounded-3xl p-6 border border-brand-outline-variant/15 space-y-4">
            <h3 className="font-serif text-base font-semibold text-brand-primary border-b border-brand-outline-variant/15 pb-2 flex items-center gap-2">
              {editingProductId ? <Pencil className="w-4 h-4 text-brand-primary" /> : <Plus className="w-4 h-4 text-brand-primary" />}
              {editingProductId ? 'Edit Product' : 'Add New Gourmet Product'}
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-medium text-left">
              
              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crimson Raspberry Dome"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Category *</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none text-xs"
                >
                  <option value="Cakes">Cakes</option>
                  <option value="Collections">Collections</option>
                  <option value="Gifts">Gifting & Boxes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Short Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silky vanilla layers paired with tart raspberry purees."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Detailed Explanation Description</label>
                <textarea
                  placeholder="Tell customers about the premium ingredients, tasting notes, and baking style... (Optional)"
                  value={prodLongDesc}
                  onChange={(e) => setProdLongDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs min-h-[70px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Image Asset Preview *</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter custom image URL"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full p-2 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none font-sans text-[11px]"
                  />
                  {/* Presets Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Red Velvet', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xg23JS1m4efL9471QbGoCMXQ8bREBf4rmiEUsiiZ1DtA43Izo8whF4OBWlboGEe0Aa3nnYVteJ1aCUP2zV93ExluaKODbXHiKA8BhHAmdoUj2vY0_5o0KZ8wbdna2iNNELxvWFBr-TtUjk6Ukonssn9vTtAXuDLIn4nkCgVdSc1eDXVO1DgztvyqYOmBpw3u37mCTHGXsIPPaDEXOedqHrdX9SRPk5gmo21sPXS7YJukfAPHw1Wp_-UpKUB8jY99nr8F4-dV4bU' },
                      { name: 'Gold Drip', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUGLnBgoml0dPda9a2yNWLNgKZoAPA7cFGsKFfS-LAFNeix4penlRCsck0SaTZHDE0SRjoHB-Eo-f3Dn2eksi0ApbjJbUnVJ0nMgjWy2aa2bEypmbqkLpLYXPBqiwhozhsXpNEMbtXVUBgFrtTFghbktnZwag45KM1EXrtAPNIZZSIstP1yhGyFVy3TfGAH-3yzcwB8GH0308_jreOkC3zwv9mbRHXdb43SFr-2y0-GKQQg1WGz9c_c-UUlKXdaUoG8Bylhxo4x5k' },
                      { name: 'Royal Cakes', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrMpF8s7Ffh2BH2NwsjhsjKRP6ExDzIy3W5nnbBDc4CFYmsNb5RflMZFifVKRY20sfuo1S5oz3nPr7yNE9oOlDSECjhGTLz5U9kghA-cSOLGqBKjp17-_llX9hCkKVDXmeWH3ywJ68wSW3-CAsm-PrPkN4ZGMX1l8t2eHddR8MEKOQ5-2ZXjTPmoUEZLT900AvJo1SD8NO4-ellhGGX3WglfX-iL8sES2cmQi6pN_5WS7AN7-fLKeh-leUJxtOrrMTPFaOrK7AJMU' },
                      { name: 'Gourmet Spark', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz-23w0J_66tl8VykQO9bRjgaQZbv5DEdcQQ6FQXy9JshsIu4JDNi0esbyszhxxaNyB8ovoo8jNLjxv3dyz9034J8JT6KXkzs1MUCPJBpad3MLdnyhs6VEp-IGgRTnmk6-lCOsK_eqr0_GofTCEUHrWmQJQq7MkpQjR21gnPHS8u_R1Y6cpxI-YAp-wFf43dq7-Mztl7W_mfBa3zwUX_m99ytTDARzAU4TECfU_GN900laB1Wxn2aM4Fbxi9QnRjdlqZv1_L03N_o' }
                    ].map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProdImage(p.url)}
                        className={`p-1 bg-white border rounded-lg text-[9px] font-bold text-center truncate hover:border-brand-primary cursor-pointer transition-all ${prodImage === p.url ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-gray-200 text-gray-500'}`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Size Composition Tiers — dynamic */}
              <div className="space-y-2">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Size Composition & Pricing</label>
                <div className="bg-brand-surface-low/40 border border-brand-outline-variant/20 rounded-xl p-3 space-y-2 text-[11px]">
                  {/* Header */}
                  <div className="grid grid-cols-[56px_80px_1fr_96px_20px] gap-2 text-[9px] uppercase tracking-wider text-brand-on-surface-variant/60 font-bold pb-1 border-b border-brand-outline-variant/15">
                    <span>kg</span>
                    <span>Servings</span>
                    <span>Price (Rs.)</span>
                    <span className="text-right">Total</span>
                    <span />
                  </div>

                  {sizeTiers.map((tier, i) => (
                    <div key={i} className="grid grid-cols-[56px_80px_1fr_96px_20px] gap-2 items-center">
                      <input type="number" step="0.1" min="0.1" value={tier.kg}
                        onChange={e => setSizeTiers(prev => prev.map((t, j) => j === i ? { ...t, kg: e.target.value } : t))}
                        className="w-full p-1.5 bg-white border border-brand-outline-variant/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono" />
                      <input type="text" placeholder="e.g. 6-8" value={tier.servings}
                        onChange={e => setSizeTiers(prev => prev.map((t, j) => j === i ? { ...t, servings: e.target.value } : t))}
                        className="w-full p-1.5 bg-white border border-brand-outline-variant/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs" />
                      <input type="number" min="0" step="1" required={i === 0} placeholder={i === 0 ? 'Base price' : 'Price'}
                        value={tier.price}
                        onChange={e => setSizeTiers(prev => prev.map((t, j) => j === i ? { ...t, price: e.target.value } : t))}
                        className={`w-full p-1.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs font-mono ${i === 0 ? 'border-brand-primary/40' : 'border-brand-outline-variant/30'}`} />
                      <span className="text-right font-mono font-bold text-brand-primary text-[10px]">
                        Rs. {(parseFloat(tier.price) || 0).toLocaleString()}
                      </span>
                      {i > 0 ? (
                        <button type="button" onClick={() => setSizeTiers(prev => prev.filter((_, j) => j !== i))}
                          className="flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer text-sm leading-none">
                          ×
                        </button>
                      ) : <span />}
                    </div>
                  ))}

                  <button type="button"
                    onClick={() => setSizeTiers(prev => [...prev, { kg: '', servings: '', price: '' }])}
                    className="mt-1 flex items-center gap-1 text-[10px] font-bold text-brand-primary hover:text-brand-primary/70 cursor-pointer transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Size
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="e.g. 1.5"
                  value={prodWeight}
                  onChange={(e) => setProdWeight(e.target.value)}
                  className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
                />

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Aesthetic Badge</label>
                  <select
                    value={prodTag}
                    onChange={(e) => setProdTag(e.target.value)}
                    className="w-full p-2.5 bg-white border border-brand-outline-variant/30 rounded-xl focus:outline-none text-xs"
                  >
                    <option value="">None</option>
                    <option value="Top Seller">Top Seller</option>
                    <option value="Baker's Pick">Baker's Pick</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Exclusive">Exclusive</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-brand-primary font-bold uppercase tracking-wider">Allergens</label>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {['Dairy', 'Eggs', 'Wheat', 'Soy', 'Nuts'].map((allergen) => {
                    const isChecked = prodAllergens.includes(allergen);
                    return (
                      <label 
                        key={allergen} 
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                            : 'bg-white border-brand-outline-variant/20 hover:bg-gray-50 text-brand-on-surface-variant'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setProdAllergens(prev => prev.filter(a => a !== allergen));
                            } else {
                              setProdAllergens(prev => [...prev, allergen]);
                            }
                          }}
                        />
                        {allergen}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                {editingProductId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setProdName(''); setProdDesc(''); setProdLongDesc(''); setProdTag('');
                      setProdWeight(''); setSizeTiers([{ kg: '1.0', servings: '6-8', price: '' }]); setProdAllergens([]);
                    }}
                    className="py-3.5 px-5 border border-brand-outline-variant/30 text-brand-on-surface-variant hover:bg-brand-surface-low font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-brand-primary hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  id="create-product-btn"
                >
                  {editingProductId ? <><Pencil className="w-4 h-4" /> Save Changes</> : <><Plus className="w-4 h-4" /> Inscribe into Storefront</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeMenu === 'settings' && (
        <div className="max-w-md space-y-4">

          {/* Tax Rate */}
          <div className="bg-white rounded-2xl border border-brand-outline-variant/15 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-outline-variant/15">
              <Award className="w-5 h-5 text-brand-primary" />
              <h3 className="font-serif text-base font-semibold text-brand-on-surface">Tax Rate</h3>
            </div>
            <TaxRateSetting triggerNotification={triggerNotification} />
          </div>

          <div className="bg-white rounded-2xl border border-brand-outline-variant/15 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-outline-variant/15">
              <KeyRound className="w-5 h-5 text-brand-primary" />
              <h3 className="font-serif text-base font-semibold text-brand-on-surface">Change Admin Password</h3>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Current Password</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)}
                    className="w-full px-4 pr-12 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm" required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-3.5 text-brand-on-surface-variant/60 hover:text-brand-primary">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">New Password</label>
                <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm" required />
              </div>
              {pwdError && <p className="text-red-600 text-xs font-semibold">{pwdError}</p>}
              {pwdMsg && <p className="text-emerald-600 text-xs font-semibold">{pwdMsg}</p>}
              <button type="submit" className="w-full py-3 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-105 transition-all">
                Update Password
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
