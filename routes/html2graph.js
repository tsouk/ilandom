var express = require('express');
var router = express.Router();
var jsdom = require('jsdom');
var validator = require('validator');
var recurseDomChildren = require('../public/javascripts/recurseDomChildren');
var dom2json = require('../public/javascripts/dom2json');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('html2graphinput');
});

/* Render HTML 2 GRAPH */
router.post('/', function(req, res) {
    var jsdomConfig = {
        agentOptions: { 
            keepAlive: true,
            keepAliveMsecs: 115000,
        },
        pool: {
            maxSockets: 1
        }
    };

    var url = req.param('url');

    // Sanitise and add http if it does not exist
    if ( validator.isURL(url) ) {
        url = addhttp(url);
    }
    else {
        res.render('html2graphempty');
    }

    if (url && url != '') {
        jsdom.env(url,
          function(err, window) {
                if (!err) {
                    //call gethtmlnode here?

                    var windowJSON = dom2json.toJSON(window.document);


                    res.render('html2graph', { 
                        title: 'Html to Graph',
                        hud: 'The Force Directed Graph for ' + validator.escape(url),
                        data: !windowJSON ? '' : JSON.stringify(windowJSON)
                    });

                    window.close();
                }
                else {
                    console.log('[jsdom] ' + err + ', retrieving dom for [' + url + ']');
                }

            }
        );
    }
    else {
        res.render('html2graphempty');
    }

    
});

function addhttp(url) {
    if (!/^https?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

module.exports = router;
