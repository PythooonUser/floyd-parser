const { Token } = require("./token");
const { TokenKind } = require("./token-kind");
const { TokenError } = require("./token-error");

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
      return this.handleEndOfFile();
    }

    if (" \t\r\n".includes(character)) {
      this.parseWhitespaceTrivia();
      return this.advance();
    }

    if (character === "/" && this._look() === "/") {
      this.parseSingleLineCommentTrivia();
      return this.advance();
    }

    if (character === "/" && this._look() === "*") {
      this.parseMultiLineCommentTrivia();
      return this.advance();
    }

    if (
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".includes(
        character
      )
    ) {
      return this.parseName();
    }

    if ("0123456789".includes(character)) {
      return this.parseNumberLiteral();
    }

    return this._makeToken(
      this.index,
      1,
      TokenKind.UnknownToken,
      TokenError.UnknownToken
    );
  }

  /**
   * Handles End Of File.
   *
   * @return {Token|null} The End Of File Token object or null.
   */
  handleEndOfFile() {
    if (this.index === this.length) {
      return this._makeToken(this.index, 0, TokenKind.EndOfFile);
    }

    if (this.index > this.length) {
      return null;
    }
  }

  /**
   * Parses whitespace trivia.
   */
  parseWhitespaceTrivia() {
    const start = this.index;

    while (" \t\r\n".includes(this._look())) {
      this._next();
    }

    const length = this.index + 1 - start;
    this._makeTriviaToken(start, length, TokenKind.Whitespace);
  }

  /**
   * Parses single line comment trivia.
   */
  parseSingleLineCommentTrivia() {
    const start = this.index;
    this._next(); // Consume "/".

    while (this._look() && this._look() !== "\n") {
      this._next();
    }

    const length = this.index + 1 - start;
    this._makeTriviaToken(start, length, TokenKind.SingleLineComment);
  }

  /**
   * Parses multi line comment trivia.
   */
  parseMultiLineCommentTrivia() {
    const start = this.index;
    let error = null;
    this._next(); // Consume "*".

    while (true) {
      if (!this._look()) {
        error = TokenError.UnexpectedEndOfFile;
        break;
      }

      if (this._look() === "*" && this._look(2) === "/") {
        break;
      }

      this._next();
    }

    if (this._look()) {
      this._next(); // Consume "*".
      this._next(); // Consume "/".
    }

    const length = this.index + 1 - start;
    this._makeTriviaToken(start, length, TokenKind.MultiLineComment, error);
  }

  /**
   * Parses Name or Reserved Name or Keyword.
   *
   * @return {Token|null} The Name Token object or null.
   */
  parseName() {
    const start = this.index;

    while (
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_".includes(
        this._look()
      )
    ) {
      this._next();
    }

    const length = this.index + 1 - start;
    const content = this.document.slice(start, start + length);
    const kind = TokenKind.KeywordTokenMap[content];

    return this._makeToken(start, length, kind ? kind : TokenKind.Name);
  }

  parseNumberLiteral() {
    const start = this.index;

    while ("0123456789".includes(this._look())) {
      this._next();
    }

    const length = this.index + 1 - start;
    return this._makeToken(start, length, TokenKind.NumberLiteral);
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
   * @param {number} step The step size. Defaults to 1.
   * @return {string|null} The next character in the source document.
   */
  _look(step = 1) {
    const index = this.index + step;

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
   * @param {TokenError} error The error of token in case of parse issues.
   * @return {Token} The Token object created.
   */
  _makeToken(start, length, kind, error) {
    const token = new Token(start, length, kind, this.trivia, error);
    this.trivia = [];
    return token;
  }

  /**
   * Creates a new trivia Token object.
   *
   * @param {number} start The start index of the token.
   * @param {number} length The length of the token.
   * @param {TokenKind} kind The kind of token.
   * @param {TokenError} error The error of token in case of parse issues.
   */
  _makeTriviaToken(start, length, kind, error) {
    const token = new Token(start, length, kind, [], error);
    this.trivia.push(token);
  }
}

exports.Lexer = Lexer;
