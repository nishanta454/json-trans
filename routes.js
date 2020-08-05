'use strict';

const controller = require('./controller');

module.exports = function (app) {
    app.route('/about')
        .get(controller.about);
    app.route('/convert-json')
        .post(controller.convertJson);
    app.route('/mapping/:activity')
        .get(controller.getMapping);
    app.route('/mapping')
        .post(controller.updateMapping);        
    app.route('/distance/:zipcode1/:zipcode2')
        .get(controller.getDistance);
};