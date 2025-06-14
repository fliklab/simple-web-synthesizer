import { useEffect, useState, useCallback } from "react";
import * as Tone from "tone";

export interface AudioContextHook {
  isAudioEnabled: boolean;
  contextState: string | null;
  enableAudio: () => Promise<void>;
  checkAudioSupport: () => boolean;
}

export const useAudioContext = (): AudioContextHook => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [contextState, setContextState] = useState<string | null>(null);

  const checkAudioSupport = useCallback(() => {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }, []);

  const enableAudio = useCallback(async () => {
    try {
      if (Tone.getContext().state === "suspended") {
        await Tone.start();
      }

      // AudioContext 상태 확인
      const context = Tone.getContext();
      setContextState(context.state);

      if (context.state === "running") {
        setIsAudioEnabled(true);
        console.log("✅ 오디오가 성공적으로 활성화되었습니다.");
      } else {
        console.warn(
          "⚠️ AudioContext가 여전히 suspended 상태입니다:",
          context.state
        );
      }
    } catch (error) {
      console.error("❌ 오디오 활성화 실패:", error);
      setIsAudioEnabled(false);
    }
  }, []);

  useEffect(() => {
    // 초기 AudioContext 상태 확인
    const context = Tone.getContext();
    setContextState(context.state);
    setIsAudioEnabled(context.state === "running");

    // AudioContext 상태 변경 모니터링을 위한 인터벌 체크
    const checkContextState = () => {
      const newState = context.state;
      if (newState !== contextState) {
        setContextState(newState);
        setIsAudioEnabled(newState === "running");
        console.log("🔊 AudioContext 상태 변경:", newState);
      }
    };

    const intervalId = setInterval(checkContextState, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [contextState]);

  return {
    isAudioEnabled,
    contextState,
    enableAudio,
    checkAudioSupport,
  };
};
