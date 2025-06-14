import React from "react";
import styled from "@emotion/styled";
import { COLORS, FONTS } from "../../constants/styles";
import { lockBodyScroll, unlockBodyScroll } from "../../utils/lockBodyScroll";

const Button = styled.button<{ isEnabled: boolean }>`
  background: ${({ isEnabled }) =>
    isEnabled
      ? `linear-gradient(135deg, ${COLORS.tertiary} 0%, ${COLORS.primary} 100%)`
      : `linear-gradient(135deg, ${COLORS.secondary} 0%, #cc0000 100%)`};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: ${FONTS.mono};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusText = styled.div<{ isEnabled: boolean }>`
  font-family: ${FONTS.mono};
  font-size: 0.75rem;
  color: ${({ isEnabled }) => (isEnabled ? COLORS.tertiary : COLORS.secondary)};
  margin-top: 4px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

interface AudioEnableButtonProps {
  isAudioEnabled: boolean;
  contextState: string | null;
  onEnableAudio: () => Promise<void>;
  isLoading?: boolean;
}

export const AudioEnableButton: React.FC<AudioEnableButtonProps> = ({
  isAudioEnabled,
  contextState,
  onEnableAudio,
  isLoading = false,
}) => {
  const getButtonText = () => {
    if (isLoading) return "오디오 활성화 중...";
    if (isAudioEnabled) return "🔊 오디오 활성화됨";
    return "🔇 오디오 활성화";
  };

  const getStatusText = () => {
    if (isLoading) return "잠시만 기다려주세요...";
    if (isAudioEnabled) return `상태: ${contextState}`;
    return `상태: ${contextState || "확인 중"} (터치해서 활성화)`;
  };

  return (
    <Container>
      <Button
        isEnabled={isAudioEnabled}
        onClick={onEnableAudio}
        disabled={isLoading}
        onMouseDown={lockBodyScroll}
        onMouseUp={unlockBodyScroll}
        onMouseLeave={unlockBodyScroll}
        onTouchStart={lockBodyScroll}
        onTouchEnd={unlockBodyScroll}
        onTouchCancel={unlockBodyScroll}
      >
        {getButtonText()}
      </Button>
      <StatusText isEnabled={isAudioEnabled}>{getStatusText()}</StatusText>
    </Container>
  );
};
