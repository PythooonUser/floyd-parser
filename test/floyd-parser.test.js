const assert = require("assert");
const { TokenKind } = require("../src/token-kind");
const { NodeKind } = require("../src/node-kind");
const { Parser } = require("../src/floyd-parser");
const { SourceDocumentNode } = require("../src/source-document-node");
const { TokenError } = require("../src/token-error");

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

  describe("Unkown Token", function () {
    it("Should handle unknown token as skipped token", function () {
      const document = `§`;

      /** @type {SourceDocumentNode} */
      const expected = {
        kind: NodeKind.SourceDocumentNode,
        error: null,
        statements: [
          {
            start: 0,
            length: 1,
            kind: TokenKind.UnknownToken,
            error: TokenError.SkippedToken
          }
        ],
        endOfFile: {
          start: 1,
          length: 0,
          kind: TokenKind.EndOfFile,
          error: null
        }
      };

      const actual = parseSourceDocument(document);

      assertNodesEqual(actual, expected);
    });
  });

  describe("Statements", function () {
    describe("Class Declaration", function () {
      it("Should handle class declaration", function () {
        const document = `class Foo {}`;

        /** @type {SourceDocumentNode} */
        const expected = {
          kind: NodeKind.SourceDocumentNode,
          error: null,
          statements: [
            {
              kind: NodeKind.ClassDeclarationNode,
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: TokenKind.ClassKeyword,
                error: null
              },
              abstractKeyword: null,
              name: {
                start: 6,
                length: 3,
                kind: TokenKind.Name,
                error: null
              },
              members: {
                kind: NodeKind.ClassMembersNode,
                error: null,
                leftBrace: {
                  start: 10,
                  length: 1,
                  kind: TokenKind.LeftBrace,
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 11,
                  length: 1,
                  kind: TokenKind.RightBrace,
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 12,
            length: 0,
            kind: TokenKind.EndOfFile,
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle incomplete class declaration", function () {
        const document = `class Foo {`;

        /** @type {SourceDocumentNode} */
        const expected = {
          kind: NodeKind.SourceDocumentNode,
          error: null,
          statements: [
            {
              kind: NodeKind.ClassDeclarationNode,
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: TokenKind.ClassKeyword,
                error: null
              },
              abstractKeyword: null,
              name: {
                start: 6,
                length: 3,
                kind: TokenKind.Name,
                error: null
              },
              members: {
                kind: NodeKind.ClassMembersNode,
                error: null,
                leftBrace: {
                  start: 10,
                  length: 1,
                  kind: TokenKind.LeftBrace,
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 11,
                  length: 0,
                  kind: TokenKind.RightBrace,
                  error: TokenError.MissingToken
                }
              }
            }
          ],
          endOfFile: {
            start: 11,
            length: 0,
            kind: TokenKind.EndOfFile,
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle class declaration with base class", function () {
        const document = `class Foo: BaseFoo {}`;

        /** @type {SourceDocumentNode} */
        const expected = {
          kind: NodeKind.SourceDocumentNode,
          error: null,
          statements: [
            {
              kind: NodeKind.ClassDeclarationNode,
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: TokenKind.ClassKeyword,
                error: null
              },
              abstractKeyword: null,
              name: {
                start: 6,
                length: 3,
                kind: TokenKind.Name,
                error: null
              },
              baseClause: {
                kind: NodeKind.ClassBaseClauseNode,
                error: null,
                colon: {
                  start: 9,
                  length: 1,
                  kind: TokenKind.ColonOperator,
                  error: null
                },
                name: {
                  start: 11,
                  length: 7,
                  kind: TokenKind.Name,
                  error: null
                }
              },
              members: {
                kind: NodeKind.ClassMembersNode,
                error: null,
                leftBrace: {
                  start: 19,
                  length: 1,
                  kind: TokenKind.LeftBrace,
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 20,
                  length: 1,
                  kind: TokenKind.RightBrace,
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 21,
            length: 0,
            kind: TokenKind.EndOfFile,
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle abstract class declaration", function () {
        const document = `class abstract Foo {}`;

        /** @type {SourceDocumentNode} */
        const expected = {
          kind: NodeKind.SourceDocumentNode,
          error: null,
          statements: [
            {
              kind: NodeKind.ClassDeclarationNode,
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: TokenKind.ClassKeyword,
                error: null
              },
              abstractKeyword: {
                start: 6,
                length: 8,
                kind: TokenKind.AbstractKeyword,
                error: null
              },
              name: {
                start: 15,
                length: 3,
                kind: TokenKind.Name,
                error: null
              },
              members: {
                kind: NodeKind.ClassMembersNode,
                error: null,
                leftBrace: {
                  start: 19,
                  length: 1,
                  kind: TokenKind.LeftBrace,
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 20,
                  length: 1,
                  kind: TokenKind.RightBrace,
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 21,
            length: 0,
            kind: TokenKind.EndOfFile,
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle abstract class declaration with base class", function () {
        const document = `class abstract Foo: BaseFoo {}`;

        /** @type {SourceDocumentNode} */
        const expected = {
          kind: NodeKind.SourceDocumentNode,
          error: null,
          statements: [
            {
              kind: NodeKind.ClassDeclarationNode,
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: TokenKind.ClassKeyword,
                error: null
              },
              abstractKeyword: {
                start: 6,
                length: 8,
                kind: TokenKind.AbstractKeyword,
                error: null
              },
              name: {
                start: 15,
                length: 3,
                kind: TokenKind.Name,
                error: null
              },
              baseClause: {
                kind: NodeKind.ClassBaseClauseNode,
                error: null,
                colon: {
                  start: 18,
                  length: 1,
                  kind: TokenKind.ColonOperator,
                  error: null
                },
                name: {
                  start: 20,
                  length: 7,
                  kind: TokenKind.Name,
                  error: null
                }
              },
              members: {
                kind: NodeKind.ClassMembersNode,
                error: null,
                leftBrace: {
                  start: 28,
                  length: 1,
                  kind: TokenKind.LeftBrace,
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 29,
                  length: 1,
                  kind: TokenKind.RightBrace,
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 30,
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
});
