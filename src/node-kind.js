/** Stores information about the kind of Node object. */
class NodeKind {}

NodeKind.SourceDocumentNode = 0;

NodeKind.NodeKindMap = {
  [NodeKind.SourceDocumentNode]: "NodeKind.SourceDocumentNode"
};

exports.NodeKind = NodeKind;
