const { Token } = require("../token");
const { Node } = require("../node");
const { StatementNode } = require("./statement-node");
const { CompoundStatementNode } = require("./compound-statement-node");
const { NodeKind } = require("../node-kind");

class FetchStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.FetchStatementNode;

    /** @type {Token} */
    this.fetchKeyword = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Token|Node} */
    this.variable = null;

    /** @type {Token} */
    this.comma1 = null;

    /** @type {Token|Node} */
    this.expression = null;

    /** @type {Token} */
    this.comma2 = null;

    /** @type {Token|Node} */
    this.reach = null;

    /** @type {Token} */
    this.rightParen = null;

    /** @type {Token|CompoundStatementNode} */
    this.statements = null;
  }
}

exports.FetchStatementNode = FetchStatementNode;
