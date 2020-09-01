const { NodeKind } = require("./node-kind");
const { Node } = require("./node");
const { Token } = require("./token");

class ClassBaseClauseNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.ClassBaseClauseNode;

    /** @type {Token} */
    this.colon = null;
    /** @type {Token} */
    this.name = null;
  }
}

exports.ClassBaseClauseNode = ClassBaseClauseNode;
