const { Token } = require("../token");
const { NodeKind } = require("../node-kind");
const { DelimitedListNode } = require("./delimited-list-node");

class VariableDeclarationListNode extends DelimitedListNode {
  constructor() {
    super();

    this.kind = NodeKind.VariableDeclarationListNode;

    /** @type {Token} */
    this.type = null;

    /** @type {Token} */
    this.semicolon = null;
  }
}

exports.VariableDeclarationListNode = VariableDeclarationListNode;
