const graph = require('ngraph.graph')();
const recurseBF = require('../../lib/recurseBFngraph-three');
const eventify = require('ngraph.events');
const nthree = require('ngraph.three');
const THREE = require('three');
const MAX_CHILDREN_PER_NODE = 12;

// Configure
var physicsSettings = {
  springLength: 30,
  springCoeff: 0.0008,
  gravity: -1.2,
  theta: 0.8,
  dragCoeff: 0.02,
  timeStep: 10
};

function start3dgraph (data) {
  let maxDepth = recurseBF.findMaxDepth(recurseBF.getHtmlNode(data), MAX_CHILDREN_PER_NODE);
  let maxParticleCount = recurseBF.getChildrenCount();

  var layout3d = require('ngraph.forcelayout3d');
  var layout2d = layout3d.get2dLayout;
  var graphics = nthree(graph, {physicsSettings : physicsSettings, layout: layout2d(graph, physicsSettings)}, maxParticleCount, maxDepth);

  graphics.run(); // begin animation loop

  recurseBF.recurseBF(graph, recurseBF.getHtmlNode(data), MAX_CHILDREN_PER_NODE);
  
  recurseBF.events.on('added', function( parentNodeId, childNodeId ) {
    graphics.resetStable();
  });

  recurseBF.events.on('cleared', function() {
    console.log(`Finished adding nodes, stable, maxDepth: ${maxDepth}`);
    setTimeout(() => {
      graphics.isStable();
    }, 1000);   
  });
}

if (window) {
  window.start3dgraph = start3dgraph;
  window.THREE = THREE;
}