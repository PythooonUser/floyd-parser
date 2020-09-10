const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class StatementNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.StatementNode;
  }
}

exports.StatementNode = StatementNode;
