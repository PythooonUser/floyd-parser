const { Token } = require("../token");
const { NodeKind } = require("../node-kind");
const { ExpressionNode } = require("./expression-node");

class MemberAccessExpressionNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.MemberAccessExpressionNode;

    /** @type {Node|Token} */
    this.expression = null;

    /** @type {Token} */
    this.dot = null;

    /** @type {Token} */
    this.member = null;
  }
}

exports.MemberAccessExpressionNode = MemberAccessExpressionNode;
