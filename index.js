// Imports
const get = require('lodash.get');


// Exports
module.exports = findClosest;
module.exports.findClosest = findClosest;
module.exports.findClosestIndex = findClosestIndex;
module.exports.defaultCompare = defaultCompare;


// Functions
/**
 * Gets the difference between two numbers.
 *
 * @param {Number} n1
 * @param {Number} n2
 * @return {Number}
 */
const defaultCompare = (n1, n2) => Math.abs(n1 - n2);

/**
 * Returns a function which will act like `defaultCompare`, except a property
 * from the first argument is used instead of the entire first argument value.
 *
 * @private
 * @param {String} property
 * @return {Function}
 */
const createComparerForProperty = (property) => (n1Object, n2) =>
	defaultCompare(get(n1Object, property), n2);

/**
 * Returns the index of the item in an array that is closest in likeness to
 * the `needle` parameter.
 *
 * @param {Array} haystack
 * @param {*} needle
 * @param {Function|String|Array} [comparer]
 * @return {Number}
 */
const findClosestIndex = (haystack, needle, comparer = defaultCompare) => {
	if (typeof comparer !== 'function') {
		// Comparer is a string or array. Make a compare function that uses this
		// property from the array items.
		comparer = createComparerForProperty(comparer);
	}

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
			closest = {index: i, distance};
		}
	}

	return closest.index;
};

/**
 * A wrapper around `findClosestIndex`.
 *
 * Returns the actual array item instead of its index.
 *
 * @param {Array} array
 * @param {*} needle
 * @param {Function|String|Array} [comparer]
 * @return {*}
 */
const findClosest = (array, needle, comparer) =>
	array[findClosestIndex(array, needle, comparer)];
