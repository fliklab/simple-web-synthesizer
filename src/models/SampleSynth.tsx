import React, { useRef, useEffect, useCallback, useState } from "react";
import type { WaveformType } from "../types/synth";
import * as Tone from "tone";
import { CircularKnob } from "../components/controls/CircularKnob";
import { ToggleButton } from "../components/controls/ToggleButton";
import { WaveformSelector } from "../components/controls/WaveformSelector";
import { Oscilloscope } from "../components/visualizers/Oscilloscope";
import Slider from "../components/controls/Slider";
import { NoteButton } from "../components/controls/NoteButton";
import { ADSRVisualizer } from "../components/visualizers/ADSRVisualizer";

// Main Synthesizer Component
export default function SampleSynth() {
  const synthRef = useRef<Tone.PolySynth<Tone.Synth> | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);

  const [volume, setVolume] = useState(-10);
  const [filterFreq, setFilterFreq] = useState(1000);
  const [reverbWet, setReverbWet] = useState(0.3);
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(0.5);
  const [waveform, setWaveform] = useState("sine");
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [reverbEnabled, setReverbEnabled] = useState(true);
  const [activeNotes, setActiveNotes] = useState(new Set());

  useEffect(() => {
    // Initialize audio chain
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: waveform as WaveformType },
      envelope: { attack, decay, sustain, release },
    });

    filterRef.current = new Tone.Filter(filterFreq, "lowpass");
    reverbRef.current = new Tone.Reverb({ wet: reverbWet });
    analyserRef.current = new Tone.Analyser("waveform", 256);

    // Connect audio chain
    synthRef.current.connect(filterRef.current);
    filterRef.current.connect(reverbRef.current);
    reverbRef.current.connect(analyserRef.current);
    analyserRef.current.toDestination();

    synthRef.current.volume.value = volume;

    return () => {
      synthRef.current?.dispose();
      filterRef.current?.dispose();
      reverbRef.current?.dispose();
      analyserRef.current?.dispose();
    };
  }, []);

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (synthRef.current) {
      synthRef.current.volume.value = value;
    }
  };

  const handleFilterChange = (value: number) => {
    setFilterFreq(value);
    if (filterRef.current && filterEnabled) {
      filterRef.current.frequency.value = value;
    }
  };

  const handleReverbChange = (value: number) => {
    setReverbWet(value);
    if (reverbRef.current && reverbEnabled) {
      reverbRef.current.wet.value = value;
    }
  };

  const handleAttackChange = (value: number) => {
    setAttack(value);
    if (synthRef.current) {
      synthRef.current.set({ envelope: { attack: value } });
    }
  };

  const handleDecayChange = (value: number) => {
    setDecay(value);
    if (synthRef.current) {
      synthRef.current.set({ envelope: { decay: value } });
    }
  };

  const handleSustainChange = (value: number) => {
    setSustain(value);
    if (synthRef.current) {
      synthRef.current.set({ envelope: { sustain: value } });
    }
  };

  const handleReleaseChange = (value: number) => {
    setRelease(value);
    if (synthRef.current) {
      synthRef.current.set({ envelope: { release: value } });
    }
  };

  const handleWaveformChange = (value: WaveformType) => {
    setWaveform(value);
    if (synthRef.current) {
      synthRef.current.set({ oscillator: { type: value } });
    }
  };

  const handleFilterToggle = (enabled: boolean) => {
    setFilterEnabled(enabled);
    if (filterRef.current) {
      filterRef.current.frequency.value = enabled ? filterFreq : 20000;
    }
  };

  const handleReverbToggle = (enabled: boolean) => {
    setReverbEnabled(enabled);
    if (reverbRef.current) {
      reverbRef.current.wet.value = enabled ? reverbWet : 0;
    }
  };

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

  // Keyboard mapping
  const keyboardMap = {
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = keyboardMap[e.key.toLowerCase() as keyof typeof keyboardMap];
      if (note && !activeNotes.has(note)) {
        playNote(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = keyboardMap[e.key.toLowerCase() as keyof typeof keyboardMap];
      if (note) {
        stopNote(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeNotes]);

  const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Web Synth
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "1rem",
          }}
        >
          {/* Oscilloscope */}
          <div style={{ gridColumn: "span 12 / span 4" }}>
            <Oscilloscope analyser={analyserRef.current} />
          </div>

          {/* Oscillator Section */}
          <div
            style={{
              gridColumn: "span 12 / span 8",
              backgroundColor: "#1a1a1a",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <h2
              style={{
                color: "#ffffff",
                fontSize: "1rem",
                fontFamily: "monospace",
                marginBottom: "0.5rem",
              }}
            >
              Knobs
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                }}
              >
                {/* Volume Control */}
                <div style={{ gridColumn: "span 1" }}>
                  <CircularKnob
                    label="Volume"
                    min={-60}
                    max={0}
                    initialValue={volume}
                    size={80}
                    indicatorColor="#4a9eff"
                    onChange={handleVolumeChange}
                  />
                  {/* Waveform Selector */}
                  <div style={{ marginTop: "1rem" }}>
                    <WaveformSelector
                      selected={waveform as WaveformType}
                      onChange={handleWaveformChange}
                    />
                  </div>
                </div>

                {/* Filter Control */}
                <div style={{ gridColumn: "span 1" }}>
                  <CircularKnob
                    label="Filter"
                    min={100}
                    max={5000}
                    initialValue={filterFreq}
                    size={50}
                    indicatorColor="#ff9f4a"
                    onChange={handleFilterChange}
                  />
                  <div style={{ marginTop: "1rem" }}>
                    <ToggleButton
                      size={30}
                      label="FLT"
                      onColor="#ff9f4a"
                      initialState={filterEnabled}
                      onChange={handleFilterToggle}
                    />
                  </div>
                </div>

                {/* Reverb Control */}
                <div style={{ gridColumn: "span 1" }}>
                  <CircularKnob
                    label="Reverb"
                    min={0}
                    max={1}
                    initialValue={reverbWet}
                    size={50}
                    indicatorColor="#4aff9f"
                    onChange={handleReverbChange}
                  />
                  <div style={{ marginTop: "1rem" }}>
                    <ToggleButton
                      size={30}
                      label="REV"
                      onColor="#4aff9f"
                      initialState={reverbEnabled}
                      onChange={handleReverbToggle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ADSR Controls with Visualizer */}
          <div
            style={{
              gridColumn: "span 12",
              backgroundColor: "#1a1a1a",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <h2
              style={{
                color: "#ffffff",
                fontSize: "1rem",
                fontFamily: "monospace",
                marginBottom: "0.5rem",
              }}
            >
              ENVELOPE
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Slider
                  label="Attack"
                  min={0.001}
                  max={2}
                  initialValue={attack}
                  orientation="vertical"
                  length={120}
                  thickness={30}
                  onChange={handleAttackChange}
                />
                <Slider
                  label="Decay"
                  min={0.001}
                  max={2}
                  initialValue={decay}
                  orientation="vertical"
                  length={120}
                  thickness={30}
                  onChange={handleDecayChange}
                />
                <Slider
                  label="Sustain"
                  min={0}
                  max={1}
                  initialValue={sustain}
                  orientation="vertical"
                  length={120}
                  thickness={30}
                  onChange={handleSustainChange}
                />
                <Slider
                  label="Release"
                  min={0.001}
                  max={3}
                  initialValue={release}
                  orientation="vertical"
                  length={120}
                  thickness={30}
                  onChange={handleReleaseChange}
                />
              </div>
              <div style={{ marginLeft: "1rem" }}>
                <ADSRVisualizer
                  attack={attack}
                  decay={decay}
                  sustain={sustain}
                  release={release}
                />
              </div>
            </div>
          </div>

          {/* Note Buttons */}
          <div style={{ gridColumn: "span 12" }}>
            <div
              style={{
                gridColumn: "span 12",
                backgroundColor: "#1a1a1a",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <h2
                style={{
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontFamily: "monospace",
                  marginBottom: "0.5rem",
                }}
              >
                KEYBOARD
              </h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                {notes.map((note) => (
                  <NoteButton
                    key={note}
                    note={note}
                    size={60}
                    isPressed={activeNotes.has(note)}
                    onNoteOn={playNote}
                    onNoteOff={stopNote}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "0.8rem",
                fontFamily: "monospace",
                color: "#888888",
              }}
            >
              Use keyboard: A S D F G H J K (white keys) | W E T Y U O P (black
              keys)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
