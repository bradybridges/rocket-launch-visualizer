import type { SimState, RocketParams } from '../types/trajectory';
import { R_EARTH_KM, G0, gravity, atmosphericDensity } from './orbitMath';

// Drag parameters (simplified single-stage rocket)
// A/m ≈ 2e-5 m²/kg is realistic for a large orbital rocket
// (e.g. ~10 m² frontal area, ~500,000 kg gross mass)
const CD = 0.3;
const AREA_OVER_MASS = 2e-5; // m²/kg

export function derivatives(state: SimState, params: RocketParams): SimState {
	const { r, v, gamma } = state;
	const altKm = r - R_EARTH_KM;
	const g = gravity(r);
	const accelThrust = params.thrustToWeightRatio * G0;

	let drag = 0;
	if (params.includeAtmosphere && altKm < 80) {
		const rho = atmosphericDensity(altKm);
		// drag accel in m/s^2: 0.5 * rho * Cd * (A/m) * v_ms^2
		// v is in km/s; convert to m/s for drag, result back to km/s^2
		const vMs = v * 1000;
		const dragMs2 = 0.5 * rho * CD * AREA_OVER_MASS * vMs * vMs;
		drag = dragMs2 / 1000;
	}

	// Guard against singularity at very low velocity during vertical phase
	const vSafe = Math.max(v, 0.01);

	const dr = v * Math.sin(gamma);
	const dv = accelThrust - drag - g * Math.sin(gamma);
	const dgamma = (1 / vSafe) * (-(g - (v * v) / r) * Math.cos(gamma));
	const dx = v * Math.cos(gamma) * (R_EARTH_KM / r);

	return { r: dr, v: dv, gamma: dgamma, x: dx, t: 1 };
}

export function initialState(): SimState {
	return {
		r: R_EARTH_KM + 0.1,   // 100m above surface
		v: 0.01,                // near-zero initial velocity (km/s)
		gamma: Math.PI / 2,     // launch purely vertical; pitchover applied by simulation loop
		x: 0,
		t: 0,
	};
}
