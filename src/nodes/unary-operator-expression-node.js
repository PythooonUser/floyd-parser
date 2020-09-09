const { NodeKind } = require("../node-kind");
const { Token } = require("../token");
const { UnaryExpressionNode } = require("./unary-expression-node");

class UnaryOperatorExpressionNode extends UnaryExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.UnaryOperatorExpressionNode;

    /** @type {Token} */
    this.operator = null;
    /** @type {UnaryExpressionNode} */
    this.operand = null;
  }
}

exports.UnaryOperatorExpressionNode = UnaryOperatorExpressionNode;
