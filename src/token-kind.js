/** Stores information about the kind of Token object. */
class TokenKind {}

// End Of File
TokenKind.EndOfFile = "TokenKind.EndOfFile";

// Unknown
TokenKind.UnknownToken = "TokenKind.UnknownToken";

// Whitespace Trivia
TokenKind.Whitespace = "TokenKind.Whitespace";

// Comment Trivia
TokenKind.SingleLineComment = "TokenKind.SingleLineComment";
TokenKind.MultiLineComment = "TokenKind.MultiLineComment";

// Directive Trivia
TokenKind.UnknownDirective = "TokenKind.UnknownDirective";
TokenKind.IncludeDirective = "TokenKind.IncludeDirective";
TokenKind.DefineDirective = "TokenKind.DefineDirective";
TokenKind.IfDirective = "TokenKind.IfDirective";
TokenKind.IfNotDirective = "TokenKind.IfNotDirective";
TokenKind.EndIfDirective = "TokenKind.EndIfDirective";

// Literals
TokenKind.StringLiteral = "TokenKind.StringLiteral";
TokenKind.NumberLiteral = "TokenKind.NumberLiteral";

// Keywords
TokenKind.Name = "TokenKind.Name";
TokenKind.VoidKeyword = "TokenKind.VoidKeyword";
TokenKind.IntKeyword = "TokenKind.IntKeyword";
TokenKind.StringKeyword = "TokenKind.StringKeyword";
TokenKind.ObjectKeyword = "TokenKind.ObjectKeyword";
TokenKind.ClassKeyword = "TokenKind.ClassKeyword";
TokenKind.AbstractKeyword = "TokenKind.AbstractKeyword";
TokenKind.IfKeyword = "TokenKind.IfKeyword";
TokenKind.ElseKeyword = "TokenKind.ElseKeyword";
TokenKind.SwitchKeyword = "TokenKind.SwitchKeyword";
TokenKind.CaseKeyword = "TokenKind.CaseKeyword";
TokenKind.DefaultKeyword = "TokenKind.DefaultKeyword";
TokenKind.BreakKeyword = "TokenKind.BreakKeyword";
TokenKind.ReturnKeyword = "TokenKind.ReturnKeyword";
TokenKind.HaltKeyword = "TokenKind.HaltKeyword";
TokenKind.DoKeyword = "TokenKind.DoKeyword";
TokenKind.WhileKeyword = "TokenKind.WhileKeyword";
TokenKind.ForKeyword = "TokenKind.ForKeyword";
TokenKind.QuitKeyword = "TokenKind.QuitKeyword";
TokenKind.SuperKeyword = "TokenKind.SuperKeyword";
TokenKind.VerbKeyword = "TokenKind.VerbKeyword";

// Operators
TokenKind.LessThanLessThanOperator = "TokenKind.LessThanLessThanOperator";
TokenKind.GreaterThanGreaterThanOperator =
  "TokenKind.GreaterThanGreaterThanOperator";
TokenKind.PlusPlusOperator = "TokenKind.PlusPlusOperator";
TokenKind.MinusMinusOperator = "TokenKind.MinusMinusOperator";
TokenKind.AmpersandAmpersandOperator = "TokenKind.AmpersandAmpersandOperator";
TokenKind.AmpersandOperator = "TokenKind.AmpersandOperator";
TokenKind.BarBarOperator = "TokenKind.BarBarOperator";
TokenKind.BarOperator = "TokenKind.BarOperator";
TokenKind.CaretOperator = "TokenKind.CaretOperator";
TokenKind.LessThanEqualsOperator = "TokenKind.LessThanEqualsOperator";
TokenKind.GreaterThanEqualsOperator = "TokenKind.GreaterThanEqualsOperator";
TokenKind.LessThanOperator = "TokenKind.LessThanOperator";
TokenKind.GreaterThanOperator = "TokenKind.GreaterThanOperator";
TokenKind.ExclamationEqualsOperator = "TokenKind.ExclamationEqualsOperator";
TokenKind.EqualsEqualsOperator = "TokenKind.EqualsEqualsOperator";
TokenKind.ExclamationOperator = "TokenKind.ExclamationOperator";
TokenKind.TildeOperator = "TokenKind.TildeOperator";
TokenKind.PercentEqualsOperator = "TokenKind.PercentEqualsOperator";
TokenKind.SlashEqualsOperator = "TokenKind.SlashEqualsOperator";
TokenKind.StarEqualsOperator = "TokenKind.StarEqualsOperator";
TokenKind.PlusEqualsOperator = "TokenKind.PlusEqualsOperator";
TokenKind.MinusEqualsOperator = "TokenKind.MinusEqualsOperator";
TokenKind.PlusOperator = "TokenKind.PlusOperator";
TokenKind.MinusOperator = "TokenKind.MinusOperator";
TokenKind.PercentOperator = "TokenKind.PercentOperator";
TokenKind.SlashOperator = "TokenKind.SlashOperator";
TokenKind.StarOperator = "TokenKind.StarOperator";
TokenKind.EqualsOperator = "TokenKind.EqualsOperator";
TokenKind.ColonOperator = "TokenKind.ColonOperator";
TokenKind.QuestionOperator = "TokenKind.QuestionOperator";
TokenKind.DotOperator = "TokenKind.DotOperator";

// Delimiters
TokenKind.LeftParenDelimiter = "TokenKind.LeftParenDelimiter";
TokenKind.RightParenDelimiter = "TokenKind.RightParenDelimiter";
TokenKind.LeftBraceDelimiter = "TokenKind.LeftBraceDelimiter";
TokenKind.RightBraceDelimiter = "TokenKind.RightBraceDelimiter";
TokenKind.LeftBracketDelimiter = "TokenKind.LeftBracketDelimiter";
TokenKind.RightBracketDelimiter = "TokenKind.RightBracketDelimiter";
TokenKind.CommaDelimiter = "TokenKind.CommaDelimiter";
TokenKind.SemicolonDelimiter = "TokenKind.SemicolonDelimiter";
TokenKind.SingleQuoteDelimiter = "TokenKind.SingleQuoteDelimiter";
TokenKind.DoubleQuoteDelimiter = "TokenKind.DoubleQuoteDelimiter";

// Meta Kinds
TokenKind.Expression = "TokenKind.Expression";
TokenKind.MemberName = "TokenKind.MemberName";
TokenKind.ArrayElementIndex = "TokenKind.ArrayElementIndex";

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
  super: TokenKind.SuperKeyword,
  verb: TokenKind.VerbKeyword
};

/** Provides a mapping from characters to operator TokenKind objects. */
TokenKind.OperatorTokenMap = {
  "<<": TokenKind.LessThanLessThanOperator,
  ">>": TokenKind.GreaterThanGreaterThanOperator,
  "++": TokenKind.PlusPlusOperator,
  "--": TokenKind.MinusMinusOperator,
  "&&": TokenKind.AmpersandAmpersandOperator,
  "&": TokenKind.AmpersandOperator,
  "||": TokenKind.BarBarOperator,
  "|": TokenKind.BarOperator,
  "^": TokenKind.CaretOperator,
  "<=": TokenKind.LessThanEqualsOperator,
  ">=": TokenKind.GreaterThanEqualsOperator,
  "<": TokenKind.LessThanOperator,
  ">": TokenKind.GreaterThanOperator,
  "!=": TokenKind.ExclamationEqualsOperator,
  "==": TokenKind.EqualsEqualsOperator,
  "!": TokenKind.ExclamationOperator,
  "~": TokenKind.TildeOperator,
  "%=": TokenKind.PercentEqualsOperator,
  "/=": TokenKind.SlashEqualsOperator,
  "*=": TokenKind.StarEqualsOperator,
  "+=": TokenKind.PlusEqualsOperator,
  "-=": TokenKind.MinusEqualsOperator,
  "+": TokenKind.PlusOperator,
  "-": TokenKind.MinusOperator,
  "%": TokenKind.PercentOperator,
  "/": TokenKind.SlashOperator,
  "*": TokenKind.StarOperator,
  "=": TokenKind.EqualsOperator,
  ":": TokenKind.ColonOperator,
  "?": TokenKind.QuestionOperator,
  ".": TokenKind.DotOperator
};

/** Provides a mapping from characters to delimiter TokenKind objects. */
TokenKind.DelimiterTokenMap = {
  "(": TokenKind.LeftParenDelimiter,
  ")": TokenKind.RightParenDelimiter,
  "{": TokenKind.LeftBraceDelimiter,
  "}": TokenKind.RightBraceDelimiter,
  "[": TokenKind.LeftBracketDelimiter,
  "]": TokenKind.RightBracketDelimiter,
  ",": TokenKind.CommaDelimiter,
  ";": TokenKind.SemicolonDelimiter,
  "'": TokenKind.SingleQuoteDelimiter,
  '"': TokenKind.DoubleQuoteDelimiter
};

/** Provides a mapping from characters to directive TokenKind objects. */
TokenKind.DirectiveTokenMap = {
  "#include": TokenKind.IncludeDirective,
  "#define": TokenKind.DefineDirective,
  "#ifdef": TokenKind.IfDirective,
  "#ifndef": TokenKind.IfNotDirective,
  "#endif": TokenKind.EndIfDirective
};

exports.TokenKind = TokenKind;
