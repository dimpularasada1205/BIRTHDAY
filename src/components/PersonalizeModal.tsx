import React from 'react';
import { X, Sparkles, RotateCcw, Compass, Heart } from 'lucide-react';
import { ScreenType } from '../types.ts';
import { resetAllToDefaults } from '../utils/storage.ts';
import { romanticAudio } from '../utils/audio.ts';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
  currentScreen: ScreenType;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentScreen,
}) => {
  if (!isOpen) return null;

  const screens: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'pin', label: '1. Secret PIN Screen (1011)', icon: '🔒' },
    { id: 'wishes', label: '2. Birthday Wishes Greeting', icon: '🎂' },
    { id: 'candle', label: '3. Glowing Birthday Candle', icon: '🕯️' },
    { id: 'menu', label: '4. Four Surprises Menu', icon: '🎁' },
    { id: 'memories', label: 'Surprise 1: Our Memories (Polaroids)', icon: '📸' },
    { id: 'reasons', label: 'Surprise 2: Things I Love About You', icon: '💗' },
    { id: 'envelopes', label: 'Surprise 3: Open When... Letters', icon: '💌' },
    { id: 'gift', label: 'Surprise 4: One Last Surprise Box', icon: '🎀' },
    { id: 'letter', label: '5. Final Handwritten Love Letter', icon: '❤️' },
  ];

  const handleResetDefaults = () => {
    if (window.confirm('Reset all memories, reasons, and letters back to initial presets?')) {
      resetAllToDefaults();
      romanticAudio.playChime();
      window.location.reload();
    }
  };

  const handleJump = (screen: ScreenType) => {
    romanticAudio.playHeartTap();
    onNavigate(screen);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md glass-panel rounded-3xl p-6 text-white border border-amber-300/40 shadow-2xl relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-pink-500/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-serif-luxury font-bold text-amber-200">
              Personalize Gift & Screen Navigator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-pink-300 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-pink-200/80 mb-4 leading-relaxed">
          You can jump directly to any screen to preview or edit the memories, captions, love reasons, and letters before presenting this gift to Hari!
        </p>

        {/* Screen Jump List */}
        <div className="space-y-1.5 mb-6">
          <p className="text-[11px] font-mono uppercase tracking-wider text-amber-300/80 font-semibold mb-2 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Jump to Screen</span>
          </p>
          {screens.map((item) => (
            <button
              key={item.id}
              onClick={() => handleJump(item.id)}
              className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-all ${
                currentScreen === item.id
                  ? 'bg-amber-400 text-[#2b0b18] font-bold shadow-md'
                  : 'bg-black/30 hover:bg-white/10 text-pink-100 border border-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {currentScreen === item.id && (
                <span className="text-[10px] uppercase tracking-wider bg-[#2b0b18] text-amber-300 px-1.5 py-0.5 rounded">
                  Current
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <div className="pt-3 border-t border-pink-500/20 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-200 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Content to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-pink-200"
          >
            Done
          </button>
        </div>

        <div className="mt-4 text-center text-[11px] text-pink-300/50 flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
          <span>Crafted with love for Hari ❤️</span>
        </div>
      </div>
    </div>
  );
};
