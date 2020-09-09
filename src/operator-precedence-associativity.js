const { TokenKind } = require("./token-kind");
const { OperatorAssociativity } = require("./operator-associativity");

exports.OperatorPrecedenceAndAssociativityMap = {
  // Assignment Expression
  [TokenKind.EqualsOperator]: {
    precedence: 1,
    associativity: OperatorAssociativity.Right
  },
  [TokenKind.PlusEqualsOperator]: {
    precedence: 1,
    associativity: OperatorAssociativity.Right
  },
  [TokenKind.MinusEqualsOperator]: {
    precedence: 1,
    associativity: OperatorAssociativity.Right
  },
  [TokenKind.StarEqualsOperator]: {
    precedence: 1,
    associativity: OperatorAssociativity.Right
  },
  [TokenKind.SlashEqualsOperator]: {
    precedence: 1,
    associativity: OperatorAssociativity.Right
  },
  [TokenKind.PercentEqualsOperator]: {
    precedence: 1,
    associativity: OperatorAssociativity.Right
  },

  // Conditional Expression
  [TokenKind.QuestionOperator]: {
    precedence: 2,
    associativity: OperatorAssociativity.Left
  },

  // Logical Expression
  [TokenKind.BarBarOperator]: {
    precedence: 3,
    associativity: OperatorAssociativity.Left
  },
  [TokenKind.AmpersandAmpersandOperator]: {
    precedence: 4,
    associativity: OperatorAssociativity.Left
  },

  // Binary Expression
  [TokenKind.BarOperator]: {
    precedence: 5,
    associativity: OperatorAssociativity.Left
  },
  [TokenKind.CaretOperator]: {
    precedence: 6,
    associativity: OperatorAssociativity.Left
  },
  [TokenKind.AmpersandOperator]: {
    precedence: 7,
    associativity: OperatorAssociativity.Left
  },

  // Equality Expression
  [TokenKind.EqualsEqualsOperator]: {
    precedence: 8,
    associativity: OperatorAssociativity.None
  },
  [TokenKind.ExclamationEqualsOperator]: {
    precedence: 8,
    associativity: OperatorAssociativity.None
  },

  // Relational Expression
  [TokenKind.LessThanEqualsOperator]: {
    precedence: 9,
    associativity: OperatorAssociativity.None
  },
  [TokenKind.GreaterThanEqualsOperator]: {
    precedence: 9,
    associativity: OperatorAssociativity.None
  },
  [TokenKind.LessThanOperator]: {
    precedence: 9,
    associativity: OperatorAssociativity.None
  },
  [TokenKind.GreaterThanOperator]: {
    precedence: 9,
    associativity: OperatorAssociativity.None
  },

  // Shift Expression
  [TokenKind.LessThanLessThanOperator]: {
    precedence: 10,
    associativity: OperatorAssociativity.Left
  },
  [TokenKind.GreaterThanGreaterThanOperator]: {
    precedence: 10,
    associativity: OperatorAssociativity.Left
  },

  // Additive Expression
  [TokenKind.PlusOperator]: {
    precedence: 11,
    associativity: OperatorAssociativity.Left
  },
  [TokenKind.MinusOperator]: {
    precedence: 11,
    associativity: OperatorAssociativity.Left
  },

  // Multiplicative Expression
  [TokenKind.StarOperator]: {
    precedence: 12,
    associativity: OperatorAssociativity.Left
  },
  [TokenKind.SlashOperator]: {
    precedence: 12,
    associativity: OperatorAssociativity.Left
  },
  [TokenKind.PercentOperator]: {
    precedence: 12,
    associativity: OperatorAssociativity.Left
  }
};
