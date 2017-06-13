'use strict'
var express = require('express')
var fs = require('fs')
var xpath = require('xpath')
var bodyParser = require('body-parser')
var dom = require('xmldom').DOMParser
var parser = require('xml2js').parseString;
var app = express()
var router = express.Router()
var http = require('http')
var md5 = require('md5');
var request = require('request');
var stream = require('stream');
var callbackMap = new Map();

app.set('json spaces', 2)
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

var part1 = "http://abgabe.cs.univie.ac.at:9027/discount"
var part2 = "http://abgabe.cs.univie.ac.at:9027/part_name"
var part3 = "http://abgabe.cs.univie.ac.at:9027/texture"
var part4 = "http://abgabe.cs.univie.ac.at:9027/url"

var readlog = () => {
  let template = fs.readFileSync('./log/logCorrelator.json', 'utf-8')
  template = JSON.parse(template)
  return template
}

var readProcessTemplate = () => {
  let processxml = fs.readFileSync('./../xml/process.xml', 'utf-8')
  let doc = new dom().parseFromString(processxml)
  return doc
}

var addParts = (add1, add2, add3, add4) => {
  let doc = readProcessTemplate()

  let iterator = doc.firstChild.firstChild.nextSibling.firstChild.nextSibling
  iterator.firstChild.data = part1 + '/' + add1
  iterator.nextSibling.nextSibling.firstChild.data = part2 + '/' + add2
  iterator.nextSibling.nextSibling.nextSibling.nextSibling.firstChild.data = part3 + '/' + add3
  iterator.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.firstChild.data = part4 + '/' + add4


  fs.writeFileSync('./../xml/process.xml', doc.toString());
}

var finishProcess = (progress, callbackurl, pid) => {

    //new Promise((resolve, reject) => {
        console.log('sending order');
        console.log(callbackurl);
        let postData = JSON.stringify({
          progress: progress
        });

        let options = {
          host: callbackurl.slice(callbackurl.indexOf(":") + 3, callbackurl.lastIndexOf(":")),
          port: callbackurl.slice(callbackurl.lastIndexOf(":") + 1, callbackurl.lastIndexOf(":") + 5),
          path: callbackurl.slice(callbackurl.lastIndexOf(":") + 5),
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }
        console.log('options', options);

        let req = http.request(options, (res) => {
          console.log(`FINSIH RETURN: STATUS: ${res.statusCode}`);

          console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
          //callbackMap.delete(pid) ? console.log('removed pid') : console.log('not removed');
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
          });
          res.on('end', () => {
            console.log('No more data in response.');
            //resolve();
          });
        });

        req.on('error', (e) => {
          console.log(`problem with request: ${e.message}`);
          //reject();
        });
      //})
    }

    var startProcess = () => {
      var content = {
        xml: {
          value: fs.createReadStream('./../xml/process.xml'),
          options: {
            contentType: 'text/xml',
            filename: 'filename.xml'
          }
        }
      };
      request.post({
        url: 'http://cpee.org:9296',
        formData: content
      }, (err, httpResponse, body) => {
        if (err) {
          return console.log(err);
        } else return console.log(body);
      });
    }



    app.use('/*', (req, res, next) => {
      let favicon = true;
      console.log('The Correlator has received a call');

      let logExact = {
        file: "correlator.js",
        contentType: req.get('Content-Type'),
        acceptEncoding: req.get('Accept-Encoding'),
        accept: req.get('Accept'),
        userAgent: req.get('User-Agent'),
        contentLength: req.get('Content-Length'),
        Host: req.get('Host'),
        method: req.method,
        url: req.url,
        param: req.params,
        body: req.body,
        query: req.query,
        timestamp: Math.floor(new Date() / 1000),
        cpee: {
          cpeeBase: req.get('Cpee_base'),
          cpeeInstance: req.get('Cpee_instance'),
          cpeeCallback: req.get('Cpee_callback'),
          cpeeActivity: req.get('Cpee_activity'),
          cpeeLabel: req.get('Cpee_label'),
          cpeeAttrInfo: req.get('Cpee_attr_info'),
          cpeeAttrModeltype: req.get('Cpee_attr_modeltype')

        }
      }

      for (var fav in logExact) {
        if (logExact.hasOwnProperty(fav)) {
          if (fav == 'param') {
            for (var par in logExact[fav]) {
              if (fav.hasOwnProperty(par)) {
                if (logExact[fav][par] === 'favicon.ico') {
                  favicon = false
                }
              }
            }

          }
        }
      }

      if (favicon) {
        fs.appendFile('./log/logCorrelator.json', JSON.stringify(logExact, null, '  '), err => {
          if (err) throw err;
        });
      }
      next()
    })



    app.route('/').get((req, res) => {
      console.log('received a get request');
      res.send('Hallo World!')
    }).post((req, res) => {
      console.log("Received a post request")
      //callback
      let cb = req.get('Cpee_callback')
      let pid = req.body.pid
      console.log('callbackurl:', cb);
      console.log('pid', req.body.pid);
      if (cb && pid) {
        console.log('pid with callback');
        callbackMap.has(pid) ? console.log('pid already exists') : callbackMap.set(pid, cb);

      }

      if (pid && cb == undefined) {
        console.log('pid without callback');

        finishProcess(req.body, callbackMap.get(pid), pid
      }

      let orders = [];
      for (let body in req.body) {

        if (req.body.hasOwnProperty(body)) {

          if (body === 'discount') {
            orders.push(req.body[body])
          }
          if (body === 'part_name') {
            orders.push(req.body[body])
          }
          if (body === 'texture') {
            orders.push(req.body[body])
          }
          if (body === 'url') {
            orders.push(req.body[body])
          }
        }
      }

      if (orders.length === 4) {
        addParts(orders[0], orders[1], orders[2], orders[3]);
        startProcess();
        orders = []
      }

      res.set('CPEE_CALLBACK', 'true')
      res.send();
    })



    var port = 9029
    app.listen(port, function() {
      console.log('Correlator listening on port ' + port)
    })
