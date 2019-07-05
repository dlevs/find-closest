# find-closest

This module provides functions equivalent to `Array.prototype.find` and `Array.prototype.findIndex`, but for finding the closest value where an exact match may not exist.

## Installation

`npm install find-closest`

## Usage

### Basic usage

The default behaviour is to compare numbers in an array to the target number provided. The closest match is returned:

```javascript
import { findClosest, findClosestIndex } from 'find-closest';

findClosest([0, 10, 20, 30], 12);
// => 10

findClosestIndex([0, 10, 20, 30], 12);
// => 1
```

### Mapping and filtering

An optional `filterMapFn` function can be passed to compare non-number values to the target:

```javascript
const pets = [
    { name: 'Fluffy', age: 10 },
    { name: 'Biscuit', age: 6 },
    { name: 'Wilbur', age: 12 }
];

findClosest(pets, 7, ({ age }) => age);
// => { name: 'Biscuit', age: 6 }
```

Additionally, returning `false` from this function omits the value:

```javascript
const isGreaterThan10 = n => n > 10;

findClosest([0, 10, 20, 30], 12);
// => 10

findClosest([0, 10, 20, 30], 12, isGreaterThan10);
// => 20
```

The filtering _and_ mapping can be performed by the same function:

```javascript
const pets = [
    { name: 'Fluffy', age: 10 },
    { name: 'Biscuit', age: 6 },
    { name: 'Wilbur', age: 12 }
];

findClosest(pets, 7, ({ age }) => {
  if (age < 7) {
    return false;
  }
  return age;
});
// => { name: 'Fluffy', age: 10 }
```

**Note** that, unless the values in the array are all numbers, the `filterMapFn` cannot return `true`.

#### Performance

The `filterMapFn` argument has potential performance gains over calling `.map().filter()` on the input array:

- Mapping and filtering happen in a single pass.
- The mapping is executed lazily. If a perfect match is found before reaching the end of the array, unnecessary calculations are avoided.

### Needle options

The second argument (the "needle" to find in the "haystack" array) may be either a number, or an object with extra rules.

#### options.target

Define the target value to find. These two are equivalent:

```javascript
findClosest([0, 10, 20, 30], 12); // => 10
findClosest([0, 10, 20, 30], { target: 12 }); // => 10
```

However, with this object notation, additional restrictions can be applied…

#### options.tieBreaker

When two options are equally close to the `target`, the `tieBreaker` function can be used to determine which is preferred.

```javascript
findClosest([0, 10, 20, 30], {
  target: 15,
  tieBreaker: (a, b) => a < b
});
// => 10

findClosest([0, 10, 20, 30], {
  target: 15,
  tieBreaker: (a, b) => a > b
});
// => 20
```

**Note**, for arrays of non-number values, the `tieBreaker` function is passed the number representation of each item in the array as derived from the third argument mapping function, not the array items themselves.

#### options.threshold

If a value is found that is equal to the target value, it is immediately returned without searching the rest of the array. For performance reasons, you may wish for the same behaviour for values that are "close enough" (but not perfect) matches. This can be done with the `threshold` option:

```javascript
findClosest([0, 10, 20, 30, ...aVeryVeryLongArray], {
  target: 11,
  threshold: 2
});
// => 10
```

In the above example, none of the values after `10` are iterated over.

#### options.reverse

The `reverse` option starts the search from the end of the array:

```javascript
findClosest([0, 5, 15, 20], 10);
// => 5

findClosest([0, 5, 15, 20], { target: 10, reverse: true });
// => 15
```
