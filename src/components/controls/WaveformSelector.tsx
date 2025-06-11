import React from "react";
import styled from "@emotion/styled";
import { COLORS, SHADOWS } from "../../constants/styles";
import type { WaveformType, WaveformSelectorProps } from "../../types/synth";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: ${COLORS.background.dark};
`;
const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const WaveformButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${(props) =>
    props.isSelected ? COLORS.primary : COLORS.background.medium};
  border-radius: 4px;
  box-shadow: ${(props) =>
    props.isSelected
      ? SHADOWS.button.active(COLORS.primary)
      : SHADOWS.button.inactive};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.isSelected ? COLORS.primary : COLORS.background.light};
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: ${COLORS.text.primary};
    stroke-width: 2;
    fill: none;
  }
`;

const WAVEFORMS: WaveformType[] = ["sine", "square", "sawtooth", "triangle"];

export const WaveformSelector: React.FC<WaveformSelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <Container>
      <InnerContainer>
        {WAVEFORMS.map((type) => (
          <WaveformButton
            key={type}
            isSelected={selected === type}
            onClick={() => onChange(type)}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
          >
            <svg viewBox="0 0 40 40">
              {type === "sine" && (
                <path d="M 5,20 Q 15,5 20,20 Q 25,35 35,20" />
              )}
              {type === "square" && (
                <path d="M 5,35 L 5,5 L 20,5 L 20,35 L 35,35 L 35,5" />
              )}
              {type === "sawtooth" && (
                <path d="M 5,35 L 5,5 L 20,35 L 20,5 L 35,35 L 35,5" />
              )}
              {type === "triangle" && (
                <path d="M 5,20 L 13,5 L 28,35 L 35,20" />
              )}
            </svg>
          </WaveformButton>
        ))}
      </InnerContainer>
    </Container>
  );
};
