import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  MapPin, 
  Globe, 
  Sparkles, 
  Flame, 
  X,
  ChevronDown,
  Moon,
  Zap,
  PackageCheck
} from 'lucide-react';
import { Language, KazakhstanCity, CartItem, Product } from '../types';
import { KAZAKHSTAN_CITIES, PRODUCTS } from '../data/products';
import { translations, getT } from '../data/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  selectedCity: KazakhstanCity;
  onCityChange: (city: KazakhstanCity) => void;
  cartItems: CartItem[];
  wishlistIds: string[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenPotionBuilder: () => void;
  onOpenQuiz: () => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  selectedCity,
  onCityChange,
  cartItems,
  wishlistIds,
  onOpenCart,
  onOpenWishlist,
  onOpenPotionBuilder,
  onOpenQuiz,
  onSelectProduct,
  searchQuery,
  onSearchChange,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim().length > 1
    ? PRODUCTS.filter(p => 
        p.name[currentLang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description[currentLang].toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242424] bg-[#0d0d0d]/95 backdrop-blur-md">
      {/* Top micro-bar: announcements & localized delivery */}
      <div className="bg-gradient-to-r from-[#1a1a1a] via-[#201f1f] to-[#1a1a1a] border-b border-[#2a2a2a] px-3 py-1.5 text-xs text-[#e2bfb0]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#ff6b00]/20 text-[#ffb693] font-semibold px-2 py-0.5 rounded-full border border-[#ff6b00]/30 text-[11px]">
              <Flame className="w-3 h-3 text-[#ff6b00]" />
              Halloween 2026 Drop
            </span>
            <span className="hidden sm:inline text-neutral-300">
              {currentLang === 'ru' && 'Доставка по всему Казахстану • Оплата Kaspi QR и Kaspi Red 0-0-3'}
              {currentLang === 'kz' && 'Қазақстан бойынша жеткізу • Kaspi QR және Kaspi Red 0-0-3 арқылы төлем'}
              {currentLang === 'en' && 'All Kazakhstan Delivery • Kaspi QR & Kaspi Red 0-0-3'}
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* City selector */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsCityDropdownOpen(!isCityDropdownOpen);
                  setIsLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 text-neutral-300 hover:text-[#ffb693] transition-colors py-0.5 px-2 rounded hover:bg-[#242424]"
                title="Выберите город доставки"
              >
                <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span className="font-medium">{selectedCity.name[currentLang]}</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-[#1a1a1a] border border-[#353534] rounded-lg shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-neutral-400 border-b border-[#2a2a2a]">
                    {currentLang === 'ru' && 'Город получения заказа'}
                    {currentLang === 'kz' && 'Тапсырыс қаласы'}
                    {currentLang === 'en' && 'Delivery City'}
                  </div>
                  {KAZAKHSTAN_CITIES.map(city => (
                    <button
                      key={city.id}
                      onClick={() => {
                        onCityChange(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#242424] transition-colors ${
                        city.id === selectedCity.id ? 'text-[#ff6b00] font-semibold bg-[#ff6b00]/10' : 'text-neutral-200'
                      }`}
                    >
                      <span>{city.name[currentLang]}</span>
                      <span className="text-[10px] text-neutral-400">{city.deliveryDays}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsCityDropdownOpen(false);
                }}
                className="flex items-center gap-1 text-neutral-300 hover:text-[#ffb693] transition-colors py-0.5 px-2 rounded hover:bg-[#242424]"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                <span className="uppercase font-semibold text-[11px]">{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-[#1a1a1a] border border-[#353534] rounded-lg shadow-2xl py-1 z-50">
                  <button
                    onClick={() => { onLanguageChange('ru'); setIsLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#242424] ${
                      currentLang === 'ru' ? 'text-[#ff6b00] font-bold' : 'text-neutral-200'
                    }`}
                  >
                    <span>Русский</span>
                    <span className="text-[10px] text-neutral-400">RU</span>
                  </button>
                  <button
                    onClick={() => { onLanguageChange('kz'); setIsLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#242424] ${
                      currentLang === 'kz' ? 'text-[#ff6b00] font-bold' : 'text-neutral-200'
                    }`}
                  >
                    <span>Қазақша</span>
                    <span className="text-[10px] text-neutral-400">KZ</span>
                  </button>
                  <button
                    onClick={() => { onLanguageChange('en'); setIsLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#242424] ${
                      currentLang === 'en' ? 'text-[#ff6b00] font-bold' : 'text-neutral-200'
                    }`}
                  >
                    <span>English</span>
                    <span className="text-[10px] text-neutral-400">EN</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#e50914] flex items-center justify-center shadow-lg shadow-[#ff6b00]/30 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl select-none">🎃</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#ffb693] transition-colors">
                  SPOOKY<span className="text-[#ff6b00]">KZ</span>
                </span>
                <span className="text-[10px] bg-[#e50914]/20 border border-[#e50914]/40 text-[#ffb4aa] font-bold px-1.5 py-0.2 rounded uppercase">
                  stationery
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 -mt-0.5 hidden sm:block">
                {currentLang === 'ru' && 'Канцелярия для школы и универа'}
                {currentLang === 'kz' && 'Мектеп пен студенттерге арналған'}
                {currentLang === 'en' && 'Gothic Cute School Essentials'}
              </span>
            </div>
          </a>
        </div>

        {/* Search bar with live suggestions */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={translations.searchPlaceholder[currentLang]}
              className="w-full bg-[#1a1a1a] text-neutral-100 text-sm pl-10 pr-9 py-2 rounded-xl border border-[#2a2a2a] focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-all placeholder:text-neutral-500"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#353534] rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 border-b border-[#242424] text-[11px] text-neutral-400 font-semibold uppercase">
                {currentLang === 'ru' ? 'Найденные товары' : currentLang === 'kz' ? 'Табылған тауарлар' : 'Matching Products'}
              </div>
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    setIsSearchFocused(false);
                  }}
                  className="w-full p-2.5 flex items-center gap-3 hover:bg-[#242424] transition-colors text-left"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name[currentLang]}
                    className="w-10 h-10 object-cover rounded-lg border border-[#2a2a2a]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-100 truncate">
                      {product.name[currentLang]}
                    </p>
                    <p className="text-xs text-[#ff6b00] font-bold">
                      {product.price.toLocaleString()} ₸
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick interactive features and action icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Brew Mystery Potion Button */}
          <button
            onClick={onOpenPotionBuilder}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-[#242424] hover:from-purple-900/60 hover:to-[#2a2a2a] text-purple-200 text-xs font-semibold border border-purple-500/40 transition-all hover:scale-[1.02]"
            title="Собрать свой бокс"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{currentLang === 'ru' ? 'Сварить бокс 🧪' : currentLang === 'kz' ? 'Бокс құрастыру 🧪' : 'Brew Box 🧪'}</span>
          </button>

          {/* Ghost Quiz button */}
          <button
            onClick={onOpenQuiz}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] text-[#ffb693] text-xs font-semibold border border-[#ff6b00]/30 transition-all"
            title="Пройти тест на стиль канцелярии"
          >
            <span>👻</span>
            <span>{currentLang === 'ru' ? 'Тест: Какой ты призрак?' : currentLang === 'kz' ? 'Елес тесті' : 'Ghost Quiz'}</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] text-neutral-300 hover:text-[#e50914] border border-[#2a2a2a] transition-colors"
            title="Избранное"
          >
            <Heart className={`w-5 h-5 ${wishlistIds.length > 0 ? 'fill-[#e50914] text-[#e50914]' : ''}`} />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#e50914] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#e50914] hover:brightness-110 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#ff6b00]/25 transition-all hover:scale-[1.02]"
          >
            <ShoppingBag className="w-5 h-5" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-normal leading-tight opacity-90">
                {currentLang === 'ru' ? 'Корзина' : currentLang === 'kz' ? 'Себет' : 'Cart'}
              </span>
              <span className="font-bold text-xs leading-tight">
                {totalCartPrice > 0 ? `${totalCartPrice.toLocaleString()} ₸` : (currentLang === 'ru' ? '0 ₸' : '0 ₸')}
              </span>
            </div>
            {totalCartCount > 0 && (
              <span className="bg-black/60 text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded-full ml-0.5">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={translations.searchPlaceholder[currentLang]}
            className="w-full bg-[#1a1a1a] text-neutral-100 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#2a2a2a] focus:outline-none focus:border-[#ff6b00]"
          />
        </div>
      </div>
    </header>
  );
};
