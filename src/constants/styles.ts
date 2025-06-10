export const COLORS = {
  primary: "#4a9eff",
  secondary: "#ff4444",
  tertiary: "#44ff44",
  background: {
    dark: "#1a1a1a",
    medium: "#2a2a2a",
    light: "#3a3a3a",
  },
  text: {
    primary: "#ffffff",
    secondary: "#cccccc",
    muted: "#999999",
  },
  border: "#444444",
  control: {
    inactive: "#666666",
    active: "#4a9eff",
    track: "#333333",
    tick: "#555555",
  },
} as const;

export const SHADOWS = {
  knob: "0 4px 8px rgba(0, 0, 0, 0.5)",
  button: {
    inactive: "inset 0 2px 4px rgba(0, 0, 0, 0.5)",
    active: (color: string) =>
      `inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px ${color}66`,
  },
} as const;

export const TRANSITIONS = {
  fast: "0.1s ease",
  normal: "0.2s ease",
  slow: "0.3s ease",
} as const;

export const FONTS = {
  mono: '"Space Mono", monospace',
} as const;

export const SIZES = {
  knob: {
    small: 80,
    medium: 100,
    large: 120,
  },
  slider: {
    length: 200,
    thickness: 40,
  },
  button: {
    small: 40,
    medium: 50,
    large: 60,
  },
} as const;
