import type { KeyboardMap, WaveformType } from "../types/synth";

export const NOTES = [
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
];

export const WAVEFORMS: WaveformType[] = [
  "sine",
  "square",
  "sawtooth",
  "triangle",
];

export const DEFAULT_SYNTH_PARAMS = {
  oscillator: {
    type: "sine" as WaveformType,
  },
  envelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.5,
  },
  volume: -10,
  filter: {
    frequency: 1000,
    enabled: true,
  },
  reverb: {
    wet: 0.3,
    enabled: true,
  },
};

export const KEYBOARD_MAP: KeyboardMap = {
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
  o: "C#5",
  l: "D5",
  p: "D#5",
  ";": "E5",
};
