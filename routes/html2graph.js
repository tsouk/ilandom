const express = require('express');
const path = require('path');
const router = express.Router();
const validator = require('validator');
const ilandomWinston = require(path.join(global.__base, 'lib/ilandom-winston-log'));
const logger = ilandomWinston.getLogger('html2graph');

/* GET home page. */
router.get(['/', '/:flavour'], function (req, res, next) {
  let flavour = !req.params.flavour ? 'force directed' : req.params.flavour;
  res.render('html2graphinput', {
    title: 'Which webpage do you want to see as a ' + flavour + ' graph?',
    flavour: flavour
  });
});

/* Render HTML 2 GRAPH */
router.post(['/', '/:flavour'], function (req, res) {
  let url = req.body.url;
  let dimensions = req.body.dimensions;

  // html2JSON does url validation also, but we need this here to reply to the user
  if (validator.isURL(url)) {
    url = addhttp(url);
    if (dimensions === '2') {
      view = req.params.flavour == 'force directed' ? 'html2graph' : 'html2' + req.params.flavour;
      res.render(view, {
        title: 'Html to Graph',
        hud: 'The Force Directed Graph for <br>' + validator.escape(url),
        url: url
      });
    }
    else if (dimensions === '3') {
      res.render('html2ngraph', {
        title: 'Html2Ngraph',
        hud: 'The 3D Force Directed Graph for <br>' + validator.escape(url),
        url: url
      });
    }
    else {
      res.render('html2graphinput', {
        title: 'how many dimensions again?'
      });
    }
  } else {
    res.render('html2graphinput', {
      title: 'You really need to pass a valid URL...'
    });
  }
});

function addhttp(url) {
  if (!/^https?\:\/\//.test(url)) {
    url = "http://" + url;
  }
  return url;
}

module.exports = router;