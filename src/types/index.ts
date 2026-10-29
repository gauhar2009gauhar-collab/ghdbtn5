export type Language = 'ru' | 'kz' | 'en';

export type Category = 
  | 'all'
  | 'pens'
  | 'notebooks'
  | 'pencil_cases'
  | 'highlighters'
  | 'bags'
  | 'boxes';

export interface Product {
  id: string;
  name: {
    ru: string;
    kz: string;
    en: string;
  };
  category: Category;
  price: number; // in KZT (₸)
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: {
    text: { ru: string; kz: string; en: string };
    type: 'discount' | 'hot' | 'scarcity' | 'new';
  };
  stockCount: number;
  stockByCity: {
    almaty: number;
    astana: number;
    shymkent: number;
  };
  description: {
    ru: string;
    kz: string;
    en: string;
  };
  specs: {
    label: { ru: string; kz: string; en: string };
    value: { ru: string; kz: string; en: string };
  }[];
  images: string[];
  spookiness: number; // 1 to 5 pumpkins/bats
  kaspiRedEligible: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface KazakhstanCity {
  id: string;
  name: {
    ru: string;
    kz: string;
    en: string;
  };
  deliveryDays: string;
  courierAvailable: boolean;
}

export type PaymentMethod = 'kaspi_qr' | 'kaspi_red' | 'halyk_pay' | 'card';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: PaymentMethod;
  deliveryMethod: 'yandex' | 'kazpost' | 'cdek';
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  deliveryCost: number;
  status: 'processing' | 'potion_brewing' | 'bat_delivering' | 'delivered';
  timestamp: string;
}
