const { Lexer } = require("./floyd-lexer");
const { TokenKind } = require("./token-kind");
const { Token } = require("./token");
const { TokenError } = require("./token-error");
const { SourceDocumentNode } = require("./source-document-node");

class Parser {
  constructor() {
    this.lexer = new Lexer();
    this.token = null;
  }

  /**
   * Returns the next token in the source document.
   *
   * @param {TokenKind} kind The token kind to match with the next token.
   */
  consume(kind) {
    const token = this.token;

    if (token.kind === kind) {
      this.token = this.lexer.advance();
      return token;
    }

    return new Token(
      token.start,
      0,
      TokenKind.MissingToken,
      [],
      TokenError.MissingToken
    );
  }

  /**
   * Parses a source document and returns a SourceDocumentNode object.
   *
   * @param {string} document The source document.
   * @return {SourceDocumentNode} The root node for the AST.
   */
  parseSourceDocument(document) {
    this.lexer.reset(document);
    this.token = this.lexer.advance();

    let sourceDocumentNode = new SourceDocumentNode();
    sourceDocumentNode.endOfFile = this.consume(TokenKind.EndOfFile);

    this.lexer.advance();
    return sourceDocumentNode;
  }
}

exports.Parser = Parser;
