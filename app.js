// bring in dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var server = require('./server');

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


// start mongoose connection
mongoose.connect('mongodb://localhost/plants', { useMongoClient: true })

var db = mongoose.connection

db.once('open', function () {
    
});

// include routes
app.use('/', server);

// serve static files
app.use(express.static(__dirname + '/public'))


// listen on port 8080
app.listen(5000,  function () {
    console.log('Express app listening on port 5000');
});
