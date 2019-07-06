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

**Note** that, unless all the values in the array are numbers, the `filterMapFn` cannot return `true`.

#### Performance

The `filterMapFn` argument has potential performance gains over manually calling `.map().filter()` on the input array:

- Mapping _and_ filtering happens in a single pass.
- The mapping is executed lazily. If a perfect match is found before reaching the end of the array, unnecessary calculations are avoided.
