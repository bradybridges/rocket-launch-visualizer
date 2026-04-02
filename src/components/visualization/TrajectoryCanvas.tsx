import { useMemo, useState, useCallback } from 'react';
import { scaleLinear } from 'd3-scale';
import type { TrajectoryPoint } from '../../types/trajectory';
import { OrbitRing } from './OrbitRing';
import { TrajectoryPath } from './TrajectoryPath';
import { TrajectoryTooltip } from './TrajectoryTooltip';

interface Props {
	points: TrajectoryPoint[];
	targetAltitudeKm: number;
	width: number;
	height: number;
}

const MARGIN = { top: 24, right: 24, bottom: 48, left: 64 };

export function TrajectoryCanvas({ points, targetAltitudeKm, width, height }: Props) {
	const innerW = width - MARGIN.left - MARGIN.right;
	const innerH = height - MARGIN.top - MARGIN.bottom;

	const [hoveredPoint, setHoveredPoint] = useState<TrajectoryPoint | null>(null);

	const { xScale, yScale } = useMemo(() => {
		const maxDownrange = points.length > 0
			? Math.max(...points.map((p) => p.downrange), 100)
			: 100;
		const maxAlt = Math.max(targetAltitudeKm * 1.15, 100);

		const xScale = scaleLinear().domain([0, maxDownrange]).range([0, innerW]);
		const yScale = scaleLinear().domain([0, maxAlt]).range([innerH, 0]);
		return { xScale, yScale };
	}, [points, targetAltitudeKm, innerW, innerH]);

	const handleMouseMove = useCallback((e: React.MouseEvent<SVGRectElement>) => {
		if (points.length < 2) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const downrange = xScale.invert(mouseX);
		// Binary search for nearest point by downrange
		let lo = 0;
		let hi = points.length - 1;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			if (points[mid].downrange < downrange) lo = mid + 1;
			else hi = mid;
		}
		// Pick closest of lo and lo-1
		const nearest =
			lo > 0 && Math.abs(points[lo - 1].downrange - downrange) < Math.abs(points[lo].downrange - downrange)
				? points[lo - 1]
				: points[lo];
		setHoveredPoint(nearest);
	}, [points, xScale]);

	const handleMouseLeave = useCallback(() => setHoveredPoint(null), []);

	const xTicks = xScale.ticks(6);
	const yTicks = yScale.ticks(6);

	return (
		<svg width={width} height={height} style={{ display: 'block' }}>
			<defs>
				<radialGradient id="spaceGradient" cx="50%" cy="100%" r="80%">
					<stop offset="0%" stopColor="#0d1f35" />
					<stop offset="100%" stopColor="#050810" />
				</radialGradient>
			</defs>

			{/* Background */}
			<rect width={width} height={height} fill="url(#spaceGradient)" rx={8} />

			<g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
				{/* Grid lines */}
				{xTicks.map((t) => (
					<line
						key={t}
						x1={xScale(t)}
						y1={0}
						x2={xScale(t)}
						y2={innerH}
						stroke="#1e293b"
						strokeWidth={1}
					/>
				))}
				{yTicks.map((t) => (
					<line
						key={t}
						x1={0}
						y1={yScale(t)}
						x2={innerW}
						y2={yScale(t)}
						stroke="#1e293b"
						strokeWidth={1}
					/>
				))}

				<OrbitRing targetAltitudeKm={targetAltitudeKm} xScale={xScale} yScale={yScale} />
				{points.length > 1 && (
					<TrajectoryPath points={points} xScale={xScale} yScale={yScale} />
				)}

				{/* X axis */}
				<g transform={`translate(0,${innerH})`}>
					<line x1={0} y1={0} x2={innerW} y2={0} stroke="#334155" />
					{xTicks.map((t) => (
						<g key={t} transform={`translate(${xScale(t)},0)`}>
							<line y2={5} stroke="#334155" />
							<text y={18} textAnchor="middle" fill="#64748b" fontSize={11}>
								{t}
							</text>
						</g>
					))}
					<text
						x={innerW / 2}
						y={40}
						textAnchor="middle"
						fill="#64748b"
						fontSize={12}
					>
						Downrange (km)
					</text>
				</g>

				{/* Y axis */}
				<g>
					<line x1={0} y1={0} x2={0} y2={innerH} stroke="#334155" />
					{yTicks.map((t) => (
						<g key={t} transform={`translate(0,${yScale(t)})`}>
							<line x2={-5} stroke="#334155" />
							<text x={-10} dy="0.32em" textAnchor="end" fill="#64748b" fontSize={11}>
								{t}
							</text>
						</g>
					))}
					<text
						transform={`translate(-48,${innerH / 2}) rotate(-90)`}
						textAnchor="middle"
						fill="#64748b"
						fontSize={12}
					>
						Altitude (km)
					</text>
				</g>

					{/* Transparent mouse-capture overlay */}
				{points.length > 1 && (
					<rect
						x={0}
						y={0}
						width={innerW}
						height={innerH}
						fill="transparent"
						onMouseMove={handleMouseMove}
						onMouseLeave={handleMouseLeave}
						style={{ cursor: 'crosshair' }}
					/>
				)}

				{/* Tooltip */}
				{hoveredPoint && (
					<TrajectoryTooltip
						point={hoveredPoint}
						xScale={xScale}
						yScale={yScale}
						innerW={innerW}
					/>
				)}

				{/* Velocity legend */}
				<g transform={`translate(${innerW - 160}, 8)`}>
					<rect x={0} y={0} width={160} height={28} rx={4} fill="#0f172a" opacity={0.8} />
					<defs>
						<linearGradient id="velGradient" x1="0%" x2="100%">
							<stop offset="0%" stopColor="#f97316" />
							<stop offset="100%" stopColor="#22d3ee" />
						</linearGradient>
					</defs>
					<rect x={8} y={10} width={80} height={8} rx={2} fill="url(#velGradient)" />
					<text x={8} y={8} fill="#94a3b8" fontSize={9}>Slow</text>
					<text x={92} y={8} fill="#94a3b8" fontSize={9}>Fast</text>
					<text x={100} y={17} fill="#94a3b8" fontSize={9} dominantBaseline="middle">velocity</text>
				</g>
			</g>
		</svg>
	);
}
