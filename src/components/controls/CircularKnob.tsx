import { useRef, useCallback, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { COLORS, SHADOWS, TRANSITIONS, FONTS } from "../../constants/styles";
import type { KnobProps } from "../../types/synth";
import { clamp, normalize, degreesToRadians } from "../../utils/math";

const KnobContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const KnobLabel = styled.div`
  font-family: ${FONTS.mono};
  font-size: 0.75rem;
  color: ${COLORS.text.muted};
  margin-bottom: 0.5rem;
`;

const KnobValue = styled.div`
  font-family: ${FONTS.mono};
  font-size: 1.125rem;
  color: ${COLORS.text.muted};
  margin-top: 0.5rem;
`;

const KnobSvg = styled.svg`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const KnobHandle = styled.div<{ rotation: number }>`
  position: absolute;
  width: 70%;
  height: 70%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(${(props) => props.rotation}deg);
  border-radius: 50%;
  background-color: ${COLORS.background.medium};
  box-shadow: ${SHADOWS.knob};
  transition: ${TRANSITIONS.fast};
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    width: 3px;
    height: 40%;
    background-color: ${COLORS.text.primary};
    left: 50%;
    top: 8px;
    margin-left: -1.5px;
    border-radius: 1.5px;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  }
`;

export const CircularKnob: React.FC<KnobProps> = ({
  min = 0,
  max = 100,
  initialValue = 50,
  size = 120,
  knobColor = COLORS.background.medium,
  backgroundColor = COLORS.background.dark,
  tickColor = COLORS.control.tick,
  valueColor = COLORS.text.muted,
  minAngle = -135,
  maxAngle = 135,
  showTicks = true,
  showMinMax = true,
  showValue = true,
  label = "",
  onChange = () => {},
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startValueRef = useRef(initialValue);
  const currentValueRef = useRef(initialValue);
  const lastUpdateTimeRef = useRef(0);
  const [rotation, setRotation] = useState(
    normalize(initialValue, min, max, minAngle, maxAngle)
  );

  const handleValueChange = useCallback(
    (clientY: number) => {
      const deltaY = startYRef.current - clientY;
      const sensitivity = (max - min) / 200;
      const newValue = clamp(
        startValueRef.current + deltaY * sensitivity,
        min,
        max
      );

      currentValueRef.current = newValue;
      setRotation(normalize(newValue, min, max, minAngle, maxAngle));

      const now = Date.now();
      if (now - lastUpdateTimeRef.current > 33) {
        lastUpdateTimeRef.current = now;
        onChange(newValue);
      }
    },
    [min, max, minAngle, maxAngle, onChange]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startValueRef.current = currentValueRef.current;
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleValueChange(e.clientY);
      }
    },
    [handleValueChange]
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      onChange(currentValueRef.current);
    }
  }, [onChange]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
    startValueRef.current = currentValueRef.current;
    e.preventDefault();
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDraggingRef.current) {
        handleValueChange(e.touches[0].clientY);
      }
    },
    [handleValueChange]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  const renderTicks = () => {
    if (!showTicks) return null;

    const ticks = [];
    const tickCount = 11;

    for (let i = 0; i < tickCount; i++) {
      const angle = minAngle + (i / (tickCount - 1)) * (maxAngle - minAngle);
      const radian = degreesToRadians(angle);
      const isMainTick =
        i === 0 || i === tickCount - 1 || i === Math.floor(tickCount / 2);
      const tickLength = isMainTick ? 8 : 5;
      const tickWidth = isMainTick ? 2 : 1;

      const x1 = size / 2 + (size / 2 - 15) * Math.cos(radian);
      const y1 = size / 2 + (size / 2 - 15) * Math.sin(radian);
      const x2 = size / 2 + (size / 2 - 15 - tickLength) * Math.cos(radian);
      const y2 = size / 2 + (size / 2 - 15 - tickLength) * Math.sin(radian);

      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={tickColor}
          strokeWidth={tickWidth}
        />
      );
    }

    return ticks;
  };

  return (
    <KnobContainer>
      {label && <KnobLabel>{label}</KnobLabel>}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
        }}
      >
        <KnobSvg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill={backgroundColor}
            stroke={tickColor}
            strokeWidth="1"
          />
          {renderTicks()}
        </KnobSvg>

        <KnobHandle
          ref={knobRef}
          rotation={rotation}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            backgroundColor: knobColor,
          }}
        />

        {showMinMax && (
          <>
            <div
              style={{
                position: "absolute",
                color: valueColor,
                left: "10px",
                bottom: "5px",
                fontSize: "0.75rem",
                fontFamily: FONTS.mono,
              }}
            >
              {min}
            </div>
            <div
              style={{
                position: "absolute",
                color: valueColor,
                right: "10px",
                bottom: "5px",
                fontSize: "0.75rem",
                fontFamily: FONTS.mono,
              }}
            >
              {max}
            </div>
          </>
        )}
      </div>

      {showValue && (
        <KnobValue>{Math.round(currentValueRef.current)}</KnobValue>
      )}
    </KnobContainer>
  );
};
