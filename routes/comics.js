var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('comics', {
        title: 'Comics, by Nikos Tsouknidas'
    });
});

router.get(['/:comicLandingPage'], function(req, res, next) {
    res.render('comics', {
        title: `${req.params.comicLandingPage}, by Nikos Tsouknidas`
    });
});

router.get(['/:comic/page/:page'], function(req, res, next) {
    res.render('comics', {
        title: `${req.params.comic} page ${req.params.page}, by Nikos Tsouknidas`
    });
});

module.exports = router;
