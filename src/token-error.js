const { Token } = require("./token");

class TokenError {}

TokenError.UnexpectedEndOfFile = 0;
TokenError.UnknownToken = 1;

TokenError.TokenErrorMap = {
  [TokenError.UnexpectedEndOfFile]: "TokenError.UnexpectedEndOfFile",
  [TokenError.UnknownToken]: "TokenError.UnknownToken"
};

exports.TokenError = TokenError;
