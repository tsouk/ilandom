var express = require('express');
var router = express.Router();
var request = require('request');
var recurseDomChildren = require('../public/javascripts/recurseDomChildren');
var parser2json = require('../public/javascripts/parser2json');

/* Render HTML 2 GRAPH */
router.get('/', function(req, res) {
    request(req.query.url, function(error, response, html){
        if(!error){
            console.log(html);
        }
    })
});

module.exports = router;
