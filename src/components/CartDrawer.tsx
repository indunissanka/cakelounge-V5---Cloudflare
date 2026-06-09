import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({ 
  isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onProceedToCheckout 
}: CartDrawerProps) {
  
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Background backing overlay with blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-brand-on-surface/40 backdrop-blur-sm transition-opacity" 
      />

      {/* Slide-out drawer body */}
      <div className="relative w-full max-w-md bg-white h-full shadow-[0_12px_45px_rgba(80,22,68,0.15)] flex flex-col justify-between z-10 animate-slideLeft text-left border-l border-brand-outline-variant/20">
        
        {/* Header slot */}
        <div className="p-5 border-b border-brand-outline-variant/15 flex justify-between items-center bg-[#fffbf9]">
          <div className="flex items-center gap-2 text-brand-primary">
            <ShoppingBag className="w-5.5 h-5.5" />
            <h3 className="font-serif text-lg font-semibold uppercase tracking-tight">Your Shopping Bag</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-brand-primary-fixed/20 text-brand-primary transition-all cursor-pointer"
            aria-label="Close Shopping Bag"
            id="close-cart-btn"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Content list body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 hide-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
              <ShoppingBag className="w-12 h-12 text-brand-outline-variant/70 stroke-[1.5]" />
              <p className="text-brand-on-surface-variant text-xs font-semibold leading-relaxed">
                Your bag is presently empty. Explore our exquisite artisan menu to begin compounding selections.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-brand-primary text-white font-bold text-xs tracking-wider uppercase rounded-full cursor-pointer hover:brightness-110 active:scale-95 transition-all text-center"
              >
                Go Explore Cakes
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={index} 
                className="flex gap-4 p-4 rounded-xl border border-brand-outline-variant/10 bg-[#fdfdfd] hover:border-brand-primary/20 transition-all flex-row items-center relative group"
              >
                {/* Thumb image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-surface-low flex-shrink-0 border border-brand-outline-variant/5">
                  <img src={item.product.image} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="" />
                </div>

                {/* Details layout */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="font-serif font-bold text-xs text-brand-on-surface truncate pr-4">
                      {item.product.name}
                    </h4>
                    <span className="font-mono text-xs font-bold text-brand-primary whitespace-nowrap">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[10px] text-brand-on-surface-variant font-medium">
                    Composition: {item.selectedSize}
                  </p>

                  {/* Note block label If custom note added */}
                  {item.enhancements.handwrittenNote && (
                    <div className="text-[9px] font-bold text-brand-primary bg-brand-primary-fixed/30 px-2 py-0.5 rounded max-w-xs truncate inline-block">
                      Note: "{item.enhancements.noteText || 'Custom handwritten letter'}"
                    </div>
                  )}

                  {/* Quantity and Actions row */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 border border-brand-outline-variant/20 bg-brand-surface-low/30 rounded-lg py-0.5 px-2">
                      <button
                        onClick={() => onUpdateQuantity(index, -1)}
                        className="text-xs text-brand-on-surface hover:text-brand-primary font-bold cursor-pointer"
                        title="Reduce item count"
                        id={`cart-minus-${index}`}
                      >
                        -
                      </button>
                      <span className="font-mono text-xs font-bold text-brand-primary w-4 text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, 1)}
                        className="text-xs text-brand-on-surface hover:text-brand-primary font-bold cursor-pointer"
                        title="Increment item count"
                        id={`cart-plus-${index}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="p-1.5 text-brand-on-surface-variant hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Purge selection"
                      id={`cart-remove-${index}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions slots */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-brand-outline-variant/15 bg-[#fffbf9] space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-serif font-semibold text-brand-primary uppercase tracking-wider">
                Subtotal
              </span>
              <span className="font-serif text-2xl font-bold text-brand-primary" id="cart-drawer-subtotal">
                Rs. {total.toLocaleString()}
              </span>
            </div>

            <p className="text-[10px] text-brand-on-surface-variant font-medium leading-relaxed">
              Standard secure transport and luxury VAT taxation are computed during checkout reservations.
            </p>

            <button
              onClick={() => {
                onProceedToCheckout();
                onClose();
              }}
              className="w-full py-4 bg-brand-primary hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all active:scale-99 cursor-pointer flex justify-center items-center gap-2"
              id="cart-drawer-checkout-btn"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
