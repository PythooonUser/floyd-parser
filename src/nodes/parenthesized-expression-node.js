const { Token } = require("../token");
const { NodeKind } = require("../node-kind");
const { ExpressionNode } = require("./expression-node");

class ParenthesizedExpressionNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.ParenthesizedExpressionNode;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Node|Token} */
    this.expression = null;

    /** @type {Token} */
    this.rightParen = null;
  }
}

exports.ParenthesizedExpressionNode = ParenthesizedExpressionNode;
