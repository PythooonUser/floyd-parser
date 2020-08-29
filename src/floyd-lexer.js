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
    /** @type {Token[]} The current whitespace, comment or directive trivia Token objects. */
    this.trivia = [];
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
    this.trivia = [];
  }

  /**
   * Returns the next token in the source document.
   *
   * @return {Token|null} The next Token object in the source document.
   */
  advance() {
    let character = this._next();

    if (character === null) {
      if (this.index === this.length) {
        return this._makeToken(this.index, 0, TokenKind.EndOfFile);
      }

      if (this.index > this.length) {
        return null;
      }
    }

    if (" \t\r\n".includes(character)) {
      let start = this.index;

      while (" \t\r\n".includes(this._look())) {
        this._next();
      }

      this._makeTriviaToken(
        start,
        this.index + 1 - start,
        TokenKind.Whitespace
      );

      return this.advance();
    }

    if (character === "/" && this._look() === "/") {
      let start = this.index;

      while (this._look() && this._look() !== "\n") {
        this._next();
      }

      if (this._look() === "\n") {
        this._next();
      }

      this._makeTriviaToken(
        start,
        this.index + 1 - start,
        TokenKind.SingleLineComment
      );

      return this.advance();
    }

    return this._makeToken(this.index, 1, TokenKind.UnknownToken);
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
   * Returns the next character in the source document without advancing the internal state.
   *
   * @return {string|null} The next character in the source document.
   */
  _look() {
    const index = this.index + 1;

    if (index >= this.length) {
      return null;
    }

    return this.document[index];
  }

  /**
   * Creates a new Token object.
   *
   * @param {number} start The start index of the token.
   * @param {number} length The length of the token.
   * @param {TokenKind} kind The kind of token.
   * @return {Token} The Token object created.
   */
  _makeToken(start, length, kind) {
    const token = new Token(start, length, kind, this.trivia);
    this.trivia = [];
    return token;
  }

  /**
   * Creates a new trivia Token object.
   *
   * @param {number} start The start index of the token.
   * @param {number} length The length of the token.
   * @param {TokenKind} kind The kind of token.
   */
  _makeTriviaToken(start, length, kind) {
    const token = new Token(start, length, kind);
    this.trivia.push(token);
  }
}

exports.Lexer = Lexer;
