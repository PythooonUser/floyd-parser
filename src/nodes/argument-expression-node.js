const { ExpressionNode } = require("./expression-node");
const { NodeKind } = require("../node-kind");

class ArgumentExpressionNode extends ExpressionNode {
  constructor() {
    super();

    this.kind = NodeKind.ArgumentExpressionNode;

    /** @type {ExpressionNode} */
    this.argument = null;
  }
}

exports.ArgumentExpressionNode = ArgumentExpressionNode;
