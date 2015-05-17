/**
 * Node Server Configuration
 */
'use strict';

// Module dependencies.
var express = require('express')
  , session = require('express-session');

// Add coloring for console output
require('colors');

// Create Express server.
var app = express();

// Use Express sessions.
app.use(session({
    secret: 'garwacke'
  , resave: true
  , saveUninitialized: false
}));

// Express configuration
require('./server/config/express')(app, express);

// Start Express server.
app.listen(app.get('port'), function() {
  console.log('✔ Express server listening on port '.green + '%d'.blue + ' in '.green + '%s'.blue + ' mode'.green, app.get('port'), app.get('env'));
});

module.exports = app;
