const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class FunctionDeclarationNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.FunctionDeclarationNode;

    /** @type {Token} */
    this.returnType = null;

    /** @type {Token} */
    this.name = null;

    /** @type {Token} */
    this.leftParen = null;

    /** @type {Node} */
    this.arguments = null;

    /** @type {Token} */
    this.rightParen = null;

    /** @type {Node} */
    this.statements = null;
  }
}

exports.FunctionDeclarationNode = FunctionDeclarationNode;
