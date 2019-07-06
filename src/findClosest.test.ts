import { findClosest, findClosestIndex } from './findClosest';

const runTests = (label: string, conditions: any) => {
	if (conditions instanceof Array) {
		test(label, () => {
			conditions.forEach(condition => {
				if (typeof condition === 'function') {
					condition(findClosestIndex);
					condition(findClosest);
				} else {
					const { index, args: [array, target, filterMapFn] } = condition;
					expect(findClosestIndex(array, target, filterMapFn)).toBe(index);
					expect(findClosest(array, target, filterMapFn)).toBe(array[index]);
				}
			});
		});
	} else {
		describe(label, () => {
			Object.keys(conditions).forEach(key => {
				runTests(key, conditions[key]);
			});
		});
	}
};

runTests('findClosest / findClosestIndex', {
	'basic functionality': {
		'exact matches': {
			'returns an exact match if found': [
				{ index: 2, args: [[0, 10, 20, 30], 20] }
			],
			'returns first match': [
				{ index: 2, args: [[0, 10, 20, 30, 20], 20] }
			]
		},
		'no matches': {
			'returns -1 if no result found': [
				{ index: -1, args: [[], 20] },
				{ index: -1, args: [[10], 10, () => false] }
			]
		},
		rounding: {
			'rounds up correctly': [
				{ index: 0, args: [[0, 10, 20], -100] },
				{ index: 1, args: [[0, 10, 20], 5.01] },
				{ index: 2, args: [[0, 10, 20], 16] }
			],
			'rounds down correctly': [
				{ index: 0, args: [[0, 10, 20], 4] },
				{ index: 1, args: [[0, 10, 20], 14.99] },
				{ index: 2, args: [[0, 10, 20], 100] }
			],
			'returns the first index of closest match when rounding up': [
				{ index: 0, args: [[20, 10, 0, 10, 20], 16] },
				{ index: 1, args: [[20, 10, 0, 10, 20], 5.01] }
			],
			'returns the first index of closest match when rounding down': [
				{ index: 0, args: [[10, 0, 10, 20, 10, 0], 14.99] },
				{ index: 1, args: [[10, 0, 10, 20, 10, 0], 2] }
			],
			'doesn\'t round up/ down at halfway points': [
				{ index: 0, args: [[10, 20], 15] },
				{ index: 0, args: [[20, 10], 15] }
			]
		}
	},
	filterMapFn: {
		'basic mapping callback functionality works': [
			{ index: 1, args: [['foo', 'hello', 'bar'], 10, (str: string) => str.length] },
			{
				index: 2,
				args: [
					[
						{ product: { price: 0 } },
						{ product: { price: 10 } },
						{ product: { price: 20 } },
						{ product: { price: 30 } }
					],
					22,
					(item: any) => item.product.price
				]
			}
		],
		'filtering works': [
			{ index: 1, args: [[2, 4, 6], 10, (n: number) => n * 3] },
			{ index: 0, args: [[60, 80, 90], 68, (n: number) => n < 65] },
			{ index: 1, args: [[60, 80, 90], 68, (n: number) => n > 65] },
			{ index: -1, args: [[1, 2, 3], 10, (n: number) => n > 5] }
		],
		'returning true for non-numbers throws an error': [
			(fn: any) => expect(() => fn(['10'], 10, () => true)).toThrow(),
			(fn: any) => expect(() => fn(['10'], 10, () => false)).not.toThrow(),
			(fn: any) => expect(() => fn([10], 10, () => true)).not.toThrow(),
			(fn: any) => expect(() => fn([10], 10, () => false)).not.toThrow()
		],
		'mapping callback parameters are correct': [
			(fn: any) => {
				const array = [6];
				fn(
					array,
					6,
					(value: any, i: any, collection: any) => {
						expect(value).toBe(6);
						expect(i).toBe(0);
						expect(collection).toBe(array);

						return value;
					}
				);
			}
		]
	}
});

// TODO: Since removing function overloading, `undefined` must be manually specified. Fix:
const foo = findClosest([9, 4], 4);
const foo = findClosest([9, 4], 4, undefined);
console.log(foo);
