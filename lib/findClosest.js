import { findClosestIndex, createFindClosestIndex } from './findClosestIndex';

/**
 * Pass a function that returns an index from an array.
 *
 * The function is wrapped to return the actual array value instead.
 *
 * @param {Function} fn
 * @return {Function}
 */
const proxyIndexFunction = (fn) => {
	function findClosest(array, valueToFind, getValue) {
		return array[fn(array, valueToFind, getValue)];
	}

	return findClosest;
};

/**
 * @param {Array} array
 * @param {*} valueToFind
 * @param {function} [getValue]
 * @return {*}
 */
export const findClosest = proxyIndexFunction(findClosestIndex);

/**
 * @param {Function} getDistance
 * @return {Function}
 */
export const createFindClosest = (getDistance) =>
	proxyIndexFunction(createFindClosestIndex(getDistance));
