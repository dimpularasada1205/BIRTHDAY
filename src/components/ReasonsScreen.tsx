import React, { useState } from 'react';
import { ArrowLeft, Heart, Smile, Sparkles, HeartHandshake, Sun, Plus, Edit2, Check } from 'lucide-react';
import { LoveReason } from '../types.ts';
import { romanticAudio } from '../utils/audio.ts';
import { getStoredReasons, saveStoredReasons } from '../utils/storage.ts';

interface ReasonsScreenProps {
  onBack: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Smile,
  Sparkles,
  HeartHandshake,
  Sun,
  Heart,
};

export const ReasonsScreen: React.FC<ReasonsScreenProps> = ({ onBack }) => {
  const [reasons, setReasons] = useState<LoveReason[]>(() => getStoredReasons());
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({
    'reason-1': true, // first one revealed by default
  });
  const [editingReason, setEditingReason] = useState<LoveReason | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleReveal = (id: string) => {
    romanticAudio.playHeartTap();
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const startEdit = (reason: LoveReason, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingReason(reason);
    setNewTitle(reason.title);
    setNewDesc(reason.description);
  };

  const saveEdit = () => {
    if (!editingReason) return;
    const updated = reasons.map((r) =>
      r.id === editingReason.id ? { ...r, title: newTitle, description: newDesc } : r
    );
    setReasons(updated);
    saveStoredReasons(updated);
    setEditingReason(null);
    romanticAudio.playChime();
  };

  const handleAddReason = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    const newReason: LoveReason = {
      id: `reason-${Date.now()}`,
      number: reasons.length + 1,
      title: newTitle,
      description: newDesc,
      iconName: 'Heart',
    };
    const updated = [...reasons, newReason];
    setReasons(updated);
    saveStoredReasons(updated);
    setRevealedIds((prev) => ({ ...prev, [newReason.id]: true }));
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
    romanticAudio.playChime();
  };

  return (
    <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 max-w-3xl mx-auto">
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

        <button
          onClick={() => {
            setNewTitle('');
            setNewDesc('');
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-pink-200 text-xs font-medium transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4 text-rose-300" />
          <span>Add Reason</span>
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mb-2">
          Things I Love About You <span className="text-rose-400 inline-block animate-pulse">💗</span>
        </h1>
        <p className="text-sm sm:text-base text-pink-200/80 font-handwriting text-xl sm:text-2xl">
          A few little reasons why you are the most special person to me.
        </p>
        <p className="text-xs text-amber-300/70 mt-1">
          Tap each card to reveal what my heart says ♡
        </p>
      </div>

      {/* Reasons List */}
      <div className="space-y-4 pb-16">
        {reasons.map((reason, idx) => {
          const isRevealed = !!revealedIds[reason.id];
          const IconComponent = ICON_MAP[reason.iconName] || Heart;

          return (
            <div
              key={reason.id}
              onClick={() => toggleReveal(reason.id)}
              className={`group p-5 sm:p-6 rounded-3xl glass-panel border transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden ${
                isRevealed
                  ? 'border-rose-400/50 bg-[#350f24]/80'
                  : 'border-white/10 hover:border-pink-400/40 bg-[#220716]/60'
              }`}
            >
              {/* Subtle accent glow */}
              <div className="flex items-start gap-4">
                {/* Number Badge with Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105 shadow-inner ${
                    isRevealed
                      ? 'bg-gradient-to-br from-rose-500/30 to-amber-400/20 border-rose-400/50 text-rose-300'
                      : 'bg-black/30 border-white/10 text-pink-300/60'
                  }`}
                >
                  <IconComponent className="w-6 h-6 animate-pulse" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold tracking-wider text-amber-300/80 uppercase">
                      Reason #{idx + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => startEdit(reason, e)}
                        title="Edit Reason"
                        className="text-pink-300/50 hover:text-amber-300 p-1 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs text-pink-300/60 font-medium">
                        {isRevealed ? 'Tap to fold' : 'Tap to open ♡'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-white mt-1 group-hover:text-amber-200 transition-colors">
                    {reason.title}
                  </h3>

                  {/* Message Reveal */}
                  {isRevealed ? (
                    <div className="mt-3 pt-3 border-t border-rose-500/20 animate-fade-in">
                      <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed font-light">
                        {reason.description}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-rose-300 font-handwriting text-lg">
                        <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                        <span>Forever in my heart</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-pink-300/60">
                      <span>Click to unfold this love note...</span>
                      <Sparkles className="w-3 h-3 text-amber-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Reason Modal */}
      {editingReason && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setEditingReason(null)}
        >
          <div
            className="w-full max-w-md glass-panel rounded-2xl p-6 text-white border border-amber-300/40 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-serif-luxury font-bold text-amber-200 mb-4">
              Edit Reason #{editingReason.number}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-pink-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs text-pink-300 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300 leading-relaxed"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditingReason(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-pink-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-400 text-[#2b0b18] hover:bg-amber-300 shadow-md"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Reason Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md glass-panel rounded-2xl p-6 text-white border border-amber-300/40 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-serif-luxury font-bold text-amber-200 mb-4">
              Add a New Love Reason for Hari
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-pink-300 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. The way you look at me..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-xs text-pink-300 mb-1">Love Note</label>
                <textarea
                  placeholder="Tell Hari why this makes him so special..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300 leading-relaxed"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-pink-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReason}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-400 text-[#2b0b18] hover:bg-amber-300 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Reason
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
