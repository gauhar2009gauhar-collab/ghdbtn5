import React from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import { STUDENT_REVIEWS } from '../data/products';
import { Language } from '../types';

interface ReviewsSectionProps {
  currentLang: Language;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ currentLang }) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#201f1f] bg-[#0e0e0e]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6b00]/15 text-[#ffb693] text-xs font-semibold mb-2">
              <span>⭐ 4.9 из 5.0 на основе 1,280+ заказов</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
              {currentLang === 'ru' && 'Что говорят студенты Казахстана 🦇'}
              {currentLang === 'kz' && 'Қазақстан студенттері не дейді 🦇'}
              {currentLang === 'en' && 'Student Reviews from Kazakhstan 🦇'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Реальные отзывы школьников и студентов из Алматы, Астаны и Шымкента
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-300 bg-[#1a1a1a] px-3.5 py-2 rounded-xl border border-[#2a2a2a]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% проверенные отзывы через Kaspi Pay</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STUDENT_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-[#161616] border border-[#242424] hover:border-[#353534] transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: User avatar & details */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-[#353534]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {rev.author}
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded font-medium">
                        Kaspi
                      </span>
                    </h4>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#ff6b00]" />
                      <span>г. {rev.city} • {rev.school}</span>
                    </p>
                  </div>
                </div>

                {/* Rating & Product Tag */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium">{rev.date}</span>
                </div>

                <span className="inline-block text-[11px] font-semibold text-[#ffb693] bg-[#242424] px-2 py-0.5 rounded-md mb-2">
                  {rev.productName}
                </span>

                {/* Comment */}
                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="text-[10px] text-neutral-500 pt-2 border-t border-[#201f1f]">
                Подтвержденный заказ через Kaspi Pay
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
