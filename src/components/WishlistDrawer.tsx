import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, Language } from '../types';
import { PRODUCTS } from '../data/products';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  currentLang: Language;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  currentLang,
  onToggleWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#131313] border-l border-[#242424] flex flex-col h-full shadow-2xl relative text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between bg-[#171717]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e50914]/20 flex items-center justify-center text-[#e50914]">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                Избранное
              </h2>
              <span className="text-[11px] text-neutral-400">
                {wishlistedProducts.length} сохраненных товаров
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#242424] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-neutral-400">
              <span className="text-4xl">🖤</span>
              <p className="text-xs">Вы пока ничего не добавили в избранное</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#242424] text-white text-xs font-semibold"
              >
                Вернуться к товарам
              </button>
            </div>
          ) : (
            wishlistedProducts.map(product => (
              <div
                key={product.id}
                className="p-3 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex items-center gap-3 relative"
              >
                <img
                  src={product.images[0]}
                  alt={product.name[currentLang]}
                  className="w-16 h-16 object-cover rounded-xl border border-[#2a2a2a]"
                />
                <div className="flex-1 min-w-0 pr-8">
                  <h4 className="text-xs font-bold text-white truncate">
                    {product.name[currentLang]}
                  </h4>
                  <p className="text-xs font-black text-[#ff6b00] mt-1">
                    {product.price.toLocaleString()} ₸
                  </p>
                  <button
                    onClick={() => {
                      onAddToCart(product);
                    }}
                    className="mt-2 text-[11px] font-bold text-[#ffb693] hover:text-white flex items-center gap-1 bg-[#242424] px-2.5 py-1 rounded-lg"
                  >
                    <ShoppingBag className="w-3 h-3 text-[#ff6b00]" />
                    <span>Перенести в корзину</span>
                  </button>
                </div>
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="absolute top-3 right-3 text-neutral-500 hover:text-[#e50914] p-1"
                  title="Удалить"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
