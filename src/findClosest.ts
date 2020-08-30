import type { FinderNonOverloaded } from './types'

export const findClosestIndexRaw: FinderNonOverloaded<'index'> = (
  collection,
  target,
  filterMapFn
) => {
  let closest = {
    index: -1,
    distance: Number.POSITIVE_INFINITY,
    value: 0,
  }

  for (let index = 0; index < collection.length; index++) {
    const rawValue = collection[index]
    let value: number

    if (filterMapFn) {
      const mappedValue = filterMapFn(rawValue, {
        index,
        target,
        collection,
      })

      switch (mappedValue) {
        case false:
          continue
        case true:
          if (typeof rawValue !== 'number') {
            throw new TypeError(
              `\`filterMapFn\` returned \`true\` for non-number value \`${rawValue}\`.`
            )
          }
          value = rawValue
          break
        default:
          value = mappedValue
      }
    } else {
      if (typeof rawValue !== 'number') {
        throw new TypeError(
          `Array contains non-number value \`${rawValue}\` without a \`filterMapFn\` to map it to a number.`
        )
      }
      value = rawValue
    }

    const distance = Math.abs(value - target)

    if (distance === 0) {
      return index
    }

    if (distance < closest.distance) {
      closest = { index, distance, value }
    }
  }

  return closest.index
}

export const findClosestRaw: FinderNonOverloaded<'value'> = (...args) =>
  args[0][findClosestIndexRaw(...args)]
