import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Check, ShoppingBag, Flame } from 'lucide-react';
import { Product, Language } from '../types';
import { PRODUCTS } from '../data/products';
import confetti from 'canvas-confetti';

interface PotionMysteryBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onAddBundleToCart: (products: Product[]) => void;
}

export const PotionMysteryBuilder: React.FC<PotionMysteryBuilderProps> = ({
  isOpen,
  onClose,
  currentLang,
  onAddBundleToCart,
}) => {
  if (!isOpen) return null;

  const [selectedItems, setSelectedItems] = useState<Product[]>([
    PRODUCTS[0], // Coffin pencil case
    PRODUCTS[1], // Glow pumpkin pens
    PRODUCTS[3], // Potion highlighters
  ]);

  const isCauldronReady = selectedItems.length >= 3;
  const rawTotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const bundleDiscount = isCauldronReady ? Math.round(rawTotal * 0.15) : 0;
  const bundlePrice = rawTotal - bundleDiscount;

  const handleToggleItem = (product: Product) => {
    if (selectedItems.some(i => i.id === product.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== product.id));
    } else {
      if (selectedItems.length >= 5) return;
      setSelectedItems([...selectedItems, product]);
    }
  };

  const handleBrewAndAddToCart = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#9d4edd', '#ff6b00', '#39ff14'],
    });
    onAddBundleToCart(selectedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#141414] border border-purple-500/40 rounded-3xl shadow-2xl shadow-purple-950/40 overflow-hidden my-6 text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#242424] flex items-center justify-between bg-gradient-to-r from-purple-950/50 via-[#181818] to-purple-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-xl">
              🧪
            </div>
            <div>
              <h2 className="text-lg font-display font-black text-white flex items-center gap-2">
                Свари свое зелье: Собери свой бокс
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                  Скидка -15%
                </span>
              </h2>
              <p className="text-xs text-purple-200/70">
                Выбери от 3 до 5 любимых предметов, чтобы получить дополнительную скидку 15% и пачку стикеров в подарок!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#242424] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Cauldron Top Display */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="relative rounded-3xl bg-gradient-to-b from-purple-950/30 to-[#121212] border border-purple-500/20 p-5 text-center overflow-hidden">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl animate-bounce">🧙‍♀️</span>
              <span className="text-4xl animate-pulse">⚗️</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>🦇</span>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              В твоем котле: {selectedItems.length} из 5 предметов
            </h3>

            {/* Selected Items Pills in Cauldron */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3 min-h-[50px]">
              {selectedItems.map((item) => (
                <div 
                  key={item.id}
                  className="inline-flex items-center gap-2 bg-[#201c24] border border-purple-500/40 px-3 py-1.5 rounded-xl text-xs text-purple-100 shadow-md"
                >
                  <img src={item.images[0]} alt="p" className="w-5 h-5 rounded object-cover" />
                  <span className="font-medium max-w-[150px] truncate">{item.name[currentLang]}</span>
                  <button
                    onClick={() => handleToggleItem(item)}
                    className="text-neutral-400 hover:text-[#e50914] p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {selectedItems.length < 3 && (
                <span className="text-xs text-amber-400 font-medium italic">
                  Добавьте еще хотя бы {3 - selectedItems.length} предмет(а), чтобы сварить бокс!
                </span>
              )}
            </div>

            {/* Cauldron Perks Bar */}
            {isCauldronReady && (
              <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-center gap-4 text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Бонусная скидка 15% активирована
                </span>
                <span className="text-[#ffb693] font-bold flex items-center gap-1">
                  🎁 Пачка из 30 виниловых наклеек в подарок
                </span>
              </div>
            )}
          </div>

          {/* Grid of items to choose from */}
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Ингредиенты для твоего семестрового набора:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
              {PRODUCTS.map((prod) => {
                const isSelected = selectedItems.some(i => i.id === prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleToggleItem(prod)}
                    className={`relative p-2.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/30'
                        : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                    }`}
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-black/40 mb-2 relative">
                      <img src={prod.images[0]} alt="thumb" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white line-clamp-1">{prod.name[currentLang]}</p>
                      <p className="text-[10px] text-[#ff6b00] font-bold mt-0.5">{prod.price.toLocaleString()} ₸</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Summary & Cart Add */}
          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-neutral-400">Стоимость набора:</span>
                <span className="text-xl font-display font-black text-white">
                  {bundlePrice.toLocaleString()} ₸
                </span>
                {bundleDiscount > 0 && (
                  <span className="text-xs text-neutral-500 line-through">
                    {rawTotal.toLocaleString()} ₸
                  </span>
                )}
              </div>
              {bundleDiscount > 0 && (
                <p className="text-[11px] text-emerald-400 font-semibold">
                  Экономия по набору: {bundleDiscount.toLocaleString()} ₸
                </p>
              )}
            </div>

            <button
              onClick={handleBrewAndAddToCart}
              disabled={!isCauldronReady}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-[#ff6b00] hover:brightness-110 disabled:opacity-40 text-white font-display font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Добавить ведьмин бокс в корзину</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
