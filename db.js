'use strict';
var fs = require('fs');
var mysql = require('mysql');
var connection;
module.exports = {
    init : function(){
        var configPath = './config.json';
        var configs = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
        connection = mysql.createConnection(configs);
        connection.connect();
    },
    shutdown: function(){
        connection.end();
    },
    execute_query: function(query, callback){
        connection.query(query, function (error, result, fields) {
            callback(error, result, fields)    
        });
    }
}

