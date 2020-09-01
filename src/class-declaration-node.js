const { NodeKind } = require("./node-kind");
const { Node } = require("./node");
const { Token } = require("./token");
const { ClassBaseClauseNode } = require("./class-base-clause-node");
const { ClassMembersNode } = require("./class-members-node");

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
    /** @type {ClassBaseClauseNode} */
    this.baseClause = null;
    /** @type {ClassMembersNode} */
    this.members = null;
  }
}

exports.ClassDeclarationNode = ClassDeclarationNode;
