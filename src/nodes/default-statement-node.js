const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");
const { StatementNode } = require("./statement-node");

class DefaultStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.DefaultStatementNode;

    /** @type {Token} */
    this.defaultKeyword = null;

    /** @type {Token} */
    this.semicolon = null;

    /** @type {(Token|Node)[]} */
    this.statements = [];
  }
}

exports.DefaultStatementNode = DefaultStatementNode;
