const express = require('express');
const path = require('path');
const router = express.Router();
const jsdom = require('jsdom');
const validator = require('validator');
const prettyjson = require('prettyjson');
const recurseDomChildren = require('../public/javascripts/recurseDomChildren');
const dom2json = require('../public/javascripts/dom2json');
const ilandomWinston = require(path.join(global.__base, 'lib/ilandom-winston-log'));
const logger = ilandomWinston.getLogger('html2ngraph');

router.get(['/'], (req, res, next) => {
  res.render('html2ngraph', {
    title: 'Html2Ngraph'
// need to pass the url to the view !!!!!!!!!!!!!! from the input field
  });
});

module.exports = router;