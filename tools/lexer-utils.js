const { Lexer } = require("../src/floyd-lexer");
const { TokenKind } = require("../src/token-kind");
const { TokenError } = require("../src/token-error");

const arguments = process.argv;
let document = "";

if (arguments.length < 3) {
  console.log("USAGE: node lexer-utils.js <floyd-code>\n");
} else {
  document = arguments[2];
}

const lexer = new Lexer();
lexer.reset(document);

let tokens = [];
let token = lexer.advance();

while (token) {
  tokens.push(token);
  token = lexer.advance();
}

console.log(
  JSON.stringify(
    tokens,
    (key, value) => {
      if (key === "kind") {
        return TokenKind.TokenKindMap[value];
      }

      if (key === "error") {
        const error = TokenError.TokenErrorMap[value];
        return error ? error : null;
      }

      return value;
    },
    2
  )
);
