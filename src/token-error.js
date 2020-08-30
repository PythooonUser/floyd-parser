const { Token } = require("./token");

class TokenError {}

TokenError.UnexpectedEndOfFile = 0;

TokenError.TokenErrorMap = {
  [TokenError.UnexpectedEndOfFile]: "TokenError.UnexpectedEndOfFile"
};

exports.TokenError = TokenError;
