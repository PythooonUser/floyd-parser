const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");
const { StatementNode } = require("./statement-node");

class CaseStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.CaseStatementNode;

    /** @type {Token} */
    this.caseKeyword = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Token|Node} */
    this.expression = null;

    /** @type {Token} */
    this.rightParen = null;

    /** @type {Token} */
    this.semicolon = null;

    /** @type {(Token|Node)[]} */
    this.statements = [];
  }
}

exports.CaseStatementNode = CaseStatementNode;
