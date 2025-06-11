import { useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import type { SynthParams } from "../types/synth";

export const useSynth = (params: SynthParams) => {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const limiterRef = useRef<Tone.Limiter | null>(null);

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

    limiterRef.current = new Tone.Limiter({
      threshold: -6, // dB
    });

    // Connect audio nodes
    if (
      synthRef.current &&
      filterRef.current &&
      reverbRef.current &&
      analyserRef.current &&
      limiterRef.current
    ) {
      synthRef.current.connect(filterRef.current);
      filterRef.current.connect(reverbRef.current);
      reverbRef.current.connect(analyserRef.current);
      analyserRef.current.connect(limiterRef.current);
      limiterRef.current.toDestination();
    }

    // Set initial volume
    if (synthRef.current) {
      synthRef.current.volume.value = params.oscillator.volume;
    }

    // 디버깅을 위한 오디오 그래프 연결 상태 확인
    console.log("🎵 오디오 그래프 초기화 완료");
    console.log("📊 AudioContext 상태:", Tone.getContext().state);
    console.log("🔗 오디오 노드 연결:", {
      synth: !!synthRef.current,
      filter: !!filterRef.current,
      reverb: !!reverbRef.current,
      analyser: !!analyserRef.current,
      limiter: !!limiterRef.current,
      destination: "toDestination() 연결됨",
    });

    return () => {
      if (synthRef.current) synthRef.current.dispose();
      if (filterRef.current) filterRef.current.dispose();
      if (reverbRef.current) reverbRef.current.dispose();
      if (analyserRef.current) analyserRef.current.dispose();
      if (limiterRef.current) limiterRef.current.dispose();
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

  const playNote = useCallback(async (note: string) => {
    // AudioContext 상태 확인 및 활성화
    if (Tone.getContext().state === "suspended") {
      console.log("⚠️ AudioContext가 suspended 상태입니다. 활성화 시도 중...");
      try {
        await Tone.start();
        console.log("✅ AudioContext가 활성화되었습니다.");
      } catch (error) {
        console.error("❌ AudioContext 활성화 실패:", error);
        return;
      }
    }

    if (synthRef.current) {
      console.log(
        "🎹 노트 재생:",
        note,
        "AudioContext 상태:",
        Tone.getContext().state
      );
      synthRef.current.triggerAttack(note);
    }
  }, []);

  const stopNote = useCallback((note: string) => {
    if (synthRef.current) {
      console.log("🎹 노트 정지:", note);
      synthRef.current.triggerRelease(note);
    }
  }, []);

  const getAudioInfo = useCallback(() => {
    const context = Tone.getContext();
    return {
      contextState: context.state,
      sampleRate: context.sampleRate,
      currentTime: context.currentTime,
      destination: context.destination,
      isConnected: !!(synthRef.current && limiterRef.current),
    };
  }, []);

  return {
    synth: synthRef.current,
    analyser: analyserRef.current,
    limiter: limiterRef.current,
    playNote,
    stopNote,
    getAudioInfo,
  };
};
