const { Token } = require("../token");
const { ExpressionNode } = require("./expression-node");
const { NodeKind } = require("../node-kind");

class TernaryExpressionNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.TernaryExpressionNode;

    /** @type {ExpressionNode} */
    this.condition = null;

    /** @type {Token} */
    this.question = null;

    /** @type {ExpressionNode} */
    this.truthyExpression = null;

    /** @type {Token} */
    this.colon = null;

    /** @type {ExpressionNode} */
    this.falsyExpression = null;
  }
}

exports.TernaryExpressionNode = TernaryExpressionNode;
