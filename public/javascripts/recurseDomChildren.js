function recurseDF (parent, callback) {
    var callback = callback || connectNewChild;
    var children;
    if (parent.childNodes) {
        children = parent.childNodes;
        var child;

        // Semi-Depth first: connect all children.
        // for (var i = 0; i < children.length; i++) {
        //     callback(parent, children[i]);
        // }

        for (var i = 0; i < children.length; i++) {
            child = children[i];
            //Real Depth-First
            callback(parent, child);           
            if (child.childNodes) {
                recurseDF(child);
            }
        }
    }
}

function recurseBF (treeHeadNode, callback) {
    var callback = callback || connectNewChild;
    var queue = [{
        depth: 0,
        element: treeHeadNode
    }];
    var queueItem = 0;
    var parent;
    var children, i, len;
    var depth; //not really used here, but I like it

    createRoot(treeHeadNode);// this has to be another callback

    while (parent = queue.shift()) {
        // console.log('shifted next child that is now a parent, from queue');
        // for something like DFS ("show children -> traverse depth first") do .pop()
        //get the arguments
        depth = parent.depth;
        parent = parent.element;
        children = parent.childNodes;
        for (i = 0, len = children.length; i < len; i++) {
            //breadth first, each depth level goes first
            callback(parent, children[i]);
            queue.push({
                element: children[i],
                depth: depth + 1
            });
        }
    }
}

function createRoot (root) {
    console.log(root);
}

function connectNewChild (parent, child) {
    if (child.nodeType === 1) {
    //parents are always type 1, because they can only have children
        console.log((parent.tagName || parent.nodeName) + "---->" + child.tagName);
    }
}

function outputNode (node) {
    var whitespace = /^\s+$/g;
    if (node.nodeType === 1) {
        console.log("element: " + node.tagName);
    } 
    else if (node.nodeType === 3) {
        //clear whitespace text nodes
        node.data = node.data.replace(whitespace, "");
        if (node.data) {
            console.log("text: " + node.data); 
        }
    }
}

// recurseDomChildren.js
// ========
(function(exports) {
    // Define all your functions on the exports object
    exports.recurseDF =  recurseDF;
    exports.recurseBF = recurseBF;
})((typeof process === 'undefined' || !process.versions)
   ? window.recurseDomChildren = window.recurseDomChildren || {}
   : exports);
