import * as Tone from "tone";

export type WaveformType = "sine" | "square" | "sawtooth" | "triangle";
export type FilterType = "lowpass" | "highpass";

export interface SynthParams {
  oscillator: {
    type: WaveformType;
    volume: number;
  };
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  filter: {
    frequency: number;
    type: FilterType;
    Q: number;
  };
  reverb: {
    mix: number;
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
  selected: WaveformType;
  onChange: (type: WaveformType) => void;
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

export interface CircularKnobProps {
  label: string;
  min: number;
  max: number;
  initialValue: number;
  onChange: (value: number) => void;
  logScale?: boolean;
}
