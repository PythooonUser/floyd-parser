const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class DelimitedListNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.DelimitedListNode;

    /** @type {(Token|Node)[]} */
    this.elements = [];
  }

  addElement(element) {
    this.elements.push(element);
  }
}

exports.DelimitedListNode = DelimitedListNode;
