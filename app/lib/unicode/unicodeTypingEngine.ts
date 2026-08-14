/**
 * Typing engine for the Unicode Nepali keyboard layout.
 *
 * IMPORTANT ARCHITECTURE
 * ======================
 *
 * This engine does NOT assume:
 *
 *   Unicode character -> one physical key
 *
 * Instead it works with:
 *
 *   visible Unicode grapheme
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
 *       { physicalKey: "k", shift: false, alt: false },
 *       { physicalKey: "o", shift: false, alt: false }
 *     ]
 *   }
 *
 * The exact physical strokes come from:
 *
 *   UnicodeKeyboardLayout.ts
 *
 * merged with the row-level `nepali` / `nepaliShift`
 * legends, through the single shared source of truth:
 *
 *   unicodeKeymap.ts (SORTED_GRAPHEME_TOKENS)
 *
 * IMPORTANT:
 *
 * This engine intentionally does NOT rebuild its own
 * token list from `unicodeGraphemeStrokes` alone. Doing
 * so was the root cause of the two engines drifting apart
 * (see §2.4 of the audit) — any character defined only on
 * the keyboard row data (not in the explicit strokes list)
 * would silently be invisible to this engine.
 *
 * Architecture:
 *
 *   UnicodeKeyboardLayout.ts
 *          ↓
 *   unicodeKeymap.ts
 *          ↓
 *   unicodeTypingEngine.ts
 *          ↓
 *   useUnicodeTyping.ts
 *          ↓
 *   UnicodeKeyboard.tsx
 *
 * There is no phonetic transliteration.
 */

// ============================================================
// IMPORTS
// ============================================================

import {
  SORTED_GRAPHEME_TOKENS,
  type UnicodeGraphemeToken,
  type PhysicalKeyStroke,
} from "@/app/lib/unicode/unicodeKeymap";

// ============================================================
// TYPES
// ============================================================

/**
 * A single physical keyboard stroke.
 *
 * Example:
 *
 * {
 *   physicalKey: "k",
 *   shift: false,
 *   alt: false
 * }
 *
 * or:
 *
 * {
 *   physicalKey: "k",
 *   shift: true,
 *   alt: false
 * }
 */
export interface TypingStroke {
  physicalKey: string;
  shift: boolean;
  alt: boolean;
}

/**
 * A visible Unicode grapheme and all physical strokes
 * required to produce it.
 *
 * Example:
 *
 * "को"
 *
 * becomes:
 *
 * {
 *   unicode: "को",
 *   strokes: [
 *     { physicalKey: "k", shift: false, alt: false },
 *     { physicalKey: "o", shift: false, alt: false }
 *   ]
 * }
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
 * Converts a keymap PhysicalKeyStroke into the public
 * typing-engine TypingStroke type.
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
 * "This target cannot currently be typed using
 *  the supplied UnicodeKeyboardLayout."
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
 * Array.from() prevents UTF-16 code-unit indexing
 * problems.
 */
function getCodePoints(
  text: string,
): string[] {
  return Array.from(text);
}

/**
 * Returns the grapheme definitions sorted from longest
 * Unicode token to shortest.
 *
 * This is important because the layout contains both:
 *
 *   क
 *
 * and:
 *
 *   को
 *
 * Therefore "को" must be checked before "क".
 *
 * The same applies to:
 *
 *   क्ष
 *   त्र
 *   ज्ञ
 *   श्र
 *   त्त
 *   द्ध
 *
 * The longest-first ordering, and the merge of row-level
 * legends with explicit multi-stroke definitions, both
 * happen once in unicodeKeymap.ts so this engine and the
 * Preeti engine share identical behavior (§2.4).
 */

// ============================================================
// ENCODE ONE GRAPHEME
// ============================================================

/**
 * Converts a visible Unicode grapheme into its physical
 * keyboard stroke sequence.
 *
 * The mapping comes entirely from:
 *
 *   UnicodeKeyboardLayout.ts
 *
 * No Unicode keyboard mapping is hardcoded here.
 */
export function encodeGrapheme(
  grapheme: string,
): TypingGrapheme | undefined {
  const normalizedGrapheme =
    grapheme.normalize("NFC");

  const match =
    SORTED_GRAPHEME_TOKENS.find(
      (token: UnicodeGraphemeToken) =>
        token.unicode === normalizedGrapheme,
    );

  if (!match) {
    return undefined;
  }

  return {
    unicode: match.unicode,
    strokes: match.strokes.map(
      normalizeStroke,
    ),
  };
}

// ============================================================
// ENCODE SENTENCE
// ============================================================

/**
 * Converts a visible Unicode Nepali sentence into
 * an ordered sequence of visible graphemes and
 * physical strokes.
 *
 * Example:
 *
 *   "को"
 *
 * becomes:
 *
 * [
 *   {
 *     unicode: "को",
 *     strokes: [
 *       { physicalKey: "k", shift: false, alt: false },
 *       { physicalKey: "o", shift: false, alt: false }
 *     ]
 *   }
 * ]
 *
 * IMPORTANT:
 *
 * Longest-match-first is used.
 *
 * For example, the layout contains:
 *
 *   क
 *   का
 *   कि
 *   की
 *   कु
 *   कू
 *   कृ
 *   के
 *   कै
 *   को
 *   कौ
 *   कं
 *   कः
 *   कँ
 *
 * Therefore:
 *
 *   "को"
 *
 * is matched as one visible token instead of:
 *
 *   "क" + "ो"
 */
export function encodeSentenceToTypingSequence(
  sentence: string,
): TypingSequence {
  const sequence: TypingSequence = [];

  /**
   * Normalize Unicode first.
   */
  const normalizedSentence =
    sentence.normalize("NFC");

  const codePoints =
    getCodePoints(normalizedSentence);

  let position = 0;

  while (
    position < codePoints.length
  ) {
    /**
     * Reconstruct the remaining sentence.
     */
    const remainingText =
      codePoints
        .slice(position)
        .join("");

    /**
     * Find the longest matching Unicode token.
     *
     * SORTED_GRAPHEME_STROKES is longest-first.
     */
    const match =
      SORTED_GRAPHEME_TOKENS.find(
        (token: UnicodeGraphemeToken) =>
          remainingText.startsWith(
            token.unicode,
          ),
      );

    if (match) {
      sequence.push({
        unicode: match.unicode,
        strokes:
          match.strokes.map(
            normalizeStroke,
          ),
      });

      /**
       * Advance by the number of Unicode
       * code points consumed.
       */
      position += Array.from(
        match.unicode,
      ).length;

      continue;
    }

    /**
     * Nothing in the supplied Unicode keyboard
     * layout can produce this character/sequence.
     *
     * Keep it in the target sequence, but give
     * it zero strokes.
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
 * Keep the name temporarily so the rest of the
 * application can be migrated without breaking
 * immediately.
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
  return typingSequenceToUnicode(
    sequence,
  );
}

// ============================================================
// FLATTEN STROKES
// ============================================================

/**
 * Converts:
 *
 * [
 *   grapheme 1 -> [key1, key2],
 *   grapheme 2 -> [key3],
 *   grapheme 3 -> [key4, key5]
 * ]
 *
 * into:
 *
 * [
 *   key1,
 *   key2,
 *   key3,
 *   key4,
 *   key5
 * ]
 *
 * This is useful when the typing hook works with
 * physical key positions.
 */
export function flattenTypingStrokes(
  sequence: TypingSequence,
): TypingStroke[] {
  return sequence.flatMap(
    (grapheme) =>
      grapheme.strokes,
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
 * [
 *   "k",
 *   "o",
 *   "Space"
 * ]
 *
 * Shift and Alt state are intentionally excluded.
 */
export function getPhysicalKeySequence(
  sequence: TypingSequence,
): string[] {
  return flattenTypingStrokes(
    sequence,
  ).map(
    (stroke) =>
      stroke.physicalKey,
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
  return flattenTypingStrokes(
    sequence,
  );
}

/**
 * Compatibility helper.
 *
 * Returns:
 *
 * {
 *   physicalKey: "...",
 *   shift: true/false
 * }
 *
 * Alt is intentionally omitted from this older
 * return type.
 *
 * For complete Unicode combinations use:
 *
 *   getTypingStrokeSequence()
 */
export function getRomanKeySequence(
  sequence: TypingSequence,
): {
  physicalKey: string;
  shift: boolean;
}[] {
  return flattenTypingStrokes(
    sequence,
  ).map(
    (stroke) => ({
      physicalKey:
        stroke.physicalKey,
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
 * This is different from the number of visible
 * Unicode graphemes.
 *
 * Example:
 *
 *   "को"
 *
 * contains:
 *
 *   1 visible token
 *
 * but:
 *
 *   2 physical strokes
 */
export function getTotalTypingStrokes(
  sequence: TypingSequence,
): number {
  return sequence.reduce(
    (total, grapheme) =>
      total +
      grapheme.strokes.length,
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
 * the current UnicodeKeyboardLayout.
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
 * Returns all visible Unicode graphemes that cannot
 * be produced by the current keyboard layout.
 *
 * A Set is used so duplicate characters are reported
 * only once.
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
    if (
      grapheme.strokes.length === 0
    ) {
      unmapped.add(
        grapheme.unicode,
      );
    }
  }

  return [...unmapped];
}

// ============================================================
// DEBUGGING / TESTING
// ============================================================

/**
 * Produces a human-readable representation of
 * the physical sequence.
 *
 * Useful for debugging the Unicode keyboard mapping.
 *
 * Example:
 *
 * [
 *   {
 *     unicode: "को",
 *     strokes: [
 *       {
 *         physicalKey: "k",
 *         shift: false,
 *         alt: false
 *       },
 *       {
 *         physicalKey: "o",
 *         shift: false,
 *         alt: false
 *       }
 *     ]
 *   }
 * ]
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
  ).map(
    (grapheme) => ({
      unicode:
        grapheme.unicode,

      strokes:
        grapheme.strokes.map(
          (stroke) => ({
            physicalKey:
              stroke.physicalKey,

            shift:
              stroke.shift,

            alt:
              stroke.alt,
          }),
        ),
    }),
  );
}