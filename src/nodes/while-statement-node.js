const { NodeKind } = require("../node-kind");
const { Node } = require("../node");
const { Token } = require("../token");

class WhileStatementNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.WhileStatementNode;

    /** @type {Token} */
    this.whileKeyword = null;
    /** @type {Token} */
    this.leftParen = null;
    /** @type {Node|Token} */
    this.condition = null;
    /** @type {Token} */
    this.rightParen = null;
    /** @type {Token} */
    this.leftBrace = null;
    /** @type {(Token|Node)[]} */
    this.statements = [];
    /** @type {Token} */
    this.rightBrace = null;
  }
}

exports.WhileStatementNode = WhileStatementNode;
