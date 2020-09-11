const { Token } = require("../token");
const { Node } = require("../node");
const { StatementNode } = require("./statement-node");
const { CompoundStatementNode } = require("./compound-statement-node");
const { NodeKind } = require("../node-kind");

class ForStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.ForStatementNode;

    /** @type {Token} */
    this.forKeyword = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Token|Node} */
    this.initializer = null;

    /** @type {Token} */
    this.semicolon1 = null;

    /** @type {Token|Node} */
    this.condition = null;

    /** @type {Token} */
    this.semicolon2 = null;

    /** @type {Token|Node} */
    this.increment = null;

    /** @type {Token} */
    this.rightParen = null;

    /** @type {Token|CompoundStatementNode} */
    this.statements = null;
  }
}

exports.ForStatementNode = ForStatementNode;
