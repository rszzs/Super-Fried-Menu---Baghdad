import { Language, CartItem, OrderCustomerInfo, RestaurantSettings, MultilingualText } from '@/types/menu';

export interface TranslationDictionary {
  appName: string;
  viewMenu: string;
  exploreCategories: string;
  searchPlaceholder: string;
  allCategories: string;
  allDietary: string;
  itemsCount: string;
  noResults: string;
  noResultsDesc: string;
  resetFilters: string;
  price: string;
  theme: {
    toggleTheme: string;
    lightMode: string;
    darkMode: string;
  };
  cart: {
    title: string;
    addToCart: string;
    addedToCart: string;
    orderNow: string;
    sendViaWhatsApp: string;
    cartEmpty: string;
    cartEmptyDesc: string;
    total: string;
    subtotal: string;
    customerName: string;
    customerNamePlaceholder: string;
    customerPhone: string;
    customerPhonePlaceholder: string;
    orderType: string;
    dineIn: string;
    takeaway: string;
    delivery: string;
    tableOrAddress: string;
    tableOrAddressPlaceholder: string;
    tableNumber: string;
    tableNumberPlaceholder: string;
    pickupDetails: string;
    pickupDetailsPlaceholder: string;
    deliveryAddress: string;
    deliveryAddressPlaceholder: string;
    useCurrentLocation: string;
    locating: string;
    locationDetected: string;
    locationError: string;
    comboMealBadge: string;
    customizationSummary: string;
    notes: string;
    notesPlaceholder: string;
    items: string;
    clearCart: string;
    checkoutTitle: string;
    spiceLevel: string;
    selectedSauces: string;
    quantity: string;
    whatsappOrderNote: string;
  };
  customization: {
    title: string;
    makeItMeal: string;
    makeItMealDesc: string;
    lettuce: string;
    lettuceNormal: string;
    lettuceExtra: string;
    lettuceNone: string;
    sauce: string;
    sauceNormal: string;
    sauceExtra: string;
    sauceNone: string;
    plain: string;
    plainDesc: string;
  };
  dietary: {
    halal: string;
    vegetarian: string;
    vegan: string;
    spicy: string;
    chefSpecial: string;
    bestseller: string;
    glutenFree: string;
  };
  allergens: {
    title: string;
    nuts: string;
    dairy: string;
    gluten: string;
    eggs: string;
    soy: string;
    seafood: string;
    sesame: string;
  };
  item: {
    viewDetails: string;
    close: string;
    ingredients: string;
    allergensNotice: string;
    portionSize: string;
    extraAddons: string;
    outOfStock: string;
    available: string;
    calories: string;
    prepTime: string;
    minutes: string;
    currency: string;
    popular: string;
    spicyLevel: string;
    mild: string;
    spicy: string;
    superSpicy: string;
  };
  sauces: {
    cheese: string;
    garlic: string;
    bbq: string;
    honey: string;
  };
  quickActions: {
    directionsGoogleMaps: string;
    restaurantHours: string;
    contactUs: string;
    shareMenu: string;
    shareMenuWhatsapp: string;
    shareMenuText: string;
    copyMenuLink: string;
    menuLinkCopied: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    appName: 'سوبر فرايد',
    viewMenu: 'تصفح المنيو',
    exploreCategories: 'الأصناف والوجبات',
    searchPlaceholder: 'ابحث عن وجبة، برغر، ريزو، أو مكون...',
    allCategories: 'الكل',
    allDietary: 'جميع الخيارات',
    itemsCount: 'وجبة',
    noResults: 'لم يتم العثور على أطباق مطابقة',
    noResultsDesc: 'جرب تغيير كلمة البحث أو اختيار تصنيف آخر لعرض الوجبات المتاحة.',
    resetFilters: 'عرض جميع الأصناف',
    price: 'السعر',
    theme: {
      toggleTheme: 'تبديل المظهر',
      lightMode: 'الوضع النهاري',
      darkMode: 'الوضع الليلي',
    },
    cart: {
      title: 'سلة الطلبات',
      addToCart: 'إضافة إلى السلة',
      addedToCart: 'تمت الإضافة بنجاح',
      orderNow: 'اطلب عبر واتساب ⚡',
      sendViaWhatsApp: 'إرسال الطلب عبر واتساب 📲',
      cartEmpty: 'سلة الطلبات فارغة',
      cartEmptyDesc: 'اختر وجباتك المفضلة من المنيو وقم بإضافتها لإتمام الطلب مباشرة.',
      total: 'المجموع الإجمالي',
      subtotal: 'المجموع الفرعي',
      customerName: 'اسم الزبون الكريم',
      customerNamePlaceholder: 'مثال: أحمد علي',
      customerPhone: 'رقم الهاتف (اختياري)',
      customerPhonePlaceholder: '0770xxxxxxx',
      orderType: 'نوع الطلب',
      dineIn: 'تناول داخل الصالة 🍽️',
      takeaway: 'استلام سفري 🥡',
      delivery: 'توصيل ديليفري 🛵',
      tableOrAddress: 'رقم الطاولة أو عنوان التوصيل',
      tableOrAddressPlaceholder: 'طاولة رقم 4 أو الكاظمية قرب...',
      tableNumber: 'رقم الطاولة / رقم الجدول',
      tableNumberPlaceholder: 'مثال: طاولة رقم 4 (Table 4)',
      pickupDetails: 'تفاصيل استلام السفري',
      pickupDetailsPlaceholder: 'مثال: استلام خلال 15 دقيقة',
      deliveryAddress: 'عنوان التوصيل الكامل',
      deliveryAddressPlaceholder: 'المنطقة، الشارع، أقرب نقطة دالة...',
      useCurrentLocation: 'إضافة موقعي الحالي 📍',
      locating: 'جاري تحديد موقعك...',
      locationDetected: 'تم تحديد موقعك بدقة 📍',
      locationError: 'تعذر تحديد الموقع تلقائياً، يرجى كتابته',
      comboMealBadge: 'وجبة كاملة 🍟🥤',
      customizationSummary: 'تخصيص المكونات',
      notes: 'ملاحظات إضافية على الطلب',
      notesPlaceholder: 'مثال: بدون بصل، زيادة صوص...',
      items: 'عناصر',
      clearCart: 'تفريغ السلة',
      checkoutTitle: 'تأكيد الطلب وإرساله إلى المطعم',
      spiceLevel: 'درجة الحرارة',
      selectedSauces: 'الصلصات الإضافية',
      quantity: 'الكمية',
      whatsappOrderNote: 'سيتم تحويل طلبك مباشرة مع ترجمة واضحة لإدارة المطبخ',
    },
    customization: {
      title: 'خيارات وتخصيص الوجبة',
      makeItMeal: 'تحويل إلى وجبة كاملة (بطاطا + بيبسي) 🍟🥤',
      makeItMealDesc: 'أضف بطاطا كريسبي مقرمشة مع مشروب غازي بارد منعش',
      lettuce: 'الخس 🥬',
      lettuceNormal: 'خس عادي',
      lettuceExtra: 'زيادة خس 🥬',
      lettuceNone: 'بدون خس 🚫',
      sauce: 'الصوص 🥣',
      sauceNormal: 'صوص عادي',
      sauceExtra: 'زيادة صوص 🥣',
      sauceNone: 'بدون صوص 🚫',
      plain: 'سادة (بدون خضار أو صوصات) 🥪',
      plainDesc: 'تقديم الساندويتش أو الوجبة سادة بالدجاج المقرمش فقط',
    },
    dietary: {
      halal: 'حلال 100%',
      vegetarian: 'نباتي',
      vegan: 'نباتي صرف',
      spicy: 'حار 🔥',
      chefSpecial: 'توصية الشيف ⭐',
      bestseller: 'الأكثر طلباً 🔥',
      glutenFree: 'خالٍ من الغلوتين',
    },
    allergens: {
      title: 'معلومات الحساسية ومكونات التحسس',
      nuts: 'مكسرات',
      dairy: 'مشتقات الحليب',
      gluten: 'غلوتين',
      eggs: 'بيض',
      soy: 'صويا',
      seafood: 'مأكولات بحرية',
      sesame: 'سمسم',
    },
    item: {
      viewDetails: 'عرض التفاصيل',
      close: 'إغلاق',
      ingredients: 'المكونات الأساسية والوصفة',
      allergensNotice: 'تنبيه الحساسية',
      portionSize: 'الحجم والخيارات',
      extraAddons: 'الإضافات والصوصات',
      outOfStock: 'غير متوفر حالياً',
      available: 'متوفر',
      calories: 'سعرة حرارية',
      prepTime: 'وقت التحضير',
      minutes: 'دقيقة',
      currency: 'د.ع',
      popular: 'مميز',
      spicyLevel: 'درجة الحرارة والبهار',
      mild: 'عادي 🟢',
      spicy: 'سبايسي 🌶️',
      superSpicy: 'سوبر نار 🔥',
    },
    sauces: {
      cheese: 'جبن ذائب 🧀',
      garlic: 'ثومية كريمية 🧄',
      bbq: 'باربيكيو مدخن 🍖',
      honey: 'هني مسترد 🍯',
    },
    quickActions: {
      directionsGoogleMaps: 'موقعنا على خرائط جوجل',
      restaurantHours: 'ساعات العمل',
      contactUs: 'تواصل معنا',
      shareMenu: 'مشاركة المنيو',
      shareMenuWhatsapp: 'مشاركة عبر واتساب',
      shareMenuText: '🍗 تصفح المنيو الرقمي لمطعم سوبر فرايد (الكاظمية - باب المراد):',
      copyMenuLink: 'نسخ رابط المنيو',
      menuLinkCopied: 'تم نسخ الرابط بنجاح!',
    },
  },

  en: {
    appName: 'Super Fried',
    viewMenu: 'Explore Menu',
    exploreCategories: 'Dishes & Categories',
    searchPlaceholder: 'Search meals, burgers, rizo, or ingredients...',
    allCategories: 'All',
    allDietary: 'All Dietary',
    itemsCount: 'items',
    noResults: 'No dishes found',
    noResultsDesc: 'Try adjusting your search terms or filters to view available items.',
    resetFilters: 'View All Dishes',
    price: 'Price',
    theme: {
      toggleTheme: 'Toggle Theme',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
    },
    cart: {
      title: 'Your Order Cart',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to cart!',
      orderNow: 'Order via WhatsApp ⚡',
      sendViaWhatsApp: 'Send Order via WhatsApp 📲',
      cartEmpty: 'Your cart is empty',
      cartEmptyDesc: 'Select your favorite crispy dishes from the menu to start your order.',
      total: 'Total Amount',
      subtotal: 'Subtotal',
      customerName: 'Customer Name',
      customerNamePlaceholder: 'e.g. John Doe',
      customerPhone: 'Phone Number (optional)',
      customerPhonePlaceholder: '0770xxxxxxx',
      orderType: 'Order Type',
      dineIn: 'Dine-In (Hall) 🍽️',
      takeaway: 'Takeaway 🥡',
      delivery: 'Delivery 🛵',
      tableOrAddress: 'Table Number or Delivery Address',
      tableOrAddressPlaceholder: 'Table 4 or Kadhimiya...',
      tableNumber: 'Table Number (Dine-In)',
      tableNumberPlaceholder: 'e.g. Table 4',
      pickupDetails: 'Pickup / Takeaway Details',
      pickupDetailsPlaceholder: 'e.g. Pickup in 15 minutes',
      deliveryAddress: 'Full Delivery Address',
      deliveryAddressPlaceholder: 'Area, Street, Landmark...',
      useCurrentLocation: 'Use Current Location 📍',
      locating: 'Detecting location...',
      locationDetected: 'Location added accurately 📍',
      locationError: 'Could not detect location, please type manually',
      comboMealBadge: 'Combo Meal 🍟🥤',
      customizationSummary: 'Customization',
      notes: 'Special Instructions / Notes',
      notesPlaceholder: 'e.g. No onions, extra crispy fries...',
      items: 'items',
      clearCart: 'Clear Cart',
      checkoutTitle: 'Review & Send Order to Kitchen',
      spiceLevel: 'Spice Level',
      selectedSauces: 'Extra Sauces',
      quantity: 'Quantity',
      whatsappOrderNote: 'Your order will be sent in English with instant Arabic kitchen translation',
    },
    customization: {
      title: 'Meal Customization Options',
      makeItMeal: 'Upgrade to Combo Meal (Fries + Drink) 🍟🥤',
      makeItMealDesc: 'Add hot crispy fries and a refreshing cold soft drink',
      lettuce: 'Lettuce 🥬',
      lettuceNormal: 'Regular Lettuce',
      lettuceExtra: 'Extra Lettuce 🥬',
      lettuceNone: 'No Lettuce 🚫',
      sauce: 'Sauce 🥣',
      sauceNormal: 'Regular Sauce',
      sauceExtra: 'Extra Sauce 🥣',
      sauceNone: 'No Sauce 🚫',
      plain: 'Plain (No Vegetables / Sauces) 🥪',
      plainDesc: 'Crispy chicken and bun only, without toppings',
    },
    dietary: {
      halal: '100% Halal',
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      spicy: 'Spicy 🔥',
      chefSpecial: "Chef's Special ⭐",
      bestseller: 'Bestseller 🔥',
      glutenFree: 'Gluten-Free',
    },
    allergens: {
      title: 'Allergen Advisory',
      nuts: 'Nuts',
      dairy: 'Dairy',
      gluten: 'Gluten',
      eggs: 'Eggs',
      soy: 'Soy',
      seafood: 'Seafood',
      sesame: 'Sesame',
    },
    item: {
      viewDetails: 'View Details',
      close: 'Close',
      ingredients: 'Ingredients & Recipe',
      allergensNotice: 'Allergen Notice',
      portionSize: 'Portions & Sizes',
      extraAddons: 'Add-ons & Sauces',
      outOfStock: 'Temporarily Unavailable',
      available: 'Available',
      calories: 'Calories',
      prepTime: 'Prep Time',
      minutes: 'mins',
      currency: 'IQD',
      popular: 'Popular',
      spicyLevel: 'Spice & Heat Level',
      mild: 'Mild 🟢',
      spicy: 'Spicy 🌶️',
      superSpicy: 'Super Hot 🔥',
    },
    sauces: {
      cheese: 'Melted Cheese 🧀',
      garlic: 'Creamy Garlic 🧄',
      bbq: 'Smoky BBQ 🍖',
      honey: 'Honey Mustard 🍯',
    },
    quickActions: {
      directionsGoogleMaps: 'Directions on Google Maps',
      restaurantHours: 'Opening Hours',
      contactUs: 'Contact Us',
      shareMenu: 'Share Menu',
      shareMenuWhatsapp: 'Share via WhatsApp',
      shareMenuText: '🍗 Check out Super Fried digital menu (Kadhimiya - Bab Al-Murad):',
      copyMenuLink: 'Copy Menu Link',
      menuLinkCopied: 'Link copied successfully!',
    },
  },

  ku: {
    appName: 'سوپەر فراید',
    viewMenu: 'سەیرکردنی مێنیو',
    exploreCategories: 'بەشەکان و خواردنەکان',
    searchPlaceholder: 'بگەڕێ بۆ بەرگەر، ڕیزۆ، سترپس یان پێکهاتە...',
    allCategories: 'هەموو',
    allDietary: 'هەموو جۆرەکان',
    itemsCount: 'خواردن',
    noResults: 'هیچ خواردنێک نەدۆزرایەوە',
    noResultsDesc: 'وشەی گەڕانەکەت بگۆڕە یان بەشێکی تر هەڵبژێرە.',
    resetFilters: 'پیشاندانی هەموو خواردنەکان',
    price: 'نرخ',
    theme: {
      toggleTheme: 'گۆڕینی ڕەنگ',
      lightMode: 'دۆخی ڕۆژ (ڕووناک)',
      darkMode: 'دۆخی شەو (تاریک)',
    },
    cart: {
      title: 'سەبەتەی داواکارییەکان',
      addToCart: 'زیادکردن بۆ سەبەتە',
      addedToCart: 'زیادکرا بۆ سەبەتە!',
      orderNow: 'داواکردن بە واتسئاپ ⚡',
      sendViaWhatsApp: 'ناردنی داواکاری لە واتسئاپ 📲',
      cartEmpty: 'سەبەتەکەت بەتاڵە',
      cartEmptyDesc: 'خواردنە بەتامەکان هەڵبژێرە لە مێنیو بۆ ئەوەی داوای بکەیت.',
      total: 'کۆی گشتی',
      subtotal: 'کۆی بەشەکی',
      customerName: 'ناوی بەڕێزتان',
      customerNamePlaceholder: 'نموونە: ئارام ئەحمەد',
      customerPhone: 'ژمارەی مۆبایل (ئارەزوومەندانە)',
      customerPhonePlaceholder: '0770xxxxxxx',
      orderType: 'جۆری داواکاری',
      dineIn: 'نانخواردن لە هۆڵ 🍽️',
      takeaway: 'سەفەری 🥡',
      delivery: 'گەیاندن (دیلیڤەری) 🛵',
      tableOrAddress: 'ژمارەی مێز یان ناونیشانی گەیاندن',
      tableOrAddressPlaceholder: 'مێزی ژمارە ٤ یان ناونیشان...',
      tableNumber: 'ژمارەی مێز (ناو هۆڵ)',
      tableNumberPlaceholder: 'نموونە: مێزی ژمارە ٤',
      pickupDetails: 'وردەکاری سەفەری',
      pickupDetailsPlaceholder: 'نموونە: وەرگرتن لە ماوەی ١٥ خولەکدا',
      deliveryAddress: 'ناونیشانی تەواوی گەیاندن',
      deliveryAddressPlaceholder: 'گەڕەک، شەقام، نزیکترین شوێن...',
      useCurrentLocation: 'زیادکردنی شوێنی ئێستام 📍',
      locating: 'دیاریکردنی شوێن...',
      locationDetected: 'شوێنەکە بە سەرکەوتوویی زیادکرا 📍',
      locationError: 'نەتوانرا شوێن دیاریبکرێت، تکایە خۆت بینوسە',
      comboMealBadge: 'ژەمی تەواو 🍟🥤',
      customizationSummary: 'تایبەتمەندییەکان',
      notes: 'تێبینی زیاتر',
      notesPlaceholder: 'نموونە: بێ پیاز، سۆسی زیاتر...',
      items: 'خواردن',
      clearCart: 'سڕینەوەی سەبەتە',
      checkoutTitle: 'پشتڕاستکردنەوە و ناردنی داواکاری',
      spiceLevel: 'ئاستی تیژی',
      selectedSauces: 'سۆسە زیادەکان',
      quantity: 'ژمارە',
      whatsappOrderNote: 'داواکارییەکەت ڕاستەوخۆ بە کوردی و وەرگێڕانی عەرەبی بۆ چێشتخانە دەنێردرێت',
    },
    customization: {
      title: 'تایبەتمەندی و گۆڕینی پێکهاتەکان',
      makeItMeal: 'گۆڕین بۆ ژەمی تەواو (پەتاتە + خواردنەوە) 🍟🥤',
      makeItMealDesc: 'پەتاتەی سوورکراوە و خواردنەوەی سارد زیاد بکە',
      lettuce: 'خاس 🥬',
      lettuceNormal: 'خاسی ئاسایی',
      lettuceExtra: 'خاسی زیاتر 🥬',
      lettuceNone: 'بێ خاس 🚫',
      sauce: 'سۆس 🥣',
      sauceNormal: 'سۆسی ئاسایی',
      sauceExtra: 'سۆسی زیاتر 🥣',
      sauceNone: 'بێ سۆس 🚫',
      plain: 'سادە (بێ سەوزە و سۆس) 🥪',
      plainDesc: 'تەنها مریشکی سوورکراوە بێ هیچ سۆس و سەوزەیەک',
    },
    dietary: {
      halal: '١٠٠٪ حەڵاڵ',
      vegetarian: 'ڕووەکی',
      vegan: 'ڤیگن',
      spicy: 'تیژ 🔥',
      chefSpecial: 'پێشنیاری شێف ⭐',
      bestseller: 'پڕفرۆشترین 🔥',
      glutenFree: 'بێ گلوتین',
    },
    allergens: {
      title: 'زانیاری هەستیاری',
      nuts: 'چەرەزات',
      dairy: 'بەرهەمە شیرییەکان',
      gluten: 'گلوتین',
      eggs: 'هێلکە',
      soy: 'سۆیا',
      seafood: 'خواردنی دەریایی',
      sesame: 'کونجی',
    },
    item: {
      viewDetails: 'وردەکاری',
      close: 'داخستن',
      ingredients: 'پێکهاتە و ڕەچەتە',
      allergensNotice: 'ئاگاداری هەستیاری',
      portionSize: 'قەبارە و بەشەکان',
      extraAddons: 'زیادکراوەکان و سۆس',
      outOfStock: 'لە ئێستادا بەردەست نییە',
      available: 'بەردەستە',
      calories: 'کالۆری',
      prepTime: 'کاتی ئامادەکردن',
      minutes: 'خولەک',
      currency: 'د.ع',
      popular: 'تایبەت',
      spicyLevel: 'ئاستی تیژی و بەهارات',
      mild: 'ئاسایی 🟢',
      spicy: 'تیژ 🌶️',
      superSpicy: 'زۆر تیژ 🔥',
    },
    sauces: {
      cheese: 'پەنیری تواوە 🧀',
      garlic: 'سۆسی سیر 🧄',
      bbq: 'باربیکیۆ 🍖',
      honey: 'هەنگوین و خەردەل 🍯',
    },
    quickActions: {
      directionsGoogleMaps: 'شوێن لەسەر گووگڵ ماپس',
      restaurantHours: 'کاتی کارکردن',
      contactUs: 'پەیوەندیمان پێوە بکەن',
      shareMenu: 'هاوبەشکردنی مێنیو',
      shareMenuWhatsapp: 'لە واتسئاپ هاوبەشی بکە',
      shareMenuText: '🍗 مێنیوی سوپەر فراید ببینە (کازمیە - باب المراد):',
      copyMenuLink: 'کۆپیکردنی بەستەر',
      menuLinkCopied: 'بەستەرەکە کۆپی کرا!',
    },
  },

  tr: {
    appName: 'Super Fried',
    viewMenu: 'Menüyü İncele',
    exploreCategories: 'Kategoriler ve Lezzetler',
    searchPlaceholder: 'Burger, rizo, strips veya malzeme ara...',
    allCategories: 'Tümü',
    allDietary: 'Tüm Seçenekler',
    itemsCount: 'ürün',
    noResults: 'Eşleşen lezzet bulunamadı',
    noResultsDesc: 'Arama kelimenizi değiştirin veya farklı bir kategori seçin.',
    resetFilters: 'Tüm Menüyü Göster',
    price: 'Fiyat',
    theme: {
      toggleTheme: 'Temayı Değiştir',
      lightMode: 'Gündüz Modu (Açık)',
      darkMode: 'Gece Modu (Koyu)',
    },
    cart: {
      title: 'Sipariş Sepetiniz',
      addToCart: 'Sepete Ekle',
      addedToCart: 'Sepete eklendi!',
      orderNow: 'WhatsApp ile Sipariş Ver ⚡',
      sendViaWhatsApp: "WhatsApp'tan Siparişi Gönder 📲",
      cartEmpty: 'Sepetiniz boş',
      cartEmptyDesc: 'Sipariş vermek için menüden lezzetli çıtır ürünlerimizi seçin.',
      total: 'Genel Toplam',
      subtotal: 'Ara Toplam',
      customerName: 'Müşteri Adı',
      customerNamePlaceholder: 'Örn: Ahmet Yılmaz',
      customerPhone: 'Telefon Numarası (isteğe bağlı)',
      customerPhonePlaceholder: '0770xxxxxxx',
      orderType: 'Sipariş Türü',
      dineIn: 'Restoran / Masada 🍽️',
      takeaway: 'Paket / Gel-Al 🥡',
      delivery: 'Adrese Teslimat 🛵',
      tableOrAddress: 'Masa No veya Teslimat Adresi',
      tableOrAddressPlaceholder: 'Masa 4 veya Adres...',
      tableNumber: 'Masa Numarası (Salonda)',
      tableNumberPlaceholder: 'Örn: Masa 4',
      pickupDetails: 'Gel-Al Detayları',
      pickupDetailsPlaceholder: 'Örn: 15 dakika içinde teslim alacağım',
      deliveryAddress: 'Tam Teslimat Adresi',
      deliveryAddressPlaceholder: 'Mahalle, Sokak, Tarif...',
      useCurrentLocation: 'Mevcut Konumumu Ekle 📍',
      locating: 'Konum alınıyor...',
      locationDetected: 'Konum başarıyla eklendi 📍',
      locationError: 'Konum alınamadı, lütfen manuel yazın',
      comboMealBadge: 'Kombo Menü 🍟🥤',
      customizationSummary: 'Özelleştirme',
      notes: 'Özel İstekler / Notlar',
      notesPlaceholder: 'Örn: Soğansız olsun, bol soslu...',
      items: 'ürün',
      clearCart: 'Sepeti Temizle',
      checkoutTitle: 'Siparişi Onayla ve Mutfağa Gönder',
      spiceLevel: 'Acılık Seviyesi',
      selectedSauces: 'Ekstra Soslar',
      quantity: 'Adet',
      whatsappOrderNote: 'Siparişiniz Türkçe ve mutfak için anında Arapça çevirisiyle iletilecektir',
    },
    customization: {
      title: 'Menü ve Malzeme Özelleştirme',
      makeItMeal: 'Menüye Dönüştür (Patates + İçecek) 🍟🥤',
      makeItMealDesc: 'Çıtır patates kızartması ve soğuk içecek ekle',
      lettuce: 'Marul 🥬',
      lettuceNormal: 'Normal Marul',
      lettuceExtra: 'Bol Marul 🥬',
      lettuceNone: 'Marulsuz 🚫',
      sauce: 'Sos 🥣',
      sauceNormal: 'Normal Sos',
      sauceExtra: 'Bol Sos 🥣',
      sauceNone: 'Sossuz 🚫',
      plain: 'Sade (Yeşilliksiz ve Sossuz) 🥪',
      plainDesc: 'Sadece çıtır tavuk ve ekmek, sos ve yeşilliksiz',
    },
    dietary: {
      halal: '%100 Helal',
      vegetarian: 'Vejetaryen',
      vegan: 'Vegan',
      spicy: 'Acılı 🔥',
      chefSpecial: 'Şefin Önerisi ⭐',
      bestseller: 'En Çok Satan 🔥',
      glutenFree: 'Glutensiz',
    },
    allergens: {
      title: 'Alerjen Bilgisi',
      nuts: 'Kuruyemiş',
      dairy: 'Süt Ürünleri',
      gluten: 'Gluten',
      eggs: 'Yumurta',
      soy: 'Soya',
      seafood: 'Deniz Ürünleri',
      sesame: 'Susam',
    },
    item: {
      viewDetails: 'Detayları Gör',
      close: 'Kapat',
      ingredients: 'İçindekiler ve Tarif',
      allergensNotice: 'Alerjen Uyarısı',
      portionSize: 'Porsiyon ve Boyut',
      extraAddons: 'Ekstralar ve Soslar',
      outOfStock: 'Geçici Olarak Tükendi',
      available: 'Mevcut',
      calories: 'Kalori',
      prepTime: 'Hazırlık Süresi',
      minutes: 'dk',
      currency: 'IQD',
      popular: 'Özel',
      spicyLevel: 'Acı ve Baharat Oranı',
      mild: 'Normal 🟢',
      spicy: 'Acılı 🌶️',
      superSpicy: 'Süper Acı 🔥',
    },
    sauces: {
      cheese: 'Eritilmiş Peynir 🧀',
      garlic: 'Sarımsaklı Sos 🧄',
      bbq: 'Barbekü Sos 🍖',
      honey: 'Ballı Hardal 🍯',
    },
    quickActions: {
      directionsGoogleMaps: "Google Haritalar'da Yol Tarifi",
      restaurantHours: 'Çalışma Saatleri',
      contactUs: 'İletişim',
      shareMenu: 'Menüyü Paylaş',
      shareMenuWhatsapp: "WhatsApp'ta Paylaş",
      shareMenuText: '🍗 Super Fried dijital menüsünü inceleyin (Kazımiye - Bab Al-Murad):',
      copyMenuLink: 'Bağlantıyı Kopyala',
      menuLinkCopied: 'Bağlantı kopyalandı!',
    },
  },

  fa: {
    appName: 'سوپر فراید',
    viewMenu: 'مشاهده منو',
    exploreCategories: 'دسته‌بندی‌ها و غذاها',
    searchPlaceholder: 'جستجوی برگر، ریزو، استریپس یا مواد اولیه...',
    allCategories: 'همه',
    allDietary: 'همه گزینه‌ها',
    itemsCount: 'غذا',
    noResults: 'غذای منطبقی یافت نشد',
    noResultsDesc: 'کلمه جستجو را تغییر دهید یا دسته‌بندی دیگری انتخاب کنید.',
    resetFilters: 'نمایش تمام منو',
    price: 'قیمت',
    theme: {
      toggleTheme: 'تغییر تم',
      lightMode: 'حالت روز (روشن)',
      darkMode: 'حالت شب (تاریک)',
    },
    cart: {
      title: 'سبد سفارش شما',
      addToCart: 'افزودن به سبد خرید',
      addedToCart: 'به سبد افزوده شد!',
      orderNow: 'سفارش از واتساپ ⚡',
      sendViaWhatsApp: 'ارسال سفارش در واتساپ 📲',
      cartEmpty: 'سبد سفارش شما خالی است',
      cartEmptyDesc: 'غذاهای لذیذ و ترد را از منو انتخاب و سفارش خود را ثبت کنید.',
      total: 'مجموع نهایی',
      subtotal: 'مجموع جزء',
      customerName: 'نام مشتری گرامی',
      customerNamePlaceholder: 'مثال: علی رضایی',
      customerPhone: 'شماره تماس (اختیاری)',
      customerPhonePlaceholder: '0770xxxxxxx',
      orderType: 'نوع سفارش',
      dineIn: 'سالن رستوران 🍽️',
      takeaway: 'بیرون‌بر / تحویل حضوری 🥡',
      delivery: 'ارسال با پیک 🛵',
      tableOrAddress: 'شماره میز یا آدرس تحویل',
      tableOrAddressPlaceholder: 'میز شماره ۴ یا آدرس...',
      tableNumber: 'شماره میز (سالن)',
      tableNumberPlaceholder: 'مثال: میز شماره ۴',
      pickupDetails: 'جزئیات بیرون‌بر',
      pickupDetailsPlaceholder: 'مثال: تحویل تا ۱۵ دقیقه دیگر',
      deliveryAddress: 'آدرس کامل تحویل پیک',
      deliveryAddressPlaceholder: 'منطقه، خیابان، نشانه دقیق...',
      useCurrentLocation: 'افزودن موقعیت مکانی من 📍',
      locating: 'در حال دریافت موقعیت...',
      locationDetected: 'موقعیت با موفقیت ثبت شد 📍',
      locationError: 'خطا در دریافت موقعیت، لطفاً دستی وارد کنید',
      comboMealBadge: 'وعده کامل 🍟🥤',
      customizationSummary: 'شخصی‌سازی',
      notes: 'توضیحات و یادداشت سفارش',
      notesPlaceholder: 'مثال: بدون پیاز، سس اضافه...',
      items: 'آیتم',
      clearCart: 'خالی کردن سبد',
      checkoutTitle: 'تایید و ارسال سفارش به آشپزخانه',
      spiceLevel: 'درجه تندی',
      selectedSauces: 'سس‌های اضافه',
      quantity: 'تعداد',
      whatsappOrderNote: 'سفارش شما به همراه ترجمه عربی دقیق برای آشپزخانه ارسال می‌شود',
    },
    customization: {
      title: 'شخصی‌سازی و تغییر مخلفات',
      makeItMeal: 'تبدیل به وعده کامل (سیب‌زمینی + نوشابه) 🍟🥤',
      makeItMealDesc: 'افزودن سیب‌زمینی ترد داغ و نوشیدنی خنک',
      lettuce: 'کاهو 🥬',
      lettuceNormal: 'کاهوی معمولی',
      lettuceExtra: 'کاهوی اضافه 🥬',
      lettuceNone: 'بدون کاهو 🚫',
      sauce: 'سس 🥣',
      sauceNormal: 'سس معمولی',
      sauceExtra: 'سس اضافه 🥣',
      sauceNone: 'بدون سس 🚫',
      plain: 'ساده (بدون سبزیجات و سس) 🥪',
      plainDesc: 'فقط مرغ سوخاری ترد و نان، بدون هیچ مخلفات',
    },
    dietary: {
      halal: '۱۰۰٪ حلال',
      vegetarian: 'گیاهی',
      vegan: 'وگان',
      spicy: 'تند 🔥',
      chefSpecial: 'پیشنهاد سرآشپز ⭐',
      bestseller: 'پرفروش‌ترین 🔥',
      glutenFree: 'بدون گلوتن',
    },
    allergens: {
      title: 'اطلاعات حساسیت غذایی',
      nuts: 'مغزیجات',
      dairy: 'لبنیات',
      gluten: 'گلوتن',
      eggs: 'تخم مرغ',
      soy: 'سویا',
      seafood: 'غذاهای دریایی',
      sesame: 'کنجد',
    },
    item: {
      viewDetails: 'مشاهده جزئیات',
      close: 'بستن',
      ingredients: 'مواد تشکیل دهنده و دستور پخت',
      allergensNotice: 'هشدار حساسیت',
      portionSize: 'اندازه و پرس',
      extraAddons: 'افزودنی‌ها و سس',
      outOfStock: 'در حال حاضر موجود نیست',
      available: 'موجود',
      calories: 'کالری',
      prepTime: 'زمان آماده‌سازی',
      minutes: 'دقیقه',
      currency: 'دینار',
      popular: 'ویژه',
      spicyLevel: 'درجه تندی و ادویه',
      mild: 'معمولی 🟢',
      spicy: 'تند 🌶️',
      superSpicy: 'فوق‌العاده تند 🔥',
    },
    sauces: {
      cheese: 'پنیر آب شده 🧀',
      garlic: 'سس سیر کرمی 🧄',
      bbq: 'باربیکیو دودی 🍖',
      honey: 'عسل و خردل 🍯',
    },
    quickActions: {
      directionsGoogleMaps: 'مسیریابی روی گوگل مپ',
      restaurantHours: 'ساعات کاری',
      contactUs: 'تماس با ما',
      shareMenu: 'اشتراک‌گذاری منو',
      shareMenuWhatsapp: 'اشتراک در واتساپ',
      shareMenuText: '🍗 منوی دیجیتال سوپر فراید (کاظمیه - باب المراد):',
      copyMenuLink: 'کپی لینک منو',
      menuLinkCopied: 'لینک کپی شد!',
    },
  },

  ur: {
    appName: 'سپر فرائیڈ',
    viewMenu: 'مینو دیکھیں',
    exploreCategories: 'اقسام اور کھانے',
    searchPlaceholder: 'برگر، ریزو، اسٹرپس یا اجزاء تلاش کریں...',
    allCategories: 'تمام',
    allDietary: 'تمام آپشنز',
    itemsCount: 'ڈشز',
    noResults: 'کوئی ڈش نہیں ملی',
    noResultsDesc: 'تلاش کا لفظ تبدیل کریں یا کوئی دوسرا سیکشن منتخب کریں۔',
    resetFilters: 'تمام مینو دیکھیں',
    price: 'قیمت',
    theme: {
      toggleTheme: 'تھیم تبدیل کریں',
      lightMode: 'دن کا موڈ (روشن)',
      darkMode: 'رات کا موڈ (تاریک)',
    },
    cart: {
      title: 'آپ کا آرڈر کارٹ',
      addToCart: 'کارٹ میں شامل کریں',
      addedToCart: 'کارٹ میں شامل ہو گیا!',
      orderNow: 'واٹس ایپ پر آرڈر کریں ⚡',
      sendViaWhatsApp: 'واٹس ایپ پر آرڈر بھیجیں 📲',
      cartEmpty: 'آپ کا کارٹ خالی ہے',
      cartEmptyDesc: 'مینو سے اپنے پسندیدہ کرسپی کھانے منتخب کر کے آرڈر شروع کریں۔',
      total: 'کل رقم',
      subtotal: 'ذیلی کل',
      customerName: 'محترم گاہک کا نام',
      customerNamePlaceholder: 'مثال: محمد علی',
      customerPhone: 'فون نمبر (اختیاری)',
      customerPhonePlaceholder: '0770xxxxxxx',
      orderType: 'آرڈر کی قسم',
      dineIn: 'ہال میں ڈائن ان 🍽️',
      takeaway: 'پارسل / ٹیک اوے 🥡',
      delivery: 'ہوم ڈیلیوری 🛵',
      tableOrAddress: 'ٹیبل نمبر یا ڈیلیوری کا پتہ',
      tableOrAddressPlaceholder: 'ٹیبل نمبر 4 یا پتہ...',
      tableNumber: 'ٹیبل نمبر (ہال میں)',
      tableNumberPlaceholder: 'مثال: ٹیبل نمبر 4',
      pickupDetails: 'ٹیک اوے کی تفصیلات',
      pickupDetailsPlaceholder: 'مثال: 15 منٹ میں وصولی',
      deliveryAddress: 'ہوم ڈیلیوری کا مکمل پتہ',
      deliveryAddressPlaceholder: 'علاقہ، گلی، قریبی نشانی...',
      useCurrentLocation: 'میری موجودہ لوکیشن شامل کریں 📍',
      locating: 'لوکیشن تلاش کی جا رہی ہے...',
      locationDetected: 'لوکیشن کامیابی سے شامل ہو گئی 📍',
      locationError: 'لوکیشن حاصل نہ ہو سکی، براہ کرم خود لکھیں',
      comboMealBadge: 'مکمل میل 🍟🥤',
      customizationSummary: 'ترتیب',
      notes: 'اضافی ہدایات / نوٹ',
      notesPlaceholder: 'مثال: پیاز کے بغیر، زیادہ ساس...',
      items: 'آئٹمز',
      clearCart: 'کارٹ خالی کریں',
      checkoutTitle: 'آرڈر کی تصدیق اور کچن کو روانگی',
      spiceLevel: 'مرچ کا لیول',
      selectedSauces: 'اضافی ساسز',
      quantity: 'تعداد',
      whatsappOrderNote: 'آپ کا آرڈر اردو اور ساتھ ہی کچن کے لیے عربی ترجمے کے ساتھ بھیجا جائے گا',
    },
    customization: {
      title: 'کھانے کی ترتیبات و تبدیلیاں',
      makeItMeal: 'مکمل میل میں تبدیل کریں (فرائز + مشروب) 🍟🥤',
      makeItMealDesc: 'گرم خستہ فرائز اور ٹھنڈا کولڈ ڈرنک شامل کریں',
      lettuce: 'سلاد پتا / لیٹس 🥬',
      lettuceNormal: 'نارمل سلاد پتا',
      lettuceExtra: 'اضافی سلاد پتا 🥬',
      lettuceNone: 'سلاد پتا کے بغیر 🚫',
      sauce: 'ساس 🥣',
      sauceNormal: 'نارمل ساس',
      sauceExtra: 'اضافی ساس 🥣',
      sauceNone: 'ساس کے بغیر 🚫',
      plain: 'سادہ (بغیر سبزی اور ساس) 🥪',
      plainDesc: 'صرف کرسپی چکن اور بن، بغیر کسی ساس یا سبزی کے',
    },
    dietary: {
      halal: '100% حلال',
      vegetarian: 'سبزی خور',
      vegan: 'ویگن',
      spicy: 'تیکھا 🔥',
      chefSpecial: 'شیف کی خاص پیشکش ⭐',
      bestseller: 'سب سے زیادہ فروخت 🔥',
      glutenFree: 'گلوٹین فری',
    },
    allergens: {
      title: 'الرجی کی معلومات',
      nuts: 'ڈرائی فروٹ',
      dairy: 'دودھ و پنیر',
      gluten: 'گلوٹین و گندم',
      eggs: 'انڈے',
      soy: 'سویا',
      seafood: 'سمندری خوراک',
      sesame: 'تل',
    },
    item: {
      viewDetails: 'تفصیلات دیکھیں',
      close: 'بند کریں',
      ingredients: 'اجزاء و ترکیب',
      allergensNotice: 'الرجی کی معلومات',
      portionSize: 'سائز اور مقدار',
      extraAddons: 'اضافی ساس اور لوازمات',
      outOfStock: 'عارضی طور پر ختم',
      available: 'دستیاب',
      calories: 'کیلوریز',
      prepTime: 'تیاری کا وقت',
      minutes: 'منٹ',
      currency: 'د.ع',
      popular: 'سب سے پسندیدہ',
      spicyLevel: 'اسپائس لیول و مرچ',
      mild: 'نارمل 🟢',
      spicy: 'تیکھا / اسپائسی 🌶️',
      superSpicy: 'بہت زیادہ تیکھا 🔥',
    },
    sauces: {
      cheese: 'پگھلا ہوا پنیر 🧀',
      garlic: 'گارلک ساس 🧄',
      bbq: 'باربی کیو ساس 🍖',
      honey: 'ہنی مسٹرڈ 🍯',
    },
    quickActions: {
      directionsGoogleMaps: 'گوگل میپس پر لوکیشن',
      restaurantHours: 'اوقات کار',
      contactUs: 'رابطہ کریں',
      shareMenu: 'مینو شیئر کریں',
      shareMenuWhatsapp: 'واٹس ایپ پر شیئر کریں',
      shareMenuText: '🍗 سوپر فرائیڈ ریسٹورنٹ (کاظمیہ - باب المراد) کا ڈیجیٹل مینو ملاحظہ کریں:',
      copyMenuLink: 'مینو کا لنک کاپی کریں',
      menuLinkCopied: 'مینو کا لنک کاپی ہو گیا!',
    },
  },
};

export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'ar';
  
  const searchParams = new URLSearchParams(window.location.search);
  const langParam = searchParams.get('lang');
  if (langParam && ['ar', 'en', 'ku', 'tr', 'fa', 'ur'].includes(langParam)) {
    return langParam as Language;
  }

  const stored = localStorage.getItem('superfried_menu_lang');
  if (stored && ['ar', 'en', 'ku', 'tr', 'fa', 'ur'].includes(stored)) {
    return stored as Language;
  }

  const browserLang = (navigator.language || '').toLowerCase();
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('fa')) return 'fa';
  if (browserLang.startsWith('ur')) return 'ur';
  if (browserLang.startsWith('ku')) return 'ku';
  if (browserLang.startsWith('tr')) return 'tr';
  if (browserLang.startsWith('en')) return 'en';
  return 'ar';
}

export function isRtl(lang: Language): boolean {
  return lang === 'ar' || lang === 'ku' || lang === 'fa' || lang === 'ur';
}

export function formatPrice(amount: number, currency: string, lang: Language): string {
  const isRtlLang = isRtl(lang);
  if (currency === 'IQD') {
    return isRtlLang ? `${amount.toLocaleString()} د.ع` : `${amount.toLocaleString()} IQD`;
  }
  if (currency === 'TRY') {
    return `${amount.toLocaleString()} ₺`;
  }
  if (currency === 'SAR') {
    return isRtlLang ? `${amount.toLocaleString()} ر.س` : `${amount.toLocaleString()} SAR`;
  }
  if (currency === 'AED') {
    return isRtlLang ? `${amount.toLocaleString()} د.إ` : `${amount.toLocaleString()} AED`;
  }
  if (currency === 'EUR') {
    return `€${amount.toLocaleString()}`;
  }
  return `$${amount.toLocaleString()}`;
}

/**
 * Generate bilingual WhatsApp message with the customer's selected language
 * AND the Arabic kitchen translation alongside each item and modification.
 */
export function generateBilingualWhatsAppMessage({
  cartItems,
  customerInfo,
  settings,
  currentLang,
}: {
  cartItems: CartItem[];
  customerInfo: OrderCustomerInfo;
  settings: RestaurantSettings;
  currentLang: Language;
}): string {
  const t = translations[currentLang];
  const isArabic = currentLang === 'ar';

  const restaurantName = settings.name[currentLang] || settings.name.ar;

  // Header
  let msg = `🍗 *طلب جديد من مطعم سوبر فرايد*\n`;
  if (!isArabic) {
    msg += `*New Order from ${restaurantName}*\n`;
  }
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;

  // Customer info
  if (customerInfo.customerName) {
    msg += `👤 *الزبون / Customer:* ${customerInfo.customerName}\n`;
  }
  if (customerInfo.customerPhone) {
    msg += `📱 *الهاتف / Phone:* ${customerInfo.customerPhone}\n`;
  }

  // Order Type & Location details
  const orderTypeLabels: Record<string, { ar: string; other: string; descAr: string; descOther: string }> = {
    dine_in: { 
      ar: 'تناول داخل الصالة 🍽️', 
      other: t.cart.dineIn, 
      descAr: 'رقم الطاولة / رقم الجدول:', 
      descOther: 'Table Number:' 
    },
    takeaway: { 
      ar: 'استلام سفري 🥡', 
      other: t.cart.takeaway, 
      descAr: 'تفاصيل الاستلام:', 
      descOther: 'Pickup Details:' 
    },
    delivery: { 
      ar: 'توصيل ديليفري 🛵', 
      other: t.cart.delivery, 
      descAr: 'عنوان التوصيل الكامل:', 
      descOther: 'Delivery Address:' 
    },
  };
  const typeObj = orderTypeLabels[customerInfo.orderType] || orderTypeLabels.dine_in;
  msg += `📍 *نوع الطلب / Order Type:* ${typeObj.ar} ${!isArabic ? `(${typeObj.other})` : ''}\n`;

  if (customerInfo.tableOrAddress) {
    msg += `📌 *${typeObj.descAr} / ${typeObj.descOther}* ${customerInfo.tableOrAddress}\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🛒 *تفاصيل الوجبات والطلبات / Order Items:*\n\n`;

  let grandTotal = 0;

  cartItems.forEach((item, idx) => {
    grandTotal += item.totalPrice;
    const itemNum = idx + 1;
    const nameCurrent = item.menuItem.name[currentLang] || item.menuItem.name.ar;
    const nameArabic = item.menuItem.name.ar;

    // Item line: Name in user language + (Arabic)
    let itemTitle = `*${itemNum}. ${nameArabic}*`;
    if (!isArabic && nameCurrent !== nameArabic) {
      itemTitle = `*${itemNum}. ${nameCurrent} (${nameArabic})*`;
    }
    msg += `${itemTitle} × ${item.quantity}\n`;

    // Size option
    if (item.selectedSize) {
      const sizeCurrent = item.selectedSize.name[currentLang] || item.selectedSize.name.ar;
      const sizeAr = item.selectedSize.name.ar;
      if (!isArabic && sizeCurrent !== sizeAr) {
        msg += `   ▫️ الحجم / Size: ${sizeCurrent} (${sizeAr})\n`;
      } else {
        msg += `   ▫️ الحجم / Size: ${sizeAr}\n`;
      }
    }

    // Meal / Combo upgrade
    if (item.isMeal) {
      if (!isArabic) {
        msg += `   ▫️ تحويل لوجبة / Combo Meal: ${t.customization.makeItMeal} (وجبة كاملة بطاطا + بيبسي)\n`;
      } else {
        msg += `   ▫️ وجبة كاملة: بطاطا مقرمشة + بيبسي بارد 🍟🥤\n`;
      }
    }

    // Spice level
    if (item.selectedSpice) {
      const spiceArMap = {
        mild: 'عادي 🟢',
        spicy: 'سبايسي 🌶️',
        super: 'سوبر نار 🔥',
      };
      const spiceLangMap = {
        mild: t.item.mild,
        spicy: t.item.spicy,
        super: t.item.superSpicy,
      };
      const spAr = spiceArMap[item.selectedSpice];
      const spLang = spiceLangMap[item.selectedSpice];
      if (!isArabic) {
        msg += `   ▫️ درجة الحرارة / Spice: ${spLang} (${spAr})\n`;
      } else {
        msg += `   ▫️ درجة الحرارة: ${spAr}\n`;
      }
    }

    // Customization (Lettuce, Sauce, Plain)
    if (item.customizations) {
      const { isPlain, lettuce, sauce } = item.customizations;
      if (isPlain) {
        if (!isArabic) {
          msg += `   ▫️ التخصيص / Customization: ${t.customization.plain} (سادة بدون خضار أو صوصات)\n`;
        } else {
          msg += `   ▫️ التخصيص: سادة (بدون خضار أو صوصات) 🥪\n`;
        }
      } else {
        const customPartsAr: string[] = [];
        const customPartsLang: string[] = [];

        if (lettuce === 'none') {
          customPartsAr.push('بدون خس 🚫');
          customPartsLang.push(t.customization.lettuceNone);
        } else if (lettuce === 'extra') {
          customPartsAr.push('زيادة خس 🥬');
          customPartsLang.push(t.customization.lettuceExtra);
        }

        if (sauce === 'none') {
          customPartsAr.push('بدون صوص 🚫');
          customPartsLang.push(t.customization.sauceNone);
        } else if (sauce === 'extra') {
          customPartsAr.push('زيادة صوص 🥣');
          customPartsLang.push(t.customization.sauceExtra);
        }

        if (customPartsAr.length > 0) {
          if (!isArabic) {
            msg += `   ▫️ التخصيص / Customization: ${customPartsLang.join(' + ')} (${customPartsAr.join(' + ')})\n`;
          } else {
            msg += `   ▫️ التخصيص: ${customPartsAr.join(' + ')}\n`;
          }
        }
      }
    }

    // Addons / Extra Sauces
    if (item.selectedAddons && item.selectedAddons.length > 0) {
      const saucesText = item.selectedAddons
        .map((addonSauce) => {
          const sLang = addonSauce.name[currentLang] || addonSauce.name.ar;
          const sAr = addonSauce.name.ar;
          return !isArabic && sLang !== sAr ? `${sLang} (${sAr})` : sAr;
        })
        .join(' + ');
      msg += `   ▫️ الصلصات الإضافية / Sauces: ${saucesText}\n`;
    }

    // Item Notes
    if (item.notes) {
      msg += `   ▫️ ملاحظة / Note: ${item.notes}\n`;
    }

    // Item subtotal
    msg += `   💵 السعر / Price: ${item.totalPrice.toLocaleString()} د.ع\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *المجموع الإجمالي / Grand Total:* ${grandTotal.toLocaleString()} د.ع\n`;

  if (customerInfo.notes) {
    msg += `📝 *ملاحظات عامة / General Notes:* ${customerInfo.notes}\n`;
  }

  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  msg += `⏰ *وقت الإرسال / Time:* ${timeStr}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `✨ *شكراً لاختياركم سوبر فرايد | Thank you for choosing Super Fried!*`;

  return msg;
}

