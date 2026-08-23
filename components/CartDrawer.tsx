'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  ShoppingBag, 
  MapPin, 
  User, 
  Phone, 
  FileText, 
  Utensils, 
  CheckCircle2,
  AlertCircle,
  LocateFixed,
  Loader2,
  Check
} from 'lucide-react';
import { CartItem, Language, RestaurantSettings, OrderCustomerInfo, Theme } from '@/types/menu';
import { translations, formatPrice, isRtl, generateBilingualWhatsAppMessage } from '@/lib/i18n';
import { getItemName } from '@/lib/menuLocalization';
import { setAppLanguage, addAppOrder } from '@/lib/clientStores';
import { SavedOrder } from '@/types/menu';

const languagesList: { code: Language; short: string; flag: string; name: string }[] = [
  { code: 'ar', short: 'AR', flag: '🇮🇶', name: 'العربية' },
  { code: 'en', short: 'EN', flag: '🇬🇧', name: 'English' },
  { code: 'ku', short: 'KU', flag: '☀️', name: 'کوردی' },
  { code: 'tr', short: 'TR', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'fa', short: 'FA', flag: '🇮🇷', name: 'فارسی' },
  { code: 'ur', short: 'UR', flag: '🇵🇰', name: 'اردو' },
];

function createSavedOrder(
  customerInfo: OrderCustomerInfo, 
  cartItems: CartItem[], 
  totalAmount: number, 
  totalQuantity: number, 
  currentLang: Language
): SavedOrder {
  const ts = Date.now();
  const rnd = Math.floor(Math.random() * 9000);
  return {
    id: `ord-${ts}-${rnd}`,
    orderNumber: `#SF-${1000 + (rnd % 9000)}`,
    createdAt: new Date(ts).toISOString(),
    customerInfo: { ...customerInfo },
    items: [...cartItems],
    totalAmount,
    totalQuantity,
    status: 'new',
    language: currentLang,
  };
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  currentLang: Language;
  onLanguageChange?: (lang: Language) => void;
  settings: RestaurantSettings;
  theme: Theme;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentLang,
  onLanguageChange,
  settings,
  theme,
}) => {
  const t = translations[currentLang];
  const rtl = isRtl(currentLang);
  const isLight = theme === 'light';

  const [customerInfo, setCustomerInfo] = useState<OrderCustomerInfo>({
    customerName: '',
    customerPhone: '',
    orderType: 'dine_in',
    tableOrAddress: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<{ name?: boolean; location?: boolean }>({});
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationSuccess, setLocationSuccess] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleGetCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError(t.cart.locationError);
      return;
    }

    setIsLocating(true);
    setLocationSuccess(false);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const mapUrl = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
        
        setCustomerInfo(prev => {
          const existing = prev.tableOrAddress.trim();
          const newAddress = existing
            ? `${existing} (📍 ${mapUrl})`
            : `📍 موقعي GPS: ${mapUrl}`;
          return {
            ...prev,
            tableOrAddress: newAddress,
          };
        });

        if (formErrors.location) {
          setFormErrors(prev => ({ ...prev, location: false }));
        }
        setLocationSuccess(true);
        setTimeout(() => setLocationSuccess(false), 5000);
      },
      (err) => {
        setIsLocating(false);
        setLocationError(t.cart.locationError);
        setTimeout(() => setLocationError(null), 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  const handleSendWhatsApp = () => {
    // Validation: Name is ONLY required for Takeaway and Delivery (NOT for Dine-in)
    const errors: { name?: boolean; location?: boolean } = {};
    if (customerInfo.orderType !== 'dine_in' && !customerInfo.customerName.trim()) {
      errors.name = true;
    }
    if (!customerInfo.tableOrAddress.trim()) {
      errors.location = true;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    // Record order in local store for Dashboard Panel (DPANAL)
    try {
      const savedOrder = createSavedOrder(
        customerInfo,
        cartItems,
        totalAmount,
        totalItemsCount,
        currentLang
      );
      addAppOrder(savedOrder);
    } catch {}

    // Generate bilingual message
    const message = generateBilingualWhatsAppMessage({
      cartItems,
      customerInfo,
      settings,
      currentLang,
    });

    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: rtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: rtl ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className={`relative w-full max-w-lg z-10 h-full flex flex-col shadow-2xl ${
              isLight 
                ? 'bg-[#FCFAF7] text-[#1A1816] border-l border-[#E2DDD5]' 
                : 'bg-[#151412] text-[#F3F4F6] border-l border-[#332E27]'
            }`}
          >
            {/* Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
              isLight ? 'border-[#EAE5DC] bg-white' : 'border-[#26221C] bg-[#1C1A17]'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#FFC107] flex items-center justify-center text-white shadow-md">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    {t.cart.title}
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF5722]/20 text-[#FF5722] font-extrabold">
                      {totalItemsCount}
                    </span>
                  </h2>
                  <p className={`text-xs ${isLight ? 'text-[#7A7265]' : 'text-neutral-400'}`}>
                    {t.cart.whatsappOrderNote}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button
                    onClick={onClearCart}
                    title={t.cart.clearCart}
                    className={`p-2 rounded-xl transition-colors ${
                      isLight 
                        ? 'hover:bg-red-50 text-neutral-400 hover:text-red-600' 
                        : 'hover:bg-red-900/20 text-neutral-400 hover:text-red-400'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-colors ${
                    isLight 
                      ? 'hover:bg-neutral-100 text-neutral-600' 
                      : 'hover:bg-[#2A2620] text-neutral-300'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col justify-between p-6 text-center">
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    isLight ? 'bg-orange-50 text-[#FF5722]' : 'bg-[#221F1B] text-[#FF5722]'
                  }`}>
                    <ShoppingBag className="w-10 h-10 opacity-70" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h3 className="text-lg font-bold">{t.cart.cartEmpty}</h3>
                    <p className={`text-sm ${isLight ? 'text-[#7A7265]' : 'text-neutral-400'}`}>
                      {t.cart.cartEmptyDesc}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 py-2.5 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    {t.viewMenu}
                  </button>
                </div>

                {/* Language Switcher under empty cart order box */}
                <div className={`pt-4 border-t flex flex-col items-center gap-2 ${
                  isLight ? 'border-[#EAE5DC]' : 'border-[#2D2821]'
                }`}>
                  <div className="flex items-center justify-between w-full px-1">
                    <span className="text-[11px] font-bold opacity-60 flex items-center gap-1">
                      🌐 {currentLang === 'ar' ? 'اختر اللغة' : 'Select Language'}
                    </span>
                    <span className="text-[10px] font-mono opacity-50 uppercase">
                      {currentLang}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 w-full">
                    {languagesList.map((lang) => {
                      const isSelected = currentLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          id={`empty-drawer-lang-${lang.code}`}
                          onClick={() => {
                            if (onLanguageChange) {
                              onLanguageChange(lang.code);
                            } else {
                              setAppLanguage(lang.code);
                            }
                          }}
                          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all cursor-pointer select-none active:scale-95 ${
                            isSelected
                              ? 'bg-gradient-to-b from-[#FF5722] to-[#E64A19] text-white shadow-md shadow-[#FF5722]/30 ring-1 ring-[#FF5722]'
                              : isLight
                                ? 'bg-[#F4EFE6] hover:bg-[#EAE4D7] text-neutral-800 border border-[#E2DDD5]'
                                : 'bg-[#26221C] hover:bg-[#332E27] text-neutral-200 border border-[#38322A]'
                          }`}
                          title={`${lang.name} (${lang.short})`}
                        >
                          <span className="text-base leading-none mb-0.5">{lang.flag}</span>
                          <span className="text-[10px] font-black tracking-wider uppercase">{lang.short}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 divide-y divide-dashed divide-neutral-700/20">
                {/* List of Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const itemName = getItemName(item.menuItem, currentLang);
                    const itemArabicName = item.menuItem.name.ar;
                    const showArabicBeside = currentLang !== 'ar' && itemName !== itemArabicName;

                    return (
                      <div
                        key={item.id}
                        className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                          isLight 
                            ? 'bg-white border-[#E7E2D8] shadow-xs' 
                            : 'bg-[#1C1A17] border-[#332E27]'
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          {/* Image */}
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-black/20">
                            <Image
                              src={item.menuItem.image}
                              alt={itemName}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-sm sm:text-base leading-tight truncate">
                                  {itemName}
                                </h4>
                                {showArabicBeside && (
                                  <p className="text-xs text-[#FF5722] font-semibold">
                                    ({itemArabicName})
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className={`text-neutral-400 hover:text-red-500 transition-colors p-1 ${
                                  isLight ? 'hover:bg-red-50' : 'hover:bg-red-900/20'
                                } rounded-lg`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Modifiers (Size, Meal, Spice, Customizations, Sauces) */}
                            <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                              {item.isMeal && (
                                <span className="px-2 py-0.5 rounded-md font-bold bg-[#FFC107]/20 text-[#FF9800] dark:text-[#FFC107] border border-[#FFC107]/30">
                                  🍟 {t.customization.makeItMeal}
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className={`px-2 py-0.5 rounded-md font-medium ${
                                  isLight ? 'bg-neutral-100 text-neutral-700' : 'bg-[#2A2620] text-neutral-300'
                                }`}>
                                  {item.selectedSize.name[currentLang] || item.selectedSize.name.ar}
                                </span>
                              )}
                              {item.selectedSpice && (
                                <span className="px-2 py-0.5 rounded-md font-medium bg-[#FF5722]/15 text-[#FF5722]">
                                  {item.selectedSpice === 'mild' && t.item.mild}
                                  {item.selectedSpice === 'spicy' && t.item.spicy}
                                  {item.selectedSpice === 'super' && t.item.superSpicy}
                                </span>
                              )}
                              {item.customizations?.isPlain ? (
                                <span className="px-2 py-0.5 rounded-md font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                  🥪 {t.customization.plain}
                                </span>
                              ) : (
                                <>
                                  {item.customizations?.lettuce === 'extra' && (
                                    <span className="px-2 py-0.5 rounded-md font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                      +{t.customization.lettuceExtra}
                                    </span>
                                  )}
                                  {item.customizations?.lettuce === 'none' && (
                                    <span className="px-2 py-0.5 rounded-md font-medium bg-red-500/15 text-red-600 dark:text-red-400">
                                      {t.customization.lettuceNone}
                                    </span>
                                  )}
                                  {item.customizations?.sauce === 'extra' && (
                                    <span className="px-2 py-0.5 rounded-md font-medium bg-orange-500/15 text-orange-600 dark:text-orange-400">
                                      +{t.customization.sauceExtra}
                                    </span>
                                  )}
                                  {item.customizations?.sauce === 'none' && (
                                    <span className="px-2 py-0.5 rounded-md font-medium bg-red-500/15 text-red-600 dark:text-red-400">
                                      {t.customization.sauceNone}
                                    </span>
                                  )}
                                </>
                              )}
                              {item.selectedAddons && item.selectedAddons.map((addon) => (
                                <span 
                                  key={addon.id}
                                  className={`px-2 py-0.5 rounded-md font-medium ${
                                    isLight ? 'bg-amber-50 text-amber-800' : 'bg-amber-900/30 text-amber-300'
                                  }`}
                                >
                                  +{addon.name[currentLang] || addon.name.ar}
                                </span>
                              ))}
                            </div>

                            {/* Item Notes */}
                            {item.notes && (
                              <p className="mt-1 text-xs italic text-neutral-400 truncate">
                                &quot;{item.notes}&quot;
                              </p>
                            )}

                            {/* Price & Quantity Bar */}
                            <div className="mt-3 flex items-center justify-between">
                              <span className="font-extrabold text-sm sm:text-base text-[#FF5722]">
                                {formatPrice(item.totalPrice, settings.currency, currentLang)}
                              </span>

                              {/* Quantity Controls */}
                              <div className={`flex items-center gap-1.5 rounded-xl border p-1 ${
                                isLight ? 'bg-neutral-100 border-[#E2DDD5]' : 'bg-[#151412] border-[#332E27]'
                              }`}>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                    isLight ? 'hover:bg-white text-neutral-700' : 'hover:bg-[#2A2620] text-neutral-200'
                                  }`}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-black">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                    isLight ? 'hover:bg-white text-neutral-700' : 'hover:bg-[#2A2620] text-neutral-200'
                                  }`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Customer & Order Form */}
                <div className="pt-4 space-y-4">
                  <h3 className="text-sm font-extrabold flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF5722]" />
                    {t.cart.checkoutTitle}
                  </h3>

                  {/* Order Type Tabs */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold block opacity-80">
                      {t.cart.orderType}
                    </label>
                    <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-2xl border ${
                      isLight ? 'bg-neutral-100 border-[#E2DDD5]' : 'bg-[#1A1815] border-[#332E27]'
                    }`}>
                      {(['dine_in', 'takeaway', 'delivery'] as const).map((type) => {
                        const isSelected = customerInfo.orderType === type;
                        const label = type === 'dine_in' 
                          ? t.cart.dineIn 
                          : type === 'takeaway' 
                            ? t.cart.takeaway 
                            : t.cart.delivery;

                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setCustomerInfo(prev => ({ ...prev, orderType: type }));
                              if (type === 'dine_in') {
                                setFormErrors(prev => ({ ...prev, name: false }));
                              }
                            }}
                            className={`py-2 px-1 text-xs rounded-xl font-bold transition-all text-center ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white shadow-sm'
                                : isLight 
                                  ? 'text-neutral-700 hover:bg-white/60' 
                                  : 'text-neutral-300 hover:bg-[#25221C]'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Name (Only for Takeaway & Delivery - Removed from Dine-in as requested) */}
                  {customerInfo.orderType !== 'dine_in' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold block opacity-80">
                        {t.cart.customerName} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customerInfo.customerName}
                          onChange={(e) => {
                            setCustomerInfo(prev => ({ ...prev, customerName: e.target.value }));
                            if (formErrors.name) setFormErrors(prev => ({ ...prev, name: false }));
                          }}
                          placeholder={t.cart.customerNamePlaceholder}
                          className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border transition-all outline-none ${
                            formErrors.name 
                              ? 'border-red-500 ring-2 ring-red-500/20' 
                              : isLight 
                                ? 'bg-white border-[#D8D2C5] focus:border-[#FF5722]' 
                                : 'bg-[#1A1815] border-[#38322A] focus:border-[#FF5722]'
                          }`}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3" />
                          الرجاء إدخال اسم الزبون
                        </p>
                      )}
                    </div>
                  )}

                  {/* Table Number or Delivery Address */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-bold block opacity-80">
                        {customerInfo.orderType === 'dine_in' 
                          ? (t.cart.tableNumber || 'رقم الطاولة في الصالة')
                          : customerInfo.orderType === 'delivery' 
                            ? (t.cart.deliveryAddress || 'عنوان التوصيل الكامل')
                            : (t.cart.pickupDetails || 'موقع وتفاصيل الاستلام')} <span className="text-red-500">*</span>
                      </label>

                      {/* GPS Current Location button for Delivery */}
                      {customerInfo.orderType === 'delivery' && (
                        <button
                          type="button"
                          onClick={handleGetCurrentLocation}
                          disabled={isLocating}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                            locationSuccess
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-sm'
                              : isLocating
                                ? 'bg-[#FF5722]/15 border-[#FF5722]/40 text-[#FF5722] animate-pulse'
                                : isLight
                                  ? 'bg-neutral-100 hover:bg-[#FF5722]/10 border-neutral-300 hover:border-[#FF5722] text-neutral-800 hover:text-[#FF5722]'
                                  : 'bg-[#26221C] hover:bg-[#FF5722]/20 border-neutral-700 hover:border-[#FF5722] text-neutral-200 hover:text-[#FF5722]'
                          }`}
                          title={t.cart.useCurrentLocation}
                        >
                          {isLocating ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF5722]" />
                              <span>{t.cart.locating}</span>
                            </>
                          ) : locationSuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{t.cart.locationDetected}</span>
                            </>
                          ) : (
                            <>
                              <LocateFixed className="w-3.5 h-3.5 text-[#FF5722]" />
                              <span>{t.cart.useCurrentLocation}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={customerInfo.tableOrAddress}
                        onChange={(e) => {
                          setCustomerInfo(prev => ({ ...prev, tableOrAddress: e.target.value }));
                          if (formErrors.location) setFormErrors(prev => ({ ...prev, location: false }));
                        }}
                        placeholder={
                          customerInfo.orderType === 'dine_in' 
                            ? t.cart.tableNumberPlaceholder 
                            : customerInfo.orderType === 'delivery' 
                              ? t.cart.deliveryAddressPlaceholder 
                              : t.cart.pickupDetailsPlaceholder
                        }
                        className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border transition-all outline-none ${
                          formErrors.location 
                            ? 'border-red-500 ring-2 ring-red-500/20' 
                            : isLight 
                              ? 'bg-white border-[#D8D2C5] focus:border-[#FF5722]' 
                              : 'bg-[#1A1815] border-[#38322A] focus:border-[#FF5722]'
                        }`}
                      />
                    </div>

                    {locationError && (
                      <p className="text-[11px] text-amber-500 flex items-center gap-1 font-medium mt-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {locationError}
                      </p>
                    )}

                    {formErrors.location && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {customerInfo.orderType === 'dine_in' 
                          ? 'الرجاء تحديد رقم الطاولة' 
                          : customerInfo.orderType === 'delivery'
                            ? 'الرجاء إدخال عنوان التوصيل'
                            : 'الرجاء تحديد تفاصيل الاستلام'}
                      </p>
                    )}
                  </div>

                  {/* Phone (Optional - Only shown for Takeaway & Delivery, removed from Dine-in) */}
                  {customerInfo.orderType !== 'dine_in' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold block opacity-80">
                        {t.cart.customerPhone}
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.customerPhone || ''}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, customerPhone: e.target.value }))}
                        placeholder={t.cart.customerPhonePlaceholder}
                        className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border transition-all outline-none ${
                          isLight 
                            ? 'bg-white border-[#D8D2C5] focus:border-[#FF5722]' 
                            : 'bg-[#1A1815] border-[#38322A] focus:border-[#FF5722]'
                        }`}
                      />
                    </div>
                  )}

                  {/* Order Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold block opacity-80">
                      {t.cart.notes}
                    </label>
                    <textarea
                      rows={2}
                      value={customerInfo.notes || ''}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder={t.cart.notesPlaceholder}
                      className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border transition-all outline-none resize-none ${
                        isLight 
                          ? 'bg-white border-[#D8D2C5] focus:border-[#FF5722]' 
                          : 'bg-[#1A1815] border-[#38322A] focus:border-[#FF5722]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer / Total & Checkout CTA */}
            {cartItems.length > 0 && (
              <div className={`p-4 sm:p-5 border-t space-y-3 ${
                isLight ? 'border-[#EAE5DC] bg-white' : 'border-[#26221C] bg-[#1C1A17]'
              }`}>
                {/* Total Line */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isLight ? 'text-[#7A7265]' : 'text-neutral-400'}`}>
                    {t.cart.total}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#FF5722]">
                    {formatPrice(totalAmount, settings.currency, currentLang)}
                  </span>
                </div>

                {/* Primary WhatsApp Action Button */}
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#25D366]/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98]"
                >
                  <Send className="w-5 h-5 fill-current" />
                  {t.cart.sendViaWhatsApp}
                </button>

                <p className="text-[11px] text-center text-neutral-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  ترجمة تلقائية للطلبات بالعربية للطباعة والإعداد بالمطبخ
                </p>

                {/* Language Switcher under Order Box */}
                <div className={`pt-3 border-t flex flex-col items-center gap-2 ${
                  isLight ? 'border-[#EAE5DC]' : 'border-[#2D2821]'
                }`}>
                  <div className="flex items-center justify-between w-full px-1">
                    <span className="text-[11px] font-bold opacity-60 flex items-center gap-1">
                      🌐 {currentLang === 'ar' ? 'اختر اللغة' : 'Select Language'}
                    </span>
                    <span className="text-[10px] font-mono opacity-50 uppercase">
                      {currentLang}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 w-full">
                    {languagesList.map((lang) => {
                      const isSelected = currentLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          id={`drawer-lang-${lang.code}`}
                          onClick={() => {
                            if (onLanguageChange) {
                              onLanguageChange(lang.code);
                            } else {
                              setAppLanguage(lang.code);
                            }
                          }}
                          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all cursor-pointer select-none active:scale-95 ${
                            isSelected
                              ? 'bg-gradient-to-b from-[#FF5722] to-[#E64A19] text-white shadow-md shadow-[#FF5722]/30 ring-1 ring-[#FF5722]'
                              : isLight
                                ? 'bg-[#F4EFE6] hover:bg-[#EAE4D7] text-neutral-800 border border-[#E2DDD5]'
                                : 'bg-[#26221C] hover:bg-[#332E27] text-neutral-200 border border-[#38322A]'
                          }`}
                          title={`${lang.name} (${lang.short})`}
                        >
                          <span className="text-base leading-none mb-0.5">{lang.flag}</span>
                          <span className="text-[10px] font-black tracking-wider uppercase">{lang.short}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
