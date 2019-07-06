type IterationFn<T, R> = (value: T, index: number, array: T[]) => R;
type FilterMapFn<T> = IterationFn<T, number | boolean>;
type FilterMapFnStrict<T> = IterationFn<T, number | false>;

// TODO: Look into creating a "sortedFindClosest", like https://lodash.com/docs/4.17.11#sortedIndexOf

function baseFindClosestIndex<T>(
	haystack: T[],
	needle: number,
	filterMapFn?: FilterMapFn<T>
) {
	let closest = {
		index: -1,
		distance: Number.POSITIVE_INFINITY,
		value: 0
	};

	for (let index = 0; index < haystack.length; index++) {
		let value: T | number = haystack[index];

		if (filterMapFn) {
			const mappedValue = filterMapFn(value, index, haystack);

			switch (mappedValue) {
				case true:
					break;
				case false:
					continue;
				default:
					value = mappedValue;
			}
		}

		// This statement should never be triggered in TypeScript if the overloaded
		// function signatures are correct. It's a little complex, so TS is not
		// certain that `value` is a number.
		if (typeof value !== 'number') {
			throw new TypeError(`Expected a number value. Received ${value}.`);
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
}

/**
 * Returns the index of the item in an array that is closest to the value
 * specified by the `needle` argument.
 */
export function findClosestIndex(
	haystack: number[],
	needle: number,
	filterMapFn?: FilterMapFn<number>
): number;
export function findClosestIndex<T>(
	haystack: T[],
	needle: number,
	filterMapFn: FilterMapFnStrict<T>
): number;
export function findClosestIndex<T>(
	haystack: T[],
	needle: number,
	filterMapFn?: FilterMapFn<T>
): number {
	return baseFindClosestIndex(haystack, needle, filterMapFn);
}

/**
 * Returns the item in an array that is closest to the value specified by the
 * `needle` argument.
 */
export function findClosest(
	haystack: number[],
	needle: number,
	filterMapFn?: FilterMapFn<number>
): number;
export function findClosest<T>(
	haystack: T[],
	needle: number,
	filterMapFn: FilterMapFnStrict<T>
	): T;
export function findClosest<T>(
	haystack: T[],
	needle: number,
	filterMapFn?: FilterMapFn<T>
): T | number {
	return haystack[baseFindClosestIndex(haystack, needle, filterMapFn)];
}

export default findClosest;
