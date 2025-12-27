/**
 * Calculates the current moon phase percentage and age (1-30 days) using Jean Meeus' astronomical algorithms.
 * This accounts for the Moon's elliptical orbit (Equation of Center) and solar perturbations (Evection, Variation).
 * * Reference: Jean Meeus, "Astronomical Algorithms", Chapter 48.
 * * Inspired by this implementation: https://celestialprogramming.com/meeus-illuminated_fraction_of_the_moon.html
 * @returns {{ percentage: number, dayIndex: number }} An object containing the illumination percentage (0-100) and the moon age day index (1-30).
 */
export function getLunarPhaseData() {
  const dateNow = new Date();

  // 1. Calculate Julian time
  // The number of days passed since January 1, 4713 BC (Greenwich noon).
  const MILLISECONDS_IN_A_DAY = 86400000;
  const JULIAN_DATE_OFFSET = 2440587.5; // Offset between Unix epoch and Julian epoch
  const julianDate = dateNow.getTime() / MILLISECONDS_IN_A_DAY + JULIAN_DATE_OFFSET;

  // 2. Calculate Julian centuries (T) since J2000.0 epoch
  const DAYS_IN_JULIAN_CENTURY = 36525.0;
  const J2000_JULIAN_DATE = 2451545.0;
  const julianCenturies = (julianDate - J2000_JULIAN_DATE) / DAYS_IN_JULIAN_CENTURY;

  // 3. Calculate "mean" positions (Perfect circle model)
  // Sun's mean anomaly (M): Position of Earth in its elliptical orbit around Sun
  let sunMeanAnomaly = 357.5291092 + 35999.0502909 * julianCenturies;
  sunMeanAnomaly = normalizeAngle(sunMeanAnomaly);

  // Moon's mean anomaly (M'): Position of Moon in its elliptical orbit around Earth
  let moonMeanAnomaly = 134.9633964 + 477198.8675055 * julianCenturies;
  moonMeanAnomaly = normalizeAngle(moonMeanAnomaly);

  // Mean elongation (D): Average angular distance between Moon and Sun
  let meanElongation = 297.8501921 + 445267.1114034 * julianCenturies;
  meanElongation = normalizeAngle(meanElongation);

  // 4. Calculate phase angle with corrections (perturbations)
  // We start with perfect opposition (180 - D) and apply corrections for gravity quirks.
  // (180 - D) flips the perspective from "Earth-centered" to "Moon-centered".
  const phaseAngleDegrees =
    180 -
    meanElongation -
    6.289 * Math.sin(toRadians(moonMeanAnomaly)) + // Equation of center (Ellipse speed)
    2.1 * Math.sin(toRadians(sunMeanAnomaly)) - // Solar anomaly
    1.274 * Math.sin(toRadians(2 * meanElongation - moonMeanAnomaly)) - // Evection (Sun stretching orbit)
    0.658 * Math.sin(toRadians(2 * meanElongation)) - // Variation (Speeding up/slowing down)
    0.214 * Math.sin(toRadians(2 * moonMeanAnomaly)) -
    0.11 * Math.sin(toRadians(meanElongation));

  // 5. Calculate illumination percentage
  // Formula: k = (1 + cos(i)) / 2
  const illuminationFraction = (1 + Math.cos(toRadians(phaseAngleDegrees))) / 2;
  const percentage = Math.round(illuminationFraction * 100);

  // 6. Calculate visual day index (for image selection)
  // We reverse phase angle to get "Moon age" (0 to 360 degrees from new Moon)
  let moonAgeDegrees = (180 - phaseAngleDegrees) % 360;
  if (moonAgeDegrees < 0) moonAgeDegrees += 360;

  // Map 0-360 degrees to 1-30 days
  const dayIndex = Math.floor((moonAgeDegrees / 360) * 30) + 1;

  return { percentage, dayIndex };
}

const toRadians = (deg) => deg * (Math.PI / 180);
const normalizeAngle = (deg) => deg % 360;
