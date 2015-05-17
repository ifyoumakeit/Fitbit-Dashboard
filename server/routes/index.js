/**
 * User Routes
 */

'use strict';

var indexController = require('../controllers/index')
  , apiController = require('../controllers/api')
  , path = require('path')
  , fs = require('fs');

var apiRoot = '/api/v1'

var routes = function(app) {

  // Dynamically load all routes
  fs.readdirSync(__dirname).forEach(function(file) {
    // Dont load this index.js file
    if (!/index/.test(file)) {
      var route = path.join(__dirname, file);
      require(route)(app);
    }
  });

  // Home
  app.get('/', indexController.index);

  // API
  app.get(apiRoot + '/fitbit', apiController.init);
  app.get(apiRoot + '/fitbit/callback', apiController.oauthCallback);
  app.get(apiRoot + '/fitbit/stats', apiController.stats);

};

module.exports = routes;
