import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { COLORS, TRANSITIONS } from "../constants/styles";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #181818;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 32px;
  opacity: 0;
  animation: ${fadeIn} 0.8s ${TRANSITIONS.normal} forwards;
  animation-delay: 0.1s;
`;

const SynthButton = styled.button`
  margin: 8px;
  padding: 12px 32px;
  font-size: 18px;
  border-radius: 8px;
  border: none;
  background: #333;
  color: #fff;
  cursor: pointer;
  transition: background ${TRANSITIONS.normal}, color ${TRANSITIONS.normal};
  opacity: 0;
  animation: ${fadeIn} 0.8s ${TRANSITIONS.normal} forwards;
  animation-delay: 0.3s;
  &:nth-of-type(2) {
    animation-delay: 0.45s;
  }
  &:hover {
    background: ${COLORS.navigation.active};
    color: #fff;
  }
`;

export function SynthList() {
  const navigate = useNavigate();
  return (
    <Container>
      <Title>Web Synthesizer List</Title>
      <SynthButton onClick={() => navigate("/samplesynth")}>
        Sample Synth
      </SynthButton>
      <SynthButton onClick={() => navigate("/retrosynth")}>
        Retro Synth
      </SynthButton>
    </Container>
  );
}
