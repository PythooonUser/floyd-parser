const { Token } = require("./token");
const { TokenError } = require("./token-error");
const { SourceDocumentNode } = require("./nodes/source-document-node");
const { Diagnostic } = require("./diagnostic");
const { getRangeFromPosition } = require("./position-utils");

class DiagnosticsProvider {
  constructor() {}

  /**
   * @param {SourceDocumentNode} ast
   */
  getDiagnostics(ast) {
    /** @type {Diagnostic} */
    let diagnostics = [];

    ast.walk(element => {
      if (element instanceof Token && element.error) {
        const diagnostic = this._createDiagnostic(element, ast.document);
        diagnostics.push(diagnostic);
      }
    });

    return diagnostics;
  }

  /**
   * @param {Token} token
   * @return {Diagnostic}
   */
  _createDiagnostic(token, document) {
    let message = "";

    switch (token.error) {
      case TokenError.MissingToken:
        message = `Expected ${token.kind}`;
        break;
      case TokenError.SkippedToken:
        message = `Unexpected ${token.kind}`;
        break;
      default:
        throw new Error(`Unexpected error kind ${token.error}`);
    }

    const range = getRangeFromPosition(token.start, token.length, document);
    const severity = 1;

    const diagnostic = new Diagnostic(message, range, severity);
    return diagnostic;
  }
}

exports.DiagnosticsProvider = DiagnosticsProvider;
