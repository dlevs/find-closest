import findClosestIndex, {
	createFindClosestIndex,
	getNumberDistance
} from './findClosestIndex';
import levenshtein from 'fast-levenshtein';

describe('getNumberDistance', () => {
	test('correctly returns the distance between two numbers', () => {
		expect(getNumberDistance(0, 10)).toBe(10);
		expect(getNumberDistance(10, 0)).toBe(10);
		expect(getNumberDistance(-10, 10)).toBe(20);
		expect(getNumberDistance(10, -10)).toBe(20);
		expect(getNumberDistance(0.5, -10)).toBe(10.5);
	})
});

describe('findClosestIndex', () => {

	describe('meta', () => {
		test('function is named', () => {
			expect(findClosestIndex.name).toBe('findClosestIndex');
		});
	});

	describe('baisc functionality', () => {
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
		test('rounds up correctly', () => {
			const collection = [0, 10, 20, 30, 40, 60, 50, 30];
			expect(findClosestIndex(collection, 15)).toBe(2);
			expect(findClosestIndex(collection, 55)).toBe(5);
		});

		test('rounds down correctly', () => {
			const collection = [0, 10, 20, 30, 40, 60, 50, 30];
			expect(findClosestIndex(collection, 24.9999)).toBe(2);
			expect(findClosestIndex(collection, 54.9999)).toBe(6);
		});

		test('returns the lowest value if value is less than all in collection', () => {
			const collection = [0, 10, 20, 30];
			expect(findClosestIndex(collection, -100)).toBe(0)
		});

		test('returns the highest value if value is greater than all in collection', () => {
			const collection = [0, 30, 10, 20];
			expect(findClosestIndex(collection, 100)).toBe(1)
		});
	});

	describe('edge case behaviour', () => {
		test('returns the first best match', () => {
			const collection = [0, 10, 20, 30, 40, 30];

			expect(findClosestIndex(collection, 34)).toBe(3);
			expect(findClosestIndex(collection, 30)).toBe(3);
			expect(findClosestIndex(collection, 25)).toBe(3);
		});

		test('returns -1 if no result found', () => {
			expect(findClosestIndex([], 20)).toBe(-1)
		});
	});

});

describe('createFindClosestIndex', () => {

	describe('basic functionality', () => {
		test('custom distance calculator works', () => {
			const returnFirstIndex = createFindClosestIndex(() => 0, () => 0);
			expect(returnFirstIndex([0, 10, 20, 30, 0])).toBe(0);
			expect(returnFirstIndex([10, 20, 30, 10])).toBe(0);
		});
	});

	describe('omitting the tie-breaker parameter', () => {
		test('leads to the index of the first instance of the lowest distance being returned', () => {
			const findLowestIndex = createFindClosestIndex((value) => value);
			expect(findLowestIndex([100, 50, 0, 25, 0])).toBe(2);
		});

		// 0 is handled differently. Test with an array without zeros.
		test('leads to the index of the first instance of the lowest distance being returned, in an array with no zero distances', () => {
			const findLowestIndex = createFindClosestIndex((value) => value);
			expect(findLowestIndex([100, 50, 10, 25, 10])).toBe(2);
		});
	});

	describe('usage with a 3rd party levenshtein module', () => {
		const tiebreakerGetLongest = (closest, current) => current.length > closest.length;
		const findClosestWord = createFindClosestIndex(levenshtein.get, tiebreakerGetLongest);

		test('works as expected', () => {
			expect(findClosestWord(['doop', 'foo', 'bar'], 'foo')).toBe(1);
			expect(findClosestWord(['doop', 'food', 'bar'], 'foo')).toBe(1);
			expect(findClosestWord(['foooo', 'fod', 'food', 'ooo'], 'foo')).toBe(2);
		});
	});

});
