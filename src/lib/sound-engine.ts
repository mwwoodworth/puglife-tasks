import { SoundEffect } from "./types";

class PugSoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  setMuted(m: boolean) { this.muted = m; }
  isMuted() { return this.muted; }

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

  playTaskComplete() {
    this.sweep(500, 900, 0.15);
    setTimeout(() => this.tone(1100, 0.2, "sine", 0.1), 100);
  }

  playTaskAdd() {
    this.sweep(600, 800, 0.1, "sine", 0.1);
  }

  playTaskDelete() {
    this.sweep(400, 200, 0.25, "triangle", 0.1);
  }

  playButtonHover() {
    this.tone(1400, 0.04, "sine", 0.05);
  }

  playPugToot() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      lfo.frequency.setValueAtTime(20, ctx.currentTime);
      lfoGain.gain.setValueAtTime(15, ctx.currentTime);
      lfo.connect(lfoGain).connect(osc.frequency);
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(g).connect(ctx.destination);
      osc.start();
      lfo.start();
      osc.stop(ctx.currentTime + 0.18);
      lfo.stop(ctx.currentTime + 0.18);
    } catch { /* audio not available */ }
  }

  playCelebration() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => setTimeout(() => this.tone(f, 0.2, "sine", 0.1), i * 80));
  }

  playMilestone() {
    this.tone(523, 0.3, "triangle", 0.12);
    setTimeout(() => this.tone(784, 0.4, "triangle", 0.12), 200);
  }

  playTabSwitch() {
    this.tone(800, 0.05, "sine", 0.06);
  }

  playWeightLog() {
    this.tone(880, 0.3, "sine", 0.1);
  }

  playSparkle() {
    const freq = 1200 + Math.random() * 800;
    this.tone(freq, 0.05, "sine", 0.04);
  }

  play(effect: SoundEffect) {
    if (this.muted) return;
    const map: Record<SoundEffect, () => void> = {
      "task-complete": () => this.playTaskComplete(),
      "task-add": () => this.playTaskAdd(),
      "task-delete": () => this.playTaskDelete(),
      "button-hover": () => this.playButtonHover(),
      "pug-toot": () => this.playPugToot(),
      "celebration": () => this.playCelebration(),
      "milestone": () => this.playMilestone(),
      "tab-switch": () => this.playTabSwitch(),
      "weight-log": () => this.playWeightLog(),
      "sparkle": () => this.playSparkle(),
    };
    map[effect]?.();
  }
}

export const soundEngine = new PugSoundEngine();
