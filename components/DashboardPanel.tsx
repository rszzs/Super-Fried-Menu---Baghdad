'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MenuItem, 
  Category, 
  RestaurantSettings, 
  Language, 
  DietaryTag,
  Allergen,
  SavedOrder,
  OrderStatus,
  Theme
} from '@/types/menu';
import { 
  useAppMenuItems, 
  useAppCategories, 
  useAppSettings, 
  useAppOrders,
  useAppLanguage,
  useAppTheme,
  resetAppMenuItems,
  resetAppCategories,
  resetAppSettings,
  clearAppOrders,
  updateAppOrderStatus,
  deleteAppOrder,
  toggleMenuItemAvailability
} from '@/lib/clientStores';
import { formatPrice } from '@/lib/i18n';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Layers, 
  ShoppingBag, 
  Settings, 
  Database, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Star, 
  Flame, 
  ExternalLink, 
  Lock, 
  Unlock, 
  KeyRound, 
  Sun, 
  Moon, 
  RefreshCw, 
  Download, 
  Upload, 
  Printer, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  AlertCircle,
  Copy,
  ChevronRight,
  TrendingUp,
  Package,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const DEFAULT_PIN = '7700';

type DashboardTab = 'overview' | 'items' | 'categories' | 'orders' | 'settings' | 'backup';

export default function DashboardPanel() {
  const [currentLang, setCurrentLang] = useAppLanguage();
  const [theme, setTheme] = useAppTheme();
  
  // Data stores
  const [menuItems, setMenuItems] = useAppMenuItems();
  const [categories, setCategories] = useAppCategories();
  const [settings, setSettings] = useAppSettings();
  const [orders, setOrders] = useAppOrders();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return (
        localStorage.getItem('superfried_dpanal_auth') === 'true' ||
        sessionStorage.getItem('superfried_dpanal_auth') === 'true'
      );
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Filter / Search states in Menu tab
  const [itemSearch, setItemSearch] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'unavailable' | 'featured'>('all');

  // Modal states
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isNewItem, setIsNewItem] = useState<boolean>(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);

  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<SavedOrder | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Toast / Notification banner
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const storedPin = (typeof window !== 'undefined' && localStorage.getItem('superfried_dpanal_pin')) || DEFAULT_PIN;
    
    if (pinInput === storedPin || pinInput === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setPinError(null);
      try {
        if (rememberMe) {
          localStorage.setItem('superfried_dpanal_auth', 'true');
        } else {
          sessionStorage.setItem('superfried_dpanal_auth', 'true');
        }
      } catch {}
      showToast('تم تسجيل الدخول بنجاح إلى لوحة التحكم', 'success');
    } else {
      setPinError('رمز المرور غير صحيح، يرجى المحاولة مجدداً');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput('');
    try {
      localStorage.removeItem('superfried_dpanal_auth');
      sessionStorage.removeItem('superfried_dpanal_auth');
    } catch {}
    showToast('تم تسجيل الخروج من لوحة التحكم', 'info');
  };

  // Analytics summary
  const stats = useMemo(() => {
    const totalItems = menuItems.length;
    const availableItems = menuItems.filter(i => i.isAvailable).length;
    const unavailableItems = totalItems - availableItems;
    const featuredItems = menuItems.filter(i => i.featured).length;
    const totalCats = categories.length;
    const totalOrdersCount = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const newOrders = orders.filter(o => o.status === 'new').length;

    return {
      totalItems,
      availableItems,
      unavailableItems,
      featuredItems,
      totalCats,
      totalOrdersCount,
      totalRevenue,
      newOrders,
    };
  }, [menuItems, categories, orders]);

  // Filtered Menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategoryFilter === 'all' || item.categoryId === selectedCategoryFilter;
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'available' && item.isAvailable) ||
        (statusFilter === 'unavailable' && !item.isAvailable) ||
        (statusFilter === 'featured' && item.featured);
      
      const q = itemSearch.trim().toLowerCase();
      const matchesSearch = !q || 
        item.name.ar.toLowerCase().includes(q) ||
        item.name.en.toLowerCase().includes(q) ||
        (item.name.ku && item.name.ku.toLowerCase().includes(q)) ||
        (item.description.ar && item.description.ar.toLowerCase().includes(q));

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [menuItems, selectedCategoryFilter, statusFilter, itemSearch]);

  // Item Modal Handlers
  const handleOpenNewItem = () => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      categoryId: categories[0]?.id || 'cat-chicken',
      name: { ar: '', en: '', ku: '', tr: '', fa: '', ur: '' },
      description: { ar: '', en: '', ku: '', tr: '' },
      ingredients: { ar: '', en: '', ku: '', tr: '' },
      price: 5000,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      dietaryTags: ['halal'],
      allergens: [],
      calories: 450,
      prepTimeMinutes: 10,
      featured: false,
    };
    setEditingItem(newItem);
    setIsNewItem(true);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsNewItem(false);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.name.ar.trim()) {
      showToast('يرجى كتابة اسم الوجبة بالعربية على الأقل', 'error');
      return;
    }

    if (isNewItem) {
      setMenuItems(prev => [editingItem, ...prev]);
      showToast('تمت إضافة الوجبة بنجاح إلى المنيو', 'success');
    } else {
      setMenuItems(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
      showToast('تم حفظ تعديلات الوجبة بنجاح', 'success');
    }
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    if (confirm(`هل أنت متأكد من حذف الوجبة "${itemName}"؟`)) {
      setMenuItems(prev => prev.filter(i => i.id !== itemId));
      showToast('تم حذف الوجبة من المنيو', 'info');
    }
  };

  const handleDuplicateItem = (item: MenuItem) => {
    const duplicated: MenuItem = {
      ...JSON.parse(JSON.stringify(item)),
      id: `item-${Date.now()}`,
      name: {
        ...item.name,
        ar: `${item.name.ar} (نسخة)`,
        en: `${item.name.en} (Copy)`,
      }
    };
    setMenuItems(prev => [duplicated, ...prev]);
    showToast('تم تكرار الوجبة بنجاح', 'success');
  };

  // Category Modal Handlers
  const handleOpenNewCategory = () => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      slug: `category-${Date.now()}`,
      name: { ar: '', en: '', ku: '', tr: '', fa: '', ur: '' },
      icon: '🍗',
      order: categories.length + 1,
    };
    setEditingCategory(newCat);
    setIsNewCategory(true);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(JSON.parse(JSON.stringify(cat)));
    setIsNewCategory(false);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!editingCategory || !editingCategory.name.ar.trim()) {
      showToast('يرجى كتابة اسم القسم بالعربية', 'error');
      return;
    }

    if (isNewCategory) {
      setCategories(prev => [...prev, editingCategory]);
      showToast('تمت إضافة القسم الجديد بنجاح', 'success');
    } else {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? editingCategory : c));
      showToast('تم حفظ تعديلات القسم بنجاح', 'success');
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    const itemsCountInCat = menuItems.filter(i => i.categoryId === catId).length;
    if (itemsCountInCat > 0) {
      if (!confirm(`هذا القسم يحتوي على ${itemsCountInCat} وجبة. هل تريد حذفه ونقل وجباته؟`)) {
        return;
      }
    } else {
      if (!confirm(`هل أنت متأكد من حذف القسم "${catName}"؟`)) {
        return;
      }
    }
    setCategories(prev => prev.filter(c => c.id !== catId));
    showToast('تم حذف القسم بنجاح', 'info');
  };

  // Export / Import JSON
  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      restaurant: settings,
      categories,
      menuItems,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `superfried-menu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير نسخة احتياطية من المنيو بنجاح', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.menuItems && Array.isArray(parsed.menuItems)) {
          setMenuItems(parsed.menuItems);
        }
        if (parsed.categories && Array.isArray(parsed.categories)) {
          setCategories(parsed.categories);
        }
        if (parsed.restaurant) {
          setSettings(parsed.restaurant);
        }
        showToast('تم استيراد بيانات المنيو بنجاح', 'success');
      } catch {
        showToast('فشل في قراءة ملف النسخة الاحتياطية', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetToDefaults = () => {
    if (confirm('هل أنت متأكد من استعادة القائمة الافتراضية الأصلية لجميع الوجبات والإعدادات؟ ستفقد أي تعديلات غير محفوظة.')) {
      resetAppMenuItems();
      resetAppCategories();
      resetAppSettings();
      showToast('تمت استعادة القائمة الافتراضية بنجاح', 'success');
    }
  };

  const isLight = theme === 'light';

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isLight 
          ? 'bg-[#F4EFE6] text-[#1A1816]' 
          : 'bg-[#0E0D0B] text-[#F3F4F6]'
      }`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={`w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl border ${
            isLight 
              ? 'bg-white border-[#E2DDD5]' 
              : 'bg-[#181613] border-[#2E2820]'
          }`}
        >
          {/* Brand Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF9800] mx-auto flex items-center justify-center text-3xl shadow-lg shadow-[#FF5722]/30">
              🍗
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center justify-center gap-2">
                لوحة تحكم سوبرفرايد
              </h1>
              <p className={`text-xs mt-1 ${isLight ? 'text-[#7A7265]' : 'text-neutral-400'}`}>
                Super Fried Restaurant Dashboard (DPANAL)
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5722]/10 text-[#FF5722] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              منطقة إدارة المطعم المحمية
            </div>
          </div>

          {/* PIN Form */}
          <form onSubmit={handlePinSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold mb-2 flex items-center justify-between">
                <span>رمز الدخول السري (PIN):</span>
                <span className="text-[11px] opacity-60 font-mono">الافتراضي: 7700</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="dpanal-pin-input"
                  maxLength={10}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(null);
                  }}
                  placeholder="أدخل رمز المرور..."
                  autoFocus
                  className={`w-full px-4 py-3.5 rounded-2xl text-center text-xl tracking-[0.3em] font-mono font-bold focus:outline-none transition-all ${
                    isLight 
                      ? 'bg-[#F9F7F4] border border-[#DCD6CB] focus:border-[#FF5722] focus:bg-white text-neutral-900' 
                      : 'bg-[#221F1B] border border-[#383127] focus:border-[#FF5722] focus:bg-[#2A2621] text-white'
                  }`}
                />
                <KeyRound className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
              {pinError && (
                <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {pinError}
                </p>
              )}
            </div>

            {/* Numeric Keypad Buttons for mobile convenience */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  id={`keypad-${k}`}
                  onClick={() => {
                    if (k === 'C') {
                      setPinInput('');
                    } else if (k === '⌫') {
                      setPinInput(prev => prev.slice(0, -1));
                    } else {
                      setPinInput(prev => (prev.length < 8 ? prev + k : prev));
                    }
                  }}
                  className={`py-2.5 rounded-xl font-mono text-base font-bold transition-all active:scale-95 cursor-pointer ${
                    isLight
                      ? 'bg-[#EFEAE1] hover:bg-[#E3DDD1] text-neutral-800'
                      : 'bg-[#24201A] hover:bg-[#322C24] text-neutral-200'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#FF5722] focus:ring-[#FF5722]"
                />
                <span>تذكر تسجيل الدخول على هذا الجهاز</span>
              </label>
            </div>

            <button
              type="submit"
              id="dpanal-login-button"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:from-[#E64A19] hover:to-[#D84315] text-white font-black text-sm shadow-lg shadow-[#FF5722]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Unlock className="w-4 h-4" />
              دخول لوحة التحكم
            </button>
          </form>

          {/* Customer Menu Link */}
          <div className="mt-6 pt-6 border-t border-dashed text-center">
            <Link
              href="/"
              className={`text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                isLight ? 'text-[#7A7265] hover:text-[#FF5722]' : 'text-neutral-400 hover:text-[#FF5722]'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              العودة إلى منيو الزبائن الرئيسي
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN DASHBOARD INTERFACE
  // ----------------------------------------------------
  return (
    <div className={`min-h-screen flex flex-col ${
      isLight ? 'bg-[#F7F4EE] text-[#1A1816]' : 'bg-[#0F0E0C] text-[#F3F4F6]'
    }`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold border backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-[#10B981]/90 text-white border-emerald-400'
                : toastMessage.type === 'error'
                  ? 'bg-[#EF4444]/90 text-white border-red-400'
                  : 'bg-[#FF5722]/90 text-white border-orange-400'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between ${
        isLight ? 'bg-white/90 border-[#E5E0D6]' : 'bg-[#161412]/90 border-[#2A251E]'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF9800] flex items-center justify-center text-xl shadow-md text-white">
            🍗
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight">
                سوبرفرايد — لوحة التحكم
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FF5722]/20 text-[#FF5722]">
                /DPANAL
              </span>
            </div>
            <p className={`text-[11px] ${isLight ? 'text-[#7A7265]' : 'text-neutral-400'}`}>
              إدارة قائمة الطعام، الأسعار، الطلبات، والإعدادات
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2">
          {/* Customer Menu Link */}
          <Link
            href="/"
            target="_blank"
            id="view-customer-menu-link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold shadow-sm transition-all"
            title="معاينة منيو الزبائن في نافذة جديدة"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">عرض المنيو</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            id="dashboard-theme-toggle"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight 
                ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700' 
                : 'bg-[#221F1B] hover:bg-[#2D2822] border-[#383126] text-neutral-300'
            }`}
            title="تبديل المظهر (فاتح / داكن)"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            id="dashboard-logout-btn"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isLight 
                ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' 
                : 'bg-red-950/30 hover:bg-red-900/40 text-red-400 border-red-900/40'
            }`}
            title="تسجيل الخروج من لوحة التحكم"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className={`p-1.5 rounded-2xl border flex flex-wrap gap-1 ${
          isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
        }`}>
          {[
            { id: 'overview' as DashboardTab, label: 'لوحة المؤشرات', icon: LayoutDashboard, count: null },
            { id: 'items' as DashboardTab, label: 'الوجبات والمنيو', icon: UtensilsCrossed, count: stats.totalItems },
            { id: 'categories' as DashboardTab, label: 'الأقسام والتصنيفات', icon: Layers, count: stats.totalCats },
            { id: 'orders' as DashboardTab, label: 'سجل الطلبات', icon: ShoppingBag, count: stats.newOrders ? `${stats.newOrders} جديد` : stats.totalOrdersCount },
            { id: 'settings' as DashboardTab, label: 'بيانات المطعم', icon: Settings, count: null },
            { id: 'backup' as DashboardTab, label: 'النسخ والبيانات', icon: Database, count: null },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] sm:min-w-[140px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                    : isLight
                      ? 'text-neutral-600 hover:bg-[#F2ECE1]'
                      : 'text-neutral-400 hover:bg-[#24201A] hover:text-neutral-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : isLight ? 'bg-neutral-200 text-neutral-700' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: OVERVIEW & LIVE METRICS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className={`p-4 sm:p-5 rounded-2xl border ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-500">إجمالي الوجبات</span>
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono">{stats.totalItems}</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">
                  {stats.availableItems} وجبة متوفرة للطلب
                </div>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-500">غير متوفر (نافذ)</span>
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <EyeOff className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-red-500">
                  {stats.unavailableItems}
                </div>
                <div className="text-[11px] text-neutral-500 font-bold mt-1">
                  معطلة مؤقتاً من المنيو
                </div>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-500">الأقسام النشطة</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono">{stats.totalCats}</div>
                <div className="text-[11px] text-blue-500 font-bold mt-1">
                  كنتاكي، بركر، ستربس، ريزو...
                </div>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-500">إجمالي الطلبات</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono">{stats.totalOrdersCount}</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">
                  {formatPrice(stats.totalRevenue, 'ar')}
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
              isLight 
                ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' 
                : 'bg-gradient-to-r from-[#241B14] to-[#24170E] border-[#422C1A]'
            }`}>
              <div className="space-y-1 text-center md:text-right">
                <h3 className="text-lg font-black">تحكم سريع بوجبات وأسعار سوبرفرايد</h3>
                <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  أي تعديل في الأسعار، التوفر، أو إضافة صنف جديد يظهر فوراً للزبائن في المنيو بدون إعادة تحميل.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleOpenNewItem}
                  id="overview-add-item-btn"
                  className="px-4 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  إضافة وجبة جديدة
                </button>
                <button
                  onClick={() => setActiveTab('items')}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    isLight ? 'bg-white hover:bg-neutral-100 border-neutral-300' : 'bg-[#181613] hover:bg-[#25211B] border-[#383126]'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  تعديل قائمة الطعام
                </button>
              </div>
            </div>

            {/* Recent Items Preview */}
            <div className={`p-5 rounded-3xl border space-y-4 ${
              isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  أبرز الوجبات المميزة (Featured Items)
                </h3>
                <button
                  onClick={() => setActiveTab('items')}
                  className="text-xs text-[#FF5722] font-bold hover:underline"
                >
                  عرض الكل ({stats.totalItems})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {menuItems.filter(i => i.featured || i.isAvailable).slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                      isLight ? 'bg-[#FAF8F5] border-[#E8E3DA]' : 'bg-[#201D18] border-[#2E2820]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
                        <Image
                          src={item.image}
                          alt={item.name.ar}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate">{item.name.ar}</h4>
                        <p className="text-[11px] text-[#FF5722] font-mono font-bold">
                          {formatPrice(item.price, 'ar')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleMenuItemAvailability(item.id)}
                        title={item.isAvailable ? 'تعطيل التوفر' : 'تفعيل التوفر'}
                        className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          item.isAvailable 
                            ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' 
                            : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                        }`}
                      >
                        {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleOpenEditItem(item)}
                        className="p-1.5 rounded-lg bg-neutral-500/20 hover:bg-neutral-500/30 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                        title="تعديل الوجبة"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: MENU ITEMS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {/* Action & Filter Bar */}
            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
              isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
            }`}>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    placeholder="ابحث عن وجبة أو مكون..."
                    className={`w-full pl-3 pr-9 py-2 rounded-xl text-xs font-bold focus:outline-none transition-all ${
                      isLight 
                        ? 'bg-[#F5F1E9] border border-[#DDD7CD] focus:border-[#FF5722]' 
                        : 'bg-[#221F1B] border border-[#332C23] focus:border-[#FF5722]'
                    }`}
                  />
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                    isLight 
                      ? 'bg-[#F5F1E9] border border-[#DDD7CD]' 
                      : 'bg-[#221F1B] border border-[#332C23]'
                  }`}
                >
                  <option value="all">جميع الأقسام ({menuItems.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name.ar}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                    isLight 
                      ? 'bg-[#F5F1E9] border border-[#DDD7CD]' 
                      : 'bg-[#221F1B] border border-[#332C23]'
                  }`}
                >
                  <option value="all">كل الحالات</option>
                  <option value="available">🟢 المتوفرة فقط</option>
                  <option value="unavailable">🔴 غير المتوفرة (Out of stock)</option>
                  <option value="featured">⭐ المميزة فقط</option>
                </select>
              </div>

              {/* Add New Item Button */}
              <button
                onClick={handleOpenNewItem}
                id="items-add-new-btn"
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                إضافة وجبة جديدة للمنيو
              </button>
            </div>

            {/* Menu Items Table / Grid */}
            <div className={`rounded-2xl border overflow-hidden ${
              isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className={`border-b font-bold ${
                    isLight ? 'bg-[#F8F5EE] text-neutral-600 border-[#E2DDD5]' : 'bg-[#201D18] text-neutral-300 border-[#2E2820]'
                  }`}>
                    <tr>
                      <th className="p-3.5">الوجبة</th>
                      <th className="p-3.5">القسم</th>
                      <th className="p-3.5">السعر (IQD)</th>
                      <th className="p-3.5 text-center">التوفر</th>
                      <th className="p-3.5 text-center">مميزة</th>
                      <th className="p-3.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700/10">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-neutral-500 font-bold">
                          لا توجد وجبات مطابقة للبحث أو الفلتر المحدد
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => {
                        const itemCat = categories.find(c => c.id === item.categoryId);
                        return (
                          <tr 
                            key={item.id}
                            className={`transition-colors ${
                              isLight ? 'hover:bg-[#FAF8F5]' : 'hover:bg-[#201D18]'
                            }`}
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name.ar}
                                    fill
                                    className="object-cover"
                                    sizes="44px"
                                  />
                                </div>
                                <div>
                                  <div className="font-black text-sm">{item.name.ar}</div>
                                  <div className="text-[11px] text-neutral-400 font-sans">{item.name.en}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-neutral-500/10">
                                {itemCat?.icon} {itemCat?.name.ar || item.categoryId}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-black text-sm text-[#FF5722]">
                              {formatPrice(item.price, 'ar')}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => toggleMenuItemAvailability(item.id)}
                                id={`toggle-avail-${item.id}`}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                                  item.isAvailable
                                    ? 'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30'
                                    : 'bg-red-500/20 text-red-600 hover:bg-red-500/30'
                                }`}
                              >
                                {item.isAvailable ? '🟢 متوفر' : '🔴 غير متوفر'}
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, featured: !i.featured } : i));
                                }}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  item.featured ? 'text-amber-400' : 'text-neutral-400 opacity-40 hover:opacity-100'
                                }`}
                                title="تبديل الوجبة المميزة"
                              >
                                <Star className={`w-4 h-4 ${item.featured ? 'fill-amber-400' : ''}`} />
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditItem(item)}
                                  id={`edit-item-${item.id}`}
                                  className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 cursor-pointer"
                                  title="تعديل الوجبة"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateItem(item)}
                                  id={`duplicate-item-${item.id}`}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer"
                                  title="تكرار الوجبة"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id, item.name.ar)}
                                  id={`delete-item-${item.id}`}
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer"
                                  title="حذف الوجبة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">أقسام وتصنيفات المنيو</h3>
                <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  يمكنك إضافة أقسام جديدة أو تعديل أسمائها وأيقوناتها
                </p>
              </div>
              <button
                onClick={handleOpenNewCategory}
                id="categories-add-btn"
                className="px-4 py-2 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                إضافة قسم جديد
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, idx) => {
                const count = menuItems.filter(i => i.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                      isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 flex items-center justify-center text-2xl">
                        {cat.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-sm">{cat.name.ar}</h4>
                        <p className="text-xs text-neutral-400 font-sans">{cat.name.en}</p>
                        <span className="text-[10px] font-bold text-[#FF5722]">{count} وجبة في هذا القسم</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-2 rounded-xl bg-neutral-500/10 hover:bg-neutral-500/20 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                        title="تعديل القسم"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name.ar)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                        title="حذف القسم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: ORDERS LOG & MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
            }`}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF5722]" />
                <div>
                  <h3 className="font-bold text-sm">سجل الطلبات الواردة</h3>
                  <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    يتم تسجيل جميع الطلبات المرسلة عبر الواتساب تلقائياً هنا لمتابعة المطبخ والتجهيز
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none ${
                    isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                  }`}
                >
                  <option value="all">كل الطلبات ({orders.length})</option>
                  <option value="new">🟡 جديدة فقط</option>
                  <option value="preparing">🔵 قيد التجهيز</option>
                  <option value="ready">🟢 جاهزة للتسليم</option>
                  <option value="delivered">🟣 تم التسليم</option>
                  <option value="cancelled">🔴 ملغية</option>
                </select>

                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من تفريغ سجل الطلبات بالكامل؟')) {
                        clearAppOrders();
                        showToast('تم تفريغ سجل الطلبات', 'info');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold transition-colors cursor-pointer"
                  >
                    تفريغ السجل
                  </button>
                )}
              </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
              }`}>
                <ShoppingBag className="w-12 h-12 mx-auto text-neutral-400 opacity-40 mb-3" />
                <h4 className="font-bold text-base">لا توجد طلبات مسجلة بعد</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  بمجرد قيام أي زبون بطلب وجبات وإرسالها عبر الواتساب، ستظهر تفاصيل طلبه فوراً هنا.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders
                  .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                  .map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-dashed border-neutral-700/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center font-mono font-black text-xs">
                            {order.orderNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm">
                                {order.customerInfo.customerName || 'زبون الصالة'}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                order.customerInfo.orderType === 'dine_in'
                                  ? 'bg-amber-500/20 text-amber-500'
                                  : order.customerInfo.orderType === 'takeaway'
                                    ? 'bg-blue-500/20 text-blue-500'
                                    : 'bg-emerald-500/20 text-emerald-500'
                              }`}>
                                {order.customerInfo.orderType === 'dine_in' ? '🍽️ صالة' : order.customerInfo.orderType === 'takeaway' ? '🥡 سفري' : '🛵 توصيل'}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 mt-0.5">
                              {order.customerInfo.tableOrAddress} • {new Date(order.createdAt).toLocaleTimeString('ar-IQ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Status Selector */}
                          <select
                            value={order.status}
                            onChange={(e) => updateAppOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                              order.status === 'new'
                                ? 'bg-amber-500/20 text-amber-500'
                                : order.status === 'preparing'
                                  ? 'bg-blue-500/20 text-blue-500'
                                  : order.status === 'ready'
                                    ? 'bg-emerald-500/20 text-emerald-500'
                                    : order.status === 'delivered'
                                      ? 'bg-purple-500/20 text-purple-500'
                                      : 'bg-red-500/20 text-red-500'
                            }`}
                          >
                            <option value="new">🟡 جديد</option>
                            <option value="preparing">🔵 قيد التجهيز</option>
                            <option value="ready">🟢 جاهز للتسليم</option>
                            <option value="delivered">🟣 تم التسليم</option>
                            <option value="cancelled">🔴 ملغي</option>
                          </select>

                          <button
                            onClick={() => deleteAppOrder(order.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 cursor-pointer"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Items Summary in Order */}
                      <div className="pt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {order.items.map((it, idx) => (
                            <span 
                              key={idx}
                              className={`px-2.5 py-1 rounded-lg font-bold ${
                                isLight ? 'bg-[#F4EFE6]' : 'bg-[#221F1A]'
                              }`}
                            >
                              {it.quantity}× {it.menuItem.name.ar}
                              {it.selectedSpice && it.selectedSpice !== 'mild' && (
                                <span className="text-red-500 mr-1">({it.selectedSpice === 'spicy' ? 'حار' : 'سوبر'})</span>
                              )}
                            </span>
                          ))}
                        </div>

                        <div className="font-mono font-black text-sm text-[#FF5722]">
                          المجموع: {formatPrice(order.totalAmount, 'ar')}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: RESTAURANT SETTINGS & CONTACT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className={`p-6 rounded-3xl border space-y-6 ${
            isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
          }`}>
            <div>
              <h3 className="font-bold text-base">إعدادات وبيانات مطعم سوبرفرايد</h3>
              <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                تعديل أرقام الهواتف، الواتساب، خرائط جوجل، وساعات العمل
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم المطعم (بالعربية):</label>
                <input
                  type="text"
                  value={settings.name.ar}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    name: { ...prev.name, ar: e.target.value }
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                    isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">اسم المطعم (بالإنجليزية):</label>
                <input
                  type="text"
                  value={settings.name.en}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    name: { ...prev.name, en: e.target.value }
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                    isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1">الوصف الترويجي (Tagline):</label>
                <input
                  type="text"
                  value={settings.tagline.ar}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    tagline: { ...prev.tagline, ar: e.target.value }
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                    isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">رقم الواتساب لاستقبال الطلبات:</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  placeholder="+9647703309000"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none ${
                    isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">رقم هاتف الاتصال المباشر:</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+964 770 330 9000"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none ${
                    isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">ساعات العمل:</label>
                <input
                  type="text"
                  value={settings.workingHours.ar}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    workingHours: { ...prev.workingHours, ar: e.target.value }
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                    isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">العنوان والموقع:</label>
                <input
                  type="text"
                  value={settings.address.ar}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    address: { ...prev.address, ar: e.target.value }
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                    isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1">رابط خرائط جوجل (Google Maps URL):</label>
                <input
                  type="text"
                  value={settings.googleMapsUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono focus:outline-none ${
                    isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                  }`}
                />
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => showToast('تم حفظ إعدادات المطعم بنجاح', 'success')}
                className="px-6 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: BACKUP & RESTORE */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'backup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
            }`}>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">تصدير نسخة احتياطية (Export)</h4>
                <p className={`text-xs mt-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  قم بتحميل ملف JSON يحتوي على كامل قائمة الوجبات، الأسعار، الأقسام، والإعدادات للاحتفاظ بها أو نقلها.
                </p>
              </div>
              <button
                onClick={handleExportJSON}
                id="export-menu-btn"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                تحميل النسخة الاحتياطية (JSON)
              </button>
            </div>

            <div className={`p-6 rounded-3xl border space-y-4 ${
              isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
            }`}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">استيراد نسخة احتياطية (Import)</h4>
                <p className={`text-xs mt-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  استعادة قائمة وجبات سابقة تم تصديرها كملف JSON.
                </p>
              </div>
              <label className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <Upload className="w-4 h-4" />
                <span>رفع ملف النسخة الاحتياطية</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            <div className={`md:col-span-2 p-6 rounded-3xl border space-y-4 ${
              isLight ? 'bg-red-50 border-red-200' : 'bg-red-950/20 border-red-900/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-red-500">استعادة القائمة الأصلية لمطعم سوبرفرايد</h4>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    يعيد ضبط جميع الوجبات والأسعار والأقسام إلى الحالة الافتراضية المصممة للمطعم.
                  </p>
                </div>
              </div>
              <button
                onClick={handleResetToDefaults}
                id="reset-defaults-btn"
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                استعادة الإعدادات الافتراضية
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ---------------------------------------------------- */}
      {/* EDIT ITEM MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isItemModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsItemModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl shadow-2xl border z-10 space-y-5 ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-black text-lg">
                  {isNewItem ? 'إضافة وجبة جديدة إلى المنيو' : `تعديل وجبة: ${editingItem.name.ar}`}
                </h3>
                <button
                  onClick={() => setIsItemModalOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">الاسم بالعربية *</label>
                  <input
                    type="text"
                    value={editingItem.name.ar}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      name: { ...editingItem.name, ar: e.target.value }
                    })}
                    placeholder="مثال: زنجر بركر سوبر..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                      isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">الاسم بالإنجليزية (English)</label>
                  <input
                    type="text"
                    value={editingItem.name.en}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      name: { ...editingItem.name, en: e.target.value }
                    })}
                    placeholder="e.g. Super Zinger Burger"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                      isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">القسم / التصنيف</label>
                  <select
                    value={editingItem.categoryId}
                    onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                      isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name.ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">السعر (د.ع - IQD) *</label>
                  <input
                    type="number"
                    step={250}
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none text-[#FF5722] ${
                      isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">رابط صورة الوجبة (Image URL)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingItem.image}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono focus:outline-none ${
                        isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                      }`}
                    />
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border">
                      <Image
                        src={editingItem.image || 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'}
                        alt="معاينة"
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">الوصف بالعربية</label>
                  <textarea
                    rows={2}
                    value={editingItem.description.ar}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      description: { ...editingItem.description, ar: e.target.value }
                    })}
                    placeholder="وصف شهي للوجبة..."
                    className={`w-full px-3.5 py-2 rounded-xl text-xs focus:outline-none ${
                      isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">المكونات</label>
                  <input
                    type="text"
                    value={editingItem.ingredients?.ar || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      ingredients: { ...editingItem.ingredients, ar: e.target.value, en: editingItem.ingredients?.en || '', ku: '', tr: '' }
                    })}
                    placeholder="مثال: صدر دجاج مقرمش، صوص سري، خس، جبنة شيدر..."
                    className={`w-full px-3.5 py-2 rounded-xl text-xs focus:outline-none ${
                      isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingItem.isAvailable}
                      onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })}
                      className="rounded text-[#FF5722] focus:ring-[#FF5722]"
                    />
                    <span>الوجبة متوفرة للطلب الآن (In Stock)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingItem.featured || false}
                      onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                      className="rounded text-[#FF5722] focus:ring-[#FF5722]"
                    />
                    <span>وجبة مميزة (Featured ⭐)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => setIsItemModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer ${
                    isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800'
                  }`}
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveItem}
                  id="save-item-modal-btn"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  حفظ الوجبة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* EDIT CATEGORY MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isCategoryModalOpen && editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-md p-6 rounded-3xl shadow-2xl border z-10 space-y-4 ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#181613] border-[#2E2820]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-black text-lg">
                  {isNewCategory ? 'إضافة قسم جديد' : `تعديل قسم: ${editingCategory.name.ar}`}
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">الأيقونة (رمز تعبيري Emoji)</label>
                  <input
                    type="text"
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-center text-xl focus:outline-none ${
                      isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">اسم القسم بالعربية *</label>
                  <input
                    type="text"
                    value={editingCategory.name.ar}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      name: { ...editingCategory.name, ar: e.target.value }
                    })}
                    placeholder="مثال: وجبات الكنتاكي..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                      isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">اسم القسم بالإنجليزية (English)</label>
                  <input
                    type="text"
                    value={editingCategory.name.en}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      name: { ...editingCategory.name, en: e.target.value }
                    })}
                    placeholder="e.g. Kentucky Chicken"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                      isLight ? 'bg-[#F5F1E9] border border-[#DDD7CD]' : 'bg-[#221F1B] border-[#332C23]'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer ${
                    isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800'
                  }`}
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveCategory}
                  id="save-category-modal-btn"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  حفظ القسم
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
