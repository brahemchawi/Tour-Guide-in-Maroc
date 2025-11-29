import { Language } from './types';

interface TranslationStrings {
  appTitle: string;
  subtitle: string;
  welcome: string;
  inputPlaceholder: string;
  send: string;
  chatMode: string;
  mapMode: string;
  locationSet: string;
  resetChat: string;
  deleteChat: string;
  settings: string;
  language: string;
  data: string;
  subscription: string;
  ads: string;
  planFree: string;
  clearData: string;
  disclaimer: string;
  account: string;
  upgrade: string;
  general: string;
  about: string;
  version: string;
  privacy: string;
  enableAds: string;
  updateApp: string;
  // Subscription specific
  currentPlan: string;
  subscribeNow: string;
  featuresDesc: string;
  
  // Theme keys
  appearance: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  
  chips: {
    restaurants: string;
    hotels: string;
    attractions: string;
    plan: string;
    carRental: string;
  };
  prompts: {
    restaurants: string;
    hotels: string;
    attractions: string;
    plan: string;
    carRental: string;
  };
  map: {
    searching: string;
    found: (count: number) => string;
    notFound: string;
    yourLocation: string;
    defaultLocation: string;
    details: string;
  };
  error: string;
}

export const translations: Record<string, TranslationStrings> = {
  ar: {
    appTitle: "Moroccan Tour Guide",
    subtitle: "الرفيق الذكي للسفر",
    welcome: "أهلاً بك! أنا \"مرشد\"، دليلك السياحي الذكي. 🌍\n\nكيف يمكنني مساعدتك اليوم؟ أستطيع اقتراح وجهات سياحية، مطاعم، فنادق، أو تخطيط رحلة كاملة لك.",
    inputPlaceholder: "اسأل عن وجهة، مطعم، أو خطة سياحية...",
    send: "إرسال",
    chatMode: "محادثة",
    mapMode: "الخريطة",
    locationSet: "تم تحديد موقعك",
    resetChat: "بدء محادثة جديدة",
    deleteChat: "حذف المحادثة",
    settings: "الإعدادات",
    language: "اللغة",
    data: "البيانات والخصوصية",
    subscription: "الاشتراك",
    ads: "الإعلانات",
    planFree: "خطة مجانية",
    clearData: "إزالة البيانات",
    disclaimer: "يمكن لمرشد ارتكاب الأخطاء. يرجى التحقق من المعلومات المهمة.",
    account: "الحساب",
    upgrade: "ترقية للحصول على مميزات إضافية",
    general: "عام",
    about: "عن التطبيق",
    version: "الإصدار 1.2.0",
    privacy: "سياسة الخصوصية",
    enableAds: "تفعيل الإعلانات لدعم التطبيق",
    updateApp: "تحديث عبر Google Play",
    currentPlan: "الخطة الحالية",
    subscribeNow: "اشترك الآن",
    featuresDesc: "مرشد خاص يرافقك، يدعم لغتك، وبلا إعلانات",
    appearance: "المظهر",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeSystem: "تلقائي",
    chips: {
      restaurants: "مطاعم ومقاهي",
      hotels: "فنادق وإقامة",
      attractions: "معالم سياحية",
      plan: "خطة يومية",
      carRental: "كراء السيارات",
    },
    prompts: {
      restaurants: "أعطني قائمة بأفضل المطاعم والمقاهي المحلية هنا مع التقييمات، الأسعار، وساعات العمل.",
      hotels: "اقترح لي فنادق مميزة هنا. اذكر لي سعر الليلة بالعملة المحلية، عدد النجوم، المميزات (مثل مسبح أو إفطار)، وكم تبعد عن المعالم الرئيسية.",
      attractions: "ما هي أبرز المعالم السياحية القريبة؟",
      plan: "اقترح لي خطة سياحية لقضاء يوم ممتع هنا.",
      carRental: "ابحث لي عن مكاتب كراء السيارات (تأجير سيارات) القريبة والموثوقة. اذكر التقييمات، أنواع السيارات المتوفرة، ومتوسط الأسعار اليومية.",
    },
    map: {
      searching: "جاري تحديد المواقع على الخريطة...",
      found: (c) => `تم تحديد ${c} أماكن`,
      notFound: "لم يتم العثور على إحداثيات دقيقة",
      yourLocation: "موقعك الحالي",
      defaultLocation: "الموقع الافتراضي",
      details: "انقر للتفاصيل في المحادثة"
    },
    error: "عذراً، حدث خطأ غير متوقع."
  },
  en: {
    appTitle: "Moroccan Tour Guide",
    subtitle: "AI Travel Companion",
    welcome: "Welcome! I am \"Murshid\", your intelligent tour guide. 🌍\n\nHow can I help you today? I can suggest destinations, restaurants, hotels, or plan a full trip for you.",
    inputPlaceholder: "Ask about a destination, restaurant, or trip plan...",
    send: "Send",
    chatMode: "Chat",
    mapMode: "Map",
    locationSet: "Location Set",
    resetChat: "New Chat",
    deleteChat: "Delete Chat",
    settings: "Settings",
    language: "Language",
    data: "Data & Privacy",
    subscription: "Subscription",
    ads: "Ads",
    planFree: "Free Plan",
    clearData: "Remove Data",
    disclaimer: "Murshid can make mistakes. Please verify important information.",
    account: "Account",
    upgrade: "Upgrade for more features",
    general: "General",
    about: "About",
    version: "Version 1.2.0",
    privacy: "Privacy Policy",
    enableAds: "Enable ads to support the app",
    updateApp: "Update on Google Play",
    currentPlan: "Current Plan",
    subscribeNow: "Subscribe Now",
    featuresDesc: "Private companion, Native language support, No ads",
    appearance: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    chips: {
      restaurants: "Food & Drink",
      hotels: "Hotels",
      attractions: "Attractions",
      plan: "Daily Plan",
      carRental: "Rent a Car",
    },
    prompts: {
      restaurants: "Give me a list of the best local restaurants and cafes here with ratings, prices, and opening hours.",
      hotels: "Suggest distinct hotels here. Mention the price per night, star rating, amenities (like pool or breakfast), and proximity to landmarks.",
      attractions: "What are the top tourist attractions nearby?",
      plan: "Suggest a 1-day itinerary for a fun day here.",
      carRental: "Find reliable car rental agencies nearby. Include ratings, car types, and approximate daily prices.",
    },
    map: {
      searching: "Locating places on map...",
      found: (c) => `Found ${c} places`,
      notFound: "No precise coordinates found",
      yourLocation: "Your Location",
      defaultLocation: "Default Location",
      details: "Click for details in chat"
    },
    error: "Sorry, an unexpected error occurred."
  }
};