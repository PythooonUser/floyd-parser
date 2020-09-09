const { NodeKind } = require("../node-kind");
const { DelimitedListNode } = require("./delimited-list-node");

class ParameterDeclarationListNode extends DelimitedListNode {
  constructor() {
    super();

    this.kind = NodeKind.ParameterDeclarationListNode;
  }
}

exports.ParameterDeclarationListNode = ParameterDeclarationListNode;
