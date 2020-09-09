const { NodeKind } = require("../node-kind");
const { ExpressionNode } = require("./expression-node");
const { Token } = require("../token");

class AttributeNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.AttributeNode;

    /** @type {Token} */
    this.name = null;
  }
}

exports.AttributeNode = AttributeNode;
