import React, { useState } from "react";
import styled from "@emotion/styled";
import { COLORS, SHADOWS, FONTS } from "../constants/styles";
import { NOTES } from "../constants/synth";
import { useSynth } from "../hooks/useSynth";
import { useKeyboard } from "../hooks/useKeyboard";
import { CircularKnob } from "./controls/CircularKnob";
import Slider from "./controls/Slider";
import { ToggleButton } from "./controls/ToggleButton";
import { NoteButton } from "./controls/NoteButton";
import { WaveformSelector } from "./controls/WaveformSelector";
import { ADSRVisualizer } from "./visualizers/ADSRVisualizer";
import { Oscilloscope } from "./visualizers/Oscilloscope";
import type { SynthParams } from "../types/synth";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${COLORS.background.dark};
  border-radius: 16px;
  box-shadow: ${SHADOWS.knob};
`;

const Title = styled.h1`
  font-family: ${FONTS.mono};
  font-size: 2rem;
  color: ${COLORS.text.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${COLORS.background.medium};
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-family: ${FONTS.mono};
  font-size: 1rem;
  color: ${COLORS.text.secondary};
  margin-bottom: 1rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const KeyboardSection = styled(Section)`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
  padding: 1rem;
`;

export const RetroSynth = () => {
  const {
    activeNotes,
    analyser,
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
  } = useSynth();

  useKeyboard({
    onNoteOn: playNote,
    onNoteOff: stopNote,
    activeNotes,
  });

  const [adsr, setADSR] = useState<SynthParams["envelope"]>({
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.5,
  });

  const handleADSRChange = (envelope: Partial<SynthParams["envelope"]>) => {
    setADSR((prev) => ({ ...prev, ...envelope }));
    updateEnvelope(envelope);
  };

  return (
    <Container>
      <Title>Retro Synth</Title>
      <Controls>
        <Section>
          <SectionTitle>Oscillator</SectionTitle>
          <WaveformSelector onChange={updateOscillator} />
          <CircularKnob
            label="Volume"
            min={-60}
            max={0}
            initialValue={-10}
            onChange={updateVolume}
          />
        </Section>

        <Section>
          <SectionTitle>Envelope</SectionTitle>
          <Row>
            <Slider
              label="Attack"
              min={0}
              max={2}
              initialValue={0.1}
              onChange={(value) => handleADSRChange({ attack: value })}
            />
            <Slider
              label="Decay"
              min={0}
              max={2}
              initialValue={0.2}
              onChange={(value) => handleADSRChange({ decay: value })}
            />
          </Row>
          <Row>
            <Slider
              label="Sustain"
              min={0}
              max={1}
              initialValue={0.5}
              onChange={(value) => handleADSRChange({ sustain: value })}
            />
            <Slider
              label="Release"
              min={0}
              max={2}
              initialValue={0.5}
              onChange={(value) => handleADSRChange({ release: value })}
            />
          </Row>
          <ADSRVisualizer
            attack={adsr.attack}
            decay={adsr.decay}
            sustain={adsr.sustain}
            release={adsr.release}
          />
        </Section>

        <Section>
          <SectionTitle>Filter</SectionTitle>
          <CircularKnob
            label="Frequency"
            min={20}
            max={20000}
            initialValue={1000}
            onChange={updateFilter}
          />
          <ToggleButton
            label="Enable"
            initialState={filterEnabled}
            onColor={COLORS.secondary}
            onChange={updateFilterEnabled}
          />
        </Section>

        <Section>
          <SectionTitle>Reverb</SectionTitle>
          <CircularKnob
            label="Mix"
            min={0}
            max={1}
            initialValue={0.3}
            onChange={updateReverb}
          />
          <ToggleButton
            label="Enable"
            initialState={reverbEnabled}
            onColor={COLORS.tertiary}
            onChange={updateReverbEnabled}
          />
        </Section>

        <Section>
          <SectionTitle>Output</SectionTitle>
          <Oscilloscope analyser={analyser} />
        </Section>
      </Controls>

      <KeyboardSection>
        {NOTES.map((note) => (
          <NoteButton
            key={note}
            note={note}
            isPressed={activeNotes.has(note)}
            onNoteOn={playNote}
            onNoteOff={stopNote}
          />
        ))}
      </KeyboardSection>
    </Container>
  );
};
