/** Stores information about the kind of Token object. */
class TokenKind {}

TokenKind.EndOfFile = 0;
TokenKind.UnknownToken = 1;

TokenKind.Whitespace = 2;
TokenKind.SingleLineComment = 3;
TokenKind.MultiLineComment = 4;

TokenKind.StringLiteral = 5;
TokenKind.NumberLiteral = 6;

// Keywords
TokenKind.Name = 100;

TokenKind.VoidKeyword = 101;
TokenKind.IntKeyword = 102;
TokenKind.StringKeyword = 103;
TokenKind.ObjectKeyword = 104;
TokenKind.ClassKeyword = 105;

// Modifiers
TokenKind.AbstractKeyword = 106;

// Control Flow
TokenKind.IfKeyword = 107;
TokenKind.ElseKeyword = 108;
TokenKind.SwitchKeyword = 109;
TokenKind.CaseKeyword = 110;
TokenKind.DefaultKeyword = 111;
TokenKind.BreakKeyword = 112;
TokenKind.ReturnKeyword = 113;
TokenKind.HaltKeyword = 114;
TokenKind.DoKeyword = 115;
TokenKind.WhileKeyword = 116;
TokenKind.ForKeyword = 117;
TokenKind.QuitKeyword = 118;

TokenKind.SuperKeyword = 119;

// Operators
TokenKind.BinaryLeftShiftOperator = 200;
TokenKind.BinaryRightShiftOperator = 201;
TokenKind.IncrementOperator = 202;
TokenKind.DecrementOperator = 203;
TokenKind.AndOperator = 204;
TokenKind.BinaryAndOperator = 205;
TokenKind.OrOperator = 206;
TokenKind.BinaryOrOperator = 207;
TokenKind.BinaryXorOperator = 208;
TokenKind.LessThanOrEqualOperator = 209;
TokenKind.GreaterThanOrEqualOperator = 210;
TokenKind.LessThanOperator = 211;
TokenKind.GreaterThanOperator = 212;
TokenKind.NotEqualOperator = 213;
TokenKind.EqualOperator = 214;
TokenKind.NotOperator = 215;
TokenKind.BinaryNotOperator = 216; // Also attribute negating operator.
TokenKind.ModuloAssignmentOperator = 217;
TokenKind.DivisionAssignmentOperator = 218;
TokenKind.MultiplicationAssignmentOperator = 219;
TokenKind.AdditionAssignmentOperator = 220;
TokenKind.SubtractionAssignmentOperator = 221;
TokenKind.AdditionOperator = 222;
TokenKind.SubtractionOperator = 223;
TokenKind.ModuloOperator = 224;
TokenKind.DivisionOperator = 225;
TokenKind.MultiplicationOperator = 226;
TokenKind.AssignmentOperator = 227;
TokenKind.ColonOperator = 228;
TokenKind.QuestionMarkOperator = 229;
TokenKind.DotOperator = 230;

// Delimiters
TokenKind.LeftParen = 300;
TokenKind.RightParen = 301;
TokenKind.LeftBrace = 302;
TokenKind.RightBrace = 303;
TokenKind.LeftBracket = 304;
TokenKind.RightBracket = 305;
TokenKind.Comma = 306;
TokenKind.Semicolon = 307;
TokenKind.SingleQuote = 308;
TokenKind.DoubleQuote = 309;

// Directives
TokenKind.UnknownDirectiveKeyword = 400;

TokenKind.IncludeDirectiveKeyword = 401;
TokenKind.DefineDirectiveKeyword = 402;
TokenKind.IfDirectiveKeyword = 403;
TokenKind.IfNotDirectiveKeyword = 404;
TokenKind.EndIfDirectiveKeyword = 405;

/** Provides a mapping from characters to keyword TokenKind objects. */
TokenKind.KeywordTokenMap = {
  void: TokenKind.VoidKeyword,
  int: TokenKind.IntKeyword,
  string: TokenKind.StringKeyword,
  object: TokenKind.ObjectKeyword,
  class: TokenKind.ClassKeyword,
  abstract: TokenKind.AbstractKeyword,
  if: TokenKind.IfKeyword,
  else: TokenKind.ElseKeyword,
  switch: TokenKind.SwitchKeyword,
  case: TokenKind.CaseKeyword,
  default: TokenKind.DefaultKeyword,
  break: TokenKind.BreakKeyword,
  return: TokenKind.ReturnKeyword,
  halt: TokenKind.HaltKeyword,
  do: TokenKind.DoKeyword,
  while: TokenKind.WhileKeyword,
  for: TokenKind.ForKeyword,
  quit: TokenKind.QuitKeyword,
  super: TokenKind.SuperKeyword
};

/** Provides a mapping from characters to operator TokenKind objects. */
TokenKind.OperatorTokenMap = {
  "<<": TokenKind.BinaryLeftShiftOperator,
  ">>": TokenKind.BinaryRightShiftOperator,
  "++": TokenKind.IncrementOperator,
  "--": TokenKind.DecrementOperator,
  "&&": TokenKind.AndOperator,
  "&": TokenKind.BinaryAndOperator,
  "||": TokenKind.OrOperator,
  "|": TokenKind.BinaryOrOperator,
  "^": TokenKind.BinaryXorOperator,
  "<=": TokenKind.LessThanOrEqualOperator,
  ">=": TokenKind.GreaterThanOrEqualOperator,
  "<": TokenKind.LessThanOperator,
  ">": TokenKind.GreaterThanOperator,
  "!=": TokenKind.NotEqualOperator,
  "==": TokenKind.EqualOperator,
  "!": TokenKind.NotOperator,
  "~": TokenKind.BinaryNotOperator, // Also attribute negating operator.
  "%=": TokenKind.ModuloAssignmentOperator,
  "/=": TokenKind.DivisionAssignmentOperator,
  "*=": TokenKind.MultiplicationAssignmentOperator,
  "+=": TokenKind.AdditionAssignmentOperator,
  "-=": TokenKind.SubtractionAssignmentOperator,
  "+": TokenKind.AdditionOperator,
  "-": TokenKind.SubtractionOperator,
  "%": TokenKind.ModuloOperator,
  "/": TokenKind.DivisionOperator,
  "*": TokenKind.MultiplicationOperator,
  "=": TokenKind.AssignmentOperator,
  ":": TokenKind.ColonOperator,
  "?": TokenKind.QuestionMarkOperator,
  ".": TokenKind.DotOperator
};

/** Provides a mapping from characters to delimiter TokenKind objects. */
TokenKind.DelimiterTokenMap = {
  "(": TokenKind.LeftParen,
  ")": TokenKind.RightParen,
  "{": TokenKind.LeftBrace,
  "}": TokenKind.RightBrace,
  "[": TokenKind.LeftBracket,
  "]": TokenKind.RightBracket,
  ",": TokenKind.Comma,
  ";": TokenKind.Semicolon,
  "'": TokenKind.SingleQuote, // Technically not part of language spec.
  '"': TokenKind.DoubleQuote
};

/** Provides a mapping from characters to directive TokenKind objects. */
TokenKind.DirectiveTokenMap = {
  "#include": TokenKind.IncludeDirectiveKeyword,
  "#define": TokenKind.DefineDirectiveKeyword,
  "#ifdef": TokenKind.IfDirectiveKeyword,
  "#ifndef": TokenKind.IfNotDirectiveKeyword,
  "#endif": TokenKind.EndIfDirectiveKeyword
};

TokenKind.TokenKindMap = {
  [TokenKind.EndOfFile]: "TokenKind.EndOfFile",
  [TokenKind.UnknownToken]: "TokenKind.UnknownToken",
  [TokenKind.Whitespace]: "TokenKind.Whitespace",
  [TokenKind.SingleLineComment]: "TokenKind.SingleLineComment",
  [TokenKind.MultiLineComment]: "TokenKind.MultiLineComment",
  [TokenKind.StringLiteral]: "TokenKind.StringLiteral",
  [TokenKind.NumberLiteral]: "TokenKind.NumberLiteral",
  [TokenKind.Name]: "TokenKind.Name",
  [TokenKind.VoidKeyword]: "TokenKind.VoidKeyword",
  [TokenKind.IntKeyword]: "TokenKind.IntKeyword",
  [TokenKind.StringKeyword]: "TokenKind.StringKeyword",
  [TokenKind.ObjectKeyword]: "TokenKind.ObjectKeyword",
  [TokenKind.ClassKeyword]: "TokenKind.ClassKeyword",
  [TokenKind.AbstractKeyword]: "TokenKind.AbstractKeyword",
  [TokenKind.IfKeyword]: "TokenKind.IfKeyword",
  [TokenKind.ElseKeyword]: "TokenKind.ElseKeyword",
  [TokenKind.SwitchKeyword]: "TokenKind.SwitchKeyword",
  [TokenKind.CaseKeyword]: "TokenKind.CaseKeyword",
  [TokenKind.DefaultKeyword]: "TokenKind.DefaultKeyword",
  [TokenKind.BreakKeyword]: "TokenKind.BreakKeyword",
  [TokenKind.ReturnKeyword]: "TokenKind.ReturnKeyword",
  [TokenKind.HaltKeyword]: "TokenKind.HaltKeyword",
  [TokenKind.DoKeyword]: "TokenKind.DoKeyword",
  [TokenKind.WhileKeyword]: "TokenKind.WhileKeyword",
  [TokenKind.ForKeyword]: "TokenKind.ForKeyword",
  [TokenKind.QuitKeyword]: "TokenKind.QuitKeyword",
  [TokenKind.SuperKeyword]: "TokenKind.SuperKeyword",
  [TokenKind.BinaryLeftShiftOperator]: "TokenKind.BinaryLeftShiftOperator",
  [TokenKind.BinaryRightShiftOperator]: "TokenKind.BinaryRightShiftOperator",
  [TokenKind.IncrementOperator]: "TokenKind.IncrementOperator",
  [TokenKind.DecrementOperator]: "TokenKind.DecrementOperator",
  [TokenKind.AndOperator]: "TokenKind.AndOperator",
  [TokenKind.BinaryAndOperator]: "TokenKind.BinaryAndOperator",
  [TokenKind.OrOperator]: "TokenKind.OrOperator",
  [TokenKind.BinaryOrOperator]: "TokenKind.BinaryOrOperator",
  [TokenKind.BinaryXorOperator]: "TokenKind.BinaryXorOperator",
  [TokenKind.LessThanOrEqualOperator]: "TokenKind.LessThanOrEqualOperator",
  [TokenKind.GreaterThanOrEqualOperator]:
    "TokenKind.GreaterThanOrEqualOperator",
  [TokenKind.LessThanOperator]: "TokenKind.LessThanOperator",
  [TokenKind.GreaterThanOperator]: "TokenKind.GreaterThanOperator",
  [TokenKind.NotEqualOperator]: "TokenKind.NotEqualOperator",
  [TokenKind.EqualOperator]: "TokenKind.EqualOperator",
  [TokenKind.NotOperator]: "TokenKind.NotOperator",
  [TokenKind.BinaryNotOperator]: "TokenKind.BinaryNotOperator", // Also attribute negating operator.
  [TokenKind.ModuloAssignmentOperator]: "TokenKind.ModuloAssignmentOperator",
  [TokenKind.DivisionAssignmentOperator]:
    "TokenKind.DivisionAssignmentOperator",
  [TokenKind.MultiplicationAssignmentOperator]:
    "TokenKind.MultiplicationAssignmentOperator",
  [TokenKind.AdditionAssignmentOperator]:
    "TokenKind.AdditionAssignmentOperator",
  [TokenKind.SubtractionAssignmentOperator]:
    "TokenKind.SubtractionAssignmentOperator",
  [TokenKind.AdditionOperator]: "TokenKind.AdditionOperator",
  [TokenKind.SubtractionOperator]: "TokenKind.SubtractionOperator",
  [TokenKind.ModuloOperator]: "TokenKind.ModuloOperator",
  [TokenKind.DivisionOperator]: "TokenKind.DivisionOperator",
  [TokenKind.MultiplicationOperator]: "TokenKind.MultiplicationOperator",
  [TokenKind.AssignmentOperator]: "TokenKind.AssignmentOperator",
  [TokenKind.ColonOperator]: "TokenKind.ColonOperator",
  [TokenKind.QuestionMarkOperator]: "TokenKind.QuestionMarkOperator",
  [TokenKind.DotOperator]: "TokenKind.DotOperator",
  [TokenKind.LeftParen]: "TokenKind.LeftParen",
  [TokenKind.RightParen]: "TokenKind.RightParen",
  [TokenKind.LeftBrace]: "TokenKind.LeftBrace",
  [TokenKind.RightBrace]: "TokenKind.RightBrace",
  [TokenKind.LeftBracket]: "TokenKind.LeftBracket",
  [TokenKind.RightBracket]: "TokenKind.RightBracket",
  [TokenKind.Comma]: "TokenKind.Comma",
  [TokenKind.Semicolon]: "TokenKind.Semicolon",
  [TokenKind.SingleQuote]: "TokenKind.SingleQuote",
  [TokenKind.DoubleQuote]: "TokenKind.DoubleQuote",
  [TokenKind.UnknownDirectiveKeyword]: "TokenKind.UnknownDirectiveKeyword",
  [TokenKind.IncludeDirectiveKeyword]: "TokenKind.IncludeDirectiveKeyword",
  [TokenKind.DefineDirectiveKeyword]: "TokenKind.DefineDirectiveKeyword",
  [TokenKind.IfDirectiveKeyword]: "TokenKind.IfDirectiveKeyword",
  [TokenKind.IfNotDirectiveKeyword]: "TokenKind.IfNotDirectiveKeyword",
  [TokenKind.EndIfDirectiveKeyword]: "TokenKind.EndIfDirectiveKeyword"
};

exports.TokenKind = TokenKind;
