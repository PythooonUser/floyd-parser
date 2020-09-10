const { Token } = require("../token");
const { Node } = require("../node");
const { StatementNode } = require("./statement-node");
const { NodeKind } = require("../node-kind");

class ReturnStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.ReturnStatementNode;

    /** @type {Token} */
    this.returnKeyword = null;

    /** @type {Token|Node} */
    this.expression = null;

    /** @type {Token} */
    this.semicolon = null;
  }
}

exports.ReturnStatementNode = ReturnStatementNode;
