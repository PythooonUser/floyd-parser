class Diagnostic {
  /**
   * @param {string} message
   * @param {any} range {start: { line: 0, character: 0}, end: { line: 0, character: 0 }}
   * @param {number} severity 1: Error, 2: Warning, 3: Information, 4: Hint
   */
  constructor(message, range, severity) {
    this.message = message;
    this.range = range;
    this.severity = severity;
  }
}

exports.Diagnostic = Diagnostic;
