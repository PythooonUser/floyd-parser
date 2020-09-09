const { Token } = require("../token");
const { NodeKind } = require("../node-kind");
const { UnaryExpressionNode } = require("./unary-expression-node");

class PrefixUpdateExpressionNode extends UnaryExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.PrefixUpdateExpressionNode;

    /** @type {Token} */
    this.operator = null;

    /** @type {Node} */
    this.operand = null;
  }
}

exports.PrefixUpdateExpressionNode = PrefixUpdateExpressionNode;
