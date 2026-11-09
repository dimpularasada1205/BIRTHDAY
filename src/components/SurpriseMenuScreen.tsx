import React from 'react';
import { Camera, Heart, MailOpen, Gift, Sparkles, ChevronRight } from 'lucide-react';
import { ScreenType } from '../types.ts';
import { romanticAudio } from '../utils/audio.ts';

interface SurpriseMenuScreenProps {
  onSelectScreen: (screen: ScreenType) => void;
}

export const SurpriseMenuScreen: React.FC<SurpriseMenuScreenProps> = ({ onSelectScreen }) => {
  const cards = [
    {
      id: 'memories' as ScreenType,
      title: 'Our Memories',
      description: 'Every picture has a story.',
      icon: Camera,
      tag: 'PHOTO VAULT',
      accentGlow: 'from-amber-400/20 to-rose-400/20',
      iconColor: 'text-amber-300',
      borderGlow: 'hover:border-amber-400/60',
      number: '01',
    },
    {
      id: 'reasons' as ScreenType,
      title: 'Things I Love About You',
      description: 'A few little reasons why you’re special.',
      icon: Heart,
      tag: '5 REASONS',
      accentGlow: 'from-rose-500/20 to-pink-400/20',
      iconColor: 'text-rose-400',
      borderGlow: 'hover:border-rose-400/60',
      number: '02',
    },
    {
      id: 'envelopes' as ScreenType,
      title: 'Open When...',
      description: 'Little messages for different moments.',
      icon: MailOpen,
      tag: 'LETTERS',
      accentGlow: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-pink-300',
      borderGlow: 'hover:border-pink-400/60',
      number: '03',
    },
    {
      id: 'gift' as ScreenType,
      title: 'One Last Surprise',
      description: 'Something special is waiting for you.',
      icon: Gift,
      tag: 'MY HEART',
      accentGlow: 'from-amber-300/20 to-amber-500/20',
      iconColor: 'text-amber-300',
      borderGlow: 'hover:border-amber-300/70',
      number: '04',
      isSpecial: true,
    },
  ];

  const handleCardClick = (target: ScreenType) => {
    romanticAudio.playHeartTap();
    onSelectScreen(target);
  };

  return (
    <div className="relative z-10 min-h-screen py-10 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col justify-center">
      {/* Header section */}
      <div className="text-center mb-8 sm:mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-200 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Curated Just For Hari</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white mb-2 tracking-tight">
          Four Little Surprises for You <span className="text-pink-400 inline-block animate-pulse">💗</span>
        </h1>

        <p className="text-base sm:text-xl text-pink-200/90 font-handwriting text-xl sm:text-2xl max-w-md mx-auto">
          &ldquo;Each one has a little piece of my heart.&rdquo;
        </p>
      </div>

      {/* 2-column, 2-row grid on mobile and desktop as requested */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`group text-left p-4 sm:p-6 rounded-3xl glass-panel border border-amber-300/25 ${card.borderGlow} transition-all duration-300 flex flex-col justify-between min-h-[175px] sm:min-h-[220px] relative overflow-hidden shadow-xl active:scale-[0.98] cursor-pointer`}
            >
              {/* Subtle accent backdrop */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.accentGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              {/* Top row: Number and Icon */}
              <div className="flex items-center justify-between w-full relative z-10">
                <span className="text-[11px] font-mono font-medium text-amber-200/50">
                  {card.number}
                </span>

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-amber-300/50 transition-all shadow-inner">
                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${card.iconColor}`} />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 mt-3">
                <h3 className="text-sm sm:text-lg font-serif-luxury font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-pink-200/80 mt-1 line-clamp-2 font-light leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] sm:text-xs font-medium text-amber-300/80 flex items-center gap-1 group-hover:text-amber-200">
                    Discover
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {card.isSpecial && (
                    <span className="text-[10px] text-amber-300 animate-pulse">✨</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-pink-300/60 mt-8 font-light">
        Tap any surprise to explore it at your own pace ♡
      </p>
    </div>
  );
};
