const express = require('express');
const path = require('path');
const router = express.Router();
const jsdom = require('jsdom');
const validator = require('validator');
const prettyjson = require('prettyjson');
const ilandomWinston = require(path.join(`${global.__base}lib/ilandom-winston-log`));
const sharedMiddleware = require(`${global.__base}lib/shared-middleware`);
const logger = ilandomWinston.getLogger('html2graphJSON');

/* eslint-disable no-unused-vars */
const LRU = require('lru-cache');
const cacheOptions = {
  max: 11000 * 100,
  length(n, key) { return sharedMiddleware.sizeof(n); },
  dispose(key, n) {},
  maxAge: 1000 * 120,
  stale: true,
};
/* eslint-enable no-unused-vars */
const cache = LRU(cacheOptions);

const jsdomConfig = {
  agentOptions: {
    keepAlive: true,
    keepAliveMsecs: 115000,
  },
  pool: {
    maxSockets: 1
  }
};

/* GET  */
// Cached these in memory! and maybe for now in browsers.
router.get(['/', '/:graphType'], function(req, res, next) {
  res.setHeader('Cache-Control', 'public, max-age=86400'); // one day in seconds
  let url = req.query.url;

  if (validator.isURL(url)) {
    url = addhttp(url);
    const data = cache.get(url);
    
    if (data) {
      logger.debug(`cache hit ${url}`);
      res.status(200);
      res.json(data);
      res.end();
    }
    else {
      logger.debug(`cache miss ${url}`);
      jsdom.env(url, (err, window) => {
        if (!err) {
          /*  break into options here, for sigma, ngraph etc.
              based on the graphtype, load different modules and return the right JSON,
              or the vanilla default JSON
              Also, there might be an option for animated or non animated
          */
          const dom2json = require(path.join(global.__base, 'lib/dom2json'));
          const data = dom2json.toJSON(window.document);

          cache.set(url, data);
          res.status(200);
          res.json(data);
          res.end();
          window.close();
        }
        else {
          logger.error(`jsdom encountered error ${err} when retrieving dom for url: ${url}`);
          err.description = 'Jsdom could not connect to the network, getting hard coded test data for tsouk.com localhost';
          err.status = 307;
          next(err);
        }
      });
    }
  } 
  else {
    let err = new Error('Non URL passed to JSON service');
    err.description = 'Non URL passed to JSON service';
    err.status = 500;
    next(err);
  }
});

/**
 * Error handler for API routes. Returns errors as JSON
 */
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (err.status === 500) {
    logger.error(err.message, 'status: ' + err.status);
    if (process.env.NODE_ENV === 'development') {
      res.json({
        message: err.description,
        error: err
      });
    }
    else {
      res.json({
        message: err.description
      });
    }
  }
  else if (err.status === 307) {
    const dom2json = require(path.join(global.__base, 'lib/dom2json'));
    const hardCodedData = require(path.join(global.__base, 'lib/localhost.json'));
    const data = dom2json.toJSON(hardCodedData);
    res.json(data);
  }
  else {
    logger.warn(err.message, 'status: ' + err.status);
  }

});

addhttp = (url) => {
  if (!/^https?\:\/\//.test(url)) {
    url = "http://" + url;
  }
  return url;
}

module.exports = router;