"use client";

import { useEffect, useRef } from "react";

export function InteractionSounds({ muted }: { muted: boolean }) {
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    function playClick(event: PointerEvent) {
      if (muted) return;
      const target = event.target as Element | null;
      const control = target?.closest("button, select, [role='button']");
      if (!control || control.getAttribute("aria-disabled") === "true") return;
      if (control instanceof HTMLButtonElement && control.disabled) return;

      const AudioContextConstructor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextConstructor) return;
      const context = contextRef.current || new AudioContextConstructor();
      contextRef.current = context;
      if (context.state === "suspended") void context.resume();

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        control.tagName === "SELECT" ? 330 : 210,
        now,
      );
      oscillator.frequency.exponentialRampToValueAtTime(145, now + 0.07);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.09);
    }

    document.addEventListener("pointerdown", playClick);
    return () => document.removeEventListener("pointerdown", playClick);
  }, [muted]);

  return null;
}
