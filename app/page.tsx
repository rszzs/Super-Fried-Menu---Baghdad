'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  MenuItem, 
  Category, 
  RestaurantSettings, 
  Language, 
  DietaryTag,
  CartItem,
  Theme
} from '@/types/menu';
import { 
  initialCategories, 
  initialMenuItems, 
  initialRestaurantSettings 
} from '@/data/initialMenu';
import { 
  translations, 
  isRtl, 
  formatPrice 
} from '@/lib/i18n';
import { 
  useAppLanguage, 
  useAppTheme, 
  useAppCart,
  useAppMenuItems,
  useAppCategories,
  useAppSettings
} from '@/lib/clientStores';
import { getCategoryName } from '@/lib/menuLocalization';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryBar } from '@/components/CategoryBar';
import { MenuItemCard } from '@/components/MenuItemCard';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { 
  Search, 
  MessageCircle, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  Phone, 
  Home, 
  Box, 
  ShoppingBag,
  Send,
  Sun,
  Moon
} from 'lucide-react';

export default function HomePage() {
  // 1. Language state synced via useSyncExternalStore
  const [currentLang, setCurrentLang] = useAppLanguage();

  // 2. Theme state (Light / Dark) synced via useSyncExternalStore
  const [theme, setTheme] = useAppTheme();

  // 3. Cart state synced via useSyncExternalStore
  const [cartItems, setCartItems] = useAppCart();
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // 4. Menu & Filter state
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietaryTag, setSelectedDietaryTag] = useState<DietaryTag | 'all'>('all');
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MenuItem | null>(null);
  const [footerCopied, setFooterCopied] = useState<boolean>(false);

  const menuSectionRef = useRef<HTMLDivElement>(null);
  const [settings] = useAppSettings();
  const [categories] = useAppCategories();
  const [menuItems] = useAppMenuItems();

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleScrollToMenu = () => {
    if (menuSectionRef.current) {
      menuSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Check if identical item with identical options already exists
      const existingIdx = prev.findIndex(p => 
        p.menuItem.id === item.menuItem.id &&
        p.selectedSize?.id === item.selectedSize?.id &&
        p.selectedSpice === item.selectedSpice &&
        p.isMeal === item.isMeal &&
        JSON.stringify(p.customizations) === JSON.stringify(item.customizations) &&
        (p.notes || '') === (item.notes || '') &&
        JSON.stringify(p.selectedAddons?.map(a => a.id).sort()) === JSON.stringify(item.selectedAddons?.map(a => a.id).sort())
      );

      if (existingIdx > -1) {
        const next = [...prev];
        const current = next[existingIdx];
        const newQty = current.quantity + item.quantity;
        next[existingIdx] = {
          ...current,
          quantity: newQty,
          totalPrice: current.unitPrice * newQty,
        };
        return next;
      }
      return [...prev, item];
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.unitPrice * newQuantity,
        };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalCartAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartItems]);

  const t = translations[currentLang];
  const isLight = theme === 'light';

  // Fast Filter for Menu Items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return menuItems.filter((item) => {
      // Category filter
      if (activeCategoryId !== 'all') {
        if (activeCategoryId === 'fries') {
          const isFries = item.categoryId === 'sides' || 
            item.name.ar.includes('فنكر') || 
            item.name.ar.includes('بطاطس') || 
            item.name.ar.includes('فرايز');
          if (!isFries) return false;
        } else if (item.categoryId !== activeCategoryId) {
          return false;
        }
      }

      // Dietary tag filter
      if (selectedDietaryTag !== 'all') {
        if (!item.dietaryTags?.includes(selectedDietaryTag)) {
          return false;
        }
      }

      // Live search query matching name, description & ingredients in all languages
      if (q) {
        const matchesAr = item.name.ar?.toLowerCase().includes(q) || item.description.ar?.toLowerCase().includes(q);
        const matchesEn = item.name.en?.toLowerCase().includes(q) || item.description.en?.toLowerCase().includes(q);
        const matchesKu = item.name.ku?.toLowerCase().includes(q) || item.description.ku?.toLowerCase().includes(q);
        const matchesTr = item.name.tr?.toLowerCase().includes(q) || item.description.tr?.toLowerCase().includes(q);
        const matchesFa = item.name.fa?.toLowerCase().includes(q) || item.description.fa?.toLowerCase().includes(q);
        const matchesUr = item.name.ur?.toLowerCase().includes(q) || item.description.ur?.toLowerCase().includes(q);
        const matchesIngr = item.ingredients.ar?.toLowerCase().includes(q) || item.ingredients.en?.toLowerCase().includes(q);

        if (!matchesAr && !matchesEn && !matchesKu && !matchesTr && !matchesFa && !matchesUr && !matchesIngr) {
          return false;
        }
      }

      return true;
    });
  }, [menuItems, activeCategoryId, selectedDietaryTag, searchQuery]);

  const whatsappClean = (settings.whatsappNumber || settings.phone).replace(/[^0-9]/g, '');

  const handleFooterShareWhatsApp = () => {
    let menuUrl = '';
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', currentLang);
        menuUrl = url.toString();
      } catch {
        menuUrl = window.location.href;
      }
    }
    const restaurantName = settings.name[currentLang] || settings.name.ar;
    const shareText = `🍗 *${restaurantName}*\n${t.quickActions.shareMenuText}\n\n📍 ${settings.address[currentLang] || settings.address.ar}\n\n📱 *رابط المنيو الرقمي:*\n${menuUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFooterCopyLink = async () => {
    let menuUrl = '';
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', currentLang);
        menuUrl = url.toString();
      } catch {
        menuUrl = window.location.href;
      }
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(menuUrl);
      } else {
        const el = document.createElement('textarea');
        el.value = menuUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setFooterCopied(true);
      setTimeout(() => setFooterCopied(false), 2000);
    } catch {}
  };

  const activeCategoryTitle = useMemo(() => {
    if (activeCategoryId === 'all') return currentLang === 'ar' ? 'جميع الوجبات والأطباق' : 'All Dishes & Meals';
    if (activeCategoryId === 'fries') return currentLang === 'ar' ? 'قسم البطاطس والفرايز 🍟' : 'Crispy Fries & Loaded Sides 🍟';
    const cat = categories.find((c) => c.id === activeCategoryId);
    return cat ? getCategoryName(cat, currentLang) : t.exploreCategories;
  }, [activeCategoryId, categories, currentLang, t]);

  const featuredDealItem = useMemo(() => {
    return menuItems.find((i) => i.featured || i.id === 'super-burger') || menuItems[0];
  }, [menuItems]);

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#FF5722] selection:text-white pb-20 lg:pb-0 transition-colors duration-300 ${
      isLight ? 'bg-[#FAF8F5] text-[#1A1816]' : 'bg-[#0E0D0B] text-[#F3F4F6]'
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        onToggleTheme={toggleTheme}
        cartItemsCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Welcome & Promo Banner */}
      <HeroBanner
        currentLang={currentLang}
        settings={settings}
        theme={theme}
        onScrollToMenu={handleScrollToMenu}
        onSelectDealItem={(deal) => setSelectedItemForDetail(deal)}
        featuredItem={featuredDealItem}
      />

      {/* Sticky Categories & Dietary Filter Bar */}
      <div ref={menuSectionRef}>
        <CategoryBar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
          selectedDietaryTag={selectedDietaryTag}
          onSelectDietaryTag={setSelectedDietaryTag}
          currentLang={currentLang}
          theme={theme}
        />
      </div>

      {/* Main Food Items Menu Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Active Category Title & Items Counter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2.5 ${
            isLight ? 'text-[#1A1816]' : 'text-white'
          }`}>
            <span className="w-2.5 h-6 bg-[#FF5722] rounded-full inline-block shrink-0" />
            <span>{activeCategoryTitle}</span>
          </h2>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
              isLight ? 'bg-white text-neutral-600 border-[#E2DDD5]' : 'text-gray-400 bg-[#1C1A17] border-[#332E27]'
            }`}>
              {currentLang === 'ar' ? `عرض ${filteredItems.length} صنف` : `${filteredItems.length} items`}
            </span>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#FF5722] font-bold hover:underline cursor-pointer ps-2"
              >
                {currentLang === 'ar' ? 'إلغاء البحث' : 'Clear search'}
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={`py-16 text-center rounded-3xl border p-8 max-w-md mx-auto space-y-3 ${
              isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#1C1A17] border-[#332E27]'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF5722] mx-auto flex items-center justify-center text-2xl">
              <Search className="w-8 h-8" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              {t.noResults}
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-gray-400'}`}>
              {t.noResultsDesc}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDietaryTag('all');
                setActiveCategoryId('all');
              }}
              className="px-5 py-2.5 rounded-full bg-[#FF5722] text-white text-xs font-bold shadow-md shadow-[#FF5722]/30 hover:bg-[#E64A19] cursor-pointer"
            >
              {t.resetFilters}
            </button>
          </motion.div>
        ) : (
          /* Food Cards Grid with Staggered Entrance Animation */
          <motion.div
            key={`grid-${activeCategoryId}-${selectedDietaryTag}-${searchQuery}-${theme}`}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.04,
                  delayChildren: 0.01,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
          >
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                currentLang={currentLang}
                settings={settings}
                theme={theme}
                onSelect={(selected) => setSelectedItemForDetail(selected)}
              />
            ))}
          </motion.div>
        )}

      </main>

      {/* Floating Bottom Cart WhatsApp Bar (when cart has items) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 lg:bottom-6 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none flex justify-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-lg pointer-events-auto bg-[#1C1A17] border border-[#FF5722]/50 text-white rounded-3xl p-3 sm:p-4 shadow-2xl shadow-[#FF5722]/20 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FFC107] flex items-center justify-center text-white font-black text-sm shadow-md">
                {totalCartCount}
              </div>
              <div>
                <span className="text-xs text-neutral-300 block">
                  {t.cart.total}: <strong className="text-white text-sm font-black">{formatPrice(totalCartAmount, settings.currency, currentLang)}</strong>
                </span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {t.cart.whatsappOrderNote}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="py-2.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition cursor-pointer"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>{t.cart.checkoutTitle}</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer Section */}
      <footer className={`border-t mt-16 text-xs py-12 transition-colors ${
        isLight ? 'bg-white border-[#E2DDD5] text-neutral-600' : 'bg-black border-[#332E27]/60 text-gray-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Share Menu Banner */}
          <div className={`p-6 rounded-3xl border shadow-md flex flex-col md:flex-row items-center justify-between gap-5 ${
            isLight 
              ? 'bg-[#FCFAF7] border-[#E2DDD5]' 
              : 'bg-gradient-to-r from-[#1C1A17] via-[#241F1A] to-[#1C1A17] border-[#FF5722]/30'
          }`}>
            <div className="flex items-center gap-4 text-center md:text-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-600/40 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className={`text-base font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  {t.quickActions.shareMenu}
                </h4>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-gray-300'}`}>
                  {t.quickActions.shareMenuText}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                id="footer-share-whatsapp-btn"
                onClick={handleFooterShareWhatsApp}
                className="px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{t.quickActions.shareMenuWhatsapp}</span>
              </button>

              <button
                id="footer-copy-link-btn"
                onClick={handleFooterCopyLink}
                className={`px-4 py-2.5 rounded-full border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isLight 
                    ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-[#E2DDD5]' 
                    : 'bg-[#1C1A17] hover:bg-[#332E27] text-[#FFC107] border-[#332E27]'
                }`}
              >
                {footerCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600">{t.quickActions.menuLinkCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#FF5722]" />
                    <span>{t.quickActions.copyMenuLink}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3-Column Footer Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            
            {/* Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`text-xl font-black ${isLight ? 'text-[#1A1816]' : 'text-white'}`}>
                  {currentLang === 'ar' ? 'سوبر' : 'SUPER'} <span className="text-[#FF5722]">{currentLang === 'ar' ? 'فرايد' : 'FRIED'}</span>
                </span>
              </div>
              <p className={`leading-relaxed font-normal text-xs ${isLight ? 'text-neutral-600' : 'text-gray-400'}`}>
                {currentLang === 'ar'
                  ? 'المطعم الأول المتخصص في تقديم أطباق البطاطس المقرمشة الذهبية المحملة بالصلصات المبتكرة والبرجر الطازج ووجبات الكنتاكي والستربس الشهية.'
                  : 'The premier crispy destination specializing in golden loaded Belgian fries, fresh chicken & beef burgers, Kentucky crispy buckets, and savory rizo dishes.'}
              </p>
            </div>

            {/* Working Hours & Branches */}
            <div className="space-y-2.5">
              <h4 className={`font-bold text-sm mb-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {currentLang === 'ar' ? 'ساعات العمل والفروع' : 'Hours & Locations'}
              </h4>
              <p className={`flex items-center gap-2 text-xs ${isLight ? 'text-neutral-700' : 'text-gray-300'}`}>
                <Clock className="w-4 h-4 text-[#FF5722] shrink-0" />
                <span>{settings.workingHours[currentLang] || settings.workingHours.ar}</span>
              </p>
              <div className="space-y-1.5 pt-1 text-xs">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#FF5722] mt-0.5 shrink-0" />
                  <span><strong>{currentLang === 'ar' ? 'بغداد:' : 'Baghdad:'}</strong> {settings.address[currentLang] || settings.address.ar}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#FF5722] mt-0.5 shrink-0" />
                  <span><strong>{currentLang === 'ar' ? 'السليمانية:' : 'Sulaymaniyah:'}</strong> {currentLang === 'ar' ? 'شارع سالم' : 'Salim Street'}</span>
                </p>
              </div>
            </div>

            {/* Social & Contact links */}
            <div className="space-y-3">
              <h4 className={`font-bold text-sm ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {currentLang === 'ar' ? 'تواصل معنا ولغات المنصة' : 'Contact & Languages'}
              </h4>
              
              <div className="flex items-center gap-2">
                <a 
                  href={`https://wa.me/${whatsappClean}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a 
                  href={`tel:${whatsappClean}`}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    isLight ? 'bg-white text-neutral-800 border-[#E2DDD5]' : 'bg-[#1C1A17] border-[#332E27] text-gray-300'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>{settings.phone}</span>
                </a>
              </div>

              {/* Language Switcher Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {[
                  { code: 'ar' as Language, short: 'AR', flag: '🇮🇶' },
                  { code: 'en' as Language, short: 'EN', flag: '🇬🇧' },
                  { code: 'ku' as Language, short: 'KU', flag: '☀️' },
                  { code: 'tr' as Language, short: 'TR', flag: '🇹🇷' },
                  { code: 'fa' as Language, short: 'FA', flag: '🇮🇷' },
                  { code: 'ur' as Language, short: 'UR', flag: '🇵🇰' },
                ].map((l) => (
                  <button
                    key={l.code}
                    id={`footer-lang-${l.code}`}
                    onClick={() => setCurrentLang(l.code)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                      currentLang === l.code
                        ? 'bg-[#FF5722] text-white shadow-xs'
                        : isLight 
                          ? 'bg-white text-neutral-700 hover:bg-neutral-100 border border-[#E2DDD5]' 
                          : 'bg-[#1C1A17] text-gray-400 hover:bg-[#332E27] hover:text-white border border-[#332E27]'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span className="font-mono font-bold tracking-wider">{l.short}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Copyright line */}
          <div className={`text-center pt-8 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-2 ${
            isLight ? 'border-[#EAE5DC] text-neutral-500' : 'border-[#332E27]/40 text-gray-500'
          }`}>
            <p>© {new Date().getFullYear()} مطاعم سوبر فرايد Super Fried. جميع الحقوق محفوظة</p>
            <p>الكاظمية - باب المراد • بغداد</p>
          </div>

        </div>
      </footer>

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t py-2.5 px-6 flex justify-around items-center backdrop-blur-lg ${
        isLight ? 'bg-white/95 border-[#E2DDD5] text-neutral-800' : 'bg-black/95 border-[#332E27]/80 text-white'
      }`}>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex flex-col items-center text-[#FF5722] cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-bold">{currentLang === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </button>

        <button 
          onClick={() => {
            setActiveCategoryId('fries');
            handleScrollToMenu();
          }} 
          className={`flex flex-col items-center cursor-pointer ${activeCategoryId === 'fries' ? 'text-[#FF5722]' : 'text-neutral-400'}`}
        >
          <Box className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-bold">{currentLang === 'ar' ? 'البطاطس' : 'Fries'}</span>
        </button>

        <button 
          onClick={() => setIsCartOpen(true)} 
          className="relative flex flex-col items-center text-[#FF5722] cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF5722] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              {totalCartCount}
            </span>
          )}
          <span className="text-[10px] mt-1 font-bold">{t.cart.title}</span>
        </button>

        <button 
          onClick={toggleTheme} 
          className="flex flex-col items-center text-neutral-400 hover:text-amber-500 cursor-pointer"
        >
          {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          <span className="text-[10px] mt-1 font-bold">{isLight ? 'الليلي' : 'النهاري'}</span>
        </button>

        <a 
          href={`https://wa.me/${whatsappClean}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex flex-col items-center text-emerald-500"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-bold">واتساب</span>
        </a>
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        key={selectedItemForDetail?.id || 'modal-none'}
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        currentLang={currentLang}
        settings={settings}
        theme={theme}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        settings={settings}
        theme={theme}
      />

    </div>
  );
}
