import { SoundEffect } from "./types";

class PugSoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private noiseBuffer: AudioBuffer | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverbBuffer: AudioBuffer | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private userVolume = 1;

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
    if (this.masterGain) {
      const ctx = this.getCtx();
      this.masterGain.gain.setTargetAtTime(this.effectiveVolume(), ctx.currentTime, 0.05);
    }
  }

  private duck() {
    if (!this.duckGain) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    this.duckGain.gain.setTargetAtTime(0.2, t, 0.02);
    this.duckGain.gain.setTargetAtTime(1, t + 0.35, 0.15);
  }

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

  private getReverbBuffer(): AudioBuffer {
    if (this.reverbBuffer) return this.reverbBuffer;
    const ctx = this.getCtx();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 1.5; // 1.5s dense reverb tail
    const buffer = ctx.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
      }
    }
    this.reverbBuffer = buffer;
    return buffer;
  }

  private createReverb(wetGain = 0.3): { input: GainNode; output: GainNode } {
    const ctx = this.getCtx();
    const convolver = ctx.createConvolver();
    convolver.buffer = this.getReverbBuffer();
    const wet = ctx.createGain();
    wet.gain.setValueAtTime(wetGain, ctx.currentTime);
    const dry = ctx.createGain();
    dry.gain.setValueAtTime(1 - wetGain, ctx.currentTime);
    const input = ctx.createGain();
    const output = ctx.createGain();
    input.connect(convolver).connect(wet).connect(output);
    input.connect(dry).connect(output);
    return { input, output };
  }

  private randomPitch(baseFreq: number, range = 0.05): number {
    return baseFreq * (1 + (Math.random() * 2 - 1) * range);
  }

  setMuted(m: boolean) { this.muted = m; }
  isMuted() { return this.muted; }

  private getNoiseBuffer(): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const ctx = this.getCtx();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Pink-ish noise profile for warmth
    let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
    for (let i = 0; i < data.length; i++) {
      let white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; // compensation
      b6 = white * 0.115926;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  // ── ULTRA-POLISHED SYNTHESIS PRIMITIVES ──

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

  // ── HIGH-FIDELITY PUG SOUNDS ──

  playPugToot() {
    if (this.muted) return;
    this.duck();
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(80, t);
      bp.frequency.exponentialRampToValueAtTime(150, t + 0.1);
      bp.Q.setValueAtTime(4, t);
      
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.3, t + 0.03);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      
      noise.connect(bp).connect(env).connect(this.getMaster());
      noise.start(t); noise.stop(t + 0.3);
    } catch {}
  }

  playPugWoof() {
    if (this.muted) return;
    this.duck();
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      
      // Throat transient (FM)
      this.playFmPling(180, 0.5, 4, 0.15, 0.12);
      
      // Breath noise
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(1200, t);
      bp.Q.setValueAtTime(1.5, t);
      
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.08, t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      
      noise.connect(bp).connect(env).connect(this.getMaster());
      noise.start(t); noise.stop(t + 0.15);
    } catch {}
  }

  playPugSnort() {
    if (this.muted) return;
    this.duck();
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      
      const bp = ctx.createBiquadFilter();
      bp.type = "lowpass";
      bp.frequency.setValueAtTime(600, t);
      
      // Fast flutter LFO
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(this.randomPitch(14, 0.2), t);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.1, t);
      
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.15, t + 0.05);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      
      lfo.connect(lfoGain).connect(env.gain);
      noise.connect(bp).connect(env).connect(this.getMaster());
      
      noise.start(t); lfo.start(t);
      noise.stop(t + 0.4); lfo.stop(t + 0.4);
    } catch {}
  }

  playPugWhimper() {
    if (this.muted) return;
    this.duck();
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(500, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.6);
      
      const vibrato = ctx.createOscillator();
      vibrato.frequency.setValueAtTime(6, t);
      const vGain = ctx.createGain();
      vGain.gain.setValueAtTime(15, t);
      vibrato.connect(vGain).connect(osc.frequency);
      
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.08, t + 0.1);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      
      osc.connect(env).connect(this.getMaster());
      osc.start(t); vibrato.start(t);
      osc.stop(t + 0.65); vibrato.stop(t + 0.65);
    } catch {}
  }

  playPugBark() {
    if (this.muted) return;
    this.duck();
    setTimeout(() => this.playPugWoof(), 0);
    setTimeout(() => this.playPugWoof(), 120);
  }

  playPugSnore() {
    if (this.muted) return;
    this.duck();
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(this.randomPitch(60, 0.1), t);
      
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.5, t); // Slow inhale
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.05, t);
      
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.06, t + 0.5);
      env.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
      
      lfo.connect(lfoGain).connect(env.gain);
      osc.connect(env).connect(this.getMaster());
      
      osc.start(t); lfo.start(t);
      osc.stop(t + 1.6); lfo.stop(t + 1.6);
    } catch {}
  }

  playPugYip() {
    if (this.muted) return;
    this.duck();
    this.playFmPling(500, 1.2, 2, 0.1, 0.1);
    setTimeout(() => this.playFmPling(700, 1.2, 2, 0.15, 0.1), 80);
  }

  playPugChomp() {
    if (this.muted) return;
    this.duck();
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const offset = i * 0.12;
        const noise = ctx.createBufferSource();
        noise.buffer = this.getNoiseBuffer();
        
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(500 + i * 50, t + offset);
        bp.Q.setValueAtTime(3, t + offset);
        
        const env = ctx.createGain();
        env.gain.setValueAtTime(0, t + offset);
        env.gain.linearRampToValueAtTime(0.12, t + offset + 0.01);
        env.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.08);
        
        noise.connect(bp).connect(env).connect(this.getMaster());
        noise.start(t + offset); noise.stop(t + offset + 0.1);
      }
    } catch {}
  }

  // ── HIGH-POLISH UI SOUNDS ──

  playTaskComplete() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const reverb = this.createReverb(0.4);
      
      // Majestic major chord sweep
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        this.playFmPling(f, 2, 1.5, 0.8, 0.06);
        
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t + i * 0.06);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, t + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.08, t + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.5);
        osc.connect(gain).connect(reverb.input);
        osc.start(t + i * 0.06); osc.stop(t + i * 0.06 + 0.6);
      });
      reverb.output.connect(this.getMaster());
    } catch {}
  }

  playTaskAdd() {
    this.playFmPling(880, 0.5, 1, 0.2, 0.08);
  }

  playTaskDelete() {
    this.playPugWhimper();
  }

  playButtonHover() {
    this.playTone(1600, "sine", 0.05, 0.03, 0.01, 0.04);
  }

  playCelebration() {
    if (this.muted) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    const reverb = this.createReverb(0.5);
    
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, t + i * 0.05);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.08, t + i * 0.05 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.8);
      osc.connect(gain).connect(reverb.input);
      osc.start(t + i * 0.05); osc.stop(t + i * 0.05 + 1);
    });
    reverb.output.connect(this.getMaster());
    
    setTimeout(() => this.playPugYip(), 250);
  }

  playMilestone() {
    this.playCelebration();
    setTimeout(() => this.playPugBark(), 600);
  }

  playTabSwitch() {
    this.playTone(900, "sine", 0.08, 0.04);
  }

  playWeightLog() {
    this.playFmPling(880, 2, 2, 0.3, 0.06);
    setTimeout(() => this.playFmPling(1320, 2, 2, 0.4, 0.08), 120);
  }

  playSparkle() {
    this.playFmPling(1200 + Math.random() * 1000, 3, 2, 0.15, 0.04);
  }

  playWaterGulp() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.15);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain).connect(this.getMaster());
      osc.start(t); osc.stop(t + 0.25);
      
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(400, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc2.connect(gain2).connect(this.getMaster());
        osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.25);
      }, 120);
    } catch {}
  }

  playLevelUp() {
    this.playCelebration();
  }

  playAchievement() {
    this.playCelebration();
  }

  playConfettiPop() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      const bp = ctx.createBiquadFilter();
      bp.type = "highpass";
      bp.frequency.setValueAtTime(2000, t);
      bp.frequency.exponentialRampToValueAtTime(8000, t + 0.1);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      noise.connect(bp).connect(gain).connect(this.getMaster());
      noise.start(t); noise.stop(t + 0.2);
    } catch {}
  }

  playChatSend() {
    this.playFmPling(1100, 1.5, 1, 0.15, 0.05);
  }

  playChatReceive() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const reverb = this.createReverb(0.3);
      
      [1100, 880].forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t + i * 0.08);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, t + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, t + i * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.2);
        osc.connect(gain).connect(reverb.input);
        osc.start(t + i * 0.08); osc.stop(t + i * 0.08 + 0.25);
      });
      reverb.output.connect(this.getMaster());
    } catch {}
  }

  playItemEquip() {
    this.playSparkle();
    setTimeout(() => this.playSparkle(), 80);
  }

  playItemPreview() {
    this.playTone(800, "sine", 0.15, 0.04);
  }

  playShopPurchase() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const reverb = this.createReverb(0.4);
      
      // Coin Chink
      const osc1 = ctx.createOscillator();
      osc1.type = "square";
      osc1.frequency.setValueAtTime(2400, t);
      osc1.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0, t);
      gain1.gain.linearRampToValueAtTime(0.05, t + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc1.connect(gain1).connect(reverb.input);
      osc1.start(t); osc1.stop(t + 0.2);
      
      // Register Ding
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1567.98, t + 0.08);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0, t + 0.08);
      gain2.gain.linearRampToValueAtTime(0.1, t + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc2.connect(gain2).connect(reverb.input);
      osc2.start(t + 0.08); osc2.stop(t + 0.7);
      
      reverb.output.connect(this.getMaster());
    } catch {}
  }

  play(effect: SoundEffect) {
    if (this.muted) return;
    const map: Record<SoundEffect, () => void> = {
      "task-complete": () => this.playTaskComplete(),
      "task-add": () => this.playTaskAdd(),
      "task-delete": () => this.playTaskDelete(),
      "button-hover": () => this.playButtonHover(),
      "pug-toot": () => this.playPugToot(),
      "pug-woof": () => this.playPugWoof(),
      "pug-snort": () => this.playPugSnort(),
      "pug-whimper": () => this.playPugWhimper(),
      "pug-bark": () => this.playPugBark(),
      "pug-snore": () => this.playPugSnore(),
      "pug-yip": () => this.playPugYip(),
      "pug-chomp": () => this.playPugChomp(),
      "celebration": () => this.playCelebration(),
      "milestone": () => this.playMilestone(),
      "tab-switch": () => this.playTabSwitch(),
      "weight-log": () => this.playWeightLog(),
      "sparkle": () => this.playSparkle(),
      "water-gulp": () => this.playWaterGulp(),
      "level-up": () => this.playLevelUp(),
      "achievement": () => this.playAchievement(),
      "confetti-pop": () => this.playConfettiPop(),
      "chat-send": () => this.playChatSend(),
      "chat-receive": () => this.playChatReceive(),
      "item-equip": () => this.playItemEquip(),
      "item-preview": () => this.playItemPreview(),
      "shop-purchase": () => this.playShopPurchase(),
    };
    map[effect]?.();
  }
}

export const soundEngine = new PugSoundEngine();
