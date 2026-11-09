import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { romanticAudio } from '../utils/audio.ts';

interface CandleScreenProps {
  onCandleBlown: () => void;
}

export const CandleScreen: React.FC<CandleScreenProps> = ({ onCandleBlown }) => {
  const [isBlown, setIsBlown] = useState(false);
  const [showWishesGranted, setShowWishesGranted] = useState(false);

  const handleBlowCandle = () => {
    if (isBlown) return;

    // Play breath/blow sound
    romanticAudio.playCandleBlow();
    setIsBlown(true);

    // Confetti explosion after flame goes out
    setTimeout(() => {
      romanticAudio.playConfettiPop();
      setShowWishesGranted(true);

      // Multi-stage celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#f43f5e', '#fbbf24', '#e879f9'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ffd700', '#ff69b4', '#ff1493'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffd700', '#ff69b4', '#ff1493'],
        });
      }, 300);
    }, 600);
  };

  const handleProceedToMenu = () => {
    romanticAudio.playChime();
    onCandleBlown();
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 w-full max-w-lg mx-auto">
      <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 text-center border border-amber-300/30 shadow-2xl relative overflow-hidden transition-all duration-700">
        {/* Radiating Candle Glow Aura (fades when blown) */}
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none transition-all duration-1000 ${
            !isBlown
              ? 'bg-gradient-to-r from-amber-400/25 via-rose-500/20 to-orange-400/20 blur-3xl opacity-100 scale-110'
              : 'opacity-0 scale-50'
          }`}
        />

        {/* Header Text */}
        <div className="relative z-10 mb-6">
          <p className="text-xs uppercase tracking-widest text-amber-200/80 font-medium mb-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            A MOMENT OF MAGIC
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white tracking-tight">
            {!isBlown ? 'Make a Wish, Hari' : 'A Wish Sent to the Stars'}
          </h2>
          <p className="text-base sm:text-lg text-pink-200 font-handwriting text-xl sm:text-2xl mt-1">
            {!isBlown
              ? 'Close your eyes and make a wish, Hari... ✨'
              : 'Your wish has been made... ❤️'}
          </p>
        </div>

        {/* The Realistic Candle & Cake Graphic */}
        <div className="relative my-8 h-48 sm:h-56 flex flex-col items-center justify-center select-none">
          {/* Flame & Glow Container */}
          <div className="relative h-20 w-16 flex items-center justify-center">
            {/* The Flame */}
            <div
              className={`relative transition-all duration-700 ${
                isBlown
                  ? 'opacity-0 scale-0 -translate-y-4 filter blur-sm'
                  : 'opacity-100 scale-100 animate-flame'
              }`}
            >
              {/* Outer flame */}
              <div className="w-6 h-12 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-[50%_50%_35%_35%] shadow-[0_0_20px_#f59e0b,0_0_40px_#ef4444]" />
              {/* Inner core flame */}
              <div className="absolute inset-x-1.5 bottom-1 h-6 bg-gradient-to-t from-blue-400 via-white to-yellow-200 rounded-[50%_50%_40%_40%]" />
              {/* Sparkle micro dots */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] animate-ping" />
            </div>

            {/* Candle Wick */}
            <div className="absolute bottom-0 w-1 h-4 bg-stone-800 rounded-t-sm" />

            {/* Smoke puff when blown */}
            {isBlown && (
              <div className="absolute -top-4 w-6 h-16 pointer-events-none animate-[fade-out_2s_ease-out_forwards]">
                <div className="w-2 h-2 rounded-full bg-stone-400/60 blur-[1px] animate-[ping_1.5s_infinite]" />
                <div className="w-3 h-8 bg-gradient-to-t from-stone-400/40 to-transparent blur-sm -translate-y-4 translate-x-1" />
              </div>
            )}
          </div>

          {/* Candle Body */}
          <div className="relative w-7 h-20 bg-gradient-to-r from-[#ffd166] via-[#fff3b0] to-[#e0a93b] rounded-t-sm shadow-md border-t border-amber-100/60">
            {/* Wax drips */}
            <div className="absolute top-0 -left-1 w-2.5 h-4 bg-[#ffd166] rounded-b-full shadow-sm" />
            <div className="absolute top-0 right-0 w-2 h-6 bg-[#fff3b0] rounded-b-full shadow-sm" />
            <div className="absolute inset-x-0 bottom-0 h-2 bg-black/20" />
            {/* Cute heart on the candle */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-rose-500 text-xs">
              ❤️
            </div>
          </div>

          {/* Miniature Gourmet Cake Base */}
          <div className="relative -mt-1 w-44 sm:w-52 flex flex-col items-center">
            {/* Frosting drips */}
            <div className="w-40 sm:w-48 h-4 bg-gradient-to-r from-rose-200 via-white to-pink-200 rounded-t-xl shadow-sm z-10 flex justify-around px-2">
              <span className="w-3 h-3 bg-white rounded-b-full shadow-xs -mt-0.5" />
              <span className="w-4 h-4 bg-pink-100 rounded-b-full shadow-xs -mt-0.5" />
              <span className="w-3 h-3 bg-white rounded-b-full shadow-xs -mt-0.5" />
              <span className="w-3.5 h-3.5 bg-rose-100 rounded-b-full shadow-xs -mt-0.5" />
              <span className="w-4 h-4 bg-white rounded-b-full shadow-xs -mt-0.5" />
            </div>
            {/* Cake Layer */}
            <div className="w-44 sm:w-52 h-14 bg-gradient-to-r from-[#4a102a] via-[#5c1635] to-[#4a102a] rounded-xl border border-amber-300/40 shadow-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-amber-400/40" />
              <span className="font-handwriting text-lg text-amber-200 tracking-wide z-10">
                Happy Birthday Hari 🎂
              </span>
            </div>
            {/* Golden Plate */}
            <div className="w-52 sm:w-60 h-3 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 rounded-full shadow-lg border border-amber-300/50 -mt-1" />
          </div>
        </div>

        {/* Wishes Result or Blow Button */}
        {!isBlown ? (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleBlowCandle}
              className="w-full sm:w-auto min-w-[240px] py-4 px-8 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-[#2b0b18] font-bold text-base shadow-xl gold-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 mx-auto min-h-[48px]"
            >
              <span>Blow the Candle</span>
              <span className="text-xl">🕯️</span>
            </button>
            <p className="text-xs text-pink-300/70">
              Tap the button to blow your birthday candle!
            </p>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-300/30 gold-glow-subtle">
              <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-amber-200">
                May all your wishes come true! <Heart className="w-5 h-5 text-rose-400 fill-rose-400 inline-block animate-pulse" />
              </p>
              <p className="text-xs sm:text-sm text-pink-200/90 mt-1">
                Your year ahead is going to be as wonderful and bright as you are.
              </p>
            </div>

            {showWishesGranted && (
              <button
                onClick={handleProceedToMenu}
                className="w-full sm:w-auto min-w-[240px] py-3.5 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-bold text-sm sm:text-base shadow-xl gold-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mx-auto min-h-[48px]"
              >
                <span>Enter Your Surprises</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
