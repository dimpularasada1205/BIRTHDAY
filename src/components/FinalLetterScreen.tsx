import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Heart, Sparkles, Edit2, Check, Mail, X } from 'lucide-react';
import { LoveLetterContent } from '../types.ts';
import { romanticAudio } from '../utils/audio.ts';
import { getStoredLetter, saveStoredLetter } from '../utils/storage.ts';

interface FinalLetterScreenProps {
  onBackToMenu: () => void;
  onReplayFromStart: () => void;
}

export const FinalLetterScreen: React.FC<FinalLetterScreenProps> = ({
  onBackToMenu,
  onReplayFromStart,
}) => {
  const [letter, setLetter] = useState<LoveLetterContent>(() => getStoredLetter());
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editGreeting, setEditGreeting] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editSignoff, setEditSignoff] = useState('');
  const [editSender, setEditSender] = useState('');
  const [displayedParagraphs, setDisplayedParagraphs] = useState<number>(0);

  const handleOpenLetter = () => {
    setIsAnimating(true);
    romanticAudio.playPaperRustle();

    setTimeout(() => {
      setIsOpen(true);
      setIsAnimating(false);
      romanticAudio.playChime();

      // Launch gentle celebratory confetti
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f472b6', '#fb7185', '#fde047', '#f43f5e'],
      });
    }, 600);
  };

  // Progressive reveal of paragraphs for smooth typing / reading feeling
  useEffect(() => {
    if (isOpen) {
      setDisplayedParagraphs(0);
      const interval = setInterval(() => {
        setDisplayedParagraphs((prev) => {
          if (prev < letter.paragraphs.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isOpen, letter]);

  const startEditing = () => {
    setEditGreeting(letter.greeting);
    setEditBody(letter.paragraphs.join('\n\n'));
    setEditSignoff(letter.signoff);
    setEditSender(letter.sender);
    setIsEditing(true);
  };

  const saveEditedLetter = () => {
    const splitParagraphs = editBody
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const updated: LoveLetterContent = {
      recipient: letter.recipient,
      greeting: editGreeting.trim() || 'My Dearest Hari,',
      paragraphs: splitParagraphs.length > 0 ? splitParagraphs : letter.paragraphs,
      signoff: editSignoff.trim() || 'With all my love,',
      sender: editSender.trim() || 'Yours always. 💗',
    };

    setLetter(updated);
    saveStoredLetter(updated);
    setIsEditing(false);
    romanticAudio.playChime();
  };

  return (
    <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 max-w-3xl mx-auto flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            romanticAudio.playPaperRustle();
            onBackToMenu();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:border-amber-300/50 text-pink-200 text-sm font-medium transition-all active:scale-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          <span>Surprise Menu</span>
        </button>

        <button
          onClick={startEditing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-950/60 hover:bg-pink-900 border border-pink-400/30 text-pink-200 text-xs font-medium transition-all"
        >
          <Edit2 className="w-3.5 h-3.5 text-amber-300" />
          <span>Edit Letter</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="my-auto py-4">
        {!isOpen ? (
          /* Initial Screen: Closed Romantic Envelope */
          <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-amber-300/40 shadow-2xl max-w-lg mx-auto animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 via-amber-400/10 to-transparent pointer-events-none" />

            {/* Glowing Envelope with animated seals */}
            <div className="relative w-28 h-20 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-pink-500/25 blur-xl rounded-full animate-pulse" />
              <div
                className={`relative w-28 h-20 rounded-2xl bg-gradient-to-br from-[#521332] via-[#701a45] to-[#3a0c22] border-2 border-amber-300/60 shadow-2xl flex items-center justify-center gold-glow transition-transform duration-500 ${
                  isAnimating ? 'scale-110 -rotate-3' : 'hover:scale-105'
                }`}
              >
                <Mail className="w-10 h-10 text-amber-300" />
                {/* Heart Wax Seal */}
                <div className="absolute -bottom-2 w-8 h-8 rounded-full bg-rose-600 border-2 border-amber-300 shadow-md flex items-center justify-center text-white text-xs">
                  ❤️
                </div>
              </div>
            </div>

            <p className="text-xs uppercase tracking-widest text-amber-200/80 font-medium mb-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SEALED WITH ENDLESS LOVE
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </p>

            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mb-2">
              One last thing for you, Hari... <span className="text-rose-400">💌</span>
            </h1>

            <p className="text-base sm:text-lg text-pink-200/90 font-handwriting text-xl sm:text-2xl mb-8">
              A handwritten letter from my heart to yours.
            </p>

            <button
              onClick={handleOpenLetter}
              disabled={isAnimating}
              className="w-full sm:w-auto min-w-[240px] py-4 px-8 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-[#2b0b18] font-bold text-base shadow-xl gold-glow hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 mx-auto min-h-[48px]"
            >
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600 animate-pulse" />
              <span>{isAnimating ? 'Opening Letter...' : 'Open My Letter ❤️'}</span>
            </button>
          </div>
        ) : (
          /* Opened Letter on Textured Romantic Paper */
          <div className="romantic-paper rounded-3xl p-6 sm:p-10 text-stone-900 border-2 border-amber-300/60 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative animate-fade-in gold-glow-subtle">
            {/* Top romantic vintage header */}
            <div className="text-center pb-4 mb-6 border-b border-rose-300/40 relative">
              <div className="flex items-center justify-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>♡</span>
                <span>A Birthday Letter For Hari</span>
                <span>♡</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#4a102a]">
                {letter.greeting}
              </h2>

              {/* Heart doodles decoration */}
              <div className="absolute top-0 right-0 text-rose-400/80 text-xl font-handwriting select-none">
                ♡ ♡
              </div>
              <div className="absolute top-0 left-0 text-amber-600/80 text-xl font-handwriting select-none">
                ✨
              </div>
            </div>

            {/* Letter Content */}
            <div className="space-y-4 font-handwriting text-2xl sm:text-3xl text-stone-800 leading-relaxed font-normal">
              {letter.paragraphs.map((para, idx) => {
                const isVisible = idx <= displayedParagraphs;
                return (
                  <p
                    key={idx}
                    className={`transition-all duration-500 ${
                      isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-3 pointer-events-none'
                    }`}
                  >
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Signoff */}
            <div className="mt-8 pt-6 border-t border-rose-300/40 flex flex-col items-end">
              <p className="font-handwriting text-2xl text-stone-700 italic">
                {letter.signoff}
              </p>
              <p className="font-romantic text-3xl sm:text-4xl font-bold text-rose-700 mt-1">
                {letter.sender}
              </p>
            </div>

            {/* Floating Heart Doodle Stamp */}
            <div className="mt-6 flex items-center justify-center gap-2 text-rose-400 select-none">
              <Heart className="w-4 h-4 fill-rose-400" />
              <span className="text-xs font-sans tracking-widest uppercase font-semibold text-rose-600">
                Forever & Always
              </span>
              <Heart className="w-4 h-4 fill-rose-400" />
            </div>

            {/* Closing message as requested by user */}
            <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#4a102a] via-[#5c1635] to-[#4a102a] text-center text-white border border-amber-300/50 shadow-xl">
              <p className="text-sm sm:text-base font-serif-luxury font-bold text-amber-200 tracking-wide">
                THE END? ... NO, JUST ANOTHER BEAUTIFUL MEMORY. ❤️
              </p>
              <p className="text-xs text-pink-200/80 mt-1 font-light">
                Here is to celebrating every birthday together, year after year.
              </p>
            </div>

            {/* Replay Button & Surprises Navigation */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onReplayFromStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#3d0f25] text-amber-200 hover:bg-[#521532] text-sm font-semibold transition-all shadow-md active:scale-95 min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4 text-amber-300" />
                <span>Replay Experience ↺</span>
              </button>

              <button
                onClick={onBackToMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 text-sm font-semibold transition-all shadow-md active:scale-95 min-h-[44px]"
              >
                <span>Back to All Surprises 💗</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Letter Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="w-full max-w-lg glass-panel rounded-2xl p-6 text-white border border-amber-300/40 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-500/20">
              <h3 className="text-lg font-serif-luxury font-bold text-amber-200">
                Personalize Final Love Letter
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-pink-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-pink-300 mb-1 font-medium">Greeting</label>
                <input
                  type="text"
                  value={editGreeting}
                  onChange={(e) => setEditGreeting(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-pink-300 mb-1 font-medium">
                  Letter Body (separate paragraphs with blank lines)
                </label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={10}
                  className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300 leading-relaxed font-handwriting text-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-pink-300 mb-1 font-medium">Signoff</label>
                  <input
                    type="text"
                    value={editSignoff}
                    onChange={(e) => setEditSignoff(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-pink-300 mb-1 font-medium">Sender Name / Signature</label>
                  <input
                    type="text"
                    value={editSender}
                    onChange={(e) => setEditSender(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-pink-500/20">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-pink-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedLetter}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-amber-400 text-[#2b0b18] hover:bg-amber-300 shadow-md"
              >
                <Check className="w-4 h-4" />
                Save & Update Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
