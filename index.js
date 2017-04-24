var express = require('express');
var restify = require('restify')
var http = require('http');
var server = restify.createServer()

/* import the required plugins to parse the body and auth header. */
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())


//Create the Server that listen at 8080 port
var port = process.env.PORT || 8080;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port);
  }
})

//Route for Default Loaction Weather
server.get('/', function (request, response) {
  
    //Get location
  const requests = require('request');

requests('http://ipinfo.io', function(error, res, body) {
  console.log(JSON.parse(body))
  var location =  JSON.parse(body);
  
     // Get Weather
    var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q='+ location.city+'&units=metric&appid=3dc309f081792492d7ff7a157f6fd84a'
  };
var req = http.get(options, function(res) {
  var bodyChunks = [];
    res.on('data', function(chunk) {
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      var display = JSON.parse(body);
      
      // Display what we got
      var output = ('Your Loaction is ' + location.city + ', the country is '+ display.sys.country +  ' and the Temp is ' + display.main.temp);
      
    response.setHeader('content-type', 'application/json');
    response.send(200, JSON.stringify(output));
    console.log('Done');
    response.end();
      })
    })
  });
});


//Route for User type Loaction Weather
server.get('/:city', function (request, response) {
  
     // Get Weather
    var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q='+ request.params.city +'&units=metric&appid=3dc309f081792492d7ff7a157f6fd84a'
  };
var req = http.get(options, function(res) {
  var bodyChunks = [];
    res.on('data', function(chunk) {
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      var display = JSON.parse(body);
      
      // Display what we got
      var output = ('Your typed Loaction is ' + request.params.city + ', the country is '+ display.sys.country +  ' and the Temp is ' + display.main.temp);
      
    response.setHeader('content-type', 'application/json');
    response.send(200, JSON.stringify(output));
    console.log('Done');
    response.end();
     
    })
  });
});





