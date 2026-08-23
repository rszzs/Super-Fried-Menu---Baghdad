'use client';

import React from 'react';
import { Category, DietaryTag, Language, Theme } from '@/types/menu';
import { translations } from '@/lib/i18n';
import { getCategoryName } from '@/lib/menuLocalization';
import { 
  LayoutGrid,
  UtensilsCrossed, 
  Salad, 
  Flame, 
  Pizza, 
  Sandwich, 
  CakeSlice, 
  Coffee, 
  Soup, 
  Sparkles,
} from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  selectedDietaryTag: DietaryTag | 'all';
  onSelectDietaryTag: (tag: DietaryTag | 'all') => void;
  currentLang: Language;
  theme: Theme;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  selectedDietaryTag,
  onSelectDietaryTag,
  currentLang,
  theme,
}) => {
  const t = translations[currentLang];
  const isLight = theme === 'light';

  const renderCategoryIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 ${isSelected ? 'text-white' : isLight ? 'text-[#FF5722]' : 'text-[#FFC107]'}`;
    switch (iconName) {
      case 'Soup':
        return <Soup className={iconClass} />;
      case 'Salad':
        return <Salad className={iconClass} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Pizza':
        return <Pizza className={iconClass} />;
      case 'Sandwich':
        return <Sandwich className={iconClass} />;
      case 'CakeSlice':
        return <CakeSlice className={iconClass} />;
      case 'Coffee':
        return <Coffee className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const dietaryOptions: { tag: DietaryTag | 'all'; label: string; icon?: React.ReactNode }[] = [
    { tag: 'all', label: t.allDietary },
    { tag: 'bestseller', label: t.dietary.bestseller },
    { tag: 'chef-special', label: t.dietary.chefSpecial },
    { tag: 'halal', label: t.dietary.halal },
    { tag: 'spicy', label: t.dietary.spicy },
    { tag: 'vegetarian', label: t.dietary.vegetarian },
    { tag: 'gluten-free', label: t.dietary.glutenFree },
  ];

  return (
    <section className={`sticky top-20 z-30 border-b py-3 shadow-sm transition-all ${
      isLight 
        ? 'glass-effect-light border-[#E2DDD5] bg-[#FAF8F5]/90 text-[#1A1816]' 
        : 'bg-black/90 backdrop-blur-md border-[#332E27]/50 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
        
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {/* 'All' Button */}
          <button
            id="cat-btn-all"
            onClick={() => onSelectCategory('all')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer ${
              activeCategoryId === 'all'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                : isLight 
                  ? 'bg-white hover:bg-neutral-100 text-neutral-700 border border-[#E2DDD5]' 
                  : 'bg-[#1C1A17] hover:bg-[#332E27] text-gray-300 border border-[#332E27]/60'
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${activeCategoryId === 'all' ? 'text-white' : isLight ? 'text-[#FF5722]' : 'text-[#FFC107]'}`} />
            <span>{t.allCategories}</span>
          </button>

          {/* Sorted Categories */}
          {categories
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((category) => {
              const isSelected = activeCategoryId === category.id;
              const catName = getCategoryName(category, currentLang);
              return (
                <button
                  key={category.id}
                  id={`cat-btn-${category.slug}`}
                  onClick={() => onSelectCategory(category.id)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF5722] text-white font-bold shadow-md shadow-[#FF5722]/30'
                      : isLight 
                        ? 'bg-white hover:bg-neutral-100 text-neutral-700 border border-[#E2DDD5]' 
                        : 'bg-[#1C1A17] hover:bg-[#332E27] text-gray-300 border border-[#332E27]/60'
                  }`}
                >
                  {renderCategoryIcon(category.icon, isSelected)}
                  <span>{catName}</span>
                </button>
              );
            })}
        </div>

        {/* Dietary / Feature Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-1">
          {dietaryOptions.map((opt) => {
            const isSelected = selectedDietaryTag === opt.tag;
            return (
              <button
                key={opt.tag}
                id={`dietary-filter-${opt.tag}`}
                onClick={() => onSelectDietaryTag(opt.tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-[#FF5722] text-white border-[#FF5722] font-bold shadow-xs'
                      : 'bg-[#FFC107] text-black border-[#FFC107] font-bold shadow-xs'
                    : isLight
                      ? 'bg-white/80 text-neutral-600 border-[#E2DDD5] hover:bg-white hover:text-neutral-900'
                      : 'bg-black/40 text-gray-400 border-[#332E27] hover:bg-[#1C1A17] hover:text-gray-200'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
