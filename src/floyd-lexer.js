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
    this.triviaIndex = 0;
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
    this.triviaIndex = 0;
  }

  /**
   * Returns the next token in the source document.
   *
   * @return {Token|null} The next Token object in the source document.
   */
  advance() {
    const character = this._next();

    if (character === null) {
      if (this.index === this.length) {
        return this._makeToken(TokenKind.EndOfFile, 0);
      }

      if (this.index > this.length) {
        return null;
      }
    }

    if (" \t\r\n".includes(character)) {
    }

    return this._makeToken(TokenKind.UnkownToken, 1);
  }

  /**
   * Returns the next character in the source document and advances the internal state.
   *
   * @return {string|null} The next character in the source document.
   */
  _next() {
    if (this.index === this.length - 1) {
      this.index++;
      return null;
    }

    if (this.index > this.length - 1) {
      this.index++;
      return null;
    }

    this.index++;
    return this.document[this.index];
  }

  /**
   * Creates a new Token object.
   *
   * @param {TokenKind} kind The kind of token.
   * @param {number} length The length of the token.
   * @return {Token} The Token object created.
   */
  _makeToken(kind, length) {
    const token = new Token(this.index, this.triviaIndex, length, kind);
    this.triviaIndex = this.index + 1;
    return token;
  }
}

exports.Lexer = Lexer;
