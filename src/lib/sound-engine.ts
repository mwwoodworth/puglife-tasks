import { Howl } from 'howler';
import { SoundEffect } from './types';

/**
 * Bleeding Edge Audio Service
 * Layer 1: High-Fidelity Studio Audio via Howler.js (MP3/OGG Sprites)
 * Layer 2: Graceful Fallback to Ultra-Polished Web Audio API Synthesis
 */
class PugSoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private userVolume = 1;
  private hfAudio: Howl | null = null;
  private hfLoaded = false;

  // Synthesis Fallback State
  private noiseBuffer: AudioBuffer | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private reverbBuffer: AudioBuffer | null = null;

  constructor() {
    // Attempt to load the High-Fidelity Audio Sprite
    // In production, you would drop 'sprite.mp3' and 'sprite.ogg' into /public/sounds/
    this.hfAudio = new Howl({
      src: ['/sounds/sprite.mp3', '/sounds/sprite.ogg'],
      sprite: {
        'task-complete': [0, 1500],
        'pug-bark': [1600, 800],
        'pug-whimper': [2500, 1200],
        'ui-click': [3800, 200],
        // ... mapped sprites
      },
      volume: 1.0,
      onload: () => {
        this.hfLoaded = true;
        console.log("High-Fidelity Audio Engine Online");
      },
      onloaderror: () => {
        this.hfLoaded = false;
        console.warn("Studio audio not found. Falling back to procedural synthesis.");
      }
    });
  }

  // ── Web Audio Setup (Fallback) ──
  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  private circadianMultiplier(): number {
    const h = new Date().getHours();
    if (h >= 22 || h < 6) return 0.6;
    if (h >= 20) return 0.8;
    return 1;
  }

  private effectiveVolume(): number {
    return this.userVolume * this.circadianMultiplier();
  }

  setVolume(v: number) {
    this.userVolume = Math.max(0, Math.min(1, v));
    
    // Update Howler volume
    if (this.hfAudio) {
      this.hfAudio.volume(this.effectiveVolume());
    }

    // Update Synthesis volume
    if (this.masterGain) {
      const ctx = this.getCtx();
      this.masterGain.gain.setTargetAtTime(this.effectiveVolume(), ctx.currentTime, 0.05);
    }
  }

  setMuted(m: boolean) { 
    this.muted = m; 
    Howler.mute(m);
  }
  
  isMuted() { return this.muted; }

  // ── Core Audio Master ──
  private getMaster(): AudioNode {
    const ctx = this.getCtx();
    if (!this.compressor) {
      this.compressor = ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-24, ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, ctx.currentTime);
      
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.effectiveVolume(), ctx.currentTime);
      
      this.duckGain = ctx.createGain();
      this.duckGain.gain.setValueAtTime(1, ctx.currentTime);
      
      this.compressor.connect(this.duckGain).connect(this.masterGain).connect(ctx.destination);
    }
    return this.compressor;
  }

  private duck() {
    if (!this.duckGain) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    this.duckGain.gain.setTargetAtTime(0.2, t, 0.02);
    this.duckGain.gain.setTargetAtTime(1, t + 0.35, 0.15);
  }

  // ── Procedural Reverb & Noise ──
  private getNoiseBuffer(): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const ctx = this.getCtx();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.11; 
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number, attack=0.01, release=0.1) {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack);
      gain.gain.setTargetAtTime(0, ctx.currentTime + duration - release, release / 3);
      
      osc.connect(gain).connect(this.getMaster());
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  private playFmPling(freq: number, modFreqRatio: number, modIdx: number, duration: number, vol: number) {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      
      const carrier = ctx.createOscillator();
      carrier.type = "sine";
      carrier.frequency.setValueAtTime(freq, t);
      
      const modulator = ctx.createOscillator();
      modulator.type = "sine";
      modulator.frequency.setValueAtTime(freq * modFreqRatio, t);
      
      const modGain = ctx.createGain();
      modGain.gain.setValueAtTime(freq * modIdx, t);
      modGain.gain.exponentialRampToValueAtTime(1, t + duration * 0.8);
      
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(vol, t + 0.01);
      env.gain.exponentialRampToValueAtTime(0.001, t + duration);
      
      modulator.connect(modGain).connect(carrier.frequency);
      carrier.connect(env).connect(this.getMaster());
      
      modulator.start(t); carrier.start(t);
      modulator.stop(t + duration); carrier.stop(t + duration);
    } catch {}
  }

  // ── Procedural Fallbacks for Pug Sounds ──
  private playFallbackBark() {
    this.duck();
    this.playFmPling(180, 0.5, 4, 0.15, 0.12);
    setTimeout(() => this.playFmPling(180, 0.5, 4, 0.15, 0.12), 120);
  }

  private playFallbackWhimper() {
    this.duck();
    this.playTone(500, "sine", 0.6, 0.08, 0.1, 0.4);
  }

  // ── Main Play Dispatcher ──
  play(effect: SoundEffect) {
    if (this.muted) return;

    // 1. Attempt High-Fidelity Studio Sound
    if (this.hfLoaded && this.hfAudio) {
      if (effect === 'pug-bark' || effect === 'pug-woof') { this.hfAudio.play('pug-bark'); return; }
      if (effect === 'pug-whimper') { this.hfAudio.play('pug-whimper'); return; }
      if (effect === 'task-complete') { this.hfAudio.play('task-complete'); return; }
      if (effect === 'button-hover' || effect === 'item-equip') { this.hfAudio.play('ui-click'); return; }
    }

    // 2. Procedural Synthesis Fallback Map
    const map: Record<SoundEffect, () => void> = {
      "task-complete": () => {
        this.playFmPling(523.25, 2, 1.5, 0.8, 0.06);
        setTimeout(() => this.playFmPling(659.25, 2, 1.5, 0.8, 0.06), 60);
        setTimeout(() => this.playFmPling(1046.50, 2, 1.5, 0.8, 0.06), 120);
      },
      "task-add": () => this.playFmPling(880, 0.5, 1, 0.2, 0.08),
      "task-delete": () => this.playFallbackWhimper(),
      "button-hover": () => this.playTone(1600, "sine", 0.05, 0.03, 0.01, 0.04),
      "pug-toot": () => this.playFmPling(80, 0.1, 1, 0.3, 0.1),
      "pug-woof": () => this.playFmPling(180, 0.5, 4, 0.15, 0.12),
      "pug-snort": () => this.playFmPling(100, 0.2, 2, 0.2, 0.1),
      "pug-whimper": () => this.playFallbackWhimper(),
      "pug-bark": () => this.playFallbackBark(),
      "pug-snore": () => this.playTone(60, "triangle", 1.5, 0.06, 0.5, 0.5),
      "pug-yip": () => {
        this.playFmPling(500, 1.2, 2, 0.1, 0.1);
        setTimeout(() => this.playFmPling(700, 1.2, 2, 0.15, 0.1), 80);
      },
      "pug-chomp": () => this.playTone(400, "square", 0.1, 0.05),
      "celebration": () => this.playFmPling(1046.50, 2, 1.5, 1.0, 0.1),
      "milestone": () => {
        this.playFmPling(1046.50, 2, 1.5, 1.0, 0.1);
        setTimeout(() => this.playFallbackBark(), 600);
      },
      "tab-switch": () => this.playTone(900, "sine", 0.08, 0.04),
      "weight-log": () => this.playFmPling(880, 2, 2, 0.3, 0.06),
      "sparkle": () => this.playFmPling(1200 + Math.random() * 1000, 3, 2, 0.15, 0.04),
      "water-gulp": () => this.playTone(300, "sine", 0.2, 0.1),
      "level-up": () => this.playFmPling(1318.51, 2, 1.5, 1.0, 0.1),
      "achievement": () => this.playFmPling(1567.98, 2, 1.5, 1.0, 0.1),
      "confetti-pop": () => this.playTone(2000, "square", 0.1, 0.05),
      "chat-send": () => this.playFmPling(1100, 1.5, 1, 0.15, 0.05),
      "chat-receive": () => {
        this.playTone(1100, "sine", 0.2, 0.05);
        setTimeout(() => this.playTone(880, "sine", 0.2, 0.05), 80);
      },
      "item-equip": () => this.playFmPling(1200, 3, 2, 0.15, 0.04),
      "item-preview": () => this.playTone(800, "sine", 0.15, 0.04),
      "shop-purchase": () => this.playTone(2400, "square", 0.2, 0.05),
    };
    
    map[effect]?.();
  }
}

export const soundEngine = new PugSoundEngine();
