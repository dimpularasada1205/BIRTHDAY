import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Gift, Sparkles, Mail, Heart, ArrowRight } from 'lucide-react';
import { romanticAudio } from '../utils/audio.ts';

interface GiftBoxScreenProps {
  onBack: () => void;
  onProceedToLetter: () => void;
}

export const GiftBoxScreen: React.FC<GiftBoxScreenProps> = ({ onBack, onProceedToLetter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenGift = () => {
    if (isOpen || isOpening) return;

    setIsOpening(true);
    romanticAudio.playPaperRustle();

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      romanticAudio.playConfettiPop();

      // Confetti burst
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#f43f5e', '#ffd700'],
      });
    }, 700);
  };

  const handleOpenLetter = () => {
    romanticAudio.playChime();
    onProceedToLetter();
  };

  return (
    <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 max-w-lg mx-auto flex flex-col justify-center">
      {/* Top Bar with working Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            romanticAudio.playPaperRustle();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:border-amber-300/50 text-pink-200 text-sm font-medium transition-all active:scale-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          <span>Back to Surprises</span>
        </button>

        <span className="text-xs text-amber-300/80 font-medium">Final Surprise 🎁</span>
      </div>

      {/* Main Glass Container */}
      <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 text-center border border-amber-300/35 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div
          className={`absolute inset-0 bg-radial from-amber-400/20 via-rose-500/10 to-transparent blur-2xl transition-all duration-700 pointer-events-none ${
            isOpen ? 'scale-125 opacity-100' : 'scale-100 opacity-60'
          }`}
        />

        {/* Header */}
        <p className="text-xs uppercase tracking-widest text-amber-200/80 font-medium mb-1.5 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          SOMETHING SPECIAL IS WAITING
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </p>

        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mb-2">
          One Last Surprise
        </h1>

        <p className="text-sm sm:text-base text-pink-200/90 font-handwriting text-xl sm:text-2xl mb-8">
          {!isOpen
            ? 'Are you ready for your last surprise, Hari? ✨'
            : 'Look what was wrapped inside for you... ❤️'}
        </p>

        {/* 3D-Styled Animated Luxury Gift Box */}
        <div className="relative my-6 h-56 flex flex-col items-center justify-center select-none">
          {!isOpen ? (
            <div
              onClick={handleOpenGift}
              className={`relative cursor-pointer group transition-transform duration-500 ${
                isOpening ? 'scale-110 rotate-2' : 'hover:scale-105'
              }`}
            >
              {/* Floating golden ribbon bow */}
              <div className="relative z-20 flex justify-center -mb-2">
                <div className="w-12 h-8 rounded-full border-4 border-amber-300 bg-amber-400/80 -mr-2 rotate-[-20deg] shadow-lg animate-pulse" />
                <div className="w-5 h-5 rounded-full bg-amber-300 border-2 border-amber-400 shadow-md z-30 -mt-1" />
                <div className="w-12 h-8 rounded-full border-4 border-amber-300 bg-amber-400/80 -ml-2 rotate-[20deg] shadow-lg animate-pulse" />
              </div>

              {/* Gift Box Lid */}
              <div
                className={`relative z-10 w-44 sm:w-52 h-10 bg-gradient-to-r from-[#831843] via-[#be185d] to-[#831843] rounded-t-xl border-2 border-amber-300/60 shadow-xl transition-all duration-500 ${
                  isOpening ? '-translate-y-8 rotate-[-8deg] opacity-80' : ''
                }`}
              >
                {/* Vertical Ribbon */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-7 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 shadow-md" />
              </div>

              {/* Gift Box Base */}
              <div className="relative w-40 sm:w-48 h-32 bg-gradient-to-r from-[#4a044e] via-[#701a75] to-[#4a044e] rounded-b-2xl border-2 border-t-0 border-amber-300/60 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Vertical Ribbon */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-7 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 shadow-md" />
                {/* Horizontal Ribbon */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-7 bg-gradient-to-b from-amber-300 via-amber-200 to-amber-400 shadow-md" />

                {/* Soft glow inside */}
                <div className="absolute inset-0 bg-amber-400/10" />

                <span className="relative z-10 text-xs font-serif-luxury font-bold text-amber-950 bg-amber-300/90 px-2 py-0.5 rounded shadow-xs">
                  FOR HARI
                </span>
              </div>

              {/* Sparkle badge */}
              <div className="absolute -top-3 -right-2 text-xl animate-bounce">
                ✨
              </div>
            </div>
          ) : (
            /* Open state: Box opened with glowing golden letter envelope emerging */
            <div className="relative animate-fade-in flex flex-col items-center">
              {/* Revealed Glowing Envelope */}
              <div
                onClick={handleOpenLetter}
                className="relative cursor-pointer p-4 rounded-2xl bg-gradient-to-br from-[#fffaf5] to-[#fce7f3] border-2 border-amber-300 text-stone-900 shadow-2xl hover:scale-105 transition-all duration-300 gold-glow flex items-center gap-3.5 max-w-[280px]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4a102a] text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-mono font-semibold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-rose-600" />
                    <span>Special Delivery</span>
                  </div>
                  <div className="text-sm font-serif-luxury font-bold text-stone-900 leading-tight">
                    Final Handwritten Love Letter
                  </div>
                  <div className="text-[10px] text-stone-600 font-handwriting text-sm">
                    Written with all my heart ♡
                  </div>
                </div>
              </div>

              {/* Open Box Base at the bottom */}
              <div className="relative -mt-3 w-44 h-16 bg-gradient-to-r from-[#4a044e] to-[#701a75] rounded-b-xl border border-amber-300/40 opacity-70 blur-[0.5px] pointer-events-none -z-10" />
            </div>
          )}
        </div>

        {/* Action Button */}
        {!isOpen ? (
          <div className="pt-2">
            <button
              onClick={handleOpenGift}
              disabled={isOpening}
              className="w-full sm:w-auto min-w-[240px] py-4 px-8 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-[#2b0b18] font-bold text-base shadow-xl gold-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 mx-auto min-h-[48px]"
            >
              <Gift className="w-5 h-5 text-[#2b0b18]" />
              <span>{isOpening ? 'Untying Ribbon...' : 'Open Your Gift 🎁'}</span>
            </button>
            <p className="text-xs text-pink-300/70 mt-3 font-light">
              Tap the button or the gift box to open!
            </p>
          </div>
        ) : (
          <div className="pt-2 animate-fade-in space-y-3">
            <button
              onClick={handleOpenLetter}
              className="w-full sm:w-auto min-w-[240px] py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-bold text-base shadow-xl gold-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mx-auto min-h-[48px]"
            >
              <span>Read My Final Letter</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-amber-200/80">
              The words I have been keeping for your birthday... ❤️
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
