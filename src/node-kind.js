/** Stores information about the kind of Node object. */
class NodeKind {}

NodeKind.SourceDocumentNode = 0;
NodeKind.ClassDeclarationNode = 1;

NodeKind.NodeKindMap = {
  [NodeKind.SourceDocumentNode]: "NodeKind.SourceDocumentNode",
  [NodeKind.ClassDeclarationNode]: "NodeKind.ClassDeclarationNode"
};

exports.NodeKind = NodeKind;
