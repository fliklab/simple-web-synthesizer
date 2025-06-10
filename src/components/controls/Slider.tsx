import styled from "@emotion/styled";
import { useCallback, useEffect, useRef, useState } from "react";
import { COLORS } from "../../constants/styles";

const SliderContainer = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  cursor: pointer;
  margin: 0 auto;
`;

const SliderTrack = styled.div<{
  orientation: "horizontal" | "vertical";
  thickness: number;
  trackColor: string;
}>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: ${(props) =>
    props.orientation === "horizontal" ? "100%" : `${props.thickness}px`};
  height: ${(props) =>
    props.orientation === "horizontal" ? `${props.thickness}px` : "100%"};
  background-color: ${(props) => props.trackColor};
  border-radius: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const SliderHandle = styled.div<{
  orientation: "horizontal" | "vertical";
  thickness: number;
  handleColor: string;
  position: number;
}>`
  position: absolute;
  left: 50%;
  width: ${(props) => props.thickness}px;
  height: ${(props) => props.thickness}px;
  background-color: ${(props) => props.handleColor};
  border-radius: 4px;
  border: 1px solid ${COLORS.border};
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.5);
  transform: ${(props) =>
    props.orientation === "horizontal"
      ? `translate(-50%, ${props.position}px)`
      : `translate(-50%, ${props.position}px)`};
  transition: transform 0.1s ease;

  &:hover {
    transform: ${(props) =>
      props.orientation === "horizontal"
        ? `translate(-50%, ${props.position}px) scale(0.98)`
        : `translate(-50%, ${props.position}px) scale(0.98)`};
  }
`;

interface SliderProps {
  min?: number;
  max?: number;
  initialValue?: number;
  orientation?: "horizontal" | "vertical";
  length?: number;
  thickness?: number;
  handleColor?: string;
  trackColor?: string;
  tickColor?: string;
  valueColor?: string;
  showTicks?: boolean;
  showValue?: boolean;
  label?: string;
  onChange?: (value: number) => void;
}

export default function Slider({
  min = 0,
  max = 100,
  initialValue = 50,
  orientation = "vertical",
  length = 200,
  thickness = 20,
  handleColor = COLORS.control.inactive,
  trackColor = COLORS.control.track,
  //   tickColor = COLORS.control.tick,
  valueColor = COLORS.text.muted,
  //   showTicks = true,
  showValue = true,
  label = "",
  onChange = () => {},
}: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const currentValueRef = useRef(initialValue);
  const lastUpdateTimeRef = useRef(0);
  const [internalValue, setInternalValue] = useState(initialValue);

  const valueToPosition = useCallback(
    (value: number) => {
      const normalized = (value - min) / (max - min);
      const position = normalized * (length - thickness);
      return orientation === "vertical"
        ? length - thickness - position
        : position;
    },
    [min, max, length, thickness, orientation]
  );

  const positionToValue = useCallback(
    (position: number) => {
      let normalized;
      if (orientation === "vertical") {
        normalized = 1 - position / (length - thickness);
      } else {
        normalized = position / (length - thickness);
      }
      normalized = Math.max(0, Math.min(1, normalized));
      return min + normalized * (max - min);
    },
    [min, max, length, thickness, orientation]
  );

  const handleValueChange = useCallback(
    (clientPos: number) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      let pos;

      if (orientation === "horizontal") {
        pos = clientPos - rect.left - thickness / 2;
      } else {
        pos = clientPos - rect.top - thickness / 2;
      }

      pos = Math.max(0, Math.min(length - thickness, pos));
      const newValue = positionToValue(pos);
      currentValueRef.current = newValue;

      const now = Date.now();
      if (now - lastUpdateTimeRef.current > 16) {
        lastUpdateTimeRef.current = now;
        setInternalValue(newValue);
        onChange(newValue);
      }
    },
    [length, thickness, orientation, positionToValue, onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      handleValueChange(orientation === "horizontal" ? e.clientX : e.clientY);
      e.preventDefault();
    },
    [handleValueChange, orientation]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleValueChange(orientation === "horizontal" ? e.clientX : e.clientY);
      }
    },
    [handleValueChange, orientation]
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setInternalValue(currentValueRef.current);
      onChange(currentValueRef.current);
    }
  }, [onChange]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const width = orientation === "horizontal" ? length : thickness;
  const height = orientation === "horizontal" ? thickness : length;

  return (
    <div className="flex flex-col flex-1 items-center">
      {label && (
        <div className="text-xs font-mono mb-2" style={{ color: valueColor }}>
          {label}
        </div>
      )}
      <SliderContainer
        ref={sliderRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
      >
        <SliderTrack
          orientation={orientation}
          thickness={thickness}
          trackColor={trackColor}
        />
        <SliderHandle
          orientation={orientation}
          thickness={thickness}
          handleColor={handleColor}
          position={valueToPosition(internalValue)}
        />
      </SliderContainer>
      {showValue && (
        <div className="mt-2 text-sm font-mono" style={{ color: valueColor }}>
          {internalValue.toFixed(1)}
        </div>
      )}
    </div>
  );
}
