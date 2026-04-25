/**
 * Short Web Audio beeps for messaging UX (no external assets; respects mute).
 * Browsers may block audio until a user gesture — call `unlockMessagingAudio` from a click/key handler.
 */

let audioCtx: AudioContext | null = null
let lastTypingBeep = 0

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (audioCtx) return audioCtx
  const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  audioCtx = new Ctor()
  return audioCtx
}

export function unlockMessagingAudio(): void {
  const ctx = context()
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume().catch(() => {})
  }
}

function playTone(
  frequency: number,
  durationSec: number,
  opts?: { type?: OscillatorType; volume?: number; when?: number },
) {
  const ctx = context()
  if (!ctx || ctx.state !== 'running') return

  const t0 = ctx.currentTime + (opts?.when ?? 0)
  const vol = opts?.volume ?? 0.06
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = opts?.type ?? 'sine'
  osc.frequency.setValueAtTime(frequency, t0)
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durationSec)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + durationSec + 0.02)
}

export function playSendSound(): void {
  playTone(880, 0.06, { volume: 0.05 })
  playTone(1320, 0.04, { when: 0.03, volume: 0.04 })
}

export function playReceiveSound(): void {
  playTone(520, 0.08, { type: 'triangle', volume: 0.07 })
  playTone(660, 0.06, { when: 0.05, type: 'triangle', volume: 0.05 })
}

/** Soft tick when the other user is typing; heavily debounced. */
export function playTypingSound(): void {
  const now = Date.now()
  if (now - lastTypingBeep < 1800) return
  lastTypingBeep = now
  playTone(300, 0.04, { type: 'sine', volume: 0.025 })
}

/** Close / block / report / clear — short descending tone. */
export function playActionSound(): void {
  playTone(400, 0.07, { type: 'square', volume: 0.045 })
  playTone(280, 0.08, { when: 0.07, type: 'square', volume: 0.03 })
}
