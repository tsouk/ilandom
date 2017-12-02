var express = require('express');
var path = require('path');
var router = express.Router();
var jsdom = require('jsdom');
var validator = require('validator');
var prettyjson = require('prettyjson');
var recurseDomChildren = require('../public/javascripts/recurseDomChildren');
var dom2json = require('../public/javascripts/dom2json');
// TODO: Add winston logging

/* GET home page. */
router.get(['/', '/:flavour'], function(req, res, next) {
    var flavour = !req.params.flavour ? 'force directed' : req.params.flavour;
    res.render('html2graphinput', { 
            title: 'Which webpage do you want to see as a ' + flavour + ' graph?',
            flavour: flavour
        });
});

/* Render HTML 2 GRAPH */
router.post(['/', '/:flavour'], function(req, res) {
    var jsdomConfig = {
        agentOptions: { 
            keepAlive: true,
            keepAliveMsecs: 115000,
        },
        pool: {
            maxSockets: 1
        }
    };

    var url = req.body.url;

    // Sanitise and add http if it does not exist
    if ( validator.isURL(url) ) {
        url = addhttp(url);

        jsdom.env(url,
          function(err, window) {
                if (!err) {
                    //call gethtmlnode here?

                    var windowJSON = dom2json.toJSON(window.document);
                    var data = !windowJSON ? '' : JSON.stringify(windowJSON);
                    //console.log(prettyjson.render(windowJSON));
                    view = req.params.flavour == 'force directed' ? 'html2graph' : 'html2' + req.params.flavour;

                    res.render(view, { 
                        title: 'Html to Graph',
                        hud: 'The Force Directed Graph for <br>' + validator.escape(url),
                        data: data
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
