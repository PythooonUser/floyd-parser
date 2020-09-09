const { NodeKind } = require("../node-kind");
const { DelimitedListNode } = require("./delimited-list-node");

class ArgumentExpressionListNode extends DelimitedListNode {
  constructor() {
    super();

    this.kind = NodeKind.ArgumentExpressionListNode;
  }
}

exports.ArgumentExpressionListNode = ArgumentExpressionListNode;
