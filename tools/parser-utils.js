const { Parser } = require("../src/floyd-parser");

const arguments = process.argv;
let document = "";

if (arguments.length < 3) {
  console.log("USAGE: node parser-utils.js <floyd-code>\n");
} else {
  document = arguments[2];
}

const parser = new Parser();
const node = parser.parseSourceDocument(document);

console.log(
  JSON.stringify(
    node,
    function (key, value) {
      // TODO: Make trivia exclusion optional.
      if (key === "parent" || key === "trivia") {
        return;
      }

      return value;
    },
    2
  )
);
