'use strict'
var express = require('express')
var fs = require('fs')
var xpath = require('xpath')
var bodyParser = require('body-parser')
var app = express()
var router = express.Router()

app.set('json spaces', 2);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var inventory = fs.readFileSync('../inventory.json', 'utf-8')
inventory = JSON.parse(inventory)

var saveChange=(data) =>{
  fs.writeFileSync('../inventory.json', JSON.stringify(data, null, '  '), 'utf-8')
}

var queryJSON = (query, data) => {
  for (let item in data) {
    if (data.hasOwnProperty(item)) {
      if (item === query) {
        return data[item];
      }
    }
  }
}

var editJSON = (piece, part, change) => {
  for (let item in inventory) {
    if (inventory.hasOwnProperty(item) && item === part) {
      for (let itempiece in inventory[item]) {
        if (inventory[item].hasOwnProperty(itempiece) &&  itempiece === piece) {
          inventory[item][itempiece]=Number(change)
        }
      }
    }
  }
}

app.use('/*', (req, res, next)=>{
  let favicon=true;
  console.log('The Inventory has received a call');
  next()
})


app.get('/', (req, res, next) => {
  res.type('application/json')
  res.json(inventory);
})


app.route('/:part(discount|part_name|texture|url)/:piece').get((req, res) => {

  res.json({amount:queryJSON(req.params.piece, queryJSON(req.params.part, inventory))})
}).put((req,res)=>{
  console.log('got a put request', 'editing ',req.params.piece, req.body);
  let change = req.body.amount
  editJSON(req.params.piece, req.params.part, change)
  saveChange(inventory)

  res.send()

})
app.route('/:part(discount|part_name|texture|url)').get((req, res) => {
  res.json(queryJSON(req.params.part, inventory))
})


var port = 9027
app.listen(port, function() {
  console.log('Listening on port ' + port)
})
