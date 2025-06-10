import { useCallback } from "react";
import styled from "@emotion/styled";
import { COLORS, SHADOWS, TRANSITIONS, FONTS } from "../constants/styles";

interface NoteButtonProps {
  note: string;
  isPressed: boolean;
  onNoteOn: (note: string) => void;
  onNoteOff: (note: string) => void;
}

const Button = styled.button<{ isPressed: boolean; isSharp: boolean }>`
  position: relative;
  width: ${(props) => (props.isSharp ? "40px" : "60px")};
  height: ${(props) => (props.isSharp ? "120px" : "180px")};
  background-color: ${(props) =>
    props.isSharp
      ? props.isPressed
        ? COLORS.background.light
        : COLORS.background.dark
      : props.isPressed
      ? COLORS.background.medium
      : COLORS.text.primary};
  border: 2px solid ${COLORS.background.dark};
  border-radius: 0 0 4px 4px;
  margin: ${(props) => (props.isSharp ? "0 -20px" : "0")};
  z-index: ${(props) => (props.isSharp ? 1 : 0)};
  box-shadow: ${(props) =>
    props.isPressed
      ? SHADOWS.button.active(COLORS.primary)
      : SHADOWS.button.inactive};
  transition: ${TRANSITIONS.fast};
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: ${(props) =>
      props.isSharp ? COLORS.background.light : COLORS.background.medium};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const NoteLabel = styled.div<{ isSharp: boolean }>`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${FONTS.mono};
  font-size: 0.75rem;
  color: ${(props) =>
    props.isSharp ? COLORS.text.primary : COLORS.background.dark};
`;

export const NoteButton: React.FC<NoteButtonProps> = ({
  note,
  isPressed,
  onNoteOn,
  onNoteOff,
}) => {
  const isSharp = note.includes("#");

  const handleMouseDown = useCallback(() => {
    onNoteOn(note);
  }, [note, onNoteOn]);

  const handleMouseUp = useCallback(() => {
    onNoteOff(note);
  }, [note, onNoteOff]);

  const handleMouseLeave = useCallback(() => {
    if (isPressed) {
      onNoteOff(note);
    }
  }, [isPressed, note, onNoteOff]);

  return (
    <Button
      isPressed={isPressed}
      isSharp={isSharp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <NoteLabel isSharp={isSharp}>{note}</NoteLabel>
    </Button>
  );
};
