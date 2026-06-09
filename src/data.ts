import { CakeProduct, Order, ScheduleItem } from './types';

export const PRODUCTS: CakeProduct[] = [
  {
    id: 'midnight-chocolate-truffle',
    name: 'Midnight Chocolate Truffle',
    description: 'An indulgent masterpiece crafted with 70% Valrhona dark chocolate and a hint of Himalayan sea salt.',
    price: 84.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_2ondic-O8c5xmQ9pdojRlh_WCE8DxsXH4e2vba2LqfzI45xIO0aBQqQP0W_bHra6M8Y6tIRXQG2D9ixtFW-DpqAionEB9CM1PdHd9-5ooC0oDXjA2IWXU2LZhijweGD0vJsrccVjnYK6s1_CGIRKGMLZsJEeI9Bs70umRcyylzUetvWSxs1Akaq0eQY6ZujjlTF6VL_fxK2beKEYDxiEoiUxwc5fvliI1Pq4tRbOlY9XSkgrX9T1juA-QHp3Gy40aSTABU2ELpw',
    alt: 'Midnight Chocolate Truffle',
    category: 'Cakes',
    tag: 'Top Seller',
    tagType: 'top-seller',
    servings: '6-8 Servings',
    allergens: ['Dairy', 'Wheat', 'Eggs', 'Soy'],
    longDescription: 'Our signature Midnight Chocolate Truffle is not just a cake; it’s an exploration of flavor. We begin with three layers of ultra-moist chocolate sponge, infused with a touch of espresso to deepen the cocoa profile.\n\nBetween these layers lies a silk-smooth ganache made from single-origin dark chocolate and local grass-fed cream. The exterior is hand-finished with a mirror glaze that reflects the artistry of our master bakers.',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_2ondic-O8c5xmQ9pdojRlh_WCE8DxsXH4e2vba2LqfzI45xIO0aBQqQP0W_bHra6M8Y6tIRXQG2D9ixtFW-DpqAionEB9CM1PdHd9-5ooC0oDXjA2IWXU2LZhijweGD0vJsrccVjnYK6s1_CGIRKGMLZsJEeI9Bs70umRcyylzUetvWSxs1Akaq0eQY6ZujjlTF6VL_fxK2beKEYDxiEoiUxwc5fvliI1Pq4tRbOlY9XSkgrX9T1juA-QHp3Gy40aSTABU2ELpw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCgZvbNTi-eDkGqz5uODPG_XOE_pI1FuuquD9txwHLPnVCDiyM7AsdZ2FROSX7PPUS_UoWBd3uJ9aJnhW2ha0oLlTKT-J-xZDkse6oRP27y7178wQc1WIapcyvl6GHyDH9-5s1ktQyBu48xhg_0upLaQfzMQag2DlH8-rUWG2tl9a56uU-hEAcgHOmLbXJOn_O2TRkpqVOgeoJBgaSJ-8Y7qtFcW0MeCHNUZo7dqV2c2B166VZTccZPtizawm_IfzBLM4ufrNpN13I',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDn199ndCmVkeOEB8SYHjzmH4BIRJMQmBdwAfjLIqMG8FAUQ1U_swB20-iafumVOLZXLTHPB7g3A61BYGM4FnSvwaPg4RpQq4OY9ToWya1FCVgAucGBuoyaLkf0715Mjqe8ze34y8Gguz7bITeMpt0LBx0Pdq-x-Jf6TOqXWL-3FdOK2s8ML1_MoND1R3kxxKKIM1uLIHutQVFicagydm22RMiLqxukOwDZG41A2xpV4gBcR_fxALcwi2i77LhxQWAk7We2KQew4aY'
    ]
  },
  {
    id: 'velvet-raspberry',
    name: 'Velvet Raspberry',
    description: 'Classic Red Velvet with a seasonal raspberry twist and edible gold leaf.',
    price: 65.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xg23JS1m4efL9471QbGoCMXQ8bREBf4rmiEUsiiZ1DtA43Izo8whF4OBWlboGEe0Aa3nnYVteJ1aCUP2zV93ExluaKODbXHiKA8BhHAmdoUj2vY0_5o0KZ8wbdna2iNNELxvWFBr-TtUjk6Ukonssn9vTtAXuDLIn4nkCgVdSc1eDXVO1DgztvyqYOmBpw3u37mCTHGXsIPPaDEXOedqHrdX9SRPk5gmo21sPXS7YJukfAPHw1Wp_-UpKUB8jY99nr8F4-dV4bU',
    alt: 'Velvet Raspberry Red Velvet Cake',
    category: 'Cakes',
    tag: 'Top Seller',
    tagType: 'top-seller',
    allergens: ['Dairy', 'Wheat', 'Eggs'],
    longDescription: 'Our exquisite Velvet Raspberry red velvet cake is a culinary dance of textures. Fine organic flour combined with rich premium cocoa powder creates the moistest cake experience. Layered with luxury whipped cream cheese and finished beautifully with organic seasonal raspberries.',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xg23JS1m4efL9471QbGoCMXQ8bREBf4rmiEUsiiZ1DtA43Izo8whF4OBWlboGEe0Aa3nnYVteJ1aCUP2zV93ExluaKODbXHiKA8BhHAmdoUj2vY0_5o0KZ8wbdna2iNNELxvWFBr-TtUjk6Ukonssn9vTtAXuDLIn4nkCgVdSc1eDXVO1DgztvyqYOmBpw3u37mCTHGXsIPPaDEXOedqHrdX9SRPk5gmo21sPXS7YJukfAPHw1Wp_-UpKUB8jY99nr8F4-dV4bU'
    ]
  },
  {
    id: 'lemon-elderflower',
    name: 'Lemon Elderflower',
    description: 'Zesty lemon sponge infused with delicate organic elderflower cordial, topped with seasonal botanicals.',
    price: 58.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDu-sOFC_clNfl-o1-CIa8fAywrOmZPVjVFqT-1sioO3S2PZFCRtQQubLZWfb5UlCU9g7e-YHLopLWGqBAD6xq9qvn7Qr2HLB18reSKJy-F5eetLCs1RkFB-dSVDu6D4Q1V8s3MY2aWeFj2MGsrEVJAjWqKQdyzTDx4JyfnjbjW6OFQkXBBaA8xdsW7ZiyvroVCfMZ8Z4tWvC-TrAqMhUDttpiiHajfwtv_17Kf7_C1HLp86q7G1-RhoZlLVwZ0Og49W2sJnxDLvV0',
    alt: 'Lemon Elderflower",',
    category: 'Cakes',
    tag: "Baker's Pick",
    tagType: 'bakers-pick',
    allergens: ['Dairy', 'Wheat', 'Eggs'],
    longDescription: 'Whimsical organic lemon elderflower bake featuring the natural sweetness of elderflower syrup and premium farm-fresh eggs. This cake represents the classic English garden in full bloom, making it a spectacular selection for birthdays and intimate spring assemblies.',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDu-sOFC_clNfl-o1-CIa8fAywrOmZPVjVFqT-1sioO3S2PZFCRtQQubLZWfb5UlCU9g7e-YHLopLWGqBAD6xq9qvn7Qr2HLB18reSKJy-F5eetLCs1RkFB-dSVDu6D4Q1V8s3MY2aWeFj2MGsrEVJAjWqKQdyzTDx4JyfnjbjW6OFQkXBBaA8xdsW7ZiyvroVCfMZ8Z4tWvC-TrAqMhUDttpiiHajfwtv_17Kf7_C1HLp86q7G1-RhoZlLVwZ0Og49W2sJnxDLvV0'
    ]
  },
  {
    id: 'midnight-caramel',
    name: 'Midnight Caramel',
    description: '70% cacao dark chocolate and fleur de sel salted drip caramel, highly architectural.',
    price: 72.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUGLnBgoml0dPda9a2yNWLNgKZoAPA7cFGsKFfS-LAFNeix4penlRCsck0SaTZHDE0SRjoHB-Eo-f3Dn2eksi0ApbjJbUnVJ0nMgjWy2aa2bEypmbqkLpLYXPBqiwhozhsXpNEMbtXVUBgFrtTFghbktnZwag45KM1EXrtAPNIZZSIstP1yhGyFVy3TfGAH-3yzcwB8GH0308_jreOkC3zwv9mbRHXdb43SFr-2y0-GKQQg1WGz9c_c-UUlKXdaUoG8Bylhxo4x5k',
    alt: 'Midnight Caramel Salted Dark Drip',
    category: 'Cakes',
    tag: 'Gluten-Free',
    tagType: 'gluten-free',
    allergens: ['Dairy', 'Eggs', 'Soy'],
    longDescription: 'Sophisticated gluten-free formulation using premium almond and coconut flours, layered with salted room-temperature caramel. Beautifully architectural, adorned with chocolate drip glaze and flakes of pure Guerande salt for a spectacular balance of sweet and savory.',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUGLnBgoml0dPda9a2yNWLNgKZoAPA7cFGsKFfS-LAFNeix4penlRCsck0SaTZHDE0SRjoHB-Eo-f3Dn2eksi0ApbjJbUnVJ0nMgjWy2aa2bEypmbqkLpLYXPBqiwhozhsXpNEMbtXVUBgFrtTFghbktnZwag45KM1EXrtAPNIZZSIstP1yhGyFVy3TfGAH-3yzcwB8GH0308_jreOkC3zwv9mbRHXdb43SFr-2y0-GKQQg1WGz9c_c-UUlKXdaUoG8Bylhxo4x5k'
    ]
  },
  {
    id: 'wedding-edit',
    name: 'The Wedding Edit',
    description: 'A smooth white buttercream masterpiece adorned with fresh organic lavender and regional botanicals.',
    price: 150.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrMpF8s7Ffh2BH2NwsjhsjKRP6ExDzIy3W5nnbBDc4CFYmsNb5RflMZFifVKRY20sfuo1S5oz3nPr7yNE9oOlDSECjhGTLz5U9kghA-cSOLGqBKjp17-_llX9hCkKVDXmeWH3ywJ68wSW3-CAsm-PrPkN4ZGMX1l8t2eHddR8MEKOQ5-2ZXjTPmoUEZLT900AvJo1SD8NO4-ellhGGX3WglfX-iL8sES2cmQi6pN_5WS7AN7-fLKeh-leUJxtOrrMTPFaOrK7AJMU',
    alt: 'The Wedding Edit Lavender cake',
    category: 'Collections',
    tag: 'Exclusive',
    longDescription: 'The pinnacle of bespoke celebrations. Smooth, three-tiered vanilla seed sponge filled with fresh berries, styled in modern asymmetrical floral arrangements, capturing refined luxury.'
  },
  {
    id: 'celebration-series',
    name: 'Celebration Series',
    description: 'Indulgent birthday cupcakes topped with rich fruit glaze and gold-dusted chocolate curls.',
    price: 36.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfw8S0xfJu5DS6DWVU4Q_IDs-mxU6bli9ETS_7xPkAJxPwb4BEQxu4o119NjeStD8U5iBmiU8CLYBM8KOkvQyhyjcTsWHLXtwOSe5Kcq2XZ1BmYoIGoPp4R6p2YJPVUZSVU-F2S4KRfkpsxNnGbKjZxxDugSP92aUZRXhOuqq9o9GWUIVHRi0CPPuIQ_92lAq1J-3ZzwPeYTP6db5_yZT2xTwfExjBmaenX8eamasFHxa_LT74mqLh-GHIMMZSPxfyf89sAuYPiHA',
    alt: 'Celebration Series Cupcakes',
    category: 'Collections',
    tag: 'Popular',
    longDescription: 'Selection of six cupcakes crafted with high-end premium cacao and seasonal fruits, beautifully packaged for fine celebratory experiences.'
  },
  {
    id: 'signature-series',
    name: 'Signature Ganache Pedestal',
    description: 'Moody dark chocolate ganache topped with minimal metallic flakes and structural sugar shards.',
    price: 48.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF1vWWMhoj_r7JzZdxYC7y6_uRvPHR-17cRs43b43YdENEhof_rXhPpsi_7P9l9ZniCe5JMpB4UDmo3SieyrOy5n1BVj7a7fm6-VKxqkTvwXtg-k4cjwzWonPOrhewwC9jHVEn0X1gge9wfdLkyShZ834X3MG3oHMzKKDuq0H6VnnBImT11v7-3KbbpO5L9riCNYY7-7ATeeyJ78FYpoobQTsiNEcn_A-TX96KKEHoAgFK7O57_mQEBg2kp_OiPI_1vEbfCPzjb4k',
    alt: 'Signature Dark Chocolate',
    category: 'Collections',
    longDescription: 'An ultra-refined chocolate creation, meticulously tempered and glazed to a pristine glassy reflection.'
  },
  {
    id: 'gifting',
    name: 'Luxury Macaron Selection Box',
    description: 'Handpackaged selections of macarons lined in silk paper and secured with velvet berry ribbons.',
    price: 24.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH3ZRdc259uWQALJGKQUGgN9CfarVjFp4_K9TTeUkkiEEvaLz8D2AH7vLjtHxmNqklPF6hA8xcUxiIhruRRF7j482hL9sfeGF80jad5zuwQIjRjth8TbqvMR35eEnqlApBvysh3FWbhoU-voveg6M2PlkFdE5vhXLj4zN-Apz7lr28CqmsSCuzD_-NDH0dtRz1Wfs5mLNPhmtM8xe35ijR_Ij7L5ZA50VhfHxq8qsDzYuUg2-d4LshA2mSjA57vRURA7ZCCEDqgNY',
    alt: 'Luxury Gift Box Packaging',
    category: 'Gifts',
    longDescription: 'An organic selection of double-infused vanilla and fruit macarons, crafted daily by our master baker.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CK-8902',
    customerName: 'Eleanor Rigby',
    customerEmail: 'eleanor@thebeatles.com',
    address: '1 Penny Lane',
    city: 'Liverpool',
    postalCode: 'L15 9EB',
    deliveryDate: '2026-06-12',
    items: [
      { productName: 'Rosewater Macaron Tower', size: 'Medium (30 count)', quantity: 1, price: 185.00 }
    ],
    subtotal: 185.00,
    delivery: 15.00,
    tax: 16.65,
    total: 216.65,
    status: 'DELIVERED',
    date: '2026-06-08'
  },
  {
    id: 'CK-8903',
    customerName: 'Julian Casablancas',
    customerEmail: 'julian@thestrokes.com',
    address: '58 Room on Fire Drive',
    city: 'New York',
    postalCode: 'NY 10001',
    deliveryDate: '2026-06-11',
    items: [
      { productName: 'Midnight Chocolate Truffle', size: '6" (6-8 Servings)', quantity: 1, price: 84.00 }
    ],
    subtotal: 84.00,
    delivery: 15.00,
    tax: 7.56,
    total: 106.56,
    status: 'BAKING',
    date: '2026-06-09'
  },
  {
    id: 'CK-8904',
    customerName: 'Clara Bow',
    customerEmail: 'clara@silentera.org',
    address: '1920 Hollywood Blvd',
    city: 'Los Angeles',
    postalCode: 'CA 90028',
    deliveryDate: '2026-06-15',
    items: [
      { productName: 'Champagne & Gold Tiered Wedding Cake', size: '10" (30+ Servings)', quantity: 1, price: 450.00 }
    ],
    subtotal: 450.00,
    delivery: 35.00,
    tax: 40.50,
    total: 525.50,
    status: 'PENDING',
    date: '2026-06-09'
  },
  {
    id: 'CK-8905',
    customerName: 'Miles Davis',
    customerEmail: 'miles@kindofblue.com',
    address: '59 Jazz Avenue',
    city: 'Chicago',
    postalCode: 'IL 60611',
    deliveryDate: '2026-06-10',
    items: [
      { productName: 'Lemon Elderflower', size: '8" (12-15 Servings)', quantity: 1, price: 58.00 }
    ],
    subtotal: 58.00,
    delivery: 15.00,
    tax: 5.22,
    total: 78.22,
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
