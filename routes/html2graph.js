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
            var windowJSON = !err ? dom2json.toJSON(window.document) : null;

            res.render('html2graph', { 
                title: 'Html to Graph',
                hud: 'The Force Directed Graph for ' + req.query.url,
                data: !windowJSON ? '' : JSON.stringify(windowJSON)
            });

            window.close();

        }
    );
});

module.exports = router;
