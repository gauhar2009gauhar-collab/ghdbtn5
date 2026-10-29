import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Zap, 
  Truck, 
  ShieldCheck, 
  Check, 
  MapPin,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { Product, Language, KazakhstanCity } from '../types';
import { translations } from '../data/translations';

interface ProductDetailModalProps {
  product: Product | null;
  currentLang: Language;
  selectedCity: KazakhstanCity;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickKaspiBuy: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currentLang,
  selectedCity,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onQuickKaspiBuy,
}) => {
  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const kaspiRedMonthly = Math.round(product.price / 3);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#141414] border border-[#2a2a2a] rounded-3xl shadow-2xl overflow-hidden my-6 text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-[#242424] text-neutral-400 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#0d0d0d] border border-[#242424]">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name[currentLang]}
                className="w-full h-full object-cover object-center"
              />

              {/* Top Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.badge && (
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded bg-[#e50914] text-white shadow-lg">
                    {product.badge.text[currentLang]}
                  </span>
                )}
                {product.kaspiRedEligible && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ff6b00] text-black">
                    Kaspi Red 0-0-3
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail list */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-[#ff6b00] scale-105' : 'border-[#2a2a2a] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Warehouse Stock Check in Kazakhstan */}
            <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                <MapPin className="w-4 h-4 text-[#ff6b00]" />
                <span>
                  {currentLang === 'ru' && 'Наличие на складах в Казахстане:'}
                  {currentLang === 'kz' && 'Қазақстан қоймаларында бар:'}
                  {currentLang === 'en' && 'Kazakhstan Warehouse Inventory:'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#242424] p-2 rounded-lg">
                  <span className="block text-[10px] text-neutral-400">Алматы</span>
                  <span className="font-bold text-emerald-400">{product.stockByCity.almaty} шт</span>
                </div>
                <div className="bg-[#242424] p-2 rounded-lg">
                  <span className="block text-[10px] text-neutral-400">Астана</span>
                  <span className="font-bold text-emerald-400">{product.stockByCity.astana} шт</span>
                </div>
                <div className="bg-[#242424] p-2 rounded-lg">
                  <span className="block text-[10px] text-neutral-400">Шымкент</span>
                  <span className="font-bold text-emerald-400">{product.stockByCity.shymkent} шт</span>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 text-center pt-1">
                {currentLang === 'ru' && `Доставка в ${selectedCity.name.ru}: ${selectedCity.deliveryDays}`}
                {currentLang === 'kz' && `${selectedCity.name.kz} қаласына жеткізу: ${selectedCity.deliveryDays}`}
                {currentLang === 'en' && `Delivery to ${selectedCity.name.en}: ${selectedCity.deliveryDays}`}
              </p>
            </div>
          </div>

          {/* Right Column: Title, Specs, Price, Actions */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Spookiness */}
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="uppercase tracking-wider font-semibold text-[#ffb693]">
                  {translations.categories[product.category][currentLang]}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px]">Жуть:</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${i < product.spookiness ? 'opacity-100 grayscale-0' : 'opacity-25 grayscale'}`}
                    >
                      🦇
                    </span>
                  ))}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-display font-black text-white leading-tight">
                {product.name[currentLang]}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-white text-sm">{product.rating}</span>
                </div>
                <span className="text-neutral-500">•</span>
                <span className="text-xs text-neutral-400">{product.reviewsCount} отзывов студентов</span>
              </div>

              {/* Price Block */}
              <div className="mt-4 p-4 rounded-2xl bg-[#1c1b1b] border border-[#ff6b00]/25">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-display font-black text-white">
                    {product.price.toLocaleString()} ₸
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-500 line-through">
                      {product.originalPrice.toLocaleString()} ₸
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs font-bold text-[#e50914] bg-[#e50914]/15 px-2 py-0.5 rounded">
                      Экономия {(product.originalPrice - product.price).toLocaleString()} ₸
                    </span>
                  )}
                </div>

                {/* Kaspi Red Installment Pill */}
                {product.kaspiRedEligible && (
                  <div className="mt-2.5 pt-2 border-t border-[#2a2a2a] flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-[#ffb693] font-semibold">
                      <Zap className="w-4 h-4 text-[#ff6b00]" />
                      В рассрочку по Kaspi Red:
                    </span>
                    <span className="font-black text-white bg-[#e50914] px-2 py-0.5 rounded">
                      {kaspiRedMonthly.toLocaleString()} ₸ × 3 мес
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  {currentLang === 'ru' ? 'Описание' : currentLang === 'kz' ? 'Сипаттамасы' : 'Description'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {product.description[currentLang]}
                </p>
              </div>

              {/* Specifications List */}
              <div className="mt-4 space-y-1.5 border-t border-[#242424] pt-3">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  {currentLang === 'ru' ? 'Характеристики' : currentLang === 'kz' ? 'Сипаттамалары' : 'Specifications'}
                </h3>
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-[#1c1b1b]">
                    <span className="text-neutral-400">{spec.label[currentLang]}</span>
                    <span className="text-neutral-200 font-medium">{spec.value[currentLang]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Buttons */}
            <div className="pt-4 border-t border-[#242424] space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 font-semibold">Количество:</span>
                <div className="flex items-center border border-[#353534] rounded-xl bg-[#1a1a1a]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-white min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3 py-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-2.5 rounded-xl border transition-colors ml-auto ${
                    isWishlisted 
                      ? 'bg-[#e50914]/20 border-[#e50914] text-[#e50914]' 
                      : 'bg-[#1a1a1a] border-[#2a2a2a] text-neutral-400 hover:text-white'
                  }`}
                  title="В избранное"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className={`py-3.5 px-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#242424] hover:bg-[#2a2a2a] text-white border border-[#353534] hover:border-[#ff6b00]'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{translations.addedToCart[currentLang]}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#ff6b00]" />
                      <span>{translations.addToCart[currentLang]} ({quantity})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onQuickKaspiBuy(product, quantity)}
                  className="py-3.5 px-4 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-[#e50914] to-[#ff6b00] hover:brightness-110 text-white flex items-center justify-center gap-2 shadow-lg shadow-[#e50914]/25 transition-all hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Купить через Kaspi Pay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
