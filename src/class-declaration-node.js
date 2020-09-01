const { NodeKind } = require("./node-kind");
const { Node } = require("./node");
const { Token } = require("./token");

class ClassDeclarationNode extends Node {
  constructor() {
    super();

    this.kind = NodeKind.ClassDeclarationNode;

    /** @type {Token} */
    this.classKeyword = null;
    /** @type {Token} */
    this.abstractKeyword = null;
    /** @type {Token} */
    this.name = null;

    // TODO: BaseClassClause
    // TODO: ClassMembers
  }
}

exports.ClassDeclarationNode = ClassDeclarationNode;
