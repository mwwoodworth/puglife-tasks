import { SoundEffect } from "./types";

class PugSoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private noiseBuffer: AudioBuffer | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverbBuffer: AudioBuffer | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  // Master compressor to prevent clipping
  private getMaster(): AudioNode {
    const ctx = this.getCtx();
    if (!this.compressor) {
      this.compressor = ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-24, ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, ctx.currentTime);
      this.compressor.connect(ctx.destination);
    }
    return this.compressor;
  }

  // Synthetic reverb impulse response
  private getReverbBuffer(): AudioBuffer {
    if (this.reverbBuffer) return this.reverbBuffer;
    const ctx = this.getCtx();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 0.8; // 800ms reverb tail
    const buffer = ctx.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    this.reverbBuffer = buffer;
    return buffer;
  }

  // Create a convolver reverb node (wet path)
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

  // Pitch randomization for variety on repeated sounds
  private randomPitch(baseFreq: number, range = 0.05): number {
    return baseFreq * (1 + (Math.random() * 2 - 1) * range);
  }

  setMuted(m: boolean) { this.muted = m; }
  isMuted() { return this.muted; }

  // Generate white noise buffer (reusable)
  private getNoiseBuffer(): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const ctx = this.getCtx();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  // Helper: play noise through filter
  private noise(
    duration: number,
    filterType: BiquadFilterType,
    filterFreq: number,
    filterQ: number,
    gain: number,
    attack = 0.01,
    decay?: number
  ) {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const source = ctx.createBufferSource();
      source.buffer = this.getNoiseBuffer();
      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
      filter.Q.setValueAtTime(filterQ, ctx.currentTime);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(gain, ctx.currentTime + attack);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (decay || duration));
      source.connect(filter).connect(g).connect(ctx.destination);
      source.start();
      source.stop(ctx.currentTime + duration);
    } catch { /* audio not available */ }
  }

  private tone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.15) {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(g).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch { /* audio not available */ }
  }

  private sweep(startFreq: number, endFreq: number, duration: number, type: OscillatorType = "sine", gain = 0.12) {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + duration);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(g).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch { /* audio not available */ }
  }

  // ── REALISTIC PUG SOUNDS ──

  // Pug Toot: Brown noise burst through low bandpass — "pffft" character
  playPugToot() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      // Brown noise via filtered white noise
      const source = ctx.createBufferSource();
      source.buffer = this.getNoiseBuffer();
      // Low bandpass for rumbly toot
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(120, ctx.currentTime);
      bp.Q.setValueAtTime(2, ctx.currentTime);
      // Second filter for warmth
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(250, ctx.currentTime);
      // Amplitude envelope: quick attack, body, then trail off
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      g.gain.setValueAtTime(0.12, ctx.currentTime + 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      source.connect(bp).connect(lp).connect(g).connect(ctx.destination);
      source.start();
      source.stop(ctx.currentTime + 0.25);
    } catch { /* audio not available */ }
  }

  // Pug Woof: Sawtooth + noise burst — short, cute bark
  playPugWoof() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      // Sawtooth for vocal quality
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(140, t + 0.08);
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.08, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      // Noise layer for breathiness
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      const nBp = ctx.createBiquadFilter();
      nBp.type = "bandpass";
      nBp.frequency.setValueAtTime(800, t);
      nBp.Q.setValueAtTime(1, t);
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.06, t);
      nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(oscGain).connect(ctx.destination);
      noise.connect(nBp).connect(nGain).connect(ctx.destination);
      osc.start(); noise.start();
      osc.stop(t + 0.15); noise.stop(t + 0.15);
    } catch { /* audio not available */ }
  }

  // Pug Snort: Pink noise with LFO amplitude modulation — snuffling
  playPugSnort() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const source = ctx.createBufferSource();
      source.buffer = this.getNoiseBuffer();
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(400, t);
      bp.Q.setValueAtTime(3, t);
      // LFO for snuffling rhythm
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(8, t);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.05, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      lfo.connect(lfoGain).connect(g.gain);
      source.connect(bp).connect(g).connect(ctx.destination);
      source.start(); lfo.start();
      source.stop(t + 0.35); lfo.stop(t + 0.35);
    } catch { /* audio not available */ }
  }

  // Pug Whimper: Sine with vibrato, descending pitch
  playPugWhimper() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.linearRampToValueAtTime(280, t + 0.5);
      // Vibrato
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(5, t);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(15, t);
      lfo.connect(lfoGain).connect(osc.frequency);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(g).connect(ctx.destination);
      osc.start(); lfo.start();
      osc.stop(t + 0.55); lfo.stop(t + 0.55);
    } catch { /* audio not available */ }
  }

  // Happy Bark: Two quick bursts
  playPugBark() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      for (let i = 0; i < 2; i++) {
        const offset = i * 0.12;
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200 + i * 50, t + offset);
        osc.frequency.linearRampToValueAtTime(160 + i * 40, t + offset + 0.08);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.09, t + offset);
        g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.1);
        osc.connect(g).connect(ctx.destination);
        osc.start(t + offset);
        osc.stop(t + offset + 0.12);
      }
      // Noise layer
      const n = ctx.createBufferSource();
      n.buffer = this.getNoiseBuffer();
      const nBp = ctx.createBiquadFilter();
      nBp.type = "bandpass";
      nBp.frequency.setValueAtTime(1000, t);
      nBp.Q.setValueAtTime(1, t);
      const nG = ctx.createGain();
      nG.gain.setValueAtTime(0.04, t);
      nG.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      n.connect(nBp).connect(nG).connect(ctx.destination);
      n.start(); n.stop(t + 0.25);
    } catch { /* audio not available */ }
  }

  // Sleepy Snore: Low sine with slow amplitude cycling
  playPugSnore() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(80, t);
      // Slow amplitude cycling
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.5, t);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.06, t);
      lfo.connect(lfoGain).connect(g.gain);
      // Filtered noise for breath
      const n = ctx.createBufferSource();
      n.buffer = this.getNoiseBuffer();
      const nLp = ctx.createBiquadFilter();
      nLp.type = "lowpass";
      nLp.frequency.setValueAtTime(300, t);
      const nG = ctx.createGain();
      nG.gain.setValueAtTime(0.02, t);
      osc.connect(g).connect(ctx.destination);
      n.connect(nLp).connect(nG).connect(ctx.destination);
      osc.start(); lfo.start(); n.start();
      osc.stop(t + 1.5); lfo.stop(t + 1.5); n.stop(t + 1.5);
    } catch { /* audio not available */ }
  }

  // Celebration Yip: Fast ascending arpeggio with sparkle
  playPugYip() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const notes = [350, 400, 500];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(f, t + i * 0.06);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.07, t + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.08);
        osc.connect(g).connect(ctx.destination);
        osc.start(t + i * 0.06);
        osc.stop(t + i * 0.06 + 0.1);
      });
      // Sparkle pings
      setTimeout(() => {
        this.tone(1800, 0.06, "sine", 0.04);
        setTimeout(() => this.tone(2200, 0.05, "sine", 0.03), 30);
      }, 180);
    } catch { /* audio not available */ }
  }

  // Eating Chomps: Filtered noise bursts
  playPugChomp() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const offset = i * 0.1;
        const n = ctx.createBufferSource();
        n.buffer = this.getNoiseBuffer();
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(600 + i * 100, t + offset);
        bp.Q.setValueAtTime(5, t + offset);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.08, t + offset);
        g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.05);
        n.connect(bp).connect(g).connect(ctx.destination);
        n.start(t + offset);
        n.stop(t + offset + 0.06);
      }
    } catch { /* audio not available */ }
  }

  // ── INTERFACE SOUNDS ──

  playTaskComplete() {
    // Ascending two-tone chime (C5-E5) + sparkle
    this.tone(523, 0.15, "sine", 0.12);
    setTimeout(() => this.tone(659, 0.2, "sine", 0.1), 80);
    setTimeout(() => this.tone(1568, 0.05, "sine", 0.03), 160);
  }

  playTaskAdd() {
    this.sweep(600, 800, 0.1, "sine", 0.1);
  }

  playTaskDelete() {
    this.playPugWhimper();
  }

  playButtonHover() {
    this.tone(1400, 0.04, "sine", 0.04);
  }

  playCelebration() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => setTimeout(() => this.tone(f, 0.2, "sine", 0.1), i * 80));
    setTimeout(() => this.playPugYip(), 300);
  }

  playMilestone() {
    this.tone(523, 0.3, "triangle", 0.12);
    setTimeout(() => this.tone(784, 0.4, "triangle", 0.12), 200);
    setTimeout(() => this.playPugBark(), 500);
  }

  playTabSwitch() {
    this.tone(800, 0.05, "sine", 0.05);
  }

  playWeightLog() {
    this.tone(880, 0.2, "sine", 0.1);
    setTimeout(() => this.tone(1100, 0.15, "sine", 0.08), 120);
  }

  playSparkle() {
    const freq = 1200 + Math.random() * 800;
    this.tone(freq, 0.05, "sine", 0.04);
  }

  playWaterGulp() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      // Bubbly descending tone
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(g).connect(ctx.destination);
      osc.start(); osc.stop(t + 0.2);
      // Second bubble
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(500, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.07, ctx.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc2.connect(g2).connect(ctx.destination);
        osc2.start(); osc2.stop(ctx.currentTime + 0.15);
      }, 100);
    } catch { /* audio not available */ }
  }

  playLevelUp() {
    // Triumphant ascending arpeggio
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => setTimeout(() => this.tone(f, 0.25, "triangle", 0.1), i * 100));
    setTimeout(() => this.playPugBark(), 500);
  }

  playAchievement() {
    // Sparkly unlock sound
    this.tone(880, 0.15, "sine", 0.1);
    setTimeout(() => this.tone(1100, 0.15, "sine", 0.08), 100);
    setTimeout(() => this.tone(1320, 0.2, "sine", 0.1), 200);
    setTimeout(() => this.tone(1760, 0.1, "sine", 0.06), 300);
  }

  playConfettiPop() {
    // White noise burst with fast highpass sweep
    this.noise(0.1, "highpass", 2000, 1, 0.08, 0.005, 0.08);
  }

  // ── v5 SOUNDS ──

  playChatSend() {
    // Ascending ping — quick, light
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(this.randomPitch(880), t);
      osc.frequency.linearRampToValueAtTime(this.randomPitch(1320), t + 0.08);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(g).connect(this.getMaster());
      osc.start(); osc.stop(t + 0.15);
    } catch { /* audio not available */ }
  }

  playChatReceive() {
    // Descending chime with reverb
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const reverb = this.createReverb(0.4);
      const notes = [1320, 1100, 880];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(this.randomPitch(f), t + i * 0.07);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.06, t + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.15);
        osc.connect(g).connect(reverb.input);
        osc.start(t + i * 0.07);
        osc.stop(t + i * 0.07 + 0.2);
      });
      reverb.output.connect(this.getMaster());
    } catch { /* audio not available */ }
  }

  playItemEquip() {
    // Sparkly ascending arpeggio — satisfying equip feel
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const reverb = this.createReverb(0.3);
      const notes = [660, 880, 1100, 1320, 1760];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = i < 3 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(this.randomPitch(f, 0.02), t + i * 0.05);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.07, t + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.15);
        osc.connect(g).connect(reverb.input);
        osc.start(t + i * 0.05);
        osc.stop(t + i * 0.05 + 0.2);
      });
      reverb.output.connect(this.getMaster());
    } catch { /* audio not available */ }
  }

  playItemPreview() {
    // Soft warble — gentle preview feel
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(this.randomPitch(800), t);
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(6, t);
      const lfoG = ctx.createGain();
      lfoG.gain.setValueAtTime(30, t);
      lfo.connect(lfoG).connect(osc.frequency);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(g).connect(this.getMaster());
      osc.start(); lfo.start();
      osc.stop(t + 0.3); lfo.stop(t + 0.3);
    } catch { /* audio not available */ }
  }

  playShopPurchase() {
    // Coin register + sparkle — purchase satisfaction
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const t = ctx.currentTime;
      const reverb = this.createReverb(0.25);
      // Coin clink (metallic ring)
      const osc1 = ctx.createOscillator();
      osc1.type = "square";
      osc1.frequency.setValueAtTime(this.randomPitch(2400), t);
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.06, t);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc1.connect(g1).connect(reverb.input);
      osc1.start(); osc1.stop(t + 0.1);
      // Register ding
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(this.randomPitch(1568), t + 0.08);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.08, t + 0.08);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc2.connect(g2).connect(reverb.input);
      osc2.start(t + 0.08); osc2.stop(t + 0.4);
      // Sparkle accent
      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(this.randomPitch(2640), t + 0.2);
      const g3 = ctx.createGain();
      g3.gain.setValueAtTime(0.04, t + 0.2);
      g3.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc3.connect(g3).connect(reverb.input);
      osc3.start(t + 0.2); osc3.stop(t + 0.4);
      reverb.output.connect(this.getMaster());
    } catch { /* audio not available */ }
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
