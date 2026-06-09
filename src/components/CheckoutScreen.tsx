import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, Tag, Info, 
  MapPin, CalendarDays, CheckCircle, Gift, Truck 
} from 'lucide-react';
import { CartItem, Order, Customer } from '../types';
import PayPalPayment from './PayPalPayment';

interface CheckoutScreenProps {
  cart: CartItem[];
  onPlaceOrder: (order: Order) => void;
  onBackToStore: () => void;
  currentUser?: Customer | null;
}

export default function CheckoutScreen({ cart, onPlaceOrder, onBackToStore, currentUser = null }: CheckoutScreenProps) {
  // Coupon state
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  // Auto-fill coordinates if logged in
  useEffect(() => {
    if (currentUser) {
      const parts = currentUser.name.trim().split(/\s+/);
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(currentUser.email || '');
      setAddress(currentUser.address || '');
      setCity(currentUser.city || '');
      setPostalCode(currentUser.postalCode || '');
    }
  }, [currentUser]);

  // Finished success state
  const [placedOrderRecord, setPlacedOrderRecord] = useState<Order | null>(null);

  // Form input validation status
  const isFormValid = 
    firstName.trim().length > 0 && 
    lastName.trim().length > 0 && 
    email.includes('@') && 
    address.trim().length > 0 && 
    city.trim().length > 0 && 
    postalCode.trim().length > 0 && 
    deliveryDate.trim().length > 0;

  // Custom callback handling complete PayPal actions
  const handlePayPalSuccess = (details: { transactionId: string; email?: string; paymentType: string }) => {
    if (cart.length === 0) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `CK-${randomSuffix}`;

    const newOrder: Order = {
      id: `${orderId} (${details.transactionId})`,
      customerName: `${firstName} ${lastName}`,
      customerEmail: email || details.email || 'customer@cakelounge.com',
      address: address,
      city: city,
      postalCode: postalCode,
      deliveryDate: deliveryDate || new Date(Date.now() + 86450000 * 2).toISOString().split('T')[0],
      items: cart.map(item => ({
        productName: item.product.name,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.product.price
      })),
      subtotal: subtotal,
      delivery: deliveryFee,
      tax: tax,
      total: total,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0]
    };

    setPlacedOrderRecord(newOrder);
    onPlaceOrder(newOrder); 
  };

  // Financial calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 10000 ? 0 : 750.00; // Free delivery over Rs. 10,000
  
  const discountAmount = discountApplied ? (subtotal * discountPercent) : 0;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.09; // 9% luxury pastry tax
  const total = taxableAmount + deliveryFee + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    
    if (code === 'LOUNGE10') {
      setDiscountApplied(true);
      setDiscountPercent(0.10);
      setPromoError('');
    } else if (code === 'BREAD' || code === 'CAKE') {
      setDiscountApplied(true);
      setDiscountPercent(0.15);
      setPromoError('');
    } else if (code) {
      setPromoError('Unknown promo-code. Try "LOUNGE10" for 10% off.');
    }
  };

  // Render Order Confirmation screen if placed
  if (placedOrderRecord) {
    return (
      <div className="w-full px-5 md:px-[64px] max-w-[800px] mx-auto py-16 animate-scaleIn text-center space-y-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-pulse">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <p className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Gourmet Transport Reserved</p>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-on-surface font-semibold">
            Your Order is Confirmed
          </h1>
          <p className="font-mono text-sm font-bold text-brand-primary">
            Reservation Reference: {placedOrderRecord.id}
          </p>
          <p className="text-brand-on-surface-variant text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Thank you, <span className="font-bold text-brand-on-surface">{placedOrderRecord.customerName}</span>. Your bespoke order has been logged in our Nawala master schedule. Our baking crew begins folding your sponge elements tomorrow morning at 05:00 AM.
          </p>
        </div>

        {/* Deliver route details Summary panel */}
        <div className="bg-white p-6 rounded-2xl border border-brand-outline-variant/15 text-left space-y-4 max-w-lg mx-auto shadow-sm">
          <h3 className="font-serif text-sm font-semibold text-brand-primary border-b border-brand-surface-low pb-2 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Route Routing Particulars:
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <span className="block text-brand-on-surface-variant/75 text-[10px] font-bold uppercase tracking-wider">Destination</span>
              <p className="text-brand-on-surface">{placedOrderRecord.address}, {placedOrderRecord.city}</p>
            </div>
            <div>
              <span className="block text-brand-on-surface-variant/75 text-[10px] font-bold uppercase tracking-wider">Target Arrival</span>
              <p className="text-brand-on-surface">{placedOrderRecord.deliveryDate}</p>
            </div>
            <div>
              <span className="block text-brand-on-surface-variant/75 text-[10px] font-bold uppercase tracking-wider">Total Charge</span>
              <p className="text-brand-primary font-bold">Rs. {placedOrderRecord.total.toLocaleString()}</p>
            </div>
            <div>
              <span className="block text-brand-on-surface-variant/75 text-[10px] font-bold uppercase tracking-wider">Notifications Email</span>
              <p className="text-brand-on-surface truncate">{placedOrderRecord.customerEmail}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={onBackToStore}
            className="px-8 py-3.5 bg-brand-primary text-white font-bold text-xs tracking-wider uppercase rounded-full hover:brightness-110 cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            Return to Storefront
          </button>
          
          <button
            onClick={() => {
              // Direct switch to administrative portal
              // The main App layout receives activeTab triggers
              const devEl = document.getElementById('admin-link-fallback');
              if (devEl) devEl.click();
              window.location.reload(); // simple re-init fallback to secure update
            }}
            className="px-8 py-3.5 bg-[#f5ece8] hover:bg-brand-primary-fixed/40 text-brand-primary font-bold text-xs tracking-wider uppercase rounded-full cursor-pointer transition-all"
            id="redirect-to-admin-btn"
          >
            Track in Admin Scheduler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 md:px-[64px] max-w-[1280px] mx-auto py-8 animate-fadeIn">
      
      <div className="space-y-2 mb-8">
        <p className="text-brand-primary text-xs font-bold tracking-widest uppercase">Secured checkoutssl</p>
        <h1 className="font-serif text-3xl md:text-4xl text-brand-on-surface font-semibold">Reserve Your Composition</h1>
        <p className="text-brand-on-surface-variant text-sm font-medium">Please review details & submit for custom morning baking.</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 space-y-6 max-w-md mx-auto">
          <p className="text-brand-on-surface-variant text-sm font-medium">Your shopping bag is currently empty. Head back to the menu to explore gourmet selections.</p>
          <button
            onClick={onBackToStore}
            className="px-8 py-3.5 bg-brand-primary text-white font-bold text-xs tracking-wider uppercase rounded-full cursor-pointer hover:brightness-110"
          >
            Browse Cakes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Intake Form (Left - 7 Cols) */}
          <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-7 space-y-6">
            
            {/* 1. Recipient Details */}
            <div className="bg-white rounded-2xl border border-brand-outline-variant/15 p-6 space-y-4 shadow-sm text-left">
              <h3 className="font-serif text-base font-semibold text-brand-primary flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5" />
                1. Transport & Destination Coordinates
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-brand-primary uppercase tracking-wider">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marie"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 border border-brand-outline-variant/30 text-xs font-sans rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary bg-brand-surface-low/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-brand-primary uppercase tracking-wider">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Antoinette"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-brand-outline-variant/30 text-xs font-sans rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary bg-brand-surface-low/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-brand-primary uppercase tracking-wider">Notifications Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. marie@bourbon.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-brand-outline-variant/30 text-xs font-sans rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary bg-brand-surface-low/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-brand-primary uppercase tracking-wider">Delivery Road Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palace of Versailles, Avenue de Paris"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-brand-outline-variant/30 text-xs font-sans rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary bg-brand-surface-low/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-brand-primary uppercase tracking-wider">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombo"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 border border-brand-outline-variant/30 text-xs font-sans rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary bg-brand-surface-low/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-brand-primary uppercase tracking-wider">Postal Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10120"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full p-3 border border-brand-outline-variant/30 text-xs font-sans rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary bg-brand-surface-low/20"
                  />
                </div>
              </div>
            </div>

            {/* 2. Schedule Date Picker */}
            <div className="bg-white rounded-2xl border border-brand-outline-variant/15 p-6 space-y-4 shadow-sm text-left">
              <h3 className="font-serif text-base font-semibold text-brand-primary flex items-center gap-2">
                <CalendarDays className="w-4.5 h-4.5" />
                2. Select Micro-Baking Arrival Slot
              </h3>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-brand-primary uppercase tracking-wider">Aesthetic Target Date *</label>
                <input
                  type="date"
                  required
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // minimum tomorrow
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full sm:max-w-xs p-3 border border-brand-outline-variant/30 text-xs font-sans rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary bg-brand-surface-low/20"
                  id="delivery-date-input"
                />
                <p className="text-[10px] text-brand-on-surface-variant font-medium leading-relaxed">
                  Our cooling vans load starting at 08:30 AM to guarantee fine ambient moisture retention on transit.
                </p>
              </div>
            </div>

            {/* 3. Secure payment details */}
            <div className="bg-white rounded-2xl border border-brand-outline-variant/15 p-6 space-y-5 shadow-sm text-left">
              <h3 className="font-serif text-base font-semibold text-brand-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-primary" />
                3. Secure PayPal Checkout Gateway
              </h3>

              <p className="text-xs text-brand-on-surface-variant/90 leading-relaxed font-semibold">
                Complete your checkout securely using PayPal. Once authorized, your bespoke order details will automatically transmit to our kitchen logbook.
              </p>

              <div className="pt-2">
                <PayPalPayment 
                  amount={total}
                  isValid={isFormValid}
                  billingDetails={{
                    firstName,
                    lastName,
                    email,
                    address,
                    city,
                    postalCode
                  }}
                  onSuccess={handlePayPalSuccess}
                  onCancel={() => {
                    alert('PayPal transaction cancelled. Feel free to try again.');
                  }}
                  onError={(err) => {
                    alert(`PayPal error encountered: ${err}`);
                  }}
                />
              </div>

              <div className="pt-3 border-t border-brand-surface-low flex items-center gap-2 text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                PCI DSS Compliant 256-bit cryptographic tunnel
              </div>
            </div>

          </form>

          {/* Checkout Bag Summary (Right - 5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-brand-outline-variant/15 p-6 space-y-6 shadow-sm text-left">
              <h3 className="font-serif text-base font-semibold text-brand-primary border-b border-brand-surface-low pb-3">
                Your Selection Summary
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3 py-2 border-b border-brand-surface-low last:border-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-surface-low flex-shrink-0 border border-brand-outline-variant/10">
                      <img src={item.product.image} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-1">
                        <p className="font-serif font-bold text-xs text-brand-on-surface truncate">
                          {item.product.name}
                        </p>
                        <span className="font-mono text-xs font-semibold text-brand-primary whitespace-nowrap">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-brand-on-surface-variant font-medium">
                        Composition: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                      {item.enhancements.handwrittenNote && (
                        <p className="text-[9px] font-bold text-brand-primary bg-brand-primary-fixed/20 px-2 py-0.5 rounded inline-block">
                          Note: "{item.enhancements.noteText}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code field */}
              <div className="space-y-2 pt-2 border-t border-brand-surface-low">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-brand-outline absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Insert code: LOUNGE10"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError('');
                      }}
                      className="w-full bg-brand-surface-low/30 border border-brand-outline-variant/30 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-brand-primary-fixed text-brand-on-primary-fixed hover:bg-brand-primary hover:text-white transition-all rounded-xl font-bold text-[10px] tracking-wider uppercase cursor-pointer flex-shrink-0 active:scale-95 shadow-sm"
                  >
                    Apply
                  </button>
                </form>
                
                {promoError && (
                  <p className="text-[10px] font-bold text-brand-primary pl-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {promoError}
                  </p>
                )}
                {discountApplied && (
                  <p className="text-[10px] font-bold text-emerald-600 pl-1 flex items-center gap-1 animate-fadeIn">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Promo code active: {(discountPercent * 100)}% off pastries!
                  </p>
                )}
              </div>

              {/* Financial calculations block */}
              <div className="pt-4 border-t border-brand-surface-low space-y-2.5 font-sans font-medium text-xs text-brand-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-xs">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-emerald-600 font-semibold animate-fadeIn">
                    <span>Discount ({(discountPercent * 100)}%)</span>
                    <span className="font-mono text-xs">- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Refrigerated transport couriers</span>
                  <span className="font-mono text-xs">
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Luxury tax (9% VAT)</span>
                  <span className="font-mono text-xs">Rs. {tax.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-baseline pt-4 border-t border-brand-surface-low text-brand-on-surface font-sans font-bold">
                  <span className="text-sm">Reservation Total</span>
                  <span className="font-serif text-2xl text-brand-primary" id="checkout-total-price">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
