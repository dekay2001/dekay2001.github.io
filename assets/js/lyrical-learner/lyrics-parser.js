/**
 * @file Lyrics Parser
 * @description Parses raw lyrics text into structured line objects
 */

/**
 * Parse lyrics text into structured line objects
 * @param {string} lyricsText - Raw lyrics text with newlines
 * @returns {Array<{text: string, lineNumber: number, isSection: boolean}>} Array of parsed line objects
 * @public
 */
export function parseLyrics(lyricsText) {
  if (!lyricsText || !lyricsText.trim()) {
    return [];
  }

  const lines = lyricsText.split('\n');
  const parsedLines = [];
  let lineNumber = 1;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      continue; // Skip empty lines
    }

    const isSection = _isSectionMarker(trimmedLine);
    
    parsedLines.push({
      text: trimmedLine,
      lineNumber: lineNumber,
      isSection: isSection
    });

    lineNumber++;
  }

  return parsedLines;
}

/**
 * Check if a line is a section marker (e.g., [VERSE], [CHORUS])
 * @param {string} line - The trimmed line text
 * @returns {boolean} True if line is a section marker
 * @private
 */
function _isSectionMarker(line) {
  // Section marker must start with '[' and end with ']'
  // and contain the entire line (not just part of it)
  return line.startsWith('[') && line.endsWith(']');
}

// CommonJS compatibility for Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseLyrics };
}
