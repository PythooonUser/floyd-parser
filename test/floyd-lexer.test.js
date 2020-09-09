const assert = require("assert");
const { Lexer } = require("../src/floyd-lexer");
const { Token } = require("../src/token");
const { TokenKind } = require("../src/token-kind");
const { TokenError } = require("../src/token-error");

describe("Lexer", function () {
  /** @type {Lexer} */
  let lexer;

  this.beforeEach(function () {
    lexer = new Lexer();
  });

  this.afterEach(function () {
    lexer = null;
  });

  /**
   * Asserts that two Token objects are equal.
   *
   * @param {Token} actual The actual Token object.
   * @param {Token} expected The expected Token object.
   */
  const assertTokensEqual = (actual, expected) => {
    assert.strictEqual(
      actual.start,
      expected.start,
      "Token start indices should be equal."
    );

    assert.strictEqual(
      actual.length,
      expected.length,
      "Token lengths should be equal."
    );

    assert.strictEqual(
      actual.kind,
      expected.kind,
      "Token kinds should be equal."
    );

    assert.strictEqual(
      actual.error,
      expected.error,
      "Token errors should be equal."
    );

    assertTokenArraysEqual(actual.trivia, expected.trivia);
  };

  /**
   * Asserts that two Token object arrays are equal.
   *
   * @param {Token[]} actual The actual Token object array.
   * @param {Token[]} expected The expected Token object array.
   */
  const assertTokenArraysEqual = (actual, expected) => {
    assert.strictEqual(
      actual.length,
      expected.length,
      "Token array lengths should be equal."
    );

    for (let i = 0; i < expected.length; i++) {
      assertTokensEqual(actual[i], expected[i]);
    }
  };

  /**
   * Get all Token objects from the source document.
   *
   * @param {string} document The source document.
   * @return {Token[]} The Token object array.
   */
  const getTokens = document => {
    lexer.reset(document);

    /** @type {Token[]} */
    let tokens = [];
    let token = lexer.advance();

    while (token) {
      tokens.push(token);
      token = lexer.advance();
    }

    return tokens;
  };

  describe("Look Ahead", function () {
    it("Should handle look aheads", function () {
      const document = `foo bar`;

      const token1 = {
        start: 0,
        length: 3,
        kind: "TokenKind.Name",
        trivia: [],
        error: null
      };

      const token2 = {
        start: 4,
        length: 3,
        kind: "TokenKind.Name",
        trivia: [
          {
            start: 3,
            length: 1,
            kind: "TokenKind.Whitespace",
            trivia: [],
            error: null
          }
        ],
        error: null
      };

      const token3 = {
        start: 7,
        length: 0,
        kind: "TokenKind.EndOfFile",
        trivia: [],
        error: null
      };

      lexer.reset(document);
      assertTokensEqual(lexer.look(), token1);
      assertTokensEqual(lexer.look(2), token2);

      assertTokensEqual(lexer.advance(), token1);
      assertTokensEqual(lexer.look(), token2);

      assertTokensEqual(lexer.advance(), token2);

      lexer.reset(document);
      assertTokensEqual(lexer.look(2), token2);
      assertTokensEqual(lexer.look(), token1);

      assertTokensEqual(lexer.advance(), token1);
      assertTokensEqual(lexer.look(2), token3);

      assertTokensEqual(lexer.advance(), token2);
      assertTokensEqual(lexer.look(), token3);

      assertTokensEqual(lexer.advance(), token3);
    });
  });

  describe("End Of File", function () {
    it("Should handle end of file", function () {
      const document = ``;

      /** @type {Token[]} */
      const expected = [
        {
          start: 0,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });
  });

  describe("Unkown Tokens", function () {
    it("Should handle unknown token", function () {
      const document = `§`;

      /** @type {Token[]} */
      const expected = [
        {
          start: 0,
          length: 1,
          kind: TokenKind.UnknownToken,
          trivia: [],
          error: TokenError.UnknownToken
        },
        {
          start: 1,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });
  });

  describe("Trivia", function () {
    it("Should handle whitespace trivia", function () {
      const document = ` `;

      /** @type {Token[]} */
      const expected = [
        {
          start: 1,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [
            {
              start: 0,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });

    it("Should handle single line comment trivia", function () {
      const document = `// Hello World`;

      /** @type {Token[]} */
      const expected = [
        {
          start: 14,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [
            {
              start: 0,
              length: 14,
              kind: TokenKind.SingleLineComment,
              trivia: [],
              error: null
            }
          ],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });

    it("Should handle whitespace and single line comment trivia", function () {
      const document = `// Hello World\n `;

      /** @type {Token[]} */
      const expected = [
        {
          start: 16,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [
            {
              start: 0,
              length: 14,
              kind: TokenKind.SingleLineComment,
              trivia: [],
              error: null
            },
            {
              start: 14,
              length: 2,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });

    it("Should handle multi line comment trivia", function () {
      const document = `/* Hello World */`;

      /** @type {Token[]} */
      const expected = [
        {
          start: 17,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [
            {
              start: 0,
              length: 17,
              kind: TokenKind.MultiLineComment,
              trivia: [],
              error: null
            }
          ],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });

    it("Should handle incomplete multi line comment trivia", function () {
      const document = `/* Hello World *`;

      /** @type {Token[]} */
      const expected = [
        {
          start: 16,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [
            {
              start: 0,
              length: 16,
              kind: TokenKind.MultiLineComment,
              trivia: [],
              error: TokenError.UnexpectedEndOfFile
            }
          ],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });

    it("Should handle whitespace and multi line comment trivia", function () {
      const document = `/* Hello World */ `;

      /** @type {Token[]} */
      const expected = [
        {
          start: 18,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [
            {
              start: 0,
              length: 17,
              kind: TokenKind.MultiLineComment,
              trivia: [],
              error: null
            },
            {
              start: 17,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });

    it("Should handle directive trivia", function () {
      const document = `#define A_EXAMINE 101\n#define A_EXAMINE\n#ifdef A_EXAMINE\n#ifndef A_EXAMINE\n#endif\n#foo\n#`;

      /** @type {Token[]} */
      const expected = [
        {
          start: 88,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [
            {
              start: 0,
              length: 21,
              kind: TokenKind.DefineDirective,
              trivia: [],
              error: null
            },
            {
              start: 21,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            },
            {
              start: 22,
              length: 17,
              kind: TokenKind.DefineDirective,
              trivia: [],
              error: null
            },
            {
              start: 39,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            },
            {
              start: 40,
              length: 16,
              kind: TokenKind.IfDirective,
              trivia: [],
              error: null
            },
            {
              start: 56,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            },
            {
              start: 57,
              length: 17,
              kind: TokenKind.IfNotDirective,
              trivia: [],
              error: null
            },
            {
              start: 74,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            },
            {
              start: 75,
              length: 6,
              kind: TokenKind.EndIfDirective,
              trivia: [],
              error: null
            },
            {
              start: 81,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            },
            {
              start: 82,
              length: 4,
              kind: TokenKind.UnknownDirective,
              trivia: [],
              error: TokenError.UnkownDirective
            },
            {
              start: 86,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            },
            {
              start: 87,
              length: 1,
              kind: TokenKind.UnknownDirective,
              trivia: [],
              error: TokenError.UnkownDirective
            }
          ],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });
  });

  describe("Names", function () {
    it("Should handle names", function () {
      const document = `testname test_name _testName testName0`;

      /** @type {Token[]} */
      const expected = [
        {
          start: 0,
          length: 8,
          kind: TokenKind.Name,
          trivia: [],
          error: null
        },
        {
          start: 9,
          length: 9,
          kind: TokenKind.Name,
          trivia: [
            {
              start: 8,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 19,
          length: 9,
          kind: TokenKind.Name,
          trivia: [
            {
              start: 18,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 29,
          length: 9,
          kind: TokenKind.Name,
          trivia: [
            {
              start: 28,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 38,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });

    it("Should handle keywords", function () {
      const document = `void int string object class abstract if else switch case default break return halt do while for quit super verb`;

      /** @type {Token[]} */
      const expected = [
        {
          start: 0,
          length: 4,
          kind: TokenKind.VoidKeyword,
          trivia: [],
          error: null
        },
        {
          start: 5,
          length: 3,
          kind: TokenKind.IntKeyword,
          trivia: [
            {
              start: 4,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 9,
          length: 6,
          kind: TokenKind.StringKeyword,
          trivia: [
            {
              start: 8,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 16,
          length: 6,
          kind: TokenKind.ObjectKeyword,
          trivia: [
            {
              start: 15,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 23,
          length: 5,
          kind: TokenKind.ClassKeyword,
          trivia: [
            {
              start: 22,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 29,
          length: 8,
          kind: TokenKind.AbstractKeyword,
          trivia: [
            {
              start: 28,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 38,
          length: 2,
          kind: TokenKind.IfKeyword,
          trivia: [
            {
              start: 37,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 41,
          length: 4,
          kind: TokenKind.ElseKeyword,
          trivia: [
            {
              start: 40,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 46,
          length: 6,
          kind: TokenKind.SwitchKeyword,
          trivia: [
            {
              start: 45,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 53,
          length: 4,
          kind: TokenKind.CaseKeyword,
          trivia: [
            {
              start: 52,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 58,
          length: 7,
          kind: TokenKind.DefaultKeyword,
          trivia: [
            {
              start: 57,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 66,
          length: 5,
          kind: TokenKind.BreakKeyword,
          trivia: [
            {
              start: 65,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 72,
          length: 6,
          kind: TokenKind.ReturnKeyword,
          trivia: [
            {
              start: 71,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 79,
          length: 4,
          kind: TokenKind.HaltKeyword,
          trivia: [
            {
              start: 78,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 84,
          length: 2,
          kind: TokenKind.DoKeyword,
          trivia: [
            {
              start: 83,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 87,
          length: 5,
          kind: TokenKind.WhileKeyword,
          trivia: [
            {
              start: 86,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 93,
          length: 3,
          kind: TokenKind.ForKeyword,
          trivia: [
            {
              start: 92,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 97,
          length: 4,
          kind: TokenKind.QuitKeyword,
          trivia: [
            {
              start: 96,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 102,
          length: 5,
          kind: TokenKind.SuperKeyword,
          trivia: [
            {
              start: 101,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 108,
          length: 4,
          kind: TokenKind.VerbKeyword,
          trivia: [
            {
              start: 107,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 112,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });
  });

  describe("Literals", function () {
    describe("Numbers", function () {
      it("Should handle numbers", function () {
        const document = `0 1 1234`;

        /** @type {Token[]} */
        const expected = [
          {
            start: 0,
            length: 1,
            kind: TokenKind.NumberLiteral,
            trivia: [],
            error: null
          },
          {
            start: 2,
            length: 1,
            kind: TokenKind.NumberLiteral,
            trivia: [
              {
                start: 1,
                length: 1,
                kind: TokenKind.Whitespace,
                trivia: [],
                error: null
              }
            ],
            error: null
          },
          {
            start: 4,
            length: 4,
            kind: TokenKind.NumberLiteral,
            trivia: [
              {
                start: 3,
                length: 1,
                kind: TokenKind.Whitespace,
                trivia: [],
                error: null
              }
            ],
            error: null
          },
          {
            start: 8,
            length: 0,
            kind: TokenKind.EndOfFile,
            trivia: [],
            error: null
          }
        ];

        const actual = getTokens(document);

        assertTokenArraysEqual(actual, expected);
      });
    });

    describe("Strings", function () {
      it("Should handle single-line string", function () {
        const document = `"Hello World!"`;

        /** @type {Token[]} */
        const expected = [
          {
            start: 0,
            length: 14,
            kind: TokenKind.StringLiteral,
            trivia: [],
            error: null
          },
          {
            start: 14,
            length: 0,
            kind: TokenKind.EndOfFile,
            trivia: [],
            error: null
          }
        ];

        const actual = getTokens(document);

        assertTokenArraysEqual(actual, expected);
      });

      it("Should handle multiline string", function () {
        const document = `"Hello\nWorld!"`;

        /** @type {Token[]} */
        const expected = [
          {
            start: 0,
            length: 14,
            kind: TokenKind.StringLiteral,
            trivia: [],
            error: null
          },
          {
            start: 14,
            length: 0,
            kind: TokenKind.EndOfFile,
            trivia: [],
            error: null
          }
        ];

        const actual = getTokens(document);

        assertTokenArraysEqual(actual, expected);
      });

      it("Should handle string with escape characters", function () {
        const document = `"Hello \\World\\!^"`;

        /** @type {Token[]} */
        const expected = [
          {
            start: 0,
            length: 17,
            kind: TokenKind.StringLiteral,
            trivia: [],
            error: null
          },
          {
            start: 17,
            length: 0,
            kind: TokenKind.EndOfFile,
            trivia: [],
            error: null
          }
        ];

        const actual = getTokens(document);

        assertTokenArraysEqual(actual, expected);
      });

      it("Should handle incomplete string", function () {
        const document = `"Hello World!`;

        /** @type {Token[]} */
        const expected = [
          {
            start: 0,
            length: 13,
            kind: TokenKind.StringLiteral,
            trivia: [],
            error: TokenError.UnexpectedEndOfFile
          },
          {
            start: 13,
            length: 0,
            kind: TokenKind.EndOfFile,
            trivia: [],
            error: null
          }
        ];

        const actual = getTokens(document);

        assertTokenArraysEqual(actual, expected);
      });
    });
  });

  describe("Operators", function () {
    it("Should handle operators", function () {
      const document = `<< >> ++ -- && & || | ^ <= >= < > != == ! ~ %= /= *= += -= + - % / * = : ? .`;

      /** @type {Token[]} */
      const expected = [
        {
          start: 0,
          length: 2,
          kind: TokenKind.LessThanLessThanOperator,
          trivia: [],
          error: null
        },
        {
          start: 3,
          length: 2,
          kind: TokenKind.GreaterThanGreaterThanOperator,
          trivia: [
            {
              start: 2,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 6,
          length: 2,
          kind: TokenKind.PlusPlusOperator,
          trivia: [
            {
              start: 5,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 9,
          length: 2,
          kind: TokenKind.MinusMinusOperator,
          trivia: [
            {
              start: 8,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 12,
          length: 2,
          kind: TokenKind.AmpersandAmpersandOperator,
          trivia: [
            {
              start: 11,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 15,
          length: 1,
          kind: TokenKind.AmpersandOperator,
          trivia: [
            {
              start: 14,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 17,
          length: 2,
          kind: TokenKind.BarBarOperator,
          trivia: [
            {
              start: 16,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 20,
          length: 1,
          kind: TokenKind.BarOperator,
          trivia: [
            {
              start: 19,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 22,
          length: 1,
          kind: TokenKind.CaretOperator,
          trivia: [
            {
              start: 21,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 24,
          length: 2,
          kind: TokenKind.LessThanEqualsOperator,
          trivia: [
            {
              start: 23,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 27,
          length: 2,
          kind: TokenKind.GreaterThanEqualsOperator,
          trivia: [
            {
              start: 26,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 30,
          length: 1,
          kind: TokenKind.LessThanOperator,
          trivia: [
            {
              start: 29,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 32,
          length: 1,
          kind: TokenKind.GreaterThanOperator,
          trivia: [
            {
              start: 31,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 34,
          length: 2,
          kind: TokenKind.ExclamationEqualsOperator,
          trivia: [
            {
              start: 33,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 37,
          length: 2,
          kind: TokenKind.EqualsEqualsOperator,
          trivia: [
            {
              start: 36,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 40,
          length: 1,
          kind: TokenKind.ExclamationOperator,
          trivia: [
            {
              start: 39,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 42,
          length: 1,
          kind: TokenKind.TildeOperator,
          trivia: [
            {
              start: 41,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 44,
          length: 2,
          kind: TokenKind.PercentEqualsOperator,
          trivia: [
            {
              start: 43,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 47,
          length: 2,
          kind: TokenKind.SlashEqualsOperator,
          trivia: [
            {
              start: 46,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 50,
          length: 2,
          kind: TokenKind.StarEqualsOperator,
          trivia: [
            {
              start: 49,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 53,
          length: 2,
          kind: TokenKind.PlusEqualsOperator,
          trivia: [
            {
              start: 52,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 56,
          length: 2,
          kind: TokenKind.MinusEqualsOperator,
          trivia: [
            {
              start: 55,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 59,
          length: 1,
          kind: TokenKind.PlusOperator,
          trivia: [
            {
              start: 58,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 61,
          length: 1,
          kind: TokenKind.MinusOperator,
          trivia: [
            {
              start: 60,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 63,
          length: 1,
          kind: TokenKind.PercentOperator,
          trivia: [
            {
              start: 62,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 65,
          length: 1,
          kind: TokenKind.SlashOperator,
          trivia: [
            {
              start: 64,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 67,
          length: 1,
          kind: TokenKind.StarOperator,
          trivia: [
            {
              start: 66,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 69,
          length: 1,
          kind: TokenKind.EqualsOperator,
          trivia: [
            {
              start: 68,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 71,
          length: 1,
          kind: TokenKind.ColonOperator,
          trivia: [
            {
              start: 70,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 73,
          length: 1,
          kind: TokenKind.QuestionOperator,
          trivia: [
            {
              start: 72,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 75,
          length: 1,
          kind: TokenKind.DotOperator,
          trivia: [
            {
              start: 74,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 76,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });
  });

  describe("Delimiters", function () {
    it("Should handle delimiters", function () {
      const document = `( ) { } [ ] , ;`;

      /** @type {Token[]} */
      const expected = [
        {
          start: 0,
          length: 1,
          kind: TokenKind.LeftParenDelimiter,
          trivia: [],
          error: null
        },
        {
          start: 2,
          length: 1,
          kind: TokenKind.RightParenDelimiter,
          trivia: [
            {
              start: 1,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 4,
          length: 1,
          kind: TokenKind.LeftBraceDelimiter,
          trivia: [
            {
              start: 3,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 6,
          length: 1,
          kind: TokenKind.RightBraceDelimiter,
          trivia: [
            {
              start: 5,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 8,
          length: 1,
          kind: TokenKind.LeftBracketDelimiter,
          trivia: [
            {
              start: 7,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 10,
          length: 1,
          kind: TokenKind.RightBracketDelimiter,
          trivia: [
            {
              start: 9,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 12,
          length: 1,
          kind: TokenKind.CommaDelimiter,
          trivia: [
            {
              start: 11,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 14,
          length: 1,
          kind: TokenKind.SemicolonDelimiter,
          trivia: [
            {
              start: 13,
              length: 1,
              kind: TokenKind.Whitespace,
              trivia: [],
              error: null
            }
          ],
          error: null
        },
        {
          start: 15,
          length: 0,
          kind: TokenKind.EndOfFile,
          trivia: [],
          error: null
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });
  });
});
