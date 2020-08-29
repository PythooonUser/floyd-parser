const { TokenKind } = require("./token-kind");

/** Represents a single Token in the source document. */
class Token {
  /**
   * Creates a new Token.
   *
   * @param {number} start The start index in the source document
   * @param {number} triviaStart The whitespace, comment or directive trivia start index in the source document
   * @param {number} length The length of the token
   * @param {TokenKind} kind The kind of the token
   */
  constructor(start, triviaStart, length, kind) {
    /** The start index in the source document. */
    this.start = start;
    /** Same as start, but includes leading whitespace, comment or directive trivia. */
    this.triviaStart = triviaStart;
    /** The length of the token. */
    this.length = length;
    /** The kind of the token. */
    this.kind = kind;
  }
}

exports.Token = Token;
