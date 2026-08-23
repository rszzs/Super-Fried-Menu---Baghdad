'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { MenuItem, Language, RestaurantSettings, Theme } from '@/types/menu';
import { translations, formatPrice } from '@/lib/i18n';
import { getItemName, getItemDescription } from '@/lib/menuLocalization';
import { Star, SlidersHorizontal, Eye, Ban, ShoppingBag } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  currentLang: Language;
  settings: RestaurantSettings;
  theme: Theme;
  onSelect: (item: MenuItem) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 280,
      damping: 22,
    },
  },
};

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  currentLang,
  settings,
  theme,
  onSelect,
}) => {
  const t = translations[currentLang];
  const isAvailable = item.isAvailable !== false;
  const isLight = theme === 'light';

  const itemName = getItemName(item, currentLang);
  const itemDesc = getItemDescription(item, currentLang);

  // Determine badge text
  let badgeText = item.featured ? (currentLang === 'ar' ? 'توصية الشيف ⭐' : "Chef's Pick ⭐") : '';
  if (!badgeText && item.dietaryTags?.includes('bestseller')) {
    badgeText = currentLang === 'ar' ? 'الأكثر طلباً 🔥' : 'Bestseller 🔥';
  } else if (!badgeText && item.dietaryTags?.includes('spicy')) {
    badgeText = currentLang === 'ar' ? 'سبايسي 🌶️' : 'Spicy 🌶️';
  } else if (!badgeText && item.dietaryTags?.includes('halal')) {
    badgeText = currentLang === 'ar' ? 'حلال 100%' : '100% Halal';
  } else if (!badgeText) {
    badgeText = currentLang === 'ar' ? 'سوبر مميز ✨' : 'Special ✨';
  }

  const hasUpgrade = item.sizes && item.sizes.length > 1;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      id={`menu-item-card-${item.id}`}
      onClick={() => onSelect(item)}
      className={`rounded-3xl overflow-hidden shadow-md transition-all flex flex-col group cursor-pointer border ${
        isLight 
          ? 'bg-white border-[#E2DDD5] hover:border-[#FF5722] text-[#1A1816]' 
          : 'bg-[#1C1A17] border-[#332E27]/80 hover:border-[#FF5722]/70 text-white'
      } ${!isAvailable ? 'opacity-70 grayscale-[40%]' : ''}`}
    >
      {/* Food Image with Floating Badges */}
      <div className="relative h-48 overflow-hidden bg-black/40">
        <Image
          src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
          alt={itemName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          referrerPolicy="no-referrer"
          className="object-cover group-hover:scale-108 transition duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 end-3 z-10 flex flex-col items-end gap-1">
          {!isAvailable ? (
            <div className="bg-red-950/80 backdrop-blur-md text-red-300 font-bold text-xs px-2.5 py-1 rounded-full border border-red-700/50 flex items-center gap-1 shadow-sm">
              <Ban className="w-3 h-3" />
              <span>{t.item.outOfStock}</span>
            </div>
          ) : (
            <div className="bg-black/75 backdrop-blur-md text-[#FFC107] font-black text-xs px-2.5 py-1 rounded-full border border-[#FFC107]/40 shadow-sm">
              {badgeText}
            </div>
          )}
        </div>

        {/* Bottom Rating Pill */}
        <div className="absolute bottom-3 start-3 bg-black/80 backdrop-blur-md text-white text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="font-bold">4.9</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          <h3 className={`font-bold text-base sm:text-lg group-hover:text-[#FF5722] transition-colors leading-snug ${
            isLight ? 'text-[#1A1816]' : 'text-white'
          }`}>
            {itemName}
          </h3>
          
          <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed font-light ${
            isLight ? 'text-[#6B6458]' : 'text-gray-400'
          }`}>
            {itemDesc}
          </p>

          {hasUpgrade && (
            <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
              isLight 
                ? 'text-[#E64A19] bg-orange-50 border-orange-200' 
                : 'text-[#FFC107] bg-[#FF5722]/15 border-[#FF5722]/30'
            }`}>
              {currentLang === 'ar' ? 'إمكانية ترقية الوجبة والحجم' : 'Meal & Size upgrades available'}
            </span>
          )}
        </div>

        {/* Card Footer */}
        <div className={`flex items-center justify-between pt-3 border-t ${
          isLight ? 'border-[#EAE5DC]' : 'border-[#332E27]/60'
        }`}>
          <div>
            <span className={`text-[11px] block font-medium ${
              isLight ? 'text-[#8A8174]' : 'text-gray-400'
            }`}>
              {t.price}:
            </span>
            <span className="text-lg font-black text-[#FF5722]">
              {formatPrice(item.price, settings.currency, currentLang)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`view-item-btn-${item.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:from-[#E64A19] hover:to-[#D84315] text-white font-extrabold px-3 py-2 rounded-full text-xs shadow-md shadow-[#FF5722]/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.cart.addToCart}</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
