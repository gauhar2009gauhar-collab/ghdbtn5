import React, { useState } from 'react';
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  CreditCard, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Truck,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Как работает оплата через Kaspi Pay и Kaspi Red 0-0-3?',
      a: 'При оформлении заказа выберите Kaspi QR. Отсканируйте код в приложении Kaspi.kz и выберите счет: Kaspi Gold (с бонусами) или Kaspi Red (в рассрочку на 3 месяца без переплат). Никаких скрытых комиссий!',
    },
    {
      q: 'Сколько времени занимает доставка по городам Казахстана?',
      a: 'По Алматы и Астане доступна быстрая доставка через Яндекс Доставку от 2-3 часов. В Шымкент, Караганду, Актобе, Павлодар и другие города отправляем Казпочтой или СДЭК за 1-3 рабочих дня.',
    },
    {
      q: 'Что входит в подарочный бокс с сюрпризом?',
      a: 'В каждый заказ от 10,000 ₸ мы бесплатно вкладываем пачку из 30 хэллоуинских виниловых наклеек и милую закладку-призрака! А в кастомном боксе «Зелье» действует спец-скидка 15%.',
    },
    {
      q: 'Можно ли вернуть или обменять канцелярский товар?',
      a: 'Да! В течение 14 дней вы можете вернуть товар надлежащего качества, если сохранен товарный вид и заводская упаковка.',
    },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#201f1f] text-neutral-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* FAQ Section */}
        <div className="border-b border-[#1f1f1f] pb-10">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-[#ff6b00]" />
            <h3 className="text-lg font-display font-bold text-white">
              Часто задаваемые вопросы (FAQ)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#141414] border border-[#242424] rounded-2xl p-4 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-white"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#ff6b00] shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
                  )}
                </button>
                {openFaq === idx && (
                  <p className="text-xs text-neutral-400 mt-2.5 pt-2 border-t border-[#1f1f1f] leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#e50914] flex items-center justify-center text-lg">
                🎃
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                SPOOKY STATIONERY <span className="text-[#ff6b00]">KZ</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Главный хэллоуинский магазин канцтоваров в Казахстане. Стильные гримуары, анатомические пеналы-гробики и светящиеся ручки для твоих идеальных конспектов.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] text-neutral-300 hover:text-[#ff6b00] transition-colors border border-[#2a2a2a]"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/77071234567"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] text-neutral-300 hover:text-emerald-400 transition-colors border border-[#2a2a2a]"
                title="WhatsApp"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Каталог товаров
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li><a href="#catalog" className="hover:text-[#ffb693] transition-colors">Пеналы-гробики и органайзеры</a></li>
              <li><a href="#catalog" className="hover:text-[#ffb693] transition-colors">Светящиеся ручки с тыковками</a></li>
              <li><a href="#catalog" className="hover:text-[#ffb693] transition-colors">Блокноты-гримуары с замками</a></li>
              <li><a href="#catalog" className="hover:text-[#ffb693] transition-colors">Маркеры «Ядовитые зелья»</a></li>
              <li><a href="#catalog" className="hover:text-[#ffb693] transition-colors">Подарочные наборы к сессии</a></li>
            </ul>
          </div>

          {/* Delivery & Pick up */}
          <div className="md:col-span-2 space-y-2.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Доставка в KZ
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>Яндекс Доставка (Алматы, Астана)</li>
              <li>Казпочта (1-3 дня)</li>
              <li>СДЭК Экспресс</li>
              <li>Самовывоз: Алматы, пр. Абая</li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="md:col-span-3 space-y-2.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Связь с нами
            </h4>
            <p className="text-neutral-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" />
              г. Алматы, Бостандыкский р-н
            </p>
            <p className="text-neutral-400 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#ff6b00]" />
              +7 (707) 666-2026 (WhatsApp)
            </p>
            <p className="text-neutral-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#ff6b00]" />
              orders@spookystationery.kz
            </p>
          </div>
        </div>

        {/* Payment logos and copyright */}
        <div className="pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="bg-[#1f1614] border border-[#e50914]/40 text-[#ffb4aa] px-2 py-1 rounded font-bold text-[10px]">
              KASPI PAY / RED
            </span>
            <span className="bg-[#131f18] border border-emerald-500/40 text-emerald-300 px-2 py-1 rounded font-bold text-[10px]">
              HALYK BANK
            </span>
            <span className="bg-[#1a1a1a] border border-[#2e2e2e] text-neutral-300 px-2 py-1 rounded font-bold text-[10px]">
              VISA / MASTERCARD
            </span>
          </div>

          <p className="text-center sm:text-right">
            Spooky Stationery KZ © 2026. Все права защищены. Доставка по всему Казахстану 🇰🇿
          </p>
        </div>
      </div>
    </footer>
  );
};
