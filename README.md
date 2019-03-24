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

### More complex arrays

The second argument to `findClosest` is always a number [(or an object that defines a number and some extra restrictions)](#needle-options). An optional `mapCallback` function can be used to compare this to non-number values, such as in these examples:

#### Example: Array of objects

```javascript
const pets = [
    { name: 'Fluffy', age: 10 },
    { name: 'Biscuit', age: 6 },
    { name: 'Wilbur', age: 12 }
];

findClosest(pets, 7, ({ age }) => age);
// => { name: 'Biscuit', age: 6 }
```

#### Example: Array of strings

##### String length

```javascript
findClosest(
  ['foo', 'bar', 'longer'],
  10,
  ({ length }) => length
);
// => 'longer'
```

##### String likeness

This example makes use of the [fast-levenshtein](https://www.npmjs.com/package/fast-levenshtein) package to compare strings.

```javascript
import levenshtein from 'fast-levenshtein';

findClosest(
  ['jim', 'bob', 'don', 'laura'],
  0,
  str => levenshtein.get(str, 'dan')
);
// => 'don'
```

### Needle options

The second argument (the "needle" to find in the "haystack" array) may be either a number, or an object with extra rules.

#### options.target

Define the target value to find. These two are equivalent:

```javascript
findClosest([0, 10, 20, 30], 12); // => 10
findClosest([0, 10, 20, 30], { target: 12 }); // => 10
```

However, with this object notation, additional restrictions can be applied…

#### options.min

Define a minimum value to match. In this example, the closest value to 12 that is not also lower than 12 will be returned:

```javascript
findClosest([0, 10, 20, 30], { target: 12, min: 12 });
// => 20
```

#### options.max

Define a maximum value to match.

```javascript
findClosest([0, 10, 20, 30], { target: 16, max: 19 });
// => 10
```

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

Note, for arrays of non-number values, the `tieBreaker` function is passed the number representation of each item in the array as derived from the third argument mapping function, not the array items themselves.
