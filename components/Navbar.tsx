'use client';

import React, { useState } from 'react';
import { Language, RestaurantSettings, Theme } from '@/types/menu';
import { translations, isRtl } from '@/lib/i18n';
import { SuperFriedLogo } from './SuperFriedLogo';
import { 
  Globe, 
  MapPin, 
  Check, 
  ChevronDown,
  Share2,
  Phone,
  MessageCircle,
  Search,
  X,
  Sun,
  Moon,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  settings: RestaurantSettings;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  cartItemsCount: number;
  onOpenCart: () => void;
}

const languages: { code: Language; short: string; label: string; flag: string; nativeName: string }[] = [
  { code: 'ar', short: 'AR', label: 'العربية', flag: '🇮🇶', nativeName: 'العربية' },
  { code: 'en', short: 'EN', label: 'EN', flag: '🇬🇧', nativeName: 'English' },
  { code: 'ku', short: 'KU', label: 'KU', flag: '☀️', nativeName: 'کوردی' },
  { code: 'tr', short: 'TR', label: 'TR', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'fa', short: 'FA', label: 'FA', flag: '🇮🇷', nativeName: 'فارسی' },
  { code: 'ur', short: 'UR', label: 'UR', flag: '🇵🇰', nativeName: 'اردو' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  settings,
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  cartItemsCount,
  onOpenCart,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = translations[currentLang];
  const rtl = isRtl(currentLang);
  const isLight = theme === 'light';

  const currentLangObj = languages.find((l) => l.code === currentLang) || languages[0];

  const handleShare = async () => {
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

    if (navigator.share) {
      try {
        await navigator.share({
          title: settings.name[currentLang] || settings.name.ar,
          text: t.quickActions.shareMenuText,
          url: menuUrl,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const whatsappClean = (settings.whatsappNumber || settings.phone).replace(/[^0-9]/g, '');

  return (
    <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${
      isLight 
        ? 'glass-effect-light border-[#E2DDD5] text-[#1A1816]' 
        : 'glass-effect border-[#332E27]/80 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Branding */}
          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="transform group-hover:scale-105 transition-transform">
              <SuperFriedLogo size={46} />
            </div>
            <div className="flex flex-col">
              <div className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none ${
                isLight ? 'text-[#1A1816]' : 'text-white'
              }`}>
                <span>{currentLang === 'ar' ? 'سوبر' : 'SUPER'}</span>
                <span className="text-[#FF5722]">{currentLang === 'ar' ? 'فرايد' : 'FRIED'}</span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#FFC107] animate-ping" />
              </div>
              <span className={`text-[11px] sm:text-xs font-medium mt-1 ${
                isLight ? 'text-[#70685D]' : 'text-gray-400'
              }`}>
                {settings.tagline[currentLang] || 'عالم القرمشة الذهبية'}
              </span>
            </div>
          </div>

          {/* Desktop Live Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder} 
                className={`w-full text-sm rounded-full py-2.5 ps-10 pe-9 focus:outline-hidden transition ${
                  isLight
                    ? 'bg-white border border-[#D8D2C5] text-[#1A1816] focus:border-[#FF5722] placeholder-gray-400 shadow-xs'
                    : 'bg-black/50 border border-[#332E27] text-white focus:border-[#FFC107] placeholder-gray-500'
                }`}
              />
              <Search className={`absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                isLight ? 'text-gray-400' : 'text-gray-400'
              }`} />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5722]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className={`p-2 sm:px-3 sm:py-2 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border-amber-200 shadow-xs'
                  : 'bg-[#1C1A17] hover:bg-[#332E27] text-amber-300 border-[#332E27]'
              }`}
              title={isLight ? t.theme.darkMode : t.theme.lightMode}
              aria-label="Toggle Theme"
            >
              {isLight ? (
                <>
                  <Moon className="w-4 h-4 text-amber-700" />
                  <span className="hidden lg:inline text-xs font-bold text-amber-900">
                    {t.theme.darkMode}
                  </span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="hidden lg:inline text-xs font-bold text-amber-300">
                    {t.theme.lightMode}
                  </span>
                </>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:from-[#E64A19] hover:to-[#D84315] text-white text-xs sm:text-sm font-extrabold transition shadow-md shadow-[#FF5722]/25 cursor-pointer active:scale-95"
              title={t.cart.title}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t.cart.title}</span>
              {cartItemsCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-black bg-white text-[#FF5722] rounded-full shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Share Menu Button */}
            <button
              id="nav-share-btn"
              onClick={handleShare}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold transition border cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-neutral-100 text-neutral-700 border-[#E2DDD5]'
                  : 'bg-[#1C1A17] hover:bg-[#332E27] text-gray-300 border-[#332E27]'
              }`}
              title={t.quickActions.shareMenu}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 text-xs font-bold">{t.quickActions.menuLinkCopied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span className="text-xs">{t.quickActions.shareMenu}</span>
                </>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="language-selector-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-bold transition border cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-[#D8D2C5] shadow-xs'
                    : 'bg-[#1C1A17] hover:bg-[#332E27] text-white border-[#332E27]'
                }`}
                aria-label="Change Language"
              >
                <span className="text-base leading-none">{currentLangObj.flag}</span>
                <span className="font-mono font-bold tracking-wider">{currentLangObj.short}</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div
                    className={`absolute ${
                      rtl ? 'left-0' : 'right-0'
                    } mt-2 w-48 rounded-2xl shadow-2xl py-1.5 z-50 overflow-hidden border ${
                      isLight
                        ? 'bg-white border-[#E2DDD5] text-neutral-800'
                        : 'bg-[#1C1A17] border-[#332E27] text-gray-200'
                    }`}
                  >
                    <div className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border-b ${
                      isLight ? 'border-[#EAE5DC] text-neutral-400' : 'border-[#332E27] text-gray-400'
                    }`}>
                      اختر اللغة / Select Language
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        id={`lang-select-${lang.code}`}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-start transition-colors cursor-pointer ${
                          currentLang === lang.code
                            ? isLight 
                              ? 'font-bold text-[#FF5722] bg-orange-50' 
                              : 'font-bold text-[#FFC107] bg-[#332E27]/70'
                            : isLight
                              ? 'text-neutral-700 hover:bg-neutral-100'
                              : 'text-gray-200 hover:bg-[#332E27]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span className="font-mono font-bold text-xs">{lang.short}</span>
                          <span className="text-xs opacity-75">({lang.nativeName})</span>
                        </span>
                        {currentLang === lang.code && (
                          <Check className={`w-3.5 h-3.5 ${isLight ? 'text-[#FF5722]' : 'text-[#FFC107]'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3.5">
          <div className="relative w-full">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder} 
              className={`w-full text-xs sm:text-sm rounded-full py-2 ps-9 pe-8 focus:outline-hidden ${
                isLight
                  ? 'bg-white border border-[#D8D2C5] text-[#1A1816] focus:border-[#FF5722] placeholder-gray-400'
                  : 'bg-black/60 border border-[#332E27] text-white focus:border-[#FFC107] placeholder-gray-500'
              }`}
            />
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5722]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
