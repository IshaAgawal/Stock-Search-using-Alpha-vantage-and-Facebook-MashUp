const express = require('express')
 
const app = express()
var request = require('request');
var bodyParser = require('body-parser');
var parseString = require('xml2js').parseString;
var connect = require('connect');
var serveStatic = require('serve-static');

app.use(bodyParser.json());
app.get('/symbolData', function (req, res) {  
console.log(req.query.symbol);

var symbolURL = ("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=").concat(req.query.symbol)
.concat("&apikey=A2YO93CBH2X5ELC2");

console.log(symbolURL);

request(symbolURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.send(body) 
     }

})
})

app.get('/newsFeed', function(req, res) {

	var newsURL = ("https://seekingalpha.com/api/sa/combined/").concat(req.query.symbol).concat(".xml");

	console.log(newsURL);

request(newsURL, function (error, response, body) {

parseString(response.body, function (err, result) {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
   
    res.send(result);
})

})
})

app.get('/indicatorData', function(req, res) {

var indicatorURL = ("https://www.alphavantage.co/query?function=").concat(req.query.indicator).concat("&symbol=").concat(req.query.symbol)
						.concat("&interval=daily&time_period=10&series_type=close&apikey=A2YO93CBH2X5ELC2");
console.log(indicatorURL);

request(indicatorURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.send(body) 
     }

})

})

app.get('/stockSuggestions', function(req, res) {

    var suggestionsURL = ("http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=").concat(req.query.stockPrefix);

    console.log(suggestionsURL);

request(suggestionsURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.send(body) 
     }

})

})
app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})

