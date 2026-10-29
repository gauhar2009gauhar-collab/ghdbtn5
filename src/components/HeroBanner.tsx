import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Truck, 
  CreditCard, 
  Gift, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HeroBannerProps {
  currentLang: Language;
  onExploreCatalog: () => void;
  onOpenPotionBuilder: () => void;
  onOpenQuiz: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentLang,
  onExploreCatalog,
  onOpenPotionBuilder,
  onOpenQuiz,
}) => {
  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0d0d0d] pt-6 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#201f1f]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#ff6b00]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#e50914]/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5">
            {/* Limited collection tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#ff6b00]/40 text-[#ffb693] text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-pulse" />
              <span>{translations.heroBadge[currentLang]}</span>
            </div>

            {/* Main Punchy Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-[1.1]">
              {translations.heroTitle[currentLang]}
            </h1>

            {/* Subtitle */}
            <p className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              {translations.heroSubtitle[currentLang]}
            </p>

            {/* Flash Sale Countdown Bar */}
            <div className="w-full sm:w-auto bg-[#1a1a1a]/90 backdrop-blur-md border border-[#2a2a2a] p-3.5 rounded-2xl flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#ffb693]">
                <Clock className="w-4 h-4 text-[#ff6b00] animate-spin" style={{ animationDuration: '8s' }} />
                <span>{translations.flashSaleEndsIn[currentLang]}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="bg-[#242424] border border-[#ff6b00]/30 px-2.5 py-1 rounded-lg text-center min-w-[38px]">
                  <span className="text-sm font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-neutral-400 font-bold">{translations.hours[currentLang]}</span>
                </div>
                <span className="text-neutral-500 font-bold">:</span>
                <div className="bg-[#242424] border border-[#ff6b00]/30 px-2.5 py-1 rounded-lg text-center min-w-[38px]">
                  <span className="text-sm font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-neutral-400 font-bold">{translations.minutes[currentLang]}</span>
                </div>
                <span className="text-neutral-500 font-bold">:</span>
                <div className="bg-[#242424] border border-[#ff6b00]/30 px-2.5 py-1 rounded-lg text-center min-w-[38px]">
                  <span className="text-sm font-black text-[#ff6b00]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-neutral-400 font-bold">{translations.seconds[currentLang]}</span>
                </div>
              </div>
              <span className="text-xs bg-[#e50914] text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ml-auto sm:ml-0">
                -30% Скидка
              </span>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={onExploreCatalog}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#e50914] hover:brightness-110 text-white font-display font-bold text-sm shadow-xl shadow-[#ff6b00]/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{translations.ctaCatalog[currentLang]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPotionBuilder}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] text-purple-300 font-display font-semibold text-sm border border-purple-500/40 hover:border-purple-400 shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{translations.ctaPotion[currentLang]}</span>
              </button>

              <button
                onClick={onOpenQuiz}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1a1a1a]/70 hover:bg-[#201f1f] text-neutral-300 text-xs font-medium border border-[#2a2a2a] hover:text-[#ffb693] transition-colors cursor-pointer"
              >
                <span>{translations.ctaQuiz[currentLang]}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Feature Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-b from-[#242424] to-[#141414] p-1.5 border border-[#353534] shadow-2xl shadow-black/80">
              <div className="relative rounded-[22px] overflow-hidden bg-[#0d0d0d]">
                {/* Visual Image with Overlay */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80"
                    alt="Spooky stationery set"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/30" />

                  {/* Floating badge top left */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-[#ff6b00]/50 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="text-base">⚰️</span>
                    <span>Пенал-гробик & Гримуар</span>
                  </div>

                  {/* Kaspi Pay badge top right */}
                  <div className="absolute top-4 right-4 bg-[#e50914] text-white px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                    <span>Kaspi Red 0-0-3</span>
                  </div>

                  {/* Price pill at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#1a1a1a]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-neutral-400 font-medium">Хит этой осени</p>
                      <p className="text-sm font-bold text-white">Midnight Coven Kit</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-500 line-through mr-1.5">21,990 ₸</span>
                      <span className="text-base font-black text-[#ff6b00]">14,990 ₸</span>
                    </div>
                  </div>
                </div>

                {/* Micro info inside card */}
                <div className="p-4 bg-[#141414] border-t border-[#242424] flex items-center justify-between text-xs text-neutral-300">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Zap className="w-3.5 h-3.5" /> В наличии в Алматы и Астане
                  </span>
                  <span className="text-neutral-400">🔥 184 студента заказали</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Value Props for Kazakhstan e-commerce */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-8 border-t border-[#201f1f]">
          <div className="bg-[#161616] p-3.5 rounded-2xl border border-[#262626] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                {translations.perks.freeDelivery.title[currentLang]}
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {translations.perks.freeDelivery.desc[currentLang]}
              </p>
            </div>
          </div>

          <div className="bg-[#161616] p-3.5 rounded-2xl border border-[#262626] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#e50914]/15 text-[#e50914] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                {translations.perks.kaspiRed.title[currentLang]}
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {translations.perks.kaspiRed.desc[currentLang]}
              </p>
            </div>
          </div>

          <div className="bg-[#161616] p-3.5 rounded-2xl border border-[#262626] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                {translations.perks.fastDispatch.title[currentLang]}
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {translations.perks.fastDispatch.desc[currentLang]}
              </p>
            </div>
          </div>

          <div className="bg-[#161616] p-3.5 rounded-2xl border border-[#262626] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                {translations.perks.originalGifts.title[currentLang]}
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {translations.perks.originalGifts.desc[currentLang]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
