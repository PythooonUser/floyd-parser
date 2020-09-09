const { NodeKind } = require("../node-kind");
const { ExpressionNode } = require("./expression-node");
const { Token } = require("../token");

class BinaryExpressionNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.BinaryExpressionNode;

    /** @type {ExpressionNode} */
    this.leftOperand = null;
    /** @type {Token} */
    this.operator = null;
    /** @type {ExpressionNode} */
    this.rightOperand = null;
  }
}

exports.BinaryExpressionNode = BinaryExpressionNode;
