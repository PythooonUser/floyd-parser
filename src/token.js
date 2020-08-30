const { TokenKind } = require("./token-kind");
const { TokenError } = require("./token-error");

/** Represents a single Token in the source document. */
class Token {
  /**
   * Creates a new Token.
   *
   * @param {number} start The start index in the source document.
   * @param {number} length The length of the token.
   * @param {TokenKind} kind The kind of the token.
   * @param {Token[]} trivia The leading whitespace, comment or directive trivia Token objects.
   * @param {TokenError} error The error of token in case of parse issues.
   */
  constructor(start, length, kind, trivia, error) {
    /** The start index in the source document. */
    this.start = start;
    /** The length of the token. */
    this.length = length;
    /** The kind of the token. */
    this.kind = kind;
    /** The leading whitespace, comment or directive trivia Token objects. */
    this.trivia = trivia || [];
    /** The error of token in case of parse issues. */
    this.error = error === undefined ? null : error;
  }
}

exports.Token = Token;
