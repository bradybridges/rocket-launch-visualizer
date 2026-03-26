export const R_EARTH_KM = 6371;
export const MU = 3.986e5; // gravitational parameter (km^3/s^2)
export const G0 = 9.80665e-3; // standard gravity (km/s^2)

// Exponential atmosphere model: density in kg/m^3
const RHO0 = 1.225; // sea-level density (kg/m^3)
const SCALE_HEIGHT_KM = 8.5;

export function atmosphericDensity(altitudeKm: number): number {
	if (altitudeKm > 80) return 0;
	return RHO0 * Math.exp(-altitudeKm / SCALE_HEIGHT_KM);
}

export function gravity(rKm: number): number {
	return MU / (rKm * rKm);
}

export function circularVelocity(altitudeKm: number): number {
	return Math.sqrt(MU / (R_EARTH_KM + altitudeKm));
}

export function hohmannDeltaV(
	currentVKms: number,
	targetAltitudeKm: number,
): number {
	const vCirc = circularVelocity(targetAltitudeKm);
	return Math.abs(vCirc - currentVKms);
}
