var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Database = require('./database')
var path = require('path')


app.use(express.static(path.join(__dirname, 'dist')));

router.get('/', function (req, res) {
    res.sendFile("/index.html", {
        root: "./dist"
    })
})


router.post('/postData', function (req, res) {

    // object to send to client with data from database
    var firstAndLastObject = {
        zipcode: '',
        city: '',
        stationID: '',
        firstFrostDate: '',
        lastFrostDate: ''
    }

    // get station id based on user zipcode input
    Database.ZipCode.findOne({
            // search by zipcode, need to make sure submitted value is a number
            zipcode: Number(req.body.zipCode)
        },
        // handling of zip code not being found
        function (err, zipCodeObject) {
            if (zipCodeObject == null) {
                res.send("Zip code not found")
            }
            // set value of firstAndLastObject to returned data from database
            firstAndLastObject.zipcode = zipCodeObject.zipcode
            firstAndLastObject.city = zipCodeObject.city
            firstAndLastObject.stationID = zipCodeObject.stationID
            // search for one first frost date with stationID
            Database.FirstFrost.findOne({
                    // search by stationID, sending stationID from zipcode search
                    stationID: zipCodeObject.stationID
                },
                function (err, firstFrostObject) {
                    // handling for invalid frost dates and empty search returns
                    if (firstFrostObject.firstFrost.split("")[0] == '-' || firstFrostObject == null) {
                        res.send("No frost data available")
                    }
                    // setting object to returned data
                    console.log('firstFrostObject:', firstFrostObject.firstFrost.split("")[0])
                    firstAndLastObject.firstFrostDate = firstFrostObject.firstFrost
                })
            // search database for last frost date
            Database.LastFrost.findOne({
                    // search by stationID
                    stationID: zipCodeObject.stationID
                },
                function (err, lastFrostObject) {
                    firstAndLastObject.lastFrostDate = lastFrostObject.lastFrost
                    res.send(firstAndLastObject)
                })
        })
})










module.exports = router