## About
This module provides functions equivalent to `Array.prototype.find` and `Array.prototype.indexOf`, but for finding the closest value where an exact match may not exist.

## Installation
`npm install find-closest`

## API
- [findClosest](#findclosest)
- [findClosestIndex](#findclosestindex)

### findClosest
#### Basic usage
The default behaviour is to compare numbers in an array to the target number provided. The closest match is returned.
```javascript
import findClosest from 'find-closest';

findClosest([0, 10, 20], 12);
// returns 10
```

#### Compare by object properties
```javascript
const users = [
    {details: {name: 'Bob', age: 20}},
    {details: {name: 'Laura', age: 24}}
];

findClosest(users, 30, 'details.age');
findClosest(users, 30, ['details', 'age']);
// both return the object for Laura
```

#### Compare with a custom function
To compare values other than numbers, a comparison function may be passed as the third argument to `findClosest`. This is invoked for each item in the array.

The comparison function is passed the current array item and the target value to find. It is expected to return a number indicating how similar the two values are. The results of this function determine which array item is returned by `findClosest`:
- The item with the lowest result is returned.
- If multiple items in the array share the lowest result, the first occurance is returned.
- `0` indicates the closest possible likeness.

This example shows how to get the string with the closest length provided:
```javascript
const names = ['jim', 'jimmy', 'jimbob', 'jimbobby'];

const lengthComparer = (value, targetLength) =>
    Math.abs(value.length - targetLength);

findClosest(names, 4, lengthComparer);
// returns 'jim'

findClosest(names, 7, lengthComparer);
// returns 'jimbob'
```

The following example shows usage with a third-party levenshtein distance module, installed by running `npm install fast-levenshtein`. This compares the similarity of strings.

```javascript
import levenshtein from 'fast-levenshtein';

const names = ['jim', 'bob', 'don', 'laura'];

findClosest(names, 'dan', levenshtein.get);
// returns 'don'
```

### findClosestIndex
Like `findClosest`, except it returns the index instead of the value from the array.
```javascript
import { findClosestIndex } from 'find-closest';

findClosestIndex([0, 10, 20], 12);
// returns 1
```
