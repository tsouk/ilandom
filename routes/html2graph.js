var express = require('express');
var router = express.Router();
var jsdom = require('jsdom');
var recurseDomChildren = require('../public/javascripts/recurseDomChildren');
var dom2json = require('../public/javascripts/dom2json');

/* Render HTML 2 GRAPH */
router.get('/', function(req, res) {
    var jsdomConfig = {
        agentOptions: { 
            keepAlive: true,
            keepAliveMsecs: 115000,
        },
        pool: {
            maxSockets: 1
        }
    };
    jsdom.env(req.query.url,
      function(err, window) {
            if (!err) {
                //call gethtmlnode here?

                var windowJSON = dom2json.toJSON(window.document);


                res.render('html2graph', { 
                    title: 'Html to Graph',
                    hud: 'The Force Directed Graph for ' + req.query.url,
                    data: !windowJSON ? '' : JSON.stringify(windowJSON)
                });

                window.close();
            }
            else {
                console.log('[jsdom] ' + err + ', retrieving dom for [' + req.query.url + ']');
            }

        }
    );
});

module.exports = router;
