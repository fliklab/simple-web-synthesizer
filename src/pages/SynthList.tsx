import { useNavigate } from "react-router-dom";

export function SynthList() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#181818",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 32 }}>Web Synthesizer List</h1>
      <button
        onClick={() => navigate("/samplesynth")}
        style={{
          margin: 8,
          padding: "12px 32px",
          fontSize: 18,
          borderRadius: 8,
          border: "none",
          background: "#333",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Sample Synth
      </button>
      <button
        onClick={() => navigate("/retrosynth")}
        style={{
          margin: 8,
          padding: "12px 32px",
          fontSize: 18,
          borderRadius: 8,
          border: "none",
          background: "#333",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Retro Synth
      </button>
    </div>
  );
}
