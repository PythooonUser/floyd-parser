const fs = require("fs");
const { Parser } = require("../src/floyd-parser");

const args = process.argv;
let document = "";
let outFileName = "";

if (args.length < 3) {
  console.log("USAGE: node parser-utils.js <floyd-code>");
  console.log("USAGE: node parser-utils.js <file>\n");
} else {
  if (args[2].endsWith(".floyd")) {
    document = fs.readFileSync(args[2], "utf-8");
    outFileName = args[2].replace(".floyd", ".floyd.json");
  } else {
    document = args[2];
  }
}

const parser = new Parser();
const node = parser.parseSourceDocument(document);

const json = JSON.stringify(
  node,
  function (key, value) {
    // TODO: Make trivia exclusion optional.
    if (["parent", "trivia", "document"].includes(key)) {
      return;
    }

    return value;
  },
  2
);

if (outFileName) {
  fs.writeFileSync(outFileName, `${json}\n`);
  console.log(`Output written to: '${outFileName}'`);
} else {
  console.log(json);
}
