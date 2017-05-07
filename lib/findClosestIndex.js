import {
	returnValue,
	getNumberDifference
} from './util';

/**
 * Creates a function which can be used to search an array for the closest
 * match.
 *
 * Accepts a function to use to determine how close each array value is to the
 * value to find.
 *
 * @param {Function} getDistance
 * @return {Function}
 */
export const createFindClosestIndex = (getDistance) => {
	function findClosestIndex(array, valueToFind, getValue = returnValue) {
		let closest = {
			index: -1,
			distance: Number.POSITIVE_INFINITY
		};

		for (let i = 0; i < array.length; i++) {
			const distance = getDistance(getValue(array[i]), valueToFind);

			if (distance === 0) {
				return i;
			}

			if (distance < closest.distance) {
				closest = {index: i, distance};
			}
		}

		return closest.index;
	}

	return findClosestIndex;
};

/**
 * Returns the index of the item in an array that is closest in likeness to
 * the `valueToFind` parameter.
 *
 * @example
 * findClosestIndex([0, 10, 20], 11)
 * // returns 1
 *
 * findClosestIndex(
 *     [{n: 0}, {n: 10}, {n: 20}],
 *     11,
 *     item => item.n
 * );
 * // returns 1
 *
 * @param {Array} array
 * @param {*} valueToFind
 * @param {function} [getValue]
 * @return {Number}
 */
export const findClosestIndex = createFindClosestIndex(getNumberDifference);
