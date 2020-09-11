const { Token } = require("../token");
const { StatementNode } = require("./statement-node");
const { NodeKind } = require("../node-kind");

class QuitStatementNode extends StatementNode {
  constructor() {
    super();

    this.kind = NodeKind.QuitStatementNode;

    /** @type {Token} */
    this.quitKeyword = null;

    /** @type {Token} */
    this.semicolon = null;
  }
}

exports.QuitStatementNode = QuitStatementNode;
