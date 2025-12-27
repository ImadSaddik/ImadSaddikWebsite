/**
 * Converts degrees to radians.
 * @param {number} deg
 * @returns {number} Radians
 */
export const toRadians = (deg) => deg * (Math.PI / 180);

/**
 * Normalizes an angle to the 0-360 degree range.
 * Handles negative angles correctly (e.g., -90 becomes 270).
 * @param {number} deg
 * @returns {number} Normalized angle in degrees
 */
export const normalizeAngle = (deg) => ((deg % 360) + 360) % 360;
