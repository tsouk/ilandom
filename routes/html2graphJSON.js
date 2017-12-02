const express = require('express');
const path = require('path');
const router = express.Router();
const jsdom = require('jsdom');
const validator = require('validator');
const prettyjson = require('prettyjson');
const ilandomWinston = require(path.join(global.__base, 'lib/ilandom-winston-log'));
const logger = ilandomWinston.getLogger('html2graphJSON');

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
// router.get(['/', '/:graphType'], function(req, res, next) {
//     var graphType = !req.params.graphType ? 'force directed' : req.params.graphType;
//     res.render('html2graphinput', { 
//             title: 'Which webpage do you want the JSON of, for a  ' + graphType + ' graph?',
//             graphType: graphType
//         });
// });

/* Render HTML 2 GRAPH */
router.post(['/', '/:graphType'], (req, res, next) => {
  let url = req.body.url;

  // Sanitise and add http if it does not exist
  if (validator.isURL(url)) {
    url = addhttp(url);

    jsdom.env(url, (err, window) => {
      if (!err) {

        /*  break into options here, for sigma, ngraph etc.
            based on the graphtype, load different modules and return the right JSON,
            or the vanilla default JSON
            Also, there might be an option for animated or non animated
        */

        //call gethtmlnode here?
        //var data = !windowJSON ? '' : JSON.stringify(windowJSON);
        const dom2json = require(path.join(global.__base, 'lib/dom2json'));
        const data = dom2json.toJSON(window.document);
        //logger.debug(prettyjson.render(windowJSON));
        //view = req.params.graphType == 'sigmaJSON' ? 'sigmaJSON' : `${req.params.graphType}JSON`;

        // res.render(view, { 
        //     title: 'Html to JSON for Graph',
        //     data: data
        // });

        res.status(200);
        res.json(data);
        res.end();
        window.close();
      }
      else {
        logger.error(`jsdom encountered error ${err} when retrieving dom for url: ${url}`);
      }
    });
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
  if (res.status === 500) {
    logger.error(err.message, 'status: ' + err.status);
  } else {
    logger.warn(err.message, 'status: ' + err.status);
  }
  if (process.env.NODE_ENV === 'development') {
    res.json({
      message: err.description,
      error: err
    });
  } else {
    res.json({
      message: err.description
    });
  }
});

addhttp = (url) => {
  if (!/^https?\:\/\//.test(url)) {
    url = "http://" + url;
  }
  return url;
}

module.exports = router;