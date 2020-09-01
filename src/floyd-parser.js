const { Lexer } = require("./floyd-lexer");
const { TokenKind } = require("./token-kind");
const { Token } = require("./token");
const { TokenError } = require("./token-error");
const { SourceDocumentNode } = require("./source-document-node");
const { ParseContext } = require("./parse-context");
const { ParseContextError } = require("./parse-context-error");
const { ClassDeclarationNode } = require("./class-declaration-node");

class Parser {
  constructor() {
    this.lexer = new Lexer();
    this.token = null;
  }

  _reset(document) {
    this.lexer.reset(document);
  }

  _advance() {
    this.token = this.lexer.advance();
  }

  /**
   * Returns the next token in the source document.
   *
   * @param {TokenKind} kind The token kind to match with the next token.
   */
  _consume(kind) {
    const token = this.token;

    if (token.kind === kind) {
      this.token = this.lexer.advance();
      return token;
    }

    return new Token(token.start, 0, kind, [], TokenError.MissingToken);
  }

  /**
   * Returns the next token in the source document only if `kind` matches.
   *
   * @param {TokenKind} kind The token kind to match with the next token.
   */
  _consumeOptional(kind) {
    const token = this.token;

    if (token.kind === kind) {
      this.token = this.lexer.advance();
      return token;
    }

    return null;
  }

  /**
   * Parses a source document and returns a SourceDocumentNode object.
   *
   * @param {string} document The source document.
   * @return {SourceDocumentNode} The root node for the AST.
   */
  parseSourceDocument(document) {
    this._reset(document);
    this._advance();

    let sourceDocumentNode = new SourceDocumentNode();
    sourceDocumentNode.statements = this._parseElementList(
      sourceDocumentNode,
      ParseContext.SourceElements
    );
    sourceDocumentNode.endOfFile = this._consume(TokenKind.EndOfFile);

    this._advance();
    return sourceDocumentNode;
  }

  /**
   * TODO
   * @param {ParseContext} context The element parse context.
   */
  _parseElementList(parent, context) {
    /** @type {Node[]} */
    let elementList = [];

    while (!this._isElementListTerminator(context, this.token)) {
      if (this._isElementListInitiator(context, this.token)) {
        const parser = this._getElementListParser(context);
        let element = parser(parent);
        elementList.push(element);
        continue;
      }

      let skippedToken = this.token;
      skippedToken.error = TokenError.SkippedToken;
      elementList.push(skippedToken);
      this._advance();
    }

    return elementList;
  }

  /**
   * TODO
   * @param {ParseContext} context The element parse context.
   * @param {Token} token The token to be checked.
   */
  _isElementListTerminator(context, token) {
    const kind = token.kind;

    if (kind === TokenKind.EndOfFile) {
      return true;
    }

    switch (context) {
      case ParseContext.SourceElements:
        return false;
      default:
        throw new ParseContextError(`Unkown parse context '${context}'`);
    }
  }

  /**
   * TODO
   * @param {ParseContext} context The element parse context.
   * @param {Token} token The token to be checked.
   */
  _isElementListInitiator(context, token) {
    switch (context) {
      case ParseContext.SourceElements:
        return this._isStatementInitiator(token);
      default:
        throw new ParseContextError(`Unkown parse context '${context}'`);
    }
  }

  /**
   * TODO
   * @param {Token} token The token to be checked.
   */
  _isStatementInitiator(token) {
    const kind = token.kind;

    switch (kind) {
      case TokenKind.ClassKeyword:
        return true;
      default:
        // TODO: Check for expression.
        return false;
    }
  }

  _getElementListParser(context) {
    switch (context) {
      case ParseContext.SourceElements:
        return this._parseClassDeclaration.bind(this);
      default:
        throw new ParseContextError(`Unkown parse context '${context}'`);
    }
  }

  _parseClassDeclaration(parent) {
    let classDeclarationNode = new ClassDeclarationNode();
    classDeclarationNode.parent = parent;

    classDeclarationNode.classKeyword = this._consume(TokenKind.ClassKeyword);
    classDeclarationNode.abstractKeyword = this._consumeOptional(
      TokenKind.AbstractKeyword
    );
    // TODO: Allow reserved keywords etc. to be class names as well.
    // TODO: Emit diagnostic if this is not TokenKind.Name but a reserved word etc.
    classDeclarationNode.name = this._consume(TokenKind.Name);

    return classDeclarationNode;
  }
}

exports.Parser = Parser;
