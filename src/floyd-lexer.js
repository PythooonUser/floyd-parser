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
    /** @type {Token[]} The currently cached tokens when used a look ahead previously. */
    this.tokens = [];
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
    this.tokens = [];
  }

  /**
   * Returns the next token in the source document.
   *
   * @return {Token|null} The next Token object in the source document.
   */
  advance() {
    if (this.tokens.length > 0) {
      const token = this.tokens[0];
      this.tokens = this.tokens.slice(1);
      return token;
    }

    return this._load();
  }

  /**
   * Returns the next token in the source document ignoring cached tokens.
   *
   * @return {Token|null} The next Token object in the source document.
   */
  _load() {
    let character = this._next();

    if (character === null) {
      return this._handleEndOfFile();
    }

    if (" \t\r\n".includes(character)) {
      this._parseWhitespaceTrivia();
      return this._load();
    }

    if (character === "/" && this._look() === "/") {
      this._parseSingleLineCommentTrivia();
      return this._load();
    }

    if (character === "/" && this._look() === "*") {
      this._parseMultiLineCommentTrivia();
      return this._load();
    }

    if (character === "#") {
      this._parseDirectiveTrivia();
      return this._load();
    }

    if (
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".includes(
        character
      )
    ) {
      return this._parseName();
    }

    if ("0123456789".includes(character)) {
      return this._parseNumberLiteral();
    }

    if (character === '"') {
      return this._parseStringLiteral();
    }

    if ("<>+-&|^!=~%/*:?.".includes(character)) {
      return this._parseOperator();
    }

    if ("(){}[],;".includes(character)) {
      return this._parseDelimiter();
    }

    return this._makeToken(
      this.index,
      1,
      TokenKind.UnknownToken,
      TokenError.UnknownToken
    );
  }

  /**
   * Returns the next token in the source document without advancing the internal state.
   * Use `step = 2` to get the next but one.
   *
   * @return {Token|null} The next Token object in the source document.
   */
  look(step = 1) {
    if (this.tokens.length >= step) {
      return this.tokens[step - 1];
    }

    const iterations = step - this.tokens.length;
    for (let i = 0; i < iterations; i++) {
      this.tokens.push(this._load());
    }

    return this.tokens[this.tokens.length - 1];
  }

  /**
   * Handles end of file.
   *
   * @return {Token|null} The end of file Token object or null.
   */
  _handleEndOfFile() {
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
  _parseWhitespaceTrivia() {
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
  _parseSingleLineCommentTrivia() {
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
  _parseMultiLineCommentTrivia() {
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
   * Parses directive trivia.
   */
  _parseDirectiveTrivia() {
    const start = this.index;

    while (this._look() && this._look() !== "\n") {
      this._next();
    }

    const directiveKeyword = this.document
      .slice(start, this.index + 1)
      .split(/\s/)[0];
    const kind = TokenKind.DirectiveTokenMap[directiveKeyword];

    const length = this.index + 1 - start;
    this._makeTriviaToken(
      start,
      length,
      kind ? kind : TokenKind.UnknownDirective,
      kind ? null : TokenError.UnkownDirective
    );
  }

  /**
   * Parses a name or reserved name or keyword.
   *
   * @return {Token|null} The name Token object or null.
   */
  _parseName() {
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

  /**
   * Parses a number literal.
   *
   * @return {Token|null} The number literal Token object or null.
   */
  _parseNumberLiteral() {
    const start = this.index;

    while ("0123456789".includes(this._look())) {
      this._next();
    }

    const length = this.index + 1 - start;
    return this._makeToken(start, length, TokenKind.NumberLiteral);
  }

  /**
   * Parses a string literal.
   *
   * @return {Token|null} The string literal Token object or null.
   */
  _parseStringLiteral() {
    const start = this.index;
    let error = null;

    while (true) {
      if (!this._look()) {
        error = TokenError.UnexpectedEndOfFile;
        break;
      }

      if (this._look() === '"') {
        break;
      }

      this._next();
    }

    if (this._look()) {
      this._next(); // Consume '"'.
    }

    const length = this.index + 1 - start;
    return this._makeToken(start, length, TokenKind.StringLiteral, error);
  }

  /**
   * Parses an operator.
   *
   * @return {Token|null} The operator Token object or null.
   */
  _parseOperator() {
    const start = this.index;

    const firstCharacter = this.document[this.index];
    let kind = TokenKind.OperatorTokenMap[firstCharacter];

    const secondCharacter = this._look();
    if ("<>+-&|=".includes(secondCharacter)) {
      const extendedKind =
        TokenKind.OperatorTokenMap[firstCharacter + secondCharacter];
      if (extendedKind) {
        this._next(); // Consume second part of operator.
        kind = extendedKind;
      }
    }

    const length = this.index + 1 - start;
    return this._makeToken(start, length, kind);
  }

  /**
   * Parses a delimiter.
   *
   * @return {Token|null} The delimiter Token object or null.
   */
  _parseDelimiter() {
    const start = this.index;

    const character = this.document[this.index];
    const kind = TokenKind.DelimiterTokenMap[character];

    const length = this.index + 1 - start;
    return this._makeToken(start, length, kind);
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
