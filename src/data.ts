import { CakeProduct, Order, ScheduleItem } from './types';

export const PRODUCTS: CakeProduct[] = [
  {
    id: 'double-chocolate-fudge',
    name: 'Double Chocolate Fudge Cake',
    description: 'An indulgent masterpiece crafted with layers of moist gourmet chocolate sponge and rich, dark cocoa fudge.',
    price: 4900.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_2ondic-O8c5xmQ9pdojRlh_WCE8DxsXH4e2vba2LqfzI45xIO0aBQqQP0W_bHra6M8Y6tIRXQG2D9ixtFW-DpqAionEB9CM1PdHd9-5ooC0oDXjA2IWXU2LZhijweGD0vJsrccVjnYK6s1_CGIRKGMLZsJEeI9Bs70umRcyylzUetvWSxs1Akaq0eQY6ZujjlTF6VL_fxK2beKEYDxiEoiUxwc5fvliI1Pq4tRbOlY9XSkgrX9T1juA-QHp3Gy40aSTABU2ELpw',
    alt: 'Double Chocolate Fudge Cake',
    category: 'Cakes',
    tag: 'Top Seller',
    tagType: 'top-seller',
    servings: '1.2 kg (8-10 Servings)',
    allergens: ['Dairy', 'Wheat', 'Eggs', 'Soy'],
    longDescription: 'Our signature Double Chocolate Fudge Cake is the top crowd-pleaser across Sri Lanka. We begin with three layers of ultra-moist chocolate sponge, infused with a touch of premium local cocoa profiles.\n\nBetween these layers lies a silk-smooth ganache made from high-grade dark chocolate and rich cream. Decor is finished with elegant hand-piped chocolate rosettes and chocolate sprinkles.',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_2ondic-O8c5xmQ9pdojRlh_WCE8DxsXH4e2vba2LqfzI45xIO0aBQqQP0W_bHra6M8Y6tIRXQG2D9ixtFW-DpqAionEB9CM1PdHd9-5ooC0oDXjA2IWXU2LZhijweGD0vJsrccVjnYK6s1_CGIRKGMLZsJEeI9Bs70umRcyylzUetvWSxs1Akaq0eQY6ZujjlTF6VL_fxK2beKEYDxiEoiUxwc5fvliI1Pq4tRbOlY9XSkgrX9T1juA-QHp3Gy40aSTABU2ELpw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCgZvbNTi-eDkGqz5uODPG_XOE_pI1FuuquD9txwHLPnVCDiyM7AsdZ2FROSX7PPUS_UoWBd3uJ9aJnhW2ha0oLlTKT-J-xZDkse6oRP27y7178wQc1WIapcyvl6GHyDH9-5s1ktQyBu48xhg_0upLaQfzMQag2DlH8-rUWG2tl9a56uU-hEAcgHOmLbXJOn_O2TRkpqVOgeoJBgaSJ-8Y7qtFcW0MeCHNUZo7dqV2c2B166VZTccZPtizawm_IfzBLM4ufrNpN13I'
    ]
  },
  {
    id: 'classic-ribbon',
    name: 'Classic Ribbon Cake',
    description: 'The beloved traditional butter cake of Sri Lanka, meticulously layered with soft ribbon icing.',
    price: 3950.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xg23JS1m4efL9471QbGoCMXQ8bREBf4rmiEUsiiZ1DtA43Izo8whF4OBWlboGEe0Aa3nnYVteJ1aCUP2zV93ExluaKODbXHiKA8BhHAmdoUj2vY0_5o0KZ8wbdna2iNNELxvWFBr-TtUjk6Ukonssn9vTtAXuDLIn4nkCgVdSc1eDXVO1DgztvyqYOmBpw3u37mCTHGXsIPPaDEXOedqHrdX9SRPk5gmo21sPXS7YJukfAPHw1Wp_-UpKUB8jY99nr8F4-dV4bU',
    alt: 'Classic Ribbon Cake',
    category: 'Cakes',
    tag: 'Popular',
    tagType: 'bakers-pick',
    servings: '1 kg (6-8 Servings)',
    allergens: ['Dairy', 'Wheat', 'Eggs'],
    longDescription: 'No Sri Lankan birthday or celebratory teatime table is complete without a Ribbon Cake. Enjoy moist, velvety-soft almond butter cake layers of pastel green, yellow, and baby pink. Covered and trimmed with smooth vanilla buttercream.',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xg23JS1m4efL9471QbGoCMXQ8bREBf4rmiEUsiiZ1DtA43Izo8whF4OBWlboGEe0Aa3nnYVteJ1aCUP2zV93ExluaKODbXHiKA8BhHAmdoUj2vY0_5o0KZ8wbdna2iNNELxvWFBr-TtUjk6Ukonssn9vTtAXuDLIn4nkCgVdSc1eDXVO1DgztvyqYOmBpw3u37mCTHGXsIPPaDEXOedqHrdX9SRPk5gmo21sPXS7YJukfAPHw1Wp_-UpKUB8jY99nr8F4-dV4bU'
    ]
  },
  {
    id: 'belgium-chocolate-gateau',
    name: 'Belgium Chocolate Cream Gateau',
    description: 'Bespoke, feather-light chocolate sponge layered with smooth premium chocolate creme and dense curls.',
    price: 4800.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUGLnBgoml0dPda9a2yNWLNgKZoAPA7cFGsKFfS-LAFNeix4penlRCsck0SaTZHDE0SRjoHB-Eo-f3Dn2eksi0ApbjJbUnVJ0nMgjWy2aa2bEypmbqkLpLYXPBqiwhozhsXpNEMbtXVUBgFrtTFghbktnZwag45KM1EXrtAPNIZZSIstP1yhGyFVy3TfGAH-3yzcwB8GH0308_jreOkC3zwv9mbRHXdb43SFr-2y0-GKQQg1WGz9c_c-UUlKXdaUoG8Bylhxo4x5k',
    alt: 'Belgium Chocolate Cream Gateau',
    category: 'Cakes',
    tag: 'Classic',
    tagType: 'gluten-free',
    servings: '1.2 kg (8-10 Servings)',
    allergens: ['Dairy', 'Eggs', 'Wheat', 'Soy'],
    longDescription: 'Indulge in a premium gateau showcasing authentic imported Belgian chocolate whip. Alternating ribbons of dark and milk chocolate cream make each forkful smooth and highly delectable.',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUGLnBgoml0dPda9a2yNWLNgKZoAPA7cFGsKFfS-LAFNeix4penlRCsck0SaTZHDE0SRjoHB-Eo-f3Dn2eksi0ApbjJbUnVJ0nMgjWy2aa2bEypmbqkLpLYXPBqiwhozhsXpNEMbtXVUBgFrtTFghbktnZwag45KM1EXrtAPNIZZSIstP1yhGyFVy3TfGAH-3yzcwB8GH0308_jreOkC3zwv9mbRHXdb43SFr-2y0-GKQQg1WGz9c_c-UUlKXdaUoG8Bylhxo4x5k'
    ]
  },
  {
    id: 'blueberry-baked-cheesecake',
    name: 'Blueberry Baked Cheesecake',
    description: 'Creamy New York-style baked cheesecake sitting on a butter-biscuit base, loaded with lush blueberry compote.',
    price: 6400.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDu-sOFC_clNfl-o1-CIa8fAywrOmZPVjVFqT-1sioO3S2PZFCRtQQubLZWfb5UlCU9g7e-YHLopLWGqBAD6xq9qvn7Qr2HLB18reSKJy-F5eetLCs1RkFB-dSVDu6D4Q1V8s3MY2aWeFj2MGsrEVJAjWqKQdyzTDx4JyfnjbjW6OFQkXBBaA8xdsW7ZiyvroVCfMZ8Z4tWvC-TrAqMhUDttpiiHajfwtv_17Kf7_C1HLp86q7G1-RhoZlLVwZ0Og49W2sJnxDLvV0',
    alt: 'Blueberry Baked Cheesecake',
    category: 'Cakes',
    tag: "Baker's Pick",
    tagType: 'bakers-pick',
    servings: '1 kg (8-10 Servings)',
    allergens: ['Dairy', 'Wheat', 'Eggs'],
    longDescription: 'Baked slow to preserve velvety, high-density cream integrity. Glazed generously with whole-berry wild blueberries, rendering a perfect balance of vanilla luxury and sweet tang.',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDu-sOFC_clNfl-o1-CIa8fAywrOmZPVjVFqT-1sioO3S2PZFCRtQQubLZWfb5UlCU9g7e-YHLopLWGqBAD6xq9qvn7Qr2HLB18reSKJy-F5eetLCs1RkFB-dSVDu6D4Q1V8s3MY2aWeFj2MGsrEVJAjWqKQdyzTDx4JyfnjbjW6OFQkXBBaA8xdsW7ZiyvroVCfMZ8Z4tWvC-TrAqMhUDttpiiHajfwtv_17Kf7_C1HLp86q7G1-RhoZlLVwZ0Og49W2sJnxDLvV0'
    ]
  },
  {
    id: 'red-velvet-lounge',
    name: 'Red Velvet Lounge Gateau',
    description: 'Crimson cocoa sponges frosted with authentic vanilla cream cheese and dusted with crimson crumbs.',
    price: 5200.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrMpF8s7Ffh2BH2NwsjhsjKRP6ExDzIy3W5nnbBDc4CFYmsNb5RflMZFifVKRY20sfuo1S5oz3nPr7yNE9oOlDSECjhGTLz5U9kghA-cSOLGqBKjp17-_llX9hCkKVDXmeWH3ywJ68wSW3-CAsm-PrPkN4ZGMX1l8t2eHddR8MEKOQ5-2ZXjTPmoUEZLT900AvJo1SD8NO4-ellhGGX3WglfX-iL8sES2cmQi6pN_5WS7AN7-fLKeh-leUJxtOrrMTPFaOrK7AJMU',
    alt: 'Red Velvet Lounge Gateau',
    category: 'Collections',
    tag: 'Premium',
    servings: '1.2 kg (8-10 Servings)',
    allergens: ['Dairy', 'Wheat', 'Eggs'],
    longDescription: 'Elegantly balanced, moist cocoa cake layers exhibiting deep crimson hues. Interlayered with premium light whipped cream cheese, this cake is ideal for birthdays and personal events.',
  },
  {
    id: 'rainbow-celebration',
    name: 'Gourmet Rainbow Celebration',
    description: 'Six distinct, handbaked pastel-colored layers filled and wrapped in our smooth house vanilla buttercream.',
    price: 6100.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfw8S0xfJu5DS6DWVU4Q_IDs-mxU6bli9ETS_7xPkAJxPwb4BEQxu4o119NjeStD8U5iBmiU8CLYBM8KOkvQyhyjcTsWHLXtwOSe5Kcq2XZ1BmYoIGoPp4R6p2YJPVUZSVU-F2S4KRfkpsxNnGbKjZxxDugSP92aUZRXhOuqq9o9GWUIVHRi0CPPuIQ_92lAq1J-3ZzwPeYTP6db5_yZT2xTwfExjBmaenX8eamasFHxa_LT74mqLh-GHIMMZSPxfyf89sAuYPiHA',
    alt: 'Gourmet Rainbow Cake',
    category: 'Collections',
    tag: 'Bestseller',
    servings: '1.5 kg (10-12 Servings)',
    allergens: ['Dairy', 'Wheat', 'Eggs'],
    longDescription: 'A showstopping six-tiered spectrum of soft vanilla cake. Every layer represents one of the signature colors, separated by thin, elegant bands of sweet butter frosting.',
  },
  {
    id: 'macaron-tasting-box',
    name: 'Artisan Macaron Gift Box',
    description: 'Selection of 12 delicate French macarons filled with raspberry, chocolate, and vanilla bean cream.',
    price: 2900.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH3ZRdc259uWQALJGKQUGgN9CfarVjFp4_K9TTeUkkiEEvaLz8D2AH7vLjtHxmNqklPF6hA8xcUxiIhruRRF7j482hL9sfeGF80jad5zuwQIjRjth8TbqvMR35eEnqlApBvysh3FWbhoU-voveg6M2PlkFdE5vhXLj4zN-Apz7lr28CqmsSCuzD_-NDH0dtRz1Wfs5mLNPhmtM8xe35ijR_Ij7L5ZA50VhfHxq8qsDzYuUg2-d4LshA2mSjA57vRURA7ZCCEDqgNY',
    alt: 'Artisan Macaron Box',
    category: 'Gifts',
    tag: 'Exclusive',
    longDescription: 'Perfect macaron shell texture and moist double-fillings, packed inside a sleek clear case aligned with luxury satin ribbon styling.',
  },
  {
    id: 'cupcake-party-pack',
    name: 'Artisanal Cupcake Swirl Box',
    description: 'An delightful assortment of 6 cupcakes featuring classic chocolate and ribbon icing swirls.',
    price: 2400.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF1vWWMhoj_r7JzZdxYC7y6_uRvPHR-17cRs43b43YdENEhof_rXhPpsi_7P9l9ZniCe5JMpB4UDmo3SieyrOy5n1BVj7a7fm6-VKxqkTvwXtg-k4cjwzWonPOrhewwC9jHVEn0X1gge9wfdLkyShZ834X3MG3oHMzKKDuq0H6VnnBImT11v7-3KbbpO5L9riCNYY7-7ATeeyJ78FYpoobQTsiNEcn_A-TX96KKEHoAgFK7O57_mQEBg2kp_OiPI_1vEbfCPzjb4k',
    alt: 'Cupcake Swirl Box',
    category: 'Gifts',
    tag: 'Popular',
    longDescription: 'Handcrafted cupcakes featuring the finest local products and silky cake crumb textures, capped with colorful butter frosting rosettes.',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CK-8902',
    customerName: 'Suresh Perera',
    customerEmail: 'suresh.perera@gmail.lk',
    address: '45 Nawala Road',
    city: 'Colombo',
    postalCode: '10120',
    deliveryDate: '2026-06-12',
    items: [
      { productName: 'Double Chocolate Fudge Cake', size: '1.2 kg (8-10 Servings)', quantity: 1, price: 4900.00 }
    ],
    subtotal: 4900.00,
    delivery: 450.00,
    tax: 392.00,
    total: 5742.00,
    status: 'DELIVERED',
    date: '2026-06-08'
  },
  {
    id: 'CK-8903',
    customerName: 'Julian Casablancas',
    customerEmail: 'julian@thestrokes.com',
    address: '12 Parliament Road',
    city: 'Rajagiriya',
    postalCode: '10100',
    deliveryDate: '2026-06-11',
    items: [
      { productName: 'Classic Ribbon Cake', size: '1 kg (6-8 Servings)', quantity: 1, price: 3950.00 }
    ],
    subtotal: 3950.00,
    delivery: 450.00,
    tax: 316.00,
    total: 4716.00,
    status: 'BAKING',
    date: '2026-06-09'
  },
  {
    id: 'CK-8904',
    customerName: 'Clara Wickramasinghe',
    customerEmail: 'clara@cakelounge.lk',
    address: '88/4 Flower Road',
    city: 'Colombo',
    postalCode: '00700',
    deliveryDate: '2026-06-15',
    items: [
      { productName: 'Red Velvet Lounge Gateau', size: '1.2 kg (8-10 Servings)', quantity: 1, price: 5200.00 }
    ],
    subtotal: 5200.00,
    delivery: 450.00,
    tax: 416.00,
    total: 6066.00,
    status: 'PENDING',
    date: '2026-06-09'
  },
  {
    id: 'CK-8905',
    customerName: 'Miles Davis',
    customerEmail: 'miles@kindofblue.com',
    address: '10 Havelock Place',
    city: 'Colombo',
    postalCode: '00500',
    deliveryDate: '2026-06-10',
    items: [
      { productName: 'Belgium Chocolate Cream Gateau', size: '1.2 kg (8-10 Servings)', quantity: 1, price: 4800.00 }
    ],
    subtotal: 4800.00,
    delivery: 450.00,
    tax: 384.00,
    total: 5634.00,
    status: 'BAKING',
    date: '2026-06-09'
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sc-1',
    time: '08:00',
    period: 'AM',
    title: 'Sponge Base Preparation',
    description: 'Batch #42 - Velvet Lavender & Vanilla Bean',
    borderType: 'dim'
  },
  {
    id: 'sc-2',
    time: '10:30',
    period: 'AM',
    title: 'Ganache Infusion',
    description: 'Midnight Chocolate Dark Roast Series',
    borderType: 'tertiary'
  },
  {
    id: 'sc-3',
    time: '01:00',
    period: 'PM',
    title: 'Custom Tier Assembly',
    description: 'Wedding Order: Bow & Ribbon Design',
    borderType: 'primary'
  },
  {
    id: 'sc-4',
    time: '03:30',
    period: 'PM',
    title: 'Final Decorating',
    description: 'Seasonal Gold Leaf Applications',
    borderType: 'outline'
  },
  {
    id: 'sc-5',
    time: '05:00',
    period: 'PM',
    title: 'Quality Check & Packing',
    description: 'Morning Delivery Route Preparedness',
    borderType: 'outline'
  }
];
