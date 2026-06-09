export type OrderStatus = 'PENDING' | 'BAKING' | 'DELIVERED';

export interface CakeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  tag?: string;
  tagType?: 'top-seller' | 'bakers-pick' | 'gluten-free';
  servings?: string;
  allergens?: string[];
  longDescription?: string;
  galleryImages?: string[];
}

export interface CartItem {
  product: CakeProduct;
  selectedSize: string;
  enhancements: {
    handwrittenNote: boolean;
    noteText: string;
  };
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryDate: string;
  items: {
    productName: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  status: OrderStatus;
  date: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  period: 'AM' | 'PM';
  title: string;
  description: string;
  borderType: 'primary' | 'tertiary' | 'dim' | 'outline';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  password?: string; // Stored locally
  createdAt: string;
}

