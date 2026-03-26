import { ScaleLinear } from 'd3-scale';
import { R_EARTH_KM } from '../../physics/orbitMath';

interface Props {
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
}

export function EarthArc({ xScale, yScale }: Props) {
	const xMin = xScale.domain()[0];
	const xMax = xScale.domain()[1];
	const steps = 120;
	const points: [number, number][] = [];

	for (let i = 0; i <= steps; i++) {
		const downrange = xMin + (i / steps) * (xMax - xMin);
		// Earth surface curves away: altitude = sqrt(R^2 - x^2) - R (approx for small angles)
		const angle = downrange / R_EARTH_KM; // radians
		const altKm = R_EARTH_KM * (1 / Math.cos(angle) - 1);
		points.push([xScale(downrange), yScale(altKm)]);
	}

	const d = points
		.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
		.join(' ');

	return (
		<g>
			<path
				d={d}
				fill="none"
				stroke="#1e3a5f"
				strokeWidth={2}
			/>
			<path
				d={`${d} L${xScale(xMax).toFixed(1)},${yScale.range()[0]} L${xScale(xMin).toFixed(1)},${yScale.range()[0]} Z`}
				fill="#0d1f35"
				opacity={0.6}
			/>
		</g>
	);
}
