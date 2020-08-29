const assert = require("assert");
const { Lexer } = require("../src/floyd-lexer");
const { Token } = require("../src/token");
const { TokenKind } = require("../src/token-kind");

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
          trivia: []
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });

    it("Should handle End Of File with leading whitespace trivia", function () {
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
              trivia: []
            }
          ]
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });

    it("Should handle End Of File with leading comment trivia", function () {
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
              trivia: []
            }
          ]
        }
      ];

      const actual = getTokens(document);

      assertTokenArraysEqual(actual, expected);
    });
  });
});
