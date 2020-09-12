const getRangeFromPosition = (position, length, document) => {
  const start = getLineCharacterFromPosition(position, document);
  const end = getLineCharacterFromPosition(position + length, document);

  return { start, end };
};

/**
 * @param {number} position
 * @param {string} document
 */
const getLineCharacterFromPosition = (position, document) => {
  const documentLength = document.length;

  if (position > documentLength) {
    position = documentLength;
  } else if (position < 0) {
    position = 0;
  }

  const previousNewlineIndex = document.lastIndexOf("\n", position);
  const character =
    previousNewlineIndex === -1
      ? position - 1
      : position - previousNewlineIndex - 1;

  const line = document.slice(0, position).split("\n").length - 1;

  return { line, character };
};

exports.getRangeFromPosition = getRangeFromPosition;
