import { NoteButton } from "./controls/NoteButton";

interface NoteButtonProps {
  note: string;
  isPressed: boolean;
  onNoteOn: (note: string) => void;
  onNoteOff: (note: string) => void;
}

export const NoteButtonSimplified: React.FC<NoteButtonProps> = ({
  note,
  isPressed,
  onNoteOn,
  onNoteOff,
}) => {
  return (
    <NoteButton
      note={note}
      isPressed={isPressed}
      onNoteOn={onNoteOn}
      onNoteOff={onNoteOff}
    />
  );
};
