import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react';
import { Language, Product } from '../types';
import { PRODUCTS } from '../data/products';

interface SpookyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onAddToCart: (product: Product) => void;
}

export const SpookyQuizModal: React.FC<SpookyQuizModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any | null>(null);

  const questions = [
    {
      title: 'Как ты обычно приходишь на первые пары к 8:00?',
      options: [
        { text: 'Как восставший зомби с литром крепкого кофе ☕️🧟', score: 'chaos' },
        { text: 'Как призрак-невидимка на самую дальнюю парту 👻', score: 'stealth' },
        { text: 'Как верховная ведьма с безупречным макияжем и конспектом 🧙‍♀️', score: 'magic' },
        { text: 'Как вампир, скрывающийся от дневного света в капюшоне 🦇', score: 'goth' },
      ],
    },
    {
      title: 'Чем тебе больше всего нравится вести конспекты?',
      options: [
        { text: 'Ядовито-неоновыми текстовыделителями всех цветов 🧪', score: 'chaos' },
        { text: 'Милыми голографическими стикерами-призраками 📑', score: 'stealth' },
        { text: 'Винтажной чернильницей-котлом и перьевой ручкой 🪶', score: 'goth' },
        { text: 'Черными гелевыми светящимися ручками 0.5 мм 🎃', score: 'magic' },
      ],
    },
    {
      title: 'Твой секретный ритуал подготовки к сессии?',
      options: [
        { text: 'Ночной шабаш в библиотеке с одногруппниками 📚', score: 'magic' },
        { text: 'Спиритический сеанс с билетами за 2 часа до экзамена 🔮', score: 'chaos' },
        { text: 'Запереться в темной комнате с котиком и гримуаром 🐈‍⬛', score: 'goth' },
        { text: 'Тихо повторять всё по памяти, пока никто не видит 🕯', score: 'stealth' },
      ],
    },
  ];

  const handleSelectOption = (index: number) => {
    const nextAnswers = [...answers, index];
    setAnswers(nextAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate outcome
      calculateResult(nextAnswers);
    }
  };

  const calculateResult = (ans: number[]) => {
    const sum = ans.reduce((a, b) => a + b, 0);
    if (sum <= 2) {
      setResult({
        title: 'Академическая ведьма отличница ✨🧙‍♀️',
        desc: 'Твои конспекты идеальны, как древние свитки заклинаний. Одногруппники умоляют дать переписать, а преподаватели ставят зачет автоматом.',
        recommendedProduct: PRODUCTS[2], // Grimoire
        badge: 'Скидка 15% по коду SPOOKY2026',
      });
    } else if (sum <= 4) {
      setResult({
        title: 'Полуночный библиотечный призрак 👻📖',
        desc: 'Ты появляешься внезапно, бесшумно сдаешь все лабы и исчезаешь в закате. Любишь тишину, уютные стикеры и светящиеся огоньки.',
        recommendedProduct: PRODUCTS[6], // Ghost sticky notes
        badge: 'Скидка 15% по коду SPOOKY2026',
      });
    } else if (sum <= 6) {
      setResult({
        title: 'Готический алхимик дедлайнов 🧪🖤',
        desc: 'Ты пьешь кофе из котла и сдаешь курсовую за 10 минут до закрытия портала. Твой стол — это лаборатория гениального безумия.',
        recommendedProduct: PRODUCTS[3], // Potion highlighters
        badge: 'Скидка 15% по коду SPOOKY2026',
      });
    } else {
      setResult({
        title: 'Владыка склепа и вампирской эстетики 🦇⚰️',
        desc: 'Твой стиль безупречен: чернейший бархат, острые линии и гробики вместо скучных пластиковых пеналов. Икона университетского вайба.',
        recommendedProduct: PRODUCTS[0], // Coffin case
        badge: 'Скидка 15% по коду SPOOKY2026',
      });
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#141414] border border-[#ff6b00]/40 rounded-3xl shadow-2xl overflow-hidden my-6 text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between bg-[#1a1a1a]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">👻</span>
            <div>
              <h3 className="text-base font-display font-bold text-white">
                Тест: Какой ты призрак на парах?
              </h3>
              <p className="text-[11px] text-neutral-400">
                {!result ? `Вопрос ${currentQuestion + 1} из ${questions.length}` : 'Твой результат готов!'}
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

        {/* Body */}
        <div className="p-5 sm:p-6">
          {!result ? (
            <div className="space-y-4">
              <h4 className="text-sm sm:text-base font-display font-bold text-white leading-snug">
                {questions[currentQuestion].title}
              </h4>

              <div className="space-y-2.5">
                {questions[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="w-full p-3.5 rounded-2xl bg-[#1c1b1b] hover:bg-[#242424] border border-[#2e2e2e] hover:border-[#ff6b00] text-left text-xs sm:text-sm text-neutral-200 transition-all flex items-center justify-between group"
                  >
                    <span>{opt.text}</span>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-[#ff6b00] transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-3xl bg-[#ff6b00]/20 border border-[#ff6b00]/40 flex items-center justify-center mx-auto text-3xl">
                🎃
              </div>

              <div>
                <h4 className="text-lg font-display font-black text-white">
                  {result.title}
                </h4>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                  {result.desc}
                </p>
              </div>

              {/* Recommended Product Box */}
              <div className="p-3.5 rounded-2xl bg-[#1c1b1b] border border-[#2e2e2e] text-left flex items-center gap-3">
                <img
                  src={result.recommendedProduct.images[0]}
                  alt="prod"
                  className="w-14 h-14 object-cover rounded-xl border border-[#242424]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#ffb693]">
                    Идеально подходит тебе:
                  </span>
                  <p className="text-xs font-bold text-white truncate">
                    {result.recommendedProduct.name[currentLang]}
                  </p>
                  <p className="text-xs font-black text-[#ff6b00]">
                    {result.recommendedProduct.price.toLocaleString()} ₸
                  </p>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(result.recommendedProduct);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ff8533] text-black font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">В корзину</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-[#242424] text-xs font-semibold text-neutral-300 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Пройти еще раз
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#ff6b00] text-black font-bold text-xs"
                >
                  В магазин
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
