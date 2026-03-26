import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { RocketParams } from '../../types/trajectory';

const schema = z.object({
	targetAltitudeKm: z.number().min(200, 'Min 200 km').max(36000, 'Max 36,000 km'),
	thrustToWeightRatio: z.number().min(1.01, 'Must be > 1 to lift off').max(5),
	includeAtmosphere: z.boolean(),
	pitchoverAngleDeg: z.number().min(1).max(10),
});

interface Props {
	defaultValues: RocketParams;
	onChange: (params: RocketParams) => void;
}

export function LaunchControls({ defaultValues, onChange }: Props) {
	const { register, watch, formState: { errors } } = useForm<RocketParams>({
		resolver: zodResolver(schema),
		defaultValues,
		mode: 'onChange',
	});

	const values = watch();

	// Propagate valid changes upward
	const parsed = schema.safeParse(values);
	if (parsed.success) {
		const current = JSON.stringify(parsed.data);
		const prev = JSON.stringify(defaultValues);
		if (current !== prev) onChange(parsed.data);
	}

	return (
		<div className="flex flex-col gap-5">
			{/* Target Altitude */}
			<div className="flex flex-col gap-1.5">
				<label className="text-sm font-medium text-slate-300">
					Target Orbit Altitude
					<span className="ml-2 text-cyan-400 font-mono">{values.targetAltitudeKm} km</span>
				</label>
				<input
					type="range"
					min={200}
					max={36000}
					step={50}
					{...register('targetAltitudeKm', { valueAsNumber: true })}
					className="w-full accent-cyan-400 cursor-pointer"
				/>
				<div className="flex justify-between text-xs text-slate-500">
					<span>200 km (LEO)</span>
					<span>36,000 km (GEO)</span>
				</div>
				{errors.targetAltitudeKm && (
					<p className="text-xs text-red-400">{errors.targetAltitudeKm.message}</p>
				)}
			</div>

			{/* Thrust-to-Weight */}
			<div className="flex flex-col gap-1.5">
				<label className="text-sm font-medium text-slate-300">
					Thrust-to-Weight Ratio
					<span className="ml-2 text-cyan-400 font-mono">
						{Number(values.thrustToWeightRatio).toFixed(2)}
					</span>
				</label>
				<input
					type="range"
					min={1.05}
					max={5}
					step={0.05}
					{...register('thrustToWeightRatio', { valueAsNumber: true })}
					className="w-full accent-cyan-400 cursor-pointer"
				/>
				<div className="flex justify-between text-xs text-slate-500">
					<span>1.05×</span>
					<span>5.0×</span>
				</div>
				{errors.thrustToWeightRatio && (
					<p className="text-xs text-red-400">{errors.thrustToWeightRatio.message}</p>
				)}
			</div>

			{/* Pitchover Angle */}
			<div className="flex flex-col gap-1.5">
				<label className="text-sm font-medium text-slate-300">
					Pitchover Angle
					<span className="ml-2 text-cyan-400 font-mono">{values.pitchoverAngleDeg}°</span>
				</label>
				<input
					type="range"
					min={1}
					max={10}
					step={0.5}
					{...register('pitchoverAngleDeg', { valueAsNumber: true })}
					className="w-full accent-cyan-400 cursor-pointer"
				/>
				<div className="flex justify-between text-xs text-slate-500">
					<span>1° (shallow)</span>
					<span>10° (steep)</span>
				</div>
			</div>

			{/* Atmosphere Toggle */}
			<label className="flex items-center gap-3 cursor-pointer select-none">
				<input
					type="checkbox"
					{...register('includeAtmosphere')}
					className="w-4 h-4 accent-cyan-400"
				/>
				<span className="text-sm text-slate-300">Include atmospheric drag</span>
			</label>
		</div>
	);
}
