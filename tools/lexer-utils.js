const { Lexer } = require("../src/floyd-lexer");
const { TokenKind } = require("../src/token-kind");

const arguments = process.argv;
if (arguments.length < 3) {
  console.log("USAGE: node lexer-utils.js <floyd-code>");
  return;
}

const document = arguments[2];
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

      return value;
    },
    2
  )
);
