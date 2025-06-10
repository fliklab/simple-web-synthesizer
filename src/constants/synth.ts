import type { KeyboardMap, WaveformType } from "../types/synth";

export const DEFAULT_WAVEFORMS: WaveformType[] = [
  "sine",
  "triangle",
  "sawtooth",
  "square",
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

export const NOTES = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
