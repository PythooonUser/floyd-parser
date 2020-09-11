const { Token } = require("../token");
const { ExpressionNode } = require("./expression-node");
const { NodeKind } = require("../node-kind");

class PostfixUpdateExpressionNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.PostfixUpdateExpressionNode;

    /** @type {Node} */
    this.operand = null;

    /** @type {Token} */
    this.operator = null;
  }
}

exports.PostfixUpdateExpressionNode = PostfixUpdateExpressionNode;
