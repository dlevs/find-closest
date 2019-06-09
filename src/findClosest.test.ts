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

			test('threshold', () => {
				expect(findClosestIndex([10, 12, 16, 20], { target: 15 })).toBe(2);
				expect(findClosestIndex([10, 12, 16, 20], { target: 15, threshold: 2.99 })).toBe(2);
				expect(findClosestIndex([10, 12, 16, 20], { target: 15, threshold: 3 })).toBe(1);
				expect(findClosestIndex([10, 12, 16, 20], { target: 15, threshold: 3, reverse: true })).toBe(2);
				expect(findClosestIndex([10, 12, 16, 20], { target: 15, threshold: 4.99999, reverse: true })).toBe(2);
				expect(findClosestIndex([10, 12, 16, 20], { target: 15, threshold: 5, reverse: true })).toBe(3);
				expect(findClosestIndex([10, 12, 16, 20], { target: 15, threshold: 100, reverse: true })).toBe(3);
			});

			test('reverse', () => {
				expect(findClosestIndex([10, 20, 40, 50], { target: 30 })).toBe(1);
				expect(findClosestIndex([10, 20, 40, 50], { target: 30, reverse: true })).toBe(2);
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

			describe('tieBreaker', () => {
				test('breaks tie where one exists', () => {
					expect(findClosestIndex([-2, 2], { target: 0, tieBreaker: (a, b) => a < b })).toBe(0);
					expect(findClosestIndex([-2, 2], { target: 0, tieBreaker: (a, b) => a > b })).toBe(1);
				});

				test('works with mapCallback argument', () => {
					const array = [{ a: -2 }, { a: 2 }];

					expect(findClosestIndex(
						array,
						{ target: 0, tieBreaker: (a, b) => a < b },
						({ a }) => a
					)).toBe(0);

					expect(findClosestIndex(
						array,
						{ target: 0, tieBreaker: (a, b) => a > b },
						({ a }) => a
					)).toBe(1);
				});

				test('expected result returned for 0 or 1 argument', () => {
					expect(findClosestIndex([], { target: 0, tieBreaker: (a, b) => a > b })).toBe(-1);
					expect(findClosestIndex([2], { target: 0, tieBreaker: (a, b) => a > b })).toBe(0);
				});

				test('returning false acts the same as having no tie breaker', () => {
					expect(findClosestIndex([-2, 2], { target: 0, tieBreaker: () => false })).toBe(0);
					expect(findClosestIndex([6], { target: 0, tieBreaker: () => false })).toBe(0);
					expect(findClosestIndex([6, 10, 20], { target: 12, tieBreaker: () => false })).toBe(1);
				});

				test('returning true will pick the last best non-zero match', () => {
					expect(findClosestIndex([-2, 2, 8], { target: 0, tieBreaker: () => true })).toBe(1);
					expect(findClosestIndex([-2, 2, -2, 8], { target: 0, tieBreaker: () => true })).toBe(2);
					expect(findClosestIndex([-2, 2, 8], { target: -2, tieBreaker: () => true })).toBe(0);
				});
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

// Simple checks for `findClosest` are detailed below.
// In-depth tests should be performed against `findClosestIndex` instead
// (above), since the core functionality lives there.
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

		test('threshold', () => {
			const array = [{ a: 10 }, { a: 12 }, { a: 16 }, { a: 20 }];

			// TODO: Move mapCallback into "Needle" options object? It relates to _what_ is being found.
			expect(findClosest(array, { target: 15 }, ({ a }) => a)).toBe(array[2]);
			expect(findClosest(array, { target: 15, threshold: 3 }, ({ a }) => a)).toBe(array[1]);
		});

		test('reverse', () => {
			const array = [{ a: 10 }, { a: 20 }, { a: 40 }, { a: 50 }];

			expect(findClosest(array, { target: 30 }, ({ a }) => a)).toBe(array[1]);
			expect(findClosest(array, { target: 30, reverse: true }, ({ a }) => a)).toBe(array[2]);
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
		});
	});
});
