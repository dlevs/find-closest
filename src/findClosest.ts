interface NeedleObject {
	/**
	 * The target value to find in the array.
	 */
	target: number;
	/**
	 * The minimum value to match.
	 */
	min?: number;
	/**
	 * The maximum value to match.
	 */
	max?: number;
	/**
	 * TODO: Add this to README.md and test
	 *
	 * The minimum difference required between a value from the array and the
	 * `target` value for them to be considered an absolute match.
	 *
	 * If an absolute match is found, it is instantly returned. By setting
	 * `threshold` to greater than `0`, it is possible that the returned match is
	 * the the closest to `target` in the array.
	 */
	threshold?: number;
	/**
	 * TODO: Add this to README.md and test
	 *
	 * Start searching from the end of the array.
	 */
	reverse?: boolean;
	/**
	 * Determine which of two values that are equally close to the `target` value
	 * should be preferred.
	 *
	 * Return `true` if `potentialNewClosest` is the preferred "closest" value.
	 */
	tieBreaker?(potentialNewClosest: number, currentClosest: number): boolean;
}
type Needle = NeedleObject | number;
type MapCallback<T> = (value: T, index: number, array: T[]) => number;

// TODO: Look into creating a "sortedFindClosest", like https://lodash.com/docs/4.17.11#sortedIndexOf

function baseFindClosestIndex<T>(
	haystack: (T | number)[],
	needle: Needle,
	mapCallback?: MapCallback<T>
): number {
	const needleObject = typeof needle === 'number'
		? { target: needle }
		: needle;
	const {
		target,
		threshold = 0,
		min = Number.NEGATIVE_INFINITY,
		max = Number.POSITIVE_INFINITY,
		tieBreaker = () => false,
		reverse = false
	} = needleObject;
	let closest = {
		index: -1,
		distance: Number.POSITIVE_INFINITY,
		value: 0
	};

	for (let rawIndex = 0; rawIndex < haystack.length; rawIndex++) {
		const index = reverse
			? haystack.length - 1 - rawIndex
			: rawIndex;
		const value = mapCallback
			? mapCallback(haystack[index] as T, index, haystack as T[])
			: haystack[index] as number;

		if (value < min || value > max) {
			continue;
		}

		const distance = Math.abs(value - target);

		if (distance <= threshold) {
			return index;
		}

		if (
			distance < closest.distance ||
			(distance === closest.distance && tieBreaker(value, closest.value))
		) {
			closest = { index, distance, value };
		}
	}

	return closest.index;
}

/**
 * Returns the index of the item in an array that is closest to the value
 * specified by the `needle` argument.
 */
export function findClosestIndex(haystack: number[], needle: Needle): number;
export function findClosestIndex<T>(haystack: T[], needle: Needle, mapCallback: MapCallback<T>): number;
export function findClosestIndex<T>(haystack: (T | number)[], needle: Needle, mapCallback?: MapCallback<T>): number {
	return baseFindClosestIndex(haystack, needle, mapCallback);
}

/**
 * Returns the item in an array that is closest to the value specified by the
 * `needle` argument.
 */
export function findClosest(haystack: number[], needle: Needle): number;
export function findClosest<T>(haystack: T[], needle: Needle, mapCallback: MapCallback<T>): T;
export function findClosest<T>(haystack: (T | number)[], needle: Needle, mapCallback?: MapCallback<T>): T | number {
	return haystack[baseFindClosestIndex(haystack, needle, mapCallback)];
}
