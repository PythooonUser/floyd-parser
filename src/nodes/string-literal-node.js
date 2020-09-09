const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class StringLiteralNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.StringLiteralNode;

    /** @type {Token} */
    this.literal = null;
  }
}

exports.StringLiteralNode = StringLiteralNode;
