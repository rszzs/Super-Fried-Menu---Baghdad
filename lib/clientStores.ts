'use client';

import { useSyncExternalStore } from 'react';
import { Language, Theme, CartItem, MenuItem, Category, RestaurantSettings, SavedOrder, OrderStatus } from '@/types/menu';
import { detectBrowserLanguage, isRtl } from '@/lib/i18n';
import { initialCategories, initialMenuItems, initialRestaurantSettings } from '@/data/initialMenu';

// Custom event names for in-memory sync across components
const LANG_CHANGE_EVENT = 'superfried_lang_change';
const THEME_CHANGE_EVENT = 'superfried_theme_change';
const CART_CHANGE_EVENT = 'superfried_cart_change';
const MENU_CHANGE_EVENT = 'superfried_menu_change';
const CATEGORIES_CHANGE_EVENT = 'superfried_categories_change';
const SETTINGS_CHANGE_EVENT = 'superfried_settings_change';
const ORDERS_CHANGE_EVENT = 'superfried_orders_change';

// ----------------------------------------------------
// 1. Language Store
// ----------------------------------------------------
let cachedLang: Language | null = null;

function getClientLanguageSnapshot(): Language {
  if (cachedLang !== null) return cachedLang;
  try {
    cachedLang = detectBrowserLanguage();
    return cachedLang;
  } catch {
    return 'ar';
  }
}

function getServerLanguageSnapshot(): Language {
  return 'ar';
}

function subscribeLanguage(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(LANG_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(LANG_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function setAppLanguage(lang: Language) {
  cachedLang = lang;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('superfried_menu_lang', lang);
      const rtl = isRtl(lang);
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    } catch {}
    window.dispatchEvent(new Event(LANG_CHANGE_EVENT));
  }
}

export function useAppLanguage(): [Language, (lang: Language) => void] {
  const lang = useSyncExternalStore(
    subscribeLanguage,
    getClientLanguageSnapshot,
    getServerLanguageSnapshot
  );

  return [lang, setAppLanguage];
}

// ----------------------------------------------------
// 2. Theme Store
// ----------------------------------------------------
let cachedTheme: Theme | null = null;

function getClientThemeSnapshot(): Theme {
  if (cachedTheme !== null) return cachedTheme;
  try {
    const saved = localStorage.getItem('superfried_theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      cachedTheme = saved;
      return saved;
    }
  } catch {}
  cachedTheme = 'dark';
  return 'dark';
}

function getServerThemeSnapshot(): Theme {
  return 'dark';
}

function subscribeTheme(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function setAppTheme(theme: Theme) {
  cachedTheme = theme;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('superfried_theme', theme);
      if (theme === 'light') {
        document.body.classList.add('theme-light');
      } else {
        document.body.classList.remove('theme-light');
      }
    } catch {}
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }
}

export function useAppTheme(): [Theme, (theme: Theme | ((prev: Theme) => Theme)) => void] {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getClientThemeSnapshot,
    getServerThemeSnapshot
  );

  const setThemeWithUpdater = (newTheme: Theme | ((prev: Theme) => Theme)) => {
    const resolved = typeof newTheme === 'function' ? newTheme(theme) : newTheme;
    setAppTheme(resolved);
  };

  return [theme, setThemeWithUpdater];
}

// ----------------------------------------------------
// 3. Cart Store
// ----------------------------------------------------
const EMPTY_CART: CartItem[] = [];
let cachedCart: CartItem[] = EMPTY_CART;
let cartLoaded = false;

function getClientCartSnapshot(): CartItem[] {
  if (cartLoaded) return cachedCart;
  try {
    const saved = localStorage.getItem('superfried_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cachedCart = parsed;
      }
    }
  } catch {}
  cartLoaded = true;
  return cachedCart;
}

function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribeCart(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CART_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CART_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function setAppCart(items: CartItem[]) {
  cachedCart = items;
  cartLoaded = true;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('superfried_cart', JSON.stringify(items));
    } catch {}
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
  }
}

export function useAppCart(): [CartItem[], (updater: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void] {
  const cart = useSyncExternalStore(
    subscribeCart,
    getClientCartSnapshot,
    getServerCartSnapshot
  );

  const setCartWithUpdater = (updater: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    const resolved = typeof updater === 'function' ? updater(cart) : updater;
    setAppCart(resolved);
  };

  return [cart, setCartWithUpdater];
}

// ----------------------------------------------------
// 4. Menu Items Store
// ----------------------------------------------------
let cachedMenuItems: MenuItem[] = initialMenuItems;
let menuLoaded = false;

function getClientMenuSnapshot(): MenuItem[] {
  if (menuLoaded) return cachedMenuItems;
  try {
    const saved = localStorage.getItem('superfried_menu_items');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedMenuItems = parsed;
      }
    }
  } catch {}
  menuLoaded = true;
  return cachedMenuItems;
}

function getServerMenuSnapshot(): MenuItem[] {
  return initialMenuItems;
}

function subscribeMenu(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(MENU_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(MENU_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function setAppMenuItems(items: MenuItem[]) {
  cachedMenuItems = items;
  menuLoaded = true;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('superfried_menu_items', JSON.stringify(items));
    } catch {}
    window.dispatchEvent(new Event(MENU_CHANGE_EVENT));
  }
}

export function resetAppMenuItems() {
  setAppMenuItems(initialMenuItems);
}

export function toggleMenuItemAvailability(itemId: string) {
  const current = getClientMenuSnapshot();
  const next = current.map(item => 
    item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
  );
  setAppMenuItems(next);
}

export function useAppMenuItems(): [MenuItem[], (updater: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])) => void] {
  const items = useSyncExternalStore(
    subscribeMenu,
    getClientMenuSnapshot,
    getServerMenuSnapshot
  );

  const setWithUpdater = (updater: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])) => {
    const resolved = typeof updater === 'function' ? updater(items) : updater;
    setAppMenuItems(resolved);
  };

  return [items, setWithUpdater];
}

// ----------------------------------------------------
// 5. Categories Store
// ----------------------------------------------------
let cachedCategories: Category[] = initialCategories;
let categoriesLoaded = false;

function getClientCategoriesSnapshot(): Category[] {
  if (categoriesLoaded) return cachedCategories;
  try {
    const saved = localStorage.getItem('superfried_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedCategories = parsed;
      }
    }
  } catch {}
  categoriesLoaded = true;
  return cachedCategories;
}

function getServerCategoriesSnapshot(): Category[] {
  return initialCategories;
}

function subscribeCategories(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CATEGORIES_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CATEGORIES_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function setAppCategories(cats: Category[]) {
  cachedCategories = cats;
  categoriesLoaded = true;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('superfried_categories', JSON.stringify(cats));
    } catch {}
    window.dispatchEvent(new Event(CATEGORIES_CHANGE_EVENT));
  }
}

export function resetAppCategories() {
  setAppCategories(initialCategories);
}

export function useAppCategories(): [Category[], (updater: Category[] | ((prev: Category[]) => Category[])) => void] {
  const categories = useSyncExternalStore(
    subscribeCategories,
    getClientCategoriesSnapshot,
    getServerCategoriesSnapshot
  );

  const setWithUpdater = (updater: Category[] | ((prev: Category[]) => Category[])) => {
    const resolved = typeof updater === 'function' ? updater(categories) : updater;
    setAppCategories(resolved);
  };

  return [categories, setWithUpdater];
}

// ----------------------------------------------------
// 6. Settings Store
// ----------------------------------------------------
let cachedSettings: RestaurantSettings = initialRestaurantSettings;
let settingsLoaded = false;

function getClientSettingsSnapshot(): RestaurantSettings {
  if (settingsLoaded) return cachedSettings;
  try {
    const saved = localStorage.getItem('superfried_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.name) {
        cachedSettings = parsed;
      }
    }
  } catch {}
  settingsLoaded = true;
  return cachedSettings;
}

function getServerSettingsSnapshot(): RestaurantSettings {
  return initialRestaurantSettings;
}

function subscribeSettings(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(SETTINGS_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(SETTINGS_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function setAppSettings(st: RestaurantSettings) {
  cachedSettings = st;
  settingsLoaded = true;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('superfried_settings', JSON.stringify(st));
    } catch {}
    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  }
}

export function resetAppSettings() {
  setAppSettings(initialRestaurantSettings);
}

export function useAppSettings(): [RestaurantSettings, (updater: RestaurantSettings | ((prev: RestaurantSettings) => RestaurantSettings)) => void] {
  const settings = useSyncExternalStore(
    subscribeSettings,
    getClientSettingsSnapshot,
    getServerSettingsSnapshot
  );

  const setWithUpdater = (updater: RestaurantSettings | ((prev: RestaurantSettings) => RestaurantSettings)) => {
    const resolved = typeof updater === 'function' ? updater(settings) : updater;
    setAppSettings(resolved);
  };

  return [settings, setWithUpdater];
}

// ----------------------------------------------------
// 7. Orders Store (For Dashboard / DPANAL)
// ----------------------------------------------------
const EMPTY_ORDERS: SavedOrder[] = [];
let cachedOrders: SavedOrder[] = EMPTY_ORDERS;
let ordersLoaded = false;

function getClientOrdersSnapshot(): SavedOrder[] {
  if (ordersLoaded) return cachedOrders;
  try {
    const saved = localStorage.getItem('superfried_orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cachedOrders = parsed;
      }
    }
  } catch {}
  ordersLoaded = true;
  return cachedOrders;
}

function getServerOrdersSnapshot(): SavedOrder[] {
  return EMPTY_ORDERS;
}

function subscribeOrders(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(ORDERS_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(ORDERS_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function setAppOrders(orders: SavedOrder[]) {
  cachedOrders = orders;
  ordersLoaded = true;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('superfried_orders', JSON.stringify(orders));
    } catch {}
    window.dispatchEvent(new Event(ORDERS_CHANGE_EVENT));
  }
}

export function addAppOrder(order: SavedOrder) {
  const current = getClientOrdersSnapshot();
  const updated = [order, ...current];
  setAppOrders(updated);
}

export function updateAppOrderStatus(orderId: string, status: OrderStatus) {
  const current = getClientOrdersSnapshot();
  const updated = current.map(o => o.id === orderId ? { ...o, status } : o);
  setAppOrders(updated);
}

export function deleteAppOrder(orderId: string) {
  const current = getClientOrdersSnapshot();
  const updated = current.filter(o => o.id !== orderId);
  setAppOrders(updated);
}

export function clearAppOrders() {
  setAppOrders([]);
}

export function useAppOrders(): [SavedOrder[], (updater: SavedOrder[] | ((prev: SavedOrder[]) => SavedOrder[])) => void] {
  const orders = useSyncExternalStore(
    subscribeOrders,
    getClientOrdersSnapshot,
    getServerOrdersSnapshot
  );

  const setWithUpdater = (updater: SavedOrder[] | ((prev: SavedOrder[]) => SavedOrder[])) => {
    const resolved = typeof updater === 'function' ? updater(orders) : updater;
    setAppOrders(resolved);
  };

  return [orders, setWithUpdater];
}

