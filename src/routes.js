'use strict';

const controller = require('./controller');

module.exports = function (app) {
    app.route('/mapping/:eventName')
        .get(controller.getMapping);
    app.route('/mapping')
        .post(controller.updateMapping); 
    app.route('/convert-json')
        .post(controller.convertJson);           
};