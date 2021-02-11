const fs = require("fs");
const { Lexer } = require("../src/floyd-lexer");

const args = process.argv;
let document = "";
let outFileName = "";

if (args.length < 3) {
  console.log("USAGE: node lexer-utils.js <floyd-code>");
  console.log("USAGE: node lexer-utils.js <file>\n");
} else {
  if (args[2].endsWith(".floyd")) {
    document = fs.readFileSync(args[2], "utf-8");
    outFileName = args[2].replace(".floyd", ".floyd.json");
  } else {
    document = args[2];
  }
}

const lexer = new Lexer();
lexer.reset(document);

let tokens = [];
let token = lexer.advance();

while (token) {
  tokens.push(token);
  token = lexer.advance();
}

const json = JSON.stringify(tokens, null, 2);

if (outFileName) {
  fs.writeFileSync(outFileName, `${json}\n`);
  console.log(`Output written to: '${outFileName}'`);
} else {
  console.log(json);
}
