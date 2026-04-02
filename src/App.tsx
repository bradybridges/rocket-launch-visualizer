import { useState, useCallback, useRef, useEffect } from 'react';
import type { RocketParams } from './types/trajectory';
import { useTrajectorySimulation } from './hooks/useTrajectorySimulation';
import { LaunchControls } from './components/controls/LaunchControls';
import { OrbitStats } from './components/controls/OrbitStats';
import { TrajectoryCanvas } from './components/visualization/TrajectoryCanvas';

const DEFAULT_PARAMS: RocketParams = {
	targetAltitudeKm: 400,
	thrustToWeightRatio: 1.5,
	includeAtmosphere: true,
	pitchoverAngleDeg: 3,
	pitchoverAltitudeKm: 10,
};

export default function App() {
	const [params, setParams] = useState<RocketParams>(DEFAULT_PARAMS);
	const result = useTrajectorySimulation(params);

	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const [canvasSize, setCanvasSize] = useState({ width: 800, height: 560 });

	useEffect(() => {
		if (!canvasContainerRef.current) return;
		const observer = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;
			setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
		});
		observer.observe(canvasContainerRef.current);
		return () => observer.disconnect();
	}, []);

	const handleParamsChange = useCallback((next: RocketParams) => {
		setParams(next);
	}, []);

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100">
			{/* Left panel */}
			<aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-8 bg-slate-900">
				<div>
					<h1 className="text-lg font-semibold text-slate-100 tracking-tight">
						Launch Trajectory
					</h1>
					<p className="text-xs text-slate-500 mt-1">
						Gravity turn to circular orbit
					</p>
				</div>

				<LaunchControls defaultValues={params} onChange={handleParamsChange} />
				<OrbitStats result={result} />
			</aside>

			{/* Right panel */}
			<main
				ref={canvasContainerRef}
				className="flex-1 flex items-center justify-center p-4 min-h-[400px] overflow-hidden"
			>
				{canvasSize.width > 0 && (
					<TrajectoryCanvas
						points={result.points}
						targetAltitudeKm={params.targetAltitudeKm}
						width={canvasSize.width}
						height={canvasSize.height}
					/>
				)}
			</main>
		</div>
	);
}
