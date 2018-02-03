(function () {
  if (!window) {
    alert('No reference to the window object');
  } else {
    window.html2sigma = function (graphJson, graphInit) {

      /*
      sigma: the sigma graph object
      graphContainer: the div id to render the graph in
      status: the div to sho status

      Html2Graph will create a force directed graph of a DOM object, or any object that has the following structure:
      {
        "nodeType": @int,
        "nodeName": @string,
        "nodeValue": @string,
        "childNodes": @array[] or empty
      }
      The nodeValue object text should always arrive here escaped, so <script> tags will not be written from other DOM objects, in the client.
      */
      if (graphInit.status) {
        document.getElementById(graphInit.status).addEventListener("click", stopAtlas);
      }

      var s,
        userStopped = false,
        nodeIdPrefix = 'n',
        edgeIdPrefix = 'e',
        nodeSize = 1000,
        nodeColor = '#' + (
          Math.floor(Math.random() * 16777215).toString(16) + '000000'
        ).substr(0, 6),
        forceAtlas2Config,
        SEC = 1000,
        finaleEaseTime = 5 * SEC,
        stepTime = 0.2 * SEC; //this one can crash your shizzle

      s = new graphInit.sigma({
        renderer: {
          // IMPORTANT:
          // This works only with the canvas renderer, so the
          // renderer type set as "canvas" is necessary here.
          container: graphInit.graphContainer,
          type: 'canvas'
        },
        settings: graphInit.graphSettings
      });

      /*
          - gravity: brings disconnected components closer to the center (and slightly affects the shape of the components as a side-effect).
          - strongGravityMode:sets a force that attracts the nodes that are distant from the center more ( is this distance).
      */
      forceAtlas2Config = {
        linLogMode: false,
        outboundAttractionDistribution: false,
        adjustSizes: false,
        edgeWeightInfluence: 0,
        scalingRatio: 1,
        strongGravityMode: false,
        gravity: 1,
        barnesHutOptimize: true,
        barnesHutTheta: 0.5,
        slowDown: 40,
        startingIterations: 1,
        iterationsPerRender: 1,
        worker: true
      };

      function stopAtlas() {
        userStopped = true;
      };

      //var edgeIntervalId = setInterval(addAnEdge, 0.3*SEC, E*2);
      //var nodeIntervalId = setInterval(addNodesToEnd, 0.1*SEC, 100);

      /*
       * Breadth First
       */
      recurseBF(s, getHtmlNode(graphJson));

      /*
       * Depth First, all children first
       */
      // var rootId = createRoot(s, graphJson);
      // recurseDomChildren(s, graphJson, rootId);
      // //TODO: this is not stopping it...
      // setTimeout(function() {
      //     s.killForceAtlas2();
      //     console.log('Stopped ForceAtlas2');
      //     updateStatus('Stopped ForceAtlas2');
      //     //doNoverlap(graphInstance);
      // }, finaleEaseTime);

      // ----------- Lib ---------------
      function getHtmlNode(domObject) {
        var i = 0;
        var htmlNode = domObject;

        // Get the first node of type 1
        while (htmlNode.nodeType !== 1) {
          htmlNode = domObject.childNodes[++i];
        }

        return htmlNode;
      }

      function updateStatus(message) {
        statusElement = document.getElementById(options.status);
        statusElement.innerHTML = message;
        statusElement.className = 'sent-message';
        setTimeout(function () {
          statusElement.className = '';
        }, 1000);
      }

      function addElement(elementType, currentElement, content) {
        // create a new  element 
        // and give it some content 
        var newElement = document.createElement(elementType);
        var newContent = document.createTextNode(content);
        newElement.appendChild(newContent); //add the text node to the newly created div. 

        // add the newly created element and its content into the DOM  
        currentElement.parentElement.insertBefore(newElement, currentElement.nextSibling);
      }

      function doNoverlap(graphInstance) {
        // Configure the noverlap layout:
        var noverlapListener = graphInstance.configNoverlap({
          nodeMargin: 1,
          scaleNodes: 1.05,
          gridSize: 75,
          permittedExpansion: 2,
          easing: 'quadraticInOut', // animation transition function
          duration: 10000 // animation duration. Long here for the purposes of this example only
        });
        // Bind the events:
        noverlapListener.bind('start stop interpolate', function (e) {
          console.log('Noverlap: ' + e.type);
          updateStatus('Noverlap: ' + e.type);
          if (e.type === 'start') {
            console.time('noverlap');
          }
          if (e.type === 'interpolate') {
            console.timeEnd('noverlap');
          }
        });
        // Start the layout:
        graphInstance.startNoverlap();
      }

      function createRoot(graphInstance, domNode) {
        if (typeof graphInstance.graph.nodes() !== 'undefined' && graphInstance.graph.nodes().length > 0) {
          console.log("Error creating root object");
          return;
        }

        rootId = (domNode.tagName || domNode.nodeName);

        graphInstance.graph.addNode({
          id: rootId,
          x: 0,
          y: 0,
          size: nodeSize,
          label: rootId + '-0',
          color: '#ccc'
        });

        graphInstance.startForceAtlas2(forceAtlas2Config);

        return rootId;
      }

      function addAnEdge(graphInstance, nodeA, nodeB) {
        graphInstance.killForceAtlas2();
        graphInstance.graph.addEdge({
          id: nodeA + nodeB,
          source: nodeA,
          target: nodeB
        });
        graphInstance.startForceAtlas2();
      }

      function addNodesToEnd(graphInstance, maxNodes) {
        graphInstance.killForceAtlas2();

        allNodes = graphInstance.graph.nodes();
        nodeCount = allNodes.length;
        lastNode = allNodes[nodeCount - 1];
        nodeCount++;

        edgeCount = graphInstance.graph.edges().length;
        edgeCount++;

        graphInstance.graph.addNode({
          id: nodeIdPrefix + nodeCount,
          size: Math.random() * 5,
          x: lastNode.x * Math.cos(2 * 30 * Math.PI / nodeCount),
          y: lastNode.y * Math.sin(2 * 30 * Math.PI / nodeCount),
          color: "#000"
        });

        graphInstance.graph.addEdge({
          id: edgeIdPrefix + edgeCount,
          source: lastNode.id,
          target: nodeIdPrefix + nodeCount
        });
        graphInstance.startForceAtlas2();

        if (nodeCount > maxNodes) {
          clearInterval(nodeIntervalId);
          console.log('stopped adding nodes');
          graphInstance.killForceAtlas2();
          console.log('stopped force atlas');

        }

      }

      function recurseDomChildren(graphInstance, parent, parentNodeId) {
        var children;
        //console.log(parent);

        if (parent.childNodes) {
          children = parent.childNodes;
          var child;

          //Still depth first, but I connect all children to the parent first
          //loop first, and connect all.
          //then loop again, pick one, and connect all of it's children
          //then ...
          // for (var i = 0; i < children.length; i++) {

          // }

          // This is a depth first visualization
          // The problem here is that the setTimeouts are set, then executed at the same time more or less. So this looks like a depth first... somehow. We actually need a signaling system where the last recursion signals the recursion before it to go... the the first call of the recursion stops everything.
          setTimeout(function () {
            for (var i = 0; i < children.length; i++) {


              child = children[i];
              if (child.nodeType === 1) {
                childNodeId = addNewChildNodeToParent(graphInstance, parent, parentNodeId, child);
                if (child.childNodes) {
                  recurseDomChildren(graphInstance, child, childNodeId);
                }
              }

            }
          }, stepTime * 20);

        }
      }

      function recurseBF(graphInstance, treeHeadNode) {
        rootId = createRoot(graphInstance, treeHeadNode);

        var queue = [{
          depth: 0,
          nodeId: rootId,
          element: treeHeadNode
        }];
        var queueItem = 0; //could use that too
        var current;
        var parent;
        var children, i, len;
        var depth; //not really used here, but keep
        var childNodeId;

        var nodeIntervalId = setInterval(function () {
          if (userStopped) {
            graphInstance.killForceAtlas2();
            updateStatus('User stopped ForceAtlas2');
            return;
          }
          if (current = queue.shift()) {
            //console.log('popping next parent from queue');
            depth = current.depth;
            parent = current.element;
            parentNodeId = current.nodeId;
            children = parent.childNodes;

            //I should probably check for ...
            if (children) {
              for (i = 0, len = children.length; i < len; i++) {
                if (children[i].nodeType === 1) {
                  //console.log('adding child to queue');
                  childNodeId = addNewChildNodeToParent(graphInstance, parent, parentNodeId, children[i]);
                  queue.push({ //pass args via object or array
                    element: children[i],
                    nodeId: childNodeId,
                    depth: depth + 1
                  });
                }
              }
            }

            // TODO: instead of edge, I just need a line drawn here.
            // for (var k = 0; k < childrenNodeIds.length - 1 ; k++) {
            //     addAnEdge(graphInstance, childrenNodeIds[k], childrenNodeIds[k + 1]);
            // }

          } else {
            clearInterval(nodeIntervalId);
            updateStatus('Finished adding nodes');
            //give the graph some time to finish rendering
            setTimeout(function () {
              graphInstance.killForceAtlas2();
              updateStatus('Stopped ForceAtlas2');
              //doNoverlap(graphInstance);
            }, finaleEaseTime);
          }

        }, stepTime);

      }

      // Create a node, for every child, and create the edge between it and the parent
      function addNewChildNodeToParent(graphInstance, parent, parentNodeId, child) {

        graphInstance.killForceAtlas2();

        allNodes = graphInstance.graph.nodes();
        nodeCount = allNodes.length;
        nodeCount++;
        childNodeId = child.tagName + '-' + nodeCount;
        parentNode = graphInstance.graph.nodes(parentNodeId);

        var size = Math.random() * nodeSize;

        graphInstance.graph.addNode({
          id: childNodeId,
          label: childNodeId,
          size: size,
          x: parentNode.x + (Math.random() * 2) * Math.cos(2 * 10 * Math.PI / Math.random()),
          y: parentNode.y + (Math.random() * 2) * Math.sin(2 * 10 * Math.PI / Math.random()),
          color: '#' + intToRGB(hashCode(child.tagName))
        });

        //console.log("connecting: " + parentNodeId + '->' + childNodeId);
        graphInstance.graph.addEdge({
          id: parentNodeId + '->' + childNodeId,
          source: parentNodeId,
          target: childNodeId
        });
        graphInstance.startForceAtlas2(forceAtlas2Config);

        return childNodeId;

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

      function outputNode(node) {
        var whitespace = /^\s+$/g;
        if (node.nodeType === 1) {
          //console.log("element: " + node.tagName);
        } else if (node.nodeType === 3) {
          //clear whitespace text nodes
          node.data = node.data.replace(whitespace, "");
          if (node.data) {
            //console.log("text: " + node.data); 
          }
        }
      }
    }
  }
}());