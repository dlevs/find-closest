type ComparerFn<T> = (value: T, index: number, array: T[]) => number;

/**
 * Returns the index of the item in an array that is closest in likeness to the
 * `needle` parameter.
 */
export const findClosestIndex = <T>(collection: T[], comparer: ComparerFn<T>) : number => {
	let closest = {
		index: -1,
		distance: Number.POSITIVE_INFINITY
	};

	for (let i = 0; i < collection.length; i++) {
		const distance = Math.abs(comparer(collection[i], i, collection));

		if (distance === 0) {
			return i;
		}

		if (distance < closest.distance) {
			closest = { index: i, distance };
		}
	}

	return closest.index;
};

/**
 * Returns the item in an array that is closest in likeness to the `needle`
 * parameter.
 */
export const findClosest = <T>(collection: T[], comparer: ComparerFn<T>): T =>
	collection[findClosestIndex(collection, comparer)];

export default findClosest;
