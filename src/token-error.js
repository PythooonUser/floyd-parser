class TokenError {}

TokenError.UnexpectedEndOfFile = 0;
TokenError.UnknownToken = 1;
TokenError.MissingToken = 2;
TokenError.SkippedToken = 3;
TokenError.UnkownDirective = 4;

TokenError.TokenErrorMap = {
  [TokenError.UnexpectedEndOfFile]: "TokenError.UnexpectedEndOfFile",
  [TokenError.UnknownToken]: "TokenError.UnknownToken",
  [TokenError.MissingToken]: "TokenError.MissingToken",
  [TokenError.SkippedToken]: "TokenError.SkippedToken",
  [TokenError.UnkownDirective]: "TokenError.UnkownDirective"
};

exports.TokenError = TokenError;
