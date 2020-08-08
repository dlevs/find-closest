type IterationFn<T, R> = (value: T, index: number, array: T[]) => R;

type FilterMapFn<T> = [T] extends [number]
	// Optional map function. Can return `true`.
	? IterationFn<T, number | boolean> | undefined
	// Required map function. Cannot return `true`.
	: IterationFn<T, number | false>;

type FindFn = <T>(
	haystack: T[],
	needle: number,
	filterMapFn: FilterMapFn<T>,
) => T;

type FindIndexFn = <T>(
	haystack: T[],
	needle: number,
	filterMapFn: FilterMapFn<T>,
) => number;

/**
 * Returns the index of the item in an array that is closest to the value
 * specified by the `needle` argument.
 */
export const findClosestIndex: FindIndexFn = (
	haystack,
	needle,
	filterMapFn,
) => {
	let closest = {
		index: -1,
		distance: Number.POSITIVE_INFINITY,
		value: 0,
	};

	for (let index = 0; index < haystack.length; index++) {
		const rawValue = haystack[index];
		let value: number;

		if (filterMapFn) {
			const mappedValue = filterMapFn(rawValue, index, haystack);

			switch (mappedValue) {
				case false:
					continue;
				case true:
					if (typeof rawValue !== 'number') {
						throw new TypeError(`\`filterMapFn\` returned \`true\` for non-number value \`${rawValue}\`.`);
					}
					value = rawValue;
					break;
				default:
					value = mappedValue;
			}
		} else {
			if (typeof rawValue !== 'number') {
				throw new TypeError(`Array contains non-number value \`${rawValue}\` without a \`filterMapFn\` to map it to a number.`);
			}
			value = rawValue;
		}

		const distance = Math.abs(value - needle);

		if (distance === 0) {
			return index;
		}

		if (distance < closest.distance) {
			closest = { index, distance, value };
		}
	}

	return closest.index;
};

/**
 * Returns the item in an array that is closest to the value specified by the
 * `needle` argument.
 */
export const findClosest: FindFn = (haystack, needle, filterMapFn) =>
	haystack[findClosestIndex(haystack, needle, filterMapFn)];

export default findClosest;
