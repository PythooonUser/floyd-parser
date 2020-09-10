const { Token } = require("../token");
const { ExpressionNode } = require("./expression-node");
const { NodeKind } = require("../node-kind");

class ArrayElementAccessExpressionNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.ArrayElementAccessExpressionNode;

    /** @type {ExpressionNode|Token} */
    this.expression = null;

    /** @type {Token} */
    this.leftBracket = null;

    /** @type {ExpressionNode|Token} */
    this.index = null;

    /** @type {Token} */
    this.rightBracket = null;
  }
}

exports.ArrayElementAccessExpressionNode = ArrayElementAccessExpressionNode;
