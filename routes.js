'use strict';

const controller = require('./controller');

module.exports = function (app) {
    app.route('/convert-json')
        .post(controller.convertJson);
    app.route('/mapping/:activity')
        .get(controller.getMapping);
    app.route('/mapping')
        .post(controller.updateMapping);        
};