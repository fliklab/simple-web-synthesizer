import React, { useState } from "react";
import styled from "@emotion/styled";
import { ADSRVisualizer } from "./visualizers/ADSRVisualizer";
import { ADSRControls } from "./controls/ADSRControls";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const ADSREnvelope: React.FC = () => {
  const [adsr, setADSR] = useState({
    attack: 0.1,
    decay: 0.2,
    sustain: 0.7,
    release: 0.5,
  });

  const handleAttackChange = (value: number) => {
    setADSR((prev) => ({ ...prev, attack: value }));
  };

  const handleDecayChange = (value: number) => {
    setADSR((prev) => ({ ...prev, decay: value }));
  };

  const handleSustainChange = (value: number) => {
    setADSR((prev) => ({ ...prev, sustain: value }));
  };

  const handleReleaseChange = (value: number) => {
    setADSR((prev) => ({ ...prev, release: value }));
  };

  return (
    <Container>
      <ADSRVisualizer
        attack={adsr.attack}
        decay={adsr.decay}
        sustain={adsr.sustain}
        release={adsr.release}
        width={600}
        height={200}
      />
      <ADSRControls
        {...adsr}
        onAttackChange={handleAttackChange}
        onDecayChange={handleDecayChange}
        onSustainChange={handleSustainChange}
        onReleaseChange={handleReleaseChange}
      />
    </Container>
  );
};
