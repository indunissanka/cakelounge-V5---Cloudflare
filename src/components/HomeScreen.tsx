import React, { useState } from 'react';
import { ArrowRight, Sparkles, Star, ShieldCheck, Gift, Clock, Utensils } from 'lucide-react';
import { CakeProduct } from '../types';

interface HomeScreenProps {
  products: CakeProduct[];
  onSelectCake: (id: string) => void;
  setCurrentTab: (tab: 'home' | 'product-detail' | 'checkout' | 'admin') => void;
}

export default function HomeScreen({ products, onSelectCake, setCurrentTab }: HomeScreenProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  const handleProductClick = (id: string) => {
    onSelectCake(id);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Divide products into categories dynamically
  const bakersChoice = products.filter(p => p.category === 'Cakes');
  const collectionsList = products.filter(p => p.category !== 'Cakes');

  return (
    <div className="w-full space-y-20 pb-12 animate-fadeIn">
      
      {/* 1. HERO SECTION */}
      <section id="hero-section" className="w-full px-5 md:px-[64px] pt-6 max-w-[1280px] mx-auto">
        <div className="relative rounded-3xl overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center shadow-[0_12px_40px_rgba(80,22,68,0.12)]">
          {/* Hero background image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz-23w0J_66tl8VykQO9bRjgaQZbv5DEdcQQ6FQXy9JshsIu4JDNi0esbyszhxxaNyB8ovoo8jNLjxv3dyz9034J8JT6KXkzs1MUCPJBpad3MLdnyhs6VEp-IGgRTnmk6-lCOsK_eqr0_GofTCEUHrWmQJQq7MkpQjR21gnPHS8u_R1Y6cpxI-YAp-wFf43dq7-Mztl7W_mfBa3zwUX_m99ytTDARzAU4TECfU_GN900laB1Wxn2aM4Fbxi9QnRjdlqZv1_L03N_o" 
              referrerPolicy="no-referrer"
              alt="Artisanal chocolate truffle background"
              className="w-full h-full object-cover brightness-[0.45] transform scale-110 motion-safe:animate-subtleZoom"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl px-6 md:px-16 space-y-6 text-white py-12">
            <div className="inline-flex items-center gap-2 bg-brand-primary-container/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-brand-primary-fixed text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              Exquisite Marylebone Boutique
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight">
              Culinary Art, <br />
              <span className="text-[#ffd7ef]">Built to Be Eaten.</span>
            </h1>
            
            <p className="text-white/80 font-sans font-medium text-sm sm:text-base leading-relaxed max-w-lg">
              Explore bespoke, hand-finished cake compositions crafted with single-origin Valrhona dark chocolates, organic seasonal lavender, and pure regional botanicals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  document.getElementById('bakers-choice-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center justify-center gap-2 bg-brand-primary text-white py-3.5 px-8 rounded-full font-bold text-sm tracking-wider hover:brightness-115 active:scale-95 transition-all shadow-md cursor-pointer"
                id="hero-primary-btn"
              >
                Explore Cakes
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <button
                onClick={() => {
                  document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center bg-white/10 hover:bg-white/25 active:scale-95 border border-white/30 text-white backdrop-blur-md py-3.5 px-8 rounded-full font-bold text-sm tracking-wider transition-all cursor-pointer"
              >
                The Collections
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE COLLECTIONS BENTO GRID */}
      <section id="collections-section" className="w-full px-5 md:px-[64px] max-w-[1280px] mx-auto space-y-8 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <p className="text-brand-primary text-xs font-bold tracking-widest uppercase">Bespoke Curation</p>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-on-surface font-semibold">The Collections</h2>
          <p className="text-brand-on-surface-variant text-sm font-medium leading-relaxed">
            Beautifully designed structures tailored for intimate gatherings, royal celebrations, and sensory-focused gifts.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card 1: The Wedding Edit (Big card, 2cols layout on desktop) */}
          <div className="md:col-span-2 group relative h-[400px] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrMpF8s7Ffh2BH2NwsjhsjKRP6ExDzIy3W5nnbBDc4CFYmsNb5RflMZFifVKRY20sfuo1S5oz3nPr7yNE9oOlDSECjhGTLz5U9kghA-cSOLGqBKjp17-_llX9hCkKVDXmeWH3ywJ68wSW3-CAsm-PrPkN4ZGMX1l8t2eHddR8MEKOQ5-2ZXjTPmoUEZLT900AvJo1SD8NO4-ellhGGX3WglfX-iL8sES2cmQi6pN_5WS7AN7-fLKeh-leUJxtOrrMTPFaOrK7AJMU" 
              referrerPolicy="no-referrer"
              alt="The Wedding Edit Lavender cake"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/30 to-transparent z-10" />
            
            <div className="absolute bottom-0 left-0 p-8 z-20 text-white space-y-2">
              <span className="bg-brand-primary-fixed/30 border border-white/20 text-pink-100 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                Exquisite Composition
              </span>
              <h3 className="font-serif text-2xl font-semibold mt-1">The Wedding Edit</h3>
              <p className="text-white/80 text-xs font-medium max-w-sm leading-relaxed">
                Adorned with handpicked lavender buds and organic seasonal floral sprays.
              </p>
              <button 
                onClick={() => handleProductClick('wedding-edit')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#ffd7ef] group-hover:underline pt-2 cursor-pointer"
              >
                Inquire & Bespoke Size <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Cupcakes / Celebration (Standard Card) */}
          <div className="group relative h-[400px] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfw8S0xfJu5DS6DWVU4Q_IDs-mxU6bli9ETS_7xPkAJxPwb4BEQxu4o119NjeStD8U5iBmiU8CLYBM8KOkvQyhyjcTsWHLXtwOSe5Kcq2XZ1BmYoIGoPp4R6p2YJPVUZSVU-F2S4KRfkpsxNnGbKjZxxDugSP92aUZRXhOuqq9o9GWUIVHRi0CPPuIQ_92lAq1J-3ZzwPeYTP6db5_yZT2xTwfExjBmaenX8eamasFHxa_LT74mqLh-GHIMMZSPxfyf89sAuYPiHA" 
              referrerPolicy="no-referrer"
              alt="Celebration Cupcakes"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/20 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-6 z-20 text-white space-y-1.5">
              <h3 className="font-serif text-xl font-semibold">Celebration Series</h3>
              <p className="text-white/80 text-xs font-medium leading-relaxed">
                Hand-whipped buttercream structures.
              </p>
              <button 
                onClick={() => handleProductClick('celebration-series')}
                className="flex items-center gap-1 text-xs font-bold text-[#ffd7ef] group-hover:underline pt-1 cursor-pointer"
              >
                View Details <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Gifting and Boxes (Standard Card) */}
          <div className="group relative h-[400px] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH3ZRdc259uWQALJGKQUGgN9CfarVjFp4_K9TTeUkkiEEvaLz8D2AH7vLjtHxmNqklPF6hA8xcUxiIhruRRF7j482hL9sfeGF80jad5zuwQIjRjth8TbqvMR35eEnqlApBvysh3FWbhoU-voveg6M2PlkFdE5vhXLj4zN-Apz7lr28CqmsSCuzD_-NDH0dtRz1Wfs5mLNPhmtM8xe35ijR_Ij7L5ZA50VhfHxq8qsDzYuUg2-d4LshA2mSjA57vRURA7ZCCEDqgNY" 
              referrerPolicy="no-referrer"
              alt="Luxury Gift Boxes"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/20 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-6 z-20 text-white space-y-1.5">
              <h3 className="font-serif text-xl font-semibold">Luxury Gifting</h3>
              <p className="text-white/80 text-xs font-medium leading-relaxed">
                Lined in fine silk and velvet ribbons.
              </p>
              <button 
                onClick={() => handleProductClick('gifting')}
                className="flex items-center gap-1 text-xs font-bold text-[#ffd7ef] group-hover:underline pt-1 cursor-pointer"
              >
                Send Gift Box <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. BAKER'S CHOICE (The Core 4 menu) */}
      <section id="bakers-choice-section" className="w-full py-12 bg-brand-surface-low border-y border-brand-outline-variant/10 scroll-mt-24">
        <div className="w-full px-5 md:px-[64px] max-w-[1280px] mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-brand-primary text-xs font-bold tracking-widest uppercase">The Menu</p>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-on-surface font-semibold">Baker’s Choice Collection</h2>
            </div>
            <p className="text-brand-on-surface-variant text-sm font-medium leading-relaxed max-w-md">
              Freshly baked every morning in our boutique starting at 05:00 AM. Click to customize sizes, dietary preferences, or message notes.
            </p>
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bakersChoice.map((cake) => (
              <div 
                key={cake.id}
                onClick={() => handleProductClick(cake.id)}
                className="group bg-white rounded-2xl overflow-hidden border border-brand-outline-variant/10 hover:border-brand-primary/20 transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col h-full"
              >
                {/* Product image container */}
                <div className="relative aspect-square overflow-hidden bg-brand-surface-low">
                  <img 
                    src={cake.image} 
                    referrerPolicy="no-referrer"
                    alt={cake.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Category tag */}
                  {cake.tag && (
                    <span className={`absolute top-4 left-4 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm text-white ${
                      cake.tagType === 'top-seller' ? 'bg-brand-primary-container' :
                      cake.tagType === 'bakers-pick' ? 'bg-brand-primary' :
                      'bg-brand-secondary'
                    }`}>
                      {cake.tag}
                    </span>
                  )}
                  
                  {/* Subtle look-closer prompt */}
                  <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 backdrop-blur-sm text-brand-primary font-bold text-xs px-4 py-2 rounded-full tracking-wider shadow-sm transition-transform scale-90 group-hover:scale-100">
                      Configure Masterpiece
                    </span>
                  </div>
                </div>

                {/* Product Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg font-semibold text-brand-on-surface group-hover:text-brand-primary transition-colors">
                      {cake.name}
                    </h3>
                    <p className="text-brand-on-surface-variant text-xs line-clamp-2 md:line-clamp-3 font-medium leading-relaxed">
                      {cake.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-brand-surface-low">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                      Starting size
                    </span>
                    <span className="font-serif font-bold text-brand-primary text-base">
                      £{cake.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. THE ARTISAN PROCESS SECTION (Hands of master chef) */}
      <section className="w-full px-5 md:px-[64px] max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#fdfaf8] rounded-2xl p-6 md:p-12 border border-brand-outline-variant/15">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-brand-primary text-xs font-bold tracking-widest uppercase block">Artisan Commitment</span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-on-surface font-semibold leading-tight">
              Honoring Time & Raw Material
            </h2>
            <p className="text-brand-on-surface-variant text-sm font-medium leading-relaxed">
              We reject rapid stabilizers, artificial emulsifiers, and instant gelatins. In their place, we deploy double-fermented cocoa acids, raw organic honey blocks, and slow cold emulsions.
            </p>
            <p className="font-serif italic text-brand-primary text-sm leading-relaxed border-l-2 border-brand-primary/40 pl-4">
              "Craftsmanship is not simply a throughput metric, but the dedication of hours spent perfecting a single, fleeting texture."
            </p>
            
            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div className="bg-white p-3 rounded-xl shadow-[0_2px_10px_rgba(107,45,92,0.03)] border border-brand-outline-variant/5">
                <Clock className="w-5 h-5 text-brand-primary mx-auto mb-1.5" />
                <span className="block font-serif font-bold text-base text-brand-primary">16h</span>
                <span className="text-[9px] font-bold text-brand-on-surface-variant uppercase tracking-wider">Slow Ferment</span>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-[0_2px_10px_rgba(107,45,92,0.03)] border border-brand-outline-variant/5">
                <Utensils className="w-5 h-5 text-brand-primary mx-auto mb-1.5" />
                <span className="block font-serif font-bold text-base text-brand-primary">100%</span>
                <span className="text-[9px] font-bold text-brand-on-surface-variant uppercase tracking-wider">Valrhona Cocoa</span>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-[0_2px_10px_rgba(107,45,92,0.03)] border border-brand-outline-variant/5">
                <Gift className="w-5 h-5 text-brand-primary mx-auto mb-1.5" />
                <span className="block font-serif font-bold text-base text-brand-primary">Bespoke</span>
                <span className="text-[9px] font-bold text-brand-on-surface-variant uppercase tracking-wider">Hand-finished</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-sm relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQzaIcjWDt3TVOCDLrzcZj4ITTgobRwyFpG3l2tu_mVeZnYeSOBs2jTGy5Pxd7gFS54CPPkWglo3lw_ByTejLD7C0G-ZSJVP470xO9nPT6tAQ4KzcxudsDWhzDwtaFSJIQ9AKpqU2XXH4pA5cGorzxm48Sz3QW4hVSV8uNCORp2wEgzjL4ChuCgtpRNXHXc_ncN1a1mOFS_NKKYO2DYuLcO5qN_gnCGTXmQ4IfUgCrWKQc6zWSk7H8T_cHf0wk2I0OukoU6yH36ns" 
              referrerPolicy="no-referrer"
              alt="Hands of master chef detailing cake structure"
              className="w-full h-full object-cover"
            />
            {/* Elegant transparent overlay with subtitle */}
            <div className="absolute bottom-4 right-4 bg-brand-on-surface/90 text-white font-mono text-[10px] tracking-widest uppercase p-3 rounded-lg border border-white/10 backdrop-blur-sm">
              Marylebone Baking Lab • Batch Assembly
            </div>
          </div>

        </div>
      </section>

      {/* 5. GUEST TESTIMONIALS */}
      <section className="w-full px-5 md:px-[64px] max-w-[1280px] mx-auto text-center space-y-10">
        <div className="space-y-2">
          <p className="text-brand-primary text-xs font-bold tracking-widest uppercase">The Experience</p>
          <h2 className="font-serif text-3xl text-brand-on-surface font-semibold">Voices from Marylebone</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-brand-outline-variant/10 text-left space-y-4 shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />)}
            </div>
            <p className="text-brand-on-surface-variant text-xs font-medium leading-relaxed">
              "The Midnight Truffle redefined dark chocolate for me. Not clawing but deeply fragrant. We ordered the 10" edition, and our Marylebone guests were fully mesmerized."
            </p>
            <div>
              <span className="block font-serif font-bold text-xs text-brand-primary">Charlotte Auden</span>
              <span className="text-[10px] text-brand-secondary font-sans font-semibold tracking-wider uppercase">Marylebone</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-outline-variant/10 text-left space-y-4 shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />)}
            </div>
            <p className="text-brand-on-surface-variant text-xs font-medium leading-relaxed">
              "Lemon Elderflower is incredibly whimsical. Every forkful has the true lavender herbal touch. The buttercream is so light, it practically dissolves with the elderflower."
            </p>
            <div>
              <span className="block font-serif font-bold text-xs text-brand-primary">Dr. Alistair Sterling</span>
              <span className="text-[10px] text-brand-secondary font-sans font-semibold tracking-wider uppercase">Belgravia</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-outline-variant/10 text-left space-y-4 shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />)}
            </div>
            <p className="text-brand-on-surface-variant text-xs font-medium leading-relaxed">
              "The custom buttercream notes are pristine. Not only is it delicious food, but it is also sculptural centerpiece art. The delivery was exactly on schedule, securing peace of mind."
            </p>
            <div>
              <span className="block font-serif font-bold text-xs text-brand-primary">Victoria Hamilton</span>
              <span className="text-[10px] text-brand-secondary font-sans font-semibold tracking-wider uppercase">Kensington</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER & OFFERS */}
      <section className="w-full px-5 md:px-[64px] max-w-[1280px] mx-auto">
        <div className="bg-brand-primary text-white rounded-3xl p-8 md:p-16 text-center space-y-6 relative overflow-hidden shadow-[0_10px_35px_rgba(80,22,68,0.15)]">
          {/* Subtle geometric circles */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-primary-container opacity-20 translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-primary-container opacity-25 -translate-x-1/4 translate-y-1/4 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Join The Baker’s Journal</h2>
            <p className="text-white/85 text-xs font-medium leading-relaxed px-4">
              Receive direct releases of seasonal botanical designs, holiday gift collections, and invitations to our Marylebone tasting masterclasses.
            </p>

            {subscribed ? (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 animate-scaleIn flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-primary-fixed" />
                <span className="text-xs font-bold font-sans tracking-wide">
                  Welcome to the Journal. Please verify your email invitation.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-2 pt-2">
                <input
                  type="email"
                  required
                  placeholder="Insert your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border border-white/30 rounded-full px-5 py-3 text-xs w-full text-white placeholder-white/60 focus:bg-white focus:text-brand-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary-fixed tracking-wide"
                />
                <button
                  type="submit"
                  className="bg-brand-primary-fixed text-brand-on-primary-fixed hover:bg-white transition-all duration-300 font-bold text-xs tracking-wider uppercase px-8 py-3 rounded-full cursor-pointer focus:outline-none flex-shrink-0 active:scale-95"
                >
                  Join
                </button>
              </form>
            )}
            <span className="block text-[10px] text-white/60 font-medium">We respect your space. Unsubscribe anytime.</span>
          </div>
        </div>
      </section>

    </div>
  );
}
