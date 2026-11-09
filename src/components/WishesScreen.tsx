import React from 'react';
import { Sparkles, Heart, Cake } from 'lucide-react';
import { romanticAudio } from '../utils/audio.ts';

interface WishesScreenProps {
  onContinue: () => void;
}

export const WishesScreen: React.FC<WishesScreenProps> = ({ onContinue }) => {
  const handleProceed = () => {
    romanticAudio.playChime();
    onContinue();
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 w-full max-w-lg mx-auto">
      <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 text-center border border-amber-300/35 shadow-2xl relative overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Cute Birthday Cake Badge */}
        <div className="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/20 to-rose-400/30 blur-md animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-[#4a102a] to-[#240816] border-2 border-amber-300/50 flex items-center justify-center shadow-lg gold-glow-subtle">
            <Cake className="w-10 h-10 text-amber-300 animate-bounce" />
          </div>
          {/* Decorative Sparkle dots */}
          <span className="absolute -top-1 right-2 text-amber-300 text-lg animate-ping">✨</span>
          <span className="absolute bottom-2 -left-1 text-rose-300 text-sm animate-pulse">❤️</span>
        </div>

        {/* Small intro banner */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>A Special Day For A Special Soul</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white mb-4 tracking-tight leading-tight">
          Happiest Birthday, Hari! <span className="text-rose-400 inline-block animate-pulse">❤️</span>
        </h1>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-300/50" />
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-300/50" />
        </div>

        {/* Message */}
        <div className="relative my-6 px-2 sm:px-4">
          <p className="text-base sm:text-lg text-pink-100/90 leading-relaxed font-light">
            Today is all about you! I hope your day is filled with happiness, endless smiles, beautiful moments and everything your heart wishes for.
          </p>
          <p className="text-base sm:text-lg text-amber-200/95 font-handwriting text-2xl sm:text-3xl mt-4 font-semibold">
            &ldquo;You deserve all the love and happiness in this world.&rdquo;
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleProceed}
            className="w-full sm:w-auto min-w-[220px] py-3.5 px-8 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-[#2b0b18] font-semibold text-base shadow-xl gold-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mx-auto min-h-[48px]"
          >
            <span>Let&apos;s Celebrate</span>
            <span className="text-lg">🎉</span>
          </button>
        </div>

        <p className="mt-4 text-xs text-pink-300/60 font-light">
          There are surprises waiting for you ahead... ✨
        </p>
      </div>
    </div>
  );
};
