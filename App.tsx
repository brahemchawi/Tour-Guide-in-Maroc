import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Compass, Navigation, Utensils, Camera, Calendar, Bed, Map, MessageSquare, MoreVertical, Globe, Database, CreditCard, Megaphone, Crown, Settings, ChevronRight, X, AlertCircle, Trash2, Car, Star } from 'lucide-react';
import { ChatMessage, LocationData, ViewMode, Language, Theme } from './types';
import { sendMessageToGemini } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import MapView from './components/MapView';
import { translations } from './translations';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<LocationData | undefined>(undefined);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showAds, setShowAds] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Language & Theme State
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('system');
  
  // Helper for RTL
  const isRtl = ['ar', 'he', 'fa', 'ur'].includes(language);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper for current language strings
  const t = translations[language] || translations['en'];


  // Language Detection
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language;
    if (translations[browserLang]) {
      setLanguage(browserLang);
    } else {
      setLanguage('en'); // Fallback
    }
  }, []);

  // Update Document Direction and Title
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.title = t.appTitle;
  }, [language, t.appTitle, isRtl]);

  // Handle Theme Change
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (viewMode === 'chat') {
      scrollToBottom();
    }
  }, [messages, viewMode]);

  // Initial Welcome Message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: t.welcome,
        timestamp: Date.now(),
      }
    ]);
  }, [language]); // Re-trigger when language changes
    
  // Location Request Function - High Accuracy for Mobile
  const requestLocation = () => {
    if ("geolocation" in navigator) {
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied or error:", error);
          if (error.code === error.PERMISSION_DENIED) {
             setLocationError("Permission Denied");
          } else if (error.code === error.TIMEOUT) {
             setLocationError("Timeout");
          } else {
             setLocationError("Unavailable");
          }
        },
        {
          enableHighAccuracy: true, // Critical for accurate GPS on Android/iOS
          timeout: 20000,
          maximumAge: 5000
        }
      );
    } else {
      setLocationError("Not Supported");
    }
  };

  // Auto request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    // Switch back to chat if sending a message
    if (viewMode === 'map') setViewMode('chat');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Create a temporary loading message
    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
      isLoading: true
    }]);

    try {
      const historyForApi = messages.filter(m => !m.isLoading && m.id !== 'welcome');
      const response = await sendMessageToGemini(historyForApi, userMsg.text, location, language);

      setMessages(prev => prev.map(msg => 
        msg.id === loadingId 
          ? { 
              ...msg, 
              text: response.text, 
              groundingChunks: response.groundingChunks,
              isLoading: false 
            } 
          : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId 
          ? { ...msg, text: t.error, isLoading: false } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get relevant grounding chunks (places) from the last model message
  const getLastPlaces = () => {
    // Find the last message from model that has chunks
    const modelMessages = messages.filter(m => m.role === 'model' && m.groundingChunks && m.groundingChunks.length > 0);
    if (modelMessages.length > 0) {
      return modelMessages[modelMessages.length - 1].groundingChunks || [];
    }
    return [];
  };

  const suggestionChips = [
    { icon: <Utensils size={14} />, label: t.chips.restaurants, text: t.prompts.restaurants },
    { icon: <Bed size={14} />, label: t.chips.hotels, text: t.prompts.hotels },
    { icon: <Car size={14} />, label: t.chips.carRental, text: t.prompts.carRental },
    { icon: <Camera size={14} />, label: t.chips.attractions, text: t.prompts.attractions },
    { icon: <Calendar size={14} />, label: t.chips.plan, text: t.prompts.plan },
  ];

  // Simulated Ad Component
  const AdBanner = () => {
    if (!showAds) return null;
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-1.5 px-4 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
           <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1 rounded font-bold text-[9px]">Ad</span>
           <span>Best Hotel Deals - Up to 50% Off</span>
        </div>
        <button onClick={() => setShowAds(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X size={12} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex flex-col shadow-sm">
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Green Nature Logo with Compass */}
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-emerald-200 dark:shadow-none shadow-lg shrink-0">
              <Compass size={24} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Moroccan Tour Guide</h1>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-['Tajawal'] translate-y-[1px]">مرشد سياحي</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {location ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <MapPin size={10} /> {t.locationSet}
                  </span>
                ) : (
                  <button onClick={requestLocation} className="flex items-center gap-1 text-slate-400 hover:text-emerald-500 transition-colors">
                     {locationError ? <AlertCircle size={10} className="text-red-500"/> : <MapPin size={10} />}
                     {locationError ? "Location Disabled" : t.subtitle}
                  </button>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggles */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 hidden sm:flex">
              <button
                onClick={() => setViewMode('chat')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'chat' 
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <MessageSquare size={16} />
                <span className="hidden sm:inline">{t.chatMode}</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'map' 
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Map size={16} />
                <span className="hidden sm:inline">{t.mapMode}</span>
              </button>
            </div>
            
            {/* Mobile View Toggle */}
            <div className="flex sm:hidden bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
               <button
                onClick={() => setViewMode(viewMode === 'chat' ? 'map' : 'chat')}
                className="px-3 py-1.5 rounded-md text-emerald-700 dark:text-emerald-400"
              >
                 {viewMode === 'chat' ? <Map size={20} /> : <MessageSquare size={20} />}
              </button>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            {/* Reset / Delete Button */}
            <button 
              onClick={() => setMessages([{ id: 'welcome', role: 'model', text: t.welcome, timestamp: Date.now() }])}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
              title={t.deleteChat}
            >
              <Trash2 size={20} /> 
            </button>

            {/* Settings Menu Button */}
            <div className="relative">
              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isSettingsModalOpen ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'}`}
                title={t.settings}
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>
        <AdBanner />
      </header>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        showAds={showAds}
        setShowAds={setShowAds}
        onClearData={() => {
            // Full Reset Logic
            setMessages([{ id: 'welcome', role: 'model', text: t.welcome, timestamp: Date.now() }]);
            setLocation(undefined);
            setLocationError(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        
        {/* Chat View */}
        <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${viewMode === 'chat' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
            <div className="max-w-3xl mx-auto">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} language={language} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${viewMode === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
           <MapView 
              userLocation={location} 
              groundingChunks={getLastPlaces()} 
              language={language}
           />
        </div>

        {/* Input Area (Visible in Chat Mode, optional in Map Mode) */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-slate-950 dark:via-slate-950 z-20 transition-transform duration-300 ${viewMode === 'map' ? 'translate-y-full' : 'translate-y-0'}`}>
          <div className="max-w-3xl mx-auto space-y-3">
            
            {/* Suggestion Chips */}
            {messages.length < 3 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip.text)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-200 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all"
                  >
                    <span className="text-emerald-500 dark:text-emerald-400">{chip.icon}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.inputPlaceholder}
                disabled={isLoading}
                className="w-full p-4 pr-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg shadow-slate-100/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-950 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal transition-all"
                dir="auto"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`absolute top-2 right-2 p-2 rounded-xl transition-all duration-200 ${
                  input.trim() && !isLoading
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 scale-100' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed scale-95'
                }`}
              >
                <Send size={20} className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>
            
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-600 font-medium">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;