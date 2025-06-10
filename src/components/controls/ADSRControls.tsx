import React from "react";
import styled from "@emotion/styled";
import { COLORS } from "../../constants/styles";

interface ADSRControlsProps {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  onAttackChange: (value: number) => void;
  onDecayChange: (value: number) => void;
  onSustainChange: (value: number) => void;
  onReleaseChange: (value: number) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: ${COLORS.background.light};
  border-radius: 8px;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: ${COLORS.text.primary};
`;

const Slider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: ${COLORS.control.inactive};
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${COLORS.control.active};
    cursor: pointer;
  }
`;

const Value = styled.span`
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: ${COLORS.text.muted};
`;

export const ADSRControls: React.FC<ADSRControlsProps> = ({
  attack,
  decay,
  sustain,
  release,
  onAttackChange,
  onDecayChange,
  onSustainChange,
  onReleaseChange,
}) => {
  return (
    <Container>
      <ControlGroup>
        <Label>Attack</Label>
        <Slider
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={attack}
          onChange={(e) => onAttackChange(parseFloat(e.target.value))}
        />
        <Value>{attack.toFixed(2)}s</Value>
      </ControlGroup>

      <ControlGroup>
        <Label>Decay</Label>
        <Slider
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={decay}
          onChange={(e) => onDecayChange(parseFloat(e.target.value))}
        />
        <Value>{decay.toFixed(2)}s</Value>
      </ControlGroup>

      <ControlGroup>
        <Label>Sustain</Label>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sustain}
          onChange={(e) => onSustainChange(parseFloat(e.target.value))}
        />
        <Value>{(sustain * 100).toFixed(0)}%</Value>
      </ControlGroup>

      <ControlGroup>
        <Label>Release</Label>
        <Slider
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={release}
          onChange={(e) => onReleaseChange(parseFloat(e.target.value))}
        />
        <Value>{release.toFixed(2)}s</Value>
      </ControlGroup>
    </Container>
  );
};
