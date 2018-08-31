# find-closest

This module provides functions equivalent to `Array.prototype.find` and `Array.prototype.indexOf`, but for finding the closest value where an exact match may not exist.

## Installation

`npm install find-closest`

## API

- [find-closest](#find-closest)
    - [Installation](#installation)
    - [API](#api)
        - [findClosest](#findclosest)
            - [Basic usage](#basic-usage)
            - [Compare with a custom function](#compare-with-a-custom-function)
                - [Example: Comparing objects by a key](#example-comparing-objects-by-a-key)
                - [Example: Comparing likeness of strings](#example-comparing-likeness-of-strings)
        - [findClosestIndex](#findclosestindex)

### findClosest

#### Basic usage

The default behaviour is to compare numbers in an array to the target number provided. The closest match is returned.

```javascript
import findClosest from 'find-closest';

findClosest([0, 10, 20], 12);
// returns 10
```

#### Compare with a custom function

To compare values other than numbers, a comparison function may be passed as the third argument to `findClosest`. This is invoked for each item in the array.

The comparison function is passed the current array item and the target value to find. It is expected to return a number indicating how similar the two values are. The results of this function determine which array item is returned by `findClosest`:

- The item with the lowest result is returned.
- If multiple items in the array share the lowest result, the first occurrence is returned.
- `0` indicates the closest possible likeness.

##### Example: Comparing objects by a key

This example shows how to compare objects by a key:

```javascript
const pets = [
    { name: 'Fluffy', age: 10 },
    { name: 'Biscuit', age: 6 },
    { name: 'Wilbur', age: 12 }
];
const ageComparer = ({ age }, targetAge) =>
    Math.abs(age - targetAge);

findClosest(pets, 4, ageComparer);
// returns object for Biscuit

findClosest(pets, 11, ageComparer);
// returns object for Fluffy
```

##### Example: Comparing likeness of strings

The following example shows usage with a third-party levenshtein distance module, installed by running `npm install fast-levenshtein`. This compares the similarity of strings.

```javascript
import levenshtein from 'fast-levenshtein';

const names = ['jim', 'bob', 'don', 'laura'];

findClosest(names, 'dan', levenshtein.get);
// returns 'don'
```

### findClosestIndex

Like [findClosest](#findclosest), except it returns the index instead of the value from the array.

```javascript
import { findClosestIndex } from 'find-closest';

findClosestIndex([0, 10, 20], 12);
// returns 1
```
