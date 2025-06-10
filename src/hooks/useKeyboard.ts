import { useEffect } from "react";
import { KEYBOARD_MAP } from "../constants/synth";
import type { KeyboardMap } from "../types/synth";

interface UseKeyboardProps {
  onNoteOn: (note: string) => void;
  onNoteOff: (note: string) => void;
  keyboardMap?: KeyboardMap;
  activeNotes: Set<string>;
}

export const useKeyboard = ({
  onNoteOn,
  onNoteOff,
  keyboardMap = KEYBOARD_MAP,
  activeNotes,
}: UseKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = keyboardMap[e.key.toLowerCase()];
      if (note && !activeNotes.has(note)) {
        onNoteOn(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = keyboardMap[e.key.toLowerCase()];
      if (note) {
        onNoteOff(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onNoteOn, onNoteOff, keyboardMap, activeNotes]);
};
