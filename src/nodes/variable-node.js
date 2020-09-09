const { Token } = require("../token");
const { NodeKind } = require("../node-kind");
const { ExpressionNode } = require("./expression-node");

class VariableNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.VariableNode;

    /** @type {Token} */
    this.name = null;
  }
}

exports.VariableNode = VariableNode;
