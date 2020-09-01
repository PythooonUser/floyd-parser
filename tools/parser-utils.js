const { Token } = require("../src/token");
const { TokenKind } = require("../src/token-kind");
const { TokenError } = require("../src/token-error");
const { Node } = require("../src/node");
const { NodeKind } = require("../src/node-kind");
const { Parser } = require("../src/floyd-parser");

const arguments = process.argv;
let document = "";

if (arguments.length < 3) {
  console.log("USAGE: node parser-utils.js <floyd-code>\n");
} else {
  document = arguments[2];
}

const parser = new Parser();
const sourceDocumentNode = parser.parseSourceDocument(document);

console.log(
  JSON.stringify(
    sourceDocumentNode,
    function (key, value) {
      // TODO: Make trivia exclusion optional.
      if (key === "parent" || key === "trivia") {
        return;
      }

      if (this instanceof Token) {
        if (key === "kind") {
          return TokenKind.TokenKindMap[value];
        }
        if (key === "error") {
          const error = TokenError.TokenErrorMap[value];
          return error ? error : null;
        }
      }

      if (this instanceof Node) {
        if (key === "kind") {
          return NodeKind.NodeKindMap[value];
        }
        if (key === "error") {
          const error = TokenError.TokenErrorMap[value];
          return error ? error : null;
        }
      }

      return value;
    },
    2
  )
);
