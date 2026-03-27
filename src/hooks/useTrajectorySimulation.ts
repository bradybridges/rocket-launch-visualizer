import { useMemo } from 'react';
import type { RocketParams, SimState, SimulationResult, TrajectoryPoint } from '../types/trajectory';
import { rk4Step } from '../physics/rk4';
import { derivatives, initialState } from '../physics/gravityTurn';
import { R_EARTH_KM, MU, circularVelocity } from '../physics/orbitMath';

const DT = 0.5;               // timestep (s)
const MAX_STEPS = 20000;      // safety cap
const PITCHOVER_ALT_KM = 10; // fly vertically until this altitude, then kick to gravity turn

export function useTrajectorySimulation(params: RocketParams): SimulationResult {
	return useMemo(() => {
		const points: TrajectoryPoint[] = [];
		let state: SimState = initialState();
		const targetR = R_EARTH_KM + params.targetAltitudeKm;
		let pitchedOver = false;

		for (let i = 0; i < MAX_STEPS; i++) {
			const altKm = state.r - R_EARTH_KM;

			// Apply programmed pitchover kick once the rocket clears the vertical rise altitude.
			// This matches real rocket ascent profiles: fly vertical to build speed, then tilt
			// slightly to initiate the gravity turn at a velocity where the turn rate is stable.
			if (!pitchedOver && altKm >= PITCHOVER_ALT_KM) {
				state = { ...state, gamma: (90 - params.pitchoverAngleDeg) * (Math.PI / 180) };
				pitchedOver = true;
			}

			points.push({
				altitude: altKm,
				downrange: state.x,
				velocity: state.v,
				time: state.t,
			});

			// Stop once we reach target altitude with a near-horizontal trajectory
			if (state.r >= targetR && Math.abs(state.gamma) < 0.05) break;

			// Stop if rocket falls back to Earth or exceeds escape velocity
			const vEscape = Math.sqrt(2 * MU / state.r);
			if (altKm < 0 || state.v >= vEscape) break;

			state = rk4Step(state, DT, (s) => derivatives(s, params));
		}

		const last = points[points.length - 1];
		const vCirc = circularVelocity(params.targetAltitudeKm);
		const circDeltaV = Math.max(0, vCirc - last.velocity);
		const apogeeAltitudeKm = points.reduce((max, p) => Math.max(max, p.altitude), 0);

		return {
			points,
			circularVelocityKms: vCirc,
			achievedVelocityKms: last.velocity,
			circularizationDeltaVKms: circDeltaV,
			totalDeltaVKms: last.velocity + circDeltaV,
			burnDurationS: last.time,
			apogeeAltitudeKm,
		};
	}, [
		params.targetAltitudeKm,
		params.thrustToWeightRatio,
		params.includeAtmosphere,
		params.pitchoverAngleDeg,
	]);
}
