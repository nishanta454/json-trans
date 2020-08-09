'use strict';

var service = require('./service');

var controllers = {
    getMapping: function (req, res) {
        service.getMapping(req.params.activity, function (error, data) {
            res.json(error ? error : data);
        });
    },
    updateMapping: function (req, res) {
        service.updateMapping(req.body, function (message) {
            res.json(message);
        });
    },
    convertJson: function(req, res){
        service.convertJsonV2(req.body, function (message) {
            res.json(message);
        });
    }
};

module.exports = controllers;