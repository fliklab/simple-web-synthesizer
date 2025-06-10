import { useState } from "react";
import styled from "@emotion/styled";
import { COLORS, SHADOWS, TRANSITIONS, FONTS } from "../../constants/styles";
import type { WaveformSelectorProps } from "../../types/synth";
import { DEFAULT_WAVEFORMS } from "../../constants/synth";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.div`
  font-family: ${FONTS.mono};
  font-size: 0.75rem;
  color: ${COLORS.text.muted};
  margin-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const WaveformButton = styled.button<{ isSelected: boolean }>`
  position: relative;
  width: 50px;
  height: 40px;
  background-color: ${(props) =>
    props.isSelected ? COLORS.primary : COLORS.control.inactive};
  border-radius: 4px;
  border: 2px solid ${COLORS.background.dark};
  box-shadow: ${(props) =>
    props.isSelected
      ? SHADOWS.button.active(COLORS.primary)
      : SHADOWS.button.inactive};
  transition: ${TRANSITIONS.normal};
  cursor: pointer;
  outline: none;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const WaveformPath = styled.path<{ isSelected: boolean }>`
  fill: none;
  stroke: ${(props) =>
    props.isSelected ? COLORS.text.primary : COLORS.text.muted};
  stroke-width: 2;
`;

export const WaveformSelector: React.FC<WaveformSelectorProps> = ({
  options = DEFAULT_WAVEFORMS,
  initialValue = "sine",
  onChange = () => {},
}) => {
  const [selected, setSelected] = useState(initialValue);

  const handleSelect = (option: (typeof options)[number]) => {
    setSelected(option);
    onChange(option);
  };

  const getWaveformPath = (type: (typeof options)[number]) => {
    switch (type) {
      case "sine":
        return "M 0,15 Q 7.5,5 15,15 T 30,15";
      case "triangle":
        return "M 0,25 L 7.5,5 L 22.5,5 L 30,25";
      case "sawtooth":
        return "M 0,25 L 20,5 L 20,25 M 20,5 L 30,25";
      case "square":
        return "M 0,25 L 0,5 L 15,5 L 15,25 L 30,25";
      default:
        return "";
    }
  };

  return (
    <Container>
      <Label>Waveform</Label>
      <ButtonGroup>
        {options.map((option) => (
          <WaveformButton
            key={option}
            isSelected={selected === option}
            onClick={() => handleSelect(option)}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              style={{
                position: "absolute",
                inset: 0,
                margin: "auto",
                pointerEvents: "none",
              }}
            >
              <WaveformPath
                d={getWaveformPath(option)}
                isSelected={selected === option}
              />
            </svg>
          </WaveformButton>
        ))}
      </ButtonGroup>
    </Container>
  );
};
