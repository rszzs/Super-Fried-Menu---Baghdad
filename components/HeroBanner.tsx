'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Language, RestaurantSettings, MenuItem, Theme } from '@/types/menu';
import { translations } from '@/lib/i18n';
import { getItemName, getItemDescription } from '@/lib/menuLocalization';
import { 
  Flame, 
  CheckCircle2, 
  Zap, 
  Star, 
  Utensils, 
  MapPin, 
  MessageCircle,
  Eye,
  ShoppingBag
} from 'lucide-react';

interface HeroBannerProps {
  currentLang: Language;
  settings: RestaurantSettings;
  theme: Theme;
  onScrollToMenu: () => void;
  onSelectDealItem?: (item: MenuItem) => void;
  featuredItem?: MenuItem;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentLang,
  settings,
  theme,
  onScrollToMenu,
  onSelectDealItem,
  featuredItem,
}) => {
  const t = translations[currentLang];
  const isLight = theme === 'light';
  const [countdown, setCountdown] = useState('02:45:12');

  useEffect(() => {
    let totalSecs = 9912;
    const interval = setInterval(() => {
      totalSecs--;
      if (totalSecs < 0) totalSecs = 10000;
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      setCountdown(
        `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const whatsappClean = (settings.whatsappNumber || settings.phone).replace(/[^0-9]/g, '');

  return (
    <section className={`relative overflow-hidden py-8 lg:py-12 border-b transition-colors duration-300 ${
      isLight 
        ? 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE4] border-[#E2DDD5]' 
        : 'bg-gradient-to-b from-[#1C1A17]/60 via-[#121212]/80 to-[#0E0D0B] border-[#332E27]/40'
    }`}>
      {/* Background Ambient Glows */}
      <div className={`absolute top-0 start-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-orange-200/30' : 'bg-[#FF5722]/10'
      }`} />
      <div className={`absolute bottom-0 end-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-amber-200/30' : 'bg-[#FFC107]/10'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Text & Value Proposition */}
          <div className="lg:col-span-7 text-center lg:text-start space-y-4">
            
            {/* Promo Opening Banner */}
            <div className={`inline-flex items-center gap-2 text-xs font-black px-3.5 py-1.5 rounded-full border shadow-xs ${
              isLight
                ? 'bg-orange-50 text-[#FF5722] border-orange-200'
                : 'bg-[#FF5722]/10 text-[#FFC107] border-[#FF5722]/30 animate-pulse'
            }`}>
              <Flame className="w-4 h-4 text-[#FF5722] fill-[#FF5722]" />
              <span>
                {currentLang === 'ar' 
                  ? 'خصم 20% على أطباق البطاطس المحملة والبركر بمناسبة الافتتاح!' 
                  : 'Special 20% Grand Opening Offer on Crispy Meals & Burgers!'}
              </span>
            </div>
            
            {/* Main Catchy Heading */}
            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight ${
              isLight ? 'text-[#1A1816]' : 'text-white'
            }`}>
              {currentLang === 'ar' ? (
                <>
                  تذوق القرمشة <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#E64A19] to-[#FFC107]">
                    التي لا تُنسى مع سوبر فرايد
                  </span>
                </>
              ) : (
                <>
                  Taste The Unforgettable <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#E64A19] to-[#FFC107]">
                    Crisp With Super Fried
                  </span>
                </>
              )}
            </h1>
            
            {/* Tagline / Subtitle */}
            <p className={`text-xs sm:text-sm md:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed ${
              isLight ? 'text-[#61584C]' : 'text-gray-300 font-light'
            }`}>
              {settings.tagline?.[currentLang] || (currentLang === 'ar'
                ? 'أشهى وجبات الكنتاكي والبركر و الستربس والريزو من سوبرفرايد'
                : 'Delicious Kentucky Chicken, Gourmet Burgers, Strips & Rizo from Super Fried')}
            </p>

            {/* Quality Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 sm:gap-3 pt-1">
              <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border ${
                isLight ? 'bg-white text-neutral-800 border-[#E2DDD5] shadow-xs' : 'bg-black/40 text-gray-300 border-gray-800'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5722]" />
                <span className="font-semibold">{currentLang === 'ar' ? 'مكونات طازجة 100%' : '100% Fresh'}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border ${
                isLight ? 'bg-white text-neutral-800 border-[#E2DDD5] shadow-xs' : 'bg-black/40 text-gray-300 border-gray-800'
              }`}>
                <Zap className="w-3.5 h-3.5 text-[#FF5722]" />
                <span className="font-semibold">{currentLang === 'ar' ? 'تحضير سريع وساخن' : 'Fast & Hot'}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border ${
                isLight ? 'bg-white text-neutral-800 border-[#E2DDD5] shadow-xs' : 'bg-black/40 text-gray-300 border-gray-800'
              }`}>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-semibold">{currentLang === 'ar' ? 'تقييم 4.9 من الزبائن' : '4.9/5 Rating'}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                id="hero-scroll-menu-btn"
                onClick={onScrollToMenu}
                className="px-6 py-3 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs sm:text-sm font-black shadow-lg shadow-[#FF5722]/30 transition transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Utensils className="w-4 h-4 text-white" />
                <span>{t.viewMenu}</span>
              </button>

              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-3 rounded-full border text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                    isLight 
                      ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-[#E2DDD5] shadow-xs' 
                      : 'bg-[#1C1A17] hover:bg-[#332E27] border-[#332E27] text-gray-300'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#FF5722]" />
                  <span>{t.quickActions.directionsGoogleMaps.split(' ')[0]}</span>
                </a>
              )}

              <a
                href={`https://wa.me/${whatsappClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>واتساب</span>
              </a>
            </div>

          </div>

          {/* Featured Deal Card */}
          <div className="lg:col-span-5">
            <div className={`relative p-5 sm:p-6 rounded-3xl border shadow-xl overflow-hidden group transition ${
              isLight 
                ? 'bg-white border-[#E2DDD5] text-[#1A1816]' 
                : 'bg-gradient-to-br from-[#FF5722]/20 via-[#1C1A17] to-black border-[#FF5722]/30 text-white'
            }`}>
              <div className="absolute -top-10 -start-10 w-40 h-40 bg-[#FF5722]/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#FF5722] text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {currentLang === 'ar' ? 'العرض الذهبي اليوم 🔥' : "Today's Golden Deal 🔥"}
                </span>
                <div className="text-end">
                  <span className={`text-[11px] block ${isLight ? 'text-neutral-500' : 'text-gray-400'}`}>
                    {currentLang === 'ar' ? 'ينتهي خلال:' : 'Ends in:'}
                  </span>
                  <span className="font-mono text-[#FF5722] font-black text-xs sm:text-sm tracking-wider">{countdown}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md shrink-0 border border-black/10">
                  <Image 
                    src={featuredItem?.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80'} 
                    alt="Super Deal" 
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover transform group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div>
                  <h3 className={`font-bold text-base sm:text-lg ${isLight ? 'text-[#1A1816]' : 'text-white'}`}>
                    {featuredItem ? getItemName(featuredItem, currentLang) : (currentLang === 'ar' ? 'بوكس سوبر فرايد المشكل' : 'Super Fried Combo Box')}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 ${isLight ? 'text-[#6B6458]' : 'text-gray-400'}`}>
                    {featuredItem ? getItemDescription(featuredItem, currentLang) : (currentLang === 'ar' ? 'سوبر بركر + فنكر بالجبن + كول سلو + مشروب غازي بارد' : 'Super Burger + Cheesy Fries + Coleslaw + Cold Soda')}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2.5">
                    <span className="text-lg sm:text-xl font-black text-[#FF5722]">10,000 د.ع</span>
                    <span className={`text-xs line-through ${isLight ? 'text-neutral-400' : 'text-gray-500'}`}>12,500 د.ع</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (featuredItem && onSelectDealItem) {
                    onSelectDealItem(featuredItem);
                  } else {
                    onScrollToMenu();
                  }
                }}
                className="w-full mt-4 bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold py-2.5 sm:py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-98"
              >
                <Eye className="w-4 h-4 text-white" />
                <span>{currentLang === 'ar' ? 'عرض وتخصيص الوجبة' : 'View & Customize Meal'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
