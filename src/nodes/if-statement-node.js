const { Token } = require("../token");
const { Node } = require("../node");
const { StatementNode } = require("./statement-node");
const { ElseClauseNode } = require("./else-clause-node");
const { NodeKind } = require("../node-kind");

class IfStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.IfStatementNode;

    /** @type {Token} */
    this.ifKeyword = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Node} */
    this.condition = null;

    /** @type {Token} */
    this.rightParen = null;

    /** @type {(Token|Node)[]} */
    this.statements = [];

    /** @type {ElseClauseNode} */
    this.elseClause = null;
  }
}

exports.IfStatementNode = IfStatementNode;
