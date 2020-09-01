const assert = require("assert");
const { TokenKind } = require("../src/token-kind");
const { NodeKind } = require("../src/node-kind");
const { Parser } = require("../src/floyd-parser");
const { SourceDocumentNode } = require("../src/source-document-node");

describe("Parser", function () {
  /** @type {Parser} */
  const parser = new Parser();

  /**
   * Parses the source document and returns the Abstract Syntax Tree.
   *
   * @param {string} document The source document.
   * @return {SourceDocumentNode} The abstract syntax tree.
   */
  const parseSourceDocument = document => parser.parseSourceDocument(document);

  /**
   * Asserts that two SourceDocumentNode objects are equal.
   *
   * @param {SourceDocumentNode} actual The actual Node object.
   * @param {SourceDocumentNode} expected The expected Node object.
   */
  const assertNodesEqual = (actual, expected) => {
    // TODO: Make this generic for any kind of Node or Token!
    assert.strictEqual(
      actual.kind,
      expected.kind,
      "Node kinds should be equal."
    );
  };

  describe("End Of File", function () {
    it("Should handle end of file", function () {
      const document = ``;

      /** @type {SourceDocumentNode} */
      const expected = {
        kind: NodeKind.SourceDocumentNode,
        error: null,
        statements: [],
        endOfFile: {
          start: 0,
          length: 0,
          kind: TokenKind.EndOfFile,
          error: null
        }
      };

      const actual = parseSourceDocument(document);

      assertNodesEqual(actual, expected);
    });
  });
});
