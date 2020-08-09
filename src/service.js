'use strict';
var fs = require('fs');
var transformer = require('./polo')

module.exports = {
    convertJson: function (req, callback) {
        this.getMapping(req.requestPayloadData.data.eventName.toUpperCase(), function (error, mapping) {
            if (error) {
                callback("Invalid Activity For Transformation");
            } else {
                transformer.transform(req, mapping, { "callback": callback })
            }
        })
    },
    getMapping: function (event_name, callback) {
        let configPath = './config/mapping-config.json';

        let configs = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

        let mapping = configs[event_name.toUpperCase()];
        if (!mapping) {
            mapping = 'default';
        }
        mapping = JSON.parse(fs.readFileSync('./config/mappings/' + mapping + '.json', 'UTF-8'));

        if (!mapping) {
            callback('No Data Found for activity ' + activity);
        } else {
            callback(undefined, mapping);
        }
    },
    updateMapping: function (req, callback) {
        let event_name = req.eventName

        let configPath = './config/mapping-config.json';
        let configs = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

        let mapping = configs[event_name.toUpperCase()];
        if (!mapping) {
            mapping = 'default';
        }

        let old = './config/mappings/' + mapping + '.json';
        let nw = './config/mappings/' + mapping + '_' + Date.now() + '.json';

        fs.rename(old, nw, function (err) {
            if (err) {
                callback("Error");
            }
            else {
                fs.writeFile(old, JSON.stringify(req.mapping), 'utf8', function () {
                    callback("Updated");
                });
            }
        });
    }
};