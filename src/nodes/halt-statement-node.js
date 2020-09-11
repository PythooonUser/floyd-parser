const { Token } = require("../token");
const { Node } = require("../node");
const { StatementNode } = require("./statement-node");
const { NodeKind } = require("../node-kind");

class HaltStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.HaltStatementNode;

    /** @type {Token} */
    this.haltKeyword = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Token|Node} */
    this.expression = null;

    /** @type {Token} */
    this.rightParen = null;

    /** @type {Token} */
    this.semicolon = null;
  }
}

exports.HaltStatementNode = HaltStatementNode;
