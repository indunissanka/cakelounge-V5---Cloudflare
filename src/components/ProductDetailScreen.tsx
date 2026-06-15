import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Check, Minus, Plus, HelpCircle, 
  Sparkles, ChefHat, Heart, CalendarDays, ShieldCheck 
} from 'lucide-react';
import { CakeProduct, CartItem } from '../types';

interface ProductDetailScreenProps {
  products: CakeProduct[];
  productId: string;
  onBackToStore: () => void;
  onAddToBag: (item: CartItem) => void;
}

export default function ProductDetailScreen({ products, productId, onBackToStore, onAddToBag }: ProductDetailScreenProps) {
  // Find current product or default to first product
  const product = products.find(p => p.id === productId) || products[0];

  const [selectedSize, setSelectedSize] = useState('1.0 kg (6-8 Servings)');
  const [hasNote, setHasNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  
  // Interactive "Add to Bag" state machine
  const [addingState, setAddingState] = useState<'idle' | 'baking' | 'done'>('idle');
  const [bakingStep, setBakingStep] = useState(0);

  // Re-sync image when product changes
  useEffect(() => {
    setSelectedImage(product.image);
    setSelectedSize(
      product.id === 'macaron-tasting-box' 
        ? 'Standard Box of 12' 
        : product.id === 'cupcake-party-pack' 
        ? 'Box of 6' 
        : '1.0 kg (6-8 Servings)'
    );
    setQuantity(1);
    setHasNote(false);
    setNoteText('');
    setAddingState('idle');
  }, [product]);

  const sizeOptions = product.id === 'macaron-tasting-box' ? [
    { label: 'Standard Box of 12', markup: 0 },
    { label: 'Premium Box of 24', markup: 2600.00 }
  ] : product.id === 'cupcake-party-pack' ? [
    { label: 'Box of 6', markup: 0 },
    { label: 'Box of 12', markup: 1800.00 },
    { label: 'Box of 24', markup: 3400.00 }
  ] : [
    { label: `${product.kg1 ?? '1.0'} kg (${product.servings ?? '6-8 Servings'})`, markup: 0 },
    { label: `${product.kg2 ?? '1.5'} kg (${product.servings2 ?? '12-15 Servings'})`, markup: product.markup15kg ?? 1800.00 },
    { label: `${product.kg3 ?? '2.0'} kg (${product.servings3 ?? '20-25 Servings'})`, markup: product.markup20kg ?? 3600.00 }
  ];

  // Calculate dynamic price based on chosen size
  const selectedSizeOption = sizeOptions.find(o => o.label === selectedSize) || sizeOptions[0];
  const itemPrice = product.price + selectedSizeOption.markup;
  const totalPrice = itemPrice * quantity;

  // Custom baking loaders to match the premium cafe vibe
  const bakingStepsText = [
    'Measuring organic flour...',
    'Infusing Elderflower Cordial...',
    'Folding single-origin Swiss ganache...',
    'Detailing gold-leaf applications...'
  ];

  const handleBeginAddToBag = () => {
    if (addingState !== 'idle') return;
    
    setAddingState('baking');
    setBakingStep(0);

    const interval = setInterval(() => {
      setBakingStep((prev) => {
        if (prev >= bakingStepsText.length - 1) {
          clearInterval(interval);
          setAddingState('done');
          
          // Actually dispatch item back to main layout state
          onAddToBag({
            product: { ...product, price: itemPrice }, // save final customized price
            selectedSize,
            enhancements: {
              handwrittenNote: hasNote,
              noteText: hasNote ? noteText : ''
            },
            quantity
          });

          // Reset feedback back to idle after a brief latency
          setTimeout(() => {
            setAddingState('idle');
          }, 3000);

          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  // Gallery layout pictures (fallback to preset pictures or main image if not present)
  let gallery = product.galleryImages || [product.image];
  if (gallery.length === 1 && product.id === 'midnight-chocolate-truffle') {
    gallery = [
      product.image,
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCgZvbNTi-eDkGqz5uODPG_XOE_pI1FuuquD9txwHLPnVCDiyM7AsdZ2FROSX7PPUS_UoWBd3uJ9aJnhW2ha0oLlTKT-J-xZDkse6oRP27y7178wQc1WIapcyvl6GHyDH9-5s1ktQyBu48xhg_0upLaQfzMQag2DlH8-rUWG2tl9a56uU-hEAcgHOmLbXJOn_O2TRkpqVOgeoJBgaSJ-8Y7qtFcW0MeCHNUZo7dqV2c2B166VZTccZPtizawm_IfzBLM4ufrNpN13I',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDn199ndCmVkeOEB8SYHjzmH4BIRJMQmBdwAfjLIqMG8FAUQ1U_swB20-iafumVOLZXLTHPB7g3A61BYGM4FnSvwaPg4RpQq4OY9ToWya1FCVgAucGBuoyaLkf0715Mjqe8ze34y8Gguz7bITeMpt0LBx0Pdq-x-Jf6TOqXWL-3FdOK2s8ML1_MoND1R3kxxKKIM1uLIHutQVFicagydm22RMiLqxukOwDZG41A2xpV4gBcR_fxALcwi2i77LhxQWAk7We2KQew4aY'
    ];
  }

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems = [
    {
      q: "Can I adjust my delivery date after placing an order?",
      a: "Yes. As long as you submit an edit request via our Nawala boutique workspace at least 48 hours prior to your scheduled slot, our kitchen team will shift the baking cycle without any extra penalty."
    },
    {
      q: "Do you offer gluten-free or completely vegan alternatives?",
      a: "Our Midnight Caramel is custom-engineered to be naturally gluten-free using ground almond and organic coconut powders. While we operate an integrated workspace where we carefully handle flour, allergen safety is strictly maintained. Contact our kitchen for bespoke dietary requests."
    },
    {
      q: "How should I store my cake after receiving delivery?",
      a: "Keep your cake in its fine presentation box in a standard domestic refrigerator. For the ultimate sensory experience, pull the cake box out into standard ambient room temperature 45 minutes to an hour prior to cutting."
    }
  ];

  return (
    <div className="w-full px-5 md:px-[64px] max-w-[1280px] mx-auto py-8 animate-fadeIn space-y-12">
      
      {/* Back Button and Quick Info Ribbon */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-brand-outline-variant/15">
        <button 
          onClick={onBackToStore}
          className="group flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary-container transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Lounge Storefront
        </button>
        <div className="flex gap-4 font-mono text-[10px] text-brand-on-surface-variant font-semibold uppercase tracking-wider">
          <span> Nawala Kitchen Lab </span>
          <span>•</span>
          <span className="text-brand-primary font-bold"> Status: Fresh Batch </span>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* Gallery Bento Layout (Left Side - 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-brand-surface-low shadow-sm border border-brand-outline-variant/10">
            <img 
              src={selectedImage} 
              referrerPolicy="no-referrer"
              alt={product.alt} 
              className="w-full h-full object-cover transition-all"
            />
          </div>

          {/* Mini thumbnails if there's multiple images */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all relative group ${
                    selectedImage === img ? 'border-brand-primary shadow-sm' : 'border-transparent hover:border-brand-primary/45'
                  }`}
                >
                  <img src={img} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="Detail thumbnail" />
                  <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Description Block */}
          <div className="p-6 bg-white rounded-2xl border border-brand-outline-variant/10 space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-semibold text-brand-primary">The Artisan's Notes</h3>
            <p className="text-brand-on-surface-variant text-xs md:text-sm leading-relaxed font-medium whitespace-pre-line">
              {product.longDescription || product.description}
            </p>
            
            {product.allergens && (
              <div className="pt-4 border-t border-brand-surface-low space-y-2">
                <span className="block font-sans font-bold text-xs text-brand-on-surface/80">
                  Allergen Declaration & Kitchen Warnings:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map((alg) => (
                    <span key={alg} className="px-3 py-1 bg-brand-surface-container text-brand-on-surface-variant font-mono text-[9px] font-bold uppercase rounded-md tracking-wider">
                      {alg}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-[#fff0f6] text-[#b01e3e] font-sans text-[9px] font-bold rounded-md flex items-center gap-1">
                    <ChefHat className="w-3 h-3" />
                    Baked in Nawala Lounge Lab
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Configuration Panel (Right Side - 5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 h-fit">
          
          {/* Header Title with Price */}
          <div className="space-y-3">
            {product.tag && (
              <span className="inline-block bg-brand-primary-fixed/40 text-brand-on-primary-fixed text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                {product.tag}
              </span>
            )}
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-brand-on-surface leading-snug">
              {product.name}
            </h1>
            <div className="flex items-baseline justify-between">
              <p className="text-brand-on-surface-variant text-sm font-medium">Bespoke pricing</p>
              <p className="font-serif text-2xl font-bold text-brand-primary">
                Rs. {totalPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Configurator Box */}
          <div className="bg-white rounded-2xl border border-brand-outline-variant/15 p-6 space-y-6 shadow-sm">
            
            {/* Size Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-primary uppercase tracking-wider">
                Select Your Size Composition:
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {sizeOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setSelectedSize(option.label)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-sm text-left font-sans cursor-pointer transition-all ${
                      selectedSize === option.label
                        ? 'border-brand-primary bg-brand-surface-low/50 text-brand-primary shadow-sm font-semibold'
                        : 'border-brand-outline-variant/30 text-brand-on-surface-variant hover:border-brand-primary/40'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="font-mono text-xs text-brand-primary/80">
                      {option.markup === 0 ? 'Base Price' : `+ Rs. ${option.markup.toLocaleString()}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes Section */}
            <div className="space-y-4 pt-4 border-t border-brand-surface-low">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-wider block">
                    Handwritten Calligraphy
                  </label>
                  <p className="text-[10px] font-semibold text-brand-on-surface-variant">Piped with premium organic dark chocolate icing</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasNote(!hasNote)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                    hasNote ? 'bg-brand-primary' : 'bg-brand-outline-variant/40'
                  }`}
                  id="calligraphy-toggle"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                    hasNote ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {hasNote && (
                <div className="space-y-2 animate-fadeIn">
                  <textarea
                    maxLength={50}
                    placeholder="e.g. Happy 30th Birthday, Sarah!"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full text-xs font-sans text-brand-on-surface p-3 border border-brand-outline-variant/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary min-h-[70px] bg-brand-surface-low/30"
                    id="calligraphy-text"
                  />
                  <div className="flex justify-between items-center text-[10px] text-brand-on-surface-variant font-semibold">
                    <span>Hand-finished by chef decorator</span>
                    <span>{noteText.length}/50 characters</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Button */}
            <div className="pt-4 border-t border-brand-surface-low space-y-4">
              <div className="flex justify-between items-center bg-brand-surface-low/30 p-3 rounded-xl border border-brand-outline-variant/10">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-brand-outline-variant/20 flex items-center justify-center hover:bg-brand-primary-fixed/30 text-brand-primary transition-all active:scale-95 cursor-pointer"
                    id="qty-minus"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-serif font-bold text-brand-primary text-base w-6 text-center select-none" id="qty-count">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-brand-outline-variant/20 flex items-center justify-center hover:bg-brand-primary-fixed/30 text-brand-primary transition-all active:scale-95 cursor-pointer"
                    id="qty-plus"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to bag Action */}
              <button
                onClick={handleBeginAddToBag}
                disabled={addingState !== 'idle'}
                className={`w-full py-4 rounded-xl font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-md ${
                  addingState === 'idle'
                    ? 'bg-brand-primary text-white hover:brightness-110 active:scale-99 cursor-pointer'
                    : addingState === 'baking'
                    ? 'bg-brand-primary-container text-white cursor-wait relative overflow-hidden'
                    : 'bg-emerald-600 text-white animate-scaleIn'
                }`}
                id="add-to-bag-btn"
              >
                {addingState === 'idle' && (
                  <>
                    <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
                    Place in Shopping Bag • Rs. {totalPrice.toLocaleString()}
                  </>
                )}

                {addingState === 'baking' && (
                  <div className="flex flex-col items-center justify-center py-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{bakingStepsText[bakingStep]}</span>
                    </div>
                    {/* Tiny visual progress bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-[#ffd7ef] transition-all duration-500" style={{ width: `${((bakingStep + 1) / bakingStepsText.length) * 100}%` }} />
                  </div>
                )}

                {addingState === 'done' && (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    Bespoke Selection Added Successfully!
                  </>
                )}
              </button>
            </div>

            {/* Guarantees list */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-surface-low text-[9px] font-bold text-brand-on-surface-variant uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                SSL Secure Checkout
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-brand-primary" />
                Fresh Morning Baking
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Accordion FAQs Section */}
      <section className="pt-8 border-t border-brand-outline-variant/15 space-y-6">
        <div className="max-w-xl">
          <p className="text-brand-primary text-xs font-bold tracking-widest uppercase">Answers</p>
          <h2 className="font-serif text-2xl text-brand-on-surface font-semibold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3 max-w-3xl">
          {faqItems.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl border border-brand-outline-variant/10 overflow-hidden shadow-sm transition-all text-left"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 font-sans font-semibold text-brand-primary text-sm hover:bg-brand-surface-low/30 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4.5 h-4.5 text-brand-primary" />
                    {faq.q}
                  </span>
                  <span className="text-base text-brand-primary font-bold">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-brand-on-surface-variant leading-relaxed font-medium animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
