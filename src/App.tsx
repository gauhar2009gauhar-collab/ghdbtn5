/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  SlidersHorizontal, 
  Filter, 
  ChevronDown, 
  Zap, 
  Search, 
  Check, 
  Eye, 
  ArrowUpDown,
  ShoppingBag,
  Heart,
  RotateCcw
} from 'lucide-react';

import { Product, CartItem, Language, KazakhstanCity, Category } from './types';
import { PRODUCTS, KAZAKHSTAN_CITIES } from './data/products';
import { translations } from './data/translations';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { KaspiCheckoutModal } from './components/KaspiCheckoutModal';
import { PotionMysteryBuilder } from './components/PotionMysteryBuilder';
import { SpookyQuizModal } from './components/SpookyQuizModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ru');
  const [selectedCity, setSelectedCity] = useState<KazakhstanCity>(KAZAKHSTAN_CITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [minSpookiness, setMinSpookiness] = useState<number>(1);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'discount'>('popular');

  // Interactive Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isPotionBuilderOpen, setIsPotionBuilderOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Cart & Wishlist persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('spooky_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Initial welcoming cart
    return [
      { product: PRODUCTS[0], quantity: 1 }, // Coffin case
      { product: PRODUCTS[1], quantity: 2 }, // Glow pumpkin pens
    ];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spooky_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [PRODUCTS[2].id]; // Grimoire
  });

  const [checkoutDiscountRate, setCheckoutDiscountRate] = useState(0.15);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState('SPOOKY2026');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('spooky_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('spooky_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {}
  }, [wishlistIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Cart actions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`🎃 "${product.name[currentLang]}" добавлен в корзину!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds(prev => {
      const isSaved = prev.includes(productId);
      if (isSaved) {
        showToast('Удалено из избранного');
        return prev.filter(id => id !== productId);
      } else {
        showToast('🖤 Добавлено в избранное');
        return [...prev, productId];
      }
    });
  };

  // 1-Click Buy with Kaspi
  const handleQuickKaspiBuy = (product: Product, quantity: number = 1) => {
    // Add to cart if not present
    handleAddToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  // Add bundle from Potion Builder
  const handleAddBundleToCart = (products: Product[]) => {
    products.forEach(p => handleAddToCart(p, 1));
    setCheckoutDiscountRate(0.15);
    setCheckoutPromoCode('POTION15');
    setIsCartOpen(true);
    showToast('🧪 Ведьмин набор с 15% скидкой добавлен в корзину!');
  };

  // Open checkout from cart drawer
  const handleProceedToCheckout = (discountRate: number, promo: string) => {
    setCheckoutDiscountRate(discountRate);
    setCheckoutPromoCode(promo);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name[currentLang].toLowerCase().includes(query);
        const matchesDesc = product.description[currentLang].toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      // Price range
      if (product.price > maxPrice) {
        return false;
      }
      // Spookiness
      if (product.spookiness < minSpookiness) {
        return false;
      }
      // Only in stock locally
      if (onlyInStock) {
        const cityKey = selectedCity.id as keyof typeof product.stockByCity;
        if ((product.stockByCity[cityKey] || 0) <= 0) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'discount') {
        const discA = a.originalPrice ? (a.originalPrice - a.price) : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) : 0;
        return discB - discA;
      }
      // default: popular by rating & reviews
      return (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount);
    });
  }, [selectedCategory, searchQuery, maxPrice, minSpookiness, onlyInStock, sortBy, currentLang, selectedCity]);

  const categoriesList: Category[] = [
    'all',
    'pens',
    'notebooks',
    'pencil_cases',
    'highlighters',
    'bags',
    'boxes',
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e5e2e1] font-sans selection:bg-[#ff6b00] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f1a18] border border-[#ff6b00] text-white px-4 py-3 rounded-2xl shadow-2xl shadow-[#ff6b00]/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        cartItems={cartItems}
        wishlistIds={wishlistIds}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenPotionBuilder={() => setIsPotionBuilderOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onSelectProduct={(p) => setDetailProduct(p)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Banner Section */}
      <HeroBanner
        currentLang={currentLang}
        onExploreCatalog={() => {
          const el = document.getElementById('catalog');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenPotionBuilder={() => setIsPotionBuilderOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* Main Catalog Section */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-display font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#ff6b00] text-black shadow-lg shadow-[#ff6b00]/30 scale-[1.02]'
                  : 'bg-[#1a1a1a] text-neutral-300 hover:bg-[#242424] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              <span>{translations.categories[cat][currentLang]}</span>
            </button>
          ))}
        </div>

        {/* Filter and Sorting Toolbar */}
        <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Price slider */}
            <div className="flex items-center gap-2 bg-[#1f1f1f] px-3 py-1.5 rounded-xl border border-[#2e2e2e]">
              <span className="text-neutral-400">До:</span>
              <input
                type="range"
                min="2000"
                max="22000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 sm:w-32 accent-[#ff6b00] cursor-pointer"
              />
              <span className="font-bold text-[#ffb693] min-w-[55px]">
                {maxPrice.toLocaleString()} ₸
              </span>
            </div>

            {/* In stock toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none bg-[#1f1f1f] px-3 py-1.5 rounded-xl border border-[#2e2e2e] hover:border-[#3a3a3a]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded accent-[#ff6b00]"
              />
              <span className="text-neutral-300 font-medium">
                В наличии в г. {selectedCity.name[currentLang]}
              </span>
            </label>

            {/* Min spookiness filter */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#1f1f1f] px-3 py-1.5 rounded-xl border border-[#2e2e2e]">
              <span className="text-neutral-400">Жуть:</span>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setMinSpookiness(lvl === minSpookiness ? 1 : lvl)}
                  className={`text-xs px-1 transition-transform ${minSpookiness >= lvl ? 'scale-110 opacity-100' : 'opacity-30'}`}
                  title={`От ${lvl} летучих мышей`}
                >
                  🦇
                </button>
              ))}
            </div>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 hidden sm:inline">Сортировка:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1f1f1f] text-neutral-200 border border-[#2e2e2e] rounded-xl px-3 py-1.5 pr-8 focus:outline-none focus:border-[#ff6b00] cursor-pointer font-medium appearance-none"
              >
                <option value="popular">По популярности 🔥</option>
                <option value="price_asc">Сначала дешевле ₸</option>
                <option value="price_desc">Сначала дороже ₸</option>
                <option value="discount">По размеру скидки %</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results count indicator */}
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Найдено {filteredProducts.length} товаров</span>
          {(searchQuery || selectedCategory !== 'all' || maxPrice < 20000 || onlyInStock) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setMaxPrice(22000);
                setMinSpookiness(1);
                setOnlyInStock(false);
              }}
              className="text-[#ff6b00] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Сбросить фильтры
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#141414] border border-[#242424] space-y-4">
            <span className="text-5xl">🕸️</span>
            <h3 className="text-lg font-display font-bold text-white">
              По вашему запросу ничего не нашлось
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Попробуйте сбросить фильтры или ввести другое название (например: «пенал», «ручки», «гримуар»)
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setMaxPrice(22000);
                setOnlyInStock(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-black font-bold text-xs"
            >
              Показать все товары
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const isInCart = cartItems.some(i => i.product.id === product.id);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentLang={currentLang}
                  isWishlisted={isWishlisted}
                  isInCart={isInCart}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onQuickKaspiBuy={(p) => handleQuickKaspiBuy(p, 1)}
                  onOpenDetail={(p) => setDetailProduct(p)}
                />
              );
            })}
          </div>
        )}

        {/* Mid-page Interactive Callout Banner: Brew Your Box */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#181818] to-[#1f1512] border border-purple-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Интерактивный конструктор
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white">
              Собери свой студенческий набор в котле ведьмы
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Выбери от 3 канцелярских предметов и получи <strong>дополнительную скидку 15%</strong> + набор из 30 виниловых наклеек в подарок.
            </p>
          </div>

          <button
            onClick={() => setIsPotionBuilderOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#ff6b00] hover:brightness-110 text-white font-display font-bold text-sm shadow-xl shadow-purple-600/25 shrink-0 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
          >
            <span>Сварить зелье 🧪</span>
          </button>
        </div>
      </main>

      {/* Customer Reviews Section */}
      <ReviewsSection currentLang={currentLang} />

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        currentLang={currentLang}
        selectedCity={selectedCity}
        isWishlisted={detailProduct ? wishlistIds.includes(detailProduct.id) : false}
        onClose={() => setDetailProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onQuickKaspiBuy={(prod, qty) => {
          setDetailProduct(null);
          handleQuickKaspiBuy(prod, qty);
        }}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currentLang={currentLang}
        selectedCity={selectedCity}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 3. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        currentLang={currentLang}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(p) => {
          handleAddToCart(p, 1);
          setIsCartOpen(true);
        }}
      />

      {/* 4. Kaspi QR & Checkout Modal */}
      <KaspiCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currentLang={currentLang}
        selectedCity={selectedCity}
        appliedDiscountRate={checkoutDiscountRate}
        promoCode={checkoutPromoCode}
        onOrderSuccess={() => {
          // Clear cart on successful purchase
          setCartItems([]);
        }}
      />

      {/* 5. Potion Mystery Box Builder */}
      <PotionMysteryBuilder
        isOpen={isPotionBuilderOpen}
        onClose={() => setIsPotionBuilderOpen(false)}
        currentLang={currentLang}
        onAddBundleToCart={handleAddBundleToCart}
      />

      {/* 6. Spooky Ghost Quiz */}
      <SpookyQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        currentLang={currentLang}
        onAddToCart={(p) => {
          handleAddToCart(p, 1);
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}
