type ComparerFn<T, N> = (value: T, needle: N) => number;

/**
 * Returns the difference between two numbers.
 */
export const defaultComparer = (value: number, needle: number): number =>
	Math.abs(value - needle);

/**
 * Returns the index of the item in an array that is closest in likeness to
 * the `needle` parameter.
 */
export function findClosestIndex(haystack: number[], needle: number): number;
export function findClosestIndex<T, N>(haystack: T[], needle: N, comparer: ComparerFn<T, N>): number;
export function findClosestIndex<T, N>(haystack: T[], needle: N, comparer: ComparerFn<any, any> = defaultComparer): number {
	let closest = {
		index: -1,
		distance: Number.POSITIVE_INFINITY
	};

	for (let i = 0; i < haystack.length; i++) {
		const distance = comparer(haystack[i], needle);

		if (distance === 0) {
			return i;
		}

		if (distance < closest.distance) {
			closest = { index: i, distance };
		}
	}

	return closest.index;
}

/**
 * A wrapper around {@link findClosestIndex}.
 *
 * Returns the actual array item instead of its index.
 *
 * @see findClosestIndex
 */
export function findClosest(haystack: number[], needle: number): number;
export function findClosest<T, N>(haystack: T[], needle: N, comparer: ComparerFn<T, N>): T;
export function findClosest<T, N>(haystack: T[], needle: N, comparer: ComparerFn<any, any> = defaultComparer): T {
	return haystack[findClosestIndex(haystack, needle, comparer)];
}

export default findClosest;
