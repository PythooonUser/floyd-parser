const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class VerbStatementNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.VerbStatementNode;

    /** @type {Token} */
    this.verbKeyword = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Node|Token} */
    this.patternExpression = null;

    /** @type {Token} */
    this.comma1 = null;

    /** @type {Node|Token} */
    this.actionExpression = null;

    /** @type {Token} */
    this.comma2 = null;

    /** @type {Node|Token} */
    this.metaExpression = null;

    /** @type {Token} */
    this.rightParen = null;

    /** @type {Token} */
    this.semicolon = null;
  }
}

exports.VerbStatementNode = VerbStatementNode;
