import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const synthMenus = [
  { path: "/", label: "Home" },
  { path: "/samplesynth", label: "Sample Synth" },
  { path: "/retrosynth", label: "Retro Synth" },
];

export default function NavigationPopup() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          background: "#222",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          position: "relative",
        }}
        aria-label="메뉴 열기"
      >
        Menu
      </button>
      <div
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: 8,
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transform: open ? "translateY(0)" : "translateY(-10px)",
          transition:
            "opacity 0.2s ease-in-out, transform 0.2s ease-in-out, visibility 0.2s ease-in-out",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: 180,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {synthMenus.map((menu) => (
            <button
              key={menu.path}
              onClick={() => handleNavigate(menu.path)}
              style={{
                background:
                  location.pathname === menu.path ? "#222" : "transparent",
                color: location.pathname === menu.path ? "#fff" : "#222",
                border: "none",
                borderRadius: 6,
                padding: "8px 12px",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: location.pathname === menu.path ? "bold" : "normal",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
