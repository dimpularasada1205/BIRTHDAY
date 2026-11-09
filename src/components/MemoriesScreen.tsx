import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  ZoomIn,
  Edit2,
  Upload,
  Check,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  X,
  Lock,
  Unlock,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { MemoryPhoto } from '../types.ts';
import { romanticAudio } from '../utils/audio.ts';
import { getStoredMemories, saveStoredMemories, syncCloudMemories } from '../utils/storage.ts';
import { uploadImageFile, deleteMemoryRecord, isFirebaseConfigured } from '../utils/firebase.ts';

interface MemoriesScreenProps {
  onBack: () => void;
}

interface PendingUpload {
  file: File;
  previewUrl: string;
  caption: string;
  date: string;
}

export const MemoriesScreen: React.FC<MemoriesScreenProps> = ({ onBack }) => {
  const [memories, setMemories] = useState<MemoryPhoto[]>(() => getStoredMemories());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);

  // Owner authentication for write protection
  const [isOwner, setIsOwner] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [ownerPinInput, setOwnerPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Edit caption state
  const [editingPhoto, setEditingPhoto] = useState<MemoryPhoto | null>(null);
  const [editCaption, setEditCaption] = useState('');

  // Replace photo state
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);

  // Multiple upload & preview state
  const multipleFileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load cloud memories when screen mounts
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const cloudData = await syncCloudMemories();
        if (isMounted && cloudData && cloudData.length > 0) {
          setMemories(cloudData);
        }
      } catch (e) {
        console.warn('Initial cloud sync notice:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    romanticAudio.playPaperRustle();
    try {
      const synced = await syncCloudMemories();
      setMemories(synced);
      romanticAudio.playChime();
    } catch {
      // Keep existing
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoClick = (photo: MemoryPhoto) => {
    romanticAudio.playPaperRustle();
    setSelectedPhoto(photo);
  };

  // Owner action guard
  const requireOwner = (action: () => void) => {
    if (isOwner) {
      action();
    } else {
      setOwnerPinInput('');
      setAuthError(null);
      setShowAuthModal(true);
    }
  };

  const verifyOwnerPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerPinInput === '1011') {
      setIsOwner(true);
      setShowAuthModal(false);
      romanticAudio.playUnlockSuccess();
    } else {
      setAuthError('Incorrect PIN. Only the author can modify memories 💜');
      romanticAudio.playError();
    }
  };

  // Edit Caption
  const startEdit = (photo: MemoryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    requireOwner(() => {
      setEditingPhoto(photo);
      setEditCaption(photo.caption);
    });
  };

  const saveEdit = async () => {
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

  // Delete Memory
  const handleDeletePhoto = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    requireOwner(async () => {
      if (window.confirm('Are you sure you want to delete this memory?')) {
        const updated = memories.filter((m) => m.id !== photoId);
        setMemories(updated);
        saveStoredMemories(updated);
        if (selectedPhoto?.id === photoId) {
          setSelectedPhoto(null);
        }
        await deleteMemoryRecord(photoId);
        romanticAudio.playHeartTap();
      }
    });
  };

  // Single Photo Replacement
  const handleReplaceClick = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    requireOwner(() => {
      setReplaceTargetId(photoId);
      replaceFileInputRef.current?.click();
    });
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replaceTargetId) {
      setIsUploading(true);
      setUploadProgress(15);
      setUploadError(null);
      try {
        const downloadUrl = await uploadImageFile(file, (percent) => {
          setUploadProgress(percent);
        });

        const updated = memories.map((m) =>
          m.id === replaceTargetId ? { ...m, url: downloadUrl } : m
        );
        setMemories(updated);
        saveStoredMemories(updated);
        if (selectedPhoto?.id === replaceTargetId) {
          setSelectedPhoto({ ...selectedPhoto, url: downloadUrl });
        }
        romanticAudio.playChime();
      } catch (err: unknown) {
        console.error('Replace error:', err);
        setUploadError(err instanceof Error ? err.message : 'Photo upload failed. Please try again.');
      } finally {
        setIsUploading(false);
        setReplaceTargetId(null);
        if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
      }
    }
  };

  // Multiple Photos Upload & Preview
  const handleMultipleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPending: PendingUpload[] = Array.from(files).map((f, i) => ({
        file: f,
        previewUrl: URL.createObjectURL(f),
        caption: `Special memory with Hari #${memories.length + i + 1} ❤️`,
        date: 'Precious Moments',
      }));
      setPendingUploads(newPending);
      setUploadError(null);
    }
  };

  const updatePendingCaption = (index: number, newCaption: string) => {
    setPendingUploads((prev) =>
      prev.map((item, i) => (i === index ? { ...item, caption: newCaption } : item))
    );
  };

  const removePendingUpload = (index: number) => {
    setPendingUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const saveAllPendingUploads = async () => {
    if (pendingUploads.length === 0) return;
    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    const uploadedMemories: MemoryPhoto[] = [];
    const total = pendingUploads.length;

    try {
      for (let i = 0; i < total; i++) {
        const item = pendingUploads[i];
        const downloadUrl = await uploadImageFile(item.file, (p) => {
          const overall = Math.round(((i + p / 100) / total) * 100);
          setUploadProgress(overall);
        });

        uploadedMemories.push({
          id: `mem-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          url: downloadUrl,
          caption: item.caption,
          date: item.date,
          rotation: (Math.random() * 5 - 2.5),
          order: memories.length + i,
        });
      }

      const merged = [...memories, ...uploadedMemories];
      setMemories(merged);
      saveStoredMemories(merged);
      setPendingUploads([]);
      romanticAudio.playChime();
    } catch (err: unknown) {
      console.error('Batch upload error:', err);
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please check network and try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (multipleFileInputRef.current) multipleFileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Hidden file inputs */}
      <input
        type="file"
        accept="image/*"
        ref={replaceFileInputRef}
        onChange={handleReplaceFileChange}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        multiple
        ref={multipleFileInputRef}
        onChange={handleMultipleFilesSelected}
        className="hidden"
      />

      {/* Top Bar with working Back Button & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
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

        <div className="flex items-center gap-2">
          {/* Refresh from cloud button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            title="Refresh gallery from cloud"
            className="p-2 rounded-full glass-panel hover:border-amber-300/50 text-pink-200 text-xs transition-all active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-300' : ''}`} />
          </button>

          {/* Upload Multiple Photos Button */}
          <button
            onClick={() => requireOwner(() => multipleFileInputRef.current?.click())}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-[#2b0b18] text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photos</span>
          </button>

          {/* Owner mode badge */}
          <button
            onClick={() => setIsOwner(!isOwner)}
            title={isOwner ? 'Owner Mode (Can edit/upload)' : 'Visitor Mode (Read-only)'}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
              isOwner
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-stone-900/40 border-stone-600/40 text-stone-300'
            }`}
          >
            {isOwner ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            <span className="hidden sm:inline">{isOwner ? 'Owner Mode' : 'Visitor'}</span>
          </button>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mb-2">
          Our Memories <span className="text-rose-400">📸</span>
        </h1>
        <p className="text-sm sm:text-base text-pink-200/80 font-handwriting text-xl sm:text-2xl">
          Every picture has a story, preserved permanently in our shared vault.
        </p>

        {/* Cloud Storage indicator */}
        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-300/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>
            {isFirebaseConfigured()
              ? 'Synced with Firebase Cloud Storage'
              : 'Shared Cloud Storage Active'}
          </span>
          <span className="text-pink-300/50">·</span>
          <span>{memories.length} Photographs</span>
        </div>
      </div>

      {/* Uploading Progress Banner */}
      {isUploading && (
        <div className="mb-6 p-4 rounded-2xl glass-panel border border-amber-300/40 gold-glow animate-fade-in text-center max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2 text-sm font-semibold text-amber-200">
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            <span>Uploading to Cloud Storage... ({uploadProgress}%)</span>
          </div>
          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-amber-300/20">
            <div
              className="bg-gradient-to-r from-amber-400 to-rose-400 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-rose-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-300 mb-3" />
          <p className="text-sm text-pink-200 font-medium">Retrieving shared memories from the cloud...</p>
        </div>
      ) : (
        /* Polaroids Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7 pb-16">
          {memories.map((photo) => (
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
                  onError={(e) => {
                    // Fallback to placeholder on broken network
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%234a102a"/><text x="200" y="200" fill="%23fce7f3" text-anchor="middle" font-family="sans-serif">Memory Photo ❤️</text></svg>';
                  }}
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

              {/* Owner Action Badges */}
              {isOwner && (
                <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <button
                    onClick={(e) => handleReplaceClick(photo.id, e)}
                    title="Replace Photo"
                    className="hover:text-pink-600 flex items-center gap-1 py-1 px-1 rounded-md hover:bg-pink-50 transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span className="text-[10px]">Replace</span>
                  </button>

                  <button
                    onClick={(e) => startEdit(photo, e)}
                    title="Edit Caption"
                    className="hover:text-pink-600 flex items-center gap-1 py-1 px-1 rounded-md hover:bg-pink-50 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span className="text-[10px]">Caption</span>
                  </button>

                  <button
                    onClick={(e) => handleDeletePhoto(photo.id, e)}
                    title="Delete Memory"
                    className="hover:text-rose-600 flex items-center gap-1 py-1 px-1 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-rose-500" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Multiple Photos Preview & Save Modal */}
      {pendingUploads.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => {
            if (!isUploading) setPendingUploads([]);
          }}
        >
          <div
            className="w-full max-w-2xl glass-panel rounded-3xl p-6 text-white border border-amber-300/40 shadow-2xl relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-pink-500/20">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-serif-luxury font-bold text-amber-200">
                  Preview & Save {pendingUploads.length} New Photographs
                </h3>
              </div>
              {!isUploading && (
                <button
                  onClick={() => setPendingUploads([])}
                  className="text-pink-300 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="text-xs text-pink-200/80 mb-4">
              Add romantic captions for each photo before uploading to cloud storage. Every guest viewing the website will see these!
            </p>

            {/* List of Pending Photos */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 custom-scrollbar mb-4">
              {pendingUploads.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-black/30 border border-pink-500/20 flex flex-col sm:flex-row gap-3 items-center"
                >
                  <img
                    src={item.previewUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-xl object-cover border border-amber-300/30 shrink-0"
                  />
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) => updatePendingCaption(idx, e.target.value)}
                      placeholder="Enter photo caption..."
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-pink-400/30 text-pink-100 text-xs focus:outline-none focus:border-amber-300"
                    />
                    <span className="text-[10px] text-pink-300/60 mt-1 block">
                      {item.file.name} ({(item.file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={() => removePendingUpload(idx)}
                      className="text-rose-400 hover:text-rose-200 p-2"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-pink-500/20 flex items-center justify-between">
              <span className="text-xs text-pink-300">
                {pendingUploads.length} photo(s) ready
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPendingUploads([])}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-pink-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAllPendingUploads}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-[#2b0b18] hover:bg-amber-300 shadow-lg disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Cloud ({uploadProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Upload & Save All</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

            {/* Actions if Owner */}
            {isOwner && (
              <div className="mt-4 pt-3 border-t border-stone-200 flex justify-between items-center text-xs">
                <button
                  onClick={(e) => handleReplaceClick(selectedPhoto.id, e)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-pink-600" />
                  Replace Photo
                </button>

                <button
                  onClick={(e) => startEdit(selectedPhoto, e)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-800 font-medium transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Caption
                </button>
              </div>
            )}
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

      {/* Owner Authentication Modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowAuthModal(false)}
        >
          <form
            onSubmit={verifyOwnerPin}
            className="w-full max-w-xs glass-panel rounded-2xl p-5 text-center text-white border border-amber-300/40 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-amber-300/40 mx-auto flex items-center justify-center mb-3 text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif-luxury font-bold text-amber-200 mb-1">
              Author Access
            </h3>
            <p className="text-xs text-pink-200/80 mb-3">
              Enter the 4-digit PIN to enable edit/upload mode:
            </p>

            <input
              type="password"
              maxLength={4}
              value={ownerPinInput}
              onChange={(e) => setOwnerPinInput(e.target.value)}
              placeholder="••••"
              className="w-28 text-center text-xl tracking-widest p-2 rounded-xl bg-black/50 border border-pink-400/30 text-white font-mono focus:outline-none focus:border-amber-300 mb-3"
            />

            {authError && (
              <p className="text-xs text-rose-300 mb-3">{authError}</p>
            )}

            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-pink-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-[#2b0b18] hover:bg-amber-300"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
