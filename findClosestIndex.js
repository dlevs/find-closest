const returnValue = (value) => value;

const tieBreak = (items, tieBreaker) => {
	let closest = items[0];

	for (let i = 1; i < items.length; i++) {
		if (tieBreaker(closest.value, items[i].value)) {
			closest = items[i];
		}
	}

	return closest.index;
};

const tiebreakerGetBiggest = (closest, current) =>
	(Math.abs(current) > Math.abs(closest));

export const getNumberDistance = (n1, n2) => Math.abs(n1 - n2);

export const createFindClosestIndex = (getDistance, distanceTieBreaker) => {
	return function findClosestIndex(collection, valueToFind, getValue = returnValue) {
		let closest = {
			distance: Number.POSITIVE_INFINITY,
			items: [{index: -1}]
		};

		for (let i = 0; i < collection.length; i++) {
			const value = getValue(collection[i]);
			const distance = getDistance(value, valueToFind);

			if (distance === 0) {
				return i;
			}

			if (distance === closest.distance) {
				closest.items.push({value, index: i});
			} else if (distance < closest.distance) {
				closest = {
					distance,
					items: [{value, index: i}]
				};
			}
		}

		if (closest.items.length === 1) {
			return closest.items[0].index;
		}

		return distanceTieBreaker
			// TODO: add advanced tie breaker back
			? tieBreak(closest.items, distanceTieBreaker)
			: closest.items[0].index;
	};
};

export default createFindClosestIndex(getNumberDistance, tiebreakerGetBiggest);
