const { Token } = require("../token");
const { Node } = require("../node");
const { NodeKind } = require("../node-kind");

class SourceDocumentNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.SourceDocumentNode;

    /** @type {(Node|Token)[]} */
    this.statements = [];

    /** @type {Token} */
    this.endOfFile = null;

    /** @type {string} */
    this.document = "";
  }
}

exports.SourceDocumentNode = SourceDocumentNode;
