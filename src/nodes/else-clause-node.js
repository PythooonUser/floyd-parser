const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class ElseClauseNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.ElseClauseNode;

    /** @type {Token} */
    this.elseKeyword = null;

    /** @type {(Token|Node)[]} */
    this.statements = [];
  }
}

exports.ElseClauseNode = ElseClauseNode;
