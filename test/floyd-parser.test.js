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
    });

    describe.skip("Ternary Expressions", function () {});
  });
});
