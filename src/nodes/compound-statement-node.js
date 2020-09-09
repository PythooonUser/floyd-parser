const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class CompoundStatementNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.CompoundStatementNode;

    /** @type {Token} */
    this.leftBrace = null;

    /** @type {(Node|Token)[]} */
    this.statements = [];

    /** @type {Token} */
    this.rightBrace = null;
  }
}

exports.CompoundStatementNode = CompoundStatementNode;
