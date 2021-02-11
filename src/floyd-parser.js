const { Lexer } = require("./floyd-lexer");

const { Token } = require("./token");
const { TokenError } = require("./token-error");
const { TokenKind } = require("./token-kind");
const { Node } = require("./node");

const { ParseContext } = require("./parse-context");
const { ParseContextError } = require("./parse-context-error");

const { OperatorAssociativity } = require("./operator-associativity");
const {
  OperatorPrecedenceAndAssociativityMap
} = require("./operator-precedence-associativity");

const { SourceDocumentNode } = require("./nodes/source-document-node");

const { ClassBaseClauseNode } = require("./nodes/class-base-clause-node");
const { ClassDeclarationNode } = require("./nodes/class-declaration-node");
const { ClassMembersNode } = require("./nodes/class-members-node");
const { WhileStatementNode } = require("./nodes/while-statement-node");
const { DoStatementNode } = require("./nodes/do-statement-node");
const {
  ExpressionStatementNode
} = require("./nodes/expression-statement-node");
const { VerbStatementNode } = require("./nodes/verb-statement-node");
const {
  FunctionDeclarationNode
} = require("./nodes/function-declaration-node");
const { CompoundStatementNode } = require("./nodes/compound-statement-node");
const { IfStatementNode } = require("./nodes/if-statement-node");
const { ElseClauseNode } = require("./nodes/else-clause-node");
const { ReturnStatementNode } = require("./nodes/return-statement-node");
const { SwitchStatementNode } = require("./nodes/switch-statement-node");
const { CaseStatementNode } = require("./nodes/case-statement-node");
const { DefaultStatementNode } = require("./nodes/default-statement-node");
const { BreakStatementNode } = require("./nodes/break-statement-node");
const { HaltStatementNode } = require("./nodes/halt-statement-node");
const { QuitStatementNode } = require("./nodes/quit-statement-node");
const { ForStatementNode } = require("./nodes/for-statement-node");
const { FetchStatementNode } = require("./nodes/fetch-statement-node");

const {
  UnaryOperatorExpressionNode
} = require("./nodes/unary-operator-expression-node");
const { BinaryExpressionNode } = require("./nodes/binary-expression-node");
const {
  ParenthesizedExpressionNode
} = require("./nodes/parenthesized-expression-node");
const {
  PrefixUpdateExpressionNode
} = require("./nodes/prefix-update-expression-node");
const { VariableNode } = require("./nodes/variable-node");
const { StringLiteralNode } = require("./nodes/string-literal-node");
const { NumberLiteralNode } = require("./nodes/number-literal-node");
const {
  ArgumentExpressionListNode
} = require("./nodes/argument-expression-list-node");
const { ArgumentExpressionNode } = require("./nodes/argument-expression-node");
const {
  ParameterDeclarationListNode
} = require("./nodes/parameter-declaration-list-node");
const {
  ParameterDeclarationNode
} = require("./nodes/parameter-declaration-node");
const {
  MemberAccessExpressionNode
} = require("./nodes/member-access-expression-node");
const { CallExpressionNode } = require("./nodes/call-expression-node");
const {
  ArrayElementAccessExpressionNode
} = require("./nodes/array-element-access-expression-node");
const {
  VariableDeclarationListNode
} = require("./nodes/variable-declaration-list-node");
const {
  VariableDeclarationNode
} = require("./nodes/variable-declaration-node");
const {
  ArrayDeclarationClauseNode
} = require("./nodes/array-declaration-clause-node");
const { ArrayLiteralNode } = require("./nodes/array-literal-node");
const {
  VariableInitializationClauseNode
} = require("./nodes/variable-initialization-clause-node");
const { TernaryExpressionNode } = require("./nodes/ternary-expression-node");
const {
  PostfixUpdateExpressionNode
} = require("./nodes/postfix-update-expression-node");

/** Generates an abstract syntax tree (AST) from a source document. */
class Parser {
  /** Creates a new parser. */
  constructor() {
    /** @type {Lexer} */
    this.lexer = new Lexer();

    /** @type {Token} */
    this.token = null;

    /** @type {ParseContext[]} */
    this.parseContexts = [];
  }

  /**
   * Resets the parser.
   *
   * @param {string} document The source document.
   */
  _reset(document) {
    this.lexer.reset(document);
    this.token = null;
    this.parseContexts = [];
  }

  /**
   * Loads the next token from the lexer.
   */
  _advance() {
    this.token = this.lexer.advance();
  }

  /**
   * Looks at the next token from the lexer.
   *
   * @param {number} step The number of tokens to look ahead.
   * @returns {Token} The next token.
   */
  _look(step = 1) {
    return this.lexer.look(step);
  }

  /**
   * Returns the next token in the source document.
   *
   * @param {TokenKind} kind The token kind to match with the next token.
   * @returns {Token} The next token.
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
   * Returns the next token in the source document.
   *
   * @param {TokenKind[]} kinds The token kinds to match with the next token.
   * @returns {Token} The next token.
   */
  _consumeChoice(kinds) {
    const token = this.token;

    if (kinds.includes(token.kind)) {
      this.token = this.lexer.advance();
      return token;
    }

    return new Token(token.start, 0, kinds[0], [], TokenError.MissingToken);
  }

  /**
   * Returns the next token in the source document only if `kind` matches.
   *
   * @param {TokenKind} kind The token kind to match with the next token.
   * @returns {Token|null} The next token.
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
   * Returns the parse context history.
   *
   * @returns {ParseContext[]} The parse context history.
   */
  _getParseContextHistory() {
    return [ParseContext.SourceElements].concat(
      this.parseContexts.slice(0, -1)
    );
  }

  /**
   * Sets the current parse context and adds it to the history.
   *
   * @param {ParseContext} context The current parse context.
   */
  _setCurrentParseContext(context) {
    this.parseContexts.push(context);
  }

  /**
   * Sets the parse context history to the previous context.
   */
  _restorePreviousParseContext() {
    this.parseContexts.pop();
  }

  /**
   * Parses a source document and returns a source document node.
   *
   * @param {string} document The source document.
   * @returns {SourceDocumentNode} The root node for the AST.
   */
  parseSourceDocument(document) {
    this._reset(document);
    this._advance();

    const node = new SourceDocumentNode();
    node.statements = this._parseElementList(node, ParseContext.SourceElements);
    node.endOfFile = this._consume(TokenKind.EndOfFile);
    node.document = document;

    this._advance();
    return node;
  }

  /**
   * Parses an element list of the given parse context.
   *
   * @param {ParseContext} context The element parse context.
   * @returns {Node[]} The element list nodes.
   */
  _parseElementList(parent, context) {
    this._setCurrentParseContext(context);

    /** @type {Node[]} */
    const elementList = [];

    while (!this._isElementListTerminator(context, this.token)) {
      if (this._isElementListInitiator(context, this.token)) {
        const parser = this._getElementListParser(context);
        const element = parser(parent);
        elementList.push(element);
        continue;
      }

      if (this._isValidInEnclosingContexts(this.token)) {
        break;
      }

      const skippedToken = this.token;
      skippedToken.error = TokenError.SkippedToken;
      elementList.push(skippedToken);
      this._advance();
    }

    this._restorePreviousParseContext();

    return elementList;
  }

  /**
   * Checks whether `token` is valid in enclosing parse contexts.
   *
   * @param {Token} token The token to be checked.
   * @returns {boolean} The token is valid.
   */
  _isValidInEnclosingContexts(token) {
    const parseContextHistory = this._getParseContextHistory();

    for (let i = parseContextHistory.length - 1; i >= 0; i--) {
      const context = parseContextHistory[i];

      if (
        this._isElementListInitiator(context, token) ||
        this._isElementListTerminator(context, token)
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks whether `token` is a list terminator in the parse `context`.
   *
   * @param {ParseContext} context The element parse context.
   * @param {Token} token The token to be checked.
   * @returns {boolean} The token is a list terminator.
   * @throws {ParseContextError} The parse context must be valid.
   */
  _isElementListTerminator(context, token) {
    const kind = token.kind;

    if (kind === TokenKind.EndOfFile) {
      return true;
    }

    switch (context) {
      case ParseContext.SourceElements:
        return false;
      case ParseContext.ClassMembers:
      case ParseContext.BlockStatements:
      case ParseContext.SwitchStatementElements:
        return kind === TokenKind.RightBraceDelimiter;
      case ParseContext.CaseStatementElements:
      case ParseContext.DefaultStatementElements:
        return (
          kind === TokenKind.CaseKeyword || kind === TokenKind.DefaultKeyword
        );
      default:
        throw new ParseContextError(`Unkown parse context '${context}'`);
    }
  }

  /**
   * Checks whether `token` is a list initiator in the parse `context`.
   *
   * @param {ParseContext} context The element parse context.
   * @param {Token} token The token to be checked.
   * @returns {boolean} The token is a list initiator.
   * @throws {ParseContextError} The parse context must be valid.
   */
  _isElementListInitiator(context, token) {
    switch (context) {
      case ParseContext.SourceElements:
      case ParseContext.BlockStatements:
      case ParseContext.CaseStatementElements:
      case ParseContext.DefaultStatementElements:
        return this._isStatementInitiator(token);
      case ParseContext.ClassMembers:
        return this._isClassMemberDeclarationInitiator(token);
      case ParseContext.SwitchStatementElements:
        return (
          this.token.kind === TokenKind.CaseKeyword ||
          this.token.kind === TokenKind.DefaultKeyword
        );
      default:
        throw new ParseContextError(`Unkown parse context '${context}'`);
    }
  }

  /**
   * Checks whether `token` is a statement initiator.
   *
   * @param {Token} token The token to be checked.
   * @returns {boolean} The token is a statement initiator.
   */
  _isStatementInitiator(token) {
    switch (token.kind) {
      case TokenKind.ClassKeyword:
      case TokenKind.WhileKeyword:
      case TokenKind.DoKeyword:
      case TokenKind.VerbKeyword:
      case TokenKind.IfKeyword:
      case TokenKind.ReturnKeyword:
      case TokenKind.IntKeyword:
      case TokenKind.StringKeyword:
      case TokenKind.ObjectKeyword:
      case TokenKind.VoidKeyword:
      case TokenKind.SwitchKeyword:
      case TokenKind.CaseKeyword:
      case TokenKind.DefaultKeyword:
      case TokenKind.BreakKeyword:
      case TokenKind.QuitKeyword:
      case TokenKind.HaltKeyword:
      case TokenKind.ForKeyword:
      case TokenKind.FetchKeyword:
        return true;
      default:
        return this._isExpressionInitiator(token);
    }
  }

  /**
   * Checks whether `token` is an expression initiator.
   *
   * @param {Token} token The token to be checked.
   * @returns {boolean} The token is an expression initiator.
   */
  _isExpressionInitiator(token) {
    switch (token.kind) {
      case TokenKind.Name:
      case TokenKind.SuperKeyword:
      case TokenKind.ThisKeyword:
      case TokenKind.NumberLiteral:
      case TokenKind.StringLiteral:
      case TokenKind.PlusOperator:
      case TokenKind.PlusPlusOperator:
      case TokenKind.MinusMinusOperator:
      case TokenKind.LeftParenDelimiter:
      case TokenKind.TildeOperator:
      case TokenKind.ExclamationOperator:
        return true;
      default:
        // TODO: Handle reserved words etc.
        return false;
    }
  }

  /**
   * Checks whether `token` is a class member declaration initiator.
   *
   * @param {Token} token The token to be checked.
   * @returns {boolean} The token is a class member declaration initiator.
   */
  _isClassMemberDeclarationInitiator(token) {
    const kind = token.kind;

    switch (kind) {
      // Method Call
      // TODO: Include reserved names.
      case TokenKind.Name:

      // Method Declaration
      case TokenKind.VoidKeyword:
      case TokenKind.IntKeyword:
      case TokenKind.StringKeyword:
      case TokenKind.ObjectKeyword:
        return true;
      default:
        return false;
    }
  }

  /**
   * Returns an element list parser for the given parse `context`.
   *
   * @param {ParseContext} context The element parse context.
   * @throws {ParseContextError} The parse context must be valid.
   */
  _getElementListParser(context) {
    switch (context) {
      case ParseContext.SourceElements:
      case ParseContext.BlockStatements:
      case ParseContext.CaseStatementElements:
      case ParseContext.DefaultStatementElements:
        return this._parseStatement.bind(this);
      case ParseContext.ClassMembers:
        return this._parseClassMember.bind(this);
      case ParseContext.SwitchStatementElements:
        return this._parseSwitchStatementElement.bind(this);
      default:
        throw new ParseContextError(`Unkown parse context '${context}'`);
    }
  }

  _parseStatement(parent) {
    const kind = this.token.kind;

    switch (kind) {
      case TokenKind.ClassKeyword:
        return this._parseClassDeclaration(parent);
      case TokenKind.WhileKeyword:
        return this._parseWhileStatement(parent);
      case TokenKind.DoKeyword:
        return this._parseDoStatement(parent);
      case TokenKind.VerbKeyword:
        return this._parseVerbStatement(parent);
      case TokenKind.VoidKeyword:
      case TokenKind.IntKeyword:
      case TokenKind.StringKeyword:
      case TokenKind.ObjectKeyword:
        return this._parseVariableOrFunctionDeclaration(parent);
      case TokenKind.IfKeyword:
        return this._parseIfStatement(parent);
      case TokenKind.ReturnKeyword:
        return this._parseReturnStatement(parent);
      case TokenKind.SwitchKeyword:
        return this._parseSwitchStatement(parent);
      case TokenKind.QuitKeyword:
        return this._parseQuitStatement(parent);
      case TokenKind.HaltKeyword:
        return this._parseHaltStatement(parent);
      case TokenKind.BreakKeyword:
        return this._parseBreakStatement(parent);
      case TokenKind.ForKeyword:
        return this._parseForStatement(parent);
      case TokenKind.FetchKeyword:
        return this._parseFetchStatement(parent);
      default:
        return this._parseExpressionStatement(parent);
    }
  }

  _parseClassDeclaration(parent) {
    const node = new ClassDeclarationNode();
    node.parent = parent;

    node.classKeyword = this._consume(TokenKind.ClassKeyword);
    node.abstractKeyword = this._consumeOptional(TokenKind.AbstractKeyword);
    // TODO: Allow reserved keywords etc. to be class names as well.
    // TODO: Emit diagnostic if this is not TokenKind.Name but a reserved word etc.
    node.name = this._consume(TokenKind.Name);
    node.baseClause = this._parseClassBaseClause(node);
    node.members = this._parseClassMembers(node);

    return node;
  }

  _parseClassBaseClause(parent) {
    const colon = this._consumeOptional(TokenKind.ColonOperator);
    if (!colon) {
      return;
    }

    const node = new ClassBaseClauseNode();
    node.parent = parent;

    node.colon = colon;
    node.name = this._consume(TokenKind.Name);

    return node;
  }

  _parseClassMembers(parent) {
    const node = new ClassMembersNode();
    node.parent = parent;

    node.leftBrace = this._consume(TokenKind.LeftBraceDelimiter);
    node.members = this._parseElementList(node, ParseContext.ClassMembers);
    node.rightBrace = this._consume(TokenKind.RightBraceDelimiter);

    return node;
  }

  _parseClassMember(parent) {
    return this._parseStatement(parent);
  }

  /**
   * Parses the while statement.
   *
   * Example:
   * while ( condition ) { statement1 statementN }
   *
   * @param {Node} parent The parent node.
   * @returns {WhileStatementNode} The while statement node.
   */
  _parseWhileStatement(parent) {
    const node = new WhileStatementNode();
    node.parent = parent;

    node.whileKeyword = this._consume(TokenKind.WhileKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.condition = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.statements = this._parseCompoundStatement(node);

    return node;
  }

  _parseDoStatement(parent) {
    const node = new DoStatementNode();
    node.parent = parent;

    node.doKeyword = this._consume(TokenKind.DoKeyword);
    node.statements = this._parseCompoundStatement(node);
    node.whileKeyword = this._consume(TokenKind.WhileKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.condition = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseForStatement(parent) {
    const node = new ForStatementNode();
    node.parent = parent;

    node.forKeyword = this._consume(TokenKind.ForKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.initializer = this._parseExpression(node);
    node.semicolon1 = this._consume(TokenKind.SemicolonDelimiter);
    node.condition = this._parseExpression(node);
    node.semicolon2 = this._consume(TokenKind.SemicolonDelimiter);
    node.increment = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.statements = this._parseCompoundStatement(node);

    return node;
  }

  _parseFetchStatement(parent) {
    const node = new FetchStatementNode();
    node.parent = parent;

    node.fetchKeyword = this._consume(TokenKind.FetchKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.variable = this._parseExpression(node);
    node.comma1 = this._consume(TokenKind.CommaDelimiter);
    node.expression = this._parseExpression(node);
    node.comma2 = this._consume(TokenKind.CommaDelimiter);
    node.reach = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.statements = this._parseCompoundStatement(node);

    return node;
  }

  _parseVerbStatement(parent) {
    const node = new VerbStatementNode();
    node.parent = parent;

    // TODO: Or should we better use an ArgumentExpressionList instead?
    //  And do the error checking later?
    node.verbKeyword = this._consume(TokenKind.VerbKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.patternExpression = this._parseExpression(node);
    node.comma1 = this._consume(TokenKind.CommaDelimiter);
    node.actionExpression = this._parseExpression(node);
    node.comma2 = this._consume(TokenKind.CommaDelimiter);
    node.metaExpression = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseVariableOrFunctionDeclaration(parent) {
    // TODO: What if no name follows?
    // TODO: Should this be implemented as an element list instead?
    const delimiter = this._look(2);

    if (delimiter.kind === TokenKind.LeftParenDelimiter) {
      return this._parseFunctionDeclaration(parent);
    } else {
      return this._parseVariableDeclarationList(parent);
    }
  }

  _parseFunctionDeclaration(parent) {
    const node = new FunctionDeclarationNode();
    node.parent = parent;

    node.returnType = this._consumeChoice([
      TokenKind.VoidKeyword,
      TokenKind.IntKeyword,
      TokenKind.StringKeyword,
      TokenKind.ObjectKeyword
    ]);
    node.name = this._consume(TokenKind.Name);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.arguments = this._parseParameterDeclarationList(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.statements = this._parseCompoundStatement(node);

    return node;
  }

  _parseVariableDeclarationList(parent) {
    const node = new VariableDeclarationListNode();
    node.parent = parent;

    // TODO: Allow also reserved words, but emit an error when doing so.
    node.type = this._consumeChoice([
      TokenKind.IntKeyword,
      TokenKind.StringKeyword,
      TokenKind.ObjectKeyword
    ]);

    while (true) {
      const token = this.token;

      if (token.kind !== TokenKind.Name) {
        break;
      }

      const element = this._parseVariableDeclaration(node);
      node.addElement(element);

      const delimiter = this._consumeOptional(TokenKind.CommaDelimiter);
      if (!delimiter) {
        // TODO: Handle case where no delimiter, but another parameter declaration is following.
        break;
      }

      node.addElement(delimiter);
    }

    // TODO: Emit error when no variable defined.
    // if (node.elements.length === 0) {
    // }

    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseVariableDeclaration(parent) {
    const node = new VariableDeclarationNode();
    node.parent = parent;

    // TODO: Allow also reserved words, but emit an error when doing so.
    // TODO: Return null when no name given. This will abort the VariableDeclarationList parsing and emit an error.
    node.name = this._consume(TokenKind.Name);

    if (this.token.kind === TokenKind.LeftBracketDelimiter) {
      node.arrayDeclarationClause = this._parseArrayDeclarationClause(node);
    }

    if (this.token.kind === TokenKind.EqualsOperator) {
      node.variableInitializationClause = this._parseVariableInitializationClause(
        node
      );
    }

    return node;
  }

  _parseArrayDeclarationClause(parent) {
    const node = new ArrayDeclarationClauseNode();
    node.parent = parent;

    node.leftBracket = this._consume(TokenKind.LeftBracketDelimiter);

    const length = this._parseExpression(node);
    // TODO: Could be simplified using a MissingToken instead.
    if (length instanceof Token && length.error === TokenError.MissingToken) {
      length.kind = TokenKind.ArrayLength;
    }
    node.length = length;
    node.rightBracket = this._consume(TokenKind.RightBracketDelimiter);

    return node;
  }

  /**
   *
   * @param {VariableDeclarationNode} parent
   */
  _parseVariableInitializationClause(parent) {
    const node = new VariableInitializationClauseNode();
    node.parent = parent;

    node.equals = this._consume(TokenKind.EqualsOperator);

    if (parent.arrayDeclarationClause) {
      node.expression = this._parseArrayLiteral(node);
    } else {
      node.expression = this._parseExpression(node);
    }

    return node;
  }

  _parseArrayLiteral(parent) {
    const node = new ArrayLiteralNode();
    node.parent = parent;

    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);

    while (true) {
      const token = this.token;

      if (!this._isExpressionInitiator(token)) {
        break;
      }

      const element = this._parseExpression(node);
      node.addElement(element);

      const delimiter = this._consumeOptional(TokenKind.CommaDelimiter);
      if (!delimiter) {
        // TODO: Handle case where no delimiter, but another argument is following.
        break;
      }

      node.addElement(delimiter);
    }

    node.rightParen = this._consume(TokenKind.RightParenDelimiter);

    return node;
  }

  _parseIfStatement(parent) {
    const node = new IfStatementNode();
    node.parent = parent;

    node.ifKeyword = this._consume(TokenKind.IfKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.condition = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.statements = this._parseCompoundStatement(node);

    const token = this.token;
    if (token.kind === TokenKind.ElseKeyword) {
      node.elseClause = this._parseElseClause(node);
    }

    return node;
  }

  _parseElseClause(parent) {
    const node = new ElseClauseNode();
    node.parent = parent;

    node.elseKeyword = this._consume(TokenKind.ElseKeyword);
    node.statements = this._parseCompoundStatement(node);

    return node;
  }

  _parseReturnStatement(parent) {
    const node = new ReturnStatementNode();
    node.parent = parent;

    node.returnKeyword = this._consume(TokenKind.ReturnKeyword);
    if (this._isExpressionInitiator(this.token)) {
      node.expression = this._parseExpression(node);
    }
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseSwitchStatement(parent) {
    const node = new SwitchStatementNode();
    node.parent = parent;

    node.switchKeyword = this._consume(TokenKind.SwitchKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.expression = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.leftBrace = this._consume(TokenKind.LeftBraceDelimiter);
    node.statements = this._parseElementList(
      node,
      ParseContext.SwitchStatementElements
    );
    node.rightBrace = this._consume(TokenKind.RightBraceDelimiter);

    return node;
  }

  _parseSwitchStatementElement(parent) {
    switch (this.token.kind) {
      case TokenKind.CaseKeyword:
        return this._parseCaseStatement(parent);

      case TokenKind.DefaultKeyword:
        return this._parseDefaultStatement(parent);

      default:
        return new Token(
          token.start,
          0,
          TokenKind.CaseKeyword,
          [],
          TokenError.MissingToken
        );
    }
  }

  _parseCaseStatement(parent) {
    const node = new CaseStatementNode();
    node.parent = parent;

    node.caseKeyword = this._consume(TokenKind.CaseKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.expression = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);
    node.statements = this._parseElementList(
      node,
      ParseContext.CaseStatementElements
    );

    return node;
  }

  _parseDefaultStatement(parent) {
    const node = new DefaultStatementNode();
    node.parent = parent;

    node.defaultKeyword = this._consume(TokenKind.DefaultKeyword);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);
    node.statements = this._parseElementList(
      node,
      ParseContext.DefaultStatementElements
    );

    return node;
  }

  _parseQuitStatement(parent) {
    const node = new QuitStatementNode();
    node.parent = parent;

    node.quitKeyword = this._consume(TokenKind.QuitKeyword);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseHaltStatement(parent) {
    const node = new HaltStatementNode();
    node.parent = parent;

    node.haltKeyword = this._consume(TokenKind.HaltKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.expression = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseBreakStatement(parent) {
    const node = new BreakStatementNode();
    node.parent = parent;

    node.breakKeyword = this._consume(TokenKind.BreakKeyword);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseCompoundStatement(parent) {
    const node = new CompoundStatementNode();
    node.parent = parent;

    node.leftBrace = this._consume(TokenKind.LeftBraceDelimiter);
    node.statements = this._parseElementList(
      node,
      ParseContext.BlockStatements
    );
    node.rightBrace = this._consume(TokenKind.RightBraceDelimiter);

    return node;
  }

  /**
   * Parses an expression.
   *
   * @param {Node} parent The parent Node object.
   * @returns {Expression} The parsed Expression object.
   */
  _parseExpression(parent) {
    const token = this.token;

    if (token.kind === TokenKind.EndOfFile) {
      const kind = TokenKind.Expression;
      const error = TokenError.MissingToken;

      return new Token(token.start, 0, kind, [], error);
    }

    const expression = this._parseBinaryExpressionOrHigher(0, parent);
    return expression;
  }

  /**
   * Parses a primary expression part, i.e. names or literals.
   *
   * @param {Node} parent The parent node.
   * @returns {Node|Token} The parsed primary expression.
   */
  _parsePrimaryExpression(parent) {
    const token = this.token;

    switch (token.kind) {
      case TokenKind.Name:
      case TokenKind.SuperKeyword:
      case TokenKind.ThisKeyword:
        return this._parseVariable(parent);

      case TokenKind.NumberLiteral:
        return this._parseNumberLiteral(parent);

      case TokenKind.StringLiteral:
        return this._parseStringLiteral(parent);

      case TokenKind.LeftParenDelimiter:
        return this._parseParenthesizedExpression(parent);

      default:
        return new Token(
          token.start,
          0,
          TokenKind.Expression,
          [],
          TokenError.MissingToken
        );
    }
  }

  /**
   * Parses a variable.
   *
   * @param {Node} parent The parent node.
   * @returns {VariableNode} The parsed variable.
   */
  _parseVariable(parent) {
    const node = new VariableNode();
    node.parent = parent;

    // TODO: Set kind to Variable in order to be more specific?

    // TODO: Allow other reserved keywords here.
    node.name = this._consumeChoice([
      TokenKind.Name,
      TokenKind.SuperKeyword,
      TokenKind.ThisKeyword
    ]);

    return node;
  }

  /**
   * Parses a number.
   *
   * @param {Node} parent The parent node.
   * @returns {NumberLiteralNode} The parsed number literal.
   */
  _parseNumberLiteral(parent) {
    const node = new NumberLiteralNode();
    node.parent = parent;

    node.literal = this._consume(TokenKind.NumberLiteral);

    return node;
  }

  /**
   * Parses a string.
   *
   * @param {Node} parent The parent node.
   * @returns {StringLiteralNode} The parsed string literal.
   */
  _parseStringLiteral(parent) {
    const node = new StringLiteralNode();
    node.parent = parent;

    // TODO: Check if this is a template string and parse it accordingly.

    node.literal = this._consume(TokenKind.StringLiteral);

    return node;
  }

  _parseParenthesizedExpression(parent) {
    const node = new ParenthesizedExpressionNode();
    node.parent = parent;

    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.expression = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);

    return node;
  }

  /**
   * Parses a binary or ternary expression.
   *
   * @param {number} precedence The starting operator precedence.
   * @param {Node|null} parent The parent Node object.
   */
  _parseBinaryExpressionOrHigher(precedence, parent) {
    let leftOperand = this._parseUnaryExpressionOrHigher(parent);

    while (true) {
      const token = this.token;
      const precedenceAndAssociativity = this._getOperatorPrecedenceAndAssociativity(
        token.kind
      );

      const validPrecedence =
        precedenceAndAssociativity.associativity === OperatorAssociativity.Right
          ? precedenceAndAssociativity.precedence >= precedence
          : precedenceAndAssociativity.precedence > precedence;

      if (!validPrecedence) {
        break;
      }

      this._advance();

      leftOperand =
        token.kind === TokenKind.QuestionOperator
          ? this._parseTernaryExpression(leftOperand, token, parent)
          : this._parseBinaryExpression(
              leftOperand,
              token,
              this._parseBinaryExpressionOrHigher(
                precedenceAndAssociativity.precedence,
                null
              ),
              parent
            );
    }

    return leftOperand;
  }

  _parseBinaryExpression(leftOperand, operator, rightOperand, parent) {
    const node = new BinaryExpressionNode();
    node.parent = parent;

    leftOperand.parent = node;
    rightOperand.parent = node;

    node.leftOperand = leftOperand;
    node.operator = operator;
    node.rightOperand = rightOperand;

    return node;
  }

  _parseTernaryExpression(leftOperand, operator, parent) {
    const node = new TernaryExpressionNode();

    // In case `leftOperand` is e.g. a MissingToken.
    if (leftOperand instanceof Node) {
      node.parent = leftOperand.parent;
      leftOperand.parent = node;
    } else {
      node.parent = parent;
    }

    node.condition = leftOperand;
    node.question = operator;
    node.truthyExpression = this._parseExpression(node);
    node.colon = this._consume(TokenKind.ColonOperator);
    node.falsyExpression = this._parseExpression(node);

    return node;
  }

  /**
   * Parses a unary or binary expression.
   *
   * @param {Node|null} parent The parent Node object.
   */
  _parseUnaryExpressionOrHigher(parent) {
    const token = this.token;

    switch (token.kind) {
      case TokenKind.PlusOperator:
      case TokenKind.MinusOperator:
      case TokenKind.ExclamationOperator:
      case TokenKind.TildeOperator:
        return this._parseUnaryOperatorExpression(parent);

      case TokenKind.PlusPlusOperator:
      case TokenKind.MinusMinusOperator:
        return this._parsePrefixUpdateExpression(parent);

      default:
        const expression = this._parsePrimaryExpression();
        return this._parsePostfixExpression(expression);
    }
  }

  _parseUnaryOperatorExpression(parent) {
    const node = new UnaryOperatorExpressionNode();
    node.parent = parent;

    node.operator = this._consumeChoice([
      TokenKind.PlusOperator,
      TokenKind.MinusOperator,
      TokenKind.ExclamationOperator,
      TokenKind.TildeOperator
    ]);
    node.operand = this._parseUnaryExpressionOrHigher(node);

    return node;
  }

  _parsePrefixUpdateExpression(parent) {
    const node = new PrefixUpdateExpressionNode();
    node.parent = parent;

    node.operator = this._consumeChoice([
      TokenKind.PlusPlusOperator,
      TokenKind.MinusMinusOperator
    ]);

    // TODO: Parse postfix expression rest.
    node.operand = this._parsePrimaryExpression(node);

    return node;
  }

  _parsePostfixUpdateExpression(expression) {
    const node = new PostfixUpdateExpressionNode();
    node.parent = expression.parent;
    expression.parent = node;

    node.operand = expression;
    node.operator = this._consumeChoice([
      TokenKind.PlusPlusOperator,
      TokenKind.MinusMinusOperator
    ]);

    return node;
  }

  _parsePostfixExpression(expression) {
    const token = this.token;

    switch (token.kind) {
      case TokenKind.PlusPlusOperator:
      case TokenKind.MinusMinusOperator:
        return this._parsePostfixUpdateExpression(expression);

      case TokenKind.DotOperator:
        const memberAccessExpression = this._parseMemberAccess(expression);
        return this._parsePostfixExpression(memberAccessExpression);

      case TokenKind.LeftParenDelimiter:
        const callExpression = this._parseCallExpression(expression);
        return this._parsePostfixExpression(callExpression);

      case TokenKind.LeftBracketDelimiter:
        const arrayElementAccessExpression = this._parseArrayElementAccessExpression(
          expression
        );
        return this._parsePostfixExpression(arrayElementAccessExpression);

      default:
        return expression;
    }
  }

  _parseCallExpression(expression) {
    const node = new CallExpressionNode();
    node.parent = expression.parent;
    expression.parent = node;

    node.expression = expression;
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.arguments = this._parseArgumentExpressionList(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);

    return node;
  }

  _parseArrayElementAccessExpression(expression) {
    const node = new ArrayElementAccessExpressionNode();
    node.parent = expression.parent;
    expression.parent = node;

    node.expression = expression;
    node.leftBracket = this._consume(TokenKind.LeftBracketDelimiter);

    const index = this._parseExpression(node);
    // TODO: Could be simplified using a MissingToken instead.
    if (index instanceof Token && index.error === TokenError.MissingToken) {
      index.kind = TokenKind.ArrayElementIndex;
    }
    node.index = index;

    node.rightBracket = this._consume(TokenKind.RightBracketDelimiter);

    return node;
  }

  _parseArgumentExpressionList(parent) {
    const node = new ArgumentExpressionListNode();
    node.parent = parent;

    while (true) {
      const token = this.token;

      if (!this._isArgumentExpressionInitiator(token)) {
        break;
      }

      const element = this._parseArgumentExpression(node);
      node.addElement(element);

      const delimiter = this._consumeOptional(TokenKind.CommaDelimiter);
      if (!delimiter) {
        // TODO: Handle case where no delimiter, but another argument is following.
        break;
      }

      node.addElement(delimiter);
    }

    return node;
  }

  _isArgumentExpressionInitiator(token) {
    return this._isExpressionInitiator(token);
  }

  _parseArgumentExpression(parent) {
    const node = new ArgumentExpressionNode();
    node.parent = parent;

    node.argument = this._parseExpression(node);

    return node;
  }

  _parseParameterDeclarationList(parent) {
    const node = new ParameterDeclarationListNode();
    node.parent = parent;

    while (true) {
      const token = this.token;

      if (!this._isParameterDeclarationInitiator(token)) {
        break;
      }

      const element = this._parseParameterDeclaration(node);
      node.addElement(element);

      const delimiter = this._consumeOptional(TokenKind.CommaDelimiter);
      if (!delimiter) {
        // TODO: Handle case where no delimiter, but another parameter declaration is following.
        break;
      }

      node.addElement(delimiter);
    }

    return node;
  }

  _isParameterDeclarationInitiator(token) {
    // TODO: Allow other types, but spawn an error if encountered.
    switch (token.kind) {
      case TokenKind.IntKeyword:
      case TokenKind.StringKeyword:
      case TokenKind.ObjectKeyword:
        return true;

      default:
        return false;
    }
  }

  _parseParameterDeclaration(parent) {
    const node = new ParameterDeclarationNode();
    node.parent = parent;

    // TODO: Reduce redundancy with _isParameterDeclarationInitiator.
    // TODO: Allow other types, but spawn an error if encountered.
    node.type = this._consumeChoice([
      TokenKind.IntKeyword,
      TokenKind.StringKeyword,
      TokenKind.ObjectKeyword
    ]);
    node.name = this._consume(TokenKind.Name);

    return node;
  }

  _parseMemberAccess(expression) {
    const node = new MemberAccessExpressionNode();
    node.parent = expression.parent;
    expression.parent = node;

    node.expression = expression;
    node.dot = this._consume(TokenKind.DotOperator);
    node.member = this._parseMemberName();

    return node;
  }

  _parseMemberName() {
    const token = this.token;

    if (token.kind === TokenKind.Name) {
      this._advance();
      return token;
    } else {
      return new Token(
        token.start,
        0,
        TokenKind.MemberName,
        [],
        TokenError.MissingToken
      );
    }
  }

  /**
   * Parses an expression statement.
   *
   * @param {Node} parent The parent Node object.
   * @returns {ExpressionStatementNode} The parsed ExpressionStatementNode object.
   */
  _parseExpressionStatement(parent) {
    const node = new ExpressionStatementNode();
    node.parent = parent;

    node.expression = this._parseExpression(node);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _getOperatorPrecedenceAndAssociativity(kind) {
    const operatorPrecedenceAndAssociativity =
      OperatorPrecedenceAndAssociativityMap[kind];

    if (!operatorPrecedenceAndAssociativity) {
      return {
        precedence: -1,
        associativity: -1
      };
    }

    return operatorPrecedenceAndAssociativity;
  }
}

exports.Parser = Parser;
