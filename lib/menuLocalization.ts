import { MenuItem, Category, Language, MultilingualText } from '@/types/menu';

/**
 * Universal text resolver that guarantees a non-empty string in the requested language
 * with intelligent fallback hierarchy:
 * requestedLang -> fa/ur/ku/tr/en mapping -> ar
 */
export function getLocalizedText(
  textObj: MultilingualText | undefined | null,
  lang: Language,
  defaultAr = ''
): string {
  if (!textObj) return defaultAr;
  if (textObj[lang]) return textObj[lang]!;
  if (lang === 'fa' && textObj.fa) return textObj.fa;
  if (lang === 'ur' && textObj.ur) return textObj.ur;
  if (lang === 'ku' && textObj.ku) return textObj.ku;
  if (lang === 'tr' && textObj.tr) return textObj.tr;
  if (lang === 'en' && textObj.en) return textObj.en;
  return textObj.ar || defaultAr;
}

/**
 * Rich Persian & Urdu translations for all descriptions & recipes
 * to ensure 100% complete multilingual coverage.
 */
const extraTranslations: Record<string, {
  description: { fa: string; ur: string };
  ingredients: { fa: string; ur: string };
}> = {
  'burger-super': {
    description: {
      fa: 'برگر سوپر غول‌پیکر با سس مخصوص سوپر، پنیر چدار فراوان و سبزیجات تازه در نان بریوش تازه.',
      ur: 'دیو ہیکل سپر برگر مخصوص سپر ساس، پگھلا ہوا شیڈر پنیر اور تازہ سبزیوں کے ساتھ۔',
    },
    ingredients: {
      fa: 'گوشت گوساله مزه‌دار، پنیر چدار، سس مخصوص سوپر، کاهو، گوجه، خیارشور، نان بریوش.',
      ur: 'گائے کا قیمہ، شیڈر پنیر، اسپیشل ساس، سلاد پتہ، ٹماٹر، اچار، بریوش بن۔',
    },
  },
  'burger-brames': {
    description: {
      fa: 'برگر لذیذ برامز با ادویه‌های خاص، لایه‌های فراوان سس لذیذ و پنیر آب‌شده.',
      ur: 'اعلیٰ برامز برگر زبردست مصالحوں، ساس کی تہوں اور پگھلے ہوئے پنیر کے ساتھ۔',
    },
    ingredients: {
      fa: 'گوشت ممتاز، سس مخصوص برامز، پنیر ذوب‌شده، پیاز کاراملی، نان تست‌شده.',
      ur: 'عمدہ بیف، برامز ساس، پگھلا پنیر، کیریمل پیاز، ٹوسٹڈ بن۔',
    },
  },
  'burger-brisket': {
    description: {
      fa: 'گوشت بریسکیت دودی بسیار نرم و لذیذ همراه با سس باربیکیو و پنیر آمریکایی.',
      ur: 'دھیمی آنچ پر اسموک کیا ہوا نرم بیف برسکٹ بی بی کیو ساس اور امریکی پنیر کے ساتھ۔',
    },
    ingredients: {
      fa: 'گوشت بریسکیت دودی، سس باربیکیو دودی، پنیر چدار، خیارشور، نان بریوش.',
      ur: 'اسموکڈ بیف برسکٹ، باربی کیو ساس، شیڈر چیز، اچار، بریوش بن۔',
    },
  },
  'burger-delicious': {
    description: {
      fa: 'ترکیب بی‌نظیر از طعم‌های دلپذیر با سس خامه‌ای مخصوص و پنیر.',
      ur: 'کریمی اسپیشل ساس اور پنیر کے ساتھ متوازن اور لاجواب ذائقہ۔',
    },
    ingredients: {
      fa: 'گوشت گوساله گریل‌شده، سس خامه‌ای دلیش، پنیر، کاهو، گوجه فرنگی.',
      ur: 'گرلڈ بیف پیٹی، کریمی ڈیلش ساس، چیز، سلاد پتہ، ٹماٹر۔',
    },
  },
  'burger-monster': {
    description: {
      fa: 'برگر غول‌پیکر مانستر با ادویه پرانرژی و سس‌های دوبل برای عاشقان حجم بالا.',
      ur: 'بڑی بھوک والوں کے لیے زبردست مانسٹر برگر ڈبل ساسز کے ساتھ۔',
    },
    ingredients: {
      fa: 'تکه گوشت ضخیم، پنیر دوبل، سس‌های متنوع، پیاز سوخاری ترد.',
      ur: 'موٹی بیف پیٹی، ڈبل چیز، مختلف ساسز، کرسپی پیاز۔',
    },
  },
  'burger-volcano': {
    description: {
      fa: 'انفجار پنیر مذاب تند و سس‌های آتشفشانی پرحرارت با طعم فوق‌العاده.',
      ur: 'پگھلے ہوئے تیکھے پنیر اور وولکینو ساسز کا زبردست دھماکہ۔',
    },
    ingredients: {
      fa: 'گوشت گوساله، سس تند ولکانو، آبشار پنیر مایع، فلفل هالوپینو.',
      ur: 'بیف پیٹی، وولکینو ہاٹ ساس، پگھلا ہوا پنیر، ہالاپینو مرچ۔',
    },
  },
  'burger-classic': {
    description: {
      fa: 'برگر کلاسیک سنتی با طعم اصیل گوشت گریل‌شده، کاهو، گوجه و سس کلاسیک.',
      ur: 'اصلی کلاسک گرلڈ برگر سلاد پتہ، ٹماٹر اور روایتی ساس کے ساتھ۔',
    },
    ingredients: {
      fa: 'گوشت گوساله گریل، کاهو، گوجه، خیارشور، سس کلاسیک.',
      ur: 'گرلڈ بیف، سلاد، ٹماٹر، اچار، کلاسک ساس۔',
    },
  },
  'burger-mushroom': {
    description: {
      fa: 'برگر آبدار با سس قارچ تازه خامه‌ای، کره و پنیر سوئیسی ذوب‌شده.',
      ur: 'رسیلی بیف پیٹی، تازہ مشروم کریمی ساس اور پگھلے ہوئے پنیر کے ساتھ۔',
    },
    ingredients: {
      fa: 'گوشت گوساله، قارچ تازه، سس قارچ خامه‌ای، پنیر، نان بریوش.',
      ur: 'بیف پیٹی، تازہ مشروم، کریمی مشروم ساس، پنیر، بن۔',
    },
  },
  'burger-cheese': {
    description: {
      fa: 'برگر گوشت گریل با دو لایه پنیر چدار آمریکایی، سس مایونز و کچاپ.',
      ur: 'گرلڈ بیف برگر دوہری شیڈر پنیر اور میئونیز و کیچپ کے ساتھ۔',
    },
    ingredients: {
      fa: 'گوشت گوساله، پنیر چدار دوبل، سس پنیر، کاهو، خیارشور.',
      ur: 'بیف پیٹی، ڈبل شیڈر چیز، چیز ساس، سلاد، اچار۔',
    },
  },
  'burger-crunchy': {
    description: {
      fa: 'فیله مرغ کریسپی فوق‌العاده ترد با سس مایونز دودی و کاهوی تازه.',
      ur: 'انتہائی کرسپی چکن فلے اسموکی میئونیز اور تازہ سلاد کے ساتھ۔',
    },
    ingredients: {
      fa: 'فیله مرغ کریسپی، سس کرانچی، پنیر چدار، کاهو، نان بریوش.',
      ur: 'کرسپی چکن فلے، کرنچی ساس، شیڈر پنیر، سلاد، بریوش بن۔',
    },
  },
  'burger-chicken': {
    description: {
      fa: 'برگر مرغ نرم و خوشمزه مزه‌دار شده با ادویه ملایم، کاهو و سس مایونز.',
      ur: 'نرم اور لذیذ چکن برگر ہلکے مصالحوں اور تازہ میئونیز کے ساتھ۔',
    },
    ingredients: {
      fa: 'تکه مرغ مزه‌دار، سس مایونز، کاهوی تازه، نان تست‌شده.',
      ur: 'چکن پیٹی، میئونیز، تازہ سلاد، ٹوسٹڈ بن۔',
    },
  },
  'strips-meal-3': {
    description: {
      fa: '۳ تکه فیله سینه مرغ سوخاری ترد و طلایی همراه با سیب‌زمینی سرخ‌کرده و سس مخصوص.',
      ur: '3 گولڈن کرسپی بون لیس چکن اسٹرپس فرائز اور ساس کے ساتھ۔',
    },
    ingredients: {
      fa: '۳ تکه استریپس مرغ ترد، سیب‌زمینی سرخ‌کرده، سس، نان.',
      ur: '3 کرسپی چکن ٹینڈرز، فرینچ فرائز، ڈپنگ ساس، بن۔',
    },
  },
  'strips-meal-5': {
    description: {
      fa: '۵ تکه فیله مرغ استریپس ترد و آبدار با سیب‌زمینی فراوان و سس‌های متنوع.',
      ur: '5 انتہائی کرسپی اور جوسی چکن اسٹرپس ڈھیر سارے فرائز اور ساسز کے ساتھ۔',
    },
    ingredients: {
      fa: '۵ تکه استریپس مرغ ترد، سیب‌زمینی سرخ‌کرده، سس، کلم‌پیچ، نان.',
      ur: '5 کرسپی چکن اسٹرپس، فرائز، ڈپ ساس، کولسلا، بن۔',
    },
  },
  'strips-meal-10': {
    description: {
      fa: 'وعده خانوادگی بزرگ شامل ۱۰ تکه فیله سوخاری استریپس، سیب‌زمینی بزرگ، سالاد کلم و سس.',
      ur: '10 کرسپی چکن اسٹرپس، فیملی فرائز، مختلف ساسز اور کولسلا پر مشتمل فیملی میل۔',
    },
    ingredients: {
      fa: '۱۰ تکه مرغ سوخاری، سیب‌زمینی خانواده، سس‌های متنوع، سالاد کلم، نان تازه.',
      ur: '10 کرسپی چکن اسٹرپس، فیملی فرائز، مختلف ساسز، کولسلا، بن۔',
    },
  },
  'strips-meal-14-kentucky': {
    description: {
      fa: '۱۴ تکه سوخاری طلایی کریسپی با دستور پخت محرمانه، سیب‌زمینی خانواده و سس‌های ویژه.',
      ur: '14 گولڈن کرسپی چکن پیسز خفیہ مصالحے، فیملی فرائز اور مختلف ساسز کے ساتھ۔',
    },
    ingredients: {
      fa: '۱۴ تکه مرغ سوخاری کریسپی، سیب‌زمینی بزرگ، سس‌ها، سالاد کلم، نان.',
      ur: '14 کرسپی چکن پیسز، فیملی فرائز، ساسز، کولسلا، بن۔',
    },
  },
  'kentucky-kids-meal': {
    description: {
      fa: 'وعده سبک و دوست‌داشتنی برای کودکان شامل تکه‌های مرغ سوخاری، سیب‌زمینی و آبمیوه.',
      ur: 'بچوں کے لیے ہلکا اور پسندیدہ کھانا: کرسپی چکن بائٹس، فرائز اور جوس۔',
    },
    ingredients: {
      fa: 'تکه‌های مرغ بدون استخوان ترد، سیب‌زمینی سرخ‌کرده، سس کچاپ، آبمیوه تازه.',
      ur: 'بون لیس کرسپی چکن ٹینڈرز، فرائز، کیچپ، جوس باکس۔',
    },
  },
  'kentucky-meal-3': {
    description: {
      fa: '۳ تکه مرغ کنتاکی سوخاری با دستور محرمانه همراه با سیب‌زمینی، سس سیر تومیه، سالاد کلم و نان.',
      ur: '3 پیس کنٹاکی فرائیڈ چکن فرائز، گارلک توم، کولسلا اور بن کے ساتھ۔',
    },
    ingredients: {
      fa: '۳ تکه مرغ با استخوان سوخاری، سیب‌زمینی سرخ‌کرده، سس سیر، سالاد کلم، نان.',
      ur: '3 بون ان کرسپی چکن پیسز، فرائز، گارلک ڈپ، کولسلا، بن۔',
    },
  },
  'kentucky-meal-5': {
    description: {
      fa: '۵ تکه مرغ کنتاکی طلایی ترد از بیرون و آبدار از داخل با سیب‌زمینی، سس‌ها و نان تازه.',
      ur: '5 گولڈن فرائیڈ چکن پیسز باہر سے انتہائی کرسپی اور اندر سے جوسی۔',
    },
    ingredients: {
      fa: '۵ تکه مرغ سوخاری، سیب‌زمینی سرخ‌کرده، سس سیر، سالاد کلم، نان تازه.',
      ur: '5 کرسپی چکن پیسز، فرائز، گارلک ساس، کولسلا، بن۔',
    },
  },
  'kentucky-crispy-meal': {
    description: {
      fa: 'وعده کریسپی ویژه با سوخاری دوبل داغ همراه با سیب‌زمینی و سس‌های سوپر فراید.',
      ur: 'اضافی کرنچی چکن میل گرم گرم فرائز اور سوپر فرائیڈ ساسز کے ساتھ۔',
    },
    ingredients: {
      fa: 'تکه‌های مرغ سوخاری فوق‌العاده ترد، سیب‌زمینی مزه‌دار، سس‌ها، سالاد کلم، نان.',
      ur: 'اضافی کرسپی چکن، مصالحہ دار فرائز، ڈپنگ ساسز، کولسلا، بن۔',
    },
  },
};

export function getItemName(item: MenuItem, lang: Language): string {
  return getLocalizedText(item.name, lang, item.name.ar);
}

export function getItemDescription(item: MenuItem, lang: Language): string {
  if (lang === 'fa' && extraTranslations[item.id]?.description?.fa) {
    return extraTranslations[item.id].description.fa;
  }
  if (lang === 'ur' && extraTranslations[item.id]?.description?.ur) {
    return extraTranslations[item.id].description.ur;
  }
  return getLocalizedText(item.description, lang, item.description.ar);
}

export function getItemIngredients(item: MenuItem, lang: Language): string {
  if (lang === 'fa' && extraTranslations[item.id]?.ingredients?.fa) {
    return extraTranslations[item.id].ingredients.fa;
  }
  if (lang === 'ur' && extraTranslations[item.id]?.ingredients?.ur) {
    return extraTranslations[item.id].ingredients.ur;
  }
  return getLocalizedText(item.ingredients, lang, item.ingredients.ar);
}

export function getCategoryName(category: Category, lang: Language): string {
  return getLocalizedText(category.name, lang, category.name.ar);
}
