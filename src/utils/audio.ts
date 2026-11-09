/**
 * Web Audio API synthesizer for romantic ambient background music
 * and soft sound effects (candle blow, confetti pop, chime, letter rustle, heart tap).
 * Completely self-contained, no external MP3 dependencies required.
 */

class RomanticAudioManager {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private chordIndex = 0;
  private customAudio: HTMLAudioElement | null = null;
  private customAudioUrl: string | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Romantic chord progression in F Major / D minor:
  // Fmaj7 -> Dm7 -> Bbmaj7 -> C7add9 -> Am7 -> Gm7 -> Csus4 -> C
  private romanticChords = [
    [174.61, 220.00, 261.63, 329.63, 349.23], // Fmaj7
    [146.83, 220.00, 261.63, 329.63, 440.00], // Dm9
    [116.54, 174.61, 233.08, 293.66, 349.23], // Bbmaj7
    [130.81, 196.00, 261.63, 293.66, 392.00], // C9
    [110.00, 164.81, 220.00, 261.63, 329.63], // Am7
    [98.00, 146.83, 196.00, 261.63, 349.23],  // Gm7
    [130.81, 174.61, 196.00, 261.63, 392.00], // Csus4
    [130.81, 164.81, 196.00, 246.94, 329.63], // C7
  ];

  public setCustomAudio(url: string | null) {
    this.customAudioUrl = url;
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    if (this.isMusicPlaying && url) {
      this.startCustomAudio();
    }
  }

  private startCustomAudio() {
    if (!this.customAudioUrl) return;
    this.customAudio = new Audio(this.customAudioUrl);
    this.customAudio.loop = true;
    this.customAudio.volume = 0.5;
    this.customAudio.play().catch(() => {
      // Fallback to synth if custom audio fails
      this.startSynthMusic();
    });
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public startMusic() {
    this.initContext();
    this.isMusicPlaying = true;

    if (this.customAudioUrl) {
      this.startCustomAudio();
    } else {
      this.startSynthMusic();
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  public isPlaying(): boolean {
    return this.isMusicPlaying;
  }

  private playTone(freq: number, duration: number, delay = 0, type: OscillatorType = 'sine', gainVal = 0.08) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

    // Warm envelope
    const startTime = this.ctx.currentTime + delay;
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(gainVal * 0.4, startTime + duration * 0.6);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  private startSynthMusic() {
    if (this.musicInterval !== null) {
      window.clearInterval(this.musicInterval);
    }

    const step = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const chord = this.romanticChords[this.chordIndex % this.romanticChords.length];
      this.chordIndex++;

      // Arpeggiate notes in chord gently like a music box / soft rhodes
      chord.forEach((freq, idx) => {
        const arpeggioDelay = idx * 0.38;
        this.playTone(freq, 2.6, arpeggioDelay, 'sine', 0.07);
        // Soft sparkle octave
        if (idx === 0 || idx === 3) {
          this.playTone(freq * 2, 1.8, arpeggioDelay + 0.04, 'triangle', 0.025);
        }
      });
    };

    // First chord immediately
    step();
    // Subsequent chords every 2.4s
    this.musicInterval = window.setInterval(step, 2400);
  }

  // Sound Effects
  public playUnlockSuccess() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.09);

      const st = this.ctx!.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0.001, st);
      gain.gain.exponentialRampToValueAtTime(0.18, st + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(st);
      osc.stop(st + 0.55);
    });
  }

  public playError() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  public playCandleBlow() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    // White noise breath / blow sound
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.7);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.75);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.8);
  }

  public playConfettiPop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    // Cheerful pop & sparkle
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);

    // Followed by twinkling chime
    setTimeout(() => {
      this.playChime();
    }, 180);
  }

  public playChime() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const bellNotes = [880, 1046.5, 1318.51, 1567.98];
    bellNotes.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime + idx * 0.08);

      const st = this.ctx!.currentTime + idx * 0.08;
      gain.gain.setValueAtTime(0.001, st);
      gain.gain.exponentialRampToValueAtTime(0.12, st + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(st);
      osc.stop(st + 0.85);
    });
  }

  public playPaperRustle() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    // Gentle soft whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(480, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  public playHeartTap() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, this.ctx.currentTime); // G5
    osc.frequency.exponentialRampToValueAtTime(1175, this.ctx.currentTime + 0.08); // D6

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.31);
  }
}

export const romanticAudio = new RomanticAudioManager();
