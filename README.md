# floyd-parser

![Continuous Integration Badge](https://github.com/pythooonuser/floyd-parser/workflows/Continuous%20Integration/badge.svg)

A parser for the programming language Floyd written in pure JavaScript. Designed for IDE usage.

## Installation

`$ npm install @pythooonuser/floyd-parser`

## Usage

Create a `Parser` instance, parse the source document and retrieve the abstract syntax tree. Errors can be converted to `Diagnostic` objects using the `DiagnosticsProvder`.

```js
const { Parser } = require("floyd-parser");
const {
  DiagnosticsProvider
} = require("floyd-parser/src/diagnostics-provider");

// Parse the source document and retrieve an abstract syntax tree.
const document = `int x;`;
const parser = new Parser();
const node = parser.parseSourceDocument(document);

// Generate diagnostics for the IDE.
const provider = new DiagnosticsProvider();
const diagnostics = provider.getDiagnostics(node);
```

## Testing

Install a clean version of this package first and then execute the integrated test suites.

```
$ npm ci
$ npm test
```

## Utils

You can use several utility programs to analyse the different implementation steps up close.

Use `$ node tools/lexer-utils.js <floyd-code>` to generate a JSON structure of `Token` objects from an input string. This can be used to feed into any lexer tests.

Use `$ node tools/parser-utils.js <floyd-code>` to generate a JSON structure of `Node` objects from an input string. This can be used to feed into any parser tests.

Use `$ node tools/diagnostics-utils.js <floyd-code>` to generate a JSON structure of `Diagnostic` objects from an input string.
