var renderGraph = require('../index.js');

var graph = require('ngraph.graph')();
const recurseBF = require('../../lib/recurseBFngraph');
var eventify = require('ngraph.events');


// Pin the html node,root? 
// triangle per node? where is three.js? when flat
// set size per node?

/*
  * Breadth First
  */
function start3dgraph (data) {
  const colorPalette = '5555000000';
  recurseBF.recurseBF(graph, recurseBF.getHtmlNode(data));
  var renderer = renderGraph(graph);
  const regex = /^[a-z]*/;

  recurseBF.events.on('cleared', function() {
    console.log('Finished adding nodes, stable');
    renderer.forEachNode(function(nodeUI){
      nodeUI.color = '0x' + recurseBF.intToRGB(recurseBF.hashCode(regex.exec(nodeUI.id)[0] + colorPalette));
      nodeUI.size = 50;
    })
    renderer.stable(true);
  });

  recurseBF.events.on('added', function( parentNodeId, childNodeId ) {
    //renderer.graph().addLink(parentNodeId, childNodeId);
    renderer.forEachNode(function(nodeUI){
      myArray = regex.exec(nodeUI.id);
      nodeUI.color = '0x' + recurseBF.intToRGB(recurseBF.hashCode(regex.exec(nodeUI.id)[0] + colorPalette));
      nodeUI.size = 50;
    })
    renderer.getNode(childNodeId).size = 100; // this is reset when something is added to the graph
    renderer.getNode(childNodeId).color = 0x000000; // this is reset when something is added to the graph
    renderer.focus(); // not sure what that does...
    renderer.stable(false);
  });

  var layout = renderer.layout();
  var simulator = layout.simulator;
  simulator['timeStep'](9);
  //layout.is3d(false); // Make non 3d, have to update the gui tho
  renderer.focus();
}

if (window) {
  window.start3dgraph = start3dgraph;
}