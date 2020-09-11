const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class ArrayDeclarationClauseNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.ArrayDeclarationClauseNode;

    /** @type {Token} */
    this.leftBracket = null;

    /** @type {Token|Node} */
    this.length = null;

    /** @type {Token} */
    this.rightBracket = null;
  }
}

exports.ArrayDeclarationClauseNode = ArrayDeclarationClauseNode;
