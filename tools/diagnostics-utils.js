const fs = require("fs");
const { Parser } = require("../src/floyd-parser");
const { DiagnosticsProvider } = require("../src/diagnostics-provider");

const arguments = process.argv;
let document = "";
document = fs.readFileSync("test.floyd", "utf-8");

if (arguments.length < 3) {
  console.log("USAGE: node diagnostics-utils.js <floyd-code>\n");
} else {
  document = arguments[2];
}

const parser = new Parser();
const node = parser.parseSourceDocument(document);

const provider = new DiagnosticsProvider();
const diagnostics = provider.getDiagnostics(node);

console.log(JSON.stringify(diagnostics, null, 2));
