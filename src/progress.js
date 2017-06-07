'use strict'
var express = require('express')
var app = express()
var fs = require('fs')
app.set('json spaces', 2);
var one = {
    fortschritt: "Kontakt aufgenommen",
    Prozent: 5
}
var two = {
    fortschritt: "Gegenstand suchen",
    Prozent: 15
}
var three = {
    fortschritt: "Gegenstand ausgewaehlt",
    Prozent: 30
}
var four = {
    fortschritt: "Detailierte Auswahl",
    Prozent: 50
}
var five = {
    fortschritt: "Rabatt verhandeln",
    Prozent: 75
}
var six = {
    fortschritt: "Rabatt erlangt",
    Prozent: 80
}
var seven = {
    fortschritt: "Produkt unterwegs",
    Prozent: 100
}

var progressList = [one, two, three, four, five, six, seven]

var getProgress = () => {
  return progressList[0]
}

app.use('/*', (req, res, next)=>{
  let favicon=true;
  console.log('The Progress has received a call');
  next()
})

app.get('/', (req, res, next)=> {
  res.json(JSON.stringify(progressList))
})

app.get('/:id(1|2|3|4|5|6|7)', (req, res, next)=> {
  res.json(progressList[req.params.id-1])
})

var port = 9025
app.listen(port, function() {
  console.log('Listening on port ' + port)
})
