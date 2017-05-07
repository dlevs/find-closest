import { findClosest, createFindClosest } from './findClosest';
import levenshtein from 'fast-levenshtein';


describe('findClosest', () => {

	test('function is named', () => {
		expect(findClosest.name).toBe('findClosest');
	});

	test('returns values at the indexes expected from the `findClosestIndex` function', () => {
		const collection = [0, 10, 20, 30];
		expect(findClosest(collection, 20)).toBe(20);
		expect(findClosest(collection, 14)).toBe(10);
		expect(findClosest(collection, 22)).toBe(20);
	});

});

describe('createFindClosest', () => {

	describe('usage with a 3rd party levenshtein module', () => {
		const findClosestWord = createFindClosest(levenshtein.get);

		test('works as expected', () => {
			expect(findClosestWord(['jim', 'bob', 'don', 'laura'], 'dan')).toBe('don');
		});
	});

});
