const { Token } = require("./token");
const { TokenKind } = require("./token-kind");

/** Generates a stream of Token objects from a source document. */
class Lexer {
  constructor() {
    /** The input source document. */
    this.document = "";
    /** The maximum index in the source document. */
    this.length = 0;
    /** The current index in the source document. */
    this.index = -1;
    /** The current index of whitespace, comment or directive trivia in the source document. */
    this.triviaIndex = -1;
  }

  /**
   * Provides an input document and resets the internal state.
   *
   * @param {string} document The input document.
   */
  reset(document) {
    this.document = document;
    this.length = document.length;
    this.index = -1;
    this.triviaIndex = -1;
  }

  /**
   * Returns the next token in the source document.
   *
   * @return {Token} The next Token object in the source document.
   */
  advance() {
    if (this.index + 1 === this.length) {
      this.index++;
      return new Token(this.index, this.triviaIndex, 0, TokenKind.EndOfFile);
    }
    if (this.index + 1 > this.length) {
      return null;
    }

    this.index++;
    return new Token(this.index, this.triviaIndex, 1, TokenKind.UnkownToken);
  }
}

exports.Lexer = Lexer;
