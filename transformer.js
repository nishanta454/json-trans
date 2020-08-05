'use strict';
var transform = require("node-json-transform").transform;
var db = require('./db')

module.exports = {
    transData: function (req, callback) {
        this.getMapping(req.activity, function (error, data) {
            if (error) {
                callback("Invalid Activity For Transformation");
            } else {
                callback(transform(req.payload, data));
            }
        })
    },
    getMapping: function (activity, callback) {
        var query = "select payload_mapping from activity_payload_mapping where activity_name='" + activity + "'";
        db.execute_query(query, function (error, rows, fields) {
            if (error) {
                callback('No Data Found for activity ' + activity);
            } else {
                callback(undefined, JSON.parse(rows[0].payload_mapping));
            }
        });
    },
    updateMapping: function (req, callback) {
        var query = "update activity_payload_mapping set payload_mapping = '" + JSON.stringify(req.payload_mapping) + "'  where activity_name='" + req.activity + "'";
        db.execute_query(query, function (error) {
            if (error) {
                callback('Payload Mapping Not Updated for ' + req.activity);
            } else {
                callback('Mapping has been updated for ' + req.activity);
            }
        });
    }
};