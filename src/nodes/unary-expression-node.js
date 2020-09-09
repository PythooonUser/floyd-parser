const { NodeKind } = require("../node-kind");
const { ExpressionNode } = require("./expression-node");

class UnaryExpressionNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.UnaryExpressionNode;

    /** @type {UnaryExpressionNode} */
    this.operand = null;
  }
}

exports.UnaryExpressionNode = UnaryExpressionNode;
