export type Language = 'ar' | 'en' | 'ku' | 'tr' | 'fa' | 'ur';

export type Theme = 'dark' | 'light';

export interface ItemCustomization {
  lettuce?: 'normal' | 'extra' | 'none';
  sauce?: 'normal' | 'extra' | 'none';
  isPlain?: boolean;
}

export interface CartItem {
  id: string; // unique cart entry id
  menuItem: MenuItem;
  selectedSize?: ItemSizeOption;
  selectedSpice?: 'mild' | 'spicy' | 'super';
  isMeal?: boolean;
  mealPriceDelta?: number;
  customizations?: ItemCustomization;
  selectedAddons?: { id: string; name: MultilingualText; price: number }[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface OrderCustomerInfo {
  customerName: string;
  customerPhone?: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  tableOrAddress: string;
  notes?: string;
}

export interface MultilingualText {
  ar: string;
  en: string;
  ku: string;
  tr: string;
  fa?: string;
  ur?: string;
}

export type DietaryTag = 
  | 'halal' 
  | 'vegetarian' 
  | 'vegan' 
  | 'spicy' 
  | 'chef-special' 
  | 'bestseller'
  | 'gluten-free';

export type Allergen = 
  | 'nuts' 
  | 'dairy' 
  | 'gluten' 
  | 'eggs' 
  | 'soy' 
  | 'seafood' 
  | 'sesame';

export interface ItemSizeOption {
  id: string;
  name: MultilingualText;
  priceDelta: number;
  isDefault?: boolean;
}

export interface ItemAddon {
  id: string;
  name: MultilingualText;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: MultilingualText;
  description: MultilingualText;
  ingredients: MultilingualText;
  price: number;
  image: string;
  isAvailable: boolean;
  dietaryTags: DietaryTag[];
  allergens: Allergen[];
  calories?: number;
  prepTimeMinutes?: number;
  sizes?: ItemSizeOption[];
  addons?: ItemAddon[];
  featured?: boolean;
  order?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: MultilingualText;
  icon: string;
  order: number;
}

export interface RestaurantSettings {
  name: MultilingualText;
  tagline: MultilingualText;
  logo: string;
  heroImage: string;
  currency: string;
  currencySymbol: MultilingualText;
  phone: string;
  whatsappNumber: string;
  googleMapsUrl: string;
  address: MultilingualText;
  workingHours: MultilingualText;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface SavedOrder {
  id: string;
  orderNumber: string;
  createdAt: string; // ISO string
  customerInfo: OrderCustomerInfo;
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  status: OrderStatus;
  notes?: string;
  language: Language;
}

