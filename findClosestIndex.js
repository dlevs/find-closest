import {
	returnValue,
	getNumberDifference,
	getLargestItem,
	reduceToOne
} from './util';

/**
 * Creates a function which returns
 *
 * @param {Function} getDistance
 * @param {Function} [distanceTieBreaker]
 * @return {Function}
 */
export const createFindClosestIndex = (getDistance, distanceTieBreaker) => {
	return function findClosestIndex(array, valueToFind, getValue = returnValue) {
		let closest = {
			distance: Number.POSITIVE_INFINITY,
			items: []
		};

		for (let i = 0; i < array.length; i++) {
			const item = array[i];
			const value = getValue(item);
			const distance = getDistance(value, valueToFind);

			if (distance === 0) {
				return i;
			}

			if (distance === closest.distance) {
				closest.items.push({item, value, index: i});
			} else if (distance < closest.distance) {
				closest = {
					distance,
					items: [{item, value, index: i}]
				};
			}
		}

		switch (closest.items.length) {
			case 0:
				return -1;
			case 1:
				return closest.items[0].index;
			default:
				return distanceTieBreaker
					? reduceToOne(closest.items, distanceTieBreaker).index
					: closest.items[0].index;
		}

	};
};

export default createFindClosestIndex(getNumberDifference, getLargestItem);
