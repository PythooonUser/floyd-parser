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

/** Generates an abstract syntax tree from a source document. */
class Parser {
  /** Creates a new Parser. */
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
   */
  _look(step = 1) {
    return this.lexer.look(step);
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
   * Returns the next token in the source document.
   *
   * @param {TokenKind[]} kinds The token kinds to match with the next token.
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
   * @return {ParseContext[]}
   */
  _getParseContextHistory() {
    return [ParseContext.SourceElements].concat(
      this.parseContexts.slice(0, -1)
    );
  }

  /**
   * @param {ParseContext} context
   */
  _setCurrentParseContext(context) {
    this.parseContexts.push(context);
  }

  _restorePreviousParseContext() {
    this.parseContexts.pop();
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

    let node = new SourceDocumentNode();
    node.statements = this._parseElementList(node, ParseContext.SourceElements);
    node.endOfFile = this._consume(TokenKind.EndOfFile);
    node.document = document;

    this._advance();
    return node;
  }

  /**
   * TODO
   * @param {ParseContext} context The element parse context.
   */
  _parseElementList(parent, context) {
    this._setCurrentParseContext(context);

    /** @type {Node[]} */
    let elementList = [];

    while (!this._isElementListTerminator(context, this.token)) {
      if (this._isElementListInitiator(context, this.token)) {
        const parser = this._getElementListParser(context);
        let element = parser(parent);
        elementList.push(element);
        continue;
      }

      if (this._isValidInEnclosingContexts(this.token)) {
        break;
      }

      let skippedToken = this.token;
      skippedToken.error = TokenError.SkippedToken;
      elementList.push(skippedToken);
      this._advance();
    }

    this._restorePreviousParseContext();

    return elementList;
  }

  /**
   * @param {Token} token
   * @return {boolean}
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
   * TODO
   * @param {ParseContext} context The element parse context.
   * @param {Token} token The token to be checked.
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
   * TODO
   * @param {Token} token The token to be checked.
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

  // TODO: Description
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
    let node = new ClassDeclarationNode();
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

    let node = new ClassBaseClauseNode();
    node.parent = parent;

    node.colon = colon;
    node.name = this._consume(TokenKind.Name);

    return node;
  }

  _parseClassMembers(parent) {
    let node = new ClassMembersNode();
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
   * while ( condition ) { statements...; }
   *
   * @param {Node} parent The parent node.
   * @return {WhileStatementNode} The while statement node.
   */
  _parseWhileStatement(parent) {
    let node = new WhileStatementNode();
    node.parent = parent;

    node.whileKeyword = this._consume(TokenKind.WhileKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.condition = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.statements = this._parseCompoundStatement(node);

    return node;
  }

  _parseDoStatement(parent) {
    let node = new DoStatementNode();
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
    let node = new ForStatementNode();
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
    let node = new FetchStatementNode();
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
    let node = new VerbStatementNode();
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
    let node = new FunctionDeclarationNode();
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
    let node = new VariableDeclarationListNode();
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
    let node = new VariableDeclarationNode();
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
    let node = new ArrayDeclarationClauseNode();
    node.parent = parent;

    node.leftBracket = this._consume(TokenKind.LeftBracketDelimiter);

    let length = this._parseExpression(node);
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
    let node = new VariableInitializationClauseNode();
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
    let node = new ArrayLiteralNode();
    node.parent = parent;

    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);

    while (true) {
      let token = this.token;

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
    let node = new IfStatementNode();
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
    let node = new ElseClauseNode();
    node.parent = parent;

    node.elseKeyword = this._consume(TokenKind.ElseKeyword);
    node.statements = this._parseCompoundStatement(node);

    return node;
  }

  _parseReturnStatement(parent) {
    let node = new ReturnStatementNode();
    node.parent = parent;

    node.returnKeyword = this._consume(TokenKind.ReturnKeyword);
    if (this._isExpressionInitiator(this.token)) {
      node.expression = this._parseExpression(node);
    }
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseSwitchStatement(parent) {
    let node = new SwitchStatementNode();
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
        const kind = TokenKind.CaseKeyword;
        const error = TokenError.MissingToken;

        return new Token(token.start, 0, kind, [], error);
    }
  }

  _parseCaseStatement(parent) {
    let node = new CaseStatementNode();
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
    let node = new DefaultStatementNode();
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
    let node = new QuitStatementNode();
    node.parent = parent;

    node.quitKeyword = this._consume(TokenKind.QuitKeyword);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseHaltStatement(parent) {
    let node = new HaltStatementNode();
    node.parent = parent;

    node.haltKeyword = this._consume(TokenKind.HaltKeyword);
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.expression = this._parseExpression(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseBreakStatement(parent) {
    let node = new BreakStatementNode();
    node.parent = parent;

    node.breakKeyword = this._consume(TokenKind.BreakKeyword);
    node.semicolon = this._consume(TokenKind.SemicolonDelimiter);

    return node;
  }

  _parseCompoundStatement(parent) {
    let node = new CompoundStatementNode();
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
   * @return {Expression} The parsed Expression object.
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
   * @return {Node|Token} The parsed primary expression.
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
        const kind = TokenKind.Expression;
        const error = TokenError.MissingToken;

        return new Token(token.start, 0, kind, [], error);
    }
  }

  /**
   * Parses a variable.
   *
   * @param {Node} parent The parent node.
   * @return {VariableNode} The parsed variable.
   */
  _parseVariable(parent) {
    let node = new VariableNode();
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
   * @return {NumberLiteralNode} The parsed number literal.
   */
  _parseNumberLiteral(parent) {
    let node = new NumberLiteralNode();
    node.parent = parent;

    node.literal = this._consume(TokenKind.NumberLiteral);

    return node;
  }

  /**
   * Parses a string.
   *
   * @param {Node} parent The parent node.
   * @return {StringLiteralNode} The parsed string literal.
   */
  _parseStringLiteral(parent) {
    let node = new StringLiteralNode();
    node.parent = parent;

    // TODO: Check if this is a template string and parse it accordingly.

    node.literal = this._consume(TokenKind.StringLiteral);

    return node;
  }

  _parseParenthesizedExpression(parent) {
    let node = new ParenthesizedExpressionNode();
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
    let node = new BinaryExpressionNode();
    node.parent = parent;

    leftOperand.parent = node;
    rightOperand.parent = node;

    node.leftOperand = leftOperand;
    node.operator = operator;
    node.rightOperand = rightOperand;

    return node;
  }

  _parseTernaryExpression(leftOperand, operator, parent) {
    let node = new TernaryExpressionNode();

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
    let node = new UnaryOperatorExpressionNode();
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
    let node = new PrefixUpdateExpressionNode();
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
    let node = new PostfixUpdateExpressionNode();
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
    let node = new CallExpressionNode();
    node.parent = expression.parent;
    expression.parent = node;

    node.expression = expression;
    node.leftParen = this._consume(TokenKind.LeftParenDelimiter);
    node.arguments = this._parseArgumentExpressionList(node);
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);

    return node;
  }

  _parseArrayElementAccessExpression(expression) {
    let node = new ArrayElementAccessExpressionNode();
    node.parent = expression.parent;
    expression.parent = node;

    node.expression = expression;
    node.leftBracket = this._consume(TokenKind.LeftBracketDelimiter);

    let index = this._parseExpression(node);
    // TODO: Could be simplified using a MissingToken instead.
    if (index instanceof Token && index.error === TokenError.MissingToken) {
      index.kind = TokenKind.ArrayElementIndex;
    }
    node.index = index;

    node.rightBracket = this._consume(TokenKind.RightBracketDelimiter);

    return node;
  }

  _parseArgumentExpressionList(parent) {
    let node = new ArgumentExpressionListNode();
    node.parent = parent;

    while (true) {
      let token = this.token;

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
    let node = new ArgumentExpressionNode();
    node.parent = parent;

    node.argument = this._parseExpression(node);

    return node;
  }

  _parseParameterDeclarationList(parent) {
    let node = new ParameterDeclarationListNode();
    node.parent = parent;

    while (true) {
      let token = this.token;

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
    let node = new ParameterDeclarationNode();
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
    let node = new MemberAccessExpressionNode();
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
      const kind = TokenKind.MemberName;
      const error = TokenError.MissingToken;

      return new Token(token.start, 0, kind, [], error);
    }
  }

  /**
   * Parses an expression statement.
   *
   * @param {Node} parent The parent Node object.
   * @return {ExpressionStatementNode} The parsed ExpressionStatementNode object.
   */
  _parseExpressionStatement(parent) {
    let node = new ExpressionStatementNode();
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
