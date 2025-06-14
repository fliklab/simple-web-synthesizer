import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { COLORS, SHADOWS, FONTS } from "../../constants/styles";
import type { CircularKnobProps } from "../../types/synth";
import { lockBodyScroll, unlockBodyScroll } from "../../utils/lockBodyScroll";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const KnobContainer = styled.div<{ size: number }>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  cursor: pointer;
`;

const Knob = styled.div<{ rotation: number; indicatorColor: string }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: ${COLORS.background.medium};
  border: 2px solid ${COLORS.border};
  box-shadow: ${SHADOWS.knob};
  transform: rotate(${(props) => props.rotation}deg);
  transition: transform 0.1s ease;

  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 50%;
    width: 2px;
    height: 12px;
    background-color: ${({ indicatorColor }) => indicatorColor};
    transform: translateX(-50%);
  }

  &:hover {
    background-color: ${COLORS.background.light};
  }
`;

const Label = styled.div`
  font-family: ${FONTS.mono};
  font-size: 0.75rem;
  color: ${COLORS.text.muted};
  text-align: center;
`;

const Value = styled.div`
  font-family: ${FONTS.mono};
  font-size: 0.875rem;
  color: ${COLORS.text.primary};
  text-align: center;
`;

export const CircularKnob: React.FC<CircularKnobProps> = ({
  label = "",
  size = 60,
  min,
  max,
  initialValue,
  indicatorColor = COLORS.text.primary,
  onChange,
  logScale = false,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);
  const [value, setValue] = useState(initialValue);

  const valueToRotation = useCallback(
    (val: number) => {
      const normalized = logScale
        ? Math.log(val / min) / Math.log(max / min)
        : (val - min) / (max - min);
      return normalized * 270 - 135;
    },
    [min, max, logScale]
  );

  const rotationToValue = useCallback(
    (rotation: number) => {
      const normalized = (rotation + 135) / 270;
      const val = logScale
        ? min * Math.pow(max / min, normalized)
        : min + normalized * (max - min);
      return Math.max(min, Math.min(max, val));
    },
    [min, max, logScale]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      startYRef.current = e.clientY;
      startValueRef.current = value;
      lockBodyScroll();
      e.preventDefault();
    },
    [value]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaY = startYRef.current - e.clientY;
      const sensitivity = 1;
      const rotation =
        valueToRotation(startValueRef.current) + deltaY * sensitivity;
      const newValue = rotationToValue(rotation);

      setValue(newValue);
      onChange(newValue);
    },
    [valueToRotation, rotationToValue, onChange]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    unlockBodyScroll();
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      isDraggingRef.current = true;
      startYRef.current = e.touches[0].clientY;
      startValueRef.current = value;
      lockBodyScroll();
    },
    [value]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const deltaY = startYRef.current - e.touches[0].clientY;
      const sensitivity = 1;
      const rotation =
        valueToRotation(startValueRef.current) + deltaY * sensitivity;
      const newValue = rotationToValue(rotation);
      setValue(newValue);
      onChange(newValue);
    },
    [valueToRotation, rotationToValue, onChange]
  );

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    isDraggingRef.current = false;
    unlockBodyScroll();
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    const knob = knobRef.current;
    if (!knob) return;
    knob.addEventListener("touchmove", handleTouchMove, { passive: false });
    knob.addEventListener("touchend", handleTouchEnd, { passive: false });
    knob.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      knob.removeEventListener("touchmove", handleTouchMove);
      knob.removeEventListener("touchend", handleTouchEnd);
      knob.removeEventListener("touchcancel", handleTouchEnd);
      unlockBodyScroll();
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const formatValue = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val.toFixed(1);
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <KnobContainer
        ref={knobRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        size={size}
      >
        <Knob
          rotation={valueToRotation(value)}
          indicatorColor={indicatorColor}
        />
      </KnobContainer>
      <Value>{formatValue(value)}</Value>
    </Container>
  );
};
