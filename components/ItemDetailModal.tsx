'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem, Language, RestaurantSettings, CartItem, Theme, ItemCustomization } from '@/types/menu';
import { translations, formatPrice, isRtl, generateBilingualWhatsAppMessage } from '@/lib/i18n';
import { getItemName, getItemDescription, getItemIngredients } from '@/lib/menuLocalization';
import { 
  X, 
  AlertTriangle, 
  ChefHat, 
  Check, 
  ShoppingBag,
  Send,
  Plus,
  Minus,
  Sparkles,
  Flame,
  Utensils
} from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  currentLang: Language;
  settings: RestaurantSettings;
  theme: Theme;
  onAddToCart: (cartItem: CartItem) => void;
}

function generateCartItemId(itemId: string): string {
  return `${itemId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  currentLang,
  settings,
  theme,
  onAddToCart,
}) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [selectedSpice, setSelectedSpice] = useState<'mild' | 'spicy' | 'super'>('mild');
  const [isMeal, setIsMeal] = useState<boolean>(false);
  const [isPlain, setIsPlain] = useState<boolean>(false);
  const [lettuce, setLettuce] = useState<'normal' | 'extra' | 'none'>('normal');
  const [sauce, setSauce] = useState<'normal' | 'extra' | 'none'>('normal');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [qty, setQty] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [showAddedNotice, setShowAddedNotice] = useState(false);

  if (!item) return null;

  const t = translations[currentLang];
  const rtl = isRtl(currentLang);
  const isLight = theme === 'light';

  const itemName = getItemName(item, currentLang);
  const itemArabicName = item.name.ar;
  const itemDesc = getItemDescription(item, currentLang);
  const itemIngr = getItemIngredients(item, currentLang);

  const availableSizes = item.sizes || [];
  const selectedSize = availableSizes[selectedSizeIndex];

  // Combo Meal upgrade price (e.g. 1500 IQD)
  const mealUpgradePrice = 1500;

  // Available sauces / addons list
  const availableAddonsList = [
    {
      id: 'sauce-cheese',
      name: {
        ar: 'جبن ذائب 🧀',
        en: 'Melted Cheese 🧀',
        ku: 'پەنیری تواوە 🧀',
        tr: 'Eritilmiş Peynir 🧀',
        fa: 'پنیر آب شده 🧀',
        ur: 'پگھلا ہوا پنیر 🧀',
      },
      price: 500,
    },
    {
      id: 'sauce-garlic',
      name: {
        ar: 'ثومية كريمية 🧄',
        en: 'Creamy Garlic 🧄',
        ku: 'سۆسی سیر 🧄',
        tr: 'Sarımsak Sos 🧄',
        fa: 'سس سیر کرمی 🧄',
        ur: 'گارلک ساس 🧄',
      },
      price: 500,
    },
    {
      id: 'sauce-bbq',
      name: {
        ar: 'باربيكيو مدخن 🍖',
        en: 'Smoky BBQ 🍖',
        ku: 'باربیکیۆ 🍖',
        tr: 'Barbekü Sos 🍖',
        fa: 'باربیکیو دودی 🍖',
        ur: 'باربی کیو ساس 🍖',
      },
      price: 500,
    },
    {
      id: 'sauce-honey',
      name: {
        ar: 'هني مسترد 🍯',
        en: 'Honey Mustard 🍯',
        ku: 'هەنگوین و خەردەل 🍯',
        tr: 'Ballı Hardal 🍯',
        fa: 'عسل و خردل 🍯',
        ur: 'ہنی مسٹرڈ 🍯',
      },
      price: 500,
    },
  ];

  // Calculate prices
  const basePrice = item.price;
  const sizeDelta = selectedSize ? selectedSize.priceDelta : 0;
  const mealDelta = isMeal ? mealUpgradePrice : 0;
  const addonsDelta = selectedAddonIds.length * 500;
  const unitPrice = basePrice + sizeDelta + mealDelta + addonsDelta;
  const totalPrice = unitPrice * qty;

  const toggleAddon = (addonId: string) => {
    if (selectedAddonIds.includes(addonId)) {
      setSelectedAddonIds(selectedAddonIds.filter((id) => id !== addonId));
    } else {
      setSelectedAddonIds([...selectedAddonIds, addonId]);
    }
  };

  const getCustomizationObject = (): ItemCustomization => {
    return {
      lettuce: isPlain ? 'none' : lettuce,
      sauce: isPlain ? 'none' : sauce,
      isPlain,
    };
  };

  const handleAddToCart = () => {
    const selectedAddons = availableAddonsList.filter(a => selectedAddonIds.includes(a.id));
    const cartEntry: CartItem = {
      id: generateCartItemId(item.id),
      menuItem: item,
      selectedSize: selectedSize || undefined,
      selectedSpice,
      isMeal,
      mealPriceDelta: isMeal ? mealUpgradePrice : 0,
      customizations: getCustomizationObject(),
      selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined,
      quantity: qty,
      unitPrice,
      totalPrice,
      notes: notes.trim() || undefined,
    };
    onAddToCart(cartEntry);
    setShowAddedNotice(true);
    setTimeout(() => {
      setShowAddedNotice(false);
      onClose();
    }, 400);
  };

  const handleQuickWhatsApp = () => {
    const selectedAddons = availableAddonsList.filter(a => selectedAddonIds.includes(a.id));
    const cartEntry: CartItem = {
      id: generateCartItemId(item.id),
      menuItem: item,
      selectedSize: selectedSize || undefined,
      selectedSpice,
      isMeal,
      mealPriceDelta: isMeal ? mealUpgradePrice : 0,
      customizations: getCustomizationObject(),
      selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined,
      quantity: qty,
      unitPrice,
      totalPrice,
      notes: notes.trim() || undefined,
    };

    const message = generateBilingualWhatsAppMessage({
      cartItems: [cartEntry],
      customerInfo: {
        customerName: '',
        orderType: 'takeaway',
        tableOrAddress: '',
        notes: notes.trim() || undefined,
      },
      settings,
      currentLang,
    });

    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[94vh] flex flex-col border ${
        isLight ? 'bg-[#FCFAF7] border-[#E2DDD5] text-[#1A1816]' : 'bg-[#1C1A17] border-[#332E27] text-white'
      }`}>
        
        {/* Modal Header Image */}
        <div className="relative h-48 sm:h-56 bg-gray-950 shrink-0">
          <Image
            src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'}
            alt={itemName}
            fill
            priority
            referrerPolicy="no-referrer"
            className="object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${
            isLight ? 'from-[#FCFAF7] via-transparent to-transparent' : 'from-[#1C1A17] via-transparent to-transparent'
          }`} />

          {/* Close button */}
          <button
            id="close-item-modal-btn"
            onClick={onClose}
            className={`absolute top-4 ${rtl ? 'left-4' : 'right-4'} bg-black/70 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer z-20 shadow-md`}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge */}
          <div className={`absolute bottom-4 ${rtl ? 'right-4' : 'left-4'} bg-[#FF5722] text-white text-xs font-black px-3 py-1 rounded-full shadow-md`}>
            {item.featured ? '⭐ توصية الشيف' : '🔥 سوبر فرايد'}
          </div>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-start divide-y divide-dashed divide-neutral-700/20">
          
          {/* Title & Base Price */}
          <div className="space-y-1.5 pb-2">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className={`text-xl font-black leading-tight ${isLight ? 'text-[#1A1816]' : 'text-white'}`}>
                  {itemName}
                </h3>
                {currentLang !== 'ar' && itemName !== itemArabicName && (
                  <p className="text-xs text-[#FF5722] font-bold mt-0.5">
                    ({itemArabicName})
                  </p>
                )}
              </div>
              <span className="text-lg sm:text-xl font-black text-[#FF5722] shrink-0">
                {formatPrice(item.price, settings.currency, currentLang)}
              </span>
            </div>
            <p className={`text-xs font-normal leading-relaxed ${
              isLight ? 'text-[#6B6458]' : 'text-gray-400'
            }`}>
              {itemDesc}
            </p>
          </div>

          {/* Upgrade to Combo Meal Section */}
          <div className="pt-3">
            <div 
              onClick={() => setIsMeal(!isMeal)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                isMeal 
                  ? 'bg-gradient-to-r from-[#FF5722]/15 to-[#FFC107]/15 border-[#FF5722] shadow-sm' 
                  : isLight 
                    ? 'bg-white border-[#E2DDD5] hover:border-neutral-400' 
                    : 'bg-black/30 border-[#332E27] hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                  isMeal ? 'bg-[#FF5722] text-white shadow-md' : 'bg-neutral-200 dark:bg-[#2A2620]'
                }`}>
                  🍟
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                    <span>{t.customization.makeItMeal}</span>
                  </h4>
                  <p className={`text-[11px] leading-tight ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    {t.customization.makeItMealDesc}
                  </p>
                </div>
              </div>

              <div className="text-end shrink-0">
                <span className="text-xs sm:text-sm font-black text-[#FF5722] block">
                  +{formatPrice(mealUpgradePrice, settings.currency, currentLang)}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${
                  isMeal ? 'bg-[#FF5722] text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {isMeal ? '✓ محدد' : '+ إضافة'}
                </span>
              </div>
            </div>
          </div>

          {/* Spice & Heat Level Option */}
          <div className="pt-3 space-y-1.5">
            <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-neutral-800' : 'text-gray-200'}`}>
              <Flame className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>{t.item.spicyLevel}:</span>
            </label>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => setSelectedSpice('mild')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedSpice === 'mild'
                    ? 'bg-[#FF5722]/15 border-[#FF5722] text-[#FF5722] ring-1 ring-[#FF5722]'
                    : isLight 
                      ? 'bg-white border-[#E2DDD5] text-neutral-700' 
                      : 'bg-black/40 border-[#332E27] text-gray-300'
                }`}
              >
                {t.item.mild}
              </button>

              <button
                type="button"
                onClick={() => setSelectedSpice('spicy')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedSpice === 'spicy'
                    ? 'bg-[#FF5722]/15 border-[#FF5722] text-[#FF5722] ring-1 ring-[#FF5722]'
                    : isLight 
                      ? 'bg-white border-[#E2DDD5] text-neutral-700' 
                      : 'bg-black/40 border-[#332E27] text-gray-300'
                }`}
              >
                {t.item.spicy}
              </button>

              <button
                type="button"
                onClick={() => setSelectedSpice('super')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedSpice === 'super'
                    ? 'bg-[#FF5722]/15 border-[#FF5722] text-[#FF5722] ring-1 ring-[#FF5722]'
                    : isLight 
                      ? 'bg-white border-[#E2DDD5] text-neutral-700' 
                      : 'bg-black/40 border-[#332E27] text-gray-300'
                }`}
              >
                {t.item.superSpicy}
              </button>
            </div>
          </div>

          {/* Plain & Toppings Customization (Lettuce, Sauce, Plain) */}
          <div className="pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-extrabold flex items-center gap-1.5 ${isLight ? 'text-neutral-800' : 'text-gray-200'}`}>
                <Utensils className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>{t.customization.title}</span>
              </label>

              {/* Plain Toggle Button */}
              <button
                type="button"
                onClick={() => setIsPlain(!isPlain)}
                className={`text-xs font-bold px-3 py-1 rounded-full border transition cursor-pointer flex items-center gap-1.5 ${
                  isPlain 
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm' 
                    : isLight 
                      ? 'bg-white border-[#E2DDD5] text-neutral-700 hover:border-neutral-400' 
                      : 'bg-black/40 border-[#332E27] text-neutral-300'
                }`}
              >
                <span>{t.customization.plain}</span>
                {isPlain && <Check className="w-3 h-3 text-white" />}
              </button>
            </div>

            {isPlain ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-300 flex items-center gap-2">
                <span>🥪</span>
                <span>{t.customization.plainDesc}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Lettuce customizer */}
                <div className={`p-2.5 rounded-2xl border ${isLight ? 'bg-white border-[#E2DDD5]' : 'bg-black/30 border-[#332E27]'}`}>
                  <span className="text-[11px] font-extrabold block mb-1.5 opacity-90">{t.customization.lettuce}</span>
                  <div className="grid grid-cols-3 gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setLettuce('normal')}
                      className={`py-1.5 px-1 rounded-lg font-bold transition text-center ${
                        lettuce === 'normal' 
                          ? 'bg-[#FF5722] text-white shadow-xs' 
                          : isLight ? 'bg-neutral-100 text-neutral-700' : 'bg-[#25221C] text-neutral-300'
                      }`}
                    >
                      عادي
                    </button>
                    <button
                      type="button"
                      onClick={() => setLettuce('extra')}
                      className={`py-1.5 px-1 rounded-lg font-bold transition text-center ${
                        lettuce === 'extra' 
                          ? 'bg-[#FF5722] text-white shadow-xs' 
                          : isLight ? 'bg-neutral-100 text-neutral-700' : 'bg-[#25221C] text-neutral-300'
                      }`}
                    >
                      زيادة 🥬
                    </button>
                    <button
                      type="button"
                      onClick={() => setLettuce('none')}
                      className={`py-1.5 px-1 rounded-lg font-bold transition text-center ${
                        lettuce === 'none' 
                          ? 'bg-[#FF5722] text-white shadow-xs' 
                          : isLight ? 'bg-neutral-100 text-neutral-700' : 'bg-[#25221C] text-neutral-300'
                      }`}
                    >
                      بدون 🚫
                    </button>
                  </div>
                </div>

                {/* Sauce customizer */}
                <div className={`p-2.5 rounded-2xl border ${isLight ? 'bg-white border-[#E2DDD5]' : 'bg-black/30 border-[#332E27]'}`}>
                  <span className="text-[11px] font-extrabold block mb-1.5 opacity-90">{t.customization.sauce}</span>
                  <div className="grid grid-cols-3 gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSauce('normal')}
                      className={`py-1.5 px-1 rounded-lg font-bold transition text-center ${
                        sauce === 'normal' 
                          ? 'bg-[#FF5722] text-white shadow-xs' 
                          : isLight ? 'bg-neutral-100 text-neutral-700' : 'bg-[#25221C] text-neutral-300'
                      }`}
                    >
                      عادي
                    </button>
                    <button
                      type="button"
                      onClick={() => setSauce('extra')}
                      className={`py-1.5 px-1 rounded-lg font-bold transition text-center ${
                        sauce === 'extra' 
                          ? 'bg-[#FF5722] text-white shadow-xs' 
                          : isLight ? 'bg-neutral-100 text-neutral-700' : 'bg-[#25221C] text-neutral-300'
                      }`}
                    >
                      زيادة 🥣
                    </button>
                    <button
                      type="button"
                      onClick={() => setSauce('none')}
                      className={`py-1.5 px-1 rounded-lg font-bold transition text-center ${
                        sauce === 'none' 
                          ? 'bg-[#FF5722] text-white shadow-xs' 
                          : isLight ? 'bg-neutral-100 text-neutral-700' : 'bg-[#25221C] text-neutral-300'
                      }`}
                    >
                      بدون 🚫
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Meal Sizes / Portions (if available) */}
          {availableSizes.length > 1 && (
            <div className="pt-3 space-y-1.5">
              <label className={`text-xs font-bold block ${isLight ? 'text-neutral-800' : 'text-gray-200'}`}>
                {t.item.portionSize}:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableSizes.map((size, idx) => {
                  const sizeName = size.name[currentLang] || size.name.ar;
                  const isSelected = selectedSizeIndex === idx;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                        isSelected
                          ? 'bg-[#FF5722]/15 border-[#FF5722] text-[#FF5722] ring-1 ring-[#FF5722]'
                          : isLight 
                            ? 'bg-white border-[#E2DDD5] text-neutral-700 hover:border-neutral-400' 
                            : 'bg-black/40 border-[#332E27] text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <span className="truncate">{sizeName}</span>
                      <span className="text-[#FF5722] text-[11px] font-extrabold shrink-0">
                        {size.priceDelta > 0 ? `+${size.priceDelta.toLocaleString()} د.ع` : 'الأساسي'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-on Sauces */}
          <div className="pt-3 space-y-1.5">
            <label className={`text-xs font-bold block ${isLight ? 'text-neutral-800' : 'text-gray-200'}`}>
              {t.item.extraAddons} (+500 د.ع):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableAddonsList.map((addonSauce) => {
                const isChecked = selectedAddonIds.includes(addonSauce.id);
                const sName = addonSauce.name[currentLang] || addonSauce.name.ar;
                return (
                  <div
                    key={addonSauce.id}
                    onClick={() => toggleAddon(addonSauce.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                      isChecked
                        ? 'bg-[#FF5722]/15 border-[#FF5722] ring-1 ring-[#FF5722]'
                        : isLight 
                          ? 'bg-white border-[#E2DDD5] hover:border-neutral-400' 
                          : 'bg-black/30 border-[#332E27]/70 hover:border-[#FFC107]/40'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${
                        isChecked ? 'bg-[#FF5722] border-[#FF5722]' : 'border-neutral-400'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                      </span>
                      <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>{sName}</span>
                    </span>
                    <span className="text-[#FF5722] font-bold text-[11px]">+500 د.ع</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes input */}
          <div className="pt-3 space-y-1">
            <label className={`text-xs font-bold block ${isLight ? 'text-neutral-800' : 'text-gray-200'}`}>
              {t.cart.notes}:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.cart.notesPlaceholder}
              className={`w-full text-xs px-3.5 py-2 rounded-xl border outline-none ${
                isLight 
                  ? 'bg-white border-[#D8D2C5] focus:border-[#FF5722]' 
                  : 'bg-black/40 border-[#38322A] focus:border-[#FF5722]'
              }`}
            />
          </div>

          {/* Ingredients Recipe Section */}
          {itemIngr && (
            <div className={`p-3 rounded-2xl border space-y-1 ${
              isLight ? 'bg-white border-[#E2DDD5]' : 'bg-black/40 border-[#332E27]/60'
            }`}>
              <span className="text-[11px] font-bold text-[#FF5722] uppercase tracking-wider block flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5" />
                {t.item.ingredients}
              </span>
              <p className={`text-xs leading-normal font-light ${isLight ? 'text-neutral-700' : 'text-gray-300'}`}>
                {itemIngr}
              </p>
            </div>
          )}

          {/* Allergens Notice */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/25 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">{t.allergens.title}</span>
                <span className={isLight ? 'text-neutral-700' : 'text-gray-300'}>
                  {item.allergens.map((alg) => t.allergens[alg as keyof typeof t.allergens] || alg).join('، ')}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Add to Cart & Quick WhatsApp */}
        <div className={`p-4 border-t space-y-2.5 ${
          isLight ? 'bg-white border-[#EAE5DC]' : 'bg-[#141311] border-[#2A2620]'
        }`}>
          {/* Top row: Quantity & Total Price */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center rounded-full border p-1 ${
              isLight ? 'bg-neutral-100 border-[#E2DDD5]' : 'bg-black/60 border-[#332E27]'
            }`}>
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                  isLight ? 'hover:bg-white text-neutral-800' : 'hover:bg-[#2A2620] text-white'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-black">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                  isLight ? 'hover:bg-white text-neutral-800' : 'hover:bg-[#2A2620] text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-end">
              <span className={`text-[10px] block font-medium ${isLight ? 'text-[#8A8174]' : 'text-neutral-400'}`}>
                {t.price}
              </span>
              <span className="text-lg font-black text-[#FF5722]">
                {formatPrice(totalPrice, settings.currency, currentLang)}
              </span>
            </div>
          </div>

          {/* Action Buttons: Add to Cart and Order on WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="modal-add-to-cart-btn"
              onClick={handleAddToCart}
              className="py-3 px-3 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs sm:text-sm shadow-md shadow-[#FF5722]/20 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{showAddedNotice ? t.cart.addedToCart : t.cart.addToCart}</span>
            </button>

            <button
              type="button"
              id="modal-quick-whatsapp-btn"
              onClick={handleQuickWhatsApp}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white font-black text-xs sm:text-sm shadow-md shadow-[#25D366]/20 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>{t.cart.orderNow}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

