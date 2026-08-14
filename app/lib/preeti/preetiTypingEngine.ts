/**
 * Typing engine for the Preeti / Nepali keyboard layout.
 *
 * IMPORTANT ARCHITECTURE
 * ======================
 *
 * The typing engine does NOT assume:
 *
 *   Unicode character -> one physical key
 *
 * Instead it works with:
 *
 *   visible Nepali grapheme
 *          ->
 *   ordered physical key sequence
 *
 * Example:
 *
 *   "को"
 *      ↓
 *   {
 *     unicode: "को",
 *     strokes: [
 *       { physicalKey: "...", shift: false, alt: false },
 *       { physicalKey: "...", shift: false, alt: false }
 *     ]
 *   }
 *
 * The exact physical strokes MUST come from:
 *
 *   KeyboardLayout.tsx
 *
 * through:
 *
 *   nepaliKeymap.ts
 *
 * This file never guesses a Preeti mapping.
 *
 * Architecture:
 *
 *   KeyboardLayout.tsx
 *          ↓
 *   nepaliKeymap.ts
 *          ↓
 *   nepaliTypingEngine.ts
 *          ↓
 *   useNepaliTyping.ts
 *
 * There is no phonetic transliteration.
 */

// ============================================================
// IMPORTS
// ============================================================

import {
  SORTED_GRAPHEME_TOKENS,
  type NepaliGraphemeToken,
  type PhysicalKeyStroke,
} from "./preetiKeymap";

// ============================================================
// TYPES
// ============================================================

/**
 * A single physical keyboard stroke.
 *
 * Example:
 *
 *   {
 *     physicalKey: "a",
 *     shift: false,
 *     alt: false
 *   }
 *
 * or:
 *
 *   {
 *     physicalKey: "l",
 *     shift: true,
 *     alt: false
 *   }
 */
export interface TypingStroke {
  physicalKey: string;
  shift: boolean;
  alt: boolean;
}

/**
 * A visible Nepali grapheme and all physical strokes
 * required to produce it.
 *
 * Example conceptually:
 *
 *   "को"
 *
 * becomes:
 *
 *   {
 *     unicode: "को",
 *     strokes: [
 *       key 1,
 *       key 2,
 *       key 3
 *     ]
 *   }
 */
export interface TypingGrapheme {
  unicode: string;
  strokes: TypingStroke[];
}

/**
 * Complete encoded sentence.
 *
 * This is intentionally different from the visible
 * Unicode sentence.
 */
export type TypingSequence = TypingGrapheme[];

// ============================================================
// HELPERS
// ============================================================

/**
 * Converts a keymap stroke into the public typing-engine
 * stroke type.
 */
function normalizeStroke(
  stroke: PhysicalKeyStroke,
): TypingStroke {
  return {
    physicalKey: stroke.physicalKey,
    shift: stroke.shift ?? false,
    alt: stroke.alt ?? false,
  };
}

/**
 * Creates a grapheme token for a Unicode sequence that
 * does not have a physical representation in the supplied
 * keyboard layout.
 *
 * IMPORTANT:
 *
 * We do NOT auto-complete these characters.
 *
 * An empty stroke array means:
 *
 *   "This target cannot currently be typed using
 *    the supplied KeyboardLayout."
 */
function createUnmappedGrapheme(
  unicode: string,
): TypingGrapheme {
  return {
    unicode,
    strokes: [],
  };
}

/**
 * Returns Unicode code points.
 *
 * Using Array.from() prevents UTF-16 code-unit indexing
 * problems.
 */
function getCodePoints(text: string): string[] {
  return Array.from(text);
}

// ============================================================
// ENCODE ONE GRAPHEME
// ============================================================

/**
 * Converts a visible Unicode grapheme into its physical
 * keyboard stroke sequence.
 *
 * The mapping comes entirely from nepaliKeymap.ts.
 *
 * No Preeti mapping is hardcoded here.
 */
export function encodeGrapheme(
  grapheme: string,
): TypingGrapheme | undefined {
  const match = SORTED_GRAPHEME_TOKENS.find(
    (token) => token.unicode === grapheme,
  );

  if (!match) {
    return undefined;
  }

  return {
    unicode: match.unicode,
    strokes: match.strokes.map(normalizeStroke),
  };
}

// ============================================================
// ENCODE SENTENCE
// ============================================================

/**
 * Converts a visible Devanagari sentence into an ordered
 * sequence of visible graphemes and physical strokes.
 *
 * Example:
 *
 *   "को"
 *
 * becomes conceptually:
 *
 *   [
 *     {
 *       unicode: "को",
 *       strokes: [
 *         { physicalKey: "...", shift: false, alt: false },
 *         { physicalKey: "...", shift: false, alt: false }
 *       ]
 *     }
 *   ]
 *
 * The exact physical keys are determined exclusively by
 * KeyboardLayout.tsx.
 *
 * IMPORTANT:
 *
 * Longest-match-first is used so a mapping such as:
 *
 *   "क्ष"
 *
 * can be treated as one visible grapheme if the supplied
 * keyboard layout defines it that way.
 */
export function encodeSentenceToTypingSequence(
  sentence: string,
): TypingSequence {
  const sequence: TypingSequence = [];

  /**
   * Normalize Unicode first.
   *
   * This avoids treating canonically equivalent strings
   * as different targets where possible.
   */
  const normalizedSentence =
    sentence.normalize("NFC");

  const codePoints =
    getCodePoints(normalizedSentence);

  let position = 0;

  while (position < codePoints.length) {
    /**
     * Reconstruct the remaining sentence so the
     * longest-token matcher can inspect it.
     */
    const remainingText =
      codePoints
        .slice(position)
        .join("");

    /**
     * SORTED_GRAPHEME_TOKENS is longest-first.
     *
     * Therefore a multi-character mapping is checked
     * before its shorter components.
     */
    const match =
      SORTED_GRAPHEME_TOKENS.find(
        (token) =>
          remainingText.startsWith(
            token.unicode,
          ),
      );

    if (match) {
      sequence.push({
        unicode: match.unicode,
        strokes: match.strokes.map(
          normalizeStroke,
        ),
      });

      /**
       * Advance by Unicode code points consumed
       * by this grapheme.
       */
      position += Array.from(
        match.unicode,
      ).length;

      continue;
    }

    /**
     * Nothing in the supplied keyboard layout can
     * produce this visible character/sequence.
     *
     * Keep it in the target sequence, but give it
     * zero strokes.
     *
     * This is intentionally NOT automatically completed.
     */
    const currentCharacter =
      codePoints[position];

    sequence.push(
      createUnmappedGrapheme(
        currentCharacter,
      ),
    );

    position += 1;
  }

  return sequence;
}

// ============================================================
// BACKWARD-COMPATIBLE NAME
// ============================================================

/**
 * Compatibility wrapper.
 *
 * Older code may already import:
 *
 *   encodeSentenceToRomanKeys()
 *
 * Keep the name temporarily so the rest of the application
 * can be migrated without breaking immediately.
 *
 * The returned structure is now stroke-based.
 */
export function encodeSentenceToRomanKeys(
  sentence: string,
): TypingSequence {
  return encodeSentenceToTypingSequence(
    sentence,
  );
}

// ============================================================
// VISIBLE UNICODE
// ============================================================

/**
 * Converts a typing sequence back into the visible
 * Unicode sentence.
 *
 * This does NOT simulate the physical keyboard.
 *
 * It simply reconstructs the target text from the
 * grapheme tokens.
 */
export function typingSequenceToUnicode(
  sequence: TypingSequence,
): string {
  return sequence
    .map((token) => token.unicode)
    .join("");
}

/**
 * Backward-compatible name.
 */
export function romanKeysToUnicode(
  sequence: TypingSequence,
): string {
  return typingSequenceToUnicode(sequence);
}

// ============================================================
// FLATTEN STROKES
// ============================================================

/**
 * Converts:
 *
 *   [
 *     grapheme 1 -> [key1, key2],
 *     grapheme 2 -> [key3],
 *     grapheme 3 -> [key4, key5]
 *   ]
 *
 * into:
 *
 *   [
 *     key1,
 *     key2,
 *     key3,
 *     key4,
 *     key5
 *   ]
 *
 * This is useful for the typing engine when it wants
 * the complete physical-key sequence.
 */
export function flattenTypingStrokes(
  sequence: TypingSequence,
): TypingStroke[] {
  return sequence.flatMap(
    (grapheme) => grapheme.strokes,
  );
}

// ============================================================
// PHYSICAL KEY SEQUENCE
// ============================================================

/**
 * Returns only physical key names.
 *
 * Example:
 *
 *   [
 *     "s",
 *     "f",
 *     "Space"
 *   ]
 *
 * Shift and Alt state are intentionally excluded.
 */
export function getPhysicalKeySequence(
  sequence: TypingSequence,
): string[] {
  return flattenTypingStrokes(sequence).map(
    (stroke) => stroke.physicalKey,
  );
}

// ============================================================
// PHYSICAL KEY + MODIFIER SEQUENCE
// ============================================================

/**
 * Returns the complete physical typing sequence,
 * including Shift and Alt requirements.
 */
export function getTypingStrokeSequence(
  sequence: TypingSequence,
): TypingStroke[] {
  return flattenTypingStrokes(sequence);
}

/**
 * Compatibility helper.
 *
 * Returns:
 *
 *   {
 *     physicalKey: "...",
 *     shift: true/false
 *   }
 *
 * Alt is intentionally omitted from this older return type.
 *
 * For complete Preeti combinations use:
 *
 *   getTypingStrokeSequence()
 */
export function getRomanKeySequence(
  sequence: TypingSequence,
): {
  physicalKey: string;
  shift: boolean;
}[] {
  return flattenTypingStrokes(sequence).map(
    (stroke) => ({
      physicalKey: stroke.physicalKey,
      shift: stroke.shift,
    }),
  );
}

// ============================================================
// GET NEXT STROKE
// ============================================================

/**
 * Returns the physical stroke required for a specific
 * grapheme/stroke position.
 *
 * Example:
 *
 *   getExpectedStroke(sequence, 0, 1)
 *
 * means:
 *
 *   second physical stroke of the first grapheme.
 */
export function getExpectedStroke(
  sequence: TypingSequence,
  graphemeIndex: number,
  strokeIndex: number,
): TypingStroke | undefined {
  return sequence[
    graphemeIndex
  ]?.strokes[strokeIndex];
}

// ============================================================
// TOTAL STROKES
// ============================================================

/**
 * Returns the total number of physical key presses
 * required for a sentence.
 *
 * This is different from the number of visible graphemes.
 *
 * Example conceptually:
 *
 *   "को"
 *
 * might contain:
 *
 *   1 visible grapheme
 *
 * but:
 *
 *   3 physical strokes
 *
 * depending entirely on KeyboardLayout.tsx.
 */
export function getTotalTypingStrokes(
  sequence: TypingSequence,
): number {
  return sequence.reduce(
    (total, grapheme) =>
      total + grapheme.strokes.length,
    0,
  );
}

// ============================================================
// VALIDATION
// ============================================================

/**
 * Returns true only when every visible grapheme has
 * at least one physical keyboard stroke.
 *
 * This means the sentence can actually be typed using
 * the current KeyboardLayout.
 */
export function isSentenceFullyMapped(
  sentence: string,
): boolean {
  const sequence =
    encodeSentenceToTypingSequence(
      sentence,
    );

  return sequence.every(
    (grapheme) =>
      grapheme.strokes.length > 0,
  );
}

// ============================================================
// UNMAPPED GRAPHEMES
// ============================================================

/**
 * Returns all visible graphemes that cannot be produced
 * by the current keyboard layout.
 *
 * A Set is used so duplicate characters are reported once.
 */
export function getUnmappedCharacters(
  sentence: string,
): string[] {
  const sequence =
    encodeSentenceToTypingSequence(
      sentence,
    );

  const unmapped =
    new Set<string>();

  for (const grapheme of sequence) {
    if (grapheme.strokes.length === 0) {
      unmapped.add(grapheme.unicode);
    }
  }

  return [...unmapped];
}

// ============================================================
// DEBUGGING / TESTING
// ============================================================

/**
 * Produces a human-readable representation of the
 * physical sequence.
 *
 * Useful for debugging the Preeti keyboard mapping.
 *
 * Example:
 *
 *   [
 *     {
 *       unicode: "को",
 *       strokes: [
 *         "s",
 *         "f"
 *       ]
 *     }
 *   ]
 */
export function debugTypingSequence(
  sentence: string,
): {
  unicode: string;
  strokes: {
    physicalKey: string;
    shift: boolean;
    alt: boolean;
  }[];
}[] {
  return encodeSentenceToTypingSequence(
    sentence,
  ).map((grapheme) => ({
    unicode: grapheme.unicode,
    strokes: grapheme.strokes.map(
      (stroke) => ({
        physicalKey:
          stroke.physicalKey,
        shift: stroke.shift,
        alt: stroke.alt,
      }),
    ),
  }));
}