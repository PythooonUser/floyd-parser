const { NodeKind } = require("../node-kind");
const { Node } = require("../node");
const { Token } = require("../token");

class SourceDocumentNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.SourceDocumentNode;

    /** @type {(Node|Token)[]} */
    this.statements = [];
    /** @type {Token} */
    this.endOfFile = null;
  }
}

exports.SourceDocumentNode = SourceDocumentNode;
