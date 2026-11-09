import React, { useState } from 'react';
import { ArrowLeft, Mail, MailOpen, Heart, Sparkles, Edit2, Check, X } from 'lucide-react';
import { OpenWhenEnvelope } from '../types.ts';
import { romanticAudio } from '../utils/audio.ts';
import { getStoredEnvelopes, saveStoredEnvelopes } from '../utils/storage.ts';

interface OpenWhenScreenProps {
  onBack: () => void;
}

export const OpenWhenScreen: React.FC<OpenWhenScreenProps> = ({ onBack }) => {
  const [envelopes, setEnvelopes] = useState<OpenWhenEnvelope[]>(() => getStoredEnvelopes());
  const [activeEnvelope, setActiveEnvelope] = useState<OpenWhenEnvelope | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [editingEnvelope, setEditingEnvelope] = useState<OpenWhenEnvelope | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedMessage, setEditedMessage] = useState('');

  const handleOpenEnvelope = (env: OpenWhenEnvelope) => {
    romanticAudio.playPaperRustle();
    setIsOpening(true);
    setActiveEnvelope(env);
    setTimeout(() => {
      romanticAudio.playChime();
      setIsOpening(false);
    }, 450);
  };

  const closeLetter = () => {
    romanticAudio.playPaperRustle();
    setActiveEnvelope(null);
  };

  const startEdit = (env: OpenWhenEnvelope, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEnvelope(env);
    setEditedTitle(env.title);
    setEditedMessage(env.message);
  };

  const saveEdit = () => {
    if (!editingEnvelope) return;
    const updated = envelopes.map((env) =>
      env.id === editingEnvelope.id
        ? { ...env, title: editedTitle, message: editedMessage }
        : env
    );
    setEnvelopes(updated);
    saveStoredEnvelopes(updated);
    if (activeEnvelope?.id === editingEnvelope.id) {
      setActiveEnvelope({ ...activeEnvelope, title: editedTitle, message: editedMessage });
    }
    setEditingEnvelope(null);
    romanticAudio.playChime();
  };

  return (
    <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Top Bar with working Back Button */}
      <div className="flex items-center justify-between mb-8">
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

        <div className="flex items-center gap-1.5 text-xs text-amber-200/80 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>4 Envelope Letters</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mb-2">
          Open When... <span className="text-pink-300">💌</span>
        </h1>
        <p className="text-sm sm:text-base text-pink-200/80 font-handwriting text-xl sm:text-2xl">
          Little handwritten messages for different moments in your life.
        </p>
        <p className="text-xs text-amber-300/70 mt-1">
          Whenever you need words from my heart, pick an envelope ♡
        </p>
      </div>

      {/* Envelopes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pb-16">
        {envelopes.map((env) => (
          <div
            key={env.id}
            onClick={() => handleOpenEnvelope(env)}
            className="group relative cursor-pointer p-6 rounded-3xl glass-panel border border-amber-300/25 hover:border-pink-400/60 transition-all duration-300 hover:-translate-y-1 shadow-2xl active:scale-[0.98] overflow-hidden"
          >
            {/* Ambient envelope glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />

            {/* Envelope Illustration Box */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-14 h-12 bg-gradient-to-br from-[#4a102a] to-[#2b0b18] rounded-xl border border-amber-300/40 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-amber-300 group-hover:hidden" />
                <MailOpen className="w-6 h-6 text-pink-300 hidden group-hover:block animate-bounce" />
                {/* Wax seal simulation */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-600 border border-amber-300/70 shadow-sm flex items-center justify-center text-[10px] text-white">
                  ❤️
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => startEdit(env, e)}
                  title="Edit Message"
                  className="p-1.5 rounded-lg text-pink-300/60 hover:text-amber-300 hover:bg-white/5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-amber-300/80 font-medium">
                  Read letter ✉️
                </span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-white group-hover:text-amber-200 transition-colors">
              {env.title}
            </h3>
            <p className="text-xs text-pink-200/70 mt-1 font-light">
              {env.subtitle}
            </p>

            {/* Teaser line */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-pink-300/80 font-handwriting text-base">
                Sealed with all my love
              </span>
              <span className="text-xs font-semibold text-rose-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                Open Envelope →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Opened Envelope Letter Modal */}
      {activeEnvelope && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={closeLetter}
        >
          <div
            className={`w-full max-w-lg romantic-paper rounded-2xl p-6 sm:p-8 text-stone-900 border-2 border-amber-300/50 shadow-2xl relative transition-all duration-300 ${
              isOpening ? 'scale-90 opacity-70' : 'scale-100 opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLetter}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#3d0f25] text-amber-200 border border-amber-300/40 flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Letter Header */}
            <div className="border-b border-rose-300/50 pb-3 mb-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-rose-700 font-medium mb-1">
                <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                <span>A Little Letter for Hari</span>
                <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-rose-950">
                {activeEnvelope.title}
              </h2>
            </div>

            {/* Letter Body in Romantic Handwriting Font */}
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="font-handwriting text-xl sm:text-2xl text-stone-800 leading-relaxed whitespace-pre-line">
                {activeEnvelope.message}
              </div>
            </div>

            {/* Letter Footer */}
            <div className="mt-6 pt-3 border-t border-rose-300/40 flex items-center justify-between text-xs">
              <button
                onClick={(e) => startEdit(activeEnvelope, e)}
                className="inline-flex items-center gap-1 text-rose-800 font-medium hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit this letter
              </button>

              <button
                onClick={closeLetter}
                className="px-4 py-2 rounded-xl bg-[#3d0f25] text-amber-200 font-semibold text-xs hover:bg-[#521532] transition-colors shadow-md"
              >
                Close & Keep Safe ♡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Envelope Modal */}
      {editingEnvelope && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setEditingEnvelope(null)}
        >
          <div
            className="w-full max-w-md glass-panel rounded-2xl p-6 text-white border border-amber-300/40 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-serif-luxury font-bold text-amber-200 mb-4">
              Personalize Letter
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-pink-300 mb-1">Envelope Title</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs text-pink-300 mb-1">Letter Content</label>
                <textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  rows={8}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300 leading-relaxed font-handwriting text-xl"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditingEnvelope(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-pink-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-400 text-[#2b0b18] hover:bg-amber-300 shadow-md"
              >
                <Check className="w-4 h-4" />
                Save Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
