import findClosest, {
	findClosest as findClosestNamed,
	findClosestIndex,
	// TODO: Rename defaultCompare?
	defaultCompare
} from './index';
import levenshtein from 'fast-levenshtein';


describe('default export', () => {
	test('is same as named `findClosest` export', () => {
		expect(findClosestNamed).toBe(findClosest);
	});
});

describe('findClosestIndex', () => {
	test('function is named', () => {
		expect(findClosestIndex.name).toBe('findClosestIndex');
	});

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
				// This test is not a requirement; it is just documenting current
				// behaviour. If rounding were to be done, the function becomes much
				// more complex. For many use cases, it is unnecessary.
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

	describe('findClosestIndex(Array, Number, String)', () => {
		test('string getters work for shallow properties', () => {
			const array = [
				{price: 0},
				{price: 10},
				{price: 20},
				{price: 30}
			];
			expect(findClosestIndex(array, 22, 'price')).toBe(2);
		});
		test('string getters work for nested properties', () => {
			const array = [
				{product: {price: 0}},
				{product: {price: 10}},
				{product: {price: 20}},
				{product: {price: 30}}
			];
			expect(findClosestIndex(array, 22, 'product.price')).toBe(2);
		});
	});

	describe('findClosestIndex(Array, Number, Array)', () => {
		test('array getters work', () => {
			const array = [
				{product: {price: 0}},
				{product: {price: 10}},
				{product: {price: 20}},
				{product: {price: 30}}
			];
			expect(findClosestIndex(array, 22, ['product', 'price'])).toBe(2);
		});
	});

	describe('findClosestIndex(Array, *, Function)', () => {
		test('simple function getter works', () => {
			const array = [
				{product: {price: 0}},
				{product: {price: 10}},
				{product: {price: 20}},
				{product: {price: 30}}
			];
			const comparer = (item, needle) =>
				defaultCompare(item.product.price, needle);

			expect(findClosestIndex(array, 22, comparer)).toBe(2);
		});
		test('works with a 3rd party levenshtein module', () => {
			const names = ['jim', 'bob', 'don', 'laura'];
			expect(findClosestIndex(names, 'dan', levenshtein.get)).toBe(2);
		});
		test('works with a 3rd party levenshtein module for nested properties', () => {
			const names = [
				{user: {name: 'jim'}},
				{user: {name: 'bob'}},
				{user: {name: 'don'}},
				{user: {name: 'laura'}}
			];
			const comparer = (item, needle) =>
				levenshtein.get(item.user.name, needle);

			expect(findClosestIndex(names, 'dan', comparer)).toBe(2);
		});
	});
});

describe('findClosest', () => {
	test('works the same as findClosestIndex but returns the actual item', () => {
		const nested = [
			{foo: {bar: 0}},
			{foo: {bar: 10}},
			{foo: {bar: 20}}
		];
		expect(findClosest([0, 10, 20], -100)).toBe(0);
		expect(findClosest([0, 10, 20], 5.01)).toBe(10);
		expect(findClosest([0, 10, 20], 10)).toBe(10);
		expect(findClosest([0, 10, 20], 16)).toBe(20);
		expect(findClosest(nested, 11, 'foo.bar')).toEqual({foo: {bar: 10}});
	});
});

describe('defaultCompare', () => {
	test('returns the difference between two numbers', () => {
		expect(defaultCompare(0, 10)).toBe(10);
		expect(defaultCompare(10, 0)).toBe(10);
		expect(defaultCompare(-10, 10)).toBe(20);
		expect(defaultCompare(10, -10)).toBe(20);
		expect(defaultCompare(0.5, -10)).toBe(10.5);
	})
});
