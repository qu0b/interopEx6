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

	let logExact ={
      file: "customer.js",
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
      timestamp: Math.floor(new Date() / 1000),
      cpee: {
        cpeeBase: req.get('Cpee_base'),
        cpeeInstance: req.get('Cpee_instance'),
        cpeeCallback: req.get('Cpee_callback'),
        cpeeActivity: req.get('Cpee_activity'),
        cpeeLabel: req.get('Cpee_label'),
        cpeeAttrInfo: req.get('Cpee_attr_info'),
        cpeeAttrModeltype: req.get('Cpee_attr_modeltype')
      },
      active: true,
      progress: 0
  }

  for (var fav in logExact) {
    if (logExact.hasOwnProperty(fav)) {
      if (fav=='param') {
        for (var par in logExact[fav]) {
          if (fav.hasOwnProperty(par)) {
            if(logExact[fav][par]==='favicon.ico')
            {
              favicon=false
            }
          }
        }

      }
    }
  }

  if(favicon){
    // fs.appendFile('log.json', JSON.stringify(log, null, '  ') , err => {
    // if (err) throw err;
    // });
    fs.appendFile('./log/logCorrelator.json', JSON.stringify(logExact, null, '  ') , err => {
    if (err) throw err;
    });
  }




  next()
})


app.get('/', (req, res, next) => {
  res.json(genOrder())
})






var port = 9023
app.listen(port, function() {
})
