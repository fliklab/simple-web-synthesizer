import { useEffect } from "react";

/**
 * 모바일에서 핀치 줌/제스처 확대/축소를 완전히 방지하는 커스텀 훅
 * (iOS, Android, 크로스브라우징 대응)
 */
export function usePreventPinchZoom() {
  useEffect(() => {
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };
    document.addEventListener("gesturestart", preventGesture);
    document.addEventListener("gesturechange", preventGesture);
    document.addEventListener("gestureend", preventGesture);
    // 터치로 인한 더블탭 확대 방지 (iOS)
    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 350) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);
}
