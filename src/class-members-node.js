const { NodeKind } = require("./node-kind");
const { Node } = require("./node");
const { Token } = require("./token");

class ClassMembersNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.ClassMembersNode;

    /** @type {Token} */
    this.leftBrace = null;
    /** @type {(Node|Token)[]} */
    this.members = [];
    /** @type {Token} */
    this.rightBrace = null;
  }
}

exports.ClassMembersNode = ClassMembersNode;
