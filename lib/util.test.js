import {
	returnValue,
	getNumberDifference
} from './util';

describe('getNumberDifference', () => {
	test('correctly returns the difference between two numbers', () => {
		expect(getNumberDifference(0, 10)).toBe(10);
		expect(getNumberDifference(10, 0)).toBe(10);
		expect(getNumberDifference(-10, 10)).toBe(20);
		expect(getNumberDifference(10, -10)).toBe(20);
		expect(getNumberDifference(0.5, -10)).toBe(10.5);
	})
});

describe('returnValue', () => {
	test('returns first argument', () => {
		expect(returnValue(1, 2, 3, 4, 5)).toBe(1);
	})
});

