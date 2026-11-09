import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Settings, Sparkles, Upload } from 'lucide-react';
import { romanticAudio } from '../utils/audio.ts';

interface MusicControllerProps {
  onPersonalizeClick?: () => void;
}

export const MusicController: React.FC<MusicControllerProps> = ({ onPersonalizeClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [customTrackName, setCustomTrackName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Keep UI synced
    setIsPlaying(romanticAudio.isPlaying());
  }, []);

  const handleToggle = () => {
    const playing = romanticAudio.toggleMusic();
    setIsPlaying(playing);
    if (playing) {
      romanticAudio.playHeartTap();
    }
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomTrackName(file.name);
      romanticAudio.setCustomAudio(url);
      if (!isPlaying) {
        romanticAudio.startMusic();
        setIsPlaying(true);
      }
      setShowAudioSettings(false);
    }
  };

  const handleResetToSynth = () => {
    romanticAudio.setCustomAudio(null);
    setCustomTrackName(null);
    setShowAudioSettings(false);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Subtle Personalize / Edit button so Hari's girlfriend can customize photos & letters */}
        {onPersonalizeClick && (
          <button
            onClick={onPersonalizeClick}
            title="Personalize & Edit Memories"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#3d0f25]/80 hover:bg-[#521532] text-amber-200 border border-amber-300/30 text-xs font-medium backdrop-blur-md transition-all shadow-md active:scale-95 min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Personalize</span>
          </button>
        )}

        {/* Music Play/Pause Button */}
        <button
          onClick={handleToggle}
          aria-label={isPlaying ? 'Pause romantic music' : 'Play romantic music'}
          className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-md transition-all shadow-lg active:scale-95 min-h-[44px] ${
            isPlaying
              ? 'bg-[#4a102a]/90 border-amber-400/60 text-amber-300 gold-glow-subtle'
              : 'bg-[#260918]/80 border-pink-500/30 text-pink-200 hover:border-pink-400/60'
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-2.5 bg-amber-300 animate-[bounce_0.8s_infinite]" />
                <span className="w-0.5 h-3 bg-amber-200 animate-[bounce_0.6s_infinite_0.2s]" />
                <span className="w-0.5 h-1.5 bg-amber-300 animate-[bounce_0.7s_infinite_0.4s]" />
              </div>
              <span className="text-xs font-medium tracking-wide">
                {customTrackName ? 'Custom Song' : 'Music On'}
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-pink-300 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium tracking-wide text-pink-200">Play Music ♫</span>
            </>
          )}
        </button>

        {/* Audio Option Button */}
        <button
          onClick={() => setShowAudioSettings(!showAudioSettings)}
          title="Audio settings / Upload couple song"
          className="w-10 h-10 rounded-full bg-[#260918]/80 hover:bg-[#3d0f25] border border-pink-500/30 text-pink-300 flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Audio Settings Modal */}
      {showAudioSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl glass-panel p-5 border border-amber-300/30 text-[#fce7f3] shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-serif-luxury font-semibold text-amber-200">
                  Background Music
                </h3>
              </div>
              <button
                onClick={() => setShowAudioSettings(false)}
                className="text-pink-300 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-pink-200/80 mb-4 leading-relaxed">
              Enjoy our built-in dreamy ambient piano chords, or choose a special song just for Hari!
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-black/30 border border-pink-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-amber-200">
                      {customTrackName || 'Romantic Ambient Piano Chords'}
                    </div>
                    <div className="text-[11px] text-pink-300/70">
                      {customTrackName ? 'Custom Audio Track' : 'Built-in warm synth'}
                    </div>
                  </div>
                  <button
                    onClick={handleToggle}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-400/20 text-amber-200 border border-amber-300/40 hover:bg-amber-400/30 transition-all"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                </div>
              </div>

              {/* Upload song */}
              <div>
                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  onChange={handleCustomAudioUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-400/30 text-xs font-medium text-pink-200 flex items-center justify-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4 text-pink-300" />
                  Choose Our Song (MP3 / Audio File)
                </button>
              </div>

              {customTrackName && (
                <button
                  onClick={handleResetToSynth}
                  className="w-full py-1.5 text-xs text-pink-300/70 hover:text-pink-200 transition-colors"
                >
                  Reset to original ambient melody
                </button>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-pink-500/20 flex justify-end">
              <button
                onClick={() => setShowAudioSettings(false)}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-[#2b0b18] text-xs font-semibold hover:bg-amber-300 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
