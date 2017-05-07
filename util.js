/**
 * Returns the inputed `value` parameter.
 *
 * @param {*} value
 * @return {value}
 */
export const returnValue = (value) => value;

/**
 * Like Array.prototype.reducer, but it assumes that the final return value will
 * always be one of the array's values.
 *
 * Because of this, we can omit the initial value normally required by
 * Array.prototype.reducer.
 *
 * @param {Array} array
 * @param {Function} reducer
 * @return {*}
 */
export const reduceToOne = (array, reducer) => {
	return array.slice(1).reduce(reducer, array[0]);
};

/**
 * Compare the absolute values of two numbers, and returns the largest.
 *
 * @param {{value: Number}} largest
 * @param {{value: Number}} current
 * @return {Number}
 */
export const getLargestItem = (largest, current) =>
	Math.abs(current.value) > Math.abs(largest.value) ? current : largest;

/**
 * Get the difference between two numbers.
 *
 * @param {Number} n1
 * @param {Number} n2
 * @return {Number}
 */
export const getNumberDifference = (n1, n2) => Math.abs(n1 - n2);
