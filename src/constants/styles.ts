export const COLORS = {
  primary: "#4a9eff",
  secondary: "#ff9f4a",
  tertiary: "#4aff9f",
  background: {
    dark: "#1a1a1a",
    medium: "#2a2a2a",
    light: "#333333",
  },
  text: {
    primary: "#ffffff",
    secondary: "#dddddd",
    muted: "#888888",
  },
  control: {
    active: "#4a9eff",
    inactive: "#444444",
    track: "#222222",
    tick: "#666666",
  },
  border: "#444444",
} as const;

export const SHADOWS = {
  knob: `
    inset 0 2px 4px rgba(0,0,0,0.5),
    0 2px 8px rgba(0,0,0,0.3),
    0 0 0 1px rgba(255,255,255,0.1)
  `,
  slider: `
    inset 0 2px 4px rgba(0,0,0,0.5),
    0 1px 2px rgba(255,255,255,0.1)
  `,
  button: {
    active: (color: string) => `
      inset 0 2px 4px rgba(0,0,0,0.3),
      0 0 20px ${color}66
    `,
    inactive: `
      inset 0 2px 4px rgba(0,0,0,0.5)
    `,
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
