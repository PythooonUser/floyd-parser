const { NodeKind } = require("./node-kind");
const { NodeError } = require("./node-error");

/** Represents a single Node in the abstract syntax tree. */
class Node {
  /** Creates a new Node. */
  constructor() {
    /** @type {NodeKind} The kind of the node. */
    this.kind = null;
    /** @type {Node} The parent node of the node. */
    this.parent = null;
    /** @type {NodeError} The error of the node in case of parse issues. */
    this.error = null;
  }
}

exports.Node = Node;
