const { Token } = require("../token");
const { NodeKind } = require("../node-kind");
const { ExpressionNode } = require("./expression-node");

class CallExpressionNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.CallExpressionNode;

    /** @type {Node} */
    this.expression = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {ArgumentExpressionList} */
    this.arguments = null;

    /** @type {Token} */
    this.rightParen = null;
  }
}

exports.CallExpressionNode = CallExpressionNode;
