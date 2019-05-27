interface NeedleObject {
	target: number;
	min?: number;
	max?: number;
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
		min = Number.NEGATIVE_INFINITY,
		max = Number.POSITIVE_INFINITY,
		tieBreaker = () => false
	} = needleObject;
	let closest = {
		index: -1,
		distance: Number.POSITIVE_INFINITY,
		value: 0
	};

	for (let i = 0; i < haystack.length; i++) {
		const value = mapCallback
			? mapCallback(haystack[i] as T, i, haystack as T[])
			: haystack[i] as number;

		if (value < min || value > max) {
			continue;
		}

		const distance = Math.abs(value - target);

		if (distance === 0) {
			return i;
		}

		if (
			distance < closest.distance ||
			(distance === closest.distance && tieBreaker(value, closest.value))
		) {
			closest = { index: i, distance, value };
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
