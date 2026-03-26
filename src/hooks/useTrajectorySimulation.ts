import { useMemo } from 'react';
import type { RocketParams, SimState, SimulationResult, TrajectoryPoint } from '../types/trajectory';
import { rk4Step } from '../physics/rk4';
import { derivatives, initialState } from '../physics/gravityTurn';
import { R_EARTH_KM, circularVelocity } from '../physics/orbitMath';

const DT = 0.5;          // timestep (s)
const MAX_STEPS = 20000; // safety cap

export function useTrajectorySimulation(params: RocketParams): SimulationResult {
	return useMemo(() => {
		const points: TrajectoryPoint[] = [];
		let state: SimState = initialState(params.pitchoverAngleDeg);
		const targetR = R_EARTH_KM + params.targetAltitudeKm;
		let maxAltKm = 0;

		for (let i = 0; i < MAX_STEPS; i++) {
			const altKm = state.r - R_EARTH_KM;
			if (altKm > maxAltKm) maxAltKm = altKm;

			points.push({
				altitude: altKm,
				downrange: state.x,
				velocity: state.v,
				time: state.t,
			});

			// Stop once we reach target altitude with a near-horizontal trajectory
			if (state.r >= targetR && Math.abs(state.gamma) < 0.05) break;

			// Stop if rocket falls back to Earth
			if (altKm < 0) break;

			state = rk4Step(state, DT, (s) => derivatives(s, params));
		}

		const last = points[points.length - 1];
		const vCirc = circularVelocity(params.targetAltitudeKm);
		const circDeltaV = Math.max(0, vCirc - last.velocity);

		return {
			points,
			circularVelocityKms: vCirc,
			achievedVelocityKms: last.velocity,
			circularizationDeltaVKms: circDeltaV,
			totalDeltaVKms: last.velocity + circDeltaV,
			burnDurationS: last.time,
			apogeeAltitudeKm: maxAltKm,
		};
	}, [params]);
}
