/**
 * Normalizes a value between a minimum and maximum range to [0, 1]
 */
export const normalize = (
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): number => {
  const normalized = (value - inputMin) / (inputMax - inputMin);
  return outputMin + normalized * (outputMax - outputMin);
};

/**
 * Converts a normalized value [0, 1] back to the original range
 */
export const denormalize = (
  normalizedValue: number,
  min: number,
  max: number
): number => {
  return min + normalizedValue * (max - min);
};

/**
 * Clamps a value between a minimum and maximum
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Converts a value to angle in degrees for knob rotation
 */
export const valueToAngle = (
  value: number,
  min: number,
  max: number,
  minAngle: number,
  maxAngle: number
): number => {
  const normalized = normalize(value, min, max, 0, 1);
  return minAngle + normalized * (maxAngle - minAngle);
};

/**
 * Converts an angle in degrees back to a value in the original range
 */
export const angleToValue = (
  angle: number,
  min: number,
  max: number,
  minAngle: number,
  maxAngle: number
): number => {
  const normalized = normalize(angle, minAngle, maxAngle, 0, 1);
  return denormalize(normalized, min, max);
};

/**
 * Converts polar coordinates to cartesian coordinates
 */
export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

/**
 * Converts degrees to radians
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Converts radians to degrees
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Linearly interpolates between two values
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};
