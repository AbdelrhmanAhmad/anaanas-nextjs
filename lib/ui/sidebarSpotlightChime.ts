/** Short pleasant chime for sidebar section spotlight (may be blocked until user gesture). */
export function playSidebarSpotlightChime(): void {
  if (typeof window === 'undefined') return
  try {
    const AC = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.26)
    void ctx.close()
  } catch {
    /* autoplay / API */
  }
}
