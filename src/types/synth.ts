import * as Tone from "tone";

export type WaveformType = "sine" | "triangle" | "sawtooth" | "square";

export interface SynthParams {
  oscillator: {
    type: WaveformType;
  };
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  volume: number;
  filter: {
    frequency: number;
    enabled: boolean;
  };
  reverb: {
    wet: number;
    enabled: boolean;
  };
}

export interface KnobProps {
  min?: number;
  max?: number;
  initialValue?: number;
  size?: number;
  knobColor?: string;
  indicatorColor?: string;
  backgroundColor?: string;
  tickColor?: string;
  valueColor?: string;
  minAngle?: number;
  maxAngle?: number;
  showTicks?: boolean;
  showMinMax?: boolean;
  showValue?: boolean;
  label?: string;
  onChange?: (value: number) => void;
}

export interface SliderProps {
  min?: number;
  max?: number;
  initialValue?: number;
  orientation?: "horizontal" | "vertical";
  length?: number;
  thickness?: number;
  sliderColor?: string;
  handleColor?: string;
  trackColor?: string;
  tickColor?: string;
  valueColor?: string;
  showTicks?: boolean;
  showValue?: boolean;
  label?: string;
  onChange?: (value: number) => void;
}

export interface ToggleButtonProps {
  size?: number;
  label?: string;
  onColor?: string;
  offColor?: string;
  labelColor?: string;
  initialState?: boolean;
  onChange?: (state: boolean) => void;
}

export interface NoteButtonProps {
  note: string;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  labelColor?: string;
  isPressed?: boolean;
  onNoteOn?: (note: string) => void;
  onNoteOff?: (note: string) => void;
}

export interface WaveformSelectorProps {
  options?: WaveformType[];
  initialValue?: WaveformType;
  onChange?: (waveform: WaveformType) => void;
}

export interface ADSRVisualizerProps {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface OscilloscopeProps {
  analyser: Tone.Analyser | null;
  width?: number;
  height?: number;
}

export interface SynthState {
  volume: number;
  filterFreq: number;
  reverbWet: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  waveform: WaveformType;
  filterEnabled: boolean;
  reverbEnabled: boolean;
  activeNotes: Set<string>;
}

export type KeyboardMap = {
  [key: string]: string;
};
