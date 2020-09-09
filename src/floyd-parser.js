const { Lexer } = require("./floyd-lexer");

const { Token } = require("./token");
const { TokenError } = require("./token-error");
const { TokenKind } = require("./token-kind");

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
const {
  ExpressionStatementNode
} = require("./nodes/expression-statement-node");
const { VerbStatementNode } = require("./nodes/verb-statement-node");

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
        return kind === TokenKind.RightBraceDelimiter;
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
      case ParseContext.ClassMembers:
        return this._isClassMemberDeclarationInitiator(token);
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
      case TokenKind.VerbKeyword:
        return true;
      default:
        return this._isExpressionInitiator(token);
    }
  }

  // TODO: Description
  _isExpressionInitiator(token) {
    switch (token.kind) {
      case TokenKind.Name:
      case TokenKind.PlusOperator:
      case TokenKind.PlusPlusOperator:
      case TokenKind.MinusMinusOperator:
      case TokenKind.LeftParenDelimiter:
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
        return this._parseStatement.bind(this);
      case ParseContext.ClassMembers:
        return this._parseClassMember.bind(this);
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
      case TokenKind.VerbKeyword:
        return this._parseVerbStatement(parent);
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
    const kind = this.token.kind;

    // TODO: Check if we want to declare a property, or a method.
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
    // node.condition = TODO: Parse expression.
    node.rightParen = this._consume(TokenKind.RightParenDelimiter);

    node.leftBrace = this._consume(TokenKind.LeftBraceDelimiter);
    // node.statements = this._parseStatement(node); TODO: Make this a list?
    node.rightBrace = this._consume(TokenKind.RightBraceDelimiter);

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
    node.name = this._consume(TokenKind.Name);

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

      const rightOperand = this._parseBinaryExpressionOrHigher(
        precedenceAndAssociativity.precedence,
        null
      );

      leftOperand = this._parseBinaryExpression(
        leftOperand,
        token,
        rightOperand,
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
        // TODO: Parse expression and postfix rest.
        return this._parsePrimaryExpression();
    }
  }

  _parseUnaryOperatorExpression(parent) {
    let node = new UnaryOperatorExpressionNode();
    node.parent = parent;

    node.operator = this._consumeChoice([
      TokenKind.PlusOperator,
      TokenKind.MinusOperator,
      TokenKind.ExclamationOperator
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

  _parsePostfixExpression(expression) {
    const token = this.token;

    switch (token.kind) {
      case TokenKind.DotOperator:
        // TODO: Parse postfix expression rest.
        const memberAccess = this._parseMemberAccess(expression);
        return this._parsePostfixExpression(memberAccess);

      case TokenKind.LeftParenDelimiter:
        return this._parseCallExpression(expression);

      default:
        break;
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
    let node = new ArgumentExpression();
    node.parent = parent;

    node.argument = this._parseExpression(node);

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
