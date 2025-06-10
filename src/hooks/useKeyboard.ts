import { useEffect, useState } from "react";
import * as Tone from "tone";

const KEYBOARD_MAP: { [key: string]: string } = {
  a: "C4",
  w: "C#4",
  s: "D4",
  e: "D#4",
  d: "E4",
  f: "F4",
  t: "F#4",
  g: "G4",
  y: "G#4",
  h: "A4",
  u: "A#4",
  j: "B4",
  k: "C5",
};

export const useKeyboard = (synth: Tone.PolySynth | null) => {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note && !e.repeat && !activeNotes.has(note)) {
        await Tone.start();
        synth?.triggerAttack(note);
        setActiveNotes((prev) => new Set(prev).add(note));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note) {
        synth?.triggerRelease(note);
        setActiveNotes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(note);
          return newSet;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [synth, activeNotes]);

  return { activeNotes };
};
