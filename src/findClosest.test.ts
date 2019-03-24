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
	test('works the same as findClosestIndex but returns the actual item', () => {
		expect(findClosest([0, 10, 20], -100)).toBe(0);
		expect(findClosest([0, 10, 20], 5.01)).toBe(10);
		expect(findClosest([0, 10, 20], 10)).toBe(10);
		expect(findClosest([0, 10, 20], 16)).toBe(20);
		expect(findClosest(['foo', 'hello', 'bar'], 10, str => str.length)).toBe('hello');
		expect(findClosest([], 10)).toBeUndefined();
	});
});
