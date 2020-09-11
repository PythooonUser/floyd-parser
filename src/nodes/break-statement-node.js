const { Token } = require("../token");
const { StatementNode } = require("./statement-node");
const { NodeKind } = require("../node-kind");

class BreakStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.BreakStatementNode;

    /** @type {Token} */
    this.breakKeyword = null;

    /** @type {Token} */
    this.semicolon = null;
  }
}

exports.BreakStatementNode = BreakStatementNode;
