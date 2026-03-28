export interface RocketParams {
	targetAltitudeKm: number;
	thrustToWeightRatio: number;
	includeAtmosphere: boolean;
	pitchoverAngleDeg: number;
	pitchoverAltitudeKm: number;
}

export interface SimState {
	[key: string]: number;
	r: number;       // distance from Earth center (km)
	v: number;       // speed (km/s)
	gamma: number;   // flight path angle (radians)
	x: number;       // downrange distance (km)
	t: number;       // elapsed time (s)
}

export interface TrajectoryPoint {
	altitude: number;   // km above surface
	downrange: number;  // km
	velocity: number;   // km/s
	time: number;       // s
}

export interface SimulationResult {
	points: TrajectoryPoint[];
	circularVelocityKms: number;
	achievedVelocityKms: number;
	circularizationDeltaVKms: number;
	totalDeltaVKms: number;
	burnDurationS: number;
	apogeeAltitudeKm: number;
}
