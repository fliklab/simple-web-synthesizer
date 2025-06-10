import * as Tone from "tone";
import type { SynthState } from "../types/synth";
import type { WaveformType } from "../types/synth";
import type { SynthParams } from "../types/synth";

export const initializeAudioChain = (state: SynthState) => {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: state.waveform },
    envelope: {
      attack: state.attack,
      decay: state.decay,
      sustain: state.sustain,
      release: state.release,
    },
  });

  const filter = new Tone.Filter(state.filterFreq, "lowpass");
  const reverb = new Tone.Reverb({ wet: state.reverbWet });
  const analyser = new Tone.Analyser("waveform", 256);

  synth.connect(filter);
  filter.connect(reverb);
  reverb.connect(analyser);
  analyser.toDestination();

  synth.volume.value = state.volume;

  return {
    synth,
    filter,
    reverb,
    analyser,
  };
};

export const startAudio = async () => {
  await Tone.start();
};

export const updateSynthParams = (
  synth: Tone.PolySynth,
  params: Partial<{
    volume: number;
    waveform: WaveformType;
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  }>
) => {
  if (params.volume !== undefined) {
    synth.volume.value = params.volume;
  }

  if (params.waveform !== undefined) {
    synth.set({
      oscillator: { type: params.waveform },
    });
  }

  const envelope: Partial<Tone.EnvelopeOptions> = {};
  if (params.attack !== undefined) envelope.attack = params.attack;
  if (params.decay !== undefined) envelope.decay = params.decay;
  if (params.sustain !== undefined) envelope.sustain = params.sustain;
  if (params.release !== undefined) envelope.release = params.release;

  if (Object.keys(envelope).length > 0) {
    synth.set({ envelope });
  }
};

export const updateEffectParams = (
  filter: Tone.Filter,
  reverb: Tone.Reverb,
  params: Partial<{
    filterFreq: number;
    filterEnabled: boolean;
    reverbWet: number;
    reverbEnabled: boolean;
  }>
) => {
  if (params.filterFreq !== undefined || params.filterEnabled !== undefined) {
    filter.frequency.value = params.filterEnabled
      ? params.filterFreq ?? filter.frequency.value
      : 20000;
  }

  if (params.reverbWet !== undefined || params.reverbEnabled !== undefined) {
    reverb.wet.value = params.reverbEnabled
      ? params.reverbWet ?? reverb.wet.value
      : 0;
  }
};

/**
 * 신디사이저 인스턴스를 생성합니다.
 */
export const createSynth = (params: SynthParams): Tone.PolySynth => {
  const synth = new Tone.PolySynth(Tone.Synth).set({
    oscillator: {
      type: params.oscillator.type,
    },
    envelope: {
      attack: params.envelope.attack,
      decay: params.envelope.decay,
      sustain: params.envelope.sustain,
      release: params.envelope.release,
    },
  });

  synth.volume.value = params.oscillator.volume;
  return synth;
};

/**
 * 필터를 생성합니다.
 */
export const createFilter = (frequency: number): Tone.Filter => {
  return new Tone.Filter(frequency, "lowpass");
};

/**
 * 리버브를 생성합니다.
 */
export const createReverb = (wet: number): Tone.Reverb => {
  const reverb = new Tone.Reverb({
    wet,
    decay: 2,
    preDelay: 0.01,
  });
  return reverb;
};

/**
 * 오실로스코프용 분석기를 생성합니다.
 */
export const createAnalyser = (): Tone.Analyser => {
  return new Tone.Analyser("waveform", 256);
};

/**
 * 오디오 체인을 연결합니다.
 */
export const connectAudioChain = (
  synth: Tone.PolySynth,
  filter: Tone.Filter,
  reverb: Tone.Reverb,
  analyser: Tone.Analyser
): void => {
  synth.connect(filter);
  filter.connect(reverb);
  reverb.connect(analyser);
  analyser.toDestination();
};

/**
 * 오디오 체인을 해제합니다.
 */
export const disposeAudioChain = (
  synth: Tone.PolySynth,
  filter: Tone.Filter,
  reverb: Tone.Reverb,
  analyser: Tone.Analyser
): void => {
  synth?.dispose();
  filter?.dispose();
  reverb?.dispose();
  analyser?.dispose();
};

/**
 * Connects audio nodes in sequence
 */
export const connectNodes = (nodes: Tone.ToneAudioNode[]) => {
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].connect(nodes[i + 1]);
  }
  return nodes[nodes.length - 1];
};

/**
 * Converts MIDI note number to frequency
 */
export const midiToFreq = (note: number) => {
  return 440 * Math.pow(2, (note - 69) / 12);
};

/**
 * Converts frequency to MIDI note number
 */
export const freqToMidi = (frequency: number) => {
  return Math.round(12 * Math.log2(frequency / 440) + 69);
};

/**
 * Converts decibels to amplitude ratio
 */
export const dbToRatio = (db: number) => {
  return Math.pow(10, db / 20);
};

/**
 * Converts amplitude ratio to decibels
 */
export const ratioToDb = (ratio: number) => {
  return 20 * Math.log10(ratio);
};
