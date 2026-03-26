import { useMemo } from 'react';
import type { ScaleLinear } from 'd3-scale';
import type { TrajectoryPoint } from '../../types/trajectory';

interface Props {
	points: TrajectoryPoint[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
}

export function TrajectoryPath({ points, xScale, yScale }: Props) {
	const maxVelocity = Math.max(...points.map((p) => p.velocity));

	// Render colored segments to show velocity gradient (slow=orange, fast=cyan)
	const segments = useMemo(() => {
		if (points.length < 2) return [];
		return points.slice(0, -1).map((p, i) => {
			const next = points[i + 1];
			const t = maxVelocity > 0 ? p.velocity / maxVelocity : 0;
			// interpolate orange (#f97316) -> cyan (#22d3ee)
			const r = Math.round(249 - t * (249 - 34));
			const g = Math.round(115 + t * (211 - 115));
			const b = Math.round(22 + t * (238 - 22));
			return {
				x1: xScale(p.downrange),
				y1: yScale(p.altitude),
				x2: xScale(next.downrange),
				y2: yScale(next.altitude),
				color: `rgb(${r},${g},${b})`,
			};
		});
	}, [points, xScale, yScale, maxVelocity]);

	if (points.length < 2) return null;

	return (
		<g>
			{segments.map((seg, i) => (
				<line
					key={i}
					x1={seg.x1}
					y1={seg.y1}
					x2={seg.x2}
					y2={seg.y2}
					stroke={seg.color}
					strokeWidth={2.5}
					strokeLinecap="round"
				/>
			))}
			{/* Launch marker */}
			<circle
				cx={xScale(points[0].downrange)}
				cy={yScale(points[0].altitude)}
				r={4}
				fill="#f97316"
			/>
			{/* Insertion marker */}
			<circle
				cx={xScale(points[points.length - 1].downrange)}
				cy={yScale(points[points.length - 1].altitude)}
				r={4}
				fill="#22d3ee"
			/>
		</g>
	);
}
