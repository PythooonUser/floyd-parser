class TokenError {}

TokenError.UnexpectedEndOfFile = 0;
TokenError.UnknownToken = 1;
TokenError.MissingToken = 2;
TokenError.UnkownDirective = 3;

TokenError.TokenErrorMap = {
  [TokenError.UnexpectedEndOfFile]: "TokenError.UnexpectedEndOfFile",
  [TokenError.UnknownToken]: "TokenError.UnknownToken",
  [TokenError.MissingToken]: "TokenError.MissingToken",
  [TokenError.UnkownDirective]: "TokenError.UnkownDirective"
};

exports.TokenError = TokenError;
