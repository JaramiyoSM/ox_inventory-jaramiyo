// Cute "uwu" sound effects for the inventory, synthesized on the fly with the
// Web Audio API — no audio files, no assets, just soft little blips. The mute
// choice is remembered in localStorage. Everything is lazy so nothing plays (or
// even builds an AudioContext) until the first real interaction.

let ctx: AudioContext | null = null;
let muted = false;

try {
  muted = localStorage.getItem('jrmy-inv-muted') === '1';
} catch {
  /* localStorage may be unavailable */
}

const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
};

interface Blip {
  freq: number;
  type?: OscillatorType;
  dur?: number;
  gain?: number;
  slideTo?: number;
  delay?: number;
}

const play = (blips: Blip[]) => {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;

  for (const b of blips) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    const t = now + (b.delay ?? 0);
    const dur = b.dur ?? 0.09;
    const gain = b.gain ?? 0.05;

    osc.type = b.type ?? 'sine';
    osc.frequency.setValueAtTime(b.freq, t);
    if (b.slideTo) osc.frequency.exponentialRampToValueAtTime(b.slideTo, t + dur);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(g).connect(ac.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }
};

let lastHover = 0;

export const sfx = {
  hover() {
    const n = typeof performance !== 'undefined' ? performance.now() : 0;
    if (n - lastHover < 55) return;
    lastHover = n;
    play([{ freq: 620, type: 'sine', dur: 0.045, gain: 0.02 }]);
  },
  pickup() {
    play([{ freq: 520, slideTo: 800, type: 'triangle', dur: 0.1, gain: 0.05 }]);
  },
  drop() {
    play([{ freq: 320, slideTo: 200, type: 'sine', dur: 0.11, gain: 0.06 }]);
  },
  use() {
    play([
      { freq: 660, type: 'triangle', dur: 0.08, gain: 0.045 },
      { freq: 988, type: 'triangle', dur: 0.09, gain: 0.04, delay: 0.06 },
    ]);
  },
  error() {
    play([{ freq: 200, slideTo: 140, type: 'sawtooth', dur: 0.14, gain: 0.035 }]);
  },
  open() {
    play([
      { freq: 523, type: 'sine', dur: 0.12, gain: 0.045 },
      { freq: 784, type: 'sine', dur: 0.14, gain: 0.04, delay: 0.05 },
    ]);
  },
  close() {
    play([
      { freq: 660, type: 'sine', dur: 0.1, gain: 0.04 },
      { freq: 440, type: 'sine', dur: 0.12, gain: 0.04, delay: 0.05 },
    ]);
  },
  click() {
    play([{ freq: 480, type: 'triangle', dur: 0.05, gain: 0.035 }]);
  },
  toggleMute(): boolean {
    muted = !muted;
    try {
      localStorage.setItem('jrmy-inv-muted', muted ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (!muted) sfx.click();
    return muted;
  },
  isMuted() {
    return muted;
  },
};
