const { Token } = require("./token");
const { NodeKind } = require("./node-kind");
const { NodeError } = require("./node-error");

/** Represents a single Node in the abstract syntax tree. */
class Node {
  constructor() {
    /** @type {NodeKind} The kind of the node. */
    this.kind = null;

    /** @type {Node} The parent node of the node. */
    this.parent = null;

    /** @type {NodeError} The error of the node in case of parse issues. */
    this.error = null;
  }

  walk(callback) {
    for (const key in this) {
      if (["parent", "kind", "error"].includes(key)) {
        continue;
      }

      const child = this[key];

      if (child instanceof Token) {
        callback(child);
      } else if (child instanceof Node) {
        callback(child);
        child.walk(callback);
      } else if (Array.isArray(child)) {
        for (const element of child) {
          if (element instanceof Token) {
            callback(element);
          } else if (element instanceof Node) {
            callback(element);
            element.walk(callback);
          }
        }
      }
    }
  }
}

exports.Node = Node;
