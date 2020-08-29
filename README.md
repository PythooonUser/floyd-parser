# floyd-parser

![Continuous Integration Badge](https://github.com/pythooonuser/floyd-parser/workflows/Continuous%20Integration/badge.svg)

A parser for the programming language Floyd written in pure JavaScript.

## Installation

`$ npm install @pythooonuser/floyd-parser`

## Usage

```js
const parse = require("floyd-parser").parse;

const program = `int x;`;
const { ast, errors } = parse(program);
```

The parser also returns a list of imports that are mentioned via the `#include` directive. As the actual parsing process works with phases you need to parse each of the imports yourself and supply their scope to the next phase of parsing.

```js
const analyse = require("floyd-parser").analyse;

const { errors } = analyse(ast);
```

## Testing

```
$ npm ci
$ npm test
```

## Utils

You can use `$ node tools/lexer-utils.js <floyd-code>` to generate a JSON structure of Token objects from an input string. This can be used to feed into any lexer tests.
