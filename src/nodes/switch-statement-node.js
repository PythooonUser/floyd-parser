const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class SwitchStatementNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.SwitchStatementNode;

    /** @type {Token} */
    this.switchKeyword = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Token|Node} */
    this.expression = null;

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

exports.SwitchStatementNode = SwitchStatementNode;
