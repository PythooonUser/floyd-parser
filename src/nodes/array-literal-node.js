const { Token } = require("../token");
const { DelimitedListNode } = require("./delimited-list-node");
const { NodeKind } = require("../node-kind");

class ArrayLiteralNode extends DelimitedListNode {
  constructor() {
    super();

    this.kind = NodeKind.ArrayLiteralNode;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Token} */
    this.rightParen = null;
  }
}

exports.ArrayLiteralNode = ArrayLiteralNode;
