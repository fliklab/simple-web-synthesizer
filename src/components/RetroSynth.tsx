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
import type { SynthParams, WaveformType, FilterType } from "../types/synth";

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

const MainControls = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  justify-content: center;
  align-items: center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: ${COLORS.background.medium};
  border-radius: 8px;
`;

const Section520 = styled(Section)`
  min-height: 520px;
`;

const Row = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`;

const SectionTitle = styled.h2`
  font-family: ${FONTS.mono};
  font-size: 1rem;
  color: ${COLORS.text.secondary};
  margin-bottom: 1rem;
  text-align: center;
`;

// const MainColumn = styled(Column)`
//   display: flex;
//   flex-direction: column;
//   gap: 2rem;
// `;

// const SideColumn = styled(Column)`
//   display: flex;
//   flex-direction: column;
//   gap: 2rem;
// `;

const KeyboardSection = styled(Section)`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  gap: 0.5rem;
  padding: 1rem;
`;

export const RetroSynth: React.FC = () => {
  const [synthParams, setSynthParams] = useState<SynthParams>({
    oscillator: {
      type: "sine",
      volume: 0,
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.5,
    },
    filter: {
      frequency: 1000,
      type: "lowpass",
      Q: 1,
    },
    reverb: {
      mix: 0,
    },
  });

  const { synth, analyser } = useSynth(synthParams);
  const { activeNotes } = useKeyboard(synth);

  const handleOscillatorTypeChange = (type: WaveformType) => {
    setSynthParams((prev) => ({
      ...prev,
      oscillator: { ...prev.oscillator, type },
    }));
  };

  const handleVolumeChange = (volume: number) => {
    setSynthParams((prev) => ({
      ...prev,
      oscillator: { ...prev.oscillator, volume },
    }));
  };

  const handleEnvelopeChange = (param: string, value: number) => {
    setSynthParams((prev) => ({
      ...prev,
      envelope: { ...prev.envelope, [param]: value },
    }));
  };

  const handleFilterChange = (param: string, value: number | FilterType) => {
    setSynthParams((prev) => ({
      ...prev,
      filter: { ...prev.filter, [param]: value },
    }));
  };

  const handleReverbMixChange = (mix: number) => {
    setSynthParams((prev) => ({
      ...prev,
      reverb: { ...prev.reverb, mix },
    }));
  };

  return (
    <Container>
      <Title>Retro Synth</Title>
      <MainControls>
        <Row>
          <Section520>
            <SectionTitle>Oscillator</SectionTitle>
            <Column>
              <WaveformSelector
                selected={synthParams.oscillator.type}
                onChange={handleOscillatorTypeChange}
              />
              <CircularKnob
                label="Volume"
                min={-60}
                max={0}
                initialValue={synthParams.oscillator.volume}
                onChange={handleVolumeChange}
              />
            </Column>
          </Section520>
          <Section520>
            <SectionTitle>Envelope</SectionTitle>
            <Row>
              <Column>
                <ADSRVisualizer
                  attack={synthParams.envelope.attack}
                  decay={synthParams.envelope.decay}
                  sustain={synthParams.envelope.sustain}
                  release={synthParams.envelope.release}
                  width={300}
                  height={120}
                />
                <Row>
                  <Slider
                    label="Attack"
                    min={0}
                    max={2}
                    initialValue={synthParams.envelope.attack}
                    onChange={(value) => handleEnvelopeChange("attack", value)}
                  />
                  <Slider
                    label="Decay"
                    min={0}
                    max={2}
                    initialValue={synthParams.envelope.decay}
                    onChange={(value) => handleEnvelopeChange("decay", value)}
                  />
                  <Slider
                    label="Sustain"
                    min={0}
                    max={1}
                    initialValue={synthParams.envelope.sustain}
                    onChange={(value) => handleEnvelopeChange("sustain", value)}
                  />
                  <Slider
                    label="Release"
                    min={0}
                    max={2}
                    initialValue={synthParams.envelope.release}
                    onChange={(value) => handleEnvelopeChange("release", value)}
                  />
                </Row>
              </Column>
            </Row>
          </Section520>

          <Section520>
            <SectionTitle>Filter</SectionTitle>
            <Column>
              <ToggleButton
                label="LP/HP"
                initialState={synthParams.filter.type === "highpass"}
                onChange={(isHighPass) =>
                  handleFilterChange(
                    "type",
                    isHighPass ? "highpass" : "lowpass"
                  )
                }
              />
              <CircularKnob
                label="Frequency"
                min={20}
                max={20000}
                initialValue={synthParams.filter.frequency}
                onChange={(value) => handleFilterChange("frequency", value)}
                logScale
              />
              <CircularKnob
                label="Q"
                min={0.1}
                max={10}
                initialValue={synthParams.filter.Q}
                onChange={(value) => handleFilterChange("Q", value)}
              />
            </Column>
          </Section520>
          <Section520>
            <SectionTitle>Output</SectionTitle>
            <Column>
              <Oscilloscope analyser={analyser} width={200} height={80} />
              <CircularKnob
                label="Reverb"
                min={0}
                max={1}
                initialValue={synthParams.reverb.mix}
                onChange={handleReverbMixChange}
              />
            </Column>
          </Section520>
        </Row>
      </MainControls>
      <KeyboardSection>
        {NOTES.map((note) => (
          <NoteButton
            key={note}
            note={note}
            isPressed={activeNotes.has(note)}
          />
        ))}
      </KeyboardSection>
    </Container>
  );
};
