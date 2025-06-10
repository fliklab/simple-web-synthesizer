import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { COLORS } from "../../constants/styles";

interface ADSRVisualizerProps {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  gridColor?: string;
  showGrid?: boolean;
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.div`
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: ${COLORS.text.muted};
`;

const Canvas = styled.svg`
  background-color: ${COLORS.background.dark};
  border-radius: 8px;
`;

export const ADSRVisualizer: React.FC<ADSRVisualizerProps> = ({
  attack,
  decay,
  sustain,
  release,
  width = 300,
  height = 150,
  color = COLORS.control.active,
  backgroundColor = COLORS.background.dark,
  gridColor = COLORS.control.tick,
  showGrid = true,
}) => {
  const path = useMemo(() => {
    const padding = 20;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Time scaling
    const totalTime = attack + decay + 1 + release; // +1 for sustain period
    const timeScale = graphWidth / totalTime;

    // Calculate points
    const startPoint = `M ${padding},${height - padding}`;
    const attackPoint = `L ${padding + attack * timeScale},${padding}`;
    const decayPoint = `L ${padding + (attack + decay) * timeScale},${
      padding + (1 - sustain) * graphHeight
    }`;
    const sustainPoint = `L ${padding + (attack + decay + 1) * timeScale},${
      padding + (1 - sustain) * graphHeight
    }`;
    const releasePoint = `L ${
      padding + (attack + decay + 1 + release) * timeScale
    },${height - padding}`;

    return `${startPoint} ${attackPoint} ${decayPoint} ${sustainPoint} ${releasePoint}`;
  }, [attack, decay, sustain, release, width, height]);

  const grid = useMemo(() => {
    if (!showGrid) return null;

    const padding = 20;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const horizontalLines = 5;
    const verticalLines = 8;
    const lines = [];

    // Horizontal grid lines
    for (let i = 0; i <= horizontalLines; i++) {
      const y = padding + (graphHeight * i) / horizontalLines;
      lines.push(
        <line
          key={`h${i}`}
          x1={padding}
          y1={y}
          x2={width - padding}
          y2={y}
          stroke={gridColor}
          strokeWidth="1"
          opacity="0.2"
        />
      );
    }

    // Vertical grid lines
    for (let i = 0; i <= verticalLines; i++) {
      const x = padding + (graphWidth * i) / verticalLines;
      lines.push(
        <line
          key={`v${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={height - padding}
          stroke={gridColor}
          strokeWidth="1"
          opacity="0.2"
        />
      );
    }

    return lines;
  }, [showGrid, width, height, gridColor]);

  return (
    <Container>
      <Label>ADSR Envelope</Label>
      <Canvas
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ backgroundColor }}
      >
        {grid}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Canvas>
    </Container>
  );
};
