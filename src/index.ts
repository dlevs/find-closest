import { findClosestRaw, findClosestIndexRaw } from './findClosest'
import type { Finder } from './types'

/**
 * Returns the index of the item in an array that is closest to the value
 * specified by the `target` argument.
 */
export const findClosestIndex: Finder<'index'> = findClosestIndexRaw

/**
 * Returns the item in an array that is closest to the value specified by the
 * `target` argument.
 */
export const findClosest: Finder<'value'> = findClosestRaw

export default findClosest
