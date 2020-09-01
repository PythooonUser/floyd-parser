const { Token } = require("./token");

class TokenError {}

TokenError.UnexpectedEndOfFile = 0;
TokenError.UnknownToken = 1;
TokenError.UnkownDirective = 2;

TokenError.TokenErrorMap = {
  [TokenError.UnexpectedEndOfFile]: "TokenError.UnexpectedEndOfFile",
  [TokenError.UnknownToken]: "TokenError.UnknownToken",
  [TokenError.UnkownDirective]: "TokenError.UnkownDirective"
};

exports.TokenError = TokenError;
