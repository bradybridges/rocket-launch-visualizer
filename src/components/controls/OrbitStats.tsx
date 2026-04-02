import type { SimulationResult } from '../../types/trajectory';

interface Props {
	result: SimulationResult;
}

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
	return (
		<div className="flex justify-between items-baseline py-2 border-b border-slate-800">
			<span className="text-sm text-slate-400">{label}</span>
			<div className="text-right">
				<span className="font-mono text-sm text-slate-100">{value}</span>
				{sub && <span className="ml-1 text-xs text-slate-500">{sub}</span>}
			</div>
		</div>
	);
}

export function OrbitStats({ result }: Props) {
	const {
		circularVelocityKms,
		achievedVelocityKms,
		circularizationDeltaVKms,
		totalDeltaVKms,
		burnDurationS,
		apogeeAltitudeKm,
	} = result;

	const formatKms = (v: number) => `${(v * 1000).toFixed(0)} m/s`;
	const formatMin = (s: number) => `${(s / 60).toFixed(1)} min`;

	return (
		<div className="flex flex-col">
			<h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
				Flight Results
			</h2>
			<StatRow label="Circular orbit velocity" value={formatKms(circularVelocityKms)} />
			<StatRow label="Achieved velocity" value={formatKms(achievedVelocityKms)} />
			<StatRow label="Circularization Δv" value={formatKms(circularizationDeltaVKms)} />
			<StatRow label="Total Δv" value={formatKms(totalDeltaVKms)} />
			<StatRow label="Burn duration" value={formatMin(burnDurationS)} />
			<StatRow label="Apogee altitude" value={`${apogeeAltitudeKm.toFixed(0)} km`} />
			<p className="mt-3 text-xs text-slate-600 leading-relaxed">
				* Simplified single-stage model. Constant mass, no staging,
				exponential atmosphere below 80 km.
			</p>
		</div>
	);
}
