'use strict';

var properties = require('./package.json')
var distance = require('./distance');
var transformer = require('./transformer');

var controllers = {
    about: function (req, res) {
        var aboutInfo = {
            name: properties.name,
            version: properties.version
        }
        res.json(aboutInfo);
    },
    getDistance: function (req, res) {
        distance.find(req, res, function (err, dist) {
            if (err)
                res.send(err);
            res.json(dist);
        });
    },
    convertJson: function (req, res) {
        transformer.transData(req.body, function(data){
            res.json(data);
        })
    },
    getMapping: function (req, res) {
        transformer.getMapping(req.params.activity, function (error, data) {
            res.json(error ? error : data);
        });
    },
    updateMapping: function (req, res) {
        transformer.updateMapping(req.body, function (message) {
            res.json(message);
        });
    }
};

module.exports = controllers;