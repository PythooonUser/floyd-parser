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
    it("Should handle End Of File", function () {
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

    it("Should handle End Of File with whitespace trivia", function () {
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

    it("Should handle End Of File with single line comment trivia", function () {
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

    it("Should handle End Of File with whitespace and single line comment trivia", function () {
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

    it("Should handle End Of File with multi line comment trivia", function () {
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

    it("Should handle End Of File with incomplete multi line comment trivia", function () {
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

    it("Should handle End Of File with whitespace and multi line comment trivia", function () {
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
});
