const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class ParameterDeclarationNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.ParameterDeclarationNode;

    /** @type {Token} */
    this.type = null;

    /** @type {Token} */
    this.name = null;
  }
}

exports.ParameterDeclarationNode = ParameterDeclarationNode;
