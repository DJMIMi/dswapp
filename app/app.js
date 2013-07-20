
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var Soldier = require('./models/soldier');

var app = express();

mongoose.connect("mongodb://localhost/dsw");

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());

// Routes

app.get('/', function(req, res) {
    res.send({'version': '0.0.1'});
});

app.get('/soldiers', function(req, res) {
    Soldier.find(function(err, result) {
        res.send(result);
    });
});

app.get('/soldiers/:name', function(req, res) {
    Soldier.findOne({'name': req.params.name}, function(err, result) {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            res.send({result: result});
        }
    });
});

app.post('/soldiers', function(req, res) {
    console.log(req.body);
    Soldier.findOne({'name': req.body.name}, function(err, result) {
        if (err) {
            console.log('err');
        } else if (result) {
            result.name = req.body.name;
            result.foodfight = req.body.foodfight;
            result.bars = req.body.bars;
            result.rockets = req.body.rockets;
            result.status = req.body.status;
            result.save();
            res.send(result);
        }
    });
    new Soldier({
        name: req.body.name,
        foodfight: req.body.foodfight,
        bars: req.body.bars,
        rockets: req.body.rockets,
        status: req.body.status
        }).save();
    console.log(req.body.name);
    res.send({'new soldier': req.body.name});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
