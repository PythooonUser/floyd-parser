const assert = require("assert");
const { Parser } = require("../src/floyd-parser");
const { SourceDocumentNode } = require("../src/nodes/source-document-node");

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
    assert.deepStrictEqual(
      JSON.parse(
        JSON.stringify(actual, function (key, value) {
          if (key === "parent" || key === "trivia") {
            return;
          }

          return value;
        })
      ),
      expected,
      "Abstract Syntax Trees should be equal"
    );
  };

  describe("End Of File", function () {
    it("Should handle end of file", function () {
      const document = ``;

      const expected = {
        kind: "NodeKind.SourceDocumentNode",
        error: null,
        statements: [],
        endOfFile: {
          start: 0,
          length: 0,
          kind: "TokenKind.EndOfFile",
          error: null
        }
      };

      const actual = parseSourceDocument(document);

      assertNodesEqual(actual, expected);
    });
  });

  describe("Unkown Token", function () {
    it("Should handle unknown token as skipped token - 01", function () {
      const document = `§`;

      const expected = {
        kind: "NodeKind.SourceDocumentNode",
        error: null,
        statements: [
          {
            start: 0,
            length: 1,
            kind: "TokenKind.UnknownToken",
            error: "TokenError.SkippedToken"
          }
        ],
        endOfFile: {
          start: 1,
          length: 0,
          kind: "TokenKind.EndOfFile",
          error: null
        }
      };

      const actual = parseSourceDocument(document);

      assertNodesEqual(actual, expected);
    });

    it("Should handle unknown token as skipped token - 02", function () {
      const document = `a; § b;`;

      const expected = {
        kind: "NodeKind.SourceDocumentNode",
        error: null,
        statements: [
          {
            kind: "NodeKind.ExpressionStatementNode",
            error: null,
            expression: {
              kind: "NodeKind.VariableNode",
              error: null,
              name: {
                start: 0,
                length: 1,
                kind: "TokenKind.Name",
                error: null
              }
            },
            semicolon: {
              start: 1,
              length: 1,
              kind: "TokenKind.SemicolonDelimiter",
              error: null
            }
          },
          {
            start: 3,
            length: 1,
            kind: "TokenKind.UnknownToken",
            error: "TokenError.SkippedToken"
          },
          {
            kind: "NodeKind.ExpressionStatementNode",
            error: null,
            expression: {
              kind: "NodeKind.VariableNode",
              error: null,
              name: {
                start: 5,
                length: 1,
                kind: "TokenKind.Name",
                error: null
              }
            },
            semicolon: {
              start: 6,
              length: 1,
              kind: "TokenKind.SemicolonDelimiter",
              error: null
            }
          }
        ],
        endOfFile: {
          start: 7,
          length: 0,
          kind: "TokenKind.EndOfFile",
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

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ClassDeclarationNode",
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: "TokenKind.ClassKeyword",
                error: null
              },
              abstractKeyword: null,
              name: {
                start: 6,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              members: {
                kind: "NodeKind.ClassMembersNode",
                error: null,
                leftBrace: {
                  start: 10,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 11,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 12,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle incomplete class declaration - 01", function () {
        const document = `class Foo {`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ClassDeclarationNode",
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: "TokenKind.ClassKeyword",
                error: null
              },
              abstractKeyword: null,
              name: {
                start: 6,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              members: {
                kind: "NodeKind.ClassMembersNode",
                error: null,
                leftBrace: {
                  start: 10,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 11,
                  length: 0,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: "TokenError.MissingToken"
                }
              }
            }
          ],
          endOfFile: {
            start: 11,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle incomplete class declaration - 02", function () {
        const document = `class Foo { class Bar {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ClassDeclarationNode",
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: "TokenKind.ClassKeyword",
                error: null
              },
              abstractKeyword: null,
              name: {
                start: 6,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              members: {
                kind: "NodeKind.ClassMembersNode",
                error: null,
                leftBrace: {
                  start: 10,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 12,
                  length: 0,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: "TokenError.MissingToken"
                }
              }
            },
            {
              kind: "NodeKind.ClassDeclarationNode",
              error: null,
              classKeyword: {
                start: 12,
                length: 5,
                kind: "TokenKind.ClassKeyword",
                error: null
              },
              abstractKeyword: null,
              name: {
                start: 18,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              members: {
                kind: "NodeKind.ClassMembersNode",
                error: null,
                leftBrace: {
                  start: 22,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 23,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 24,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle class declaration with base class", function () {
        const document = `class Foo: BaseFoo {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ClassDeclarationNode",
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: "TokenKind.ClassKeyword",
                error: null
              },
              abstractKeyword: null,
              name: {
                start: 6,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              baseClause: {
                kind: "NodeKind.ClassBaseClauseNode",
                error: null,
                colon: {
                  start: 9,
                  length: 1,
                  kind: "TokenKind.ColonOperator",
                  error: null
                },
                name: {
                  start: 11,
                  length: 7,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              members: {
                kind: "NodeKind.ClassMembersNode",
                error: null,
                leftBrace: {
                  start: 19,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 20,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 21,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle abstract class declaration", function () {
        const document = `class abstract Foo {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ClassDeclarationNode",
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: "TokenKind.ClassKeyword",
                error: null
              },
              abstractKeyword: {
                start: 6,
                length: 8,
                kind: "TokenKind.AbstractKeyword",
                error: null
              },
              name: {
                start: 15,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              members: {
                kind: "NodeKind.ClassMembersNode",
                error: null,
                leftBrace: {
                  start: 19,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 20,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 21,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle abstract class declaration with base class", function () {
        const document = `class abstract Foo: BaseFoo {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ClassDeclarationNode",
              error: null,
              classKeyword: {
                start: 0,
                length: 5,
                kind: "TokenKind.ClassKeyword",
                error: null
              },
              abstractKeyword: {
                start: 6,
                length: 8,
                kind: "TokenKind.AbstractKeyword",
                error: null
              },
              name: {
                start: 15,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              baseClause: {
                kind: "NodeKind.ClassBaseClauseNode",
                error: null,
                colon: {
                  start: 18,
                  length: 1,
                  kind: "TokenKind.ColonOperator",
                  error: null
                },
                name: {
                  start: 20,
                  length: 7,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              members: {
                kind: "NodeKind.ClassMembersNode",
                error: null,
                leftBrace: {
                  start: 28,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                members: [],
                rightBrace: {
                  start: 29,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 30,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("Verb Declaration", function () {
      it("Should handle verb declaration", function () {
        const document = `verb("pattern", A_ACTION, 0);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.VerbStatementNode",
              error: null,
              verbKeyword: {
                start: 0,
                length: 4,
                kind: "TokenKind.VerbKeyword",
                error: null
              },
              leftParen: {
                start: 4,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              patternExpression: {
                kind: "NodeKind.StringLiteralNode",
                error: null,
                literal: {
                  start: 5,
                  length: 9,
                  kind: "TokenKind.StringLiteral",
                  error: null
                }
              },
              comma1: {
                start: 14,
                length: 1,
                kind: "TokenKind.CommaDelimiter",
                error: null
              },
              actionExpression: {
                kind: "NodeKind.VariableNode",
                error: null,
                name: {
                  start: 16,
                  length: 8,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              comma2: {
                start: 24,
                length: 1,
                kind: "TokenKind.CommaDelimiter",
                error: null
              },
              metaExpression: {
                kind: "NodeKind.NumberLiteralNode",
                error: null,
                literal: {
                  start: 26,
                  length: 1,
                  kind: "TokenKind.NumberLiteral",
                  error: null
                }
              },
              rightParen: {
                start: 27,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              semicolon: {
                start: 28,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 29,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("Function Declaration", function () {
      it("Should handle function declaration with no parameters - 01", function () {
        const document = `int foo() {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.FunctionDeclarationNode",
              error: null,
              returnType: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              name: {
                start: 4,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              leftParen: {
                start: 7,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              arguments: {
                kind: "NodeKind.ParameterDeclarationListNode",
                error: null,
                elements: []
              },
              rightParen: {
                start: 8,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 10,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 11,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 12,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function declaration with no parameters - 02", function () {
        const document = `int foo() {`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.FunctionDeclarationNode",
              error: null,
              returnType: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              name: {
                start: 4,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              leftParen: {
                start: 7,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              arguments: {
                kind: "NodeKind.ParameterDeclarationListNode",
                error: null,
                elements: []
              },
              rightParen: {
                start: 8,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 10,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 11,
                  length: 0,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: "TokenError.MissingToken"
                }
              }
            }
          ],
          endOfFile: {
            start: 11,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function declaration with no parameters - 03", function () {
        const document = `int foo()`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.FunctionDeclarationNode",
              error: null,
              returnType: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              name: {
                start: 4,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              leftParen: {
                start: 7,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              arguments: {
                kind: "NodeKind.ParameterDeclarationListNode",
                error: null,
                elements: []
              },
              rightParen: {
                start: 8,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 9,
                  length: 0,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: "TokenError.MissingToken"
                },
                statements: [],
                rightBrace: {
                  start: 9,
                  length: 0,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: "TokenError.MissingToken"
                }
              }
            }
          ],
          endOfFile: {
            start: 9,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function declaration with no parameters - 04", function () {
        const document = `int foo(`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.FunctionDeclarationNode",
              error: null,
              returnType: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              name: {
                start: 4,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              leftParen: {
                start: 7,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              arguments: {
                kind: "NodeKind.ParameterDeclarationListNode",
                error: null,
                elements: []
              },
              rightParen: {
                start: 8,
                length: 0,
                kind: "TokenKind.RightParenDelimiter",
                error: "TokenError.MissingToken"
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 8,
                  length: 0,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: "TokenError.MissingToken"
                },
                statements: [],
                rightBrace: {
                  start: 8,
                  length: 0,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: "TokenError.MissingToken"
                }
              }
            }
          ],
          endOfFile: {
            start: 8,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function declaration with no parameters - 05", function () {
        const document = `string foo() {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.FunctionDeclarationNode",
              error: null,
              returnType: {
                start: 0,
                length: 6,
                kind: "TokenKind.StringKeyword",
                error: null
              },
              name: {
                start: 7,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              leftParen: {
                start: 10,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              arguments: {
                kind: "NodeKind.ParameterDeclarationListNode",
                error: null,
                elements: []
              },
              rightParen: {
                start: 11,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 13,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 14,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 15,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function declaration with no parameters - 06", function () {
        const document = `object foo() {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.FunctionDeclarationNode",
              error: null,
              returnType: {
                start: 0,
                length: 6,
                kind: "TokenKind.ObjectKeyword",
                error: null
              },
              name: {
                start: 7,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              leftParen: {
                start: 10,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              arguments: {
                kind: "NodeKind.ParameterDeclarationListNode",
                error: null,
                elements: []
              },
              rightParen: {
                start: 11,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 13,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 14,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 15,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function declaration with no parameters - 07", function () {
        const document = `void foo() {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.FunctionDeclarationNode",
              error: null,
              returnType: {
                start: 0,
                length: 4,
                kind: "TokenKind.VoidKeyword",
                error: null
              },
              name: {
                start: 5,
                length: 3,
                kind: "TokenKind.Name",
                error: null
              },
              leftParen: {
                start: 8,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              arguments: {
                kind: "NodeKind.ParameterDeclarationListNode",
                error: null,
                elements: []
              },
              rightParen: {
                start: 9,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 11,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 12,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 13,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it.skip("Should handle function declaration with no parameters - 08", function () {
        const document = `bar foo() {}`;

        const expected = {};

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("Variable Declaration", function () {
      it("Should handle variable declaration - 01", function () {
        const document = `int a;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.VariableDeclarationListNode",
              error: null,
              elements: [
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: null,
                  variableInitializationClause: null
                }
              ],
              type: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle variable declaration - 02", function () {
        const document = `string a;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.VariableDeclarationListNode",
              error: null,
              elements: [
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 7,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: null,
                  variableInitializationClause: null
                }
              ],
              type: {
                start: 0,
                length: 6,
                kind: "TokenKind.StringKeyword",
                error: null
              },
              semicolon: {
                start: 8,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 9,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle variable declaration - 03", function () {
        const document = `object a;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.VariableDeclarationListNode",
              error: null,
              elements: [
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 7,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: null,
                  variableInitializationClause: null
                }
              ],
              type: {
                start: 0,
                length: 6,
                kind: "TokenKind.ObjectKeyword",
                error: null
              },
              semicolon: {
                start: 8,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 9,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it.skip("Should handle variable declaration - 04", function () {
        const document = `foo a;`;

        const expected = {};

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle variable declaration - 05", function () {
        const document = `int a, b;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.VariableDeclarationListNode",
              error: null,
              elements: [
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: null,
                  variableInitializationClause: null
                },
                {
                  start: 5,
                  length: 1,
                  kind: "TokenKind.CommaDelimiter",
                  error: null
                },
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 7,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: null,
                  variableInitializationClause: null
                }
              ],
              type: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              semicolon: {
                start: 8,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 9,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle variable declaration - 06", function () {
        const document = `int a = 0;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.VariableDeclarationListNode",
              error: null,
              elements: [
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: null,
                  variableInitializationClause: {
                    kind: "NodeKind.VariableInitializationClauseNode",
                    error: null,
                    equals: {
                      start: 6,
                      length: 1,
                      kind: "TokenKind.EqualsOperator",
                      error: null
                    },
                    expression: {
                      kind: "NodeKind.NumberLiteralNode",
                      error: null,
                      literal: {
                        start: 8,
                        length: 1,
                        kind: "TokenKind.NumberLiteral",
                        error: null
                      }
                    }
                  }
                }
              ],
              type: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              semicolon: {
                start: 9,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 10,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle variable declaration - 07", function () {
        const document = `int a = 0, b;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.VariableDeclarationListNode",
              error: null,
              elements: [
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: null,
                  variableInitializationClause: {
                    kind: "NodeKind.VariableInitializationClauseNode",
                    error: null,
                    equals: {
                      start: 6,
                      length: 1,
                      kind: "TokenKind.EqualsOperator",
                      error: null
                    },
                    expression: {
                      kind: "NodeKind.NumberLiteralNode",
                      error: null,
                      literal: {
                        start: 8,
                        length: 1,
                        kind: "TokenKind.NumberLiteral",
                        error: null
                      }
                    }
                  }
                },
                {
                  start: 9,
                  length: 1,
                  kind: "TokenKind.CommaDelimiter",
                  error: null
                },
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 11,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: null,
                  variableInitializationClause: null
                }
              ],
              type: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              semicolon: {
                start: 12,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 13,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle variable declaration - 08", function () {
        const document = `int a[2] = (1, 1);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.VariableDeclarationListNode",
              error: null,
              elements: [
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: {
                    kind: "NodeKind.ArrayDeclarationClauseNode",
                    error: null,
                    leftBracket: {
                      start: 5,
                      length: 1,
                      kind: "TokenKind.LeftBracketDelimiter",
                      error: null
                    },
                    length: {
                      kind: "NodeKind.NumberLiteralNode",
                      error: null,
                      literal: {
                        start: 6,
                        length: 1,
                        kind: "TokenKind.NumberLiteral",
                        error: null
                      }
                    },
                    rightBracket: {
                      start: 7,
                      length: 1,
                      kind: "TokenKind.RightBracketDelimiter",
                      error: null
                    }
                  },
                  variableInitializationClause: {
                    kind: "NodeKind.VariableInitializationClauseNode",
                    error: null,
                    equals: {
                      start: 9,
                      length: 1,
                      kind: "TokenKind.EqualsOperator",
                      error: null
                    },
                    expression: {
                      kind: "NodeKind.ArrayLiteralNode",
                      error: null,
                      elements: [
                        {
                          kind: "NodeKind.NumberLiteralNode",
                          error: null,
                          literal: {
                            start: 12,
                            length: 1,
                            kind: "TokenKind.NumberLiteral",
                            error: null
                          }
                        },
                        {
                          start: 13,
                          length: 1,
                          kind: "TokenKind.CommaDelimiter",
                          error: null
                        },
                        {
                          kind: "NodeKind.NumberLiteralNode",
                          error: null,
                          literal: {
                            start: 15,
                            length: 1,
                            kind: "TokenKind.NumberLiteral",
                            error: null
                          }
                        }
                      ],
                      leftParen: {
                        start: 11,
                        length: 1,
                        kind: "TokenKind.LeftParenDelimiter",
                        error: null
                      },
                      rightParen: {
                        start: 16,
                        length: 1,
                        kind: "TokenKind.RightParenDelimiter",
                        error: null
                      }
                    }
                  }
                }
              ],
              type: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              semicolon: {
                start: 17,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 18,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle variable declaration - 09", function () {
        const document = `int a[];`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.VariableDeclarationListNode",
              error: null,
              elements: [
                {
                  kind: "NodeKind.VariableDeclarationNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  },
                  arrayDeclarationClause: {
                    kind: "NodeKind.ArrayDeclarationClauseNode",
                    error: null,
                    leftBracket: {
                      start: 5,
                      length: 1,
                      kind: "TokenKind.LeftBracketDelimiter",
                      error: null
                    },
                    length: {
                      start: 6,
                      length: 0,
                      kind: "TokenKind.ArrayLength",
                      error: "TokenError.MissingToken"
                    },
                    rightBracket: {
                      start: 6,
                      length: 1,
                      kind: "TokenKind.RightBracketDelimiter",
                      error: null
                    }
                  },
                  variableInitializationClause: null
                }
              ],
              type: {
                start: 0,
                length: 3,
                kind: "TokenKind.IntKeyword",
                error: null
              },
              semicolon: {
                start: 7,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 8,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it.skip("Should handle variable declaration - 10", function () {
        const document = `int a[0];`;

        const expected = {};

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("If-Else Statement", function () {
      it("Should handle if statement - 01", function () {
        const document = `if() {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.IfStatementNode",
              error: null,
              ifKeyword: {
                start: 0,
                length: 2,
                kind: "TokenKind.IfKeyword",
                error: null
              },
              leftParen: {
                start: 2,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              condition: {
                start: 3,
                length: 0,
                kind: "TokenKind.Expression",
                error: "TokenError.MissingToken"
              },
              rightParen: {
                start: 3,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 5,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 6,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              },
              elseClause: null
            }
          ],
          endOfFile: {
            start: 7,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle if statement - 02", function () {
        const document = `if(a == b) {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.IfStatementNode",
              error: null,
              ifKeyword: {
                start: 0,
                length: 2,
                kind: "TokenKind.IfKeyword",
                error: null
              },
              leftParen: {
                start: 2,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              condition: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 3,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 5,
                  length: 2,
                  kind: "TokenKind.EqualsEqualsOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 8,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              rightParen: {
                start: 9,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 11,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 12,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              },
              elseClause: null
            }
          ],
          endOfFile: {
            start: 13,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle if statement - 03", function () {
        const document = `if(a == b) { foo(); }`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.IfStatementNode",
              error: null,
              ifKeyword: {
                start: 0,
                length: 2,
                kind: "TokenKind.IfKeyword",
                error: null
              },
              leftParen: {
                start: 2,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              condition: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 3,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 5,
                  length: 2,
                  kind: "TokenKind.EqualsEqualsOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 8,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              rightParen: {
                start: 9,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 11,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [
                  {
                    kind: "NodeKind.ExpressionStatementNode",
                    error: null,
                    expression: {
                      kind: "NodeKind.CallExpressionNode",
                      error: null,
                      expression: {
                        kind: "NodeKind.VariableNode",
                        error: null,
                        name: {
                          start: 13,
                          length: 3,
                          kind: "TokenKind.Name",
                          error: null
                        }
                      },
                      leftParen: {
                        start: 16,
                        length: 1,
                        kind: "TokenKind.LeftParenDelimiter",
                        error: null
                      },
                      arguments: {
                        kind: "NodeKind.ArgumentExpressionListNode",
                        error: null,
                        elements: []
                      },
                      rightParen: {
                        start: 17,
                        length: 1,
                        kind: "TokenKind.RightParenDelimiter",
                        error: null
                      }
                    },
                    semicolon: {
                      start: 18,
                      length: 1,
                      kind: "TokenKind.SemicolonDelimiter",
                      error: null
                    }
                  }
                ],
                rightBrace: {
                  start: 20,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              },
              elseClause: null
            }
          ],
          endOfFile: {
            start: 21,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle if statement - 04", function () {
        const document = `if(a == b) { } else { }`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.IfStatementNode",
              error: null,
              ifKeyword: {
                start: 0,
                length: 2,
                kind: "TokenKind.IfKeyword",
                error: null
              },
              leftParen: {
                start: 2,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              condition: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 3,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 5,
                  length: 2,
                  kind: "TokenKind.EqualsEqualsOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 8,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              rightParen: {
                start: 9,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 11,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 13,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              },
              elseClause: {
                kind: "NodeKind.ElseClauseNode",
                error: null,
                elseKeyword: {
                  start: 15,
                  length: 4,
                  kind: "TokenKind.ElseKeyword",
                  error: null
                },
                statements: {
                  kind: "NodeKind.CompoundStatementNode",
                  error: null,
                  leftBrace: {
                    start: 20,
                    length: 1,
                    kind: "TokenKind.LeftBraceDelimiter",
                    error: null
                  },
                  statements: [],
                  rightBrace: {
                    start: 22,
                    length: 1,
                    kind: "TokenKind.RightBraceDelimiter",
                    error: null
                  }
                }
              }
            }
          ],
          endOfFile: {
            start: 23,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle if statement - 05", function () {
        const document = `if() { if() { } else { } } else { }`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.IfStatementNode",
              error: null,
              ifKeyword: {
                start: 0,
                length: 2,
                kind: "TokenKind.IfKeyword",
                error: null
              },
              leftParen: {
                start: 2,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              condition: {
                start: 3,
                length: 0,
                kind: "TokenKind.Expression",
                error: "TokenError.MissingToken"
              },
              rightParen: {
                start: 3,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 5,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [
                  {
                    kind: "NodeKind.IfStatementNode",
                    error: null,
                    ifKeyword: {
                      start: 7,
                      length: 2,
                      kind: "TokenKind.IfKeyword",
                      error: null
                    },
                    leftParen: {
                      start: 9,
                      length: 1,
                      kind: "TokenKind.LeftParenDelimiter",
                      error: null
                    },
                    condition: {
                      start: 10,
                      length: 0,
                      kind: "TokenKind.Expression",
                      error: "TokenError.MissingToken"
                    },
                    rightParen: {
                      start: 10,
                      length: 1,
                      kind: "TokenKind.RightParenDelimiter",
                      error: null
                    },
                    statements: {
                      kind: "NodeKind.CompoundStatementNode",
                      error: null,
                      leftBrace: {
                        start: 12,
                        length: 1,
                        kind: "TokenKind.LeftBraceDelimiter",
                        error: null
                      },
                      statements: [],
                      rightBrace: {
                        start: 14,
                        length: 1,
                        kind: "TokenKind.RightBraceDelimiter",
                        error: null
                      }
                    },
                    elseClause: {
                      kind: "NodeKind.ElseClauseNode",
                      error: null,
                      elseKeyword: {
                        start: 16,
                        length: 4,
                        kind: "TokenKind.ElseKeyword",
                        error: null
                      },
                      statements: {
                        kind: "NodeKind.CompoundStatementNode",
                        error: null,
                        leftBrace: {
                          start: 21,
                          length: 1,
                          kind: "TokenKind.LeftBraceDelimiter",
                          error: null
                        },
                        statements: [],
                        rightBrace: {
                          start: 23,
                          length: 1,
                          kind: "TokenKind.RightBraceDelimiter",
                          error: null
                        }
                      }
                    }
                  }
                ],
                rightBrace: {
                  start: 25,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              },
              elseClause: {
                kind: "NodeKind.ElseClauseNode",
                error: null,
                elseKeyword: {
                  start: 27,
                  length: 4,
                  kind: "TokenKind.ElseKeyword",
                  error: null
                },
                statements: {
                  kind: "NodeKind.CompoundStatementNode",
                  error: null,
                  leftBrace: {
                    start: 32,
                    length: 1,
                    kind: "TokenKind.LeftBraceDelimiter",
                    error: null
                  },
                  statements: [],
                  rightBrace: {
                    start: 34,
                    length: 1,
                    kind: "TokenKind.RightBraceDelimiter",
                    error: null
                  }
                }
              }
            }
          ],
          endOfFile: {
            start: 35,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("Return Statement", function () {
      it("Should handle return statement - 01", function () {
        const document = `return;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ReturnStatementNode",
              error: null,
              returnKeyword: {
                start: 0,
                length: 6,
                kind: "TokenKind.ReturnKeyword",
                error: null
              },
              expression: null,
              semicolon: {
                start: 6,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 7,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle return statement - 02", function () {
        const document = `return 0;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ReturnStatementNode",
              error: null,
              returnKeyword: {
                start: 0,
                length: 6,
                kind: "TokenKind.ReturnKeyword",
                error: null
              },
              expression: {
                kind: "NodeKind.NumberLiteralNode",
                error: null,
                literal: {
                  start: 7,
                  length: 1,
                  kind: "TokenKind.NumberLiteral",
                  error: null
                }
              },
              semicolon: {
                start: 8,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 9,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle return statement - 03", function () {
        const document = `return (0);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ReturnStatementNode",
              error: null,
              returnKeyword: {
                start: 0,
                length: 6,
                kind: "TokenKind.ReturnKeyword",
                error: null
              },
              expression: {
                kind: "NodeKind.ParenthesizedExpressionNode",
                error: null,
                leftParen: {
                  start: 7,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                expression: {
                  kind: "NodeKind.NumberLiteralNode",
                  error: null,
                  literal: {
                    start: 8,
                    length: 1,
                    kind: "TokenKind.NumberLiteral",
                    error: null
                  }
                },
                rightParen: {
                  start: 9,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 10,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 11,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle return statement - 04", function () {
        const document = `return foo(bar()).baz + 1;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ReturnStatementNode",
              error: null,
              returnKeyword: {
                start: 0,
                length: 6,
                kind: "TokenKind.ReturnKeyword",
                error: null
              },
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.MemberAccessExpressionNode",
                  error: null,
                  expression: {
                    kind: "NodeKind.CallExpressionNode",
                    error: null,
                    expression: {
                      kind: "NodeKind.VariableNode",
                      error: null,
                      name: {
                        start: 7,
                        length: 3,
                        kind: "TokenKind.Name",
                        error: null
                      }
                    },
                    leftParen: {
                      start: 10,
                      length: 1,
                      kind: "TokenKind.LeftParenDelimiter",
                      error: null
                    },
                    arguments: {
                      kind: "NodeKind.ArgumentExpressionListNode",
                      error: null,
                      elements: [
                        {
                          kind: "NodeKind.ArgumentExpressionNode",
                          error: null,
                          argument: {
                            kind: "NodeKind.CallExpressionNode",
                            error: null,
                            expression: {
                              kind: "NodeKind.VariableNode",
                              error: null,
                              name: {
                                start: 11,
                                length: 3,
                                kind: "TokenKind.Name",
                                error: null
                              }
                            },
                            leftParen: {
                              start: 14,
                              length: 1,
                              kind: "TokenKind.LeftParenDelimiter",
                              error: null
                            },
                            arguments: {
                              kind: "NodeKind.ArgumentExpressionListNode",
                              error: null,
                              elements: []
                            },
                            rightParen: {
                              start: 15,
                              length: 1,
                              kind: "TokenKind.RightParenDelimiter",
                              error: null
                            }
                          }
                        }
                      ]
                    },
                    rightParen: {
                      start: 16,
                      length: 1,
                      kind: "TokenKind.RightParenDelimiter",
                      error: null
                    }
                  },
                  dot: {
                    start: 17,
                    length: 1,
                    kind: "TokenKind.DotOperator",
                    error: null
                  },
                  member: {
                    start: 18,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 22,
                  length: 1,
                  kind: "TokenKind.PlusOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.NumberLiteralNode",
                  error: null,
                  literal: {
                    start: 24,
                    length: 1,
                    kind: "TokenKind.NumberLiteral",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 25,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 26,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("Quit Statement", function () {
      it("Should handle quit statement", function () {
        const document = `quit;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.QuitStatementNode",
              error: null,
              quitKeyword: {
                start: 0,
                length: 4,
                kind: "TokenKind.QuitKeyword",
                error: null
              },
              semicolon: {
                start: 4,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 5,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("While Statement", function () {
      it("Should handle while statement", function () {
        const document = `while(0) {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.WhileStatementNode",
              error: null,
              whileKeyword: {
                start: 0,
                length: 5,
                kind: "TokenKind.WhileKeyword",
                error: null
              },
              leftParen: {
                start: 5,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              condition: {
                kind: "NodeKind.NumberLiteralNode",
                error: null,
                literal: {
                  start: 6,
                  length: 1,
                  kind: "TokenKind.NumberLiteral",
                  error: null
                }
              },
              rightParen: {
                start: 7,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 9,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 10,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 11,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("Do Statement", function () {
      it("Should handle do statement", function () {
        const document = `do {} while(0);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.DoStatementNode",
              error: null,
              doKeyword: {
                start: 0,
                length: 2,
                kind: "TokenKind.DoKeyword",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 4,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              },
              whileKeyword: {
                start: 6,
                length: 5,
                kind: "TokenKind.WhileKeyword",
                error: null
              },
              leftParen: {
                start: 11,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              condition: {
                kind: "NodeKind.NumberLiteralNode",
                error: null,
                literal: {
                  start: 12,
                  length: 1,
                  kind: "TokenKind.NumberLiteral",
                  error: null
                }
              },
              rightParen: {
                start: 13,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              semicolon: {
                start: 14,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 15,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("For Statement", function () {
      it("Should handle for statement - 01", function () {
        const document = `for(;;) {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ForStatementNode",
              error: null,
              forKeyword: {
                start: 0,
                length: 3,
                kind: "TokenKind.ForKeyword",
                error: null
              },
              leftParen: {
                start: 3,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              initializer: {
                start: 4,
                length: 0,
                kind: "TokenKind.Expression",
                error: "TokenError.MissingToken"
              },
              semicolon1: {
                start: 4,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              },
              condition: {
                start: 5,
                length: 0,
                kind: "TokenKind.Expression",
                error: "TokenError.MissingToken"
              },
              semicolon2: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              },
              increment: {
                start: 6,
                length: 0,
                kind: "TokenKind.Expression",
                error: "TokenError.MissingToken"
              },
              rightParen: {
                start: 6,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 8,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 9,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 10,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle for statement - 02", function () {
        const document = `for (foo = 0; foo < 3; foo += 1) {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ForStatementNode",
              error: null,
              forKeyword: {
                start: 0,
                length: 3,
                kind: "TokenKind.ForKeyword",
                error: null
              },
              leftParen: {
                start: 4,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              initializer: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 5,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 9,
                  length: 1,
                  kind: "TokenKind.EqualsOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.NumberLiteralNode",
                  error: null,
                  literal: {
                    start: 11,
                    length: 1,
                    kind: "TokenKind.NumberLiteral",
                    error: null
                  }
                }
              },
              semicolon1: {
                start: 12,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              },
              condition: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 14,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 18,
                  length: 1,
                  kind: "TokenKind.LessThanOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.NumberLiteralNode",
                  error: null,
                  literal: {
                    start: 20,
                    length: 1,
                    kind: "TokenKind.NumberLiteral",
                    error: null
                  }
                }
              },
              semicolon2: {
                start: 21,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              },
              increment: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 23,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 27,
                  length: 2,
                  kind: "TokenKind.PlusEqualsOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.NumberLiteralNode",
                  error: null,
                  literal: {
                    start: 30,
                    length: 1,
                    kind: "TokenKind.NumberLiteral",
                    error: null
                  }
                }
              },
              rightParen: {
                start: 31,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 33,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 34,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 35,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("Fetch Statement", function () {
      it("Should handle fetch statement - 01", function () {
        const document = `fetch(,,) {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.FetchStatementNode",
              error: null,
              fetchKeyword: {
                start: 0,
                length: 5,
                kind: "TokenKind.FetchKeyword",
                error: null
              },
              leftParen: {
                start: 5,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              variable: {
                start: 6,
                length: 0,
                kind: "TokenKind.Expression",
                error: "TokenError.MissingToken"
              },
              comma1: {
                start: 6,
                length: 1,
                kind: "TokenKind.CommaDelimiter",
                error: null
              },
              expression: {
                start: 7,
                length: 0,
                kind: "TokenKind.Expression",
                error: "TokenError.MissingToken"
              },
              comma2: {
                start: 7,
                length: 1,
                kind: "TokenKind.CommaDelimiter",
                error: null
              },
              reach: {
                start: 8,
                length: 0,
                kind: "TokenKind.Expression",
                error: "TokenError.MissingToken"
              },
              rightParen: {
                start: 8,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 10,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 11,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 12,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle for statement - 02", function () {
        const document = `fetch (foo, foo.bar(), 0) {}`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.FetchStatementNode",
              error: null,
              fetchKeyword: {
                start: 0,
                length: 5,
                kind: "TokenKind.FetchKeyword",
                error: null
              },
              leftParen: {
                start: 6,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              variable: {
                kind: "NodeKind.VariableNode",
                error: null,
                name: {
                  start: 7,
                  length: 3,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              comma1: {
                start: 10,
                length: 1,
                kind: "TokenKind.CommaDelimiter",
                error: null
              },
              expression: {
                kind: "NodeKind.CallExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.MemberAccessExpressionNode",
                  error: null,
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 12,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  dot: {
                    start: 15,
                    length: 1,
                    kind: "TokenKind.DotOperator",
                    error: null
                  },
                  member: {
                    start: 16,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftParen: {
                  start: 19,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                arguments: {
                  kind: "NodeKind.ArgumentExpressionListNode",
                  error: null,
                  elements: []
                },
                rightParen: {
                  start: 20,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              comma2: {
                start: 21,
                length: 1,
                kind: "TokenKind.CommaDelimiter",
                error: null
              },
              reach: {
                kind: "NodeKind.NumberLiteralNode",
                error: null,
                literal: {
                  start: 23,
                  length: 1,
                  kind: "TokenKind.NumberLiteral",
                  error: null
                }
              },
              rightParen: {
                start: 24,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              statements: {
                kind: "NodeKind.CompoundStatementNode",
                error: null,
                leftBrace: {
                  start: 26,
                  length: 1,
                  kind: "TokenKind.LeftBraceDelimiter",
                  error: null
                },
                statements: [],
                rightBrace: {
                  start: 27,
                  length: 1,
                  kind: "TokenKind.RightBraceDelimiter",
                  error: null
                }
              }
            }
          ],
          endOfFile: {
            start: 28,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("Switch Statement", function () {
      it("Should handle switch statement - 01", function () {
        const document = `switch(foo) { case(bar); break; }`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.SwitchStatementNode",
              error: null,
              switchKeyword: {
                start: 0,
                length: 6,
                kind: "TokenKind.SwitchKeyword",
                error: null
              },
              leftParen: {
                start: 6,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              expression: {
                kind: "NodeKind.VariableNode",
                error: null,
                name: {
                  start: 7,
                  length: 3,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              rightParen: {
                start: 10,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              leftBrace: {
                start: 12,
                length: 1,
                kind: "TokenKind.LeftBraceDelimiter",
                error: null
              },
              statements: [
                {
                  kind: "NodeKind.CaseStatementNode",
                  error: null,
                  caseKeyword: {
                    start: 14,
                    length: 4,
                    kind: "TokenKind.CaseKeyword",
                    error: null
                  },
                  leftParen: {
                    start: 18,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 19,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  rightParen: {
                    start: 22,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  },
                  semicolon: {
                    start: 23,
                    length: 1,
                    kind: "TokenKind.SemicolonDelimiter",
                    error: null
                  },
                  statements: [
                    {
                      kind: "NodeKind.BreakStatementNode",
                      error: null,
                      breakKeyword: {
                        start: 25,
                        length: 5,
                        kind: "TokenKind.BreakKeyword",
                        error: null
                      },
                      semicolon: {
                        start: 30,
                        length: 1,
                        kind: "TokenKind.SemicolonDelimiter",
                        error: null
                      }
                    }
                  ]
                }
              ],
              rightBrace: {
                start: 32,
                length: 1,
                kind: "TokenKind.RightBraceDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 33,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle switch statement - 02", function () {
        const document = `switch(foo) { case(bar); case(baz); baz; break; }`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.SwitchStatementNode",
              error: null,
              switchKeyword: {
                start: 0,
                length: 6,
                kind: "TokenKind.SwitchKeyword",
                error: null
              },
              leftParen: {
                start: 6,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              expression: {
                kind: "NodeKind.VariableNode",
                error: null,
                name: {
                  start: 7,
                  length: 3,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              rightParen: {
                start: 10,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              leftBrace: {
                start: 12,
                length: 1,
                kind: "TokenKind.LeftBraceDelimiter",
                error: null
              },
              statements: [
                {
                  kind: "NodeKind.CaseStatementNode",
                  error: null,
                  caseKeyword: {
                    start: 14,
                    length: 4,
                    kind: "TokenKind.CaseKeyword",
                    error: null
                  },
                  leftParen: {
                    start: 18,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 19,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  rightParen: {
                    start: 22,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  },
                  semicolon: {
                    start: 23,
                    length: 1,
                    kind: "TokenKind.SemicolonDelimiter",
                    error: null
                  },
                  statements: []
                },
                {
                  kind: "NodeKind.CaseStatementNode",
                  error: null,
                  caseKeyword: {
                    start: 25,
                    length: 4,
                    kind: "TokenKind.CaseKeyword",
                    error: null
                  },
                  leftParen: {
                    start: 29,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 30,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  rightParen: {
                    start: 33,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  },
                  semicolon: {
                    start: 34,
                    length: 1,
                    kind: "TokenKind.SemicolonDelimiter",
                    error: null
                  },
                  statements: [
                    {
                      kind: "NodeKind.ExpressionStatementNode",
                      error: null,
                      expression: {
                        kind: "NodeKind.VariableNode",
                        error: null,
                        name: {
                          start: 36,
                          length: 3,
                          kind: "TokenKind.Name",
                          error: null
                        }
                      },
                      semicolon: {
                        start: 39,
                        length: 1,
                        kind: "TokenKind.SemicolonDelimiter",
                        error: null
                      }
                    },
                    {
                      kind: "NodeKind.BreakStatementNode",
                      error: null,
                      breakKeyword: {
                        start: 41,
                        length: 5,
                        kind: "TokenKind.BreakKeyword",
                        error: null
                      },
                      semicolon: {
                        start: 46,
                        length: 1,
                        kind: "TokenKind.SemicolonDelimiter",
                        error: null
                      }
                    }
                  ]
                }
              ],
              rightBrace: {
                start: 48,
                length: 1,
                kind: "TokenKind.RightBraceDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 49,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle switch statement - 03", function () {
        const document = `switch(foo) { case(bar); break; default; break; }`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.SwitchStatementNode",
              error: null,
              switchKeyword: {
                start: 0,
                length: 6,
                kind: "TokenKind.SwitchKeyword",
                error: null
              },
              leftParen: {
                start: 6,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              expression: {
                kind: "NodeKind.VariableNode",
                error: null,
                name: {
                  start: 7,
                  length: 3,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              rightParen: {
                start: 10,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              leftBrace: {
                start: 12,
                length: 1,
                kind: "TokenKind.LeftBraceDelimiter",
                error: null
              },
              statements: [
                {
                  kind: "NodeKind.CaseStatementNode",
                  error: null,
                  caseKeyword: {
                    start: 14,
                    length: 4,
                    kind: "TokenKind.CaseKeyword",
                    error: null
                  },
                  leftParen: {
                    start: 18,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 19,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  rightParen: {
                    start: 22,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  },
                  semicolon: {
                    start: 23,
                    length: 1,
                    kind: "TokenKind.SemicolonDelimiter",
                    error: null
                  },
                  statements: [
                    {
                      kind: "NodeKind.BreakStatementNode",
                      error: null,
                      breakKeyword: {
                        start: 25,
                        length: 5,
                        kind: "TokenKind.BreakKeyword",
                        error: null
                      },
                      semicolon: {
                        start: 30,
                        length: 1,
                        kind: "TokenKind.SemicolonDelimiter",
                        error: null
                      }
                    }
                  ]
                },
                {
                  kind: "NodeKind.DefaultStatementNode",
                  error: null,
                  defaultKeyword: {
                    start: 32,
                    length: 7,
                    kind: "TokenKind.DefaultKeyword",
                    error: null
                  },
                  semicolon: {
                    start: 39,
                    length: 1,
                    kind: "TokenKind.SemicolonDelimiter",
                    error: null
                  },
                  statements: [
                    {
                      kind: "NodeKind.BreakStatementNode",
                      error: null,
                      breakKeyword: {
                        start: 41,
                        length: 5,
                        kind: "TokenKind.BreakKeyword",
                        error: null
                      },
                      semicolon: {
                        start: 46,
                        length: 1,
                        kind: "TokenKind.SemicolonDelimiter",
                        error: null
                      }
                    }
                  ]
                }
              ],
              rightBrace: {
                start: 48,
                length: 1,
                kind: "TokenKind.RightBraceDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 49,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle switch statement - 04", function () {
        const document = `switch(foo) { case(bar); break; halt(0); return 1; }`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.SwitchStatementNode",
              error: null,
              switchKeyword: {
                start: 0,
                length: 6,
                kind: "TokenKind.SwitchKeyword",
                error: null
              },
              leftParen: {
                start: 6,
                length: 1,
                kind: "TokenKind.LeftParenDelimiter",
                error: null
              },
              expression: {
                kind: "NodeKind.VariableNode",
                error: null,
                name: {
                  start: 7,
                  length: 3,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              rightParen: {
                start: 10,
                length: 1,
                kind: "TokenKind.RightParenDelimiter",
                error: null
              },
              leftBrace: {
                start: 12,
                length: 1,
                kind: "TokenKind.LeftBraceDelimiter",
                error: null
              },
              statements: [
                {
                  kind: "NodeKind.CaseStatementNode",
                  error: null,
                  caseKeyword: {
                    start: 14,
                    length: 4,
                    kind: "TokenKind.CaseKeyword",
                    error: null
                  },
                  leftParen: {
                    start: 18,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 19,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  rightParen: {
                    start: 22,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  },
                  semicolon: {
                    start: 23,
                    length: 1,
                    kind: "TokenKind.SemicolonDelimiter",
                    error: null
                  },
                  statements: [
                    {
                      kind: "NodeKind.BreakStatementNode",
                      error: null,
                      breakKeyword: {
                        start: 25,
                        length: 5,
                        kind: "TokenKind.BreakKeyword",
                        error: null
                      },
                      semicolon: {
                        start: 30,
                        length: 1,
                        kind: "TokenKind.SemicolonDelimiter",
                        error: null
                      }
                    },
                    {
                      kind: "NodeKind.HaltStatementNode",
                      error: null,
                      haltKeyword: {
                        start: 32,
                        length: 4,
                        kind: "TokenKind.HaltKeyword",
                        error: null
                      },
                      leftParen: {
                        start: 36,
                        length: 1,
                        kind: "TokenKind.LeftParenDelimiter",
                        error: null
                      },
                      expression: {
                        kind: "NodeKind.NumberLiteralNode",
                        error: null,
                        literal: {
                          start: 37,
                          length: 1,
                          kind: "TokenKind.NumberLiteral",
                          error: null
                        }
                      },
                      rightParen: {
                        start: 38,
                        length: 1,
                        kind: "TokenKind.RightParenDelimiter",
                        error: null
                      },
                      semicolon: {
                        start: 39,
                        length: 1,
                        kind: "TokenKind.SemicolonDelimiter",
                        error: null
                      }
                    },
                    {
                      kind: "NodeKind.ReturnStatementNode",
                      error: null,
                      returnKeyword: {
                        start: 41,
                        length: 6,
                        kind: "TokenKind.ReturnKeyword",
                        error: null
                      },
                      expression: {
                        kind: "NodeKind.NumberLiteralNode",
                        error: null,
                        literal: {
                          start: 48,
                          length: 1,
                          kind: "TokenKind.NumberLiteral",
                          error: null
                        }
                      },
                      semicolon: {
                        start: 49,
                        length: 1,
                        kind: "TokenKind.SemicolonDelimiter",
                        error: null
                      }
                    }
                  ]
                }
              ],
              rightBrace: {
                start: 51,
                length: 1,
                kind: "TokenKind.RightBraceDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 52,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });
  });

  describe("Expressions", function () {
    describe("Unary Expressions", function () {
      it("Should handle increment expression - 01", function () {
        const document = `++a;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.PrefixUpdateExpressionNode",
                error: null,
                operand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 2,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 0,
                  length: 2,
                  kind: "TokenKind.PlusPlusOperator",
                  error: null
                }
              },
              semicolon: {
                start: 3,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 4,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle increment expression - 02", function () {
        const document = `++ a;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.PrefixUpdateExpressionNode",
                error: null,
                operand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 3,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 0,
                  length: 2,
                  kind: "TokenKind.PlusPlusOperator",
                  error: null
                }
              },
              semicolon: {
                start: 4,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 5,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle increment expression - 03", function () {
        const document = `++a`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.PrefixUpdateExpressionNode",
                error: null,
                operand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 2,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 0,
                  length: 2,
                  kind: "TokenKind.PlusPlusOperator",
                  error: null
                }
              },
              semicolon: {
                start: 3,
                length: 0,
                kind: "TokenKind.SemicolonDelimiter",
                error: "TokenError.MissingToken"
              }
            }
          ],
          endOfFile: {
            start: 3,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle increment expression - 04", function () {
        const document = `(++a);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.ParenthesizedExpressionNode",
                error: null,
                leftParen: {
                  start: 0,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                expression: {
                  kind: "NodeKind.PrefixUpdateExpressionNode",
                  error: null,
                  operand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 3,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 1,
                    length: 2,
                    kind: "TokenKind.PlusPlusOperator",
                    error: null
                  }
                },
                rightParen: {
                  start: 4,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle increment expression - 05", function () {
        const document = `(++a;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.ParenthesizedExpressionNode",
                error: null,
                leftParen: {
                  start: 0,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                expression: {
                  kind: "NodeKind.PrefixUpdateExpressionNode",
                  error: null,
                  operand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 3,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 1,
                    length: 2,
                    kind: "TokenKind.PlusPlusOperator",
                    error: null
                  }
                },
                rightParen: {
                  start: 4,
                  length: 0,
                  kind: "TokenKind.RightParenDelimiter",
                  error: "TokenError.MissingToken"
                }
              },
              semicolon: {
                start: 4,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 5,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle increment expression - 06", function () {
        const document = `++(a);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.PrefixUpdateExpressionNode",
                error: null,
                operand: {
                  kind: "NodeKind.ParenthesizedExpressionNode",
                  error: null,
                  leftParen: {
                    start: 2,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 3,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  rightParen: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  }
                },
                operator: {
                  start: 0,
                  length: 2,
                  kind: "TokenKind.PlusPlusOperator",
                  error: null
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle decrement expression - 01", function () {
        const document = `--a;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.PrefixUpdateExpressionNode",
                error: null,
                operand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 2,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 0,
                  length: 2,
                  kind: "TokenKind.MinusMinusOperator",
                  error: null
                }
              },
              semicolon: {
                start: 3,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 4,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle decrement expression - 02", function () {
        const document = `-- a;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.PrefixUpdateExpressionNode",
                error: null,
                operand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 3,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 0,
                  length: 2,
                  kind: "TokenKind.MinusMinusOperator",
                  error: null
                }
              },
              semicolon: {
                start: 4,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 5,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle decrement expression - 03", function () {
        const document = `--a`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.PrefixUpdateExpressionNode",
                error: null,
                operand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 2,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 0,
                  length: 2,
                  kind: "TokenKind.MinusMinusOperator",
                  error: null
                }
              },
              semicolon: {
                start: 3,
                length: 0,
                kind: "TokenKind.SemicolonDelimiter",
                error: "TokenError.MissingToken"
              }
            }
          ],
          endOfFile: {
            start: 3,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle decrement expression - 04", function () {
        const document = `(--a);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.ParenthesizedExpressionNode",
                error: null,
                leftParen: {
                  start: 0,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                expression: {
                  kind: "NodeKind.PrefixUpdateExpressionNode",
                  error: null,
                  operand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 3,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 1,
                    length: 2,
                    kind: "TokenKind.MinusMinusOperator",
                    error: null
                  }
                },
                rightParen: {
                  start: 4,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle decrement expression - 05", function () {
        const document = `(--a;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.ParenthesizedExpressionNode",
                error: null,
                leftParen: {
                  start: 0,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                expression: {
                  kind: "NodeKind.PrefixUpdateExpressionNode",
                  error: null,
                  operand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 3,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 1,
                    length: 2,
                    kind: "TokenKind.MinusMinusOperator",
                    error: null
                  }
                },
                rightParen: {
                  start: 4,
                  length: 0,
                  kind: "TokenKind.RightParenDelimiter",
                  error: "TokenError.MissingToken"
                }
              },
              semicolon: {
                start: 4,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 5,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle decrement expression - 06", function () {
        const document = `--(a);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.PrefixUpdateExpressionNode",
                error: null,
                operand: {
                  kind: "NodeKind.ParenthesizedExpressionNode",
                  error: null,
                  leftParen: {
                    start: 2,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 3,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  rightParen: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  }
                },
                operator: {
                  start: 0,
                  length: 2,
                  kind: "TokenKind.MinusMinusOperator",
                  error: null
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe("Binary Expressions", function () {
      it("Should handle addition", function () {
        const document = `a + b;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 2,
                  length: 1,
                  kind: "TokenKind.PlusOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle subtraction", function () {
        const document = `a - b;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 2,
                  length: 1,
                  kind: "TokenKind.MinusOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle multiplication", function () {
        const document = `a * b;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 2,
                  length: 1,
                  kind: "TokenKind.StarOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle division", function () {
        const document = `a / b;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 2,
                  length: 1,
                  kind: "TokenKind.SlashOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle complex arithemtic - 01", function () {
        const document = `a + b * c;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 2,
                  length: 1,
                  kind: "TokenKind.PlusOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.BinaryExpressionNode",
                  error: null,
                  leftOperand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 4,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 6,
                    length: 1,
                    kind: "TokenKind.StarOperator",
                    error: null
                  },
                  rightOperand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 8,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  }
                }
              },
              semicolon: {
                start: 9,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 10,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle complex arithemtic - 02", function () {
        const document = `a + b / c;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 2,
                  length: 1,
                  kind: "TokenKind.PlusOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.BinaryExpressionNode",
                  error: null,
                  leftOperand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 4,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 6,
                    length: 1,
                    kind: "TokenKind.SlashOperator",
                    error: null
                  },
                  rightOperand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 8,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  }
                }
              },
              semicolon: {
                start: 9,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 10,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle complex arithemtic - 03", function () {
        const document = `(a + b) * c;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.ParenthesizedExpressionNode",
                  error: null,
                  leftParen: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.BinaryExpressionNode",
                    error: null,
                    leftOperand: {
                      kind: "NodeKind.VariableNode",
                      error: null,
                      name: {
                        start: 1,
                        length: 1,
                        kind: "TokenKind.Name",
                        error: null
                      }
                    },
                    operator: {
                      start: 3,
                      length: 1,
                      kind: "TokenKind.PlusOperator",
                      error: null
                    },
                    rightOperand: {
                      kind: "NodeKind.VariableNode",
                      error: null,
                      name: {
                        start: 5,
                        length: 1,
                        kind: "TokenKind.Name",
                        error: null
                      }
                    }
                  },
                  rightParen: {
                    start: 6,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  }
                },
                operator: {
                  start: 8,
                  length: 1,
                  kind: "TokenKind.StarOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 10,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 11,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 12,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle member access - 01", function () {
        const document = `foo.bar;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.MemberAccessExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                dot: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.DotOperator",
                  error: null
                },
                member: {
                  start: 4,
                  length: 3,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              semicolon: {
                start: 7,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 8,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle member access - 02", function () {
        const document = `(foo).bar;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.MemberAccessExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.ParenthesizedExpressionNode",
                  error: null,
                  leftParen: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 1,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  rightParen: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  }
                },
                dot: {
                  start: 5,
                  length: 1,
                  kind: "TokenKind.DotOperator",
                  error: null
                },
                member: {
                  start: 6,
                  length: 3,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              semicolon: {
                start: 9,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 10,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle member access - 03", function () {
        const document = `foo.foo.bar;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.MemberAccessExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.MemberAccessExpressionNode",
                  error: null,
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 0,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  dot: {
                    start: 3,
                    length: 1,
                    kind: "TokenKind.DotOperator",
                    error: null
                  },
                  member: {
                    start: 4,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                dot: {
                  start: 7,
                  length: 1,
                  kind: "TokenKind.DotOperator",
                  error: null
                },
                member: {
                  start: 8,
                  length: 3,
                  kind: "TokenKind.Name",
                  error: null
                }
              },
              semicolon: {
                start: 11,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 12,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function call - 01", function () {
        const document = `foo();`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.CallExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftParen: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                arguments: {
                  kind: "NodeKind.ArgumentExpressionListNode",
                  error: null,
                  elements: []
                },
                rightParen: {
                  start: 4,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function call - 02", function () {
        const document = `foo(baz);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.CallExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftParen: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                arguments: {
                  kind: "NodeKind.ArgumentExpressionListNode",
                  error: null,
                  elements: [
                    {
                      kind: "NodeKind.ArgumentExpressionNode",
                      error: null,
                      argument: {
                        kind: "NodeKind.VariableNode",
                        error: null,
                        name: {
                          start: 4,
                          length: 3,
                          kind: "TokenKind.Name",
                          error: null
                        }
                      }
                    }
                  ]
                },
                rightParen: {
                  start: 7,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 8,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 9,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function call - 03", function () {
        const document = `foo(baz, "Hello");`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.CallExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftParen: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                arguments: {
                  kind: "NodeKind.ArgumentExpressionListNode",
                  error: null,
                  elements: [
                    {
                      kind: "NodeKind.ArgumentExpressionNode",
                      error: null,
                      argument: {
                        kind: "NodeKind.VariableNode",
                        error: null,
                        name: {
                          start: 4,
                          length: 3,
                          kind: "TokenKind.Name",
                          error: null
                        }
                      }
                    },
                    {
                      start: 7,
                      length: 1,
                      kind: "TokenKind.CommaDelimiter",
                      error: null
                    },
                    {
                      kind: "NodeKind.ArgumentExpressionNode",
                      error: null,
                      argument: {
                        kind: "NodeKind.StringLiteralNode",
                        error: null,
                        literal: {
                          start: 9,
                          length: 7,
                          kind: "TokenKind.StringLiteral",
                          error: null
                        }
                      }
                    }
                  ]
                },
                rightParen: {
                  start: 16,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 17,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 18,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function call - 04", function () {
        const document = `foo(bar());`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.CallExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftParen: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                arguments: {
                  kind: "NodeKind.ArgumentExpressionListNode",
                  error: null,
                  elements: [
                    {
                      kind: "NodeKind.ArgumentExpressionNode",
                      error: null,
                      argument: {
                        kind: "NodeKind.CallExpressionNode",
                        error: null,
                        expression: {
                          kind: "NodeKind.VariableNode",
                          error: null,
                          name: {
                            start: 4,
                            length: 3,
                            kind: "TokenKind.Name",
                            error: null
                          }
                        },
                        leftParen: {
                          start: 7,
                          length: 1,
                          kind: "TokenKind.LeftParenDelimiter",
                          error: null
                        },
                        arguments: {
                          kind: "NodeKind.ArgumentExpressionListNode",
                          error: null,
                          elements: []
                        },
                        rightParen: {
                          start: 8,
                          length: 1,
                          kind: "TokenKind.RightParenDelimiter",
                          error: null
                        }
                      }
                    }
                  ]
                },
                rightParen: {
                  start: 9,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 10,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 11,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle function call - 05", function () {
        const document = `foo(bar().baz);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.CallExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftParen: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                arguments: {
                  kind: "NodeKind.ArgumentExpressionListNode",
                  error: null,
                  elements: [
                    {
                      kind: "NodeKind.ArgumentExpressionNode",
                      error: null,
                      argument: {
                        kind: "NodeKind.MemberAccessExpressionNode",
                        error: null,
                        expression: {
                          kind: "NodeKind.CallExpressionNode",
                          error: null,
                          expression: {
                            kind: "NodeKind.VariableNode",
                            error: null,
                            name: {
                              start: 4,
                              length: 3,
                              kind: "TokenKind.Name",
                              error: null
                            }
                          },
                          leftParen: {
                            start: 7,
                            length: 1,
                            kind: "TokenKind.LeftParenDelimiter",
                            error: null
                          },
                          arguments: {
                            kind: "NodeKind.ArgumentExpressionListNode",
                            error: null,
                            elements: []
                          },
                          rightParen: {
                            start: 8,
                            length: 1,
                            kind: "TokenKind.RightParenDelimiter",
                            error: null
                          }
                        },
                        dot: {
                          start: 9,
                          length: 1,
                          kind: "TokenKind.DotOperator",
                          error: null
                        },
                        member: {
                          start: 10,
                          length: 3,
                          kind: "TokenKind.Name",
                          error: null
                        }
                      }
                    }
                  ]
                },
                rightParen: {
                  start: 13,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 14,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 15,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle member call - 01", function () {
        const document = `foo.bar();`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.CallExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.MemberAccessExpressionNode",
                  error: null,
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 0,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  dot: {
                    start: 3,
                    length: 1,
                    kind: "TokenKind.DotOperator",
                    error: null
                  },
                  member: {
                    start: 4,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftParen: {
                  start: 7,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                arguments: {
                  kind: "NodeKind.ArgumentExpressionListNode",
                  error: null,
                  elements: []
                },
                rightParen: {
                  start: 8,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 9,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 10,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle member call - 02", function () {
        const document = `foo.bar(baz);`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.CallExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.MemberAccessExpressionNode",
                  error: null,
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 0,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  dot: {
                    start: 3,
                    length: 1,
                    kind: "TokenKind.DotOperator",
                    error: null
                  },
                  member: {
                    start: 4,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftParen: {
                  start: 7,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                arguments: {
                  kind: "NodeKind.ArgumentExpressionListNode",
                  error: null,
                  elements: [
                    {
                      kind: "NodeKind.ArgumentExpressionNode",
                      error: null,
                      argument: {
                        kind: "NodeKind.VariableNode",
                        error: null,
                        name: {
                          start: 8,
                          length: 3,
                          kind: "TokenKind.Name",
                          error: null
                        }
                      }
                    }
                  ]
                },
                rightParen: {
                  start: 11,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 12,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 13,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle member call - 03", function () {
        const document = `foo.bar(baz, "Hello");`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.CallExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.MemberAccessExpressionNode",
                  error: null,
                  expression: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 0,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  dot: {
                    start: 3,
                    length: 1,
                    kind: "TokenKind.DotOperator",
                    error: null
                  },
                  member: {
                    start: 4,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftParen: {
                  start: 7,
                  length: 1,
                  kind: "TokenKind.LeftParenDelimiter",
                  error: null
                },
                arguments: {
                  kind: "NodeKind.ArgumentExpressionListNode",
                  error: null,
                  elements: [
                    {
                      kind: "NodeKind.ArgumentExpressionNode",
                      error: null,
                      argument: {
                        kind: "NodeKind.VariableNode",
                        error: null,
                        name: {
                          start: 8,
                          length: 3,
                          kind: "TokenKind.Name",
                          error: null
                        }
                      }
                    },
                    {
                      start: 11,
                      length: 1,
                      kind: "TokenKind.CommaDelimiter",
                      error: null
                    },
                    {
                      kind: "NodeKind.ArgumentExpressionNode",
                      error: null,
                      argument: {
                        kind: "NodeKind.StringLiteralNode",
                        error: null,
                        literal: {
                          start: 13,
                          length: 7,
                          kind: "TokenKind.StringLiteral",
                          error: null
                        }
                      }
                    }
                  ]
                },
                rightParen: {
                  start: 20,
                  length: 1,
                  kind: "TokenKind.RightParenDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 21,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 22,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle conditional expressions - 01", function () {
        const document = `a || b;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 2,
                  length: 2,
                  kind: "TokenKind.BarBarOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 5,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 6,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 7,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle conditional expressions - 02", function () {
        const document = `a && b;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                operator: {
                  start: 2,
                  length: 2,
                  kind: "TokenKind.AmpersandAmpersandOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 5,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 6,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 7,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle conditional expressions - 03", function () {
        const document = `(a + b) || c;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.ParenthesizedExpressionNode",
                  error: null,
                  leftParen: {
                    start: 0,
                    length: 1,
                    kind: "TokenKind.LeftParenDelimiter",
                    error: null
                  },
                  expression: {
                    kind: "NodeKind.BinaryExpressionNode",
                    error: null,
                    leftOperand: {
                      kind: "NodeKind.VariableNode",
                      error: null,
                      name: {
                        start: 1,
                        length: 1,
                        kind: "TokenKind.Name",
                        error: null
                      }
                    },
                    operator: {
                      start: 3,
                      length: 1,
                      kind: "TokenKind.PlusOperator",
                      error: null
                    },
                    rightOperand: {
                      kind: "NodeKind.VariableNode",
                      error: null,
                      name: {
                        start: 5,
                        length: 1,
                        kind: "TokenKind.Name",
                        error: null
                      }
                    }
                  },
                  rightParen: {
                    start: 6,
                    length: 1,
                    kind: "TokenKind.RightParenDelimiter",
                    error: null
                  }
                },
                operator: {
                  start: 8,
                  length: 2,
                  kind: "TokenKind.BarBarOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 11,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 12,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 13,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle conditional expressions - 03", function () {
        const document = `a || b || c;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.BinaryExpressionNode",
                  error: null,
                  leftOperand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 0,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 2,
                    length: 2,
                    kind: "TokenKind.BarBarOperator",
                    error: null
                  },
                  rightOperand: {
                    kind: "NodeKind.VariableNode",
                    error: null,
                    name: {
                      start: 5,
                      length: 1,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  }
                },
                operator: {
                  start: 7,
                  length: 2,
                  kind: "TokenKind.BarBarOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 10,
                    length: 1,
                    kind: "TokenKind.Name",
                    error: null
                  }
                }
              },
              semicolon: {
                start: 11,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 12,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle conditional expressions - 03", function () {
        const document = `a.foo || b.bar() || c.baz == 1234;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.BinaryExpressionNode",
                error: null,
                leftOperand: {
                  kind: "NodeKind.BinaryExpressionNode",
                  error: null,
                  leftOperand: {
                    kind: "NodeKind.MemberAccessExpressionNode",
                    error: null,
                    expression: {
                      kind: "NodeKind.VariableNode",
                      error: null,
                      name: {
                        start: 0,
                        length: 1,
                        kind: "TokenKind.Name",
                        error: null
                      }
                    },
                    dot: {
                      start: 1,
                      length: 1,
                      kind: "TokenKind.DotOperator",
                      error: null
                    },
                    member: {
                      start: 2,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 6,
                    length: 2,
                    kind: "TokenKind.BarBarOperator",
                    error: null
                  },
                  rightOperand: {
                    kind: "NodeKind.CallExpressionNode",
                    error: null,
                    expression: {
                      kind: "NodeKind.MemberAccessExpressionNode",
                      error: null,
                      expression: {
                        kind: "NodeKind.VariableNode",
                        error: null,
                        name: {
                          start: 9,
                          length: 1,
                          kind: "TokenKind.Name",
                          error: null
                        }
                      },
                      dot: {
                        start: 10,
                        length: 1,
                        kind: "TokenKind.DotOperator",
                        error: null
                      },
                      member: {
                        start: 11,
                        length: 3,
                        kind: "TokenKind.Name",
                        error: null
                      }
                    },
                    leftParen: {
                      start: 14,
                      length: 1,
                      kind: "TokenKind.LeftParenDelimiter",
                      error: null
                    },
                    arguments: {
                      kind: "NodeKind.ArgumentExpressionListNode",
                      error: null,
                      elements: []
                    },
                    rightParen: {
                      start: 15,
                      length: 1,
                      kind: "TokenKind.RightParenDelimiter",
                      error: null
                    }
                  }
                },
                operator: {
                  start: 17,
                  length: 2,
                  kind: "TokenKind.BarBarOperator",
                  error: null
                },
                rightOperand: {
                  kind: "NodeKind.BinaryExpressionNode",
                  error: null,
                  leftOperand: {
                    kind: "NodeKind.MemberAccessExpressionNode",
                    error: null,
                    expression: {
                      kind: "NodeKind.VariableNode",
                      error: null,
                      name: {
                        start: 20,
                        length: 1,
                        kind: "TokenKind.Name",
                        error: null
                      }
                    },
                    dot: {
                      start: 21,
                      length: 1,
                      kind: "TokenKind.DotOperator",
                      error: null
                    },
                    member: {
                      start: 22,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 26,
                    length: 2,
                    kind: "TokenKind.EqualsEqualsOperator",
                    error: null
                  },
                  rightOperand: {
                    kind: "NodeKind.NumberLiteralNode",
                    error: null,
                    literal: {
                      start: 29,
                      length: 4,
                      kind: "TokenKind.NumberLiteral",
                      error: null
                    }
                  }
                }
              },
              semicolon: {
                start: 33,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 34,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle array element access expressions - 01", function () {
        const document = `foo[0];`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.ArrayElementAccessExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftBracket: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftBracketDelimiter",
                  error: null
                },
                index: {
                  kind: "NodeKind.NumberLiteralNode",
                  error: null,
                  literal: {
                    start: 4,
                    length: 1,
                    kind: "TokenKind.NumberLiteral",
                    error: null
                  }
                },
                rightBracket: {
                  start: 5,
                  length: 1,
                  kind: "TokenKind.RightBracketDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 6,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 7,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle array element access expressions - 02", function () {
        const document = `foo[bar().baz + 1];`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.ArrayElementAccessExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftBracket: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftBracketDelimiter",
                  error: null
                },
                index: {
                  kind: "NodeKind.BinaryExpressionNode",
                  error: null,
                  leftOperand: {
                    kind: "NodeKind.MemberAccessExpressionNode",
                    error: null,
                    expression: {
                      kind: "NodeKind.CallExpressionNode",
                      error: null,
                      expression: {
                        kind: "NodeKind.VariableNode",
                        error: null,
                        name: {
                          start: 4,
                          length: 3,
                          kind: "TokenKind.Name",
                          error: null
                        }
                      },
                      leftParen: {
                        start: 7,
                        length: 1,
                        kind: "TokenKind.LeftParenDelimiter",
                        error: null
                      },
                      arguments: {
                        kind: "NodeKind.ArgumentExpressionListNode",
                        error: null,
                        elements: []
                      },
                      rightParen: {
                        start: 8,
                        length: 1,
                        kind: "TokenKind.RightParenDelimiter",
                        error: null
                      }
                    },
                    dot: {
                      start: 9,
                      length: 1,
                      kind: "TokenKind.DotOperator",
                      error: null
                    },
                    member: {
                      start: 10,
                      length: 3,
                      kind: "TokenKind.Name",
                      error: null
                    }
                  },
                  operator: {
                    start: 14,
                    length: 1,
                    kind: "TokenKind.PlusOperator",
                    error: null
                  },
                  rightOperand: {
                    kind: "NodeKind.NumberLiteralNode",
                    error: null,
                    literal: {
                      start: 16,
                      length: 1,
                      kind: "TokenKind.NumberLiteral",
                      error: null
                    }
                  }
                },
                rightBracket: {
                  start: 17,
                  length: 1,
                  kind: "TokenKind.RightBracketDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 18,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 19,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle array element access expressions - 03", function () {
        const document = `foo[];`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.ArrayElementAccessExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftBracket: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftBracketDelimiter",
                  error: null
                },
                index: {
                  start: 4,
                  length: 0,
                  kind: "TokenKind.ArrayElementIndex",
                  error: "TokenError.MissingToken"
                },
                rightBracket: {
                  start: 4,
                  length: 1,
                  kind: "TokenKind.RightBracketDelimiter",
                  error: null
                }
              },
              semicolon: {
                start: 5,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 6,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });

      it("Should handle array element access expressions - 04", function () {
        const document = `foo[;`;

        const expected = {
          kind: "NodeKind.SourceDocumentNode",
          error: null,
          statements: [
            {
              kind: "NodeKind.ExpressionStatementNode",
              error: null,
              expression: {
                kind: "NodeKind.ArrayElementAccessExpressionNode",
                error: null,
                expression: {
                  kind: "NodeKind.VariableNode",
                  error: null,
                  name: {
                    start: 0,
                    length: 3,
                    kind: "TokenKind.Name",
                    error: null
                  }
                },
                leftBracket: {
                  start: 3,
                  length: 1,
                  kind: "TokenKind.LeftBracketDelimiter",
                  error: null
                },
                index: {
                  start: 4,
                  length: 0,
                  kind: "TokenKind.ArrayElementIndex",
                  error: "TokenError.MissingToken"
                },
                rightBracket: {
                  start: 4,
                  length: 0,
                  kind: "TokenKind.RightBracketDelimiter",
                  error: "TokenError.MissingToken"
                }
              },
              semicolon: {
                start: 4,
                length: 1,
                kind: "TokenKind.SemicolonDelimiter",
                error: null
              }
            }
          ],
          endOfFile: {
            start: 5,
            length: 0,
            kind: "TokenKind.EndOfFile",
            error: null
          }
        };

        const actual = parseSourceDocument(document);

        assertNodesEqual(actual, expected);
      });
    });

    describe.skip("Ternary Expressions", function () {});
  });
});
