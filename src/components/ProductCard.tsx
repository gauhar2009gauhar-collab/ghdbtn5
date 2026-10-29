import React from 'react';
import { Heart, ShoppingBag, Star, Zap, Eye, Check } from 'lucide-react';
import { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  currentLang: Language;
  isWishlisted: boolean;
  isInCart: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickKaspiBuy: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentLang,
  isWishlisted,
  isInCart,
  onToggleWishlist,
  onAddToCart,
  onQuickKaspiBuy,
  onOpenDetail,
}) => {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'discount':
        return 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/30';
      case 'hot':
        return 'bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/30';
      case 'scarcity':
        return 'bg-amber-600 text-white animate-pulse';
      case 'new':
        return 'bg-purple-600 text-white shadow-lg shadow-purple-600/30';
      default:
        return 'bg-[#2a2a2a] text-neutral-200';
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#ff6b00] transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff6b00]/10 overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#131313] cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img
          src={product.images[0]}
          alt={product.name[currentLang]}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient dark fade at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider ${getBadgeStyle(product.badge.type)}`}>
              {product.badge.text[currentLang]}
            </span>
          )}
          {product.kaspiRedEligible && (
            <span className="bg-[#242424]/90 backdrop-blur-md text-[#ffb693] border border-[#ff6b00]/30 text-[9px] font-bold px-2 py-0.5 rounded">
              Kaspi Red 0-0-3
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:text-[#e50914] transition-colors border border-white/10 z-10"
          title={isWishlisted ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#e50914] text-[#e50914]' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(product);
          }}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/75 backdrop-blur-md text-neutral-300 hover:text-white transition-opacity opacity-0 group-hover:opacity-100 border border-white/10 z-10 flex items-center gap-1 text-[11px] font-medium"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {currentLang === 'ru' ? 'Быстрый просмотр' : currentLang === 'kz' ? 'Қарап шығу' : 'Quick View'}
          </span>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Rating & Spookiness */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-white text-[11px]">{product.rating}</span>
              <span className="text-[10px] text-neutral-400">({product.reviewsCount})</span>
            </div>

            {/* Spooky meter */}
            <div className="flex items-center gap-0.5" title={`Уровень жути: ${product.spookiness} из 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-[11px] ${i < product.spookiness ? 'opacity-100 grayscale-0' : 'opacity-25 grayscale'}`}
                >
                  🦇
                </span>
              ))}
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-display font-semibold text-sm sm:text-base text-neutral-100 hover:text-[#ffb693] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name[currentLang]}
          </h3>

          {/* Micro description */}
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description[currentLang]}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-[#242424] flex flex-col gap-2.5">
          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-display font-black text-white">
                {product.price.toLocaleString()} ₸
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-500 line-through">
                  {product.originalPrice.toLocaleString()} ₸
                </span>
              )}
            </div>

            {product.stockCount <= 5 ? (
              <span className="text-[10px] font-bold text-amber-400">
                {currentLang === 'ru' && `Осталось ${product.stockCount} шт`}
                {currentLang === 'kz' && `Қалғаны ${product.stockCount} дана`}
                {currentLang === 'en' && `Only ${product.stockCount} left`}
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 font-medium">
                {currentLang === 'ru' && 'В наличии'}
                {currentLang === 'kz' && 'Қоймада бар'}
                {currentLang === 'en' && 'In stock'}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & 1-Click Kaspi */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                isInCart 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' 
                  : 'bg-[#242424] hover:bg-[#2a2a2a] text-white border border-[#353534] hover:border-[#ff6b00]'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLang === 'ru' ? 'В корзине' : currentLang === 'kz' ? 'Себетте' : 'Added'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>{currentLang === 'ru' ? 'В корзину' : currentLang === 'kz' ? 'Себетке' : 'Add'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => onQuickKaspiBuy(product)}
              className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff6b00] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#e50914]/20 transition-all hover:scale-[1.02]"
              title="Купить в 1 клик через Kaspi Pay"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Kaspi Pay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
