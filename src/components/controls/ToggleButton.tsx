import React, { useState } from "react";
import styled from "@emotion/styled";
import { COLORS, SHADOWS } from "../../constants/styles";

const Button = styled.button<{ isOn: boolean; size: number }>`
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) =>
    props.isOn ? COLORS.primary : COLORS.background.medium};
  border-radius: 8px;
  border: 2px solid ${COLORS.border};
  box-shadow: ${(props) =>
    props.isOn
      ? SHADOWS.button.active(COLORS.primary)
      : SHADOWS.button.inactive};
  transition: all 0.2s ease;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: ${(props) =>
      props.isOn ? COLORS.primary : COLORS.background.light};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Label = styled.div<{ size: number }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Space Mono", monospace;
  font-size: ${(props) => props.size}px;
  color: ${COLORS.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  user-select: none;
`;

const Highlight = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  height: 30%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0)
  );
  border-radius: 4px 4px 0 0;
  pointer-events: none;
`;

interface ToggleButtonProps {
  label: string;
  size?: number;
  fontSize?: number;
  onColor?: string;
  offColor?: string;
  labelColor?: string;
  initialState?: boolean;
  onChange?: (state: boolean) => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  size = 60,
  fontSize,
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
    <Button isOn={isOn} onClick={handleClick} size={size}>
      <Highlight />
      <Label size={fontSize ?? size / 3}>{label}</Label>
    </Button>
  );
};
