let lockCount = 0;
let activeTouchCount = 0;

export function lockBodyScroll() {
  lockCount++;
  if (lockCount === 1) {
    document.body.style.overscrollBehavior = "contain";
    document.body.style.touchAction = "none";
  }
}

export function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overscrollBehavior = "";
    document.body.style.touchAction = "";
  }
}

// 멀티터치용
export function lockBodyScrollForTouch() {
  activeTouchCount++;
  if (activeTouchCount === 1) lockBodyScroll();
}

export function unlockBodyScrollForTouch() {
  activeTouchCount = Math.max(0, activeTouchCount - 1);
  if (activeTouchCount === 0) unlockBodyScroll();
}
