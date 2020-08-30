export interface Finder<R extends 'value' | 'index'> {
  (
    collection: readonly number[],
    target: number,
    filterMapFn?: FilterMapFn<number>
  ): number
  <T>(
    collection: readonly T[],
    target: number,
    filterMapFn: FilterMapFn<T, false>
  ): R extends 'value' ? T : number
}

/**
 * A type for underling functions that implement the overloaded
 * function signature `Finder`.
 *
 * This helps avoid "implicit 'any'" warnings - we don't need to define
 * these arguments over and over.
 *
 * If there's a better way to do this, please tell me!
 */
export type FinderNonOverloaded<R extends 'value' | 'index'> = <T>(
  collection: readonly T[],
  target: number,
  filterMapFn?: FilterMapFn<T>
) => R extends 'value' ? T : number

export type FilterMapFn<T, R extends boolean = boolean> = (
  value: T,
  context: {
    index: number
    target: number
    collection: readonly T[]
  }
) => number | R
