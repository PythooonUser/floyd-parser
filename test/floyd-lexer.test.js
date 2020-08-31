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
      const document = `void int string object class abstract if else switch case default break return halt do while for quit super`;

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
          start: 107,
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
          kind: TokenKind.BinaryLeftShiftOperator,
          trivia: [],
          error: null
        },
        {
          start: 3,
          length: 2,
          kind: TokenKind.BinaryRightShiftOperator,
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
          kind: TokenKind.IncrementOperator,
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
          kind: TokenKind.DecrementOperator,
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
          kind: TokenKind.AndOperator,
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
          kind: TokenKind.BinaryAndOperator,
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
          kind: TokenKind.OrOperator,
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
          kind: TokenKind.BinaryOrOperator,
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
          kind: TokenKind.BinaryXorOperator,
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
          kind: TokenKind.LessThanOrEqualOperator,
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
          kind: TokenKind.GreaterThanOrEqualOperator,
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
          kind: TokenKind.NotEqualOperator,
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
          kind: TokenKind.EqualOperator,
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
          kind: TokenKind.NotOperator,
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
          kind: TokenKind.BinaryNotOperator,
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
          kind: TokenKind.ModuloAssignmentOperator,
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
          kind: TokenKind.DivisionAssignmentOperator,
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
          kind: TokenKind.MultiplicationAssignmentOperator,
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
          kind: TokenKind.AdditionAssignmentOperator,
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
          kind: TokenKind.SubtractionAssignmentOperator,
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
          kind: TokenKind.AdditionOperator,
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
          kind: TokenKind.SubtractionOperator,
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
          kind: TokenKind.ModuloOperator,
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
          kind: TokenKind.DivisionOperator,
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
          kind: TokenKind.MultiplicationOperator,
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
          kind: TokenKind.AssignmentOperator,
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
          kind: TokenKind.QuestionMarkOperator,
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
          kind: TokenKind.LeftParen,
          trivia: [],
          error: null
        },
        {
          start: 2,
          length: 1,
          kind: TokenKind.RightParen,
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
          kind: TokenKind.LeftBrace,
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
          kind: TokenKind.RightBrace,
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
          kind: TokenKind.LeftBracket,
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
          kind: TokenKind.RightBracket,
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
          kind: TokenKind.Comma,
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
          kind: TokenKind.Semicolon,
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
