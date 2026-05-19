import { useEffect, useRef, useState } from "react";

export function useMetronome(bpm: number, enabled: boolean) {
  const [beat, setBeat] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalMs = (60 / bpm) * 1000;
    const interval = window.setInterval(() => {
      setBeat((value) => value + 1);
      click();
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [bpm, enabled]);

  function click() {
    const AudioContextClass = window.AudioContext;
    const context = audioRef.current ?? new AudioContextClass();
    audioRef.current = context;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.06);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.07);
  }

  return beat;
}
