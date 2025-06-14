import React, { useState, useCallback } from "react";
import styled from "@emotion/styled";
import type { NoteButtonProps } from "../../types/synth";
import { COLORS, TRANSITIONS } from "../../constants/styles";

const Button = styled.button<{
  size: number;
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
}>`
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) =>
    props.isActive ? props.activeColor : props.inactiveColor};
  border-radius: 50%;
  border: 3px solid ${COLORS.border};
  box-shadow: ${(props) =>
    props.isActive
      ? `inset 0 4px 8px rgba(0,0,0,0.5), 0 0 20px ${props.activeColor}66`
      : `inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)`};
  transform: ${(props) =>
    props.isActive ? "translateY(2px)" : "translateY(0)"};
  transition: ${TRANSITIONS.fast};
  cursor: pointer;
  outline: none;
  user-select: none;
`;

const Label = styled.div<{ labelColor: string }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  color: ${(props) => props.labelColor};
`;

const Highlight = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  height: 30%;
  background: ${(props) =>
    props.isActive
      ? "none"
      : "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)"};
  border-radius: 50%;
`;

export const NoteButton: React.FC<NoteButtonProps> = ({
  note,
  size = 50,
  activeColor = COLORS.primary,
  inactiveColor = COLORS.background.light,
  labelColor = COLORS.text.secondary,
  isPressed = false,
  onNoteOn = () => {},
  onNoteOff = () => {},
}) => {
  const [isMouseActive, setIsMouseActive] = useState(false);
  const isActive = isMouseActive || isPressed;

  const handleMouseDown = useCallback(() => {
    setIsMouseActive(true);
    onNoteOn(note);
  }, [note, onNoteOn]);

  const handleMouseUp = useCallback(() => {
    setIsMouseActive(false);
    onNoteOff(note);
  }, [note, onNoteOff]);

  const handleMouseLeave = useCallback(() => {
    if (isMouseActive) {
      setIsMouseActive(false);
      onNoteOff(note);
    }
  }, [isMouseActive, note, onNoteOff]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsMouseActive(true);
      onNoteOn(note);
    },
    [note, onNoteOn]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsMouseActive(false);
      onNoteOff(note);
    },
    [note, onNoteOff]
  );

  return (
    <Button
      size={size}
      isActive={isActive}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Label labelColor={labelColor}>{note}</Label>
      <Highlight isActive={isActive} />
    </Button>
  );
};
