import type { ScaleLinear } from 'd3-scale';
import type { TrajectoryPoint } from '../../types/trajectory';

interface Props {
	point: TrajectoryPoint;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	innerW: number;
	innerH: number;
}

const PAD = 8;
const W = 148;
const H = 80;

export function TrajectoryTooltip({ point, xScale, yScale, innerW, innerH }: Props) {
	const cx = xScale(point.downrange);
	const cy = yScale(point.altitude);

	// Flip tooltip to left side if too close to right edge
	const flipX = cx + W + PAD * 2 > innerW;
	const tooltipX = flipX ? cx - W - PAD : cx + PAD;
	// Flip tooltip downward if too close to top edge
	const flipY = cy - PAD < 0;
	const tooltipY = flipY ? cy + PAD : cy - H - PAD;

	const rows: [string, string][] = [
		['Altitude', `${point.altitude.toFixed(1)} km`],
		['Velocity', `${(point.velocity * 1000).toFixed(0)} m/s`],
		['Downrange', `${point.downrange.toFixed(1)} km`],
		['Time', `${(point.time / 60).toFixed(1)} min`],
	];

	return (
		<g pointerEvents="none">
			{/* Crosshair dot */}
			<circle cx={cx} cy={cy} r={4} fill="#fff" opacity={0.9} />

			{/* Box */}
			<rect
				x={tooltipX}
				y={tooltipY}
				width={W}
				height={H}
				rx={5}
				fill="#0f172a"
				stroke="#334155"
				strokeWidth={1}
				opacity={0.95}
			/>

			{rows.map(([label, value], i) => (
				<g key={label} transform={`translate(${tooltipX + PAD}, ${tooltipY + 14 + i * 17})`}>
					<text fill="#64748b" fontSize={10} dominantBaseline="middle">
						{label}
					</text>
					<text x={W - PAD * 2} fill="#e2e8f0" fontSize={10} dominantBaseline="middle" textAnchor="end">
						{value}
					</text>
				</g>
			))}
		</g>
	);
}
