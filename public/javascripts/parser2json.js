function toJSON(node) {
  node = node || this; // maybe fail if node is undefined
  var obj = {
    nodeType: node.type
  };
  if (node.name) {
    obj.tagName = node.name.toLowerCase();
  }
  if (node.data) {
    obj.nodeValue = escapeHtml(node.data);
  }
  if (node.parent) {
    obj.parentElement = node.parent;
  }
  var attrs = node.attribs;
  if (attrs) {
    var length = attrs.length;
    var arr = obj.attributes = new Array(length);
    // for (var i = 0; i < length; i++) {
    //   attr = attrs[i];
    //   arr[i] = [attr.nodeName, attr.nodeValue];
    // }
    var i = 0;
    for(var key in attrs) {
        attr = attrs[key];
        arr[i] = [attr.name, attr.data];
        i++;
    }
  }
  var childNodes = node.children;
  if (childNodes) {
    length = childNodes.length;
    arr = obj.childNodes = new Array(length);
    for (i = 0; i < length; i++) {
      if (childNodes[i].type == 'tag') {
        arr[i] = toJSON(childNodes[i]);
      }
    }
  }
  return obj;
}

function toDOM(obj) {
  if (typeof obj == 'string') {
    obj = JSON.parse(obj);
  }
  var node, nodeType = obj.nodeType;
  switch (nodeType) {
    case 1: //ELEMENT_NODE
      node = document.createElement(obj.tagName);
      var attributes = obj.attributes || [];
      for (var i = 0, len = attributes.length; i < len; i++) {
        var attr = attributes[i];
        node.setAttribute(attr[0], attr[1]);
      }
      break;
    case 3: //TEXT_NODE
      node = document.createTextNode(obj.nodeValue);
      break;
    case 8: //COMMENT_NODE
      node = document.createComment(obj.nodeValue);
      break;
    case 9: //DOCUMENT_NODE
      node = document.implementation.createDocument();
      break;
    case 10: //DOCUMENT_TYPE_NODE
      node = document.implementation.createDocumentType(obj.nodeName);
      break;
    case 11: //DOCUMENT_FRAGMENT_NODE
      node = document.createDocumentFragment();
      break;
    default:
      return node;
  }
  if (nodeType == 1 || nodeType == 11) {
    var childNodes = obj.childNodes || [];
    for (i = 0, len = childNodes.length; i < len; i++) {
      node.appendChild(toDOM(childNodes[i]));
    }
  }
  return node;
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

// parser2json.js
// ========
(function(exports) {
    // Define all your functions on the exports object
    exports.toJSON = toJSON;
    exports.toDOM = toDOM;
})((typeof process === 'undefined' || !process.versions)
   ? window.parser2json = window.parser2json || {}
   : exports);
