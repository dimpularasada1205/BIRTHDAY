import React, { useState } from 'react';
import { Lock, Unlock, Key, Sparkles, Heart } from 'lucide-react';
import { romanticAudio } from '../utils/audio.ts';

interface PinScreenProps {
  onUnlockSuccess: () => void;
}

const CORRECT_PIN = '1011';

export const PinScreen: React.FC<PinScreenProps> = ({ onUnlockSuccess }) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg(null);
      romanticAudio.playHeartTap();

      // If reached 4 digits, automatically try or let user click unlock
      if (nextPin.length === 4) {
        // Small delay to feel intentional
        setTimeout(() => {
          verifyPin(nextPin);
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMsg(null);
      romanticAudio.playPaperRustle();
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg(null);
  };

  const verifyPin = (candidatePin: string) => {
    if (candidatePin === CORRECT_PIN) {
      setIsUnlocking(true);
      setErrorMsg(null);
      romanticAudio.playUnlockSuccess();
      setTimeout(() => {
        onUnlockSuccess();
      }, 900);
    } else {
      setIsShaking(true);
      setErrorMsg("Hmm... that's not the right PIN 💜");
      romanticAudio.playError();
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 650);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length < 4) {
      setErrorMsg('Please enter all 4 digits ♡');
      return;
    }
    verifyPin(pin);
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 w-full max-w-md mx-auto">
      {/* Centered Glass Card */}
      <div
        className={`w-full glass-panel rounded-3xl p-6 sm:p-8 text-center border border-amber-300/30 shadow-2xl transition-all duration-500 ${
          isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
        } ${isUnlocking ? 'scale-105 opacity-90 border-amber-300 gold-glow' : ''}`}
      >
        {/* Animated Lock & Key Illustration */}
        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4a102a] to-[#260918] border border-amber-300/40 flex items-center justify-center gold-glow-subtle shadow-inner">
            {isUnlocking ? (
              <Unlock className="w-8 h-8 text-amber-300 animate-bounce" />
            ) : (
              <Lock className="w-8 h-8 text-amber-300 transition-transform hover:scale-110" />
            )}
          </div>
          {/* Decorative floating key */}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#3d0f25] border border-amber-300/50 flex items-center justify-center shadow-md animate-float">
            <Key className="w-3.5 h-3.5 text-amber-300 rotate-45" />
          </div>
        </div>

        {/* Header Text */}
        <p className="text-xs uppercase tracking-widest text-amber-200/80 font-medium mb-1 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          A LITTLE SECRET...
          <Sparkles className="w-3 h-3 text-amber-300" />
        </p>

        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mb-1.5 tracking-tight">
          A Little Surprise
        </h1>

        <p className="text-sm text-pink-200/90 font-handwriting text-lg sm:text-xl mb-6">
          Enter the PIN to begin ♡
        </p>

        {/* 4-Digit Display Indicator */}
        <div className="flex justify-center items-center gap-3.5 mb-6">
          {[0, 1, 2, 3].map((index) => {
            const hasDigit = pin.length > index;
            return (
              <div
                key={index}
                className={`w-12 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                  hasDigit
                    ? 'bg-amber-400/20 border-2 border-amber-300 text-amber-200 scale-105 gold-glow-subtle'
                    : 'bg-black/30 border border-pink-400/30 text-transparent'
                }`}
              >
                {hasDigit ? (
                  <span className="animate-fade-in text-xl">❤️</span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-pink-400/40" />
                )}
              </div>
            );
          })}
        </div>

        {/* Error / Hint Message */}
        {errorMsg ? (
          <p className="text-xs sm:text-sm text-rose-300 font-medium mb-4 animate-fade-in bg-rose-950/40 py-1.5 px-3 rounded-full inline-block border border-rose-500/30">
            {errorMsg}
          </p>
        ) : (
          <p className="text-[11px] text-pink-300/60 mb-4">
            Hint: A special 4-digit date or anniversary ♡
          </p>
        )}

        {/* Unlock Button */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={pin.length < 4 || isUnlocking}
          className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-6 shadow-lg min-h-[48px] ${
            pin.length === 4 && !isUnlocking
              ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-[#2b0b18] gold-glow hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-pink-950/40 text-pink-300/50 border border-pink-500/20 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4 text-current" />
          <span>{isUnlocking ? 'Opening Your Surprise...' : 'Unlock ✨'}</span>
        </button>

        {/* Mobile-Friendly Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-xl bg-white/5 hover:bg-white/15 active:bg-amber-400/20 active:border-amber-300/60 border border-white/10 text-white font-medium text-lg transition-all flex items-center justify-center min-h-[44px]"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-pink-300/80 text-xs font-medium transition-all flex items-center justify-center min-h-[44px]"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-white/5 hover:bg-white/15 active:bg-amber-400/20 border border-white/10 text-white font-medium text-lg transition-all flex items-center justify-center min-h-[44px]"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete last digit"
            className="h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-pink-300 text-sm font-medium transition-all flex items-center justify-center min-h-[44px]"
          >
            ⌫
          </button>
        </div>

        <div className="mt-5 text-[11px] text-pink-300/50 flex items-center justify-center gap-1.5">
          <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
          <span>Handcrafted with love for Hari</span>
        </div>
      </div>
    </div>
  );
};
