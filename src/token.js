const { TokenKind } = require("./token-kind");

/** Represents a single Token in the source document. */
class Token {
  /**
   * Creates a new Token.
   *
   * @param {number} start The start index in the source document.
   * @param {number} length The length of the token.
   * @param {TokenKind} kind The kind of the token.
   * @param {Token[]} trivia The leading whitespace, comment or directive trivia Token objects.
   */
  constructor(start, length, kind, trivia) {
    /** The start index in the source document. */
    this.start = start;
    /** The length of the token. */
    this.length = length;
    /** The kind of the token. */
    this.kind = kind;
    /** The leading whitespace, comment or directive trivia Token objects. */
    this.trivia = trivia || [];
  }
}

exports.Token = Token;
