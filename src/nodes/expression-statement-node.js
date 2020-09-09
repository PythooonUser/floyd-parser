const { NodeKind } = require("../node-kind");
const { Node } = require("../node");
const { Token } = require("../token");

class ExpressionStatementNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.ExpressionStatementNode;

    /** @type {Node|Token} */
    this.expression = null;
    /** @type {Token} */
    this.semicolon = null;
  }
}

exports.ExpressionStatementNode = ExpressionStatementNode;
