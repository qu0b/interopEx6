'use strict'
var express = require('express')
var app = express()
app.set('json spaces', 2);

var rnd = (upper) => {
  return Math.floor(Math.random() * upper)
}


var discount = ["40", "86", "51", "49", "77", "31", "23"];
var name = ['Tool_Box_LED', 'Book_Spoon', 'Wood_Bucket', 'Kindle_LED', 'Wood_Basswood', 'White_Lamp', 'Kindle_Torx', 'Glue_Book'];
var texture = ['flat', 'rough', 'smooth', 'rippled', 'bumpy'];
var url = ['WinterGustav', 'Madonnatesla', 'JohannesBae', 'trackWinter', 'trickgamma', 'BaeSnoop', 'dwagBuzz'];
var genOrder = () => {
  let order = {
    discount: discount[rnd(discount.length)],
    part_name: name[rnd(name.length)],
    texture: texture[rnd(texture.length)],
    url: url[rnd(url.length)]
  }
  return order
}


app.use('/*', (req, res, next) => {
	console.log('call to customer');
  next()
})


app.get('/', (req, res, next) => {
  res.json(genOrder())
})






var port = 9023
app.listen(port, function() {
})
