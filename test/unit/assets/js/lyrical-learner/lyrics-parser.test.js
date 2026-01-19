/**
 * @jest-environment jsdom
 */

const { parseLyrics } = require('../../../../../assets/js/lyrical-learner/lyrics-parser.js');

describe('parseLyrics', () => {
  describe('basic parsing', () => {
    test('should parse simple lyrics into lines', () => {
      const lyrics = 'Line one\nLine two\nLine three';
      
      const result = parseLyrics(lyrics);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ text: 'Line one', lineNumber: 1, isSection: false });
      expect(result[1]).toEqual({ text: 'Line two', lineNumber: 2, isSection: false });
      expect(result[2]).toEqual({ text: 'Line three', lineNumber: 3, isSection: false });
    });

    test('should filter out empty lines', () => {
      const lyrics = 'Line one\n\n\nLine two\n\nLine three';
      
      const result = parseLyrics(lyrics);
      
      expect(result).toHaveLength(3);
      expect(result[0].text).toBe('Line one');
      expect(result[1].text).toBe('Line two');
      expect(result[2].text).toBe('Line three');
    });

    test('should trim whitespace from lines', () => {
      const lyrics = '  Line one  \n\t\tLine two\t\t\n   Line three   ';
      
      const result = parseLyrics(lyrics);
      
      expect(result[0].text).toBe('Line one');
      expect(result[1].text).toBe('Line two');
      expect(result[2].text).toBe('Line three');
    });

    test('should handle empty input', () => {
      const result = parseLyrics('');
      
      expect(result).toEqual([]);
    });

    test('should handle whitespace-only input', () => {
      const result = parseLyrics('   \n\n\t\t\n   ');
      
      expect(result).toEqual([]);
    });
  });

  describe('section markers', () => {
    test('should identify section markers in brackets', () => {
      const lyrics = '[VERSE]\nLine one\n[CHORUS]\nLine two';
      
      const result = parseLyrics(lyrics);
      
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ text: '[VERSE]', lineNumber: 1, isSection: true });
      expect(result[1]).toEqual({ text: 'Line one', lineNumber: 2, isSection: false });
      expect(result[2]).toEqual({ text: '[CHORUS]', lineNumber: 3, isSection: true });
      expect(result[3]).toEqual({ text: 'Line two', lineNumber: 4, isSection: false });
    });

    test('should handle various section marker formats', () => {
      const lyrics = '[VERSE 1]\n[CHORUS]\n[BRIDGE]\n[OUTRO]';
      
      const result = parseLyrics(lyrics);
      
      expect(result[0].isSection).toBe(true);
      expect(result[1].isSection).toBe(true);
      expect(result[2].isSection).toBe(true);
      expect(result[3].isSection).toBe(true);
    });

    test('should not treat partial brackets as section markers', () => {
      const lyrics = 'Some text [with brackets] in it\n[ACTUAL SECTION]';
      
      const result = parseLyrics(lyrics);
      
      expect(result[0].isSection).toBe(false);
      expect(result[1].isSection).toBe(true);
    });
  });

  describe('line numbering', () => {
    test('should assign sequential line numbers', () => {
      const lyrics = 'Line one\nLine two\nLine three\nLine four';
      
      const result = parseLyrics(lyrics);
      
      expect(result[0].lineNumber).toBe(1);
      expect(result[1].lineNumber).toBe(2);
      expect(result[2].lineNumber).toBe(3);
      expect(result[3].lineNumber).toBe(4);
    });

    test('should maintain line numbers when empty lines are filtered', () => {
      const lyrics = 'Line one\n\n\nLine two\n\nLine three';
      
      const result = parseLyrics(lyrics);
      
      // Line numbers should be sequential for non-empty lines
      expect(result[0].lineNumber).toBe(1);
      expect(result[1].lineNumber).toBe(2);
      expect(result[2].lineNumber).toBe(3);
    });
  });
});
