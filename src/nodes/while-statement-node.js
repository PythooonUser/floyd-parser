const { Token } = require("../token");
const { Node } = require("../node");
const { StatementNode } = require("./statement-node");
const { CompoundStatementNode } = require("./compound-statement-node");
const { NodeKind } = require("../node-kind");

class WhileStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.WhileStatementNode;

    /** @type {Token} */
    this.whileKeyword = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Token|Node} */
    this.condition = null;

    /** @type {Token} */
    this.rightParen = null;

    /** @type {Token|CompoundStatementNode} */
    this.statements = null;
  }
}

exports.WhileStatementNode = WhileStatementNode;
