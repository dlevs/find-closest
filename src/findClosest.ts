interface NeedleObject {
	/**
	 * The target value to find in the array.
	 */
	target: number;
	/**
	 * The minimum difference required between a value from the array and the
	 * `target` value for them to be considered an absolute match.
	 *
	 * If an absolute match is found, it is instantly returned. By setting
	 * `threshold` to greater than `0`, it is possible that the returned match is
	 * the the closest to `target` in the array.
	 */
	threshold?: number;
	/**
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
type IterationFn<T, R> = (value: T, index: number, array: T[]) => R;
type FilterMapFn<T> = IterationFn<T, number | boolean>;
type FilterMapFnStrict<T> = IterationFn<T, number | false>;

// TODO: Look into creating a "sortedFindClosest", like https://lodash.com/docs/4.17.11#sortedIndexOf

function baseFindClosestIndex<T>(
	haystack: T[],
	needle: Needle,
	filterMapFn?: FilterMapFn<T>
) {
	const needleObject = typeof needle === 'number'
		? { target: needle }
		: needle;
	const {
		target,
		threshold = 0,
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

		const distance = Math.abs(value - target);

		if (distance <= threshold) {
			return index;
		}

		if (
			distance < closest.distance ||
			// TODO: tieBreaker would be more flexible with a way to also access the raw array items being compared
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
export function findClosestIndex(
	haystack: number[],
	needle: Needle,
	filterMapFn?: FilterMapFn<number>
): number;
export function findClosestIndex<T>(
	haystack: T[],
	needle: Needle,
	filterMapFn: FilterMapFnStrict<T>
): number;
export function findClosestIndex<T>(
	haystack: T[],
	needle: Needle,
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
	needle: Needle,
	filterMapFn?: FilterMapFn<number>
): number;
export function findClosest<T>(
	haystack: T[],
	needle: Needle,
	filterMapFn: FilterMapFnStrict<T>
	): T;
export function findClosest<T>(
	haystack: T[],
	needle: Needle,
	filterMapFn?: FilterMapFn<T>
): T | number {
	return haystack[baseFindClosestIndex(haystack, needle, filterMapFn)];
}

export default findClosest;
