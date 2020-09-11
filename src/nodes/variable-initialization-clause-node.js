const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class VariableInitializationClauseNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.VariableInitializationClauseNode;

    /** @type {Token} */
    this.equals = null;

    /** @type {Token|Node} */
    this.expression = null;
  }
}

exports.VariableInitializationClauseNode = VariableInitializationClauseNode;
