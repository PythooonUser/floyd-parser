const { NodeKind } = require("../node-kind");
const { Node } = require("../node");

class ExpressionNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.ExpressionNode;
  }
}

exports.ExpressionNode = ExpressionNode;
