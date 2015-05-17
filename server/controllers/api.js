/**
 * API Controller
 */

'use strict';

var settings = require('../config/env/default')
  , config = require('../config/fitbit')
  , Fitbit = require('fitbit');

var init = function(req, res) {
  // Create an API client and start authentication via OAuth
  var client = new Fitbit(config.CONSUMER_KEY, config.CONSUMER_SECRET);

  client.getRequestToken(function (err, token, tokenSecret) {
    if (err) {
      // Take action
      console.log('Error', err);
      return;
    }

    req.session.oauth = {
        requestToken: token
      , requestTokenSecret: tokenSecret
    };
    res.redirect(client.authorizeUrl(token));
  });
};

// On return from the authorization
var oauthCallback = function (req, res) {
  console.log('oauthCallback', req.session);

  var verifier = req.query.oauth_verifier
    , oauthSettings = req.session.oauth
    , client = new Fitbit(config.CONSUMER_KEY, config.CONSUMER_SECRET);

  // Request an access token
  client.getAccessToken(
      oauthSettings.requestToken
    , oauthSettings.requestTokenSecret
    , verifier
    , function (err, token, secret) {
        if (err) {
          // Take action
          console.log('Error', err);
          return;
        }
        req.session.oauth.accessToken = token;
        req.session.oauth.accessTokenSecret = secret;

        res.send(req.session.oauth);
      }
  );

};

// Display some stats
var stats = function (req, res) {
  var client = new Fitbit(
      config.CONSUMER_KEY
    , config.CONSUMER_SECRET
    , { // Now set with access tokens
          accessToken: config.ACCESS_TOKEN
        , accessTokenSecret: config.ACCESS_TOKEN_SECRET
        , unitMeasure: 'en_GB'
      }
  );

  // Fetch todays activities
  client.getActivities(function (err, activities) {
    if (err) {
      // Take action
      console.log('Error', err);
      return;
    }

    // `activities` is a Resource model
    res.send('Total steps today: ' + activities.steps());
  });
};


module.exports = {
  init: init
, oauthCallback: oauthCallback
, stats: stats
};
