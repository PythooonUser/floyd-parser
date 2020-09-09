const { Lexer } = require("../src/floyd-lexer");

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

console.log(JSON.stringify(tokens, null, 2));
