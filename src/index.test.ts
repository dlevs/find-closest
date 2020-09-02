import { findClosest, findClosestIndex } from './index'
import { findClosestRaw, findClosestIndexRaw } from './findClosest'
import type { Finder, FinderNonOverloaded } from './types'

/**
 * Get a function which will assert that both `findClosest` and
 * `findClosestIndex` will return the correct value associated
 * with `expectedIndex`.
 *
 * Return the value to conform to the `Finder` type, so that
 * the types can be tested too.
 */
function testFindClosest(expectedIndex: number): Finder<'value'> {
  const wrappedFindClosest: FinderNonOverloaded<'value'> = (...args) => {
    const [array] = args
    expect(findClosestIndexRaw(...args)).toBe(expectedIndex)
    const findClosestResult = findClosestRaw(...args)
    expect(findClosestResult).toBe(array[expectedIndex])
    return findClosestResult
  }
  return wrappedFindClosest
}

/**
 * Get TypeScript compiler to throw an error when type does not match.
 */
function expectType<T>(_value: T): void {}

// Validate that `testFindClosest` has the same signature as `findClosest` and
// can therefore be used to test the type of `findClosest`.
expectType<typeof findClosest>(testFindClosest(1))

// Quick proof that `findClosestIndex` return type is a number.
expectType<number>(findClosestIndex(['foo', 'barr'], 2, (str) => str.length))

describe('findClosest / findClosestIndex', () => {
  describe('basic functionality', () => {
    describe('exact matches', () => {
      test('returns an exact match if found', () => {
        expectType<number>(testFindClosest(2)([0, 10, 20, 30], 20))
      })
      test('returns first match', () => {
        expectType<number>(testFindClosest(2)([0, 10, 20, 30, 20], 20))
      })
    })
    describe('no matches', () => {
      test('returns -1 if no result found', () => {
        expectType<number>(testFindClosest(-1)([], 20))
        expectType<number>(testFindClosest(-1)([10], 10, () => false))
      })
    })
    describe('rounding', () => {
      test('rounds up correctly', () => {
        expectType<number>(testFindClosest(0)([0, 10, 20], -100))
        expectType<number>(testFindClosest(1)([0, 10, 20], 5.01))
        expectType<number>(testFindClosest(2)([0, 10, 20], 16))
      })
      test('rounds down correctly', () => {
        expectType<number>(testFindClosest(0)([0, 10, 20], 4))
        expectType<number>(testFindClosest(1)([0, 10, 20], 14.99))
        expectType<number>(testFindClosest(2)([0, 10, 20], 100))
      })
      test('returns the first index of closest match when rounding up', () => {
        expectType<number>(testFindClosest(0)([20, 10, 0, 10, 20], 16))
        expectType<number>(testFindClosest(1)([20, 10, 0, 10, 20], 5.01))
      })
      test('returns the first index of closest match when rounding down', () => {
        expectType<number>(testFindClosest(0)([10, 0, 10, 20, 10, 0], 14.99))
        expectType<number>(testFindClosest(1)([10, 0, 10, 20, 10, 0], 2))
      })
      test("doesn't round up/ down at halfway points", () => {
        expectType<number>(testFindClosest(0)([10, 20], 15))
        expectType<number>(testFindClosest(0)([20, 10], 15))
      })
    })
  })
  describe('filterMapFn', () => {
    test('basic mapping callback functionality works', () => {
      expectType<string>(
        testFindClosest(1)(['foo', 'hello', 'bar'], 10, (str) => str.length)
      )
      expectType<string | number>(
        testFindClosest(0)(['foo', 8], 2, (value) => String(value).length)
      )
      expectType<{ product: { price: number } }>(
        testFindClosest(2)(
          [
            { product: { price: 0 } },
            { product: { price: 10 } },
            { product: { price: 20 } },
            { product: { price: 30 } },
          ],
          22,
          (item) => item.product.price
        )
      )
    })
    test('filtering works', () => {
      expectType<number>(testFindClosest(1)([2, 4, 6], 10, (n) => n * 3))
      expectType<number>(testFindClosest(0)([60, 80, 90], 68, (n) => n < 65))
      expectType<number>(testFindClosest(1)([60, 80, 90], 68, (n) => n > 65))
      expectType<number>(testFindClosest(-1)([1, 2, 3], 10, (n) => n > 5))
    })
    test('returning true for non-numbers throws an error', () => {
      // @ts-expect-error
      expect(() => testFindClosest(null)(['10'], 10, () => true)).toThrow()
      expect(() => testFindClosest(-1)(['10'], 10, () => false)).not.toThrow()
      expect(() => testFindClosest(0)([10], 10, () => true)).not.toThrow()
      expect(() => testFindClosest(-1)([10], 10, () => false)).not.toThrow()
    })
    test('not providing a filterMapFn parameter causes an error for non-number arrays', () => {
      // @ts-expect-error
      expect(() => testFindClosest(null)(['10'], 10)).toThrow()
      expect(() =>
        // @ts-expect-error
        testFindClosest(null)([new Date(), new Date(0)], 0)
      ).toThrow()
    })
    test('mapping callback parameters are correct', () => {
      const collection = [6]
      testFindClosest(0)(collection, 5, (value, context) => {
        expect(value).toBe(6)
        expect(context).toMatchObject({
          collection,
          index: 0,
          target: 5,
        })
        return value
      })
    })
  })
})
