import { Instagram, Facebook, Mail, CreditCard, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: 'home' | 'product-detail' | 'checkout' | 'admin') => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  return (
    <footer className="w-full bg-[#efe6e2] border-t border-brand-outline-variant/30 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-[64px] py-12 max-w-[1280px] mx-auto">
        
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="font-serif text-2xl text-brand-primary font-bold">
            The Cake Lounge
          </div>
          <p className="text-brand-on-surface-variant text-sm font-medium leading-relaxed max-w-sm">
            Crafting memories in sugar since 2014. Artisan luxury cakes for those who appreciate the finer details of culinary art.
          </p>
          <div className="flex gap-4 pt-2">
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              className="p-2 bg-white rounded-full text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-sm"
              aria-label="Instagram Link"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              className="p-2 bg-white rounded-full text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-sm"
              aria-label="Facebook Link"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              className="p-2 bg-white rounded-full text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-sm"
              aria-label="Mail Link"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 font-sans font-medium">
            <li>
              <button 
                onClick={() => {
                  setCurrentTab('home');
                  setTimeout(() => document.getElementById('bakers-choice-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }} 
                className="text-brand-on-surface-variant hover:text-brand-primary text-sm hover:underline transition-all block text-left"
              >
                All Cakes
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setCurrentTab('home');
                  setTimeout(() => document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }} 
                className="text-brand-on-surface-variant hover:text-brand-primary text-sm hover:underline transition-all block text-left"
              >
                Wedding Cakes
              </button>
            </li>
            <li>
              <a href="#" className="text-brand-on-surface-variant hover:text-brand-primary text-sm hover:underline transition-all block text-left">
                Corporate Gifting
              </a>
            </li>
            <li>
              <a href="#" className="text-brand-on-surface-variant hover:text-brand-primary text-sm hover:underline transition-all block text-left">
                Last Minute Orders
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 font-sans font-medium">
            <li><a href="#" className="text-brand-on-surface-variant hover:text-brand-primary text-sm hover:underline transition-all block">Privacy Policy</a></li>
            <li><a href="#" className="text-brand-on-surface-variant hover:text-brand-primary text-sm hover:underline transition-all block">Shipping Info</a></li>
            <li><a href="#" className="text-brand-on-surface-variant hover:text-brand-primary text-sm hover:underline transition-all block">Wholesale Inquiry</a></li>
            <li><a href="#" className="text-brand-on-surface-variant hover:text-brand-primary text-sm hover:underline transition-all block">Contact Us</a></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider">Lounge Boutique</h4>
          <p className="text-brand-on-surface-variant text-sm font-medium leading-relaxed">
            No. 188, Nawala Road<br />
            Nawala 10120<br />
            Sri Lanka
          </p>
          <div className="text-xs text-brand-on-surface-variant space-y-1">
            <p><span className="font-bold text-brand-primary">Hotline:</span> +94 77 722 5335</p>
            <p><span className="font-bold text-brand-primary">Support:</span> sales@cakelounge.lk</p>
          </div>
          <div className="pt-2 text-xs text-brand-on-surface-variant bg-white/40 p-3 rounded-lg border border-brand-outline-variant/20 inline-block">
            <span className="font-bold text-brand-primary uppercase tracking-wide block mb-1">Hours</span>
            Mon - Sat: 08:30 - 19:30<br />
            Sun: 09:00 - 18:00
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 md:px-[64px] py-6 border-t border-brand-outline-variant/20 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center text-brand-on-surface-variant text-xs font-semibold tracking-wider gap-4">
        <div>
          &copy; 2026 The Cake Lounge. Handcrafted in Nawala, Colombo, Sri Lanka.
          <button 
            onClick={() => setCurrentTab('admin')}
            className="ml-2 opacity-40 hover:opacity-100 hover:text-brand-primary hover:underline transition-all cursor-pointer font-medium"
            title="Baker Backoffice"
          >
            • Staff Portal
          </button>
        </div>
        <div className="flex gap-4 items-center opacity-75">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            Secure checkout ssl
          </span>
          <span className="flex items-center gap-1">
            <CreditCard className="w-4 h-4 text-brand-primary" />
            PCI DSS certified
          </span>
        </div>
      </div>
    </footer>
  );
}
