import { findClosest, findClosestIndex } from './findClosest';

describe('findClosestIndex', () => {
	describe('findClosestIndex(Array, Number)', () => {
		describe('exact matches', () => {
			test('returns an exact match if found', () => {
				const array = [0, 10, 20, 30];
				expect(findClosestIndex(array, 20)).toBe(2);
			});
			test('returns first match', () => {
				const array = [0, 10, 20, 30, 20];
				expect(findClosestIndex(array, 20)).toBe(2);
			});
		});

		describe('rounding', () => {
			test('rounds up correctly', () => {
				const array = [0, 10, 20];
				expect(findClosestIndex(array, -100)).toBe(0);
				expect(findClosestIndex(array, 5.01)).toBe(1);
				expect(findClosestIndex(array, 16)).toBe(2);
			});
			test('rounds down correctly', () => {
				const array = [0, 10, 20];
				expect(findClosestIndex(array, 4)).toBe(0);
				expect(findClosestIndex(array, 14.99)).toBe(1);
				expect(findClosestIndex(array, 100)).toBe(2);
			});
			test('returns the first index of closest match when rounding up', () => {
				const array = [20, 10, 0, 10, 20];
				expect(findClosestIndex(array, 16)).toBe(0);
				expect(findClosestIndex(array, 5.01)).toBe(1);
			});
			test('returns the first index of closest match when rounding down', () => {
				const array = [10, 0, 10, 20, 10, 0];
				expect(findClosestIndex(array, 14.99)).toBe(0);
				expect(findClosestIndex(array, 2)).toBe(1);
			});
			test('doesn\'t round up/ down at halfway points', () => {
				expect(findClosestIndex([10, 20], 15)).toBe(0);
				expect(findClosestIndex([20, 10], 15)).toBe(0);
			});
		});

		describe('no matches', () => {
			test('returns -1 if no result found', () => {
				expect(findClosestIndex([], 20)).toBe(-1);
			});
		});

		describe('needle options', () => {
			test('target', () => {
				expect(findClosestIndex([60, 80, 90, 100], { target: 88 })).toBe(2);
			});

			test('min', () => {
				expect(findClosestIndex([60, 80, 90], { target: 68, min: 65 })).toBe(1);
				expect(findClosestIndex([1, 2, 3], { target: 10, min: 5 })).toBe(-1);
			});

			test('max', () => {
				expect(findClosestIndex([60, 80, 90], { target: 88, max: 85 })).toBe(1);
				expect(findClosestIndex([1, 2, 3], { target: 10, max: 2 })).toBe(1);
				expect(findClosestIndex([10, 11, 12], { target: 10, max: 2 })).toBe(-1);
			});

			test('tieBreaker', () => {
				expect(findClosestIndex([-2, 2], { target: 0, tieBreaker: (a, b) => a < b })).toBe(0);
				expect(findClosestIndex([-2, 2], { target: 0, tieBreaker: (a, b) => a > b })).toBe(1);
			});
		});
	});

	describe('findClosestIndex(Array, Number, Function)', () => {
		test('basic mapping callback functionality works', () => {
			expect(findClosestIndex(
				[
					{ product: { price: 0 } },
					{ product: { price: 10 } },
					{ product: { price: 20 } },
					{ product: { price: 30 } }
				],
				22,
				item => item.product.price
			)).toBe(2);
		});

		test('mapping callback parameters are correct', () => {
			const array = [6];
			findClosestIndex(
				array,
				6,
				(value, i, collection) => {
					expect(value).toBe(6);
					expect(i).toBe(0);
					expect(collection).toBe(array);

					return value;
				}
			);
		});
	});
});

describe('findClosest', () => {
	test('works the same as findClosestIndex but returns the actual item for basic operations', () => {
		expect(findClosest([0, 10, 20], -100)).toBe(0);
		expect(findClosest([0, 10, 20], 5.01)).toBe(10);
		expect(findClosest([0, 10, 20], 10)).toBe(10);
		expect(findClosest([0, 10, 20], 16)).toBe(20);
		expect(findClosest([], 10)).toBeUndefined();
	});

	test('map callback works', () => {
		expect(findClosest(['foo', 'hello', 'bar'], 10, str => str.length)).toBe('hello');
	});

	describe('needle options', () => {
		test('target', () => {
			expect(findClosest([60, 80, 90, 100], { target: 88 })).toBe(90);
		});

		test('min', () => {
			expect(findClosest([60, 80, 90], { target: 68, min: 65 })).toBe(80);
			expect(findClosest([1, 2, 3], { target: 10, min: 5 })).toBeUndefined();
		});

		test('max', () => {
			expect(findClosest([60, 80, 90], { target: 88, max: 85 })).toBe(80);
			expect(findClosest([1, 2, 3], { target: 10, max: 2 })).toBe(2);
			expect(findClosest([10, 11, 12], { target: 10, max: 2 })).toBeUndefined();
		});

		describe('tieBreaker', () => {
			test('breaks tie where one exists', () => {
				expect(findClosest([-2, 2], { target: 0, tieBreaker: (a, b) => a < b })).toBe(-2);
				expect(findClosest([-2, 2], { target: 0, tieBreaker: (a, b) => a > b })).toBe(2);
			});

			test('works with mapCallback argument', () => {
				const sizes = [{ size: -2 }, { size: 2 }];

				expect(findClosest(
					sizes,
					{ target: 0, tieBreaker: (a, b) => a < b },
					({ size }) => size
				)).toBe(sizes[0]);

				expect(findClosest(
					sizes,
					{ target: 0, tieBreaker: (a, b) => a > b },
					({ size }) => size
				)).toBe(sizes[1]);
			});

			test('expected result returned for 0 or 1 argument', () => {
				expect(findClosest([], { target: 0, tieBreaker: (a, b) => a > b })).toBe(undefined);
				expect(findClosest([2], { target: 0, tieBreaker: (a, b) => a > b })).toBe(2);
			});

			test('returning false acts the same as having no tie breaker', () => {
				expect(findClosest([-2, 2], { target: 0, tieBreaker: () => false })).toBe(-2);
				expect(findClosest([6], { target: 0, tieBreaker: () => false })).toBe(6);
			});

			test('returning true will pick the last best non-zero match', () => {
				// If this behavior is desired, it's probably better to just reverse the input array.
				// TODO: Is this a useful option to add to the options?
				expect(findClosest([-2, 2], { target: 0, tieBreaker: () => true })).toBe(2);
				expect(findClosest([-2, 2], { target: -2, tieBreaker: () => true })).toBe(-2);
			});
		});
	});
});
