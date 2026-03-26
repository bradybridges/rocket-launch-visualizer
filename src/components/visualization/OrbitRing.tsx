import { ScaleLinear } from 'd3-scale';

interface Props {
	targetAltitudeKm: number;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
}

export function OrbitRing({ targetAltitudeKm, xScale, yScale }: Props) {
	const y = yScale(targetAltitudeKm);
	const x1 = xScale.range()[0];
	const x2 = xScale.range()[1];

	return (
		<g>
			<line
				x1={x1}
				y1={y}
				x2={x2}
				y2={y}
				stroke="#4ade80"
				strokeWidth={1.5}
				strokeDasharray="8 4"
				opacity={0.7}
			/>
			<text
				x={x2 - 4}
				y={y - 6}
				fill="#4ade80"
				fontSize={11}
				textAnchor="end"
				opacity={0.9}
			>
				Target orbit: {targetAltitudeKm} km
			</text>
		</g>
	);
}
