import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  QrCode, 
  CreditCard, 
  Smartphone, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  Copy,
  CheckCircle2,
  Package,
  Clock,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Language, KazakhstanCity, PaymentMethod } from '../types';
import { KAZAKHSTAN_CITIES } from '../data/products';

interface KaspiCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentLang: Language;
  selectedCity: KazakhstanCity;
  appliedDiscountRate: number;
  promoCode: string;
  onOrderSuccess: () => void;
}

export const KaspiCheckoutModal: React.FC<KaspiCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentLang,
  selectedCity,
  appliedDiscountRate,
  promoCode,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'qr_scanner' | 'success'>('details');

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+7 7');
  const [cityId, setCityId] = useState(selectedCity.id);
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'yandex' | 'kazpost' | 'cdek'>('yandex');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kaspi_qr');
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [qrTimeLeft, setQrTimeLeft] = useState(899); // 15 mins

  // Random realistic order number
  const [orderNumber] = useState(() => `KZ-SPK-${Math.floor(100000 + Math.random() * 900000)}`);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * appliedDiscountRate);
  const isFreeDelivery = subtotal >= 10000;
  const deliveryFee = isFreeDelivery ? 0 : 1200;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);
  const kaspiRedInstallment = Math.round(total / 3);

  // Timer for QR code
  useEffect(() => {
    if (step === 'qr_scanner') {
      const interval = setInterval(() => {
        setQrTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b00', '#e50914', '#9d4edd', '#ffb693'],
    });
  };

  const handleSimulatePaymentDone = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setStep('success');
      triggerSuccessConfetti();
      onOrderSuccess();
    }, 1200);
  };

  const formatQrTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#141414] border border-[#2a2a2a] rounded-3xl shadow-2xl overflow-hidden my-6 text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e50914] flex items-center justify-center text-white font-bold shadow-lg shadow-[#e50914]/25">
              <span>K</span>
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                Kaspi Оформление
                <span className="text-[10px] bg-red-950/70 border border-red-500/40 text-red-300 px-2 py-0.5 rounded-full uppercase">
                  Безопасно
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                {step === 'details' && 'Шаг 1 из 3: Контакты и адрес доставки'}
                {step === 'payment' && 'Шаг 2 из 3: Способ оплаты'}
                {step === 'qr_scanner' && 'Шаг 3 из 3: Сканирование Kaspi QR'}
                {step === 'success' && 'Заказ успешно подтвержден! 🎉'}
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

        {/* Modal Body according to current step */}
        <div className="p-5 sm:p-6">
          {/* STEP 1: Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Имя и Фамилия получателя
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Айгерим Нурланова"
                  className="w-full bg-[#1c1b1b] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Номер телефона (привязан к Kaspi)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 777 123 4567"
                  className="w-full bg-[#1c1b1b] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Город доставки
                  </label>
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full bg-[#1c1b1b] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                  >
                    {KAZAKHSTAN_CITIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name[currentLang]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Служба доставки
                  </label>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value as any)}
                    className="w-full bg-[#1c1b1b] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                  >
                    <option value="yandex">Яндекс Доставка (до двери)</option>
                    <option value="kazpost">Казпочта (до отделения)</option>
                    <option value="cdek">СДЭК Экспресс</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Улица, дом, квартира / Общежитие университета
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="пр. Абая 44, кв 12 или Дом студентов КазНУ"
                  className="w-full bg-[#1c1b1b] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              {/* Order total mini preview */}
              <div className="p-3.5 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-400">Сумма заказа с учетом скидки:</span>
                  <p className="text-base font-display font-black text-white mt-0.5">
                    {total.toLocaleString()} ₸
                  </p>
                </div>
                <div className="text-right text-[11px] text-emerald-400 font-semibold">
                  {deliveryFee === 0 ? 'Бесплатная доставка' : `Доставка: ${deliveryFee} ₸`}
                </div>
              </div>

              <button
                onClick={() => setStep('payment')}
                disabled={!customerName.trim() || phone.length < 8}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#e50914] hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 text-white font-display font-bold text-sm shadow-lg shadow-[#ff6b00]/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Перейти к выбору способа оплаты</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Payment Method Choice */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="space-y-2.5">
                {/* Option 1: Kaspi QR */}
                <div
                  onClick={() => setPaymentMethod('kaspi_qr')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'kaspi_qr'
                      ? 'bg-[#1f1614] border-[#e50914] shadow-lg shadow-[#e50914]/15'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e50914] text-white flex items-center justify-center shrink-0 font-black">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        Kaspi QR (Рекомендуется)
                        <span className="bg-[#e50914] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                          Топ KZ
                        </span>
                      </h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'kaspi_qr' ? 'border-[#e50914] bg-[#e50914]' : 'border-neutral-500'}`}>
                        {paymentMethod === 'kaspi_qr' && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Оплата через приложение Kaspi.kz без ввода данных карты. Мгновенные бонусы до 5%!
                    </p>
                  </div>
                </div>

                {/* Option 2: Kaspi Red */}
                <div
                  onClick={() => setPaymentMethod('kaspi_red')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'kaspi_red'
                      ? 'bg-[#1f1614] border-[#ff6b00] shadow-lg shadow-[#ff6b00]/15'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#e50914] text-white flex items-center justify-center shrink-0 font-black">
                    <span className="text-xs">RED</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        Kaspi Red (Рассрочка 0-0-3)
                      </h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'kaspi_red' ? 'border-[#ff6b00] bg-[#ff6b00]' : 'border-neutral-500'}`}>
                        {paymentMethod === 'kaspi_red' && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-[#ffb693] font-semibold mt-1">
                      3 платежа по {kaspiRedInstallment.toLocaleString()} ₸ в месяц без переплат
                    </p>
                  </div>
                </div>

                {/* Option 3: Halyk Pay */}
                <div
                  onClick={() => setPaymentMethod('halyk_pay')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'halyk_pay'
                      ? 'bg-[#131f18] border-emerald-500'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                    <span>H</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Halyk Bank / Homebank</h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'halyk_pay' ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-500'}`}>
                        {paymentMethod === 'halyk_pay' && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Оплата через Halyk QR или приложение Homebank
                    </p>
                  </div>
                </div>

                {/* Option 4: Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'card'
                      ? 'bg-[#1c1c1c] border-neutral-300'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-neutral-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Банковская карта Visa / Mastercard</h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-white bg-white' : 'border-neutral-500'}`}>
                        {paymentMethod === 'card' && <Check className="w-3 h-3 text-black" />}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Любая банковская карта Казахстана и зарубежных банков
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('details')}
                  className="px-4 py-3 rounded-xl bg-[#242424] text-neutral-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Назад
                </button>
                <button
                  onClick={() => setStep('qr_scanner')}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff6b00] hover:brightness-110 text-white font-display font-bold text-sm shadow-xl shadow-[#e50914]/25 flex items-center justify-center gap-2"
                >
                  <span>Оплатить {total.toLocaleString()} ₸</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Interactive Kaspi QR Screen */}
          {step === 'qr_scanner' && (
            <div className="space-y-5 text-center">
              <div className="inline-flex items-center gap-2 bg-[#e50914]/20 border border-[#e50914]/40 px-3 py-1.5 rounded-full text-xs font-bold text-[#ffb4aa]">
                <Clock className="w-3.5 h-3.5 text-[#e50914]" />
                Код действителен: {formatQrTime(qrTimeLeft)}
              </div>

              {/* Realistic Kaspi QR Visual Frame */}
              <div className="relative mx-auto w-64 h-64 bg-white p-4 rounded-3xl shadow-2xl shadow-red-950/50 flex flex-col items-center justify-center border-4 border-[#e50914]">
                {/* Custom SVG QR Code pattern */}
                <svg viewBox="0 0 200 200" className="w-full h-full text-black">
                  {/* Position detection markers */}
                  <rect x="10" y="10" width="45" height="45" fill="black" rx="6" />
                  <rect x="18" y="18" width="29" height="29" fill="white" rx="4" />
                  <rect x="24" y="24" width="17" height="17" fill="#e50914" rx="2" />

                  <rect x="145" y="10" width="45" height="45" fill="black" rx="6" />
                  <rect x="153" y="18" width="29" height="29" fill="white" rx="4" />
                  <rect x="159" y="24" width="17" height="17" fill="#e50914" rx="2" />

                  <rect x="10" y="145" width="45" height="45" fill="black" rx="6" />
                  <rect x="18" y="153" width="29" height="29" fill="white" rx="4" />
                  <rect x="24" y="159" width="17" height="17" fill="#e50914" rx="2" />

                  {/* QR dot matrix matrix */}
                  <g fill="black">
                    <rect x="65" y="15" width="12" height="12" rx="2" />
                    <rect x="85" y="15" width="12" height="12" rx="2" />
                    <rect x="105" y="15" width="12" height="12" rx="2" />
                    <rect x="125" y="15" width="12" height="12" rx="2" />

                    <rect x="65" y="35" width="12" height="12" rx="2" />
                    <rect x="95" y="35" width="12" height="12" rx="2" />
                    <rect x="115" y="35" width="12" height="12" rx="2" />

                    <rect x="15" y="65" width="12" height="12" rx="2" />
                    <rect x="35" y="65" width="12" height="12" rx="2" />
                    <rect x="65" y="65" width="12" height="12" rx="2" />
                    <rect x="85" y="65" width="12" height="12" rx="2" />
                    <rect x="115" y="65" width="12" height="12" rx="2" />
                    <rect x="145" y="65" width="12" height="12" rx="2" />
                    <rect x="175" y="65" width="12" height="12" rx="2" />

                    <rect x="15" y="85" width="12" height="12" rx="2" />
                    <rect x="35" y="85" width="12" height="12" rx="2" />
                    <rect x="65" y="85" width="12" height="12" rx="2" />
                    <rect x="125" y="85" width="12" height="12" rx="2" />
                    <rect x="165" y="85" width="12" height="12" rx="2" />

                    <rect x="15" y="105" width="12" height="12" rx="2" />
                    <rect x="65" y="105" width="12" height="12" rx="2" />
                    <rect x="85" y="105" width="12" height="12" rx="2" />
                    <rect x="105" y="105" width="12" height="12" rx="2" />
                    <rect x="145" y="105" width="12" height="12" rx="2" />
                    <rect x="175" y="105" width="12" height="12" rx="2" />

                    <rect x="35" y="125" width="12" height="12" rx="2" />
                    <rect x="85" y="125" width="12" height="12" rx="2" />
                    <rect x="125" y="125" width="12" height="12" rx="2" />
                    <rect x="155" y="125" width="12" height="12" rx="2" />

                    <rect x="65" y="145" width="12" height="12" rx="2" />
                    <rect x="95" y="145" width="12" height="12" rx="2" />
                    <rect x="115" y="145" width="12" height="12" rx="2" />
                    <rect x="165" y="145" width="12" height="12" rx="2" />

                    <rect x="65" y="165" width="12" height="12" rx="2" />
                    <rect x="85" y="165" width="12" height="12" rx="2" />
                    <rect x="135" y="165" width="12" height="12" rx="2" />
                    <rect x="165" y="165" width="12" height="12" rx="2" />
                  </g>

                  {/* Center Kaspi Pumpkin Logo */}
                  <circle cx="100" cy="100" r="20" fill="white" />
                  <circle cx="100" cy="100" r="17" fill="#ff6b00" />
                  <text x="100" y="106" textAnchor="middle" fontSize="14" fill="white">🎃</text>
                </svg>
              </div>

              {/* Instructions */}
              <div className="bg-[#1c1b1b] p-3.5 rounded-2xl border border-[#2a2a2a] max-w-sm mx-auto text-left space-y-1.5 text-xs text-neutral-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#ff6b00]" />
                  Как оплатить:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400 pl-1">
                  <li>Откройте приложение <strong>Kaspi.kz</strong></li>
                  <li>Нажмите <strong>Kaspi QR</strong> на главном экране</li>
                  <li>Наведите камеру на QR-код и подтвердите оплату</li>
                </ol>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 max-w-sm mx-auto">
                <button
                  onClick={handleSimulatePaymentDone}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-display font-bold text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Связь с банком Kaspi...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Я оплатил в приложении Kaspi</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep('payment')}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Выбрать другой способ оплаты
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Order Success & Delivery Tracker */}
          {step === 'success' && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#ff6b00] to-emerald-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 text-3xl">
                🎃
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                  Ура! Заказ принят в работу!
                </h3>
                <p className="text-xs text-neutral-300 mt-1 max-w-sm mx-auto">
                  Спасибо за покупку в Spooky Stationery KZ! Чек и трек-номер отправлены на номер <strong>{phone}</strong>.
                </p>
              </div>

              {/* Order number pill with copy */}
              <div className="inline-flex items-center gap-2 bg-[#201f1f] border border-[#ff6b00]/40 px-3.5 py-1.5 rounded-full text-xs">
                <span className="text-neutral-400">Номер заказа:</span>
                <span className="font-mono font-bold text-[#ffb693]">{orderNumber}</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(orderNumber);
                    setCopiedOrderId(true);
                    setTimeout(() => setCopiedOrderId(false), 2000);
                  }}
                  className="text-neutral-400 hover:text-white p-1"
                  title="Скопировать номер заказа"
                >
                  {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Spooky delivery tracking pipeline */}
              <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] text-left space-y-3">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#ff6b00]" />
                  Статус доставки в г. {KAZAKHSTAN_CITIES.find(c => c.id === cityId)?.name.ru || selectedCity.name.ru}:
                </h4>

                <div className="relative pl-6 space-y-4 border-l-2 border-[#ff6b00]">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-950" />
                    <p className="text-xs font-bold text-white">Оплата Kaspi подтверждена ✅</p>
                    <p className="text-[11px] text-neutral-400">Транзакция одобрена банком</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-[#ff6b00] animate-ping" />
                    <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-[#ff6b00]" />
                    <p className="text-xs font-bold text-[#ffb693]">Ведьма упаковывает посылку 🧙‍♀️</p>
                    <p className="text-[11px] text-neutral-400">Пенал-гробик и подарок бережно сложены в черную коробку</p>
                  </div>

                  <div className="relative opacity-60">
                    <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-[#2a2a2a]" />
                    <p className="text-xs font-bold text-neutral-300">Летучая мышь курьер в пути 🦇</p>
                    <p className="text-[11px] text-neutral-500">Доставка по адресу: {address || 'До отделения'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/77071234567?text=Здравствуйте!%20Мой%20заказ%20${orderNumber}%20в%20Spooky%20Stationery%20KZ`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Написать в WhatsApp менеджеру</span>
                </a>

                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl bg-[#242424] hover:bg-[#2e2e2e] text-white font-bold text-xs"
                >
                  Вернуться в магазин
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
