const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class NumberLiteralNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.NumberLiteralNode;

    /** @type {Token} */
    this.literal = null;
  }
}

exports.NumberLiteralNode = NumberLiteralNode;
