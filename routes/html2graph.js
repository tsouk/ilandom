var express = require('express');
var path = require('path');
var router = express.Router();
var validator = require('validator');
const ilandomWinston = require(path.join(global.__base, 'lib/ilandom-winston-log'));
const logger = ilandomWinston.getLogger('html2ngraph');

/* GET home page. */
router.get(['/', '/:flavour'], function (req, res, next) {
  var flavour = !req.params.flavour ? 'force directed' : req.params.flavour;
  res.render('html2graphinput', {
    title: 'Which webpage do you want to see as a ' + flavour + ' graph?',
    flavour: flavour
  });
});

/* Render HTML 2 GRAPH */
router.post(['/', '/:flavour'], function (req, res) {
  var url = req.body.url;

  // html2JSON does url validation also, but we need this here to reply to the user
  if (validator.isURL(url)) {
    url = addhttp(url);
    view = req.params.flavour == 'force directed' ? 'html2graph' : 'html2' + req.params.flavour;
    res.render(view, {
      title: 'Html to Graph',
      hud: 'The Force Directed Graph for <br>' + validator.escape(url),
      url: url
    });
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