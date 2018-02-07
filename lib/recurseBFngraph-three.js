// ----------- Lib ---------------

var eventify = require('ngraph.events');

let events = {}
eventify(events);

const SEC = 1000;
const finaleEaseTime = 5 * SEC;
const stepTime = 0.2 * SEC; //this one can crash your shizzle
const nodeSize = 1000;
const nodeColor = '#' + (Math.floor(Math.random() * 16777215).toString(16) + '000000').substr(0, 6);
let maxDepth = 0;
childrenCount = 0;

events.fire('foo'); //huh???

function getHtmlNode(domObject) {
  var i = 0;
  var htmlNode = domObject;

  // Get the first node of type 1
  while (htmlNode.nodeType !== 1) {
    htmlNode = domObject.childNodes[++i];
  }

  return htmlNode;
}

function createRoot(graph, domNode) {
  if (graph.getNodesCount() > 0) {
    console.log("Error creating root object");
    return;
  }

  rootId = (domNode.tagName || domNode.nodeName);

  graph.addNode(rootId, {
    depth: 0,
    numberOfChildren: 0
  });

  graph.ilandom = {};
  graph.ilandom.maxDepth = 0;
  
  return rootId;
}

function recurseBF(graph, treeHeadNode, MAX_CHILDREN_PER_NODE = Infinity) {
  rootId = createRoot(graph, treeHeadNode);
  events.fire('createRoot');

  var queue = [{
    depth: 0,
    nodeId: rootId,
    element: treeHeadNode
  }];
  var queueItem = 0; //could use that too
  var current;
  var parent;
  var children, i, len;
  var depth;
  var childNodeId;

  var nodeIntervalId = setInterval(function () {
    if (current = queue.shift()) {
      let hasNoType1Children = true;
      // console.log('shifted next child that is now a parent, from queue');
      // for something like DFS ("show children -> traverse depth first") do .pop()

      depth = current.depth;
      if (depth > graph.ilandom.maxDepth) { graph.ilandom.maxDepth = depth; }
      
      parent = current.element;
      parentNodeId = current.nodeId;
      children = parent.childNodes;

      //I should probably check for ...
      // TODO: only go through children that are type 1?
      if ( children ) {
        for ( i = 0, len = children.length; i < len && i < MAX_CHILDREN_PER_NODE; i++ ) { // (i < len && i < 12) works for simplified iland graphs, but probably should only do that to the head... 
          if ( children[i].nodeType === 1 ) {
            hasNoType1Children = false;
            //console.log('adding child to queue');
            childNodeId = addNewChildNodeToParent(graph, parentNodeId, children[i], depth);
            queue.push({ //pass args via object or array
              element: children[i],
              nodeId: childNodeId,
              depth: depth + 1
            });
          }
        }
      }

      // Not sure I want to do that here...
      if (hasNoType1Children)  {
        //console.log(`${parentNodeId}: needs a Sea Node!`);
        addNewChildNodeToParent(graph, parentNodeId, {tagName: 'seaNode'}, maxDepth);
        //graph.getNode(parentNodeId).data.needSeaNode = true;
      }
    } else {
      clearInterval(nodeIntervalId);
      events.fire('cleared');
    }

  }, stepTime);

}

// Create a node, for every child, and create the edge between it and the parent
function addNewChildNodeToParent(graph, parentNodeId, child, depth) {
  nodeCount = graph.getNodesCount();
  nodeCount++;
  childNodeId = child.tagName + '-' + nodeCount;

  let currentDepth = !!depth ? depth + 1 : null;
  //console.group();
  // console.log('Before AddLink');
  graph.getNode(parentNodeId).data.numberOfChildren++;
  graph.addLink(parentNodeId, childNodeId, {depthOfChild: currentDepth});
  // console.log('After AddLink');

  var justAddedNode = graph.getNode(childNodeId);
  
  if (justAddedNode.data) {
    justAddedNode.data.depth = currentDepth;
  }
  else {
    justAddedNode.data = {depth: currentDepth, numberOfChildren: 0};
  }

  events.fire('added', parentNodeId, childNodeId);
  return childNodeId;
}

function findMaxDepth(treeHeadNode, MAX_CHILDREN_PER_NODE = Infinity) {
  rootId = (treeHeadNode.tagName || treeHeadNode.nodeName);

  var queue = [{
    depth: 0,
    element: treeHeadNode
  }];
  var queueItem = 0; //could use that too
  var current;
  var parent;
  var children, i, len;
  var depth;

  while (current = queue.shift()) {
    let hasNoType1Children = true;
    if (current.depth > maxDepth) { maxDepth = current.depth; }
    
    parent = current.element;
    children = parent.childNodes;

    if ( children ) {
      for ( i = 0, len = children.length; i < len && i < MAX_CHILDREN_PER_NODE; i++ ) { // (i < len && i < 24) works for simplified iland graphs, but probably should only do that to the head... 
        if ( children[i].nodeType === 1 ) {
          let hasNoType1Children = false;
          childrenCount++;
          queue.push({ //pass args via object or array
            element: children[i],
            depth: current.depth + 1
          });
        }
      }
    }
    if (hasNoType1Children) {
      childrenCount++;
    }
  }

  return maxDepth;
}

function getChildrenCount() {
  return childrenCount;
}

function hashCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

module.exports = {
  getHtmlNode,
  recurseBF,
  findMaxDepth,
  getChildrenCount,
  events,
  hashCode,
  intToRGB,
};