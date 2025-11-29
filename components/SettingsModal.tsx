import React from 'react';
import { X, Crown, Globe, Database, Megaphone, Shield, Info, CreditCard, Play, Sun, Moon, Monitor, Trash2 } from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  showAds: boolean;
  setShowAds: (show: boolean) => void;
  onClearData: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  theme,
  setTheme,
  showAds,
  setShowAds,
  onClearData
}) => {
  if (!isOpen) return null;

  const t = translations[language] || translations['en'];

  const languages = [
    { code: 'ar', name: 'العربية', greeting: 'مرحباً', country: 'sa' },
    { code: 'en', name: 'English', greeting: 'Hello', country: 'us' },
    { code: 'fr', name: 'Français', greeting: 'Bonjour', country: 'fr' },
    { code: 'es', name: 'Español', greeting: 'Hola', country: 'es' },
    { code: 'de', name: 'Deutsch', greeting: 'Hallo', country: 'de' },
    { code: 'it', name: 'Italiano', greeting: 'Ciao', country: 'it' },
    { code: 'ru', name: 'Русский', greeting: 'Привет', country: 'ru' },
    { code: 'zh', name: '中文', greeting: '你好', country: 'cn' },
    { code: 'ja', name: '日本語', greeting: 'こんにちは', country: 'jp' },
    { code: 'ko', name: '한국어', greeting: '안녕하세요', country: 'kr' },
    { code: 'tr', name: 'Türkçe', greeting: 'Merhaba', country: 'tr' },
    { code: 'pt', name: 'Português', greeting: 'Olá', country: 'br' },
    // Extended Languages
    { code: 'hi', name: 'हिन्दी', greeting: 'नमस्ते', country: 'in' },
    { code: 'id', name: 'Indonesia', greeting: 'Halo', country: 'id' },
    { code: 'ur', name: 'اردو', greeting: 'سلام', country: 'pk' },
    { code: 'fa', name: 'فارسی', greeting: 'سلام', country: 'ir' },
    { code: 'he', name: 'עברית', greeting: 'שלום', country: 'il' },
    { code: 'th', name: 'ไทย', greeting: 'สวัสดี', country: 'th' },
    { code: 'vi', name: 'Tiếng Việt', greeting: 'Xin chào', country: 'vn' },
    { code: 'nl', name: 'Nederlands', greeting: 'Hallo', country: 'nl' },
    { code: 'pl', name: 'Polski', greeting: 'Cześć', country: 'pl' },
    { code: 'sv', name: 'Svenska', greeting: 'Hej', country: 'se' },
    { code: 'el', name: 'Ελληνικά', greeting: 'Γεια', country: 'gr' },
    { code: 'ro', name: 'Română', greeting: 'Salut', country: 'ro' },
    { code: 'hu', name: 'Magyar', greeting: 'Szia', country: 'hu' },
    { code: 'cs', name: 'Čeština', greeting: 'Ahoj', country: 'cz' },
    { code: 'da', name: 'Dansk', greeting: 'Hej', country: 'dk' },
    { code: 'fi', name: 'Suomi', greeting: 'Moi', country: 'fi' },
    { code: 'no', name: 'Norsk', greeting: 'Hei', country: 'no' },
    { code: 'uk', name: 'Українська', greeting: 'Привіт', country: 'ua' },
    { code: 'ms', name: 'Melayu', greeting: 'Halo', country: 'my' },
    { code: 'tl', name: 'Tagalog', greeting: 'Kumusta', country: 'ph' },
    { code: 'sw', name: 'Kiswahili', greeting: 'Jambo', country: 'ke' },
  ];

  const themes = [
    { id: 'light', label: t.themeLight, icon: <Sun size={18} /> },
    { id: 'dark', label: t.themeDark, icon: <Moon size={18} /> },
    { id: 'system', label: t.themeSystem, icon: <Monitor size={18} /> },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200 border dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <SettingsIcon className="text-slate-500 dark:text-slate-400" />
            {t.settings}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-6">

          {/* Account Section */}
          <div className="space-y-3">
            <SectionHeader title={t.account} icon={<Crown size={18} />} />
            
            {/* Current Plan Badge */}
            <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t.currentPlan}</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">{t.planFree}</span>
            </div>

            {/* Upgrade Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg shadow-blue-200 dark:shadow-none">
              {/* Decorative BG */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    Murshid Pro <Crown size={16} className="text-yellow-300" fill="currentColor" />
                  </h4>
                  <p className="text-blue-100 text-xs mt-1 opacity-90 leading-relaxed max-w-[200px]">{t.featuresDesc}</p>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-black tracking-tight">$50</span>
                </div>
              </div>

              <button className="mt-4 w-full py-2.5 bg-white text-blue-700 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors shadow-sm">
                {t.subscribeNow}
              </button>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-3">
             <SectionHeader title={t.appearance} icon={<Monitor size={18} />} />
             <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
               {themes.map((th) => (
                 <button
                   key={th.id}
                   onClick={() => setTheme(th.id as Theme)}
                   className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                     theme === th.id 
                       ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                       : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                   }`}
                 >
                   {th.icon}
                   {th.label}
                 </button>
               ))}
             </div>
          </div>

          {/* General Section (Language) */}
          <div className="space-y-3">
             <SectionHeader title={t.general} icon={<Globe size={18} />} />
             <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`relative flex flex-col items-center justify-center p-2 py-3 rounded-xl border transition-all duration-200 group ${
                      language === lang.code 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg ring-2 ring-blue-200 dark:ring-blue-900 ring-offset-1 dark:ring-offset-slate-900' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-200 dark:hover:border-blue-800'
                    }`}
                  >
                    <div className="relative mb-2 shadow-sm rounded overflow-hidden w-8 h-6 border border-black/5">
                        <img 
                            src={`https://flagcdn.com/w80/${lang.country}.png`}
                            srcSet={`https://flagcdn.com/w160/${lang.country}.png 2x`}
                            alt={lang.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                    <span className={`text-[12px] font-bold ${language === lang.code ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                        {lang.name}
                    </span>
                    <span className={`text-[10px] ${language === lang.code ? 'text-blue-200' : 'text-slate-400 group-hover:text-blue-500'}`}>
                        {lang.greeting}
                    </span>
                  </button>
                ))}
             </div>
          </div>

           {/* Ads Section */}
           <div className="space-y-3">
            <SectionHeader title={t.ads} icon={<Megaphone size={18} />} />
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">{t.enableAds}</span>
              <div 
                onClick={() => setShowAds(!showAds)}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${showAds ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${showAds ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>

          {/* Data Section */}
          <div className="space-y-3">
             <SectionHeader title={t.data} icon={<Database size={18} />} />
             <button 
               onClick={() => {
                 onClearData();
                 onClose();
               }}
               className="w-full flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-xl transition-colors font-medium text-sm"
             >
               <Trash2 size={16} />
               {t.clearData}
             </button>
          </div>

           {/* App Info / Update Section */}
           <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="bg-slate-900 dark:bg-black/50 rounded-xl p-4 flex items-center justify-between shadow-lg text-white relative overflow-hidden border border-slate-800">
                {/* Decorative circle */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

                <div>
                   <h4 className="font-bold text-sm">{t.updateApp}</h4>
                   <p className="text-xs text-slate-400 mt-0.5">{t.version}</p>
                </div>
                <a 
                  href="#" 
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all border border-white/10"
                >
                   <Play size={14} fill="currentColor" />
                   Google Play
                </a>
              </div>

              <div className="flex justify-center gap-4 text-xs text-blue-500 dark:text-blue-400 pt-2">
                 <button className="hover:underline">{t.privacy}</button>
                 <button className="hover:underline">{t.about}</button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

// Helper components
const SectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
    {icon}
    {title}
  </h3>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default SettingsModal;