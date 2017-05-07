## About
This module provides functions equivalent to `Array.prototype.find` and `Array.prototype.indexOf`, but for finding the closest value where an exact match may not exist.

## Installation
`npm install find-closest`

## API
### findClosest(array, valueToFind)
```javascript
import findClosest from 'find-closest';

findClosest([0, 10, 20], 12);
// returns 10
```

### findClosest(array, valueToFind, [valueGetter])
```javascript
import findClosest from 'find-closest';

const people = [
	{name: 'Bob', age: 20},
	{name: 'Laura', age: 16}
];
const getAge = ({age}) => age;

findClosest(people, 17, getAge);
// returns the object for Laura
```

### createFindClosest(getDistance)
#### Basic example
```javascript
import {createFindClosest} from 'find-closest';

const findClosestLength = createFindClosest(({length}) => length);

findClosestLength(['Bob', 'Laura', 'Timothy', 10);
// returns 'Timothy'
```

#### Plugging in third party modules
It's simple to use a third-party module to calculate what "close" means. This example uses the "fast-levenshtein" module (installed via npm) to calculate the similarity between strings.
```javascript
import {createFindClosest} from 'find-closest';
import levenshtein from 'fast-levenshtein';

const findClosestWord = createFindClosest(levenshtein.get);

findClosestWord(['Bob', 'Jo', 'Tim'], 'Rob');
// returns 'Bob'
```

### findClosestIndex(array, valueToFind, [valueGetter])
Like `findClosest`, except it returns the index instead of the value from the array.

### createFindClosestIndex(getDistance)
Like `createFindClosest`, except the created function returns the index instead of the value from the array.
