import { findClosestIndex, createFindClosestIndex } from './findClosestIndex';
import levenshtein from 'fast-levenshtein';


describe('findClosestIndex', () => {

	describe('meta', () => {
		test('function is named', () => {
			expect(findClosestIndex.name).toBe('findClosestIndex');
		});
	});

	describe('basic functionality', () => {
		test('returns an exact match if found', () => {
			const collection = [0, 10, 20, 30];
			expect(findClosestIndex(collection, 20)).toBe(2)
		});

		test('returns an exact match if found, using a getter function for more complex arrays', () => {
			const collection = [
				{price: 0},
				{price: 10},
				{price: 20},
				{price: 30}
			];

			expect(findClosestIndex(collection, 20, ({price}) => price)).toBe(2)
		});
	});

	describe('rounding', () => {
		test('rounds up correctly, returning the first index of closest match', () => {
			const collection = [0, 10, 20, 30, 20, 60, 50, 60];
			expect(findClosestIndex(collection, 16)).toBe(2);
			expect(findClosestIndex(collection, 55.01)).toBe(5);
		});

		test('rounds down correctly, returning the first index of closest match', () => {
			const collection = [0, 10, 20, 30, 40, 60, 50, 30];
			expect(findClosestIndex(collection, 24)).toBe(2);
			expect(findClosestIndex(collection, 54.99)).toBe(6);
		});
	});

	describe('edge case behaviour', () => {
		test('returns the first best match', () => {
			const collection = [0, 10, 20, 30, 40, 30];

			expect(findClosestIndex(collection, 34)).toBe(3);
			expect(findClosestIndex(collection, 30)).toBe(3);
		});

		test('returns -1 if no result found', () => {
			expect(findClosestIndex([], 20)).toBe(-1)
		});

		test('doesn\'t round up/ down at halfway points', () => {
			// This test is not a requirement; it is just documenting current
			// behaviour. If rounding were to be done, the function becomes much
			// more complex. For many use cases, it is unnecessary.
			expect(findClosestIndex([10, 20], 15)).toBe(0);
			expect(findClosestIndex([20, 10], 15)).toBe(0);
		});
	});

});

describe('New API', () => {
	// TODO: Implement. Revise old tests.
	test('Works', () => {
		const collection = [
			{product: {price: 0}},
			{product: {price: 10}},
			{product: {price: 20}}
		];
		const comparePrice = (item, toFind) => {
			return compareNumbers(item.product.price, toFind);
		};

		// Simple
		findClosestIndex([0, 10, 20], 12);

		// String key
		findClosestIndex(collection, 12, 'product.price');

		// Array key
		findClosestIndex(collection, 12, ['product', 'price']);

		// Function getter. Can easily curry this.
		findClosestIndex(collection, 12, comparePrice);
		findClosestWord(['hallo', 'bonjour'], 'hello', levenshtein.get);
		
		// With currying
		const curried = _.curryRight(findClosestIndex);
		const findClosestPrice = curried(compareWords);
		const findClosestWord = curried(levenshtein.get);

		findClosestPrice(collection, 12);
		findClosestWord(['hallo', 'bonjour'], 'hello');
	});
});

describe('createFindClosestIndex', () => {

	describe('basic functionality', () => {
		test('custom distance calculator works', () => {
			const returnFirstIndex = createFindClosestIndex(() => 0);
			expect(returnFirstIndex([0, 10, 20, 30, 0])).toBe(0);
			expect(returnFirstIndex([10, 20, 30, 10])).toBe(0);
		});
	});

	describe('usage with a 3rd party levenshtein module', () => {
		const findClosestWord = createFindClosestIndex(levenshtein.get);

		test('works as expected', () => {
			expect(findClosestWord(['jim', 'bob', 'don', 'laura'], 'dan')).toBe(2);
		});
	});

});
