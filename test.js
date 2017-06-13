var myMap = new Map();

// Add new elements to the map
myMap.set('bar', 'foo');
myMap.set(1, 'foobar');

// Update an element in the map
myMap.set('bar', 'baz');
myMap.set('array',['fdsa','asdf','hello'])

var ar =  myMap.get('array')
ar.push('hello')

console.log(myMap.set('array',ar));
console.log(myMap.get('array'));
