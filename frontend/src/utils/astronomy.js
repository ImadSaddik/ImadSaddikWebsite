import { toRadians, normalizeAngle } from "./math";
import { MILLISECONDS_IN_A_DAY, JULIAN_DATE_OFFSET, DAYS_IN_JULIAN_CENTURY, J2000_JULIAN_DATE } from "@/constants";

/**
 * Calculates the current moon phase percentage and age (1-30 days) using Jean Meeus' astronomical algorithms.
 * This accounts for the Moon's elliptical orbit (Equation of Center) and solar perturbations (Evection, Variation).
 * * Reference: Jean Meeus, "Astronomical Algorithms", Chapter 48.
 * * Inspired by this implementation: https://celestialprogramming.com/meeus-illuminated_fraction_of_the_moon.html
 * @returns {{ percentage: number, dayIndex: number }} An object containing the illumination percentage (0-100) and the moon age day index (1-30).
 */
export function getLunarPhaseData(date = new Date()) {
  const julianCenturies = getJulianCenturies(date);
  const { meanElongation, sunMeanAnomaly, moonMeanAnomaly } = getMeanPositions(julianCenturies);
  const phaseAngle = getPhaseAngle(meanElongation, sunMeanAnomaly, moonMeanAnomaly);

  return {
    percentage: getIlluminationPercentage(phaseAngle),
    dayIndex: getLunarDayIndex(phaseAngle),
  };
}

/**
 * Calculate Julian centuries since J2000.0
 * @param {Date} date
 * @returns {number} Julian centuries
 */
export function getJulianCenturies(date) {
  const julianDate = date.getTime() / MILLISECONDS_IN_A_DAY + JULIAN_DATE_OFFSET;
  return (julianDate - J2000_JULIAN_DATE) / DAYS_IN_JULIAN_CENTURY;
}

/**
 * Calculate "Mean" positions (Perfect circle model)
 * @param {number} julianCenturies
 * @returns {{ meanElongation: number, sunMeanAnomaly: number, moonMeanAnomaly: number }} Mean positions in degrees
 */
export function getMeanPositions(julianCenturies) {
  // Sun's mean anomaly: Position of Earth in its elliptical orbit around Sun
  const sunMeanAnomaly = normalizeAngle(357.5291092 + 35999.0502909 * julianCenturies);

  // Moon's mean anomaly: Position of Moon in its elliptical orbit around Earth
  const moonMeanAnomaly = normalizeAngle(134.9633964 + 477198.8675055 * julianCenturies);

  // Mean elongation: Average angular distance between Moon and Sun
  const meanElongation = normalizeAngle(297.8501921 + 445267.1114034 * julianCenturies);

  return { meanElongation, sunMeanAnomaly, moonMeanAnomaly };
}

/**
 * Calculate Phase angle with corrections (perturbations)
 * @param {number} meanElongation
 * @param {number} sunMeanAnomaly
 * @param {number} moonMeanAnomaly
 * @returns {number} Phase angle in degrees
 */
export function getPhaseAngle(meanElongation, sunMeanAnomaly, moonMeanAnomaly) {
  // We start with perfect opposition (180 - elongation) and apply corrections for gravity quirks.
  const corrections =
    -6.289 * Math.sin(toRadians(moonMeanAnomaly)) + // Equation of center
    2.1 * Math.sin(toRadians(sunMeanAnomaly)) - // Solar anomaly
    1.274 * Math.sin(toRadians(2 * meanElongation - moonMeanAnomaly)) - // Evection
    0.658 * Math.sin(toRadians(2 * meanElongation)) - // Variation
    0.214 * Math.sin(toRadians(2 * moonMeanAnomaly)) -
    0.11 * Math.sin(toRadians(meanElongation));

  return normalizeAngle(180 - meanElongation + corrections);
}

/**
 * Calculate illumination percentage
 * @param {number} phaseAngleDegrees
 * @returns {number} Value between 0-100
 */
export function getIlluminationPercentage(phaseAngleDegrees) {
  // Formula: k = (1 + cos(i)) / 2
  const illuminationFraction = (1 + Math.cos(toRadians(phaseAngleDegrees))) / 2;
  return Math.round(illuminationFraction * 100);
}

/**
 * Calculate visual day index
 * @param {number} phaseAngleDegrees
 * @returns {number} Day index between 1-30
 */
export function getLunarDayIndex(phaseAngleDegrees) {
  // Reverse phase angle to get "Moon age"
  const moonAgeDegrees = normalizeAngle(180 - phaseAngleDegrees);
  return Math.floor((moonAgeDegrees / 360) * 30) + 1;
}
