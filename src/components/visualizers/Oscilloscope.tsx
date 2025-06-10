import React, { useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { COLORS, FONTS } from "../../constants/styles";
import type { OscilloscopeProps } from "../../types/synth";

const Container = styled.div`
  background-color: ${COLORS.background.dark};
  padding: 1rem;
  border-radius: 8px;
`;

const Label = styled.div`
  font-family: ${FONTS.mono};
  font-size: 0.75rem;
  color: ${COLORS.text.muted};
  margin-bottom: 0.5rem;
`;

const Canvas = styled.canvas`
  background-color: ${COLORS.background.dark};
  border-radius: 4px;
`;

export const Oscilloscope: React.FC<OscilloscopeProps> = ({
  analyser,
  width = 200,
  height = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.size;
    const dataArray = new Float32Array(bufferLength);

    const draw = () => {
      const values = analyser.getValue();
      if (Array.isArray(values)) {
        dataArray.set(values[0]);
      } else {
        dataArray.set(values);
      }

      ctx.fillStyle = COLORS.background.dark;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = COLORS.primary;
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i];
        const y = ((v + 1) / 2) * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, width, height]);

  return (
    <Container>
      <Label>Waveform</Label>
      <Canvas ref={canvasRef} width={width} height={height} />
    </Container>
  );
};
