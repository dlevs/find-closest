type ComparerFn<T> = (value: T, index: number, array: T[]) => number;

export function baseFindClosestIndex<T>(collection: (T | number)[], comparer: ComparerFn<T> | number): number {
	let closest = {
		index: -1,
		distance: Number.POSITIVE_INFINITY
	};

	for (let i = 0; i < collection.length; i++) {
		const difference = typeof comparer === 'number'
			? (collection[i] as number) - comparer
			: comparer(collection[i] as T, i, collection as T[]);
		const distance = Math.abs(difference);

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
export function findClosestIndex(collection: number[], comparer: number): number;
export function findClosestIndex<T>(collection: T[], comparer: ComparerFn<T>): number;
export function findClosestIndex<T>(collection: (T | number)[], comparer: ComparerFn<T> | number): number {
	return baseFindClosestIndex(collection, comparer);
}

/**
 * Returns the item in an array that is closest in likeness to the `needle`
 * parameter.
 */
export function findClosest(collection: number[], comparer: number): number;
export function findClosest<T>(collection: T[], comparer: ComparerFn<T>): T;
export function findClosest<T>(collection: (T | number)[], comparer: ComparerFn<T> | number): T | number {
	return collection[baseFindClosestIndex(collection, comparer)];
}

export default findClosest;
