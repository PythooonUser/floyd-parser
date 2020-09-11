const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class VariableDeclarationNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.VariableDeclarationNode;

    /** @type {Token} */
    this.name = null;

    /** @type {Node} */
    this.arrayDeclarationClause = null;

    /** @type {Node} */
    this.variableInitializationClause = null;
  }
}

exports.VariableDeclarationNode = VariableDeclarationNode;
