export type DerivativeFn<T> = (state: T) => T;

export function addScaled<T extends Record<string, number>>(
	state: T,
	derivative: T,
	scale: number,
): T {
	const result = {} as T;
	for (const key in state) {
		result[key] = (state[key] + derivative[key] * scale) as T[typeof key];
	}
	return result;
}

export function rk4Step<T extends Record<string, number>>(
	state: T,
	dt: number,
	derivFn: DerivativeFn<T>,
): T {
	const k1 = derivFn(state);
	const k2 = derivFn(addScaled(state, k1, dt / 2));
	const k3 = derivFn(addScaled(state, k2, dt / 2));
	const k4 = derivFn(addScaled(state, k3, dt));

	const result = {} as T;
	for (const key in state) {
		result[key] = (state[key] +
			(dt / 6) * (k1[key] + 2 * k2[key] + 2 * k3[key] + k4[key])) as T[typeof key];
	}
	return result;
}
