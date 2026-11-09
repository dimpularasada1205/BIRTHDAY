import React, { useState, useRef } from 'react';
import { ArrowLeft, Heart, Sparkles, ZoomIn, Edit2, Upload, Check } from 'lucide-react';
import { MemoryPhoto } from '../types.ts';
import { romanticAudio } from '../utils/audio.ts';
import { getStoredMemories, saveStoredMemories } from '../utils/storage.ts';

interface MemoriesScreenProps {
  onBack: () => void;
}

export const MemoriesScreen: React.FC<MemoriesScreenProps> = ({ onBack }) => {
  const [memories, setMemories] = useState<MemoryPhoto[]>(() => getStoredMemories());
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<MemoryPhoto | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const handlePhotoClick = (photo: MemoryPhoto) => {
    romanticAudio.playPaperRustle();
    setSelectedPhoto(photo);
  };

  const startEdit = (photo: MemoryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPhoto(photo);
    setEditCaption(photo.caption);
  };

  const saveEdit = () => {
    if (!editingPhoto) return;
    const updated = memories.map((m) =>
      m.id === editingPhoto.id ? { ...m, caption: editCaption } : m
    );
    setMemories(updated);
    saveStoredMemories(updated);
    if (selectedPhoto?.id === editingPhoto.id) {
      setSelectedPhoto({ ...selectedPhoto, caption: editCaption });
    }
    setEditingPhoto(null);
    romanticAudio.playHeartTap();
  };

  const handleUploadClick = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveUploadId(photoId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const updated = memories.map((m) =>
            m.id === activeUploadId ? { ...m, url: dataUrl } : m
          );
          setMemories(updated);
          saveStoredMemories(updated);
          if (selectedPhoto?.id === activeUploadId) {
            setSelectedPhoto({ ...selectedPhoto, url: dataUrl });
          }
          romanticAudio.playChime();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Hidden file input for photo replacement */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

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

        <div className="flex items-center gap-2 text-xs text-amber-200/80 font-medium">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{memories.length} Precious Memories</span>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mb-2">
          Our Memories <span className="text-rose-400">📸</span>
        </h1>
        <p className="text-sm sm:text-base text-pink-200/80 font-handwriting text-xl sm:text-2xl">
          Every picture has a story, and every moment with you is unforgettable.
        </p>
        <p className="text-xs text-amber-300/70 mt-1">
          Tap any polaroid to enlarge. You can also replace any photo or edit the caption!
        </p>
      </div>

      {/* Polaroids Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7 pb-16">
        {memories.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => handlePhotoClick(photo)}
            style={{ transform: `rotate(${photo.rotation || 0}deg)` }}
            className="group bg-[#fffbf5] rounded-xl p-3.5 pb-5 shadow-2xl hover:shadow-[0_20px_40px_rgba(244,114,182,0.3)] transition-all duration-300 hover:scale-105 hover:z-20 cursor-pointer border border-[#f3e8d8] relative flex flex-col justify-between"
          >
            {/* Cute Washi Tape effect at the top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-pink-200/75 backdrop-blur-xs rounded-xs shadow-xs border-t border-b border-pink-300/60 rotate-1 flex items-center justify-center">
              <span className="text-[9px] text-pink-700/80 font-mono">♡ hari ♡</span>
            </div>

            {/* Photo frame */}
            <div className="relative aspect-square w-full rounded-md overflow-hidden bg-stone-900 border border-stone-200/50 mb-3 shadow-inner">
              <img
                src={photo.url}
                alt={photo.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="p-2 rounded-full bg-white/80 text-stone-800 shadow-md">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Polaroid bottom caption */}
            <div className="px-1 text-center">
              <p className="font-handwriting text-lg text-stone-800 font-semibold leading-tight line-clamp-2">
                {photo.caption}
              </p>
              {photo.date && (
                <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider font-sans font-medium">
                  {photo.date}
                </p>
              )}
            </div>

            {/* Quick Action Badges */}
            <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
              <button
                onClick={(e) => handleUploadClick(photo.id, e)}
                title="Change Photo"
                className="hover:text-pink-600 flex items-center gap-1 py-1 px-1.5 rounded-md hover:bg-pink-50 transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span className="text-[10px]">Photo</span>
              </button>

              <button
                onClick={(e) => startEdit(photo, e)}
                title="Edit Caption"
                className="hover:text-pink-600 flex items-center gap-1 py-1 px-1.5 rounded-md hover:bg-pink-50 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                <span className="text-[10px]">Caption</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Enlarged View Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="w-full max-w-lg bg-[#fffbf5] rounded-2xl p-4 sm:p-6 shadow-2xl relative text-stone-900 border-2 border-amber-300/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#3d0f25] text-amber-200 border border-amber-300/50 flex items-center justify-center font-bold shadow-lg hover:scale-110 transition-transform"
            >
              ✕
            </button>

            {/* Enlarged image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black mb-4 shadow-md border border-stone-200">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Caption & Date */}
            <div className="text-center px-2">
              <p className="font-handwriting text-2xl sm:text-3xl text-stone-900 font-bold mb-1">
                {selectedPhoto.caption}
              </p>
              {selectedPhoto.date && (
                <p className="text-xs text-rose-600 font-sans font-semibold tracking-wide flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  {selectedPhoto.date}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex justify-between items-center text-xs">
              <button
                onClick={(e) => handleUploadClick(selectedPhoto.id, e)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-pink-600" />
                Upload Real Photo
              </button>

              <button
                onClick={(e) => startEdit(selectedPhoto, e)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-800 font-medium transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Caption
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Caption Modal */}
      {editingPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setEditingPhoto(null)}
        >
          <div
            className="w-full max-w-sm glass-panel rounded-2xl p-5 text-white border border-amber-300/40 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-serif-luxury font-bold text-amber-200 mb-2">
              Edit Polaroid Caption
            </h3>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-pink-100 text-sm focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 font-handwriting text-xl"
              placeholder="Write your sweet memory caption..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingPhoto(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-pink-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-[#2b0b18] hover:bg-amber-300 transition-colors shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                Save Caption
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
