import { useState } from "react";
import styled from "@emotion/styled";
import { COLORS, SHADOWS, TRANSITIONS, FONTS } from "../../constants/styles";
import type { ToggleButtonProps } from "../../types/synth";

const Button = styled.button<{ isOn: boolean; size: number; onColor: string }>`
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) =>
    props.isOn ? props.onColor : COLORS.control.inactive};
  border-radius: 8px;
  border: 2px solid ${COLORS.background.dark};
  box-shadow: ${(props) =>
    props.isOn
      ? `${SHADOWS.button.active(props.onColor)}`
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

const ButtonLabel = styled.div<{ color: string }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${FONTS.mono};
  font-size: 0.75rem;
  font-weight: bold;
  color: ${(props) => props.color};
`;

const ButtonHighlight = styled.div<{ isOn: boolean }>`
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  height: 30%;
  background: ${(props) =>
    props.isOn
      ? "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)"
      : "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)"};
  border-radius: 4px;
`;

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  size = 60,
  label = "",
  onColor = COLORS.primary,
  labelColor = COLORS.text.secondary,
  initialState = false,
  onChange = () => {},
}) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleClick = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange(newState);
  };

  return (
    <Button isOn={isOn} size={size} onColor={onColor} onClick={handleClick}>
      {label && <ButtonLabel color={labelColor}>{label}</ButtonLabel>}
      <ButtonHighlight isOn={isOn} />
    </Button>
  );
};
