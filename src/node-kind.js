/** Stores information about the kind of Node object. */
class NodeKind {}

NodeKind.SourceDocumentNode = 0;
NodeKind.ClassDeclarationNode = 1;
NodeKind.ClassBaseClauseNode = 2;

NodeKind.NodeKindMap = {
  [NodeKind.SourceDocumentNode]: "NodeKind.SourceDocumentNode",
  [NodeKind.ClassDeclarationNode]: "NodeKind.ClassDeclarationNode",
  [NodeKind.ClassBaseClauseNode]: "NodeKind.ClassBaseClauseNode"
};

exports.NodeKind = NodeKind;
