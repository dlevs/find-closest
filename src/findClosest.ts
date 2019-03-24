type MapCallback<T> = (value: T, index: number, array: T[]) => number;

function baseFindClosestIndex<T>(
	haystack: (T | number)[],
	needle: number,
	mapCallback?: MapCallback<T>
): number {
	let closest = {
		index: -1,
		distance: Number.POSITIVE_INFINITY
	};

	for (let i = 0; i < haystack.length; i++) {
		const value = mapCallback
			? mapCallback(haystack[i] as T, i, haystack as T[])
			: haystack[i] as number;
		const distance = Math.abs(value - needle);

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
 * Returns the index of the item in an array that is closest in likeness to the
 * `needle` parameter.
 */
export function findClosestIndex(haystack: number[], needle: number): number;
export function findClosestIndex<T>(haystack: T[], needle: number, mapCallback: MapCallback<T>): number;
export function findClosestIndex<T>(haystack: (T | number)[], needle: number, mapCallback?: MapCallback<T>): number {
	return baseFindClosestIndex(haystack, needle, mapCallback);
}

/**
 * Returns the item in an array that is closest in likeness to the `needle`
 * parameter.
 */
export function findClosest(haystack: number[], needle: number): number;
export function findClosest<T>(haystack: T[], needle: number, mapCallback: MapCallback<T>): T;
export function findClosest<T>(haystack: (T | number)[], needle: number, mapCallback?: MapCallback<T>): T | number {
	return haystack[baseFindClosestIndex(haystack, needle, mapCallback)];
}
