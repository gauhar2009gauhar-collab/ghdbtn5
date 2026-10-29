import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  Zap, 
  Tag, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { CartItem, Language, KazakhstanCity } from '../types';
import { translations } from '../data/translations';
import { PROMO_CODES } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentLang: Language;
  selectedCity: KazakhstanCity;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (appliedDiscountRate: number, promoCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentLang,
  selectedCity,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('SPOOKY2026');
  const [promoError, setPromoError] = useState('');

  const FREE_DELIVERY_THRESHOLD = 10000;
  const STANDARD_DELIVERY_FEE = 1200;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountRate = appliedPromo ? (PROMO_CODES[appliedPromo.toUpperCase()] || 0) : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || cartItems.length === 0;
  const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const total = Math.max(0, subtotal - discountAmount + (cartItems.length > 0 ? deliveryFee : 0));
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  const handleApplyPromo = () => {
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;
    if (PROMO_CODES[cleanCode]) {
      setAppliedPromo(cleanCode);
      setPromoError('');
    } else {
      setPromoError(currentLang === 'ru' ? 'Неверный промокод' : 'Жарамсыз промокод');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#131313] border-l border-[#242424] flex flex-col h-full shadow-2xl relative text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between bg-[#171717]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff6b00]/20 flex items-center justify-center text-[#ff6b00]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                {translations.cartTitle[currentLang]}
              </h2>
              <span className="text-[11px] text-neutral-400">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} {currentLang === 'ru' ? 'предметов' : 'зат'}
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

        {/* Free Delivery Meter */}
        <div className="px-4 py-3 bg-[#1a1a1a] border-b border-[#242424]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Truck className="w-4 h-4 text-[#ff6b00]" />
              {isFreeDelivery ? (
                <span className="text-emerald-400 font-bold">
                  {translations.freeDeliveryUnlocked[currentLang]}
                </span>
              ) : (
                <span>
                  {translations.freeDeliveryThreshold[currentLang]}{' '}
                  <strong className="text-[#ff6b00]">{amountToFreeDelivery.toLocaleString()} ₸</strong>
                </span>
              )}
            </span>
            <span className="text-[11px] text-neutral-400 font-bold">{freeDeliveryProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#242424] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ff6b00] to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <span className="text-5xl animate-bounce">🦇</span>
              <p className="text-sm text-neutral-400 max-w-xs">
                {translations.emptyCart[currentLang]}
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff8533] text-black font-display font-bold text-xs"
              >
                {translations.ctaCatalog[currentLang]}
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.product.id}
                className="p-3 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex items-center gap-3 relative group"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name[currentLang]}
                  className="w-16 h-16 object-cover rounded-xl border border-[#2e2e2e]"
                />

                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.product.name[currentLang]}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-[#ff6b00]">
                      {(item.product.price * item.quantity).toLocaleString()} ₸
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      ({item.product.price.toLocaleString()} ₸ / шт)
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-[#353534] rounded-lg bg-[#141414]">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-white min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="absolute top-3 right-3 text-neutral-500 hover:text-[#e50914] transition-colors p-1"
                  title="Удалить"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with promo code & checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#242424] bg-[#171717] space-y-4">
            {/* Promo Code Input */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="SPOOKY2026 (-15%)"
                    className="w-full bg-[#131313] border border-[#2a2a2a] text-xs text-white pl-8 pr-3 py-2 rounded-xl focus:border-[#ff6b00] focus:outline-none uppercase placeholder:normal-case placeholder:text-neutral-500"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3.5 py-2 bg-[#242424] hover:bg-[#2e2e2e] text-xs font-bold text-white rounded-xl border border-[#353534]"
                >
                  {translations.applyPromo[currentLang]}
                </button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-400 mt-2 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-500/30">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Промокод <strong>{appliedPromo}</strong> (-{discountRate * 100}%)
                  </span>
                  <button 
                    onClick={() => setAppliedPromo(null)}
                    className="text-neutral-400 hover:text-white text-[11px]"
                  >
                    Отменить
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-xs text-[#e50914] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {promoError}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-300 pt-2 border-t border-[#242424]">
              <div className="flex justify-between">
                <span>Товары ({cartItems.reduce((acc, i) => acc + i.quantity, 0)}):</span>
                <span>{subtotal.toLocaleString()} ₸</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Скидка по промокоду:</span>
                  <span>-{discountAmount.toLocaleString()} ₸</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Доставка ({selectedCity.name[currentLang]}):</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-400 font-bold">Бесплатно 0 ₸</strong>
                  ) : (
                    `${deliveryFee.toLocaleString()} ₸`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-display font-black text-white pt-2 border-t border-[#242424]">
                <span>Итого к оплате:</span>
                <span className="text-[#ff6b00]">{total.toLocaleString()} ₸</span>
              </div>
            </div>

            {/* Kaspi Red Split preview */}
            <div className="flex items-center justify-between bg-[#1f1a18] border border-[#ff6b00]/30 px-3 py-2 rounded-xl text-xs">
              <span className="text-[#ffb693] font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#ff6b00]" /> Kaspi Red:
              </span>
              <span className="font-bold text-white">
                {Math.round(total / 3).toLocaleString()} ₸ × 3 мес
              </span>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => onProceedToCheckout(discountRate, appliedPromo || '')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff6b00] hover:brightness-110 text-white font-display font-bold text-sm shadow-xl shadow-[#e50914]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>{translations.checkoutBtn[currentLang]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
