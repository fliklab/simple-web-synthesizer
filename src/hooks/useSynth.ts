import { useEffect, useRef } from "react";
import * as Tone from "tone";
import type { SynthParams } from "../types/synth";

export const useSynth = (params: SynthParams) => {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);

  useEffect(() => {
    // Initialize audio nodes
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
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

    filterRef.current = new Tone.Filter({
      frequency: params.filter.frequency,
      type: params.filter.type,
      Q: params.filter.Q,
    });

    reverbRef.current = new Tone.Reverb({
      wet: params.reverb.mix,
      decay: 2,
      preDelay: 0.01,
    });

    analyserRef.current = new Tone.Analyser({
      type: "waveform",
      size: 128,
    });

    // Connect audio nodes
    if (
      synthRef.current &&
      filterRef.current &&
      reverbRef.current &&
      analyserRef.current
    ) {
      synthRef.current.connect(filterRef.current);
      filterRef.current.connect(reverbRef.current);
      reverbRef.current.connect(analyserRef.current);
      analyserRef.current.toDestination();
    }

    // Set initial volume
    if (synthRef.current) {
      synthRef.current.volume.value = params.oscillator.volume;
    }

    return () => {
      if (synthRef.current) synthRef.current.dispose();
      if (filterRef.current) filterRef.current.dispose();
      if (reverbRef.current) reverbRef.current.dispose();
      if (analyserRef.current) analyserRef.current.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update parameters when they change
  useEffect(() => {
    if (!synthRef.current) return;

    synthRef.current.set({
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

    synthRef.current.volume.value = params.oscillator.volume;
  }, [
    params.oscillator.type,
    params.oscillator.volume,
    params.envelope.attack,
    params.envelope.decay,
    params.envelope.sustain,
    params.envelope.release,
  ]);

  useEffect(() => {
    if (!filterRef.current) return;

    filterRef.current.set({
      frequency: params.filter.frequency,
      type: params.filter.type,
      Q: params.filter.Q,
    });
  }, [params.filter.frequency, params.filter.type, params.filter.Q]);

  useEffect(() => {
    if (!reverbRef.current) return;

    reverbRef.current.set({
      wet: params.reverb.mix,
    });
  }, [params.reverb.mix]);

  const playNote = (note: string) => {
    if (synthRef.current) {
      synthRef.current.triggerAttack(note);
    }
  };

  const stopNote = (note: string) => {
    if (synthRef.current) {
      synthRef.current.triggerRelease(note);
    }
  };

  return {
    synth: synthRef.current,
    analyser: analyserRef.current,
    playNote,
    stopNote,
  };
};
