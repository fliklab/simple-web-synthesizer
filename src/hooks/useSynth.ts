import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import type { SynthParams } from "../types/synth";
import { DEFAULT_SYNTH_PARAMS } from "../constants/synth";
import {
  createSynth,
  createFilter,
  createReverb,
  createAnalyser,
  connectAudioChain,
  disposeAudioChain,
} from "../utils/audio";

export const useSynth = (initialParams: Partial<SynthParams> = {}) => {
  const params = { ...DEFAULT_SYNTH_PARAMS, ...initialParams };

  const synthRef = useRef<Tone.PolySynth | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);

  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [filterEnabled, setFilterEnabled] = useState(params.filter.enabled);
  const [reverbEnabled, setReverbEnabled] = useState(params.reverb.enabled);

  useEffect(() => {
    // Initialize audio chain
    synthRef.current = createSynth(params);
    filterRef.current = createFilter(params.filter.frequency);
    reverbRef.current = createReverb(params.reverb.wet);
    analyserRef.current = createAnalyser();

    // Connect audio chain
    if (
      synthRef.current &&
      filterRef.current &&
      reverbRef.current &&
      analyserRef.current
    ) {
      connectAudioChain(
        synthRef.current,
        filterRef.current,
        reverbRef.current,
        analyserRef.current
      );
    }

    return () => {
      if (
        synthRef.current &&
        filterRef.current &&
        reverbRef.current &&
        analyserRef.current
      ) {
        disposeAudioChain(
          synthRef.current,
          filterRef.current,
          reverbRef.current,
          analyserRef.current
        );
      }
    };
  }, []);

  const playNote = async (note: string) => {
    await Tone.start();
    synthRef.current?.triggerAttack(note);
    setActiveNotes((prev) => new Set(prev).add(note));
  };

  const stopNote = (note: string) => {
    synthRef.current?.triggerRelease(note);
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  };

  const updateOscillator = (type: SynthParams["oscillator"]["type"]) => {
    if (synthRef.current) {
      synthRef.current.set({ oscillator: { type } });
    }
  };

  const updateEnvelope = (envelope: Partial<SynthParams["envelope"]>) => {
    if (synthRef.current) {
      synthRef.current.set({ envelope });
    }
  };

  const updateVolume = (volume: number) => {
    if (synthRef.current) {
      synthRef.current.volume.value = volume;
    }
  };

  const updateFilter = (frequency: number) => {
    if (filterRef.current) {
      filterRef.current.frequency.value = filterEnabled ? frequency : 20000;
    }
  };

  const updateFilterEnabled = (enabled: boolean) => {
    setFilterEnabled(enabled);
    if (filterRef.current) {
      filterRef.current.frequency.value = enabled
        ? filterRef.current.frequency.value
        : 20000;
    }
  };

  const updateReverb = (wet: number) => {
    if (reverbRef.current) {
      reverbRef.current.wet.value = reverbEnabled ? wet : 0;
    }
  };

  const updateReverbEnabled = (enabled: boolean) => {
    setReverbEnabled(enabled);
    if (reverbRef.current) {
      reverbRef.current.wet.value = enabled ? reverbRef.current.wet.value : 0;
    }
  };

  return {
    activeNotes,
    analyser: analyserRef.current,
    filterEnabled,
    reverbEnabled,
    playNote,
    stopNote,
    updateOscillator,
    updateEnvelope,
    updateVolume,
    updateFilter,
    updateFilterEnabled,
    updateReverb,
    updateReverbEnabled,
  };
};
